import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AlertsApiService } from 'src/app/generals-services/alerts-api.service';
import { RatingIcon, ratingIcons } from 'src/app/utils/rating-icons';
import { Ejercicio } from 'src/app/_models/ejercicio';
import { ExerciseService } from 'src/app/_services/exercise.service';
import { environment } from 'src/environments/environment';
import { saveAs } from 'file-saver';
import { ITeam } from 'src/app/_models/ITeam.interface';
import { AppStateService } from 'src/app/stateManagement/appState.service';

@Component({
  selector: 'workout-details',
  templateUrl: './workout-details.component.html',
  styleUrls: ['./workout-details.component.scss'],
})
export class WorkoutDetailsComponent implements OnInit, OnDestroy {
  private history: string[] = [];
  constructor(
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private exerciseService: ExerciseService,
    private router: Router,
    public location: Location,
    private msg: AlertsApiService,
    private appStateService: AppStateService
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.history.push(event.urlAfterRedirects);
      }
    });
  }

  val: number = 2;
  $subs = new Subscription();
  workoutForm: UntypedFormGroup;
  exercise: Ejercicio;
  details: Ejercicio;
  exerciseCode: string;
  exerciseDifficulty: number = 0;
  loadingExercise: boolean = false;
  isTrainingRoute: boolean = false;
  loading: boolean = false;
  resources = environment.images + 'images';
  intensityIcon: {
    icon: string;
    value: number;
    text: string;
    color: string;
  };
  ratingIcons: RatingIcon[] = [];
  showGroupDialog: boolean = false;
  showTargetsAndObjetives: boolean = false;
  loadingSinglePDF: boolean = false;
  showRatingDialog: boolean = false;
  urlIframe: string = '';
  show3dDialog: boolean = false;
  exerciseCreated: Ejercicio;
  team: ITeam;
  role: string = '';
  workoutContentList: any[] = [];

  ngOnInit(): void {
    this.exerciseCode = this.route.snapshot.paramMap.get('code') as string;
    this.isTrainingRoute = this.router.url.includes('/club/training-sessions');
    this.ratingIcons = ratingIcons;
    this.team = this.appStateService.getTeam();
    this.role = localStorage.getItem('role') as string;

    this.loadForm();

    this.getExerciseDetails();
  }

  previousPage(): void {
    this.location.back();
  }

  getExerciseDetails(): void {
    this.loadingExercise = true;
    if (!this.isTrainingRoute) {
      this.$subs = this.exerciseService
        .getByCode(this.exerciseCode, this.team?.id || null)
        .subscribe((res) => {
          this.exercise = res.data;

          this.loadForm(this.exercise);
          this.exerciseDifficulty = this.exercise.difficulty || 0;
          this.loadingExercise = false;

          if (this.exercise.contents?.length > 0) {
            this.getContents(this.exercise);
          }

          this.getIntensity(this.exercise.intensity);
        });
    } else {
      this.$subs = this.exerciseService
        .getSessionExercise(this.exerciseCode)
        .subscribe((res) => {
          this.exercise = res.data.exercise;
          this.details = res.data;
          this.exerciseDifficulty = this.details.difficulty || 0;

          if (this.exercise.contents?.length > 0) {
            this.getContents(this.exercise);
          }

          this.loadForm(this.details);
          this.loadingExercise = false;

          this.getIntensity(this.details.intensity);
        });
    }
  }

  getContents(exercise: Ejercicio): void {
    let targets: any[] = [];
    this.workoutContentList = exercise.contents.map((content) => {
      let sub_contents: any[] = [];
      const findTargets = this.exercise.targets.filter(
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

  getIntensity(intensity: number): void {
    const findIntensity = this.ratingIcons.find(
      (item) => item.value === intensity
    );

    if (!!findIntensity) {
      this.intensityIcon = findIntensity;
    }
  }

  loadForm(exercise?: Ejercicio): void {
    this.workoutForm = this.formBuilder.group({
      code: [exercise?.code ? exercise.code : null],
      duration: [
        {
          value: exercise?.duration ? exercise.duration : '00:00',
          disabled: !this.isTrainingRoute,
        },
      ],
      repetitions: [
        {
          value: exercise?.repetitions ? exercise.repetitions : 0,
          disabled: !this.isTrainingRoute,
        },
      ],
      duration_repetitions: [
        {
          value: exercise?.duration_repetitions
            ? exercise.duration_repetitions
            : '00:00',
          disabled: !this.isTrainingRoute,
        },
      ],
      break_repetitions: [
        {
          value: exercise?.break_repetitions
            ? exercise.break_repetitions
            : '00:00',
          disabled: !this.isTrainingRoute,
        },
      ],
      series: [
        {
          value: exercise?.series ? exercise.series : 0,
          disabled: !this.isTrainingRoute,
        },
      ],
      break_series: [
        {
          value: exercise?.break_series ? exercise.break_series : '00:00',
          disabled: !this.isTrainingRoute,
        },
      ],
      difficulty: [
        {
          value: exercise?.difficulty ? exercise.difficulty : 0,
          disabled: !this.isTrainingRoute,
        },
      ],
      intensity: [
        {
          value: exercise?.intensity ? exercise.intensity : 0,
          disabled: !this.isTrainingRoute,
        },
      ],
    });
  }

  /**
   * update exercise
   */
  submit(): void {
    let data = null;
    this.loading = true;

    if (!this.isTrainingRoute) {
      data = {
        ...this.workoutForm.value,

        content_exercise_ids: this.exercise.contents.map((item) => item.id),
        target_ids: this.exercise.targets.map((item) => item.id),
      };

      this.$subs = this.exerciseService.update(data).subscribe(
        (res) => {
          this.loading = false;
          this.msg.succes(res.message);
          this.getExerciseDetails();
        },
        ({ error }) => {
          this.msg.error(error);
          this.loading = false;
        }
      );
    } else {
      data = {
        ...this.workoutForm.value,
        difficulty: this.exerciseDifficulty,
        intensity: this.intensityIcon?.value || 0,
        code: this.details.code,
      };

      this.$subs = this.exerciseService.updateSessionExercise(data).subscribe(
        (res) => {
          this.loading = false;
          this.msg.succes(res.message);
          this.getExerciseDetails();
        },
        ({ error }) => {
          this.msg.error(error);
          this.loading = false;
        }
      );
    }
  }

  open3DIframe() {
    this.urlIframe = this.exercise?.sport?.model_url
      ? this.exercise.sport.model_url
      : '';
    this.exerciseCreated = this.exercise;

    this.exerciseCreated.mode = this.exercise.image ? 'show' : 'new';
    this.exerciseCreated.exercise_code = this.exercise.code;

    this.show3dDialog = true;
  }

  close3DModal(event: any): void {
    this.exerciseCreated = event;
  }

  cerrarModalIframe(event: any) {
    this.exerciseCreated = event;
  }

  /**
   * download pdf
   */
  downloadPdf(): void {
    this.loadingSinglePDF = true;

    this.exerciseService.downloadExercisePdf(this.exercise.code).subscribe(
      (res: any) => {
        const blob = new Blob([res as any], { type: 'application/pdf' });
        saveAs(blob, `${this.exercise.title}.pdf`);
        this.loadingSinglePDF = false;
      },
      ({ error }: any) => {
        this.msg.error(error);
        this.loadingSinglePDF = false;
      }
    );
  }

  /**
   * update exercise like
   * @param like
   */
  handleLike(like?: boolean): void {
    this.exerciseService.setLike(this.exercise.id, !like).subscribe(
      (res) => {
        this.exercise.like = !this.exercise.like;
      },
      ({ error }) => {
        this.msg.error(error);
      }
    );
  }

  /**
   * get distribution image
   */
  getDistributionImage(code: string): string {
    const url =
      'https://testing-cdn.fisicalcoach.com/resources/images/distribution';

    switch (code) {
      case 'individual':
        return `${url}/individual.svg`;

      case 'group':
        return `${url}/grupal.svg`;

      case 'collective':
        return `${url}/colectiva.svg`;

      default:
        return '';
    }
  }

  ngOnDestroy(): void {
    if (this.$subs) this.$subs.unsubscribe();
  }
}
