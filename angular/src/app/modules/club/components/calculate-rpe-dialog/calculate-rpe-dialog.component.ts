import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AlertsApiService } from 'src/app/generals-services/alerts-api.service';
import { AppStateService } from 'src/app/stateManagement/appState.service';
import { ITeam } from 'src/app/_models/ITeam.interface';
import { Player } from 'src/app/_models/player';
import { CompetitionService } from 'src/app/_services/competitions.service';
import { TrainingSessionService } from 'src/app/_services/training.service';
import { environment } from 'src/environments/environment';

type RPE = {
  code: string;
  id: number;
  image: {
    full_url: string;
  };
  name: string;
  number: string;
};

export type AssistRpe = {
  img: string;
  name: string;
  percept_name?: string;
  playerId: number;
  rpeId: number;
  rpeNumber: string;
};
@Component({
  selector: 'app-calculate-rpe-dialog',
  templateUrl: './calculate-rpe-dialog.component.html',
  styleUrls: ['./calculate-rpe-dialog.component.scss'],
})
export class CalculateRpeDialogComponent
  implements OnInit, OnChanges, OnDestroy
{
  constructor(
    private trainingService: TrainingSessionService,
    private competitionService: CompetitionService,
    private appStateService: AppStateService,
    private msg: AlertsApiService
  ) {}

  @Input() visible: boolean = false;
  @Input() isSessionPage: boolean = false;
  @Input() selectedMatch: any;
  @Input() playerRpe: {
    id: number;
    rpeId: number;
    name: string;
    assistance?: boolean;
  };
  @Input() selectedPlayers: Player[] = [];
  @Input() allPlayers: Player[] = [];
  @Input() sessionId: number;
  @Output() assistancePlayerRpe: EventEmitter<AssistRpe> =
    new EventEmitter<AssistRpe>();

  @Output() close: EventEmitter<boolean> = new EventEmitter<boolean>();

  newDailyWorkoutForm: UntypedFormGroup;
  resources = environment.images + 'images';
  $sub = new Subscription();
  rpeValue: number;
  team: ITeam;
  loading: boolean = false;
  playerName: string;
  currentPlayerNumber: number = 0;
  isOnePlayer: boolean = false;
  rpeList: RPE[] = [];
  role: string;
  $subs = new Subscription();
  loadingRpeAssistance: boolean = false;

  ngOnInit(): void {
    this.role = localStorage.getItem('role') as string;
    this.team = this.appStateService.getTeam();
    this.getRpeList();

    if (this.playerRpe?.rpeId) {
      this.rpeValue = this.playerRpe?.rpeId;
      this.playerName = this.playerRpe.name;
      this.isOnePlayer = true;
    }

    if (this.playerRpe?.id) this.isOnePlayer = true;

    if (this.selectedPlayers?.length === 1) {
      const selected = this.selectedPlayers[0];
      this.playerRpe = {
        id: selected.id,
        name: selected.full_name,
        rpeId: selected.perception_effort_id || 0,
      };
      this.rpeValue = selected.perception_effort_id || 0;
      this.playerName = selected.full_name;
      this.isOnePlayer = true;
    }

    if (this.selectedPlayers?.length > 1) {
      const selected = this.selectedPlayers[this.currentPlayerNumber];
      this.playerRpe = {
        id: selected.id,
        name: selected.full_name,
        rpeId: selected.perception_effort_id || 0,
      };
      this.rpeValue = selected.perception_effort_id || 0;
      this.isOnePlayer = false;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.allPlayers?.currentValue) {
      this.allPlayers = changes.allPlayers.currentValue;
    }
  }

  getRpeList(): void {
    this.$sub = this.trainingService
      .getSubjetivePerceptionEffor()
      .subscribe((res) => {
        this.rpeList = res.data;
      });
  }

  /**
   * set rpe
   */
  setRpeValue(value: number): void {
    this.rpeValue = value;
  }

  /**
   * handle next player carousel
   */
  handleNextCarousel(currentPlayerNumber: number): any {
    if (currentPlayerNumber < this.selectedPlayers.length - 1) {
      this.currentPlayerNumber = this.currentPlayerNumber + 1;

      const selected = this.selectedPlayers[this.currentPlayerNumber];

      this.playerRpe = {
        id: selected.id,
        name: selected.full_name,
        rpeId: selected.perception_effort_id || 0,
      };
      this.rpeValue = selected.perception_effort_id || 0;
    } else {
      return null;
    }
  }

  /**
   * handle previous player carousel
   */
  handlePreviousCarousel(currentPlayerNumber: number): void {
    if (currentPlayerNumber > 0) {
      this.currentPlayerNumber = this.currentPlayerNumber - 1;
      const selected = this.selectedPlayers[this.currentPlayerNumber];
      this.playerRpe = {
        id: selected.id,
        name: selected.full_name,
        rpeId: selected.perception_effort_id || 0,
      };
      this.rpeValue = selected.perception_effort_id || 0;
    }
  }

  /**
   * update player rpe
   */
  updatePlayer(): void {
    this.loading = true;
    const data = {
      player_id:
        this.selectedPlayers.length > 0
          ? this.selectedPlayers[this.currentPlayerNumber].id
          : this.playerRpe.id,
      perception_effort_id: this.rpeValue,
    };

    this.$sub = this.competitionService
      .updatePerceptionEffort(this.selectedMatch.id, data)
      .subscribe(
        (res) => {
          this.msg.succes(res.message);

          if (this.isOnePlayer) {
            this.selectedPlayers = [];
            this.refreshModal(res);
          }

          if (this.selectedPlayers.length > 1) {
            this.handleSelectedPlayers();
          }

          if (this.selectedPlayers.length === 1) {
            this.isOnePlayer = true;
          }
          this.loading = false;
        },
        ({ error }) => {
          this.msg.error(error);
          this.loading = false;
        }
      );
  }

  updateAssistPlayer(rpeValue: number): void {
    this.loadingRpeAssistance = true;
    const findRpe = this.rpeList.find((rpe) => rpe.id === rpeValue);

    let data: {
      assistances: {
        assistance: boolean;
        player_id?: number;
        alumn_id?: number;
        perception_effort_id: number | null;
      }[];
      exercise_session_id: number;
    } = {
      assistances: [],
      exercise_session_id: 0,
    };

    this.allPlayers.forEach((player) => {
      let getCurrentPlayer;

      if (this.selectedPlayers.length > 0) {
        getCurrentPlayer = this.selectedPlayers[this.currentPlayerNumber];
      } else {
        getCurrentPlayer = this.playerRpe;
      }

      if (this.playerRpe?.id || getCurrentPlayer) {
        const findPlayer = getCurrentPlayer?.id === player.id;

        if (findPlayer) {
          data.assistances = [
            ...data.assistances,
            {
              assistance: !!player.assistance,
              [this.role === 'sport' ? 'player_id' : 'alumn_id']: player.id,
              perception_effort_id: rpeValue || null,
            },
          ];
        } else {
          data.assistances = [
            ...data.assistances,
            {
              assistance: !!player.assistance,
              [this.role === 'sport' ? 'player_id' : 'alumn_id']: player.id,
              perception_effort_id: player.perception_effort_id || null,
            },
          ];
        }
      }
    });

    data.exercise_session_id = this.sessionId;

    this.$subs = this.trainingService.createPlayersAssistance(data).subscribe(
      (res) => {
        this.loadingRpeAssistance = false;
        this.msg.succes(res.message);

        if (!!findRpe) {
          if (this.selectedPlayers.length > 1) {
            this.setPlayerRpeAssistance(
              findRpe,
              this.selectedPlayers[this.currentPlayerNumber].id
            );

            this.handleSelectedPlayers();
          } else {
            if (this.selectedPlayers.length === 1) {
              this.setPlayerRpeAssistance(
                findRpe,
                this.selectedPlayers[this.currentPlayerNumber].id
              );
            } else {
              this.setPlayerRpeAssistance(findRpe, this.playerRpe.id);
            }
          }
        }
      },
      ({ error }) => {
        this.msg.error(error);
        this.loadingRpeAssistance = false;
      }
    );
  }

  handleSelectedPlayers(): void {
    this.selectedPlayers = this.selectedPlayers.filter(
      (player) =>
        player.id !== this.selectedPlayers[this.currentPlayerNumber].id
    );

    if (this.currentPlayerNumber === this.selectedPlayers.length) {
      this.currentPlayerNumber = this.selectedPlayers.length - 1;
    }

    const selected = this.selectedPlayers[this.currentPlayerNumber];
    this.rpeValue = selected.perception_effort_id || 0;
  }

  setPlayerRpeAssistance(findRpe: RPE, playerId: number): void {
    this.assistancePlayerRpe.emit({
      img: findRpe.image.full_url,
      name: findRpe.name,
      rpeId: findRpe.id,
      playerId: playerId,
      rpeNumber: findRpe.number,
    });
  }

  refreshModal(res: { message: string }): void {
    this.loading = false;
    this.close.emit(true);
  }

  ngOnDestroy(): void {
    if (this.$sub) this.$sub.unsubscribe();
  }
}
