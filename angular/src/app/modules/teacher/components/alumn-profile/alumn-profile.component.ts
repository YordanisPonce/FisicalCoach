import { Component, OnDestroy, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import {
  ActivatedRoute,
  NavigationEnd,
  NavigationStart,
  Router,
} from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin, Subscription } from 'rxjs';
import { AlumnsService } from 'src/app/_services/alumns.service';
import { AppStateService } from 'src/app/stateManagement/appState.service';
import { ComunicationComponentService } from '../../../../_services/comunicationComponent.service';

@Component({
  selector: 'app-alumn-profile',
  templateUrl: './alumn-profile.component.html',
  styleUrls: ['./alumn-profile.component.scss'],
})
export class AlumnProfileComponent implements OnInit, OnDestroy {
  text: any = {
    general: '',
    infortamation: '',
    health: '',
    evaluation: '',
  };
  items: MenuItem[];
  activeTab!: number;
  language: Subscription;
  loading: boolean = false;
  subsGetAlumn: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService,
    private comunicationComponentService: ComunicationComponentService,
    private alumnsService: AlumnsService,
    private appStateService: AppStateService
  ) {
    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (history.state && history.state.sameView) {
          this.getAlumnData();
        }
      }
    });
  }

  ngOnDestroy() {
    this.appStateService.resetAlumn();
    this.alumnsService.setAlumnsDetailsData({});
    if (this.subsGetAlumn) {
      this.subsGetAlumn.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.loading = true;
    this.getAlumnData();
    this.subsGetAlumn = this.comunicationComponentService.alumn$.subscribe(
      (res) => {
        this.getAlumnData();
      }
    );
  }

  getAlumnData() {
    const alumn = this.route.snapshot.paramMap.get('alumnId')!;
    this.loadItems();
    this.alumnsService
      .getAlumnDetails(alumn, this.appStateService.getClassroomAcademicYear())
      .subscribe((res: any) => {
        this.alumnsService.setAlumnsDetailsData(res.data);
        this.loading = false;
      });
  }

  cargarItems(): void {
    this.items = [
      {
        label:
          '<img src="assets/img/icons/user-selected.png" width="25px" height="25px">' +
          this.text.general,
        escape: false,
        routerLink: 'general',
      },
      {
        label:
          '<img src="assets/img/icons/google-forms-selected.svg" class="" width="25px" height="25px">' +
          this.text.infortamation,
        escape: false,
        routerLink: 'information',
      },
      {
        label:
          '<img src="assets/img/icons/cardiogram.svg" class="" width="25px" height="25px">' +
          this.text.health,
        escape: false,
        routerLink: 'health',
      },
      {
        label:
          '<img src="https://testing-cdn.fisicalcoach.com/resources/images/icons/evaluation.svg" class="" width="25px" height="25px">' +
          this.text.evaluation,
        escape: false,
        routerLink: 'evaluation',
      },
    ];
    const route = this.route.firstChild?.snapshot.routeConfig;
    if (route != null) {
      this.setActiveTab(route.path);
    }
  }

  setActiveTab(routerLink: any) {
    const tab: any = this.items.find(
      (element) => element.routerLink === routerLink
    );
    this.activeTab = this.items?.indexOf(tab);
  }

  loadItems() {
    forkJoin(
      this.translate.get('alumns.general'),
      this.translate.get('alumns.information'),
      this.translate.get('alumns.health_status'),
      this.translate.get('alumns.evaluation')
    ).subscribe(([general, info, health, evaluation]) => {
      this.text.health = health;
      this.text.general = general;
      this.text.infortamation = info;
      this.text.evaluation = evaluation;
      this.cargarItems();
    });
  }

  goToAlumns() {
    this.router.navigate(['/teacher/alumns']);
  }
}
