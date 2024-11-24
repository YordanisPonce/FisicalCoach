import { Component, OnDestroy, OnInit } from '@angular/core';
import { ScoutingService } from '../../../../_services/scouting.service';
import { AppStateQuery } from '../../../../stateManagement/appState.query';
import { ITeam } from '../../../../_models/ITeam.interface';
import { MenuItem } from 'primeng/api';
import { Match, MatchResult } from 'src/app/_models/competition';
import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs';
import { AlertsApiService } from 'src/app/generals-services/alerts-api.service';
import { MatchPlayer } from 'src/app/_models/player';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { scoutingGeneralFilter } from 'src/app/utils/filterOptions';

@Component({
  selector: 'app-scouting',
  templateUrl: './scouting.component.html',
  styleUrls: ['./scouting.component.scss'],
})
export class ScoutingComponent implements OnInit, OnDestroy {
  listadoPartidos: any[] = [];
  scoutingDialog = false;
  loading: boolean = false;
  team: ITeam;
  indexMatches: any;
  openAlertDialog: boolean = false;
  selectedMatch: any;
  historyMatch: Match;
  scoutingStatus: any;
  urlBase = environment.images;
  matchResults: MatchResult;
  matchPlayers: MatchPlayer[] = [];
  matchInfo: any;
  matchId: number;
  subs = new Subscription();
  views: {
    name: string;
    value: string;
  }[] = [];
  selectedView: string = '';
  openHistoryInputs: boolean = false;
  selectedFilter: any;
  filterOptions: any[] | undefined;

  matchList: any[] = [];
  allMatches: any[] = [];
  searchMatch: string;

  constructor(
    private scoutingService: ScoutingService,
    private appStateQuery: AppStateQuery,
    private msg: AlertsApiService,
    private router: Router,
    private translateService: TranslateService
  ) {
    const navigation = this.router.getCurrentNavigation();

    if (navigation?.extras?.state?.history) {
      const match: Match = JSON.parse(navigation?.extras?.state?.match);

      this.selectedView = 'history=1';
      this.historyMatch = {
        ...match,
        match_id: match.id,
      };
      this.openHistoryInputs = true;
    }
  }

  items: MenuItem[];

  ngOnInit(): void {
    this.appStateQuery.team$.subscribe((res: ITeam) => {
      this.team = res;

      if (this.team.sport.code !== 'swimming') {
        this.views = [
          { name: 'recent_matches', value: '' },
          { name: 'match_history', value: 'history=1' },
        ];
      } else {
        this.views = [
          { name: 'recent_test', value: '' },
          { name: 'test_history', value: 'history=1' },
        ];
      }
    });

    this.getMatches('');

    this.translateService
      .get('competition_details.match_dialog')
      .subscribe((res) => {
        this.filterOptions = scoutingGeneralFilter.map((item) => ({
          ...item,
          label: res[item.code],
          children: item.children.map((child) => ({
            ...child,
            label: res['competition_type'][child.code],
          })),
        }));
      });
  }

  getMatches(filter: string = ''): void {
    this.loading = true;

    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const params = `timezone=${timezone}${filter ? `&${filter}` : ''}`;

    this.scoutingService
      .getListbyTeam(this.team.id, params)
      .subscribe((res) => {
        this.matchList = res.data;
        this.allMatches = res.data;

        this.loading = false;
      });
  }

  /**
   * start scouting
   */
  startScouting(event: any): void {
    if (event.isStarted) {
      this.scoutingMatchInformation(event.match.match_id);
    } else {
      this.matchId = event.match.match_id;
      this.openAlertDialog = true;
    }
  }

  /**
   * get Scouting match information
   */
  scoutingMatchInformation(
    match_id: number,
    isNewScouting = false,
    start_match: string = '',
    sets?: number
  ): void {
    this.subs = this.scoutingService
      .getScoutingMatchInfo(match_id)
      .subscribe((res) => {
        this.selectedMatch = {
          ...res.data.competition_match,
          team: res.data.competition_match.competition.team,
          match_id,
        };

        this.scoutingStatus = res.data;

        if (start_match || sets !== 0) {
          this.subs = this.scoutingService
            .setTeamToStartScouting(this.scoutingStatus.id, start_match, sets)
            .subscribe(
              (res) => {
                this.scoutingDialog = true;

                this.openAlertDialog = false;
              },
              ({ error }) => {
                this.msg.error(error);
                this.loading = false;
              }
            );
        } else {
          this.scoutingDialog = true;
          this.openAlertDialog = false;
        }
      });
  }

  /**
   * open scouting history
   */
  handleScoutingHistory(event: any): void {
    this.historyMatch = event.match;
    this.openHistoryInputs = true;
  }

  /**
   * reults of a competition match
   */
  getMatchResults(match: any): void {
    this.subs = this.scoutingService.getMatchResults(match.match_id).subscribe(
      (res) => {
        if (res.success) {
          this.scoutingDialog = true;
        }
      },
      ({ error }) => {
        if (error.message) {
          this.msg.error(error.message);
        }
      }
    );
  }

  /**
   * refresh list
   */

  refreshList(): void {
    this.openAlertDialog = false;

    this.getMatches();
  }

  /**
   * close init dialog
   */
  closeStartScoutingDialog(): void {
    this.openAlertDialog = false;
  }

  /**
   * initialize scouting with dialog
   */
  startScoutingDialog({ matchId = 0, start_match = '', sets = 0 }): void {
    this.scoutingMatchInformation(matchId, true, start_match, sets);
  }

  /**
   * pause scouting
   */
  pauseScouting(match: { info: any; time: number }): void {
    this.scoutingDialog = false;

    this.getMatches();
  }

  /**
   * search scouting
   */

  setValue(e: KeyboardEvent) {
    const filterCompetition = this.allMatches?.filter(
      (item) =>
        item.competition_name.toLowerCase().includes(this.searchMatch) ||
        item.competition_rival_team?.rival_team
          ?.toLowerCase()
          .includes(this.searchMatch)
    );

    if (this.searchMatch.length > 0) {
      this.matchList = filterCompetition;
    } else {
      this.matchList = this.allMatches;
    }
  }

  /**
   * select scouting list
   */
  handleScoutingList(type: any): void {
    this.openHistoryInputs = false;
    this.getMatches(type);
  }

  /**
   * handle filter
   */
  handleSelectFilter(): void {
    this.matchList = this.allMatches;

    if (this.selectedFilter.code === 'match_situation') {
      this.selectedFilter = null;
      return;
    }

    this.matchList = this.matchList.filter(
      (match) => match?.match_situation === this.selectedFilter.id
    );
  }

  ngOnDestroy(): void {
    if (this.subs) this.subs.unsubscribe();
  }
}
