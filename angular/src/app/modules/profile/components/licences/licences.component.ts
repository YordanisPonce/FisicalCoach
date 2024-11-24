import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { AlertsApiService } from 'src/app/generals-services/alerts-api.service';
import { Licence, Package, User, UserSubscription } from 'src/app/_models/user';
import { UsersService } from 'src/app/_services/users.service';
import { AppStateService } from 'src/app/stateManagement/appState.service';
import { ITeam } from 'src/app/_models/ITeam.interface';
import { debounceTime, takeUntil } from 'rxjs/operators';

interface OrderStatus {
  [propName: string]: number;
}

@Component({
  selector: 'app-licences',
  templateUrl: './licences.component.html',
  styleUrls: ['./licences.component.scss'],
})
export class LicencesComponent implements OnInit, OnDestroy {
  @Input() visible: boolean = false;
  @Output() hide: EventEmitter<boolean> = new EventEmitter<boolean>();

  subs$: Subscription;
  userPackage: Package[] = [];
  licences: Licence[] = [];
  licenceList: {
    code: string;
    value: string;
    isValid: boolean;
    user: User;
    hideAction: boolean;
  }[] = [];
  role: string = '';
  userData: User;
  activesubscription: UserSubscription;
  loading: boolean = false;
  loadingInvitation: any[] = [];
  loadingRevoking: any[] = [];
  inputError: boolean = false;
  showAgain: boolean = false;
  licenceStatus = ['pending', 'active', 'accepted'];
  selectedLicenses: Licence[] = [];
  showAddLicenses: boolean = false;
  numberOfLicenses: number = 0;
  loadingCount: boolean = false;
  showConfirmDialog: boolean = false;
  subpackage: string = '';
  packageNewAmount: string = '0';
  period: string;
  private clickSubject = new Subject();
  private readonly debounceTimeMs = 1000;
  private unsubscribe$ = new Subject();

  orderStatus: OrderStatus = {
    active: 1,
    available: 2,
    pending: 3,
    accepted: 4,
  };

  constructor(
    private appStateService: AppStateService,
    private userService: UsersService,
    private msg: AlertsApiService
  ) {}

  ngOnInit(): void {
    this.role = localStorage.getItem('role') as string;
    this.userData = JSON.parse(localStorage.getItem('user') as string) as User;

    if (this.userData) {
      this.activesubscription = this.getUserInfo(this.userData);
    }

    this.getUserLicences();

    this.clickSubject
      .pipe(debounceTime(this.debounceTimeMs), takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.getPackagePrice();
      });
  }

  /**
   * get user licences
   */
  getUserLicences(): void {
    this.loading = true;

    this.subs$ = this.userService.getUserLicences().subscribe((res) => {
      this.userPackage = res.data.filter(
        (userPackage: any) => userPackage.package_code === this.role
      );

      if (this.userPackage.length > 0) {
        this.licences = this.userPackage[0].licenses.map((licence) => licence);

        this.licenceList = this.licences
          .sort((a, b) => {
            return this.orderStatus[a.status] - this.orderStatus[b.status];
          })
          .map((licence) => ({
            code: licence.code,
            value: '',
            isValid: false,
            user: licence.user || { email: '' },
            hideAction: licence.user?.email === this.userData.email,
          }));
        this.loadingInvitation = this.licences.map((item) => false);
        this.loadingRevoking = this.licences.map((item) => false);
      }
      this.loading = false;
    });
  }

  /**
   * get user information
   * @param userData
   * @returns
   */
  getUserInfo(userData: User): UserSubscription {
    return userData.subscriptions.find(
      (subscription: any) => subscription.package_code === this.role
    );
  }

  inputChange(index: number): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const test = emailRegex.test(this.licenceList[index]?.user?.email);

    this.licenceList[index].isValid = test;
  }

  /**
   * submit invitation
   * @param index
   */
  submitInvitation(index: number): void {
    this.loadingInvitation[index] = true;
    const invitation = {
      code: this.licenceList[index].code,
      email: this.licenceList[index]?.user?.email,
    };
    this.subs$ = this.userService.sendInvitation(invitation).subscribe(
      (res) => {
        this.msg.succes(res.message);
        this.loadingInvitation[index] = false;
        this.getUserLicences();
      },
      ({ error }) => {
        this.msg.error(error);
        this.loadingInvitation[index] = false;
      }
    );
  }

  /**
   * revoke invitation
   * @param index
   */
  revokeInvitation(index: number): void {
    this.loadingRevoking[index] = true;
    const code = this.licenceList[index].code;
    this.subs$ = this.userService.revokeInvitation(code).subscribe(
      (res) => {
        this.msg.succes(res.message);
        this.loadingRevoking[index] = false;
        this.getUserLicences();
      },
      ({ error }) => {
        this.msg.error(error);

        this.loadingRevoking[index] = false;
      }
    );
  }

  /**
   * close dialog
   */
  close(): void {
    localStorage.setItem('licenceDialog', JSON.stringify(!this.showAgain));
    this.hide.emit(false);
  }

  ngOnDestroy(): void {
    if (this.subs$) {
      this.subs$.unsubscribe();
    }

    this.unsubscribe$.next(null);
    this.unsubscribe$.complete();
  }

  /**
   * handle number of licenses
   */
  handleLicensesNumber(type: string = 'add'): void {
    if (type === 'add') {
      this.numberOfLicenses += 1;
    } else {
      this.numberOfLicenses -= 1;
    }

    this.clickSubject.next(null);
  }

  /**
   * get package price after send a number of licenses
   */
  getPackagePrice(): void {
    const getSupackage = this.activesubscription.package_price?.subpackage?.code
      ?.split('_')
      .pop();

    this.userService
      .getLicensePrice(
        this.role,
        getSupackage as string,
        this.numberOfLicenses + this.licences.length,
        this.activesubscription.interval as string
      )
      .subscribe(
        (res) => {
          this.packageNewAmount = res.data.amount;
        },
        ({ error }) => {
          this.msg.error(error);
        }
      );
  }

  /**
   * handle onchange
   */
  handleInputChange(e: number): void {
    if (e < this.licences.length) {
      this.numberOfLicenses = this.licences.length;
    }
  }

  /**
   * send licenses
   */
  submit(action: string): void {
    let data: any;

    if (action === 'increment') {
      data = {
        type: this.role,
        action,
        quantity: this.numberOfLicenses,
        codes: [],
      };
    }

    if (action === 'decrement') {
      data = {
        type: this.role,
        action,
        quantity: this.selectedLicenses.length,
        codes: this.selectedLicenses.map((license) => license.code),
      };
    }

    this.loadingCount = true;

    this.userService.handleLicensesCount(data).subscribe(
      (res) => {
        this.msg.succes(res.message);

        this.getUserLicences();
        this.showAddLicenses = false;
        this.showConfirmDialog = false;
        this.loadingCount = false;
        this.numberOfLicenses = 0;
        this.selectedLicenses = [];
        this.packageNewAmount = '0';
      },
      ({ error }) => {
        this.msg.error(error);
        this.loadingCount = false;
        this.showConfirmDialog = false;
      }
    );
  }

  closeDialog(): void {
    this.hide.emit(false);
  }
}
