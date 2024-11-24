import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { AlertsApiService } from 'src/app/generals-services/alerts-api.service';
import { AppStateService } from 'src/app/stateManagement/appState.service';
import { ITeam } from 'src/app/_models/ITeam.interface';
import { Player } from 'src/app/_models/player';
import { TrainingSessionService } from 'src/app/_services/training.service';
import { environment } from 'src/environments/environment';
import { AssistRpe } from '../calculate-rpe-dialog/calculate-rpe-dialog.component';
import { User } from 'src/app/_models/user';
import { Club } from 'src/app/_models/club';

@Component({
  selector: 'asistence',
  templateUrl: './asistence.component.html',
  styleUrls: ['./asistence.component.scss'],
})
export class AsistenceComponent implements OnInit, OnDestroy {
  constructor(
    private appStateService: AppStateService,
    private trainingService: TrainingSessionService,
    private msg: AlertsApiService
  ) {}

  @Input() visible: boolean = false;
  @Input() sessionId: number;
  @Input() sessionCode: string;
  @Output() close = new EventEmitter<boolean>();

  urlBase = environment.images;
  value: any;
  team: ITeam;
  players: Player[] = [];
  allPlayers: Player[] = [];
  searchPlayer: string = '';
  $subs = new Subscription();
  rpeDialog: boolean = false;
  playerRpe: { id: number; rpeId: number; name: string; rpeNumber: string };
  assistanceList: number[] = [];
  rpeList: AssistRpe[] = [];
  loading: boolean = false;
  role: string = '';
  assistRpe: AssistRpe = {
    img: '',
    name: '',
    playerId: 0,
    rpeId: 0,
    rpeNumber: '',
  };
  selectedPlayer: number;
  cardiacFrecuencyDialog: boolean = false;
  selectedPlayerList: Player[] = [];
  testType: string = '';
  academycYearId: number | null;

  closeDialog() {
    // this.advancedDialog = false
    this.close.emit(false);
  }

  ngOnInit(): void {
    this.role = localStorage.getItem('role') as string;
    this.team = this.appStateService.getTeam();

    if (this.role === 'teacher')
      this.academycYearId = this.appStateService.getClassroomAcademicYear();

    this.getPlayersAssistance();
  }

  /**
   * asisstances
   */
  getPlayersAssistance(): void {
    this.$subs = this.trainingService
      .getPlayersAssistance(this.sessionCode, this.role, this.academycYearId)
      .subscribe((res) => {
        this.players = res.data;
        this.allPlayers = res.data;

        let getPlayersRpe: AssistRpe[] = [];

        this.allPlayers = this.allPlayers.filter(
          (elem, index, self) =>
            index === self.findIndex((t) => t.id === elem.id)
        );

        this.players = this.allPlayers.filter(
          (elem, index, self) =>
            index === self.findIndex((t) => t.id === elem.id)
        );

        this.assistanceList = this.allPlayers.map((player) => {
          if (player.perception_effort_id) {
            getPlayersRpe = [
              ...getPlayersRpe,
              {
                img: this.urlBase + player.percept_effort_url,
                name: player.percept_name || '',
                playerId: player.id,
                rpeId: player.perception_effort_id,
                rpeNumber: player.percept_number,
              },
            ];
          }

          if (getPlayersRpe.length > 0) this.rpeList = getPlayersRpe;

          if (player.assistance) {
            return player.id;
          }

          return 0;
        });
      });
  }

  /**
   * Open calculate rpf dialog
   */
  openRpfDialog(
    id: number,
    rpeId: number,
    name: string,
    assistance: boolean,
    rpeNumber: string
  ): void {
    const data = { id, rpeId, name, assistance, rpeNumber };

    if (this.selectedPlayerList.length <= 1) this.playerRpe = data;

    this.rpeDialog = true;
  }

  /**
   * Filter players
   * @param e Event
   */
  setValue(e: KeyboardEvent) {
    const filterCompetition = this.players?.filter((item) =>
      item.full_name.toLowerCase().includes(this.searchPlayer)
    );

    if (this.searchPlayer.length > 0) {
      this.players = filterCompetition;
    } else {
      this.players = this.allPlayers;
    }
  }

