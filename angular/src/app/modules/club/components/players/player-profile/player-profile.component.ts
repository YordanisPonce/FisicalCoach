import { Component, OnDestroy, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-player-profile',
  templateUrl: './player-profile.component.html',
  styleUrls: ['./player-profile.component.scss'],
})
export class PlayerProfileComponent implements OnInit, OnDestroy {
  items: MenuItem[] = [];
  activeTab!: number;
  text: any = {
    general: '',
    infortamation: '',
    health: '',
    training: '',
    competition: '',
  };
  language: Subscription;
  urlBase = environment.images + 'images/icons/';
  urlBaseImageCompeticion: string = this.urlBase + 'trophy_2.svg';
  urlBaseImageCargaEntrenamiento: string = this.urlBase + 'training_load_2.svg';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService
  ) {
    router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        const items = val.url.split('/');
        if (items[items.length - 1] === 'estado-de-salud') {
          this.activeTab = this.items.findIndex(
            (x) => x.routerLink === items[items.length - 1]
          );
        }
      }
    });
  }

  setActiveTab(routerLink: any) {
    const tab: any = this.items?.find(
      (element) => element.routerLink === routerLink
    );
    this.activeTab = this.items?.indexOf(tab);
  }

  ngOnDestroy() {
    this.language.unsubscribe();
  }

  goToPlayers() {
    this.router.navigate(['/club/players']);
  }

  ngOnInit(): void {
    this.loadItems();
    const route = this.route.firstChild?.snapshot.routeConfig;
    if (route != null) {
      this.setActiveTab(route.path);
    }
    this.language = this.translate.onDefaultLangChange.subscribe(() => {
      this.loadItems();
    });
  }

  private cargaritems(): void {
    this.items = [
      {
        label: this.text.general,
        icon: 'assets/img/icons/user-selected.png',
        escape: false,
        routerLink: 'general',
      },
      {
        label: this.text.infortamation,
        icon: 'assets/img/icons/google-forms-selected.svg',
        escape: false,
        routerLink: 'informacion',
      },
      {
        label: this.text.health,
        icon: 'assets/img/icons/cardiogram.svg',
        escape: false,
        routerLink: 'estado-de-salud',
      },
      {
        label: `${this.text.competition}`,
        escape: false,
        icon: this.urlBaseImageCompeticion,
        routerLink: 'competicion',
      },
      {
        label: ` ${this.text.training}`,
        escape: false,
        icon: this.urlBaseImageCargaEntrenamiento,
        routerLink: 'carga-de-entrenamiento',
      },
    ];
  }

  private loadItems() {
    this.text.general = this.translate.instant('PLAYERS.LBL_GENERAL');
    this.text.infortamation = this.translate.instant('PLAYERS.LBL_INFORMATION');
    this.text.health = this.translate.instant('PLAYERS.LBL_HEALTH');
    this.text.training = this.translate.instant('PLAYERS.LBL_TRAINING');
    this.text.competition = this.translate.instant('PLAYERS.LBL_COMPETITION');
    this.cargaritems();
  }
}
