import { Component, OnDestroy, OnInit } from '@angular/core';
import { ComunicationComponentService } from '../../_services/comunicationComponent.service';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { NavigationEnd, Router } from '@angular/router';
import { AppStateService } from 'src/app/stateManagement/appState.service';

@Component({
  selector: 'app-academy-home',
  templateUrl: './academy-home.component.html',
  styleUrls: ['./academy-home.component.scss'],
})
export class AcademyHomeComponent implements OnInit, OnDestroy {
  notificacionsSidebar: boolean = false;
  subs: Subscription;
  role: string;
  routeSubscription: Subscription;
  club: any;
  isClubEmpty: boolean = false;
  openSidebar = [
    '/profile/details',
    '/profile/subscriptions',
    '/profile/security',
    '/profile/licences',
    '/profile/new-subscription-process',
  ];
  newTeamDialog: boolean = false;
  team: any = null;
  sidebarVisible: boolean = false;

  constructor(
    private comunicationComponentService: ComunicationComponentService,
    private router: Router,
    public translate: TranslateService,
    private appStateService: AppStateService
  ) {
    this.routeSubscription = this.router.events.subscribe((event) => {
      this.club = this.appStateService.getClub();
      if (event instanceof NavigationEnd) {
        this.isClubEmpty =
          this.openSidebar.includes(event.url) && this.club === null;
      }
    });
  }

  ngOnInit(): void {
    this.role = localStorage.getItem('role') as string;
    this.subs = this.comunicationComponentService.notifications$.subscribe(
      (res) => {
        this.notificacionsSidebar = res;
      }
    );
  }

  nuevoEquipo(event: boolean) {
    this.newTeamDialog = event;
  }

  ngOnDestroy(): void {
    if (this.subs) {
      this.subs.unsubscribe();
    }
  }
}