  /**
   * add player to assistance
   */
  addAssistance(id: number, assistance: boolean): void {
    if (this.assistanceList.includes(id)) {
      this.assistanceList = this.assistanceList.filter(
        (playerId) => playerId !== id
      );
    } else {
      this.assistanceList = [...this.assistanceList, id];
    }
  }

  /**
   * set all asistances
   */
  setAllPlayersAssistances(): void {
    this.assistanceList = this.allPlayers.map((item) => item.id);
  }

  /**
   * Open calculate rpf dialog
   */
  openRpfDialogWithPlayers(): void {
    this.playerRpe = {
      id: 0,
      name: '',
      rpeId: 0,
      rpeNumber: '',
    };
    this.rpeDialog = true;
  }

  /**
   * get rpe
   */
  getAssistanceRpe(data: AssistRpe): void {
    const findRpe = this.rpeList.find((rpe) => rpe.playerId === data.playerId);

    if (!!findRpe) {
      this.rpeList = this.rpeList.map((rpe) => {
        if (rpe.playerId === data.playerId) {
          return data;
        }

        return rpe;
      });
    } else {
      this.rpeList = [...this.rpeList, data];
    }

    this.selectedPlayerList = this.selectedPlayerList.filter(
      (player) => player.id !== data.playerId
    );

    this.allPlayers = this.allPlayers.map((player) => {
      if (player.id === data.playerId) {
        return {
          ...player,
          perception_effort_id: data.rpeId,
        };
      }

      return player;
    });

    this.players = this.players.map((player) => {
      if (player.id === data.playerId) {
        return {
          ...player,
          perception_effort_id: data.rpeId,
        };
      }

      return player;
    });

    if (this.selectedPlayerList.length > 0) return;

    this.rpeDialog = false;
  }

  /**
   * show rpe
   */
  showRpe(playerId: number): AssistRpe | null {
    const findRpe = this.rpeList.find((rpe) => rpe.playerId === playerId);

    return findRpe || null;
  }

  /**
   * open fc dialog
   */
  openFcDialog(playerId: number, testType: string): void {
    this.selectedPlayer = playerId;
    this.cardiacFrecuencyDialog = true;
    this.testType = testType;
  }

  /**
   * open fc dialog with players
   */
  openFcDialogWithPlayers(testType: string): void {
    this.selectedPlayer = 0;
    this.cardiacFrecuencyDialog = true;
    this.testType = testType;
  }

  /**
   * submit
   */
  createAssistance(): void {
    this.loading = true;

    let data: {
      assistances: {
        assistance: boolean;
        player_id?: number;
        alumn_id?: number;
      }[];
      exercise_session_id: number;
    } = {
      assistances: [],
      exercise_session_id: 0,
    };

    data.assistances = this.allPlayers.map((player) => {
      const findAssistance = this.assistanceList.find((id) => id === player.id);

      const findRpe = this.rpeList.find((rpe) => rpe.playerId === player.id);

      if (this.role === 'sport') {
        if (!!findAssistance) {
          return {
            assistance: true,
            player_id: player.id,
            perception_effort_id: findRpe?.rpeId || null,
          };
        }

        return {
          assistance: false,
          player_id: player.id,
          perception_effort_id: findRpe?.rpeId || null,
        };
      } else {
        if (!!findAssistance) {
          return {
            assistance: true,
            alumn_id: player.id,
            perception_effort_id: findRpe?.rpeId || null,
          };
        }

        return {
          assistance: false,
          alumn_id: player.id,
          perception_effort_id: findRpe?.rpeId || null,
        };
      }
    });

    data.exercise_session_id = this.sessionId;

    this.$subs = this.trainingService.createPlayersAssistance(data).subscribe(
      (res) => {
        this.loading = false;
        this.msg.succes(res.message);

        this.closeDialog();
      },
      ({ error }) => {
        this.msg.error(error);
        this.loading = false;
      }
    );
  }

  /**
   * check selected list
   */
  showSelectedIcon(playerId: number): boolean {
    return this.selectedPlayerList.some((player) => player.id === playerId);
  }

  ngOnDestroy(): void {
    if (this.$subs) this.$subs.unsubscribe();
  }
}
