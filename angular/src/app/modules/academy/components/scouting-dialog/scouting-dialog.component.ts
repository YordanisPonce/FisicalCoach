import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { IAccionesScoutingInterface } from '../../../../_models/IAccionesScouting.interface';
import { ScoutingService } from '../../../../_services/scouting.service';
import { environment } from '../../../../../environments/environment';
import { ITeam } from '../../../../_models/ITeam.interface';
import { AppStateService } from 'src/app/stateManagement/appState.service';
import { interval, Subject, Subscription } from 'rxjs';

import { MatchPlayer, Player, PlayerType } from 'src/app/_models/player';
import { AlertsApiService } from 'src/app/generals-services/alerts-api.service';
import { Activity } from 'src/app/_models/scouting';
import * as moment from 'moment';
import { MatchResult } from 'src/app/_models/competition';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

export interface Entry {
  created: Date;
  id: string;
}

export interface TimeSpan {
  hours: number;
  minutes: number;
  seconds: number;
}

@Component({
  selector: 'app-scouting-dialog',
  templateUrl: './scouting-dialog.component.html',
  styleUrls: ['./scouting-dialog.component.scss'],
})
export class ScoutingDialogComponent implements OnInit, OnDestroy {
  @Output() close: EventEmitter<any> = new EventEmitter<any>();
  @Input() matchInfo: any;
  @Input() matchPlayers: MatchPlayer[];

  subs = new Subscription();
  timerSubs = new Subscription();
  destroyed$ = new Subject();

  actions: IAccionesScoutingInterface[] = [];
  filteredActions: IAccionesScoutingInterface[] = [];
  loadingActions: boolean = false;
  selectedAction: any;
  selectedPlayer: any;
  selectedAlternatePlayer: any;
  substitution: boolean = false;
  urlBaseImagenes = environment.images;
  show: boolean = false;
  team: ITeam;
  teamPosition: number = 1;
  selectedTeam: any;
  matchResults: MatchResult | any;
  selectType: string = 'team';
  players: MatchPlayer[] = [];
  loadingPlayers: boolean = false;
  activityList: Activity[] = [];
  loadingActivityList: boolean = false;
  loadingUndo: boolean = false;
  loadingRedo: boolean = false;
  isScoutingPaused: boolean = false;
  scoutingStatus: any;
  loadingStatus: boolean = false;
  in_game_time: Entry;
  isRunning: boolean = false;
  time: number = 0;
  periodTime: number = 0;
  pausedTime: {
    hours: number;
    minutes: number;
    seconds: number;
  };
  pausedPeriodTime: {
    hours: number;
    minutes: number;
    seconds: number;
  };
  headlinePlayers: any[] = [];
  alternatePlayers: any[] = [];
  sportCode: string;
  holdPlayerSelected: boolean = false;
  loadingAction: boolean = false;
  showFinishScoutingDialog: boolean = false;
  loadingFinishScouting: boolean = false;

  sportsWithSubstitution: {
    name: string;
    headlineId: number;
    alternateId: number;
    captainId: number;
  }[] = [];
  baseballBoard = ['baseball'];
  allowSubstitution = ['football'];
  defaultSports = [
    'football',
    'indoor_soccer',
    'waterpolo',
    'field_hockey',
    'roller_hockey',
    'ice_hockey',
    'handball',
    'american_soccer',
    'rugby',
    'cricket',
    'basketball',
    'volleyball',
    'beach_volleyball',
  ];
  noSubstitution = ['swimming', 'tennis', 'padel', 'cricket'];
  tennisBoard = ['tennis', 'padel', 'badminton'];
  timerPaused = ['NOT_STARTED', 'PAUSED', 'FINISHED'];
  timerStarted = ['STARTED'];
  alternateFootbalCounter: number = 0;
  substitutionActionId: number;
  allowedRivalBaseballActions: string[] = [
    'own_balls',
    'balk',
    'catch',
    'assists',
    'own_errors',
    'injury_incidents',
    'injuries',
  ];

  displayAction: boolean = false;

  constructor(
    public scoutingService: ScoutingService,
    public appStateService: AppStateService,
    public translateService: TranslateService,
    public msg: AlertsApiService,
    public router: Router
  ) {}

  @Input() set visible(value: boolean) {
    this.show = value;
  }

