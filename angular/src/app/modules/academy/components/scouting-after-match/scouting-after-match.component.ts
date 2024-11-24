import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { AlertsApiService } from 'src/app/generals-services/alerts-api.service';
import { ScoutingService } from 'src/app/_services/scouting.service';
import { ITeam } from 'src/app/_models/ITeam.interface';
import { AppStateService } from 'src/app/stateManagement/appState.service';
import { Match } from 'src/app/_models/competition';
import { environment } from 'src/environments/environment';

interface Option {
  name: string;
  code: string;
}

@Component({
  selector: 'app-scouting-after-match',
  templateUrl: './scouting-after-match.component.html',
  styleUrls: ['./scouting-after-match.component.scss'],
})
export class ScoutingAfterMatchComponent implements OnInit, OnDestroy {
  @Input() matchId: number;
  @Input() match: Match;

  subs$ = new Subscription();
  selectedOption: Option;
  options: Option[];
  sportActions: any[] = [];
  historyForm: UntypedFormGroup;
  loading: boolean = false;
  submitLoading: boolean = false;
  previousSlug: string = '';
  scoreSports: string[] = [
    'football',
    'indoor_soccer',
    'waterpolo',
    'field_hockey',
    'roller_hockey',
    'ice_hockey',
    'handball',
    'basketball',
    'american_soccer',
    'rugby',
    'baseball',
  ];

  setSports: string[] = [
    'volleyball',
    'beach_volleyball',
    'tennis',
    'padel',
    'cricket',
  ];

  team: ITeam;
  urlBase = environment.images;
  score: any;
  showEditScore: boolean = false;
  scoreLeftValue: any;
  scoreRightValue: any;
  inGameTimeValue: string;

  constructor(
    private scoutingService: ScoutingService,
    private appStateService: AppStateService,
    private formBuilder: UntypedFormBuilder,
    private msg: AlertsApiService
  ) {
    this.options = [
      { name: 'Todo el equipo', code: 'AU' },
      { name: 'Un jugador', code: 'BR' },
    ];
  }
  value: string | undefined;

  ngOnInit(): void {
    this.team = this.appStateService.getTeam();

    this.getMatchResultsAndActions(this.match.match_id as number);
  }

  loadForm(data: any): void {
    this.historyForm = this.formBuilder.group(data);
  }

  get f() {
    return this.historyForm.controls;
  }

  getMatchResultsAndActions(matchId: number): void {
    this.loading = true;

    this.subs$ = this.scoutingService
      .getMatchResults(matchId as unknown as number, true)
      .subscribe(
        (res) => {
          const data = res.data?.statistics ? res.data.statistics : res.data;

          this.score = res.data?.score;

          this.inGameTimeValue = res.data.in_game_time
            ? this.parseSeconds(res.data.in_game_time)
            : '00:00';

          console.log(this.inGameTimeValue);

          let object: any = null;

          Object.entries(data).forEach((item: any) => {
            object = {
              ...object,
              [item[0]]: [item[1]?.value, [Validators.min(0)]],
            };
          });

          this.loadForm(object);

          this.sportActions = Object.entries(data)
            .sort((a: any[], b: any[]) => {
              return a[1]?.order - b[1]?.order;
            })
            .filter(
              (item: any) => item[1]?.name && item[1]?.image && item[1]?.show
            )
            .map((item: any) => {
              if (item[1]?.calculate_total?.length > 0) {
                this.historyForm.get(item[0])?.disable();
              }

              return {
                name: item[1]?.name,
                slug: item[0],
                image: item[1]?.image?.full_url || null,
                calculate_total: item[1]?.calculate_total,
              };
            });

          this.loading = false;
        },
        ({ error }) => {
          this.msg.error(error);
          this.loading = false;
        }
      );
  }

  /**
   * handle inputs with calculable value
   */
  handleCalculableInput(e: any, value: number): void {
    const findSlug = this.sportActions.find((action) =>
      action.calculate_total?.includes(e.slug)
    );

    this.previousSlug = e.slug;

    if (!!findSlug) {
      let total: number = 0;

      findSlug.calculate_total.forEach((item: string) => {
        total += this.historyForm.get(item)?.value;
      });

      this.historyForm.get(findSlug.slug)?.setValue(total);
    }
  }

  /**
   * handle score by no set sports
   */
  handleNoSetScore(type: string, event: any): void {
    this.score[type] = +event?.target?.value;
  }

  /**
   * handle score by set sports
   */
  handleSetScore(
    type: string | null,
    event: any,
    index: number,
    position: string
  ): void {
    if (type) {
      this.score[type][index] = +event?.target?.value;

      return;
    }

    if (position === 'left') {
      this.score['own'][index] = +event?.target?.value;

      return;
    }

    this.score['rival'][index] = +event?.target?.value;
  }

  /**
   * subtmi form
   */
  submit(): void {
    this.submitLoading = true;

    const parseTime: string[] | undefined =
      this.inGameTimeValue?.split(':') || '00:00';

    const hours = parseTime[0] ? parseInt(parseTime[0]) : 0;
    const minutes = parseTime[1] ? parseInt(parseTime[1]) : 0;

    const in_game_time = hours * 60 + minutes;

    const data = {
      in_game_time,
      scouting: {
        score: this.score,
        statistics: this.historyForm.value,
        substitutions: [],
      },
    };

    this.subs$ = this.scoutingService
      .sendResults(this.match.match_id as unknown as number, data)
      .subscribe(
        (res) => {
          this.msg.succes(res.message);
          this.submitLoading = false;
        },
        ({ error }) => {
          this.msg.error(error);
          this.submitLoading = false;
        }
      );
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

    if (situation === 'L' || !situation) {
      list = ownSet.map((set, i) => ({ own: set, rival: rivalSet[i] }));
    } else {
      list = rivalSet.map((set, i) => ({ own: set, rival: ownSet[i] }));
    }

    return list;
  }

  /**
   * handle match situation for all sports
   */
  getMatchSituation(value: string, position: string): string | null {
    if (!value) return null;

    if (position === 'left') return value === 'L' ? 'own' : 'rival';

    return value === 'V' ? 'own' : 'rival';
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
    if (this.subs$) this.subs$.unsubscribe();
  }
}
