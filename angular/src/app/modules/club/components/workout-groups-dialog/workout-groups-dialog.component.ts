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
import { WorkoutGroup } from 'src/app/_models/ejercicio';
import { ITeam } from 'src/app/_models/ITeam.interface';
import { Player } from 'src/app/_models/player';
import { ExerciseService } from 'src/app/_services/exercise.service';
import { PlayersService } from 'src/app/_services/players.service';

@Component({
  selector: 'app-workout-groups-dialog',
  templateUrl: './workout-groups-dialog.component.html',
  styleUrls: ['./workout-groups-dialog.component.scss'],
})
export class WorkoutGroupsDialogComponent implements OnInit, OnDestroy {
  constructor(
    private exersiceService: ExerciseService,
    private appStateService: AppStateService,
    private playerService: PlayersService,
    private msg: AlertsApiService
  ) {}

  @Input() visible: boolean = false;
  @Input() sessionId: number;
  @Input() sessionCode: string;
  @Input() isSessionPage: boolean = false;
  @Output() close = new EventEmitter<boolean>();

  workoutGroups: WorkoutGroup[] = [];
  loading: boolean = false;
  isSending: boolean = false;
  showPlayers: boolean = false;
  showEdit: boolean = false;
  showDetails: boolean = false;
  showGroupList: boolean = false;
  team: ITeam;
  players: Player[] = [];
  allPlayers: Player[] = [];
  $subs = new Subscription();
  selectedPlayers: number[] = [];
  groupName: string;
  groupCode: string;
  role: string = '';
  customColor: string = '';
  isFileRejectedBySize: boolean = false;
  isFileRejectedByType: boolean = false;
  colors: any = [
    '#0065e9',
    '#050c44',
    '#ffa200',
    '#c8df00',
    '#f92f28',
    '#00e9c5',
  ];
  color: string;
  selectedColor: string;
  groupList: WorkoutGroup[] = [];

  closeDialog() {
    // this.advancedDialog = false
    this.close.emit(false);
  }

  ngOnInit(): void {
    this.role = localStorage.getItem('role') as string;
    this.team = this.appStateService.getTeam();

    this.getGroupList();
  }

  /**
   * get players to assing to group
   */
  getPlayers(): void {
    this.showPlayers = true;

    this.groupName = '';

    this.$subs = this.exersiceService
      .getWorkGroupPlayersNotAssigned(this.sessionId, this.role)
      .subscribe((res) => {
        this.players = res.data;
      });
  }

  /**
   * get players to assing to group
   */
  getGroupList(): void {
    this.loading = true;
    this.$subs = this.exersiceService
      .getWorkGroupPlayers(this.sessionId, this.role)
      .subscribe(
        (res) => {
          this.groupList = res.data;
          this.workoutGroups = res.data;
          this.loading = false;
        },
        ({ error }) => {
          this.msg.error(error);
          this.loading = false;
        }
      );
  }

  /**
   * call players to edit work group
   */
  editPlayers(): void {
    this.showEdit = true;

    if (this.players.length > 0)
      this.selectedPlayers = this.players.map((player) => player.id);

    this.$subs = this.exersiceService
      .getWorkGroupPlayersNotAssigned(this.sessionId, this.role)
      .subscribe((res) => {
        this.allPlayers = res.data;
      });
  }

  showWorkoutPlayers(
    players: Player[],
    name: string,
    color: string,
    code: string
  ): void {
    this.showPlayers = true;
    this.showDetails = true;
    this.selectedColor = color;
    this.groupName = name;
    this.players = players;
    this.groupCode = code;
  }

  setGroupName(e: any): void {
    this.groupName = e.target.value;
  }

  /**
   * submit
   */
  createWorkoutGroup(): void {
    this.isSending = true;
    let data = null;

    if (this.role === 'sport') {
      data = {
        name: this.groupName,
        players: this.selectedPlayers,
        exercise_session_id: this.sessionId,
        color: this.selectedColor,
      };
    } else {
      data = {
        name: this.groupName,
        alumns: this.selectedPlayers,
        exercise_session_id: this.sessionId,
        color: this.selectedColor,
      };
    }

    if (!this.showEdit) {
      this.$subs = this.exersiceService.createWorkoutGroups(data).subscribe(
        (res) => {
          this.msg.succes(res.message);

          this.showPlayers = false;
          this.isSending = false;
          this.selectedPlayers = [];
          this.selectedColor = '';
          this.customColor = '';
          this.closeDialog();
        },
        ({ error }) => {
          this.msg.error(error);
          this.isSending = false;
        }
      );
    } else {
      this.$subs = this.exersiceService
        .updateWorkoutGroups(data, this.groupCode)
        .subscribe(
          (res) => {
            this.msg.succes(res.message);

            this.showPlayers = false;
            this.isSending = false;
            this.selectedPlayers = [];
            this.selectedColor = '';
            this.customColor = '';
            this.closeDialog();
          },
          ({ error }) => {
            this.msg.error(error);
            this.isSending = false;
          }
        );
    }
  }

  setColor(color: any, customColor: boolean): void {
    if (customColor) {
      this.customColor = color;
      this.selectedColor = color;
    } else {
      this.selectedColor = color;
    }
    this.isFileRejectedBySize = false;
    this.isFileRejectedByType = false;
  }

  getBoxColor(color: string): string {
    return `0 0px 8px ${color || '#0000001c'}`;
  }

  closePlayers(): void {
    this.showPlayers = false;
    this.showDetails = false;
    this.showEdit = false;
    this.players = [];
    this.selectedPlayers = [];
    this.groupCode = '';
    this.showGroupList = false;
    this.selectedColor = '';
  }

  ngOnDestroy(): void {
    if (this.$subs) this.$subs.unsubscribe();
  }
}
