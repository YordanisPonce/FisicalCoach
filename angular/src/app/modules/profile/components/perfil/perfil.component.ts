import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ProfieService } from '../../profile-services/profie.service';
import { AlertsApiService } from '../../../../generals-services/alerts-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AppSettings } from '../../../../../proyect.conf';
import { AppStateService } from '../../../../stateManagement/appState.service';
import { AppStateQuery } from '../../../../stateManagement/appState.query';
import FormUtils from '../../../../utils/formUtils';
import HandleErrors from '../../../../utils/errors';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
})
export class PerfilComponent implements OnInit {
  loading: boolean = false;
  public url: string = 'https://via.placeholder.com/600/24f355';
  public claves: any = [];
  public edit: any = [];
  public data: any = [];
  public dataAux: any = [];
  public gender: any = [];
  public genderIdentity: any = [];
  public country: any = [];
  public provinces: any = [];
  selectedCountry: number;
  selectedProvince: number;
  selectedGender: number | string;
  selectedGenderIdentity: number | string;
  urlImages = AppSettings.images + 'images/menu/';
  public iconos: any = {
    full_name: 'user.svg',
    email: 'email.svg',
    gender: 'gender.svg',
    gender_identity_id: 'gender_identity.svg',
    dni: 'dni.svg',
    username: 'username.svg',
    address: 'location.svg',
    country_id: 'country.svg',
    province_id: 'id_fiscal.svg',
    zipcode: 'postal_code.svg',
    mobile_phone: 'phone.svg',
    tax: 'vat.svg',
    phone: 'phone.svg',
    is_company: 'autonomous_company.svg',
    city: 'city_province.svg',
    company_name: 'business_name.svg',
    company_idnumber: 'id_fiscal.svg',
    company_vat: 'vat.svg',
    company_address: 'location.svg',
    company_city: 'city_province.svg',
    company_zipcode: 'postal_code.svg',
    company_phone: 'phone.svg',
  };
  requiredFields: string[] = [
    'full_name',
    'email',
    'gender',
    'gender_identity_id',
    'country_id',
    'address',
    'dni',
    'zipcode',
    'city',
    'phone',
    'username',
    'province_id',
    'country_id',
  ];
  textFields: string[] = [
    'trial_ends_at',
    'card_last_four',
    'card_brand',
    'stripe_id',
    'image_id',
    'id',
    'email_verified_at',
    'active',
    'provider_google_id',
    'user_type',
    'deleted_at',
    'cover_id',
    'created_at',
    'entity_permissions',
    'updated_at',
    'image',
    'cover',
    'roles',
    'subscriptions',
  ];
  selectFields: string[] = ['mobile_phone', 'city'];
  companyFields: string[] = [
    'company_name',
    'company_idnumber',
    'company_vat',
    'company_address',
    'company_city',
    'company_zipcode',
    'company_phone',
  ];
  dropdownFields: string[] = [
    'country_id',
    'gender',
    'gender_identity_id',
    'province_id',
  ];

  formUtils = new FormUtils();
  errors: HandleErrors = new HandleErrors(this.alerts);

  constructor(
    public http: ProfieService,
    public rute: ActivatedRoute,
    public router: Router,
    private translate: TranslateService,
    public alerts: AlertsApiService,
    private appStateService: AppStateService,
    private appStateQuery: AppStateQuery
  ) {}

  ngOnInit(): void {
    this.getGenderIdentity();
    this.appStateQuery.userData$.subscribe((res) => {
      this.data = { ...res };
      this.dataAux = { ...res };
      delete this.data.cover;
      delete this.data.image;
      this.getData(res);
      this.country = this.appStateService.getCountries();
      this.callProvicias(this.data.country_id);
      this.selectedCountry = this.data.country_id;
      this.selectedProvince = this.data.province_id;
    });
  }

  getGenderIdentity() {
    this.gender = this.appStateService.getGenders();
    this.genderIdentity = this.appStateService.getGendersIdentity();
  }

  callProvicias(id: any, isCountrychange: boolean = false) {
    for (const i in this.country) {
      if (this.country[i].id === id) {
        return this.http
          .getProvincias(this.country[i].iso2)
          .subscribe((data: any) => {
            this.provinces = data.data;
            if (isCountrychange) {
              this.selectedProvince = this.provinces[0].id;
              this.checkprovince(this.selectedProvince as unknown as string);
              this.data['province_id'] = this.provinces[0].id;
            }
          });
      }
    }
  }

  checkgender(id: string) {
    const temp = this.gender.find((x: any) => x.id == id);
    this.selectedGender = id;
    return temp?.code;
  }

  checkgenderindetity(id: string) {
    // tslint:disable-next-line:triple-equals
    const temp = this.genderIdentity.find((x: any) => x.id == id);
    this.selectedGenderIdentity = id;
    return temp?.code;
  }

