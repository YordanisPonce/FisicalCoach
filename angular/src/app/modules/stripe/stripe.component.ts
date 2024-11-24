import {
  Component,
  OnInit,
  DoCheck,
  Input,
  ViewChild,
  Output,
  EventEmitter,
} from '@angular/core';
import { Router } from '@angular/router';
import { AlertsApiService } from 'src/app/generals-services/alerts-api.service';
import { StripeScriptTag, StripeCard } from 'stripe-angular';
import { ServicesService } from '../register-leveles/services/services.service';

declare var $: any;

@Component({
  selector: 'app-stripe-component',
  templateUrl: './stripe.component.html',
  styleUrls: ['./stripe.component.scss'],
})
export class StripeComponent implements OnInit {
  @Input() packageId: number;
  @Input() intervalType: string;
  @Input() userId: number;
  @Input() numero: any;
  @Output() closeModal: EventEmitter<any> = new EventEmitter<any>();
  role = localStorage.getItem('role') as string;

  token: any;
  invalidError: any;
  cardCaptureReady: any;
  extraData: any;
  cardDetailsFilledOut = false;
  enviado: any;
  options: any = {};
  loading: boolean = false;

  constructor(
    public msj: AlertsApiService,
    public http: ServicesService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.options = {
      hidePostalCode: true,
      style: {
        // width: '70%',
        base: {
          color: '#21219b',
          fontFamily: 'Montserrat, Open Sans, Segoe UI, sans-serif',
          fontSize: '15px',
          fontSmoothing: 'antialiased',

          ':focus': {
            color: '#424770',
          },

          '::placeholder': {
            color: '#9BACC8',
          },

          ':focus::placeholder': {
            color: '#2c3954',
          },
        },
        invalid: {
          color: '#f54242',
          ':focus': {
            color: '#FA755A',
          },
          '::placeholder': {
            color: '#FFCCA5',
          },
        },
      },
      iconStyle: 'solid',
    };
  }

  onStripeInvalid(error: any) {
    console.log('Validation Error', error);
  }

  onStripeError(error: any) {
    console.error('Stripe error', error);
  }

  setPaymentMethod(token: stripe.paymentMethod.PaymentMethod) {
    this.msj.succes('Procesando pago');
    this.enviado = token.id;
    if (token.id) {
      this.send();
    }
  }

  setStripeToken(token: stripe.Token) {
    console.log('Stripe Token', token);
  }

  setStripeSource(source: stripe.Source) {
    console.log('Stripe Source', source);
  }

  send() {
    this.loading = true;

    const env = {
      package_price_id: this.packageId,
      interval: this.intervalType,
      type: this.role,
    };

    this.http.updateSubscription(env).subscribe(
      (data: any) => {
        console.log(data);
        if (data.success === true) {
          $('#exampleModalStripe').modal('hide');
          this.closeModal.emit();
          this.msj.succes(data.message);
          setTimeout(() => {
            window.location.replace('/profile/details');
          }, 1000);
          this.loading = false;
        }
      },
      ({ error }) => {
        this.closeModal.emit();
        this.msj.error(error);
        this.loading = false;
      }
    );
  }
}
