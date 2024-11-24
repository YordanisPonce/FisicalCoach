import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ComunicationComponentService } from '../_services/comunicationComponent.service';
import { AppStateQuery } from '../stateManagement/appState.query';
import { Subscription } from 'rxjs';
import { AppStateService } from '../stateManagement/appState.service';
import { TranslateService } from '@ngx-translate/core';
import { ProfieService } from '../modules/profile/profile-services/profie.service';
import { Location } from '@angular/common';
import { environment } from 'src/environments/environment';
import { AlumnsService } from '../_services/alumns.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  urlBase = environment.images;
  public che: boolean = false;
  currentRoute: string = '';
  currentRouteForIcon: string = '';
  team: any;
  @Output()
  showNotification: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output()
  openSidebar: EventEmitter<boolean> = new EventEmitter<boolean>();
  subsPlayer: Subscription;
  subsPlayers: Subscription;
  person: any;
  players: any[] = [];
  alumns: any[] = [];
  idioma: any = 'es';
  userData: any;
  isOneRole: boolean = false;
  englishFlag: string = `${this.urlBase}/images/icons/flag_u_kingdom.svg`;
  spanishFlag: string = `${this.urlBase}/images/icons/flag_spain.svg`;
  languages: any[] = [
    { name: 'Español', value: 'es', abbr: 'ES' },
    { name: 'English', value: 'en', abbr: 'EN' },
  ];
  role: string;
  loadingUser: boolean = false;
  roles = ['sport', 'teacher'];
  sportSubscription: string;
  teacherSubscription: string;
  imgUrl: string = environment.images;
  girlAlumnImage: string = this.imgUrl + 'images/alumn/alumna.svg';
  boyAlumnImage: string = this.imgUrl + 'images/alumn/alumno.svg';
  url: string = '';
  homePath: string = '';
  teamMenuList = [
    {
      name: 'home',
      icon: '/team/home.svg',
    },
    {
      name: 'competitions',
      icon: '/team/competition.svg',
    },
    {
      name: 'competition',
      icon: '/team/competition.svg',
    },
    {
      name: 'scouting',
      icon: '/team/scouting.svg',
    },
    {
      name: 'players',
      icon: '/team/player.svg',
    },
    {
      name: 'workout',
      icon: '/team/exercise.svg',
    },
    {
      name: 'training-sessions',
      icon: '/team/session.svg',
    },
    {
      name: 'test',
      icon: '/team/test.svg',
    },
    {
      name: 'test-details/',
      icon: '/team/test.svg',
    },
    {
      name: 'test-player-results/',
      icon: '/team/test.svg',
    },
    {
      name: 'injury-prevention',
      icon: '/team/injury_prevention.svg',
    },
    {
      name: 'rfd-injuries',
      icon: '/team/injury_rfd.svg',
    },
    {
      name: 'physiotherapy',
      icon: '/team/fisiotherapy.svg',
    },
    {
      name: 'effort-recovery',
      icon: '/team/effort_recovery.svg',
    },
    {
      name: 'nutrition',
      icon: '/team/nutrition.svg',
    },
    {
      name: 'psychology',
      icon: '/team/psychology.svg',
    },
    {
      name: 'members',
      icon: '/team/group.svg',
    },
  ];

  classMenuList = [
    {
      name: 'class',
      icon: '/teacher/class.svg',
    },
    {
      name: 'alumns',
      icon: '/teacher/alumn.svg',
    },
    {
      name: 'test',
      icon: '/teacher/test.svg',
    },
    {
      name: 'test-details',
      icon: '/teacher/test.svg',
    },
    {
      name: 'daily-check',
      icon: '/teacher/daily_control.svg',
    },
    {
      name: 'evaluation',
      icon: '/teacher/evaluation.svg',
    },
    {
      name: 'workout',
      icon: '/team/exercise.svg',
    },
    {
      name: 'training-sessions',
      icon: '/team/session.svg',
    },
    {
      name: 'tutor',
      icon: '/teacher/tutorship.svg',
    },
    {
      name: 'calification',
      icon: '/teacher/qualification.svg',
    },
  ];

  hideSidebarIcon: string[] = ['members', 'club', 'home', 'profile'];

  constructor(
    public router: Router,
    private comunicationComponentService: ComunicationComponentService,
    private translate: TranslateService,
    private appStateQuery: AppStateQuery,
    private appStateService: AppStateService,
    private profileService: ProfieService,
    private alumnsService: AlumnsService,
    private location: Location
  ) {
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        const url = val.url;
        this.url = val.url;
        if (url === '/inicio') {
          this.currentRoute = 'home';
          this.currentRouteForIcon = 'home';
        } else {
          if (
            url === '/teacher/alumns' &&
            val.urlAfterRedirects !== '/teacher/alumns'
          ) {
            this.getPersonData();
          }
          this.CurrentNavPath(url);
        }
      }
    });
  }

  get getBackgroundUrl() {
    return `url(${
      this.person.image
        ? this.person.image.full_url
        : this.getSelectedPersonAvatar(this.person?.gender?.code)
    })`;
  }

  get getAvatarUrl() {
    return this.userData?.image
      ? this.userData.image?.full_url
      : this.getAvatar(this.userData.gender);
  }

  get icon() {
    let icon = 'assets/img/icons/house.png';

    switch (this.currentRouteForIcon) {
      case 'home':
        if (this.homePath === 'club') {
          icon = this.urlBase + 'images/menu/team/home.svg';
        } else if (this.homePath === 'club') {
        } else {
          icon = 'assets/img/icons/house.png';
        }
        break;
      case 'competiciones':
        icon = this.urlBase + 'images/menu/team/competition.svg';
        break;
      case 'scouting':
        icon = this.urlBase + 'images/menu/team/scouting.svg';
        break;
      case 'players':
        icon = this.urlBase + 'images/menu/team/player.svg';
        break;
      case 'workout':
        icon = this.urlBase + 'images/menu/team/exercise.svg';
        break;
      case 'training-sessions':
        icon = this.urlBase + 'images/menu/team/session.svg';
        break;
      case 'test':
        icon = this.urlBase + 'images/menu/team/test.svg';
        break;
      case 'test-details':
        icon = this.urlBase + 'images/menu/team/test.svg';
        break;
      case 'test-player-results':
        icon = this.urlBase + 'images/menu/team/test.svg';
        break;
      case 'injury-prevention':
        icon = this.urlBase + 'images/menu/team/injury_prevention.svg';
        break;
      case 'rfd-injuries':
        icon = this.urlBase + 'images/menu/team/injury_rfd.svg';
        break;
      case 'physiotherapy':
        icon = this.urlBase + 'images/menu/team/fisiotherapy.svg';
        break;
      case 'effort-recovery':
        icon = this.urlBase + 'images/menu/team/effort_recovery.svg';
        break;
      case 'nutrition':
        icon = this.urlBase + 'images/menu/team/nutrition.svg';
        break;
      case 'psychology':
        icon = this.urlBase + 'images/menu/team/psychology.svg';
        break;
      case '/teacher/class.svg':
        icon = this.urlBase + 'images/menu/teacher/class.svg';
        break;
      case 'alumns':
        icon = this.urlBase + 'images/menu/teacher/alumn.svg';
        break;
      case 'daily-check':
        icon = this.urlBase + 'images/menu/teacher/daily_control.svg';
        break;
      case 'evaluation':
        icon = this.urlBase + 'images/menu/teacher/evaluation.svg';
        break;
      case 'tutor':
        icon = this.urlBase + 'images/menu/teacher/tutorship.svg';
        break;
      case 'calification':
        icon = this.urlBase + 'images/menu/teacher/qualification.svg';
        break;
      case 'competition':
        icon = this.urlBase + 'images/menu/team/competition.svg';
        break;
      case 'competitions':
        icon = this.urlBase + 'images/menu/team/competition.svg';
        break;
      default:
        if (
          this.currentRouteForIcon.includes('/academy/members/') ||
          this.currentRouteForIcon.includes('/academy/teachers/')
        ) {
          icon = 'assets/img/icons/group.svg';
        } else {
          icon = 'assets/img/icons/house.png';
        }
    }
    return icon;
  }

  get translateKey(): string {
    return this.translate.instant('nav_bar')[this.currentRoute];
  }

  ngOnInit(): void {
    this.team = this.appStateService.getTeam();
    this.url = this.router.url;
    this.role = localStorage.getItem('role') as string;
    this.loadingUser = true;
    if (this.role === 'teacher' && this.url.includes('alumns')) {
      this.getPersonData();
    } else {
      this.subsPlayer = this.appStateQuery.player$.subscribe((res) => {
        const data = Object.assign({}, res);
        if (data && data.id) {
          const name = data.full_name.split(' ');
          this.person = data;
          this.person.first_name = name[0];
          this.person.last_name = name[1];
        }
      });
    }

    this.getprofileData();
    this.subsPlayers = this.appStateQuery.listPlayers$.subscribe((res) => {
      this.players = res;
    });

    if (localStorage.getItem('languaje')) {
      this.translate.setDefaultLang(`${localStorage.getItem('languaje')}`);
      this.idioma = localStorage.getItem('languaje');
    } else {
      this.translate.setDefaultLang('es');
      localStorage.setItem('languaje', 'es');
    }
  }

  getTeamIcon(route: string): { image: string; name: string } {
    const getRole =
      this.role === 'sport' ? this.teamMenuList : (this.classMenuList as []);
    const teamInfo = getRole.find((team: { name: string | string[] }) =>
      team.name.includes(route)
    );

    if (!!teamInfo) {
      return {
        image: teamInfo.icon as string,
        name: teamInfo.name,
      };
    }
    return {
      image: '',
      name: '',
    };
  }

  getprofileData() {
    this.appStateQuery.userData$.subscribe((res) => {
      const subscriptions = res.subscriptions as any[];
      this.userData = res;
      if (
        subscriptions.length === 1 &&
        this.roles.includes(subscriptions[0].package_code)
      ) {
        this.isOneRole = true;
      }
      this.sportSubscription = this.userData.subscriptions.find(
        (subscription: any) => subscription.package_code === 'sport'
      )?.subpackage_name;
      this.teacherSubscription = this.userData.subscriptions.find(
        (subscription: any) => subscription.package_code === 'teacher'
      )?.subpackage_name;
      this.loadingUser = false;
    });
  }

  getPersonData() {
    this.alumnsService
      .getAlummsByClassroom(this.appStateService.getClassroomAcademicYear())
      .subscribe((res: any) => {
        this.alumns = res.data.map((element: any) => element.alumn);
      });
    this.alumnsService.alumn$.subscribe((data: any) => {
      this.person = data.alumn;
    });
  }

  close() {
    const cachedItem = { ...localStorage };
    const listItems = Object.keys(cachedItem);
    listItems.forEach((item) => {
      if (item !== 'licenceDialog') {
        localStorage.removeItem(item);
      }
    });
    this.comunicationComponentService.openNotifications(false);
    this.comunicationComponentService.login(false);
    window.location.replace('/login');
  }

  notifications() {
    this.comunicationComponentService.openNotifications(true);
  }

  nextPlayer(type: number) {
    if (this.role === 'teacher') {
      let index = this.alumns.findIndex((a) => a.id === this.person.id);
      const currentURL = this.location.path();

      if (index + type >= 0 && index + type < this.alumns.length) {
        const url = currentURL.replace(
          String(this.alumns[index].id),
          this.alumns[index + type].id
        );
        this.router.navigateByUrl(url, { state: { sameView: true } });
      }
    } else {
      const id = this.players.findIndex((x) => x.id === this.person.id) + type;
      if (id > 0 && id < this.players.length) {
        this.appStateService.setPlayer(this.players[id]);
      } else if (id < 0) {
        this.appStateService.setPlayer(this.players[this.players.length - 1]);
      } else {
        this.appStateService.setPlayer(this.players[0]);
      }
    }
  }

  cambiar(language: any) {
    localStorage.setItem('languaje', language.value);
    this.idioma = language.value;
    window.location.reload();
  }

  CurrentNavPath(url: string) {
    const longUrl = url.split('/').length > 4;

    this.team = this.appStateService.getTeam();
    const role = localStorage.getItem('role');
    this.homePath = role === 'teacher' ? 'teacher' : 'club';
    if (url.includes('academy')) {
      this.currentRoute = role === 'teacher' ? 'home' : 'club';
      const replacedUrl = url.split('/');
      if (replacedUrl.length > 2 && replacedUrl.includes('members')) {
        this.currentRoute = 'members';
      }
      this.currentRouteForIcon = url;
      if (url.includes('/academy/teachers/')) {
        this.currentRoute = 'professor';
      }
    } else if (url.includes(`/${this.homePath}/`) || longUrl) {
      const replacedUrl = url.split('/');
      if (replacedUrl.length >= 3) {
        this.currentRoute =
          role === 'teacher' && replacedUrl[2] === 'home'
            ? 'class'
            : replacedUrl[2];
        this.currentRouteForIcon = replacedUrl[2];
      }
    } else if (url.includes('/rfd-injuries/')) {
      this.currentRoute = 'rfd-injuries';
    } else if (url === `/${this.homePath}/home`) {
      this.currentRoute = role === 'teacher' ? 'class' : 'team';
    } else if (url.includes('profile')) {
      if (url.includes('subscriptions')) {
        this.currentRoute = 'subscriptions';
      } else if (url.includes('licences')) {
        this.currentRoute = 'licences';
        this.currentRouteForIcon = 'licences';
      } else {
        this.currentRoute = 'profile';
        this.currentRouteForIcon = 'profile';
      }
    } else if (url.includes('club')) {
      this.currentRouteForIcon = url.substring(6);
    } else {
      return '';
    }
  }

  goProfile() {
    const local = this.role;
    if (local === 'teacher') {
      localStorage.setItem('role', 'sport');
    } else {
      localStorage.setItem('role', 'teacher');
    }
    this.appStateService.resetClub();
    this.appStateService.resetTeamOrClass();
    window.location.replace('/inicio');
  }

  checkProfile(): string {
    const local = this.role;
    return local === 'teacher' ? 'SPORT' : 'TEACHER';
  }

  /**
   * avatar image
   */
  getAvatar(gender: number): string {
    return gender === 1
      ? this.imgUrl + 'images/player/boy.svg'
      : this.imgUrl + 'images/player/girl.svg';
  }

  getSelectedPersonAvatar(gender: string) {
    if (this.role === 'teacher') {
      return gender === 'female' ? this.girlAlumnImage : this.boyAlumnImage;
    } else {
      return gender === 'female'
        ? this.imgUrl + 'images/player/girl.svg'
        : this.imgUrl + 'images/player/boy.svg';
    }
  }

  handleOpenSidebar(): void {
    this.openSidebar.emit(true);
  }

  ngOnDestroy(): void {
    if (this.subsPlayer) {
      this.subsPlayer.unsubscribe();
    }
    if (this.subsPlayers) {
      this.subsPlayers.unsubscribe();
    }
  }
}
