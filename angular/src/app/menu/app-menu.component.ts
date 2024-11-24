import {
  Component,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { ComunicationComponentService } from '../_services/comunicationComponent.service';
import { ActivatedRoute, NavigationEnd, Route, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ClubService } from '../_services/club.service';
import { AppStateService } from '../stateManagement/appState.service';
import { TranslateService } from '@ngx-translate/core';
import { AlertsApiService } from '../generals-services/alerts-api.service';
import { environment } from 'src/environments/environment';
import { SchoolService } from '../_services/school.service';
import { School } from '../_models/schools';
import { AuthenticationService } from '../_services/authentication.service';
import { User, UserSubscription } from '../_models/user';
import { ITeam } from '../_models/ITeam.interface';
import { Club } from '../_models/club';
import { AppStateQuery } from '../stateManagement/appState.query';
import { resourcesUrl } from '../utils/resources';

@Component({
  selector: 'app-menu',
  templateUrl: './app-menu.component.html',
  styleUrls: ['./app-menu.component.scss'],
})
export class AppMenuComponent implements OnInit, OnDestroy {
  role: string = 'sport';
  club: any;
  userData: User;
  dialog = false;
  miniSidebar = true;
  addSpaceDialog = false;
  clubs: any[] = [];
  schools: School[] = [];
  seletectClub: any;
  team: ITeam | null;
  routeSubscription: Subscription;
  loginSubscription: Subscription;
  recargaSubscription: Subscription;
  subscription: Subscription;
  loadingMenu: boolean = false;
  urlBase = environment.images;
  activesubscription: UserSubscription;
  packageQuantity: number | undefined;
  openSidebar = [
    '/profile/details',
    '/profile/subscriptions',
    '/profile/licences',
    '/profile/security',
    '/profile/invoices',
    '/profile/new-subscription-process',
    '/profile/my-exercises',
    '/club/workout/details/',
    '/subscription/licenses/',
  ];
  public rutaImagen: any = environment.images;
  showHeader = false;
  resources = resourcesUrl;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private clubService: ClubService,
    private translate: TranslateService,
    private appStateService: AppStateService,
    private comunicationComponentService: ComunicationComponentService,
    private msg: AlertsApiService,
    private schoolService: SchoolService,
    private authenticationService: AuthenticationService,
    private appStateQuery: AppStateQuery
  ) {}

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
    if (this.loginSubscription) {
      this.loginSubscription.unsubscribe();
    }
    if (this.recargaSubscription) {
      this.recargaSubscription.unsubscribe();
    }
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  getClubList() {
    this.clubs = [];
    this.loadingMenu = true;
    this.clubService.getList().subscribe(
      (res) => {
        this.clubs = res.data;
        this.appStateService.updateClubs(this.clubs);
        this.loadingMenu = false;
      },
      (error) => {
        this.router.navigate(['profile/subscriptions']);
        this.loadingMenu = false;
      }
    );
  }

  ngOnInit(): void {
    const isLogin = this.authenticationService.isLogin();
    this.userData = JSON.parse(localStorage.getItem('user') as any);
    this.role = localStorage.getItem('role') as string;
    // this.team = this.appStateService.getTeam();

    this.appStateQuery.team$.subscribe((res) => {
      this.team = res;
    });

    if (isLogin) {
      this.loadLists();
    }

    this.routeSubscription = this.router.events.subscribe((event) => {
      this.club = this.appStateService.getClub();
      if (event instanceof NavigationEnd) {
        this.miniSidebar = event.url !== '/inicio';
        this.showHeader = event.url === '/inicio';

        if (this.openSidebar.includes(event.url) && this.club === null) {
          this.miniSidebar = false;
        }

        if (
          event.url.includes('/club/workout/details/') &&
          this.club === null
        ) {
          this.miniSidebar = false;
        }
      }
    });
    this.loginSubscription =
      this.comunicationComponentService.miniSidebar$.subscribe((res) => {
        this.miniSidebar = res;
      });
    this.recargaSubscription =
      this.comunicationComponentService.recargaMenu$.subscribe((res) => {
        this.loadLists();
      });

    this.getUserProfileData();
  }

  /**
   * load club lis or school list
   */
  loadLists(): void {
    if (this.role === 'teacher') {
      this.getSchools();
    } else {
      this.getClubList();
    }
  }

  /**
   * get school center by teacher
   */
  getSchools(): void {
    this.loadingMenu = true;
    this.subscription = this.schoolService.getSchools().subscribe(
      (res) => {
        this.schools = res.data;

        this.loadingMenu = false;
      },
      ({ error }) => {
        this.router.navigate(['profile/subscriptions']);
        this.loadingMenu = false;
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
    }
  }

  sendEvent(event: any, academy?: any): void {
    this.miniSidebar = true;

    this.appStateService.updateClub(event);
    this.appStateService.updateShool(event);
    this.appStateService.resetTeamOrClass();

    if (academy) academy.hide();

    this.router.navigate(['academy/home/' + event.id]);
  }

  inicio() {
    this.miniSidebar = false;
    this.appStateService.resetClub();
    this.appStateService.resetSchool();
    this.appStateService.resetTeamOrClass();
    this.team = null;
    this.router.navigate(['inicio']);
  }
  profile() {
    this.miniSidebar = false;
    // this.appStateService.resetClub();
    this.router.navigate(['/profile/details']);
  }

  addSpace() {
    // if (this.role === 'sport' && this.clubs.length >= this.packageQuantity)
    // {

    //   this.msg.error(this.translate.instant('limitNumberOfClubs'));

    // } else if (this.role === 'teacher' && this.schools.length >= this.packageQuantity)
    // {
    //   this.msg.error(this.translate.instant('limitNumberOfSchools'))

    // } else
    // {

    this.comunicationComponentService.newSpace(true);
    // }
  }

  signOut(): void {
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

  verificar() {
    const token = localStorage.getItem('token');
    return !!token;
  }

  newVerify() {
    return true
  }
}
