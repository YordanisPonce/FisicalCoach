import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AlertsApiService } from 'src/app/generals-services/alerts-api.service';
import { UsersService } from 'src/app/_services/users.service';
import { ProfieService } from '../../profile-services/profie.service';
import { AppStateService } from '../../../../stateManagement/appState.service';
import {
  PackageAttribute,
  User,
  UserSubscription,
} from '../../../../_models/user';
import { Package, SubPackage } from '../../../../_models/package';
import { Location } from '@angular/common';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-update-subscripcion',
  templateUrl: './update-subscripcion.component.html',
  styleUrls: ['./update-subscripcion.component.scss'],
})
export class UpdateSubscripcionComponent implements OnInit, OnDestroy {
  public subscription: UserSubscription;
  public subpackages!: SubPackage[] | undefined;
  public selectedSubpackage: string;
  public defaultSubpackage: string | undefined;
  public role: string | undefined;
  public openConfirmDialog: boolean = false;
  public subscription$: Subscription;
  time: boolean = false;
  type: any = 'year';
  selectedRole: string;
  datePlan: string;
  showAlert: boolean = false;
  newSubscription!: SubPackage;
  selectedPackage: any;
  viewDetailSubpackage: boolean = false;
  displayModalUpdate: boolean = false;
  loadingPackages: boolean = false;
  resources: string = environment.images + 'images/icons/';
  icons: any = {
    teacher_bronze: 'teacher_bronze.svg',
    teacher_silver: 'teacher_silver.svg',
    teacher_gold: 'teacher_gold.svg',
    sport_bronze: 'sport_bronze.svg',
    sport_silver: 'sport_silver.svg',
    sport_gold: 'sport_gold.svg',
  };
  loadingUpdate: boolean = false;
  user: User;
  currentPackage: any;
  isAnotherInterval: string;
  interval: string;
  showDowngradePlanDialog: boolean = false;
  selectedAttributes: PackageAttribute[] = [];

  constructor(
    private http: ProfieService,
    private userService: UsersService,
    private route: ActivatedRoute,
    private location: Location,
    private appStateService: AppStateService,
    private msg: AlertsApiService
  ) {}

  ngOnInit(): void {
    this.selectedRole = this.route.snapshot.paramMap.get('role') as string;
    this.getUserData();
    this.getSubPackages();
  }

  /**
   *
   * @param
   */
  selectSubpackage(subpackage: SubPackage) {
    this.showAlert = true;
    this.newSubscription = subpackage;
  }

  /**
   * cancel selection
   */
  cancel(): void {
    this.newSubscription = {};
    this.showAlert = false;
    this.showDowngradePlanDialog = false;
    this.displayModalUpdate = false;
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

  /**
   * select subpackage
   * @param code
   */
  select(code: any) {
    this.selectedSubpackage = code;
    this.openConfirmDialog = true;
  }

  /**
   * update package
   */
  updateSubscriptionPackage(subpackage: SubPackage): void {
    const currentPackage = this.subscription.package_price?.subpackage?.code;
    const selectedPackage = subpackage.code;

    const status = this.handlePlanUpdate(
      currentPackage as string,
      selectedPackage as string,
      this.subscription.package_code as string
    );

    if (status === 'upgrade') {
      this.displayModalUpdate = true;
    } else {
      this.selectedAttributes = subpackage.attributes as PackageAttribute[];

      this.showDowngradePlanDialog = true;
    }
  }

  /**
   * handle sport packages to upgrade or downgrade
   */
  private handlePlanUpdate(
    current: string,
    selected: string,
    role: string
  ): string {
    if (
      (current === `${role}_bronze` && selected === `${role}_silver`) ||
      (current === `${role}_silver` && selected === `${role}_gold`) ||
      (current === `${role}_bronze` && selected === `${role}_gold`)
    ) {
      return 'upgrade';
    }

    return 'donwgrade';
  }

  back() {
    this.location.back();
  }

  ngOnDestroy(): void {
    if (this.subscription$) {
      this.subscription$.unsubscribe();
    }
  }

  viewDetail(event: any) {
    this.selectedPackage = event;
    this.viewDetailSubpackage = true;
  }

  monthValue(subpackage: SubPackage) {
    if (subpackage.prices) {
      this.interval = 'month';
      return subpackage?.prices[0]?.month;
    } else {
      return '';
    }
  }

  yearValue(subpackage: SubPackage) {
    if (subpackage.prices) {
      this.interval = 'year';
      return subpackage?.prices[0]?.year;
    } else {
      return '';
    }
  }

  getIcons(code: any) {
    return this.resources + this.icons[code];
  }

  /**
   * get subpackages by club or professor role
   */
  private getSubPackages(): void {
    this.loadingPackages = true;
    this.http.getPackeges().subscribe((res: any) => {
      this.loadingPackages = false;
      let packages: Package[] = [];
      packages = res.data;

      console.log(res.data);

      const selectedPackage = packages.find(
        (pack: Package) => pack.code === this.selectedRole
      );

      this.subpackages = selectedPackage?.subpackages;

      this.subpackages = this.subpackages?.map((item) => ({
        ...item,
        prices: item.prices?.filter(
          (price) =>
            price.max_licenses &&
            price.max_licenses >= this.subscription.quantity &&
            price.min_licenses &&
            price.min_licenses <= this.subscription.quantity
        ),
      }));

      console.log(this.subpackages);

      if (this.subpackages) {
        this.defaultSubpackage = this.subpackages.find(
          (sub) =>
            sub.code === this.subscription?.package_price?.subpackage?.code
        )?.code;
      }
    });
  }

  private getUserData() {
    const userData = this.appStateService.getUserData();

    this.subscription = userData.subscriptions.find(
      (x: any) => x?.package_code === this.selectedRole
    );

    this.role = this.subscription.package_code;

    this.user = JSON.parse(localStorage.getItem('user') as string) as User;
    this.currentPackage = this.user.subscriptions.find(
      (item) => item.package_code === this.role
    );
  }
}
