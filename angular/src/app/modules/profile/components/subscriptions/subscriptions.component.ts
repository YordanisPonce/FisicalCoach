import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UsersService } from 'src/app/_services/users.service';
import {
  SubPackage,
  Subscription as UserSubscription,
} from 'src/app/_models/subscription';
import { ServicesService } from 'src/app/modules/register-leveles/services/services.service';
import { Router } from '@angular/router';
import { AlertsApiService } from '../../../../generals-services/alerts-api.service';
import { PaymentMethod } from '../../../../_models/paymenMethod.interface';
import HandleErrors from '../../../../utils/errors';
import { environment } from 'src/environments/environment';
import { packageIcons } from 'src/app/utils/package-icons';

@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.scss'],
})
export class SubscriptionsComponent implements OnInit, OnDestroy {
  subs = new Subscription();
  data: any = [];
  subscriptions: UserSubscription[] = [];
  role: string;
  time: boolean = false;
  type: any = 'year';
  datePlan: string;
  availablePackage: UserSubscription;
  allPackage: any[] = [];
  detailSubcription: boolean = false;
  loadingSubcriptions: boolean = false;
  loading: boolean = false;
  showUpdateCardInput: boolean = false;
  invalidError: any;
  cardDetailsFilledOut = false;
  cardCaptureReady: any;
  options: any = {};
  extraData: any;
  selectedPackage: any;
  paymentMethod!: PaymentMethod | null;
  errors: HandleErrors = new HandleErrors(this.alertsApiService);
  deleting: boolean = false;
  cancelando: boolean = false;
  showDialog: boolean = false;
  listPastDue: any[] = [];
  resources: string = environment.images + 'images/icons/';

  public StripeStatus = StripeStatus;

  constructor(
    private userService: UsersService,
    private alertsApiService: AlertsApiService,
    private packageService: ServicesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.role = localStorage.getItem('role') as string;
    this.getSubscriptions();
    // this.getAllSubscriptions();
    this.getPaymentMethod();
    this.setOptions();
  }

  deletePaymentMethod() {
    this.deleting = true;
    this.userService.deletepaymentMethod().subscribe(
      (res) => {
        this.paymentMethod = null;
        this.alertsApiService.succes(res.message);
        this.deleting = false;
        setTimeout(() => {
          this.showUpdateCardInput = true;
          this.loading = false;
        }, 1550);
      },
      ({ error }) => {
        this.errors.handleError(error, '');
        this.deleting = false;
      }
    );
  }

  /**
   * get subscription available
   */
  getSubscriptionAvailable(role: string): void {
    const availableRole = role === 'sport' ? 'teacher' : 'sport';
    this.subs = this.packageService.getPackeges().subscribe((res: any) => {
      this.availablePackage = res.data.find(
        (item: SubPackage) => item.code === availableRole
      );
    });
  }

  /**
   * change date plan
   */
  check() {
    if (this.type === 'year') {
      this.datePlan = 'annual_subscription';
    } else {
      this.datePlan = 'monthly_subscription';
    }
  }

  getIcons(item: any) {
    return item.package_price
      ? this.resources + packageIcons[item.package_price.subpackage.code]
      : '/assets/img/icons/crown.svg';
  }

  addPaymentMethod() {
    this.showUpdateCardInput = true;
    this.loading = false;
  }

  goToSubPackage(item: any) {
    this.router.navigateByUrl('profile/new-subscription-process', {
      state: {
        interval_type: this.type,
        subscriptionData: item,
      },
    }); 
    localStorage.setItem('item', JSON.stringify(item));
  }

  viewDetail(event: any) {
    this.packageService
      .getSubpackage(event.package_price.subpackage_id)
      .subscribe((res: any) => {
        if (res.success) {
          this.selectedPackage = res.data;
          this.detailSubcription = true;
        }
      });
  }

  cancelSubscription(event: any) {
    this.cancelando = true;
    this.packageService
      .cancelSubscription({ type: event.package_code })
      .subscribe(
        (res: any) => {
          this.cancelando = false;
          window.location.replace('/profile/subscriptions');
        },
        ({ error }) => {
          this.cancelando = false;
          this.alertsApiService.error(error.message);
        }
      );
  }

  ngOnDestroy(): void {
    if (this.subs) {
      this.subs.unsubscribe();
    }
  }

  monthValue(availablePackage: UserSubscription) {
    if (availablePackage.subpackages) {
      if (availablePackage.subpackages[0].prices) {
        return availablePackage.subpackages[0].prices[0]?.month;
      } else {
        return '';
      }
    } else {
      return '';
    }
  }

  yearValue(availablePackage: UserSubscription) {
    if (availablePackage.subpackages) {
      if (availablePackage.subpackages[0].prices) {
        return availablePackage.subpackages[0].prices[0]?.year;
      } else {
        return '';
      }
    } else {
      return '';
    }
  }

  onStripeInvalid(error: any) {
    console.log('Validation Error', error);
  }

  onStripeError(error: any) {
    console.error('Stripe error', error);
  }

  setPaymentMethod(token: stripe.paymentMethod.PaymentMethod) {
    this.loading = true;
    if (token.id) {
      this.registerPaymentMethod(token.id);
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

  registerPaymentMethod(token: string) {
    this.userService.saveUsersPaymentMethod(token).subscribe(
      (res) => {
        if (this.listPastDue.length > 0) {
          this.userService
            .confirmPaymentMethod()
            .subscribe((confirmResponse) => {
              this.alertsApiService.succes(res.message);
              this.getPaymentMethod();
              this.showUpdateCardInput = false;
            });
        } else {
          this.alertsApiService.succes(res.message);
          this.getPaymentMethod();
          this.showUpdateCardInput = false;
        }
      },
      ({ error }) => {
        this.errors.handleError(error, '');
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

  /**
   * get user subscriptions
   */
  private getSubscriptions(): void {
    this.loadingSubcriptions = true;
    this.subs = this.userService.getUserSubscriptions().subscribe((res) => {
      const { data } = res;

      this.subscriptions = data;

      this.validateStatus();
      if (data.length === 1) {
        this.getSubscriptionAvailable(this.subscriptions[0].package_code);
      }
      this.loadingSubcriptions = false;
    });
  }

  private validateStatus() {
    this.listPastDue = [];
    this.subscriptions.forEach((item: any) => {
      if (item.stripe_status === StripeStatus.PASTDUE) {
        this.listPastDue.push(item);
      }
    });
    setTimeout(() => {
      if (this.listPastDue.length > 0) {
        this.showDialog = true;
      }
    }, 500);
  }

  private getAllSubscriptions(): void {
    this.packageService.getPackeges().subscribe((res: any) => {
      this.allPackage = res.data;
    });
  }

  private getPaymentMethod() {
    this.userService.getUsersPaymentMethod().subscribe((res) => {
      this.paymentMethod = res.data as PaymentMethod;
      localStorage.setItem('peymentMethod', JSON.stringify(this.paymentMethod));
    });
  }
}

export enum StripeStatus {
  PASTDUE = 'past_due',
  ACTIVE = 'active',
  TRIALING = 'trialing',
}
