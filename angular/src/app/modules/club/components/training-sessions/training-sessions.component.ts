import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppStateService } from 'src/app/stateManagement/appState.service';
import { RatingIcon, ratingIcons } from 'src/app/utils/rating-icons';
import {
  PlaceSession,
  TrainingExerciseSession,
} from 'src/app/_models/training';
import { TrainingSessionService } from 'src/app/_services/training.service';
import { environment } from 'src/environments/environment';
import { AlertsApiService } from 'src/app/generals-services/alerts-api.service';
import { PermissionMethods } from 'src/app/_directivas/user-permission.directive';
import { traininSessionGeneralFilterList } from 'src/app/utils/filterOptions';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-training-sessions',
  templateUrl: './training-sessions.component.html',
  styleUrls: ['./training-sessions.component.scss'],
})
export class TrainingSessionsComponent implements OnInit, OnDestroy {
  constructor(
    private trainingSessionService: TrainingSessionService,
    private appStateService: AppStateService,
    private msg: AlertsApiService,
    private translateService: TranslateService
  ) {}

  newSessionDialog: boolean = false;
  isReusedSession: boolean = false;
  $subscription = new Subscription();
  loading: boolean = false;
  team: any;
  exerciseStep: number = 0;
  trainingSessions: TrainingExerciseSession[] = [];
  allTrainingSessions: TrainingExerciseSession[] = [];
  val: any = 4;
  ratingIcons: RatingIcon[] = [];
  intensityIcon: RatingIcon;
  resources = environment.images + 'images';
  loadingPDF: boolean = false;
  isNewSession: boolean = false;
  errorMessage: string;
  role: string;
  selectedSession: TrainingExerciseSession;
  placeSessionList: PlaceSession[] = [];
  showPermission: PermissionMethods;
  selectedFilter: any;
  filterOptions: any[] | undefined;

  ngOnInit(): void {
    this.team = this.appStateService.getTeam();
    this.role = localStorage.getItem('role') as string;

    this.ratingIcons = ratingIcons;

    this.getSessionsByRole();

    this.$subscription = this.translateService
      .get('training_session')
      .subscribe((res) => {
        this.filterOptions = traininSessionGeneralFilterList.map((item) => ({
          ...item,
          label: item.code === 'like' ? `${res[item.code]} ❤️` : res[item.code],
          children: item.children.map((child) => ({
            ...child,
            label: res[child.code],
          })),
        }));
      });
  }

  getSessionsByRole(): void {
    if (this.role === 'sport') {
      this.getTrainingSessionList(this.team.id);
    } else {
      this.getClassroomTrainingSessionList(this.team.id);
    }
  }

  downloadSessionPDF(code: string, title: string): void {
    this.loadingPDF = true;

    this.trainingSessionService.downloadSessionPDF(code).subscribe(
      (res) => {
        const a = document.createElement('a');
        const objectUrl = URL.createObjectURL(res);
        a.href = objectUrl;
        a.download = `${title}.pdf`;
        a.click();
        URL.revokeObjectURL(objectUrl);
        this.loadingPDF = false;
      },
      ({ error }) => {
        this.msg.error(error);
        this.loadingPDF = false;
      }
    );
  }

  /**
   * training session list
   */
  getTrainingSessionList(team_id: number): void {
    this.loading = true;
    this.getList(team_id);
  }

  /**
   * get list
   */
  getList(team_id: number): void {
    this.$subscription = this.trainingSessionService
      .getTrainingSessionList(team_id)
      .subscribe(
        (res) => {
          if (res.success) {
            this.trainingSessions = res.data;
            this.allTrainingSessions = res.data;

            this.trainingSessions = this.allTrainingSessions.map((session) => {
              const findIntensity = this.ratingIcons.find(
                (item) => item.value === session.intensity
              );

              const exercise_session_exercises =
                session.exercise_session_exercises.map((item, i) => ({
                  ...item,
                  index: i + 1,
                }));

              if (!!findIntensity) {
                return {
                  ...session,
                  exercise_session_exercises,
                  intensityIcon: findIntensity,
                };
              }

              return {
                ...session,
                exercise_session_exercises,
                intensityIcon: null,
              };
            });
          }

          this.loading = false;
        },
        ({ error }) => {
          console.log(error);
          this.loading = false;
          this.errorMessage = error?.message;
        }
      );
  }

