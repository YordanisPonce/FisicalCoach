import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { AlertsApiService } from '../../../../generals-services/alerts-api.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { MustMatch } from '../../../../core/helpers/must-match.validator';
import { ServicesService } from '../../services/services.service';
import HandleErrors from '../../../../utils/errors';
import { environment } from '../../../../../environments/environment';
import { AppStateService } from '../../../../stateManagement/appState.service';

@Component({
  selector: 'app-form-register',
  templateUrl: './form-register.component.html',
  styleUrls: ['./form-register.component.scss'],
})
export class FormRegisterComponent implements OnInit, OnDestroy, AfterViewInit {
  public gender: any = [];
  public country: any = [];
  public provinces: any = [];
  public loading: boolean = false;
  public registerForm: UntypedFormGroup;
  public valido: boolean = false;
  public data: any = [];
  submmit: boolean = false;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  invitationToken: string = '';
  tokenForInvitaton: string = '';
  registerData: any;
  @ViewChild('scrollElement', { static: false }) scrollElement: ElementRef;
  error: HandleErrors = new HandleErrors(this.msg);
  splashImage = environment.images + 'images/fi/registro_usuario.png';
  showSuccessDialog: boolean = false;
  registeredUserMessage: string = '';
  userRegistred: any;

  constructor(
    public msg: AlertsApiService,
    private formBuilder: UntypedFormBuilder,
    private translate: TranslateService,
    private appStateService: AppStateService,
    public ruta: Router,
    public http: ServicesService
  ) {
    this.getRegisterData();
    this.loadForm();
    this.invitationToken =
      this.ruta.getCurrentNavigation()?.extras?.state?.token;
    this.tokenForInvitaton =
      this.ruta.getCurrentNavigation()?.extras?.state?.token;
    if (this.invitationToken) {
      this.msg.succes('Verificado exitosamente');
    }
  }

  get f() {
    return this.registerForm.controls;
  }

  /**
   * add scroll to company fields if the checkbox is true
   * @param $element
   */
  scrollToElement(): void {
    this.scrollElement.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }

  ngOnInit(): void {
    const url = decodeURIComponent(window.location.href);
    const urltwo = url.split('?token=');
    setTimeout(() => {
      if (urltwo[1]) {
        this.verificar(urltwo[1]);
      }
    }, 200);
    if (localStorage.getItem('data')) {
      const getdato: any = localStorage.getItem('data');
      this.data = JSON.parse(getdato);
      const google_datos = JSON.parse(getdato || '{"name": "cliente"}');
      this.registerForm.patchValue({
        fullname: google_datos.name,
        email: google_datos.email,
      });
    }
    this.callData();
  }

  ngOnDestroy(): void {
    localStorage.removeItem('data');
    localStorage.removeItem('license_invite_token');
    localStorage.removeItem('license_invite_email');
  }

  callData() {
    this.http.getGender().subscribe((data: any) => {
      this.gender = data.data;
    });
    this.http.getCountries().subscribe((res: any) => {
      const list = res.data as any[];
      this.country = list.map((country: any) => ({
        label: country.emoji + ' ' + country.name,
        value: country.id,
        iso2: country.iso2,
      }));
    });
  }

  callProvicias() {
    for (const i in this.country) {
      if (this.country[i].value === this.registerForm.value.country) {
        return this.http
          .getProvincias(this.country[i].iso2)
          .subscribe((data: any) => {
            this.provinces = data.data;
          });
      }
    }
  }

  /**
   * check whether is company is checked
   * @param e
   */
  checkCompany(ischecked: boolean): void {
    const updateRequiredfields = [
      'company_name',
      'company_idnumber',
      'company_address',
      'company_city',
      'company_zipcode',
      'company_phone',
    ];
    if (ischecked) {
      updateRequiredfields.forEach((item: string) => {
        this.registerForm.controls[item].setValidators(Validators.required);
      });
    } else {
      updateRequiredfields.forEach((item: string) => {
        this.registerForm.get(item)?.clearValidators();
        this.registerForm.get(item)?.updateValueAndValidity();
      });
    }
    setTimeout(() => {
      this.scrollToElement();
    }, 500);
  }

