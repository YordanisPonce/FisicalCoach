import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ProfieService } from './profile-services/profie.service';
import { environment } from '../../../environments/environment';
import { MenuItem } from 'primeng/api';
import { Subscription } from 'src/app/_models/subscription';
import { AppStateService } from '../../stateManagement/appState.service';
import { AppStateQuery } from '../../stateManagement/appState.query';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  public idioma: any = '';
  public data: any = [];
  public rutaImagen: string = environment.images;
  activesubscription: any;
  sportSubscription: any;
  teacherSubscription: any;
  role: string;
  showEditDialog: boolean = false;
  public gender: any = [];
  public genderIdentity: any = [];
  public country: any = [];
  public provinces: any = [];
  items!: any[];
  subs: Subscription;
  activeItem: any = null;
  hideProfileButton: boolean = false;

  constructor(
    private translate: TranslateService,
    public http: ProfieService,
    private router: Router,
    private appStateService: AppStateService,
    private appStateQuery: AppStateQuery
  ) {
    this.setTranslate();
  }

  ngOnInit(): void {
    this.loadmenuItems();
    this.http.getProfile().subscribe((data: any) => {
      const userData = data.data;
      this.appStateService.updateUserData(userData);
      let activesubscription: Subscription;
      let subPackage: Subscription;
      this.role = localStorage.getItem('role') as string;
      activesubscription = userData.subscriptions.find(
        (subs: Subscription) => subs?.package_code === this.role
      );
      subPackage = userData.subscriptions.find(
        (subs: Subscription) => subs?.package_code === this.role
      )?.package_price?.subpackage;
      this.sportSubscription = userData.subscriptions.find(
        (subs: any) => subs.package_code === 'sport'
      )?.subpackage_name;
      this.teacherSubscription = userData.subscriptions.find(
        (subs: any) => subs.package_code === 'teacher'
      )?.subpackage_name;
      this.activesubscription = subPackage?.name;
      localStorage.setItem('subs', JSON.stringify(activesubscription));
      this.data = data.data;
      this.callGenders();
      this.callGenerIdentity();
      this.callCountries();
      this.subscriptionUserData();
    });
  }

  /**
   * open dialog
   */
  openEditProfileDialog(): void {
    this.showEditDialog = true;
  }

  /**
   * call provinces
   * @param id
   * @returns null
   */
  callProvinces(id: any = null) {
    for (const i in this.country) {
      if (this.country[i].id === Number(id)) {
        return this.http
          .getProvincias(this.country[i].iso2)
          .subscribe((data: any) => {
            this.provinces = data.data;
          });
      }
    }
  }

  handleTab(tab: any): MenuItem {
    this.hideProfileButton = this.router.url !== '/profile/details';

    return tab;
  }

  getIcon(item: any) {
    if (this.router.url === item.routerLink[0]) {
      return item.iconSelect;
    } else {
      return item.icon;
    }
  }

  private setTranslate() {
    if (localStorage.getItem('languaje')) {
      this.translate.setDefaultLang(`${localStorage.getItem('languaje')}`);
      this.idioma = localStorage.getItem('languaje');
    } else {
      this.translate.setDefaultLang('es');
    }
  }

  private setActiveItem() {
    const url = this.router.url;
    const isValidUrl = this.items.find(
      (x) => x.routerLink[0] === 'profile' || x.routerLink[0] === url
    );

    const temp = isValidUrl;

    this.activeItem = temp;
  }
  private loadmenuItems() {
    this.items = [
      {
        iconSelect: `${this.rutaImagen}images/menu/my_exercises_green.svg`,
        icon: `${this.rutaImagen}images/menu/my_exercises_blue.svg`,
        label: this.translate.instant('profile.my_exercises'),
        routerLink: ['/profile/my-exercises'],
      },
      {
        iconSelect: `${this.rutaImagen}images/menu/user_green.svg`,
        icon: `${this.rutaImagen}images/menu/user_blue.svg`,
        label: this.translate.instant('profile.profile'),
        routerLink: ['/profile/details'],
      },
      {
        iconSelect: `${this.rutaImagen}images/menu/subcription_green.svg`,
        icon: `${this.rutaImagen}images/menu/subcription_blue.svg`,
        label: this.translate.instant('profile.subscription'),
        routerLink: ['/profile/subscriptions'],
      },
      {
        iconSelect: `${this.rutaImagen}images/menu/licenses_green.svg`,
        icon: `${this.rutaImagen}images/menu/licenses_blue.svg`,
        label: this.translate.instant('profile.licences'),
        routerLink: ['/profile/licences'],
      },
      {
        iconSelect: `${this.rutaImagen}images/menu/password_green.svg`,
        icon: `${this.rutaImagen}images/menu/password_blue.svg`,
        label: this.translate.instant('profile.seguridad'),
        routerLink: ['/profile/security'],
      },
      {
        iconSelect: `${this.rutaImagen}images/menu/invoice_green.svg`,
        icon: `${this.rutaImagen}images/menu/invoice_blue.svg`,
        label: this.translate.instant('profile.invoices'),
        routerLink: ['/profile/invoices'],
      },
    ];
    this.setActiveItem();
  }

  /**
   * get countries
   */
  private callCountries(): void {
    this.country = this.appStateService.getCountries();
    this.callProvinces(this.data.country_id);
  }

  /**
   * get genders
   */
  private callGenerIdentity(): void {
    this.genderIdentity = this.appStateService.getGendersIdentity();
  }

  private callGenders(): void {
    this.gender = this.appStateService.getGenders();
  }

  private subscriptionUserData() {
    this.appStateQuery.userData$.subscribe((res) => {
      this.data = res;
    });
  }
}