  closeDialog(isFinished: boolean = false) {
    if (
      this.scoutingStatus.status === 'PAUSED' ||
      this.scoutingStatus.status === 'NOT_STARTED'
    ) {
      this.close.emit({ info: this.matchInfo, time: this.time });
      this.loadingAction = false;
    } else {
      this.pauseScouting(false, true);
    }
  }

  ngOnInit(): void {
    this.team = this.appStateService.getTeam();
    this.in_game_time = {
      created: new Date(),
      id: 'firts',
    };
    this.isScoutingPaused = true;
    this.pausedTime = {
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
    this.pausedPeriodTime = {
      hours: 0,
      minutes: 0,
      seconds: 0,
    };

    if (this.matchInfo?.lineup_player?.length > 0) {
      const types = this.matchInfo?.lineup_player as PlayerType[];
      const headlineId =
        types.find((type) => type.code === 'starting')?.id || 1;
      const alternateId =
        types.find((type) => type.code === 'substitutes')?.id || 2;
      const captainId =
        types.find((type) => type.code === 'team_captain')?.id || 3;

      if (this.team.sport.code !== 'baseball') {
        this.sportsWithSubstitution = [
          {
            name: this.team.sport.code,
            headlineId,
            alternateId,
            captainId,
          },
        ];
      }
    }

    this.getActionsBySport();
    // this.getMatchResults();
    this.getScoutingStatus();

    this.timerSubs = interval(1000).subscribe((ellapsedCycles) => {
      if (
        this.scoutingStatus &&
        !this.timerPaused.includes(this.scoutingStatus?.status)
      ) {
        this.time++;
        this.periodTime++;
        localStorage.setItem('scoutingTimer', this.time.toString());
        localStorage.setItem('scoutingPeriodTimer', this.periodTime.toString());

        if (this.scoutingStatus.status === 'NOT_STARTED') {
          this.periodTime = 0;
          localStorage.setItem('scoutingPeriodTimer', '0');
        }
      }
    });
  }

  /**
   * returns sport list
   */
  sportList(): string[] {
    return this.sportsWithSubstitution.map((item) => item.name);
  }

  /**
   * returns sport list
   */
  findSport(sportCode: string): boolean {
    return !!this.sportsWithSubstitution.find(
      (item) => item.name === sportCode
    );
  }

  /**
   * returns players type id
   */
  getPlayersTypeId(type: string): any {
    if (type === 'headline') {
      const headlines = this.sportsWithSubstitution.map(
        (item) => item.headlineId
      );
      const captains = this.sportsWithSubstitution.map(
        (item) => item.captainId
      );

      return [...headlines, ...captains];
    }

    return this.sportsWithSubstitution.map((item) => item.alternateId);
  }

  /**
   * stopwatch
   * @param entry
   * @returns time
   */
  getElapsedTime(timer: number): TimeSpan {
    if (!this.loadingStatus) {
      return this.parseTime(timer);
    } else {
      return {
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    }
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
   * Get scouting status
   */
  getScoutingStatus(isPeriodAction = false): void {
    this.loadingStatus = true;

    this.subs = this.scoutingService
      .getScoutingStatus(this.matchInfo.match_id)
      .subscribe((res) => {
        this.scoutingStatus = res.data;

        if (this.scoutingStatus.status === 'PAUSED') {
          this.time = parseInt(this.scoutingStatus.in_game_time);
          this.periodTime = parseInt(this.scoutingStatus.in_period_time);

          const pausedTime = this.parseTime(this.time);
          const pausedPeriodTime = this.parseTime(this.periodTime);

          this.pausedTime = {
            hours: pausedTime.hours,
            minutes: pausedTime.minutes,
            seconds: pausedTime.seconds,
          };
          this.pausedPeriodTime = {
            hours: pausedPeriodTime.hours,
            minutes: pausedPeriodTime.minutes,
            seconds: pausedPeriodTime.seconds,
          };
        }

        if (
          this.scoutingStatus &&
          this.timerStarted.includes(this.scoutingStatus?.status)
        ) {
          if (!!localStorage.getItem('scoutingTimer')) {
            const time = localStorage.getItem('scoutingTimer');
            const periodTime = localStorage.getItem(
              'scoutingPeriodTimer'
            ) as string;

            if (time) {
              this.time = parseInt(time);

              this.periodTime = parseInt(periodTime);
            }
          }
          this.isScoutingPaused = false;
        }

        this.loadingStatus = false;
      });
  }

  /**
   * Get acitons by sport
   */
  getActionsBySport(): void {
    this.loadingActions = true;
    const filterActions = ['substitution', 'period'];

    this.subs = this.scoutingService
      .getActionsbySport(this.matchInfo.team?.sport.code)
      .subscribe((res) => {
        this.actions = res.data;
        this.loadingActions = false;

        this.substitutionActionId = this.actions.find(
          (action) => action.code === 'substitution'
        )?.id as number;

        this.filteredActions = res.data.filter(
          (action) => !filterActions.includes(action.code)
        );

        this.getListOfScoutingActivities();
      });
  }

  /**
   * select sport action
   */
  selectAction(actionParam: number): any {
    if (
      this.sportsWithSubstitution.find(
        (item) => item.name === this.sportCode
      ) ||
      this.noSubstitution.find((item) => item === this.sportCode)
    ) {
      this.actionWithSubstitution(actionParam);
    }
    if (this.baseballBoard.includes(this.sportCode)) {
      this.baseballActions(actionParam);
    }
  }

  /**
   * store activity
   * @param customParams
   */
  storeActivity(customParams: any): void {
    this.loadingAction = true;
    this.scoutingService
      .storeActivity(this.matchInfo.match_id, customParams)
      .subscribe(
        (res) => {
          if (res.success) {
            // call activity list to refresh the data
            this.getListOfScoutingActivities();

            if (!this.holdPlayerSelected) {
              this.selectedPlayer = null;
              this.selectType = 'team';
            }

            if (customParams?.slug && customParams.slug === 'period') {
              this.pauseScouting(true);
            }

            if (
              customParams?.custom_params?.slug &&
              customParams.custom_params.slug === 'substitution'
            ) {
              this.substitution = false;
            }
          }
          this.loadingAction = false;
        },
        ({ error }) => {
          this.msg.error(error);
          this.loadingAction = false;
        }
      );
  }

  /**
   * select player
   */
  selectPlayer(player: Player, type = 'headline', e?: any): void {
    if (
      this.sportsWithSubstitution.find((item) => item.name === this.sportCode)
    ) {
      this.selectFootballPlayers(type, player, e);
    }
    if (this.baseballBoard.includes(this.sportCode)) {
      this.selectBaseballPlayers(player, e);
    }
  }

  /**
   * open alterntate list
   */
  openAlternateList(): void {
    if (
      this.selectedPlayer?.isSubstituted &&
      this.allowSubstitution.includes(this.sportCode)
    ) {
      this.msg.error(
        `${
          this.selectedPlayer.player.full_name
        } ${this.translateService.instant('scouting.hasAlreadyReplaced')}`,
        2000
      );
    } else {
      this.substitution = true;
    }
  }

  /**
   * list of scouting activities
   */
  getListOfScoutingActivities(): void {
    this.loadingActivityList = true;

    this.getMatchResults();

    this.subs = this.scoutingService
      .getListOfScoutingActivities(this.matchInfo.match_id)
      .subscribe((res) => {
        let activityList = res.data.map((activity: Activity) => ({
          ...activity,
          in_game_time: this.parseTime(activity.in_game_time),
        }));

        const getActionsByAsc = [
          ...activityList.map((activity: Activity) => {
            const action = this.actions.find(
              (action) => action.id === activity.action_id
            );

            return {
              ...activity,
              created_at: moment(activity.created_at).format('HH:mm:ss'),
              action: action,
            };
          }),
        ];

        this.activityList = getActionsByAsc;

        this.activityList.forEach((activity) => {
          const custom_params = JSON.parse(activity.custom_params);

          if (
            activity.action.code === 'substitution' &&
            custom_params &&
            this.sportsWithSubstitution.find(
              (item) => item.name === this.team.sport.code
            )
          ) {
            this.matchPlayers = this.matchPlayers.map((player) => {
              if (player.player_id === custom_params.player_in.id) {
                player.lineup_player_type_id = this.playerTypeId(
                  this.team.sport.code,
                  'headline'
                );

                return { ...player, isSubstituted: true };
              } else if (player.player_id === custom_params.player_out.id) {
                player.lineup_player_type_id = this.playerTypeId(
                  this.team.sport.code,
                  'alternate'
                );

                return { ...player, isSubstituted: true };
              } else {
                return {
                  ...player,
                };
              }
            });

            this.headlinePlayers = this.matchPlayers.filter((item) =>
              this.filterPlayers(
                this.team.sport.code,
                item.lineup_player_type_id,
                'headline'
              )
            );

            this.alternatePlayers = this.matchPlayers.filter((item) =>
              this.filterPlayers(
                this.team.sport.code,
                item.lineup_player_type_id,
                'alternate'
              )
            );
          }
        });

        const getActionsDataByCurrentDate = [
          ...activityList
            .sort(
              (a: Activity, b: Activity) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime()
            )
            .map((activity: Activity) => {
              const action = this.actions.find(
                (action) => action.id === activity.action_id
              );

              return {
                ...activity,
                created_at: moment(activity.created_at).format('HH:mm:ss'),
                action: action,
              };
            }),
        ];

        this.activityList = getActionsDataByCurrentDate;

        this.loadingActivityList = false;
      });
  }

  /**
   * undo activity registered
   */
  undoActivity(): void {
    this.loadingUndo = true;
    this.subs = this.scoutingService
      .undoActivity(this.matchInfo.match_id)
      .subscribe(
        (res) => {
          this.getListOfScoutingActivities();

          this.loadingUndo = false;
        },
        (error) => {
          this.loadingUndo = false;
        }
      );
  }

  /**
   * redo activity registered
   */
  redoActivity(): void {
    this.loadingRedo = true;
    this.subs = this.scoutingService
      .redoActivity(this.matchInfo.match_id)
      .subscribe(
        (res) => {
          this.getListOfScoutingActivities();

          this.loadingRedo = false;
        },
        ({ error }) => {
          this.msg.error(error?.message);

          this.loadingRedo = false;
        }
      );
  }

  /**
   * start scouting
   */
  startScouting(): void {
    if (!!this.matchResults.score?.winner) {
      this.msg.error(this.translateService.instant('scouting.matchFinished'));

      this.loadingAction = true;
    } else {
      this.subs = this.scoutingService
        .startScouting(this.matchInfo.match_id)
        .subscribe(
          (res) => {
            if (res.success) {
              this.msg.succes('Scouting iniciado exitosamente');
              this.isScoutingPaused = false;
              this.getScoutingStatus();

              localStorage.setItem('scoutingTimer', this.time.toString());
              localStorage.setItem(
                'scoutingPeriodTimer',
                this.periodTime.toString()
              );
            }
          },
          (error) => {}
        );
    }
  }

  /**
   * pause scouting
   */
  pauseScouting(
    isPeriodAction = false,
    closeModal = false,
    isSwimmingModal: boolean = false
  ): void {
    if (Number.isNaN(this.time)) this.time = 0;
    if (Number.isNaN(this.periodTime)) this.periodTime = 0;

    if (
      isSwimmingModal &&
      this.sportCode === 'swimming' &&
      this.scoutingStatus.status !== 'PAUSED' &&
      this.scoutingStatus.status !== 'NOT_STARTED'
    ) {
      this.handlePauseScoutingState();
      this.scoutingStatus.status = 'PAUSED';
      this.showFinishScoutingDialog = true;
      return;
    }

    this.subs = this.scoutingService
      .pauseScouting(
        this.matchInfo.match_id,
        this.time,
        isPeriodAction ? 0 : this.periodTime
      )
      .subscribe(
        (res) => {
          if (res.success) {
            this.msg.succes(
              this.translateService.instant('scouting.scoutingPausedMessage')
            );

            if (!closeModal) this.getScoutingStatus(isPeriodAction);

            this.handlePauseScoutingState();

            if (closeModal) {
              this.close.emit({ info: this.matchInfo, time: this.time });
              this.loadingAction = false;
            }
          }
        },
        (error) => {}
      );
  }

  restartScoutingStatus(): void {
    if (this.sportCode === 'swimming') {
      this.showFinishScoutingDialog = false;
      this.isScoutingPaused = false;
      this.scoutingStatus.status = 'STARTED';
    } else {
      this.showFinishScoutingDialog = false;
      this.isScoutingPaused = false;
    }
  }

  handlePauseScoutingState(): void {
    this.isScoutingPaused = true;
    const pausedTime = this.parseTime(this.time);
    const pausedPeriodTime = this.parseTime(this.periodTime);

    localStorage.setItem('scoutingTimer', this.time.toString());
    localStorage.setItem('scoutingPeriodTimer', this.periodTime.toString());

    this.in_game_time.created = new Date();

    this.pausedTime = {
      hours: pausedTime.hours,
      minutes: pausedTime.minutes,
      seconds: pausedTime.seconds,
    };
    this.pausedPeriodTime = {
      hours: pausedPeriodTime.hours,
      minutes: pausedPeriodTime.minutes,
      seconds: pausedPeriodTime.seconds,
    };
  }

  /**
   * stop scouting
   */
  finishScouting(redirect: boolean = true, realTimeValue: string = ''): void {
    this.loadingFinishScouting = true;
    this.subs = this.scoutingService
      .finishScouting(this.matchInfo.match_id, this.time, realTimeValue)
      .subscribe(
        (res) => {
          if (res.success) {
            this.msg.succes(res.message);
            localStorage.removeItem('scoutingTimer');
            localStorage.removeItem('scoutingPeriodTimer');

            if (this.timerSubs) this.timerSubs.unsubscribe();
            this.loadingFinishScouting = false;

            if (redirect) {
              setTimeout(() => {
                this.router.navigate([
                  `/club/competition/match/details/${this.matchInfo.match_id}`,
                ]);
              }, 1000);
            }
          }
        },
        ({ error }) => {
          this.msg.error(error);
          this.loadingFinishScouting = false;
        }
      );
  }

  /**
   * reults of a competition match
   */
  getMatchResults(): void {
    const showStatistics = this.team.sport.code !== 'tennis';

    this.subs = this.scoutingService
      .getMatchResults(this.matchInfo.match_id, showStatistics)
      .subscribe((res) => {
        this.matchResults = res.data;

        if (!!this.matchResults.score?.winner) {
          if (this.scoutingStatus.status === 'STARTED') {
            this.finishScouting(false);
          }
          this.loadingAction = true;
        }

        this.sportCode = this.matchInfo.team.sport.code;
      });
  }

  /**
   * check match situation
   */
  matchSituation(
    situation: string,
    matchScore: { own: number; rival: number },
    position: string
  ): number {
    if (position === 'local') {
      return situation === 'L' ? matchScore.own : matchScore.rival;
    }

    return situation === 'V' ? matchScore.own : matchScore.rival;
  }

  /**
   *  actions with substitution
   * @param actionParam
   * @returns
   */

  actionWithSubstitution(actionParam: number): any {
    const isSubstution = this.actions.find(
      (action) => action.id === actionParam && action.code === 'substitution'
    );

    const isRivalAction = this.actions.find(
      (action) => action.id === actionParam && action.rival_team_action
    );

    if (this.selectType === 'player' && !this.selectedPlayer) {
      this.msg.error(
        this.translateService.instant('scouting.youMustSelectAPlayer')
      );
      return;
    }

    if (this.selectType === 'team' && !!!isSubstution) {
      this.storeActivity({
        action_id: actionParam,
        in_game_time: this.time,
      });

      return;
    }

    if (this.selectType === 'team' && !!isSubstution) {
      if (
        this.selectedAlternatePlayer &&
        this.selectedPlayer &&
        this.alternateFootbalCounter <= this.alternatePlayers.length - 1
      ) {
        let custom_params = {
          player_in: {
            id: this.selectedAlternatePlayer.player_id,
            lineup_player_type_id:
              this.selectedAlternatePlayer.lineup_player_type_id,
          },
          player_out: {
            id: this.selectedPlayer.player_id,
            lineup_player_type_id: this.selectedPlayer.lineup_player_type_id,
          },
          slug: isSubstution.code,
        };

        this.storeActivity({
          action_id: actionParam,
          in_game_time: this.time,
          custom_params,
        });
        this.selectedAlternatePlayer = null;
        this.selectedPlayer = null;
      } else {
        this.msg.error(
          this.translateService.instant('scouting.youMustSelectTwoPlayer')
        );
      }
      return;
    }

    if (this.selectType === 'player') {
      if (!!isSubstution) {
        this.msg.error(
          this.translateService.instant('scouting.youMustSelectTwoPlayer')
        );
        return;
      }
      if (!isRivalAction?.rival_team_action) {
        this.storeActivity({
          action_id: actionParam,
          in_game_time: this.time,
          player_id: this.selectedPlayer.player.id,
        });
      }

      return;
    }
  }

  /**
   * football player selection
   */
  selectFootballPlayers(type: string, player: Player, e?: any): void {
    if (type === 'headline') {
      if (
        this.selectedAlternatePlayer &&
        player?.isSubstituted &&
        this.allowSubstitution.includes(this.sportCode)
      ) {
        this.msg.error(
          `${player.player.full_name} ya ha sido substituido`,
          2000
        );
      } else {
        if (this.selectedPlayer?.player_id === player?.player_id) {
          this.selectType = 'team';
          this.selectedPlayer = null;
          this.holdPlayerSelected = false;
        } else {
          this.selectedPlayer = player;
          this.selectType = !!this.selectedAlternatePlayer ? 'team' : 'player';
          if (e?.type === 'click') this.holdPlayerSelected = false;
          if (e?.type === 'dblclick') this.holdPlayerSelected = true;
        }
      }
    } else {
      if (
        !player.isSubstituted ||
        !this.allowSubstitution.includes(this.sportCode)
      ) {
        if (this.selectedAlternatePlayer?.player_id === player?.player_id) {
          this.selectedAlternatePlayer = null;
        } else {
          this.selectedAlternatePlayer = player;
          this.selectType = 'team';
        }
      }
    }
  }

  /********************************** */

  /**
   * baseball
   * @param actionParam
   * @returns
   */

  baseballActions(actionParam: number): any {
    let isGeneral: boolean = false;

    const isRivalAction = this.actions.find(
      (action) => action.id === actionParam && action.rival_team_action
    );

    const findTeamAction = this.actions.find(
      (action) =>
        this.allowedRivalBaseballActions.includes(action.code) &&
        action.id === actionParam
    );

    if (!!findTeamAction) {
      this.selectType = 'player';
      const parseCustomParams = JSON.parse(findTeamAction.custom_params);
      isGeneral = !!parseCustomParams?.is_general;
    }

    if (this.selectType === 'player' && !this.selectedPlayer && !isGeneral) {
      this.msg.error(
        this.translateService.instant('scouting.youMustSelectAPlayer')
      );
      return;
    }

    if (this.selectType === 'player' && isRivalAction) {
      this.msg.error('Acción no permitida');
      return;
    }

    // todo, mostrar mensaje para cuando es accion rival y selecciona jugador
    // validar accion de nuevo bateador en el tablero de beisbol

    if (this.selectType === 'team' && isRivalAction) {
      this.storeActivity({
        action_id: actionParam,
        in_game_time: this.time,
      });

      return;
    }

    if (this.selectType === 'player') {
      if (!isRivalAction?.rival_team_action && this.selectedPlayer) {
        this.storeActivity({
          action_id: actionParam,
          in_game_time: this.time,
          player_id: this.selectedPlayer.player.id,
        });
      }

      return;
    }
  }

  /**
   * basebal player selection
   */
  selectBaseballPlayers(player: Player, e?: any): void {
    if (this.selectedPlayer?.player_id === player?.player_id) {
      this.selectedPlayer = null;
    } else {
      this.selectedPlayer = player;
      if (e?.type === 'click') this.holdPlayerSelected = false;
      if (e?.type === 'dblclick') this.holdPlayerSelected = true;
    }
  }

  /**
   * filter players by type id
   */
  filterPlayers(
    sportCode: string,
    lineup_player_type_id: number,
    type: string
  ): boolean {
    const findSport = this.sportsWithSubstitution.find(
      (item) => item.name === sportCode
    );

    if (!!findSport) {
      if (type === 'headline') {
        return (
          lineup_player_type_id === findSport.headlineId ||
          lineup_player_type_id === findSport.captainId
        );
      } else {
        return lineup_player_type_id === findSport.alternateId;
      }
    }

    return false;
  }

  /**
   * return player type by sport
   */
  playerTypeId(sportCode: string, type: string): number {
    const findSport = this.sportsWithSubstitution.find(
      (item) => item.name === sportCode
    );

    if (!!findSport) {
      if (type === 'headline') return findSport.headlineId;
      if (type === 'alternate') return findSport.alternateId;
    }

    return 0;
  }

  /**
   * go to match results
   */
  seeMatchResults(): void {
    this.router.navigate([
      '/club/competition/match/details/' + this.matchInfo.match_id,
    ]);
  }

  showAction() {
    this.displayAction = true;
  }

  ngOnDestroy(): void {
    if (this.subs) this.subs.unsubscribe();
    if (this.timerSubs) this.timerSubs.unsubscribe();
    this.destroyed$.next(null);
    this.destroyed$.complete();
  }
}