  ir() {
    this.submmit = true;
    if (this.registerForm.valid) {
      const data = this.registerForm.getRawValue();
      this.loading = true;
      let env = {
        email: data.email.toLowerCase(),
        password: data.password,
        password_confirmation: data.confirmPassword,
        gender: Number(data.gender),
        full_name: data.fullname,
        country_id: Number(data.country),
        username: data.username,
        address: data.address,
        dni: data.idcard,
        zipcode: data.zipcode,
        province_id: Number(data.province_id),
        city: data.city,
        phone: [data.phone],
        is_company: data.is_company || false,
        company_name: data.company_name || null,
        company_idnumber: data.company_idnumber || null,
        company_vat: data.company_vat || null,
        company_address: data.company_address || null,
        company_city: data.company_city || null,
        company_zipcode: data.company_zipcode || null,
        company_phone: data.company_phone || null,
        provider_google_id: this.data.authToken,
      };
      const dataToSend = { ...env } as any;
      if (this.invitationToken) {
        dataToSend.license_invite_token = this.invitationToken;
        this.http.sendWithLicenseVerification(dataToSend).subscribe(
          (resp: any) => {
            this.userRegistred = resp.data;
            this.appStateService.updateUserData(this.userRegistred);
            this.appStateService.setTax(this.userRegistred?.tax);
            this.showSuccessDialog = true;
            this.registeredUserMessage = resp.message;
            this.loading = false;
          },
          ({ error }) => {
            this.loading = false;
            this.msg.error(error);
          }
        );
      } else {
        if (this.registerData.registerToken) {
          dataToSend.club_invite_token = this.registerData.registerToken;
        }
        this.http.sendData(dataToSend).subscribe(
          (resp: any) => {
            this.userRegistred = resp.data;
            this.appStateService.updateUserData(this.userRegistred);
            this.appStateService.setTax(this.userRegistred?.tax);
            this.showSuccessDialog = true;
            this.loading = false;
            if (this.registerData.registerToken) {
              this.registeredUserMessage = resp.message;
            }
          },
          ({ error }) => {
            this.loading = false;
            this.msg.error(error);
          }
        );
      }
    }
  }

  redirect(): void {
    if (
      this.registerData.registerToken &&
      !this.registerData?.licenceInvitation
    ) {
      this.ruta.navigateByUrl(
        `/register/register-pays/${this.userRegistred?.id}`
      );
    } else {
      this.ruta.navigateByUrl('login');
    }
  }

  verificar(id: any) {
    const env = {
      token: id.replace(/ /g, '+'),
    };
    this.http.verificated(env).subscribe(
      (data: any) => {
        this.translate.get('register.yourEmailIsVerified').subscribe((res) => {
          this.msg.succes(res);
        });
        this.ruta.navigateByUrl('login');
      },
      (err: any) => {
        this.translate.get('register.thisTokenIsNotValid').subscribe((res) => {
          this.msg.error(res);
        });
      }
    );
  }

  handleHome() {
    this.ruta.navigateByUrl('login');
  }

  validateMobile(event: any) {
    let rgxNumber = event.target.value;
    rgxNumber = rgxNumber.match(/\+?\d+/g);
    if (rgxNumber?.length > 0) {
      rgxNumber.join('');
    }
    event.target.value = event.target.value === '+' ? `+` : rgxNumber;
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.registerForm.controls.username.setValue(null);
      this.registerForm.controls.username.updateValueAndValidity();
      this.registerForm.controls.password.setValue(null);
      this.registerForm.controls.password.updateValueAndValidity();
    }, 1000);
  }

  private getRegisterData() {
    const registerToken = localStorage.getItem('license_invite_token');
    const registerEmail = localStorage.getItem('license_invite_email');
    const licenceInvitation = Boolean(
      JSON.parse(localStorage.getItem('is_licence_invitation') as string)
    );

    this.registerData = {
      registerToken,
      registerEmail,
      licenceInvitation,
    };
  }

  private loadForm() {
    this.registerForm = this.formBuilder.group(
      {
        email: [
          {
            value: this.registerData.registerEmail || '',
            disabled: this.registerData.registerEmail,
          },
          [Validators.required, Validators.email],
        ],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[.-_@$!%*?&])[A-Za-z\d.-_@$!%*?&]{8,}$/
            ),
          ],
        ],
        gender: ['', Validators.required],
        username: ['', Validators.required],
        country: ['', Validators.required],
        fullname: ['', Validators.required],
        confirmPassword: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[.-_@$!%*?&])[A-Za-z\d.-_@$!%*?&]{8,}$/
            ),
          ],
        ],
        address: ['', Validators.required],
        idcard: ['', Validators.required],
        zipcode: ['', Validators.required],
        city: ['', Validators.required],
        province_id: ['', Validators.required],
        phone: ['', Validators.required],
        check: ['', Validators.required],
        is_company: [false],
        company_name: [''],
        company_idnumber: [''],
        company_vat: [''],
        company_address: [''],
        company_city: [''],
        company_zipcode: [''],
        company_phone: [''],
        license_invite_token: [this.registerData.registerToken],
      },
      {
        validator: MustMatch('password', 'confirmPassword'),
      }
    );
  }
}
