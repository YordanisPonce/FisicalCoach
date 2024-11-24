import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AppStateService } from 'src/app/stateManagement/appState.service';
import { RatingIcon, ratingIcons } from 'src/app/utils/rating-icons';
import { Ejercicio } from 'src/app/_models/ejercicio';
import { ITeam } from 'src/app/_models/ITeam.interface';
import { Session } from 'src/app/_models/session';
import { ExerciseService } from 'src/app/_services/exercise.service';
import { environment } from 'src/environments/environment';
import { AlertsApiService } from 'src/app/generals-services/alerts-api.service';
import { TrainingSessionService } from 'src/app/_services/training.service';

@Component({
  selector: 'app-trainings-sessions-details',
  templateUrl: './trainings-sessions-details.component.html',
  styleUrls: ['./trainings-sessions-details.component.scss'],
})
export class TrainingsSessionsDetailsComponent implements OnInit, OnDestroy {
  constructor(
    public route: ActivatedRoute,
    private trainingService: TrainingSessionService,
    private exerciseService: ExerciseService,
    private appStateService: AppStateService,
    public location: Location,
    private msg: AlertsApiService
  ) {}

  $subs = new Subscription();
  ratingValue: number = 0;
  materials: boolean = false;
  asistence: boolean = false;
  addWorkout: boolean = false;
  showGroupDialog: boolean = false;

  traningCode: string = '';
  team: ITeam;
  loadingSessionDetails: boolean = false;
  sessionDetails: Session;
  sessionExercises: Partial<Ejercicio>[];
  allSessionExercises: Partial<Ejercicio>[];
  searchExercise: string = '';
  resources = environment.images + 'images';
  showIFrame: boolean = false;
  urlIframe: string = '';
  exerciseCreated: Ejercicio;
  showCreate: boolean = false;
  showTargetsAndObjetives: boolean = false;
  deleteLoading: boolean = false;
  workoutContentList: any[] = [];
  role: string = '';
  ratingIcons: RatingIcon[] = [];
  intensityIcon: RatingIcon;

  ngOnInit(): void {
    this.role = localStorage.getItem('role') as string;
    this.traningCode = this.route.snapshot.paramMap.get('code') as string;
    this.team = this.appStateService.getTeam();

    this.ratingIcons = ratingIcons;

    this.getExercises();
  }

  /**
   * Filter exercises
   * @param e
   */
  setValue() {
    const filterExercise = this.sessionExercises?.filter((item) =>
      item.title?.toLowerCase().includes(this.searchExercise)
    );

    if (this.searchExercise.length > 0) {
      this.sessionExercises = filterExercise;
    } else {
      this.sessionExercises = this.allSessionExercises;
    }
  }

  getExercises(): void {
    this.loadingSessionDetails = true;
    this.$subs = this.exerciseService
      .getSession(this.traningCode, this.team.id, this.role)
      .subscribe((res: { data: Session }) => {
        this.sessionDetails = res.data;

        const list = this.sessionDetails.exercise_session_exercises.map(
          (item) => ({
            ...item.exercise,
            exercise_session_id: item.id,
            duration: item.duration,
            difficulty: item.difficulty,
            intensity: item.intensity,
            author: res.data.author,
            code: item.code,
            order: item.order,
          })
        );

        const findIntensity = this.ratingIcons.find(
          (item) => item.value === this.sessionDetails.intensity
        );

        if (!!findIntensity) {
          this.intensityIcon = findIntensity;
        }

        this.sessionExercises = list;
        this.allSessionExercises = list;

        if (this.sessionDetails.contents?.length > 0) {
          this.getContents(this.sessionDetails);
        }

        this.ratingValue = this.sessionDetails.difficulty;
        this.loadingSessionDetails = false;
      });
  }

  getContents(exercise: Session): void {
    let targets: any[] = [];
    this.workoutContentList = exercise.contents.map((content) => {
      let sub_contents: any[] = [];
      const findTargets = this.sessionDetails.targets_groups.filter(
        (target) => target.content_exercise_id === content.id
      );

      if (findTargets.length > 0) {
        let targetName = '';
        findTargets.forEach((target) => {
          if (target.sub_content_session?.content_exercise_id === content.id) {
            targets = [];

            findTargets.forEach((item, i) => {
              if (
                item.sub_content_session_id === target.sub_content_session_id
              ) {
                targets = [...targets, item];
              }
            });

            targetName = target.sub_content_session.name;

            sub_contents = [
              ...sub_contents,
              {
                name: targetName,
                targets: targets,
              },
            ];
          } else {
            targets = [...targets, target];
          }
        });

        if (!targetName) {
          return {
            ...content,
            targets,
            sub_contents: [],
          };
        }
      }

      const removeDUplicates = sub_contents.filter(
        (obj, index, self) =>
          index === self.findIndex((t) => t.name === obj.name)
      );

      targets = [];

      return {
        ...content,
        sub_contents: removeDUplicates,
        targets: [],
      };
    });
  }

  open3DIframe(event: any) {
    this.showCreate = false;
    this.urlIframe = event?.sport ? event.sport.model_url : '';
    this.showIFrame = true;
    this.exerciseCreated = event;
  }

  cerrarModalIframe(event: any) {
    this.showIFrame = event;
  }

  close3DModal(event: any): void {
    this.showIFrame = event;
  }

  handleLike(like: boolean): void {
    this.exerciseService.setLike(this.sessionDetails.id, !like).subscribe(
      (res) => {
        this.sessionDetails.like = !this.sessionDetails.like;
      },
      ({ error }) => {
        this.msg.error(error);
      }
    );
  }

  /**
   * delete or update order list
   * @param event
   */
  deleteExercise(event: Ejercicio): void {
    this.deleteLoading = true;
    const filter = this.sessionExercises
      .filter((exercise) => (exercise.order as number) > event.order)
      .map((item) => ({
        id: item.exercise_session_id as number,
        order: (item.order as number) - 1,
      }));

    if (filter.length > 0) {
      this.$subs = this.trainingService
        .updateOrderExercise(this.sessionDetails.id, filter)
        .subscribe(
          (res) => {
            this.delete(event);
          },
          ({ error }) => {
            this.msg.error(error);
            this.deleteLoading = false;
          }
        );
    } else {
      this.delete(event);
    }
  }

  /**
   * delete
   * @param exercise
   */
  delete(exercise: Ejercicio): void {
    this.$subs = this.trainingService
      .deleteSessionExercise(exercise.code)
      .subscribe(
        (res) => {
          this.msg.succes(res.message);

          this.getExercises();
          this.deleteLoading = false;
        },
        ({ error }) => {
          this.msg.error(error);
          this.deleteLoading = false;
        }
      );
  }

  ngOnDestroy(): void {
    if (this.$subs) this.$subs.unsubscribe();
  }
}
