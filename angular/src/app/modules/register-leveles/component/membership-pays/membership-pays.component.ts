import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { AlertsApiService } from 'src/app/generals-services/alerts-api.service';
import { ServicesService } from '../../services/services.service';
import { AppStateService } from '../../../../stateManagement/appState.service';

@Component({
  selector: 'app-membership-pays',
  templateUrl: './membership-pays.component.html',
  styleUrls: ['./membership-pays.component.scss'],
})
export class MembershipPaysComponent implements OnInit, OnDestroy {
  public loading: boolean = true;
  public datos: any = [];
  public code: any = '';
  public id: any = '';
  public max_licenses: any = '';
  public min_licenses: any = '';
  public price: any = '';
  public priceOne: any = '';
  public name: any = '';
  public subpackage_id: any = '';
  public posicion: any = 1;
  public type: any = '';
  public typePackage: any = '';
  public title: any = '';
  public total: any = '';
  public icon: any = '';
  public language: string;
  tax: number = 0;
  paymentDialog: boolean = false;
  private userInfo: any;
  private subs = new Subscription();

  constructor(
    public http: ServicesService,
    private translate: TranslateService,
    public appStateService: AppStateService,
    public msg: AlertsApiService
  ) {}

  ngOnInit(): void {
    this.language = localStorage.getItem('languaje') as string;
    this.icon = localStorage.getItem('icon');
    this.title = localStorage.getItem('name');
    this.type = localStorage.getItem('typ');
    this.typePackage = localStorage.getItem('type');
    const tem: any = localStorage.getItem('plan');
    this.userInfo = this.appStateService.getUserData();
    this.datos = JSON.parse(tem);
    this.seleccionar();
    this.getTax();
  }

  /**
   * get taxes
   */
  getTax(): void {
    const taxes = this.appStateService.getTax();
    const taxValue = Number(taxes?.value);
    this.tax = taxValue || 0;
    this.total = (this.price * (this.tax / 100) + this.price).toFixed(2);
  }

  seleccionar(post: any = 0) {
    if (this.posicion + post >= 1) {
      this.posicion = this.posicion + post;
      for (const i in this.datos) {
        if (
          Number(this.datos[i].max_licenses) >= this.posicion &&
          Number(this.datos[i].min_licenses) <= this.posicion
        ) {
          this.name = this.datos[i].name;
          localStorage.setItem('idsus', this.datos[i].id);
          if (localStorage.getItem('typ') === 'year') {
            this.priceOne = this.datos[i].year;
            this.price = this.datos[i].year * this.posicion;
            this.total = (this.price * (this.tax / 100) + this.price).toFixed(
              2
            );
          } else if (localStorage.getItem('typ') === 'month') {
            this.priceOne = this.datos[i].month;
            this.price = this.datos[i].month * this.posicion;
            this.total = (this.price * (this.tax / 100) + this.price).toFixed(
              2
            );
          } else {
            //this.ruta.navigateByUrl('register/register-pays')
          }
        }
      }
    }
  }

  handleLanguage(value: any) {
    localStorage.setItem('languaje', value.target.value);
    this.translate.setDefaultLang(value.target.value);
    this.language = value.target.value;
  }

  ngOnDestroy(): void {
    if (this.subs) {
      this.subs.unsubscribe();
    }
  }
}
