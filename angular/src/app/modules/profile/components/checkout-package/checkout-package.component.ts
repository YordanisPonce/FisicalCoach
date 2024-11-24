import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SubPackage } from '../../../../_models/package';
import { GeneralService } from '../../../../_services/general.service';
import { AppStateService } from '../../../../stateManagement/appState.service';
import { UsersService } from 'src/app/_services/users.service';
import { PaymentMethod } from 'src/app/_models/paymenMethod.interface';
import { ServicesService } from 'src/app/modules/register-leveles/services/services.service';
import { AlertsApiService } from 'src/app/generals-services/alerts-api.service';

@Component({
  selector: 'app-checkout-package',
  templateUrl: './checkout-package.component.html',
  styleUrls: ['./checkout-package.component.scss'],
})
export class CheckoutPackageComponent implements OnInit {
  @Input() subpackage: SubPackage;
  @Input() intervalType: string = '';
  @Input() currentSubscription: any;
  priceOne: any;
  title: any;
  name: any;
  price: any;
  currentPrice: any;
  tax: any;
  total: any;
  posicion: number = 1;
  packageId: any;
  userInfo: any;
  loading: boolean = false;
  role: string;
  showUpdateCardInput: boolean = false;
  invalidError: any;
  options: any = {};
  extraData: any;
  cardDetailsFilledOut = false;
  listPastDue: any[] = [];
  cardCaptureReady: any;
  paymentMethod!: PaymentMethod | null;
  loadingPaymentMethod: boolean = false;
  @Input() display: boolean = false;
  @Output() displayChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private generalService: GeneralService,
    private appStateService: AppStateService,
    private userService: UsersService,
    public http: ServicesService,
    private msg: AlertsApiService
  ) {}

  ngOnInit(): void {
    this.role = localStorage.getItem('role') as string;
    this.userInfo = JSON.parse(localStorage.getItem('user') as string);
    this.getLicences();

    this.getTax();
    this.getPaymentMethod();
    this.setOptions();
  }

  selectPlan(value: number) {
    if (this.posicion === 1 && value === -1) {
      return;
    }
    this.posicion += value;
    this.getLicences();
    this.getTax();
  }

  closeModal() {
    this.display = false;
    this.displayChange.emit(this.display);
  }

  private getTax(): void {
    const taxes = this.appStateService.getTax();
    const taxValue = Number(taxes.value);
    this.tax = taxValue || 0;
    this.total = (this.price * (this.tax / 100) + this.price).toFixed(2);
  }

  private getLicences() {
    const licences = this.subpackage.prices?.filter(
      (x) =>
        x.max_licenses &&
        x.max_licenses >= this.currentSubscription.quantity &&
        x.min_licenses &&
        x.min_licenses <= this.currentSubscription.quantity
    );
    if (licences && licences.length > 0) {
      this.name = licences[0].name;

      this.packageId = licences[0].id;
      if (this.intervalType === 'year') {
        this.priceOne = licences[0].year;
      } else {
        this.priceOne = licences[0].month;
      }
    }
    this.currentPrice = Number(this.priceOne) * this.posicion;
    this.price = Number(this.priceOne) * this.currentSubscription.quantity;

    this.total = (
      this.currentPrice * (this.tax / 100) +
      this.currentPrice
    ).toFixed(2);
  }

  /**
   * handle interval message
   */
  intervalMessage(): string {
    if (
      this.intervalType === 'month' &&
      this.currentSubscription.interval === 'year'
    ) {
      return 'Esta pasando de facturación anual a mensual';
    }
    if (
      this.intervalType === 'year' &&
      this.currentSubscription.interval === 'month'
    ) {
      return 'Esta pasando de facturación mensual a anual';
    }

    return '';
  }

  private getPaymentMethod() {
    this.userService.getUsersPaymentMethod().subscribe((res) => {
      this.paymentMethod = res.data as PaymentMethod;
      localStorage.setItem('peymentMethod', JSON.stringify(this.paymentMethod));
    });
  }

  send() {
    this.loading = true;

    const env = {
      package_price_id: this.packageId,
      interval: this.intervalType,
      type: this.currentSubscription.package_code,
    };

    this.http.updateSubscription(env).subscribe(
      (data: any) => {
        if (data.success === true) {
          this.closeModal;
          this.msg.succes(data.message);
          setTimeout(() => {
            window.location.replace('/profile/subscriptions');
          }, 1000);
          this.loading = false;
        }
      },
      ({ error }) => {
        this.closeModal;
        this.msg.error(error);
        this.loading = false;
      }
    );
  }

  addPaymentMethod() {
    this.showUpdateCardInput = true;
    this.loadingPaymentMethod = false;
  }

  onStripeInvalid(error: any) {
    console.log('Validation Error', error);
  }

  onStripeError(error: any) {
    console.error('Stripe error', error);
  }

  setPaymentMethod(token: stripe.paymentMethod.PaymentMethod) {
    this.loadingPaymentMethod = true;
    if (token.id) {
      this.registerPaymentMethod(token.id);
    } else {
      this.loadingPaymentMethod = false;
    }
  }

  setStripeToken(token: stripe.Token) {
    console.log('Stripe Token', token);
  }

  setStripeSource(source: stripe.Source) {
    console.log('Stripe Source', source);
  }

  registerPaymentMethod(token: string) {
    this.userService.saveUsersPaymentMethod(token).subscribe(
      (res) => {
        if (this.listPastDue.length > 0) {
          this.userService
            .confirmPaymentMethod()
            .subscribe((confirmResponse) => {
              this.msg.succes(res.message);
              this.getPaymentMethod();
              this.showUpdateCardInput = false;
              this.loadingPaymentMethod = false;
            });
        } else {
          this.msg.succes(res.message);
          this.getPaymentMethod();
          this.showUpdateCardInput = false;
          this.loadingPaymentMethod = false;
        }
      },
      ({ error }) => {
        this.msg.error(error);
      }
    );
  }

  private setOptions() {
    this.options = {
      hidePostalCode: true,
      style: {
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
}
