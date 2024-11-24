import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ComunicationComponentService } from '../../../_services/comunicationComponent.service';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  HostListener,
} from '@angular/core';
import { AppStateQuery } from '../../../stateManagement/appState.query';
import { Club } from '../../../_models/club';
import { ClubService } from '../../../_services/club.service';
import { AppStateService } from '../../../stateManagement/appState.service';
import { TeamService } from '../../../_services/team.service';
import { OverlayPanel } from 'primeng/overlaypanel';
import { AlertsApiService } from 'src/app/generals-services/alerts-api.service';
import { Location } from '@angular/common';
import { environment } from 'src/environments/environment';
import { SchoolService } from 'src/app/_services/school.service';
import { User, UserSubscription } from 'src/app/_models/user';
import { RoleEnum } from '../../../_models/role.enum';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-menu-academy',
  templateUrl: './menu-academy.component.html',
  styleUrls: ['./menu-academy.component.scss'],
})
export class MenuAcademyComponent implements OnInit, OnDestroy {
  teams: any[] = [];
  classes: any[] = [];

  @Output() addEquipo: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() closeSidebar: EventEmitter<boolean> = new EventEmitter<boolean>();
  club: Club;
  urlBase = environment.images;
  path: string = '';
  suscription: Subscription;
  refreshTeamOrClassSubs: Subscription;
  refreshClassSubs: Subscription;
  deleteLoading: boolean = false;
  editLoading: boolean = false;
  cargandoEquipos: boolean = false;
  suscriptionDialog: boolean = false;
  pathSelected: string = '';
  userSubscription: string | undefined = '';
  role: string;
  clubs: any[] = [];
  userData: User;
  activesubscription: UserSubscription;
  packageQuantity: number | undefined;
  isAlertOpen: boolean = false;
  showClubTeams: boolean = true;
  resolution: boolean = false;

  secondarySidebarMenu: any[] = [
    {
      image: 'house.png',
      route: '/academy/home/',
      code: 'home',
    },
    {
      image: 'group.svg',
      route: '/academy/members/',
      code: 'members',
    },
  ];
  @Input() newTeam: any = null;
  @ViewChild('team_sidebar') teamsidebar: OverlayPanel;
  editClub: boolean = false;
  selectedClub: any;
  roleEnum = RoleEnum;

