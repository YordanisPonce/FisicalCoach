import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MustMatch } from 'src/app/core/helpers/must-match.validator';
import { AlertsApiService } from 'src/app/generals-services/alerts-api.service';
import { ProfieService } from '../../profile-services/profie.service';
import FormUtils from './../../../../utils/formUtils';
import { AppStateService } from '../../../../stateManagement/appState.service';

declare var $: any;

@Component({
  selector: 'edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
})
export class EditProfileComponent implements OnInit {
  loading: boolean = false;
  registerForm: UntypedFormGroup;
  datas: any;
  loadingSubmit: boolean = false;

  @Input() data: any;
  @Input() perfilDialog: boolean = false;
  @Input() gender: any = [];
  @Input() genderIdentity: any = [];
  @Input() country: any = [];
  @Input() provinces: any = [];

  @Output() close = new EventEmitter<boolean>();
  @Output() refreshProvinceList = new EventEmitter<any>();

  formUtils = new FormUtils();

  regxAlphabeticCustom: RegExp = /[A-Za-záéíóú.ñ ]/g;
  regxAlphabeticNumCustom: RegExp = /[A-Za-z0-9_#\- ]/g;

  constructor(
    public router: Router,
    private formBuilder: UntypedFormBuilder,
    private translate: TranslateService,
    public http: ProfieService,
    public alerts: AlertsApiService,
    public appStateService: AppStateService
  ) {
    // Register user sample
    this.loadForm();
  }

  get f() {
    return this.registerForm.controls;
  }

  closeDialog() {
    this.perfilDialog = false;
    this.close.emit(false);
  }

  ngOnInit(): void {
    this.cargar();
  }

  cargar() {
    if (this.data) {
      this.registerForm = this.formBuilder.group({
        full_name: [this.data.full_name, [Validators.required]],
        email: [
          { value: this.data.email, disabled: true },
          [Validators.required],
        ],
        id: [this.data.id],
        gender: [this.data.gender, [Validators.required]],
        gender_identity_id: [this.data.gender_identity_id],
        username: [this.data.username, [Validators.required]],
        country_id: [this.data.country_id, [Validators.required]],
        address: [this.data.address, [Validators.required]],
        dni: [this.data.dni, [Validators.required]],
        zipcode: [this.data.zipcode, [Validators.required]],
        province_id: [this.data.province_id, [Validators.required]],
        city: [this.data.city || null, [Validators.required]],
        phone: [this.vericatePhone(this.data.phone), [Validators.required]],
        is_company: [!!this.data.is_company],
        company_name: [this.data.company_name || null],
        company_idnumber: [this.data.company_idnumber || null],
        company_vat: [this.data.company_vat || null],
        company_address: [this.data.company_address || null],
        company_city: [this.data.company_city || null],
        company_zipcode: [this.data.company_zipcode || null],
        company_phone: [this.data.company_phone || null],
      });
    }
    this.perfilDialog = true;
  }

  vericatePhone(num: any) {
    if (num) {
      return num[0];
    } else {
      return '';
    }
  }

  /**
   * refresh list after country select changes
   */
  refreshProvinces(): void {
    this.refreshProvinceList.emit(this.registerForm.value.country_id);
  }

  send() {
    this.loadingSubmit = true;

    if (this.registerForm.valid) {
      const env = this.formUtils.removeNullValues(this.registerForm.value);
      env.provider_google_id = this.data.authToken;
      env.phone = [env.phone];
      this.http
        .sendData(env)
        .then((data) => {
          const parseData = JSON.parse(data as any);
          localStorage.setItem('name', this.data.full_name);
          this.alerts.succes(parseData.message);
          this.loadingSubmit = false;
          this.closeDialog();
          Object.assign(this.data, env);
          this.appStateService.updateUserData(this.data);
        })
        .catch((error) => {
          this.alerts.error(this.handleError(error));
          this.loadingSubmit = false;
        });
    } else {
      this.loadingSubmit = false;
      this.alerts.error(this.translate.instant('profile.fieldsrequired'));
    }
  }

  load() {
    window.location.reload();
  }

  validateMobile(event: any) {
    let rgxNumber = event.target.value;
    rgxNumber = rgxNumber.match(/\+?\d+/g);
    if (rgxNumber?.length > 0) {
      rgxNumber.join('');
    }
    event.target.value = event.target.value === '+' ? `+` : rgxNumber;
  }

  private loadForm() {
    this.registerForm = this.formBuilder.group(
      {
        email: [null, [Validators.required, Validators.email]],
        password: [null],
        id: [null],
        gender: [null, Validators.required],
        gender_identity_id: [null],
        username: [null, Validators.required],
        country_id: [null, Validators.required],
        full_name: [null, Validators.required],
        confirmPassword: [null],
        address: [null, [Validators.required]],
        dni: [null, Validators.required],
        zipcode: [null, Validators.required],
        province_id: [null, Validators.required],
        phone: [null, Validators.required],
        is_company: [false],
        company_name: [null],
        company_idnumber: [null],
        company_vat: [null],
        company_address: [null],
        company_city: [null],
        company_zipcode: [null],
        company_phone: [null],
      },
      {
        validator: MustMatch('password', 'confirmPassword'),
      }
    );
  }

  private handleError(error: any) {
    let err: any = null;
    try {
      err = JSON.parse(error);
    } catch (err) {
      return this.translate.instant('profile.updateerror');
    }
    let msg = '';
    if (err.errors) {
      const keys = Object.keys(err.errors);
      keys.map((x) => {
        msg = msg + err.errors[x][0] + '\n';
      });
      return msg;
    } else {
      return this.translate.instant('profile.updateerror');
    }
  }
}