  /**
   * get lis for Classroom
   */

  getClassroomList(classroomId: number): void {
    this.$subscription = this.trainingSessionService
      .getClassroomTrainingSessionList(classroomId)
      .subscribe(
        (res) => {
          if (res.success) {
            this.trainingSessions = res.data;

            this.trainingSessions = this.trainingSessions.map((session) => {
              const findIntensity = this.ratingIcons.find(
                (item) => item.value === session.intensity
              );

              if (!!findIntensity) {
                return {
                  ...session,
                  intensityIcon: findIntensity,
                };
              }

              return {
                ...session,
                intensityIcon: null,
              };
            });
          }

          this.loading = false;
        },
        ({ error }) => {
          console.log(error);
          this.loading = false;
          this.errorMessage = error?.message;
        }
      );
  }

  /**
   * training session list
   */
  getClassroomTrainingSessionList(classroomId: number): void {
    this.loading = true;
    this.getClassroomList(classroomId);
  }

  /**
   * Refresh List after create one
   */
  refreshSessionList(): void {
    this.getSessionsByRole();
  }

  /**
   * edit session
   */
  edit(session: TrainingExerciseSession): void {
    this.selectedSession = session;
    this.newSessionDialog = true;
  }

  /**
   * reuse session
   */
  reuseSession(session: TrainingExerciseSession): void {
    this.selectedSession = session;
    this.newSessionDialog = true;
    this.isReusedSession = true;
    this.isNewSession = true;
  }

  deleteSession(code: string): void {
    this.trainingSessionService
      .deleteExerciseSession(this.team.id, code, this.role)
      .subscribe(
        (res) => {
          if (res.success) {
            this.msg.succes(res.message);

            this.getSessionsByRole();
          }
        },
        ({ error }) => {
          this.msg.error(error);
        }
      );
  }

  /**
   * reset selected session
   */
  resetSelected(): void {
    this.newSessionDialog = false;
    this.isReusedSession = false;
    this.isNewSession = false;
    this.selectedSession = {} as TrainingExerciseSession;
  }

  /**
   * handle filter
   */
  handleSelectFilter(): void {
    this.trainingSessions = this.allTrainingSessions;

    if (
      this.selectedFilter.code === 'training_period' ||
      this.selectedFilter.code === 'type_session'
    ) {
      this.trainingSessions = this.allTrainingSessions;

      return;
    }

    if (this.selectedFilter.code === 'like') {
      this.trainingSessions = this.trainingSessions.filter(
        (exercise) => exercise.like
      );

      return;
    }

    if (this.selectedFilter.code !== 'training_period') {
      this.trainingSessions = this.trainingSessions.filter(
        (exercise) => exercise?.training_period_id === this.selectedFilter.id
      );

      return;
    }

    if (this.selectedFilter.code !== 'type_session') {
      this.trainingSessions = this.trainingSessions.filter(
        (exercise) =>
          exercise?.type_exercise_session_id === this.selectedFilter.id
      );

      return;
    }
  }

  handleOrderFilter(orderBy: any): void {
    if (orderBy.tooltip === 'asc') {
      this.trainingSessions = this.trainingSessions.sort((a, b) => {
        const dateA = new Date(a.created_at).getTime();

        const dateB = new Date(b.created_at).getTime();
        return dateA - dateB;
      });
    }

    if (orderBy.tooltip === 'desc') {
      this.trainingSessions = this.trainingSessions.sort((a, b) => {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return dateB - dateA;
      });
    }
  }

  /**
   * set session like
   * @param like
   * @param sessionId
   */
  handleLike(like: boolean, sessionId: number | string | undefined): void {
    this.trainingSessionService.setLike(sessionId as number, !like).subscribe(
      (res) => {
        this.getSessionsByRole();
      },
      ({ error }) => {
        this.msg.error(error);
      }
    );
  }
  handlePermission(permission: PermissionMethods): void {
    this.showPermission = { ...this.showPermission, ...permission };
  }

  ngOnDestroy(): void {
    if (this.$subscription) this.$subscription.unsubscribe();
  }
}