  checkcountries(id: string) {
    // tslint:disable-next-line:triple-equals
    const coutryTemp = this.country.find((x: any) => x.id == id);
    return coutryTemp?.name;
  }

  checkprovince(id: string) {
    // tslint:disable-next-line:triple-equals
    const temp = this.provinces.find((x: any) => x.id == id);
    return temp?.name;
  }

  texto(clave: string) {
    if (clave === 'tax') {
      return this.data?.tax?.name;
    } else {
      return `profile.${clave}`;
    }
  }

  cambioSelect(event: any, clave: string) {
    for (const i in this.claves) {
      if (clave === this.claves[i]) {
        this.data[clave] = event.value;
      }
    }
    if (clave === 'country_id') {
      this.callProvicias(Number(event.value), true);
    }
  }

  cambioInput(text: any, clave: string) {
    for (const i in this.claves) {
      if (clave === this.claves[i]) {
        if (this.requiredFields.includes(clave)) {
          switch (clave) {
            case 'full_name':
              this.data[clave] = this.validateAlphabetic(text.target.value);
              text.target.value = this.validateAlphabetic(text.target.value);
              break;
            case 'zipcode':
            case 'city':
            case 'phone':
            case 'dni':
              this.data[clave] = this.validateNumeric(text.target.value);
              text.target.value = this.validateNumeric(text.target.value);
              break;
            case 'email':
              this.data[clave] = text.target.value;
              break;
            case 'username':
            case 'address':
              this.data[clave] = this.validateAlphaNumer(text.target.value);
              text.target.value = this.validateAlphaNumer(text.target.value);
              break;
          }
        } else {
          switch (clave) {
            case 'company_idnumber':
            case 'company_phone':
              this.data[clave] = this.validateNumeric(text.target.value);
              break;
            case 'company_vat':
            case 'company_zipcode':
              // case 'company_address':
              this.data[clave] = this.validateAlphaNumer(text.target.value);
              break;
            default:
              this.data[clave] = text.target.value;
              break;
          }
        }
      }
    }
  }

  cancelEdit(clave: string): void {
    this.edit[clave] = !this.edit[clave];
    this.data[clave] = this.dataAux[clave];
  }

  send(clave: string) {
    this.loading = true;
    if (!this.vaidateRequiredFields(clave)) {
      if (clave === 'email') {
        this.alerts.error(this.translate.instant('profile.emailinvalid'));
        this.loading = false;
        return;
      }
      this.alerts.error(
        this.translate.instant('profile.' + clave) +
          this.translate.instant('profile.requerido')
      );
      this.loading = false;
      return;
    }
    // no enviar datos en null
    const env = this.formUtils.removeNullValues(this.data);
    this.http
      .sendData(env)
      .then((data: any) => {
        this.http.getProfile().subscribe((res: any) => {
          this.data = res.data;
          this.appStateService.updateUserData(res.data);
          this.dataAux = { ...this.data };
          this.alerts.succes(this.translate.instant('profile.updatesuccess'));
          this.loading = false;
        });
        this.edit[clave] = !this.edit[clave];
      })
      .catch((err) => {
        this.loading = false;
        this.errors.handleError(
          err,
          this.translate.instant('profile.updateerror')
        );
      });
  }

  vaidateRequiredFields(clave: string) {
    if (clave === 'email') {
      return this.validateAlphaEmail(this.data[clave]);
    } else {
      return !(
        this.requiredFields.includes(clave) &&
        (this.data[clave] === null ||
          this.data[clave] === undefined ||
          this.data[clave] === '')
      );
    }
  }

  load() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['profile']);
    });
  }

  getData(data: any): void {
    const expectedData = Object.keys(this.iconos);
    const setClaves = new Set();
    this.claves = [];
    expectedData.forEach((item: any) => {
      if (!this.textFields.includes(item)) {
        if (!this.selectFields.includes(item)) {
          setClaves.add(item);
          this.edit.push({ dat: false });
        }
      }
    });
    if (this.data.is_company) {
      this.companyFields.map((x) => {
        setClaves.add(x);
      });
    } else {
      this.companyFields.map((x) => {
        setClaves.delete(x);
      });
    }
    this.claves.push(...setClaves.values());
  }

  showFieldsCompany(clave: string): boolean {
    return this.selectFields.includes(clave);
  }

  isFieldsCompany(clave: string): boolean {
    return this.selectFields.includes(clave);
  }

  isDropdownField(value: string): boolean {
    return this.dropdownFields.includes(value);
  }

  validateNumeric(value: string) {
    const rgx = /[^\d]/g;
    return value.replace(rgx, '');
  }

  validateAlphabetic(value: string) {
    const rgx = /[^A-Za-záéíóú ]/g;
    return value.replace(rgx, '');
  }

  validateAlphaNumer(value: string) {
    const rgx = /[^A-Za-z0-9_ ]/g;
    return value.replace(rgx, '');
  }

  validateAlphaEmail(value: string) {
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return reg.test(value);
  }
}
