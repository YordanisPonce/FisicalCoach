import { Component, OnInit } from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { faGoogle } from '@fortawesome/free-brands-svg-icons/faGoogle';
import { TranslateService } from '@ngx-translate/core';
import { ServicesService } from './services.service';
import { AlertsApiService } from '../generals-services/alerts-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ComunicationComponentService } from '../_services/comunicationComponent.service';
import { AuthenticationService } from '../_services/authentication.service';
import { ProfieService } from '../modules/profile/profile-services/profie.service';
import { environment } from 'src/environments/environment';
import { AppStateService } from '../stateManagement/appState.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public loading: boolean = false;

  submitted = false;
  faGoogle = faGoogle;
  public idioma: any = '';
  public token: any = '';
  public rutaImagen: any = environment.images;
  recoverPasswordDialog: boolean = false;
  activeUserDialog: boolean = false;
  email!: string;
  messageActiveUser!: string;
  showPass: boolean = false;
  language: string = 'es';
  languages: any[] = [
    { name: ' Español', value: 'es' },
    { name: ' English', value: 'en' },
  ];
  splash: any[] = [];
  loginForm = new UntypedFormGroup({
    email: new UntypedFormControl('', Validators.required),
    password: new UntypedFormControl('', Validators.required),
  });
  urlBase = environment.images;
  englishFlag: string = `${this.urlBase}/images/icons/flag_u_kingdom.svg`;
  spanishFlag: string = `${this.urlBase}/images/icons/flag_spain.svg`;

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public http: ServicesService,
    private translate: TranslateService,
    private authenticationService: AuthenticationService,
    public msg: AlertsApiService,
    private comunicationService: ComunicationComponentService,
    public profileHttp: ProfieService,
    private appStateService: AppStateService
  ) {
    this.getSplash();
  }

  get f() {
    return this.loginForm.controls;
  }

  getLanguageLabel(code: string) {
    return this.languages.find((x) => x.value === code)?.name;
  }

  getSplash() {
    this.http.getSplash().subscribe((res: any) => {
      this.splash = res.data;
    });
  }

  ngOnInit(): void {
    localStorage.removeItem('data');
    const idOneurl: any = this.route.snapshot.paramMap.get('id');
    const idTwourl: any = this.route.snapshot.paramMap.get('token');
    const isLogin = this.authenticationService.isLogin();
    if (isLogin) {
      this.router.navigate(['/inicio']);
      return;
    }
    setTimeout(() => {
      if (idOneurl && idTwourl) {
        const temp = window.location.href.split('/');
        this.verificar(idOneurl, temp[7]);
      }
    }, 200);
    this.setLanguaje();
    localStorage.removeItem('license_invite_token');
    localStorage.removeItem('license_invite_email');
  }

  sendData() {
    this.loading = true;
    this.submitted = true;
    const env = {
      login: this.loginForm.value.email.toLowerCase(),
      password: this.loginForm.value.password,
    };
    this.email = env.login;
    if (this.loginForm.valid) {
      this.http.sendData(env).subscribe(
        (rest: any) => {
          if (rest.data && rest.data.token) {
            localStorage.setItem('token', rest.data.token);
            this.profileHttp.getProfile().subscribe(
              (res: any) => {
                const userData = res.data;

                this.appStateService.updateUserData(userData);
                this.appStateService.setTax(userData?.tax);
                const licenseDialog = localStorage.getItem('licenceDialog');
                if (userData?.subscriptions?.length > 0) {
                  const subscriptions = userData.subscriptions;
                  localStorage.setItem('name', userData.full_name);
                  localStorage.setItem('role', subscriptions[0]?.package_code);
                  localStorage.setItem('user', JSON.stringify(userData));
                  if (licenseDialog === 'true' || licenseDialog === null) {
                    localStorage.setItem('licenceDialog', 'true');
                  } else {
                    localStorage.setItem('licenceDialog', 'false');
                  }
                  this.msg.succes('Bienvenido');
                  this.loading = false;
                  this.router.navigate(['/inicio']);
                  this.comunicationService.login(true);
                } else {
                  localStorage.removeItem('token');
                  this.msg.succes('Selecciona un paquete para continuar');
                  localStorage.setItem('uvr', userData.id);
                  this.router.navigateByUrl(
                    `/register/register-pays/${userData.id}`
                  );
                }
              },
              ({ error }) => {
                this.loading = false;
                this.msg.error(error);
                this.close();
              }
            );
          } else {
            this.loading = false;
            this.msg.error('Error de login');
          }
        },
        (err: any) => {
          if (
            err?.error?.message?.includes('Cuenta no se encuentra activa') ||
            err?.error?.message?.includes('Account not active')
          ) {
            this.messageActiveUser = err?.error?.message;
            this.activeUserDialog = true;
          }
          this.loading = false;
          this.msg.error(err.error.message);
          this.close();
        }
      );
    } else {
      this.loading = false;
    }
  }

  close() {
    const cachedItem = { ...localStorage };
    const listItems = Object.keys(cachedItem);
    listItems.forEach((item) => {
      if (item !== 'licenceDialog') {
        localStorage.removeItem(item);
      }
    });
    this.comunicationService.openNotifications(false);
    this.comunicationService.login(false);
  }

  verificar(ida: any, idb: any) {
    this.http.verificated(ida, idb).subscribe(
      (data: any) => {
        localStorage.setItem('uvr', data.data.user_id);
        this.router.navigateByUrl('register/register-pays');
        this.msg.succes('Tu contrasena se ha enviado a tu correo electronico');
      },
      (err) => {
        this.msg.error('El enlace ya no es valido');
      }
    );
  }

  recuperate() {
    this.msg.recuperate();
  }

  handleLanguage(value: any) {
    console.log(value.value);
    localStorage.setItem('languaje', value.value);
    this.translate.setDefaultLang(value.value);
  }

  private setLanguaje() {
    this.idioma = localStorage.getItem('languaje');
    if (localStorage.getItem('languaje')) {
      this.translate.setDefaultLang(`${this.idioma}`);
    } else {
      localStorage.setItem('languaje', 'es');
      this.translate.setDefaultLang('es');
    }
  }
}
