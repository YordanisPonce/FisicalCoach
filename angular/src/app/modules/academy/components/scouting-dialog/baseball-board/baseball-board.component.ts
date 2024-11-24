import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { AlertsApiService } from 'src/app/generals-services/alerts-api.service';
import { BaseballMatchResults, MatchResult } from 'src/app/_models/competition';
import { IAccionesScoutingInterface } from 'src/app/_models/IAccionesScouting.interface';
import { Player } from 'src/app/_models/player';
import { environment } from 'src/environments/environment';
import { TimeSpan } from '../../scouting-dialog/scouting-dialog.component';

@Component({
  selector: 'app-baseball-board',
  templateUrl: './baseball-board.component.html',
  styleUrls: ['./baseball-board.component.scss'],
})
export class BaseballBoardComponent implements OnInit, OnChanges {
  @Input() matchInfo: any;
  @Input() actions: IAccionesScoutingInterface[] = [];
  @Input() pausedTime: {
    hours: number;
    minutes: number;
    seconds: number;
  };
  @Input() selectType: string;
  @Input() time: number;
  @Input() selectedPlayer: Player;
  @Input() matchResults: BaseballMatchResults;
  @Input() scoutingStatus: any;
  @Input() isScoutingPaused: boolean = false;
  @Input() loadingStatus: boolean = false;
  @Input() isDisabled: boolean = false;

  @Output() storeActivity: EventEmitter<any> = new EventEmitter<any>();
  @Output() selectedTeam: EventEmitter<any> = new EventEmitter<any>();
  @Output() setSelectType: EventEmitter<string> = new EventEmitter<string>();

  urlBaseImagenes = environment.images;
  teamPosition: number = 1;
  balls: any[];
  strikes: any[];
  outs: any[];
  localInnings: string[] = [
    '1_up',
    '2_up',
    '3_up',
    '4_up',
    '5_up',
    '6_up',
    '7_up',
    '8_up',
    '9_up',
  ];
  guessInnings: string[] = [
    '1_down',
    '2_down',
    '3_down',
    '4_down',
    '5_down',
    '6_down',
    '7_down',
    '8_down',
    '9_down',
  ];

  constructor(private msg: AlertsApiService) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.matchResults?.currentValue) {
      if (this.matchResults?.score) {
        this.balls = Array.from(Array(this.matchResults.score.balls).keys());
        this.strikes = Array.from(
          Array(this.matchResults.score.strikes).keys()
        );
        this.outs = Array.from(Array(this.matchResults.score.outs).keys());
      }

      if (this.localInnings.includes(this.matchResults?.score.current_inning)) {
        if (this.scoutingStatus.start_match) {
          const start_match = this.scoutingStatus.start_match;

          if (start_match === 'L' && this.matchInfo.match_situation === 'L') {
            this.teamPosition = 1;
            this.selectedTeam.emit(this.matchInfo.team);
            this.setSelectType.emit('player');
          }
          if (start_match === 'L' && this.matchInfo.match_situation === 'V') {
            this.teamPosition = 2;
            this.selectedTeam.emit(this.matchInfo.team);
            this.setSelectType.emit('player');
          }
          if (start_match === 'V' && this.matchInfo.match_situation === 'L') {
            this.teamPosition = 2;
            this.selectedTeam.emit(this.matchInfo.competition_rival_team);
            this.setSelectType.emit('team');
          }
          if (start_match === 'V' && this.matchInfo.match_situation === 'V') {
            this.teamPosition = 1;
            this.selectedTeam.emit(this.matchInfo.competition_rival_team);
            this.setSelectType.emit('team');
          }
        } else {
          if (this.matchInfo.match_situation === 'L') {
            this.selectedTeam.emit(this.matchInfo.team);
            this.setSelectType.emit('player');
            this.teamPosition = 1;
          } else {
            this.selectedTeam.emit(this.matchInfo.competition_rival_team);
            this.setSelectType.emit('team');
            this.teamPosition = 1;
          }
        }
      }
      if (this.guessInnings.includes(this.matchResults?.score.current_inning)) {
        if (this.scoutingStatus.start_match) {
          const start_match = this.scoutingStatus.start_match;

          if (start_match === 'V' && this.matchInfo.match_situation === 'V') {
            this.teamPosition = 2;
            this.selectedTeam.emit(this.matchInfo.team);
            this.setSelectType.emit('player');
          }
          if (start_match === 'V' && this.matchInfo.match_situation === 'L') {
            this.teamPosition = 1;
            this.selectedTeam.emit(this.matchInfo.team);
            this.setSelectType.emit('player');
          }
          if (start_match === 'L' && this.matchInfo.match_situation === 'V') {
            this.teamPosition = 1;
            this.selectedTeam.emit(this.matchInfo.competition_rival_team);
            this.setSelectType.emit('team');
          }
          if (start_match === 'L' && this.matchInfo.match_situation === 'L') {
            this.teamPosition = 2;
            this.selectedTeam.emit(this.matchInfo.competition_rival_team);
            this.setSelectType.emit('team');
          }
        } else {
          if (this.matchInfo.match_situation === 'V') {
            this.selectedTeam.emit(this.matchInfo.team);
            this.setSelectType.emit('player');
            this.teamPosition = 2;
          } else {
            this.selectedTeam.emit(this.matchInfo.competition_rival_team);
            this.setSelectType.emit('team');
            this.teamPosition = 2;
          }
        }
      }
    }
  }

  /**
   * select sport action from board
   */
  selectActionFromBoard(actionSlug: string): any {
    if (this.selectType === 'player' && !this.selectedPlayer) {
      this.msg.error('Debes seleccionar primero a un jugador');
      return;
    }

    const action = this.actions.find((action) => action.code === actionSlug);

    if (action) {
      if (this.selectType === 'team') {
        this.storeActivity.emit({
          action_id: action.id,
          in_game_time: this.time,
        });
      } else {
        this.storeActivity.emit({
          action_id: action.id,
          in_game_time: this.time,
          player_id: this.selectedPlayer.player.id,
        });
      }
    } else {
      this.msg.error('Acción no encontrada');
    }
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
   * select wich team will be the owner
   * @param index
   */
  selectOwningTeam(index: any): void {
    // if (index === 1) {
    //   this.selectedTeam = this.matchInfo.team;
    // }
    // if (index === 2) {
    //   this.selectedTeam = this.matchInfo.competition_rival_team;
    // }
  }
}
