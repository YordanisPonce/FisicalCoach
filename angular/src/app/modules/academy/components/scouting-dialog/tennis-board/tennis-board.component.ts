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
import { MatchResult, TennisMatchResults } from 'src/app/_models/competition';
import { IAccionesScoutingInterface } from 'src/app/_models/IAccionesScouting.interface';
import { Player } from 'src/app/_models/player';

@Component({
  selector: 'app-tennis-board',
  templateUrl: './tennis-board.component.html',
  styleUrls: ['../scouting-dialog.component.scss'],
})
export class TennisBoardComponent implements OnInit, OnChanges {
  @Input() matchInfo: any;
  @Input() start_match: string;
  @Input() matchResults: MatchResult | any;
  @Input() sportCode: string = '';
  @Input() actions: IAccionesScoutingInterface[] = [];
  @Input() time: number;
  @Input() isDisabled: boolean = false;

  @Output() sendAction: EventEmitter<boolean> = new EventEmitter<boolean>(
    false
  );
  @Output() storeActivity: EventEmitter<any> = new EventEmitter<any>();

  totalSetOwn: number = 0;
  totalSetRival: number = 0;
  ownSet: number[];
  rivalSet: number[];
  tennisSetTurn: string = '';

  constructor(private msg: AlertsApiService) {}

  ngOnInit(): void {
    this.getScore(this.matchResults);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.matchResults) {
      this.getScore(changes.matchResults.currentValue);

      if (!changes.matchResults.currentValue?.score?.next_serve) {
        this.tennisSetTurn =
          changes.matchResults.currentValue.score?.start_game === 'own'
            ? 'own'
            : 'rival';
      }
      if (changes.matchResults.currentValue?.score?.next_serve) {
        this.tennisSetTurn =
          changes.matchResults.currentValue.score?.next_serve === 'own'
            ? 'own'
            : 'rival';
      }
    }
  }

  /**
   * score result
   */
  getScore(matchResults: TennisMatchResults): void {
    this.ownSet = matchResults.score.own;
    this.rivalSet = matchResults.score.rival;
  }

  /**
   * select sport action from board
   */
  selectActionFromBoard(actionSlug: string): any {
    const action = this.actions.find((action) => action.code === actionSlug);

    if (action) {
      this.storeActivity.emit({
        action_id: action.id,
        in_game_time: this.time,
      });
    } else {
      this.msg.error('Acción no encontrada');
    }
  }

  /**
   * return slugs
   */
  getActionSlugs(situation: string, position: string): string {
    const actionSlugs = {
      ownSlug: 'points',
      rivalSlug: 'rival_points',
    };

    if (position === 'team') {
      return actionSlugs.ownSlug;
    }

    return actionSlugs.rivalSlug;
  }

  /**
   * returns match sets
   */
  matchSets(
    situation: string,
    position: string
  ): {
    set: number[];
    total: number;
  } {
    const setOwnTesult = {
      set: this.ownSet,
      total: this.matchResults.score?.point_set_own,
    };

    const setRivalTesult = {
      set: this.rivalSet,
      total: this.matchResults.score?.point_set_rival,
    };

    if (position === 'local') {
      return { set: setOwnTesult.set, total: setOwnTesult.total };
    }

    return { set: setRivalTesult.set, total: setRivalTesult.total };
  }

  /**
   * get player list
   */
  getPlayers(position: string, players: Player[], rivals: Player[]): any[] {
    const rivalList = rivals.map((rival) => ({
      player: { full_name: rival.rival_player },
    }));

    if (position === 'team') {
      return players;
    }

    return rivalList.length > 0 ? rivalList : [];
  }

  /**
   * team winner
   */
  getWinner(team: string, own: string): string {
    if (team === 'own') {
      return own;
    }

    return 'Rival';
  }
}
