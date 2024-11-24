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
import { Club } from 'src/app/_models/club';
import { ITeam } from 'src/app/_models/ITeam.interface';
import { ExerciseService } from 'src/app/_services/exercise.service';
import { TeamService } from 'src/app/_services/team.service';
import { environment } from 'src/environments/environment';
import { SchoolService } from 'src/app/_services/school.service';
import { User } from 'src/app/_models/user';

@Component({
  selector: 'app-assing-team-dialog',
  templateUrl: './assing-team-dialog.component.html',
  styleUrls: ['./assing-team-dialog.component.scss'],
})
export class AssingTeamDialogComponent implements OnInit, OnDestroy {
  constructor(
    private teamService: TeamService,
    private appStateService: AppStateService,
    private exerciseService: ExerciseService,
    private schoolService: SchoolService,
    private msg: AlertsApiService
  ) {}

  @Input() visible: boolean = false;
  @Input() exerciseId: number;
  @Input() sessionCode: string;
  @Input() exerciseRole: string;
  @Input() sport_id: number;
  @Output() close = new EventEmitter<boolean>();

  urlBase = environment.images;
  selectedteams: ITeam[] = [];
  club: Club;
  teams: ITeam[] = [];
  allTeams: ITeam[] = [];
  searchPlayer: string = '';
  $subs = new Subscription();
  rpeDialog: boolean = false;
  playerRpe: { id: number; rpeId: number; name: string };
  teamList: number[] = [];
  loading: boolean = false;
  role: string = '';
  user: User;

  closeDialog() {
    this.close.emit(false);
  }

  ngOnInit(): void {
    this.role = localStorage.getItem('role') as string;
    this.club = this.appStateService.getClub();
    this.user = this.appStateService.getUserData();

    if (this.exerciseRole === 'team') {
      this.getTeams();
    } else {
      this.getclasses();
    }
  }

  /**
   * Filter players
   * @param e Event
   */
  setValue(e: KeyboardEvent) {
    const filterTeam = this.teams?.filter((item) =>
      item.name.toLowerCase().includes(this.searchPlayer)
    );

    if (this.searchPlayer.length > 0) {
      this.teams = filterTeam;
    } else {
      this.teams = this.allTeams;
    }
  }

  /**
   * get teams for exercise
   */
  getExerciseTeams(): void {
    this.$subs = this.exerciseService
      .getTeamsExercise(this.exerciseId)
      .subscribe((res) => {
        const exerciseTeams: ITeam[] = res.data;

        this.allTeams.forEach((team) => {
          const findTeam = exerciseTeams.find((item) => item.id === team.id);

          if (!!findTeam) {
            this.selectedteams = [...this.selectedteams, team];
          }
        });
      });
  }

  /**
   * get classrooms for exercise
   */
  getExerciseClassrooms(): void {
    this.$subs = this.exerciseService
      .getClassroomsExercise(this.exerciseId)
      .subscribe((res) => {
        const exerciseTeams: ITeam[] = res.data;

        this.allTeams.forEach((team) => {
          const findTeam = exerciseTeams.find((item) => item.id === team.id);

          if (!!findTeam) {
            this.selectedteams = [...this.selectedteams, team];
          }
        });
      });
  }

  /**
   * get teams
   */
  getTeams(): void {
    this.$subs = this.teamService
      .getList(this.club?.id, this.sport_id)
      .subscribe((res) => {
        this.teams = res.data;
        this.allTeams = res.data;

        this.getExerciseTeams();
      });
  }

  /**
   * get teams
   */
  getclasses(): void {
    this.$subs = this.schoolService
      .getClassesByUser(this.user.id)
      .subscribe((res) => {
        this.teams = res.data;
        this.allTeams = res.data;

        this.getExerciseClassrooms();
      });
  }

  /**
   * submit
   */
  assingExercise(type = 'assingTeams'): void {
    this.loading = true;

    const teams = this.selectedteams.map((team) => team.id);

    if (this.exerciseRole === 'team') {
      this.$subs = this.exerciseService
        .assingTeams(teams, this.exerciseId)
        .subscribe(
          (res) => {
            this.msg.succes(res.message);
            this.loading = false;
            this.closeDialog();
          },
          ({ error }) => {
            this.msg.error(error);
            this.loading = false;
          }
        );
    } else {
      this.$subs = this.exerciseService
        .assingClassrooms(teams, this.exerciseId)
        .subscribe(
          (res) => {
            this.msg.succes(res.message);
            this.loading = false;
            this.closeDialog();
          },
          ({ error }) => {
            this.msg.error(error);
            this.loading = false;
          }
        );
    }
  }

  ngOnDestroy(): void {
    if (this.$subs) this.$subs.unsubscribe();
  }
}
