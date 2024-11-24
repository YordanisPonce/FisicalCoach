import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import moment from 'moment';
import { Subscription } from 'rxjs';
import { AlertsApiService } from 'src/app/generals-services/alerts-api.service';
import { AppStateService } from 'src/app/stateManagement/appState.service';
import {
  FootBallMatchResults,
  Match,
  MatchStatus,
} from 'src/app/_models/competition';
import { IAccionesScoutingInterface } from 'src/app/_models/IAccionesScouting.interface';
import { ITeam } from 'src/app/_models/ITeam.interface';
import { Player } from 'src/app/_models/player';
import { Activity } from 'src/app/_models/scouting';
import { CompetitionService } from 'src/app/_services/competitions.service';
import { ScoutingService } from 'src/app/_services/scouting.service';
import { environment } from 'src/environments/environment';
import { resourcesUrl } from 'src/app/utils/resources';

type RPE = {
  code: string;
  id: number;
  image: {
    full_url: string;
  };
  name: string;
  number: string;
};

@Component({
  selector: 'app-match-details',
  templateUrl: './match-details.component.html',
  styleUrls: ['./match-details.component.scss'],
})
export class MatchDetailsComponent implements OnInit, OnDestroy {
  constructor(
    private scoutingService: ScoutingService,
    private competitionService: CompetitionService,
    private appStateservice: AppStateService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private msg: AlertsApiService
  ) {}

  matchId: string;
  team: ITeam;
  selectedMatch: Match;
  scoutingResults: FootBallMatchResults;
  scoutingStatus: Partial<MatchStatus>;

  scoutingStatistics: any[];
  playerStatistics: any[];
  playerName: string;
  $subs = new Subscription();
  loading: boolean = false;
  playerResultDialog: boolean = false;
  loadingActivityList: boolean = false;
  activityList: Activity[] = [];
  urlBase = environment.images;
  actions: IAccionesScoutingInterface[] = [];
  volleyballResults: string[] = [
    'volleyball',
    'beach_volleyball',
    'tennis',
    'padel',
    'badminton',
  ];
  rpeDialog: boolean = false;
  playerRpe: { id: number; rpeId: number; name: string };
  rpeList: RPE[] = [];
  playerList: Player[] = [];
  selectedPlayerList: Player[] = [];
  selectAllRpePlayers: boolean = false;
  resources = resourcesUrl;

  ngOnInit(): void {
    this.matchId = this.route.snapshot.paramMap.get('id') as string;
    this.team = this.appStateservice.getTeam();

    if (!this.matchId) this.location.back();

    this.getScoutingResults();
    this.getListOfScoutingActivities();
  }

  /**
   * list of scouting activities
   */
  getListOfScoutingActivities(): void {
    this.loadingActivityList = true;

    this.$subs = this.scoutingService
      .getListOfScoutingActivities(+this.matchId)
      .subscribe((res) => {
        const activityList = res.data.map((activity: Activity) => ({
          ...activity,
          in_game_time: this.parseTime(activity.in_game_time),
        }));

        const getActionsData = activityList
          .sort(
            (a: Activity, b: Activity) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
          )
          .map((activity: Activity) => {
            return {
              ...activity,
              created_at: moment(activity.created_at).format('HH:mm:ss'),
              action: activity.action,
            };
          });

        this.activityList = getActionsData;

        this.loadingActivityList = false;
      });
  }

  /**
   * scouting results
   */
  getScoutingResults(): void {
    this.loading = true;
    this.$subs = this.scoutingService
      .getMatchResults(parseInt(this.matchId), true)
      .subscribe(
        (res) => {
          if (res.success) {
            this.scoutingResults = res.data;

            if (this.scoutingResults?.statistics) {
              const toArray = Object.entries(this.scoutingResults.statistics);

              this.scoutingStatistics = toArray
                .filter((statistic) => statistic[1].show)
                .sort((a: any[], b: any[]) => {
                  return a[1]?.order - b[1]?.order;
                })
                .map((item) => ({
                  name: item[1].name,
                  value: item[1].value,
                  order: item[1].order,
                  image: item[1].image?.full_url,
                }));
            }

            this.getMatchData();
          } else {
            // throw new Error('Server Error')
          }
        },
        ({ error }) => {
          if (!error.success) {
            setTimeout(() => {
              this.location.back();
            }, 1000);
          }
        }
      );
  }

