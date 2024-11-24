import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Club } from '../../../_models/club';
import { ComunicationComponentService } from '../../../_services/comunicationComponent.service';
import { ClubService } from '../../../_services/club.service';
import { TeamService } from '../../../_services/team.service';
import { AppStateService } from 'src/app/stateManagement/appState.service';
import { environment } from 'src/environments/environment';
import { SchoolService } from 'src/app/_services/school.service';
import { AlertsApiService } from 'src/app/generals-services/alerts-api.service';
import moment from 'moment';

@Component({
  selector: 'app-academy',
  templateUrl: './academy.component.html',
  styleUrls: ['./academy.component.scss'],
})
export class AcademyComponent implements OnInit {
  teams: any[] = [];
  clubs: Club[] = [];
  activities: any[] = [];
  loading: boolean = true;
  loadingScroll: boolean = true;
  urlBase = environment.images;
  role: string;
  newTeamDialog: boolean = false;
  responsiveOptions: any[] = [];
  showAllActivities: boolean = false;
  page: number = 1;
  last_page: number = 1;
  clubId: number;

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    private clubService: ClubService,
    private teamService: TeamService,
    private schoolService: SchoolService,
    private comunicacionService: ComunicationComponentService,
    private appStateService: AppStateService,
    private msg: AlertsApiService
  ) {
    this.responsiveOptions = [
      {
        breakpoint: '1560px',
        numVisible: 2,
        numScroll: 1,
      },
      {
        breakpoint: '1024px',
        numVisible: 1,
        numScroll: 1,
      },
      {
        breakpoint: '560px',
        numVisible: 1,
        numScroll: 1,
      },
    ];
  }

  ngOnInit(): void {
    this.role = localStorage.getItem('role') as string;
    this.route.params.subscribe((params: Params) => {
      if (+params.idClub > 0) {
        if (this.role === 'sport') {
          this.getClub(+params.idClub);
        }
        this.clubId = +params.idClub;
        if (this.role === 'teacher') {
          this.loading = false;
          this.getActivities(+params.idClub, false);
          this.getClasses(+params.idClub);
        } else {
          this.getActivities(+params.idClub, false);
          this.getTeams(+params.idClub);
        }
      }
    });
  }

  getClub(idClub: number) {
    this.clubService.getList().subscribe(
      (res) => {
        this.clubs = res.data;
        const temp = this.clubs.find((x) => x.id === idClub);
        this.comunicacionService.sendClub(temp);
      },
      ({ error }) => {
        this.msg.error(error);
      }
    );
  }

  showActivityList(show: boolean): void {
    if (!show) {
      this.showAllActivities = false;
    } else {
      this.showAllActivities = show;
    }
  }

  getActivities(idClub: number, isScrolled: boolean) {
    this.loading = !isScrolled;
    this.loadingScroll = isScrolled;
    this.clubService
      .getHistoryActivities(idClub, 'club', this.role, this.page)
      .subscribe(
        (res) => {
          this.activities = [...this.activities, ...res.data.data];
          this.last_page = res.data.last_page;
          this.loading = false;
          this.loadingScroll = false;
        },
        (error) => {
          this.loading = false;
          this.loadingScroll = false;
          this.msg.error(error);
        }
      );
  }

  crearEquipo() {
    this.newTeamDialog = true;
  }

  updateClub(team: any): void {
    this.appStateService.updateTeam(team);
  }

  getTeams(idClub: any) {
    this.teamService.getList(idClub).subscribe(
      (res) => {
        this.teams = res.data;
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

  getClasses(idClub: any) {
    this.schoolService.getClasses(idClub).subscribe(
      (res) => {
        this.teams = res.data;
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

  checkActiveAcademicYear(classInfo: any): string {
    const isActive: boolean = classInfo.is_active;
    if (isActive) {
      const start_date = moment(classInfo.start_date).format('DD/MM/YYYY');
      const end_date = moment(classInfo.end_date).format('DD/MM/YYYY');
      return `${start_date} - ${end_date}`;
    }
    return '';
  }

  checkActiveAcademicPeriod(period: any[]): string {
    const findActivePeriod: any = period.find(
      (item: { is_active: boolean }) => item.is_active
    );
    if (!!findActivePeriod) {
      const start_date = moment(findActivePeriod.start_date).format(
        'DD/MM/YYYY'
      );
      const end_date = moment(findActivePeriod.end_date).format('DD/MM/YYYY');
      return `${start_date} - ${end_date}`;
    }
    return '';
  }

  refreshActivities(): void {
    this.page = this.page + 1;

    if (this.page <= this.last_page) this.getActivities(this.clubId, true);
  }
}
