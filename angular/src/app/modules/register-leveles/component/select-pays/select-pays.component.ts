import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ServicesService } from '../../../../login/services.service';
import { ServicesService as PackegesService } from '../../services/services.service';
import { AlertsApiService } from '../../../../generals-services/alerts-api.service';
import { TranslateService } from '@ngx-translate/core';
import { AppStateService } from '../../../../stateManagement/appState.service';

@Component({
  selector: 'app-select-pays',
  templateUrl: './select-pays.component.html',
  styleUrls: ['./select-pays.component.scss'],
})
export class SelectPaysComponent implements OnInit {
  public price: boolean = false;
  public time: boolean = false;
  public data: any = [];
  public titleEs = 'Cuenta verificada';
  public titleEn = 'Verified account';
  public contentEs =
    'Te recordamos que los primeros 15 días de tu suscripción serán totalmente gratuitos para que disfrutes de todos nuestros servicios sin gasto adicional. ¡Selecciona un plan!';
  public contentEn =
    'We remind you that the first 15 days of your subscription will be totally free so that you can enjoy all our services without additional expense. Select a plan!';
  public type: any = 'year';
  public textSubscrpcion: any = '';
  public textBeneficios: any = '';
  public packs: any = [];
  verifyAccount = false;
  language: string;
  constructor(
    public router: Router,
    private route: ActivatedRoute,
    private packegesService: PackegesService,
    private translate: TranslateService,
    private verifyService: ServicesService,
    private appStateService: AppStateService,
    private msg: AlertsApiService
  ) {}

  ngOnInit(): void {
    localStorage.removeItem('token');
    const idOneurl: any = this.route.snapshot.paramMap.get('id');
    const idTwourl: any = this.route.snapshot.paramMap.get('token');
    this.packegesService.getPackeges().subscribe((data: any) => {
      this.data = data.data;
      this.packs = data.data;
    });
    setTimeout(() => {
      if (idOneurl && idTwourl) {
        const hash = window.location.href.split('/');
        this.verificar(idOneurl, hash[7]);
      }
    }, 200);
    this.language = localStorage.getItem('languaje') as string;
    this.check();
  }

  openModal(go: string) {
    if (this.language !== 'es') {
      this.textSubscrpcion = 'Annual subscription ';
      this.textBeneficios = 'Discover the benefits that it offers you';
      Swal.fire({
        html:
          `<div class="py-3 rounded-circle mx-auto normal  mb-2"> <ion-icon class="icono-alert fa fa-check"  name="american-football-outline"></ion-icon></div> <br/>` +
          ` <b>${this.titleEn}</b><br /> ` +
          `<p class="my-4 textalert"> ${this.contentEn} </p> `,
        focusConfirm: false,
        confirmButtonText: 'Closed',
        width: 350,
        padding: 20,
      });
    } else {
      this.textSubscrpcion = 'Subscripción anual';
      this.textBeneficios = 'Descubre los beneficios que te ofrece el mismo';
      Swal.fire({
        html:
          `<div class="py-3 rounded-circle mx-auto normal  mb-2" style="border: 1px solid #00e9c5;"> <ion-icon style="color: #00e9c5;" class="icono-alert fa fa-check"  name="american-football-outline"></ion-icon></div> <br/>` +
          ` <b>${this.titleEs}</b><br /> ` +
          `<p class="my-4 textalert"> ${this.contentEs} </p> `,
        focusConfirm: false,
        confirmButtonText: 'Cerrar',
        width: 350,
        padding: 20,
      });
    }
  }

  irTabla(item: any) {
    localStorage.setItem('type', item.code as string);
    localStorage.setItem('typ', this.type);
    localStorage.setItem('item', JSON.stringify(item));
    this.router.navigateByUrl('register/tables-pays');
  }

  check() {
    if (this.language !== 'es') {
      if (this.type === 'year') {
        this.textSubscrpcion = 'Annual subscription ';
      } else {
        this.textSubscrpcion = 'Monthly subscription ';
      }
    } else {
      if (this.type === 'year') {
        this.textSubscrpcion = 'Subscripción anual';
      } else {
        this.textSubscrpcion = 'Subscripción mensual';
      }
    }
  }

  verificar(ida: any, idb: any) {
    this.verifyAccount = true;
    this.verifyService.verificated(ida, idb).subscribe(
      (data: any) => {
        this.appStateService.setTax(data.data.tax);
        localStorage.setItem('uvr', data.data.user_id);
        localStorage.setItem('user_info', JSON.stringify(data.data));
        this.openModal('Dele');
        this.verifyAccount = false;
      },
      (err) => {
        this.translate.get('register.thisTokenIsNotValid').subscribe((res) => {
          this.msg.error(res);
          localStorage.removeItem('uvr');
          localStorage.removeItem('user_info');
          setTimeout(() => {
            return window.location.replace('/login');
          }, 2000);
        });
      }
    );
  }
  handleLanguage(value: any) {
    localStorage.setItem('languaje', value.target.value);
    this.translate.setDefaultLang(value.target.value);
    this.language = value.target.value;
    this.check();
  }
}
