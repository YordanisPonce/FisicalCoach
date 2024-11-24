import { EventEmitter, HostListener, Output } from '@angular/core';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { forkJoin, Subscription } from 'rxjs';
import { ComunicationComponentService } from '../../_services/comunicationComponent.service';
import { GeneralService } from '../../_services/general.service';
import { AppStateQuery } from '../../stateManagement/appState.query';
import { AppStateService } from '../../stateManagement/appState.service';
import { PlayersService } from '../../_services/players.service';
import { TeamService } from '../../_services/team.service';
import { ClubService } from 'src/app/_services/club.service';
import { Licence, Package, User } from 'src/app/_models/user';
import { EvaluationService } from 'src/app/_services/evaluation.service';
import { UsersService } from 'src/app/_services/users.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss'],
})
export class InicioComponent implements OnInit, OnDestroy {
  @Output()
  openSidebar: EventEmitter<boolean> = new EventEmitter<boolean>();
  sidebarVisible: boolean = false;
  notificacionsSidebar: boolean = false;
  packages: any[] = [];
  games: any[] = [];
  addSpaceDialog: boolean = false;
  subscription$ = new Subscription();
  activitieList: any[] = [];
  loading: boolean = false;
  loadingScroll: boolean = false;
  role: string;
  userData: User;
  licenceDialog: boolean = false;
  recentEvaluations: any[];
  loadingEvaluations: boolean = true;
  showAllActivities: boolean = false;
  userPackage: Package[] = [];
  licences: Licence[] = [];
  page: number = 1;
  last_page: number = 1;

  constructor(
    private generalService: GeneralService,
    private appStateQuery: AppStateQuery,
    private appStateService: AppStateService,
    private playerService: PlayersService,
    private teamService: TeamService,
    private clubService: ClubService,
    private comunicationService: ComunicationComponentService,
    private evaluationService: EvaluationService,
    private userService: UsersService
  ) {}

  ngOnDestroy(): void {
    if (this.subscription$) {
      this.subscription$.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.userData = this.appStateService.getUserData();
    this.role = localStorage.getItem('role') as string;
    this.licenceDialog = localStorage.getItem('licenceDialog') === 'true';
    this.packages = [
      {
        title: 'Paquete Multi-Deporte',
        text: 'Lorem ipsum dolor sic amen insectus lorem ipsum amen iscetus lorem ipsum amen insectus lorem',
      },
      {
        title: 'Paquete Uni-Deporte',
        text: 'Lorem ipsum dolor sic amen insectus lorem ipsum amen iscetus lorem ipsum amen insectus lorem',
      },
      {
        title: 'Paquete Premium-Deporte',
        text: 'Lorem ipsum dolor sic amen insectus lorem ipsum amen iscetus lorem ipsum amen insectus lorem',
      },
    ];
    this.games = [
      {
        club: 'Club 1',
      },
      {
        club: 'Club 2',
      },
    ];
    this.appStateQuery.listGender$.subscribe((res) => {
      const r = Object.assign([], res);
      if (r.length === 0) {
        this.getList();
      }
    });
    this.appStateQuery.listGenderIdentity$.subscribe((res) => {
      const r = Object.assign([], res);
      if (r.length === 0) {
        this.getList();
      }
    });

    this.getClubsActivities(false);
    this.subscription$ = this.comunicationService.recargaMenu$.subscribe(
      (res) => {
        this.getClubsActivities(false);
      }
    );

    this.getUserLicences();
  }

  notifications(event: boolean) {
    this.notificacionsSidebar = event;
  }

  /**
   * get user licences
   */
  getUserLicences(): void {
    this.subscription$ = this.userService.getUserLicences().subscribe((res) => {
      this.userPackage = res.data.filter(
        (userPackage: any) => userPackage.package_code === this.role
      );

      if (this.userPackage.length > 0) {
        this.licences = this.userPackage[0].licenses.filter(
          (licence) => licence.status == 'available'
        );
      }
    });
  }

  getList() {
    forkJoin(
      this.generalService.getListGender(),
      this.generalService.getListGenderIdentity(),
      this.playerService.getListCivilStatus(),
      this.playerService.getListLaterality(),
      this.generalService.getCountry(),
      this.teamService.getListPosition()
    ).subscribe(
      ([
        gender,
        genderIdentity,
        civilStatus,
        laterality,
        countries,
        positions,
      ]) => {
        const listGenders = gender.data.filter((x: any) => x.id !== 0);
        const listGenderIdentity = genderIdentity.data;
        this.appStateService.updateListCountry(countries.data);
        this.appStateService.updateListGender(listGenders);
        this.appStateService.updateListGenderIdentity(listGenderIdentity);
        this.appStateService.updatelistCivilStatus(civilStatus.data);
        this.appStateService.updateListLaterality(laterality.data);
        this.appStateService.updateListPositions(positions.data);
      }
    );
  }

  getRecentEvaluations() {
    this.evaluationService
      .getRecentEvaluations(this.appStateService.getClassroomAcademicYear())
      .subscribe((res: any) => {
        this.recentEvaluations = res.data;
        this.loadingEvaluations = false;
      });
  }
  handleOpenSidebar(): void {
    this.openSidebar.emit(true);
  }

  getClubsActivities(isScrolled: boolean): void {
    this.loading = !isScrolled;
    this.loadingScroll = isScrolled;
    const userId = this.userData.id;

    this.clubService
      .getHistoryActivities(userId, 'user', this.role, this.page)
      .subscribe(
        (res) => {
          if (res.success) {
            this.activitieList = [...this.activitieList, ...res.data.data];

            this.last_page = res.data.last_page;
          }
          this.loading = false;
          this.loadingScroll = false;
        },
        (error) => {
          this.loading = false;
          this.loadingScroll = false;
        }
      );
  }

  refreshActivities(): void {
    this.page = this.page + 1;

    if (this.page <= this.last_page) this.getClubsActivities(true);
  }
}
