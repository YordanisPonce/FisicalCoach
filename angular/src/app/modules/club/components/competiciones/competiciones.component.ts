import { Component, OnInit, OnDestroy } from '@angular/core';

import { Competition, Match } from '../../../../_models/competition';
import { CompetitionService } from '../../../../_services/competitions.service';
import { AppStateService } from '../../../../stateManagement/appState.service';

import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AlertsApiService } from 'src/app/generals-services/alerts-api.service';
import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { TeamService } from 'src/app/_services/team.service';
import { ITeam } from 'src/app/_models/ITeam.interface';
import { PermissionMethods } from 'src/app/_directivas/user-permission.directive';
import { ConfirmationService } from 'primeng/api';
import { resourcesUrl } from 'src/app/utils/resources';
import {
  competitionFilterTennis,
  competitionSwimmingFilter,
  competitonGeneralFilter,
} from 'src/app/utils/filterOptions';

@Component({
  selector: 'app-competiciones',
  templateUrl: './competiciones.component.html',
  styleUrls: ['./competiciones.component.scss'],
})
export class CompeticionesComponent implements OnInit, OnDestroy {
  games = [
    {
      name: 'Proximos',
    },
    {
      name: 'Recientes',
    },
  ];
  loading: boolean = false;
  loadingNextMatches: boolean = false;
  loadingRecentMatches: boolean = false;
  createCompetitionDialog: boolean = false;
  reloadCompetitions: boolean = false;
  team: ITeam;
  competitions: Competition[];
  allCompetitions: Competition[];
  searchCompetition: string;
  subs: Subscription;
  urlBase = environment.images;
  filterType: any[];
  selectedFilter: any;
  filterOptions: any[] | undefined;
  recentMatches: Match[] = [];
  nextMatches: Match[] = [];
  editDialog: boolean = false;
  selectedCompetition: Competition | null;
  showPermission: PermissionMethods;
  resources = resourcesUrl;

  constructor(
    private competitionService: CompetitionService,
    private teamService: TeamService,
    private appStateService: AppStateService,
    public msg: AlertsApiService,
    private confirmationService: ConfirmationService,
    private translate: TranslateService
  ) {
    // get competition translations
    this.translate.get('competition').subscribe((res) => {
      this.games = [
        {
          name: res.next_competitions,
        },
        {
          name: res.recent_competitions,
        },
      ];
    });
  }

  ngOnInit(): void {
    this.team = this.appStateService.getTeam();
    this.getCompetitions();

    this.getNextAndRecentMatchestByTeam(this.team.id);

    if (
      this.team.sport.code !== 'swimming' &&
      this.team.sport.code !== 'tennis'
    ) {
      this.translate
        .get('competition.filter.competition_type')
        .subscribe((res) => {
          this.filterOptions = competitonGeneralFilter.map((item) => ({
            ...item,
            label: res[item.code],
          }));
        });
    }

    if (this.team.sport.code === 'tennis') {
      this.translate.get('competition').subscribe((res) => {
        this.filterOptions = competitionFilterTennis.map((item) => ({
          ...item,
          label: res[item.code],
        }));
      });
    }

    if (this.team.sport.code === 'swimming') {
      this.translate.get('competition').subscribe((res) => {
        this.filterOptions = competitionSwimmingFilter.map((item) => ({
          ...item,
          label: res[item.code],
        }));
      });
    }
  }

  /**
   * Get competitios by team
   */
  getCompetitions(): void {
    this.loading = true;
    const id = this.team.id;

    this.subs = this.competitionService
      .getCompetitionsListByTeam(id)
      .subscribe(async (res) => {
        this.competitions = res.data;

        this.allCompetitions = res.data;
        this.loading = false;
      });
  }

  /**
   * Get next annd recent match competitions
   */
  getNextAndRecentMatchestByTeam(id: number): void {
    this.loadingNextMatches = true;
    this.loadingRecentMatches = true;

    this.teamService.getAllMatchesbyTeam(id).subscribe(async (res: any) => {
      const data = res.data;

      this.recentMatches = data.recent;
      this.nextMatches = data.next;

      this.loadingRecentMatches = false;
      this.loadingNextMatches = false;
    });
  }

  /**
   * get match date
   * @param date
   * @returns date
   */
  parseMatchDate(date: string): string {
    return moment(date).format('DD/MM/YYYY');
  }

