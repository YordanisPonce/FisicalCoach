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
import { MatchResult } from 'src/app/_models/competition';
import { IAccionesScoutingInterface } from 'src/app/_models/IAccionesScouting.interface';
import { Player } from 'src/app/_models/player';
import { environment } from 'src/environments/environment';
import { TimeSpan } from '../scouting-dialog.component';

@Component({
  selector: 'app-default-board',
  templateUrl: './default-board.component.html',
  styleUrls: ['./default-board.component.scss'],
})
export class DefaultlBoardComponent implements OnInit, OnChanges {
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
  @Input() matchResults: MatchResult | any;
  @Input() scoutingStatus: any;
  @Input() isScoutingPaused: boolean = false;
  @Input() isDisabled: boolean = false;
  @Input() loadingStatus: boolean = false;
  @Input() sportCode: string = '';

  @Output() storeActivity: EventEmitter<any> = new EventEmitter<any>();

  showTime: string[] = [
    'handball',
    'football',
    'indoor_soccer',
    'american_soccer',
    'roller_hockey',
    'field_hockey',
    'ice_hockey',
    'rugby',
    'waterpolo',
    'basketball',
  ];
  showGoalAction: string[] = ['football', 'indoor_soccer', 'handball'];
  voleyballBoard = ['volleyball', 'beach_volleyball'];
  urlBaseImagenes = environment.images;
  volleyballSet: string = '';

  constructor(private msg: AlertsApiService) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.matchResults) {
      if (!changes.matchResults.currentValue?.score?.next_serve) {
        this.volleyballSet =
          changes.matchResults.currentValue.score?.start_game === 'own'
            ? 'own'
            : 'rival';
      }
      if (changes.matchResults.currentValue?.score?.next_serve) {
        this.volleyballSet =
          changes.matchResults.currentValue.score?.next_serve === 'own'
            ? 'own'
            : 'rival';
      }
    }
  }

  /**
   * handle volleyball set
   */
  handleSet(position: string): boolean {
    if (this.matchInfo.match_situation === 'V' && position === 'local') {
      if (this.volleyballSet === 'rival') return true;
    }

    if (this.matchInfo.match_situation === 'L' && position === 'local') {
      if (this.volleyballSet === 'own') return true;
    }

    if (this.matchInfo.match_situation === 'V' && position === 'visitor') {
      if (this.volleyballSet === 'own') return true;
    }

    if (this.matchInfo.match_situation === 'L' && position === 'visitor') {
      if (this.volleyballSet === 'rival') return true;
    }

    return false;
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
   * check match situation
   */
  matchVolleyballSituation(
    situation: string,
    matchScore: { own: number[]; rival: number[]; current_set: number },
    position: string
  ): number {
    if (position === 'local') {
      return situation === 'L'
        ? matchScore.own[matchScore.current_set]
        : matchScore.rival[matchScore.current_set];
    }

    return situation === 'V'
      ? matchScore.own[matchScore.current_set]
      : matchScore.rival[matchScore.current_set];
  }

  /**
   * returns match sets
   */
  matchSets(
    situation: string,
    matchScore: { own_sets_won: number; rival_sets_won: number },
    position: string
  ): number {
    if (position === 'local') {
      return situation === 'L'
        ? matchScore.own_sets_won
        : matchScore.rival_sets_won;
    }

    return situation === 'V'
      ? matchScore.own_sets_won
      : matchScore.rival_sets_won;
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
   * team winner
   */
  getWinner(team: string, own: string, rival: string): string {
    if (team === 'own') {
      return own;
    }

    return rival;
  }
}