  /**
   * parseTime
   */
  parseTime(timer: number): any {
    let totalSeconds = timer;

    let hours = 0;
    let minutes = 0;
    let seconds = 0;

    if (totalSeconds >= 3600) {
      hours = Math.floor(totalSeconds / 3600);
      totalSeconds -= 3600 * hours;
    }

    if (totalSeconds >= 60) {
      minutes = Math.floor(totalSeconds / 60);
      totalSeconds -= 60 * minutes;
    }

    seconds = totalSeconds;

    return {
      hours: hours,
      minutes: minutes,
      seconds: seconds,
    };
  }

  /**
   * get match players and lineup
   */
  getMatchData(): void {
    this.$subs = this.competitionService
      .getMatchByTeam(parseInt(this.matchId), this.team.id)
      .subscribe(
        (res) => {
          this.selectedMatch = res.data;

          this.scoutingStatus = {
            created_at: this.selectedMatch.scouting?.created_at as string,
            status: this.selectedMatch.scouting?.status,
          };

          this.playerList = this.selectedMatch.players_match.map(
            (item: Player) => ({
              ...item.player,
              player_id: item.player_id,
              percept_effort: item.percept_effort,
              perception_effort_id: item.perception_effort_id,
            })
          );

          this.loading = false;
        },
        ({ error }) => {
          if (!error.success) {
            setTimeout(() => {
              this.location.back();
            }, 1000);
          }
        }
      );
  }

  /**
   * refresh list
   */
  refreshPlayerList(): void {
    this.rpeDialog = false;
    this.getMatchData();
    this.selectedPlayerList = [];
  }

  /**
   * get player results
   */
  playerResults(playerId: number, playerName: string): void {
    this.$subs = this.scoutingService
      .getPlayerResults(parseInt(this.matchId), playerId)
      .subscribe(
        (res) => {
          const toArray = Object.entries(res.data.statistics);

          const statistics = toArray
            .filter((item: any) => item[1].show)
            .sort((a: any[], b: any[]) => {
              return a[1]?.order - b[1]?.order;
            })
            .map((item: any) => ({
              name: item[1].name,
              value: item[1].value,
              order: item[1].order,
              image: item[1].image?.full_url,
            }));

          this.playerStatistics = statistics;
          this.playerName = playerName;

          this.playerResultDialog = true;
        },
        ({ error }) => {
          this.msg.error(error);
        }
      );
  }

  /**
   * Open calculate rpf dialog
   */
  openRpfDialog(id: number, rpeId: number, name: string): void {
    const data = { id, rpeId, name };
    this.playerRpe = data;
    this.rpeDialog = true;
  }

  /**
   * Open calculate rpf dialog
   */
  openRpfDialogWithPlayers(): void {
    this.playerRpe = {
      id: 0,
      name: '',
      rpeId: 0,
    };
    this.rpeDialog = true;
  }

  /**
   * match set list by match situation
   */
  matchSetList(
    ownSet: number[],
    rivalSet: number[],
    situation: string
  ): { rival: number; own: number }[] {
    let list: { rival: number; own: number }[];

    if (situation === 'L') {
      list = ownSet.map((set, i) => ({ own: set, rival: rivalSet[i] }));
    } else {
      list = rivalSet.map((set, i) => ({ own: set, rival: ownSet[i] }));
    }

    return list;
  }

  /**
   * navigate to previous path
   */
  goBack(): void {
    this.location.back();
  }

  /**
   * go to scouting results
   */
  goToScouting(): void {
    this.router.navigateByUrl('/club/scouting', {
      state: {
        history: true,
        match: JSON.stringify(this.selectedMatch),
      },
    });
  }

  /**
   * get minutes
   */
  parseSeconds(in_game_time: string): string {
    const seconds = parseInt(in_game_time);
    const minutes = Math.floor(seconds / 60);
    const restSeconds = seconds % 60;
    const time = `${
      minutes === 0 ? '00' : minutes < 10 ? `0${minutes}` : minutes
    }:${restSeconds.toString().padStart(2, '0')}`;

    return time;
  }

  ngOnDestroy(): void {
    if (this.$subs) this.$subs.unsubscribe();
  }
}