  /**
   * Order competitions
   */
  handleOrderData(value: string): void {
    if (value === 'asc') {
      this.competitions = _.orderBy(
        this.competitions,
        [(competition: any) => competition.name.toLowerCase()],
        [value]
      );
    }
    if (value === 'desc') {
      this.competitions = _.orderBy(
        this.competitions,
        [(competition: any) => competition.name.toLowerCase()],
        [value]
      );
    }
  }

  /**
   * Filter competitions
   * @param e
   */
  handleFilter(e: any): void {
    const event = e.value || '';
    let filteredData = [];

    if (event?.code === 'all') {
      filteredData = this.allCompetitions;
    } else {
      filteredData = this.allCompetitions.filter(
        (competition) => competition.type_competition_name === event?.name
      );
    }

    if (filteredData.length > 0) {
      this.competitions = filteredData;
    } else {
      this.msg.error('Sin resultados');
      this.competitions = this.allCompetitions;
    }
  }

  /**
   * Refresh competitions after create one
   * @param success
   */
  refreshCompetitions(success: boolean): void {
    if (success) {
      this.getCompetitions();
    }
  }

  /**
   * Filter competition
   * @param e Event
   */
  setValue(e: KeyboardEvent) {
    const filterCompetition = this.competitions?.filter((item) =>
      item.name.toLowerCase().includes(this.searchCompetition)
    );

    if (this.searchCompetition.length > 0) {
      this.competitions = filterCompetition;
    } else {
      this.competitions = this.allCompetitions;
    }
  }

  /**
   * Select competition to edit
   */
  editCompetition(competition: Competition): void {
    this.subs = this.competitionService
      .getRivalTeamsByCompetitionId(competition.id as number)
      .subscribe((res) => {
        this.selectedCompetition = {
          ...competition,
          rivals: res.data,
        };

        this.createCompetitionDialog = true;
      });
  }

  /**
   * delete competition
   */
  deleteCompetition(competitionId: number = 0): void {
    this.loading = true;
    this.subs = this.competitionService
      .deleteCompetition(competitionId)
      .subscribe(
        (res) => {
          this.msg.succes(res.message);
          this.getCompetitions();
        },
        ({ error }) => {
          this.msg.error(error);
          this.loading = false;
        }
      );
  }

  closeDialog(): void {
    this.createCompetitionDialog = false;
    this.selectedCompetition = null;
  }

  /**
   * handle filter
   */
  handleSelectFilter(): void {
    this.competitions = this.allCompetitions;

    if (
      this.team.sport.code !== 'swimming' &&
      this.team.sport.code !== 'tennis'
    ) {
      this.competitions = this.competitions.filter(
        (competition) =>
          competition?.type_competition?.code === this.selectedFilter.code
      );
    }

    if (this.team.sport.code === 'swimming') {
      this.competitions = this.competitions.filter(
        (competition) =>
          competition?.type_competition?.code === this.selectedFilter.code
      );
    }

    if (this.team.sport.code === 'tennis') {
      this.competitions = this.competitions.filter(
        (competition) =>
          competition?.type_competition?.code === this.selectedFilter.code
      );
    }
  }

  handleOrderFilter(orderBy: any): void {
    if (orderBy.tooltip === 'asc') {
      this.competitions = this.competitions.sort((a, b) => {
        const dateA = new Date(a.created_at).getTime();

        const dateB = new Date(b.created_at).getTime();
        return dateA - dateB;
      });
    }

    if (orderBy.tooltip === 'desc') {
      this.competitions = this.competitions.sort((a, b) => {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return dateB - dateA;
      });
    }
  }

  handlePermission(permission: PermissionMethods): void {
    this.showPermission = { ...this.showPermission, ...permission };
  }

  confirm(data: any) {
    this.confirmationService.confirm({
      header: this.translate.instant('LBL_CONFIRM_DELETE'),
      message: this.translate.instant('LBL_CONFIRM_DIALOG'),
      acceptLabel: this.translate.instant('LBL_YES'),
      rejectLabel: this.translate.instant('LBL_NO'),
      accept: () => {
        this.deleteCompetition(data);
      },
    });
  }

  delete(event: any) {
    this.confirm(event);
  }

  ngOnDestroy(): void {
    if (this.subs) this.subs.unsubscribe();
  }
}
