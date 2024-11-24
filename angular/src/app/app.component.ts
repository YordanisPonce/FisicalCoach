import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ComunicationComponentService } from './_services/comunicationComponent.service';
import { AuthenticationService } from './_services/authentication.service';
import { Subscription } from 'rxjs';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'fisicalcoach-angular';
  addSpaceDialog = false;
  miniSidebar: boolean = false;
  dialog: boolean = false;
  isLogin: boolean = false;
  subscription: Subscription;
  subscriptionNoti: Subscription;
  subscriptionNewSpace: Subscription;
  notificacionsSidebar: boolean = false;
  role: string;
  showMenu: boolean = false;
  editingSchoolCenter: boolean = false;
  type: string | null;
  constructor(
    private readonly translate: TranslateService,
    private readonly comunicationComponentService: ComunicationComponentService,
    private readonly authenticationService: AuthenticationService,
    private config: PrimeNGConfig
  ) {}

  getSchoolCenterTitle() {}

  ngOnDestroy(): void {
    if (this.subscriptionNoti) {
      this.subscriptionNoti.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.role = localStorage.getItem('role') as string;
    const idioma = localStorage.getItem('languaje');
    if (!idioma) {
      localStorage.setItem('languaje', 'es');
      this.translate.setDefaultLang('es');
    }
    this.subscriptionNoti =
      this.comunicationComponentService.notifications$.subscribe((res) => {
        this.notificacionsSidebar = res;
      });
    this.subscriptionNewSpace =
      this.comunicationComponentService.space$.subscribe((res) => {
        this.role = localStorage.getItem('role') as string;
        this.addSpaceDialog = res;
        if (res.editing) {
          this.type = 'EDITCE';
          this.editingSchoolCenter = true
        } else {
          this.type = 'ADDNEWCE';
        }
      });
    this.isLogin = this.authenticationService.isLogin();
    this.subscription = this.comunicationComponentService.isLogin$.subscribe(
      (r) => {
        this.isLogin = r;
        setTimeout(() => {
          this.comunicationComponentService.sidebarEvent(false);
        }, 5);
      }
    );

    this.translate.use(idioma as string);
    this.translate
      .get('primeng')
      .subscribe((res) => this.config.setTranslation(res));
  }

  closeModal(item: any): void {
    this.addSpaceDialog = false;
  }
}