  constructor(
    private router: Router,
    private location: Location,
    private clubService: ClubService,
    private appStateQuery: AppStateQuery,
    private appStateService: AppStateService,
    private teamService: TeamService,
    private comunicationService: ComunicationComponentService,
    private msg: AlertsApiService,
    private schoolService: SchoolService,
    private translateService: TranslateService
  ) {
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        const url = val.url;
        this.secondarySidebarMenu.forEach((item: any) => {
          if (url === item.route || url.includes(item.route)) {
            this.pathSelected = item.code;
          }
        });
      }
    });
  }

  get isTeacher() {
    return this.role === this.roleEnum.TEACHER;
  }
  get isSport() {
    return this.role === this.roleEnum.SPORT;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.newTeam != null) {
      this.teams.push(this.newTeam);
    }
  }

  updateResolution() {
    if (window.innerWidth <= 1024) {
      this.resolution = true;
    } else {
      this.resolution = false;
    }
  }

  ngOnInit(): void {
    this.updateResolution();
    this.path = this.location.path();
    this.role = localStorage.getItem('role') as string;
    this.userData = JSON.parse(localStorage.getItem('user') as any);
    this.suscription = this.appStateQuery.club$.subscribe((r) => {
      this.club = r;
      if (this.club) {
        if (!this.isTeacher) {
          this.getTeams(r.id);
        } else {
          this.secondarySidebarMenu[1] = {
            image: 'group.svg',
            route: '/academy/teachers/',
            code: 'professor',
          };
          this.getClases(r.id);
        }
      }
      this.isAlertOpen = false;
    });
    this.getUserProfileData();
    this.refreshTeamOrClassSubs =
      this.comunicationService.refreshTeamOrClass$.subscribe((res) => {
        if (this.club) {
          if (!this.isTeacher) {
            this.getTeams(this.club.id);
          } else {
            this.getClases(this.club.id);
          }
        }
      });

    this.refreshClassSubs =
      this.comunicationService.refreshClassInactive$.subscribe((res) => {
        if (res) {
          this.getClases(this.club.id);
        }
      });
  }

  /**
   * get teams by club
   * @param clubId
   */
  getTeams(clubId: any) {
    this.teams = [];
    this.cargandoEquipos = true;
    this.teamService.getList(clubId).subscribe(
      (res) => {
        this.teams = res.data;
        this.cargandoEquipos = false;
      },
      ({ error }) => {
        if (!error.success) {
          this.msg.error(error.message);
          setTimeout(() => {
            this.router.navigate(['/inicio']);
            this.appStateService.resetClub();
            this.appStateService.resetSchool();
            this.appStateService.resetTeamOrClass();
          }, 2000);
        }
      }
    );
  }

  /**
   * get teams by School
   * @param schoolId
   */
  getClases(schoolId: any) {
    this.teams = [];
    this.cargandoEquipos = true;
    this.schoolService.getClasses(schoolId).subscribe(
      (res) => {
        this.cargandoEquipos = false;
        this.classes = res.data;
      },
      ({ error }) => {
        this.msg.error(error);

        this.router.navigate([`/academy/academic-years/${this.club.id}`]);
        this.cargandoEquipos = false;
      }
    );
  }

  /**
   * Get user data to validate clubs quantity creation
   */
  getUserProfileData(): void {
    if (this.userData) {
      this.activesubscription = this.userData?.subscriptions?.find(
        (subscription: any) => subscription.package_code === this.role
      );
      this.packageQuantity = this.activesubscription?.quantity;
      this.userSubscription = this.activesubscription?.subpackage_name;
    }
  }

  navegar(item: any): void {
    this.showClubTeams = false;
    this.closeSidebar.emit(false);
    this.router.navigate([item.route + this.club.id]);
  }

  nuevoEquipo() {
    if (this.teams.length >= 6) {
      this.msg.error(this.translateService.instant('team.teamLimitReached'));
    } else {
      this.addEquipo.emit(true);
    }
  }

  delete(club: Club) {
    this.deleteLoading = true;
    if (this.isTeacher) {
      this.schoolService.deleteSchool(club.id).subscribe(
        (res) => {
          this.msg.succes(res.message);
          this.comunicationService.recargarMenuListaClubs(true);
          setTimeout(() => {
            this.router.navigate(['/inicio']);
          }, 200);
          this.deleteLoading = false;
        },
        ({ error }) => {
          this.deleteLoading = false;
          this.msg.error(error);
        }
      );
      this.isAlertOpen = false;
    } else {
      this.clubService.deleteClub(club.id).subscribe(
        (res) => {
          this.msg.succes(res.message);
          this.comunicationService.recargarMenuListaClubs(true);
          setTimeout(() => {
            this.router.navigate(['/inicio']);
          }, 200);
          this.deleteLoading = false;
        },
        ({ error }) => {
          this.deleteLoading = false;
          this.msg.error(error);
        }
      );
      this.isAlertOpen = false;
    }
  }

  showAlert(open: boolean): void {
    this.isAlertOpen = open;
  }

  salir() {
    this.router.navigate(['/inicio']);
  }

  editar(club: any) {
    if (this.isTeacher) {
      this.editLoading = true;
      this.suscription = this.schoolService.showSchoolCenter(club.id).subscribe(
        (res) => {
          const { data } = res;
          const school = {
            id: data.id,
            image: data.image,
            name: data.name,
            email: data.email,
            country_id: data.address?.country?.id,
            province_id: data.address?.province?.id,
            street: data.address?.street,
            city: data.address?.city,
            phone: data.address?.phone,
            mobile_phone: data.address?.mobile_phone,
            postal_code: data.address?.postal_code,
            school_center_type_id:
              data?.school_center_type_id || data?.club_type_id,
            webpage: data?.webpage,
            academic_years: data.academic_years,
          };
          this.appStateService.setClubEdit(school);
          this.comunicationService.newSpace({
            showDialog: true,
            editing: true,
          });
          this.editLoading = false;
        },
        ({ error }) => {
          this.msg.error(error);
        }
      );
    } else {
      this.selectedClub = club;
      this.editClub = true;
      this.appStateService.setClubEdit(club);
    }
  }

  viewTeam(event: any, team: any) {
    if (this.isTeacher) {
      this.appStateService.updateClass(team);
    }
    this.appStateService.updateTeam(team);
    this.teamsidebar.toggle(event);
    this.showClubTeams = false;
    this.closeSidebar.emit(false);

    if (this.resolution) {
      this.router.navigate([
        this.role === 'sport' ? '/club/home' : '/teacher/home',
      ]);
    }
  }

  addSpace() {
    this.comunicationService.newSpace(true);
  }

  ngOnDestroy(): void {
    if (this.suscription) {
      this.suscription.unsubscribe();
    }
    if (this.refreshTeamOrClassSubs) {
      this.refreshTeamOrClassSubs.unsubscribe();
    }

    if (this.refreshClassSubs) {
      this.refreshClassSubs.unsubscribe();
    }
  }
}
