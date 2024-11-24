import { Component, OnInit, DoCheck, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertsApiService } from 'src/app/generals-services/alerts-api.service';
import { StripeScriptTag, StripeCard } from 'stripe-angular';
import { ServicesService } from '../../services/services.service';

declare var $: any;

@Component({
  selector: 'app-stripe',
  templateUrl: './stripe.component.html',
  styleUrls: ['./stripe.component.scss'],
})
export class StripeComponent implements OnInit, DoCheck {
  token: any;
  invalidError: any;
  cardCaptureReady: any;
  extraData: any;
  cardDetailsFilledOut = false;
  enviado: any;
  options: any = {};
  planType: { code: string };
  loading: boolean = false;
  @Input() numero: any;

  constructor(
    public msj: AlertsApiService,
    public http: ServicesService,
    public router: Router
  ) {}

  ngOnInit(): void {
    const planSelected =
      JSON.parse(localStorage.getItem('item') as string)?.code || 'sport';
    this.planType = planSelected;
    console.log(planSelected)
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

  ngDoCheck() {}

  onStripeInvalid(error: any) {
    console.log('Validation Error', error);
  }

  onStripeError(error: any) {
    console.error('Stripe error', error);
  }

  setPaymentMethod(token: stripe.paymentMethod.PaymentMethod) {
    this.loading = true;
    this.msj.succes('Procesando pago');
    localStorage.setItem('paytoken', token.id);
    this.enviado = token.id;
    if (token.id) {
      this.send();
    } else {
      this.loading = false;
    }
  }

  setStripeToken(token: stripe.Token) {
    console.log('Stripe Token', token);
  }

  setStripeSource(source: stripe.Source) {
    console.log('Stripe Source', source);
  }

  send() {
    const env = {
      package_price_id: localStorage.getItem('idsus'),
      interval: localStorage.getItem('typ'),
      quantity: this.numero,
      payment_method_token: this.enviado,
      user_id: localStorage.getItem('uvr'),
      type: this.planType,
    };

    this.http.sendSubscripcion(env).subscribe(
      (data: any) => {
        if (data.success === true) {
          $('#exampleModalStripe').modal('hide');
          this.msj.succes(data.message);
          this.router.navigateByUrl('login');
          localStorage.clear();
        }
        this.loading = false;
      },
      ({ error }) => {
        this.msj.error(error);
        this.loading = false;
      }
    );
  }
}
