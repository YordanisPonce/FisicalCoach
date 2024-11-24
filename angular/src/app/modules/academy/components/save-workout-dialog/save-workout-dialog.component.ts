import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Ejercicio } from '../../../../_models/ejercicio';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ExerciseService } from '../../../../_services/exercise.service';
import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs';
import { AlertsApiService } from 'src/app/generals-services/alerts-api.service';
import { ITeam } from 'src/app/_models/ITeam.interface';
import { AppStateService } from 'src/app/stateManagement/appState.service';
import { cloneDeep } from 'lodash';
import { RatingIcon } from 'src/app/utils/rating-icons';

@Component({
  selector: 'app-save-workout-dialog',
  templateUrl: './save-workout-dialog.component.html',
  styleUrls: ['./save-workout-dialog.component.scss'],
})
export class SaveWorkoutDialogComponent implements OnInit, OnDestroy {
  @Input() ejercicio: Ejercicio;
  @Input() visible: boolean = false;
  @Input() isProfilepage: boolean = false;
  @Input() step: number = 1;
  @Input() exerciseRole: string;
  @Input() exerciseCreated: any = null;
  @Input() ratingIcons: RatingIcon[] = [];
  @Output() dismiss: EventEmitter<any> = new EventEmitter();
  @Output() refreshExercises: EventEmitter<any> = new EventEmitter();
  @Output() openModel: EventEmitter<any> = new EventEmitter();
  selectedValue: any;
  formulario: UntypedFormGroup;
  submitted!: boolean;
  allList: any[] = [];
  workoutContentList: any[] = [];
  contentBlocks: { id: number; name: string; code: string }[] = [];
  educationLevels: { id: number; name: string; code: string }[] = [];

  selectedTargets: any[] = [];
  selectedBlockTargets: any[] = [];
  selectedEducationalTargets: number;
  resources = environment.images + 'images';
  selectedIntesityIndex: any = null;
  loading: boolean = false;
  exercise: Ejercicio;
  subs$ = new Subscription();
  distributionList: any[] = [];
  team: ITeam;
  contentError: string = '';
  extraSteps: any[] = [];
  repetitions: any;
  repetitionDuration: string = '';
  searchContent: string = '';
  role: string = '';

  constructor(
    private formBuilder: UntypedFormBuilder,
    private exerciseService: ExerciseService,
    private msg: AlertsApiService,
    private appStateService: AppStateService
  ) {}

  get f() {
    return this.formulario.controls;
  }

  getScreenWidth(): any {
    return screen.width;
  }

  ngOnInit(): void {
    this.team = this.appStateService.getTeam();
    this.role = localStorage.getItem('role') as string;

    if (
      this.validateRoles(this.isProfilepage ? 'sport' : '', this.exerciseRole)
    ) {
      this.loadExerciseContent();
    } else if (this.role === 'sport') {
      this.loadExerciseContent();
    }

    this.loadDistributions();

    if (this.exerciseCreated || this.ejercicio) this.getExerciseData();
  }

  loadDistributions() {
    this.exerciseService.getListDistribuciones().subscribe((res) => {
      this.distributionList = res.data;
    });
  }

  getClassroomContents(): void {
    this.subs$ = this.exerciseService.getContentBlocks().subscribe((res) => {
      this.contentBlocks = res.data;
      this.allList = res.data;

      if (this.exercise.content_blocks.length > 0) {
        this.selectedBlockTargets = this.exercise.content_blocks.map(
          (content) => content.id
        );
      }

      this.extraSteps = [3];
      this.exerciseService.getEducationLevels().subscribe((res) => {
        this.educationLevels = res.data;
        this.allList = res.data;
        this.extraSteps = [...this.extraSteps, 4];

        this.selectedEducationalTargets = this.exercise
          .exercise_education_level_id as number;
      });
    });
  }

  getExerciseData(): void {
    this.subs$ = this.exerciseService
      .getByCode(
        this.exerciseCreated?.exercise_code || this.ejercicio?.code,
        this.team?.id || null
      )
      .subscribe((res) => {
        this.exercise = res.data;

        if (this.exercise.targets?.length > 0) {
          this.selectedTargets = this.exercise.targets.map(
            (target) => target.id
          );
        }

        if (
          this.validateRoles(
            this.isProfilepage ? 'teacher' : '',
            this.exerciseRole
          )
        ) {
          this.getClassroomContents();
        } else if (this.role === 'teacher') {
          this.getClassroomContents();
        }

        this.cargarFormulario(this.exercise);
      });
  }

  loadExerciseContent() {
    this.subs$ = this.exerciseService
      .getListContenidos(this.ejercicio?.sport?.code || this.team.sport.code)
      .subscribe((res) => {
        this.allList = cloneDeep(this.getContentList(res.data));
        this.workoutContentList = cloneDeep(this.getContentList(res.data));

        this.extraSteps = this.workoutContentList.map((item, i) => i + 3);
      });
  }

  getContentList(data: Ejercicio[]): any {
    return [
      ...data.map((content: Ejercicio) => {
        return {
          ...content,
          sub_contents: content.sub_contents
            .filter((sub) => sub.targets.length > 0)
            .map((sub) => ({
              name: sub.name,
              targets: sub.targets.map(
                (target: {
                  sub_content_session_id: any;
                  name: any;
                  id: any;
                }) => ({
                  name: target.name,
                  value: target.id,
                  content_exercise_id: sub.content_exercise_id,
                  sub_content_session_id: target.sub_content_session_id,
                  sub_content_name: sub.name,
                })
              ),
            })),
          targets: content.targets.map((target) => ({
            name: target.name,
            value: target.id,
            content_exercise_id: target.content_exercise_id,
          })),
        };
      }),
    ];
  }

  cargarFormulario(ejercicio?: Ejercicio): void {
    this.formulario = this.formBuilder.group({
      id: [ejercicio ? ejercicio.id : null],
      code: [ejercicio ? ejercicio.code : null],
      title: [ejercicio ? ejercicio.title : null, Validators.required],
      description: [ejercicio ? ejercicio.description : null],
      dimentions: [ejercicio ? `${ejercicio.dimentions}` : null],
      duration: [ejercicio ? ejercicio.duration : null, Validators.required],
      repetitions: [ejercicio ? ejercicio.repetitions : null],
      duration_repetitions: [ejercicio ? ejercicio.duration_repetitions : null],
      break_repetitions: [ejercicio ? ejercicio.break_repetitions : null],
      series: [ejercicio ? ejercicio.series : null],
      break_series: [ejercicio ? ejercicio.break_series : null],
      difficulty: [ejercicio ? ejercicio.difficulty : null],
      intensity: [ejercicio ? ejercicio.intensity : null],
      distribution_exercise_id: [
        ejercicio ? ejercicio.distribution_exercise_id : null,
      ],
      team_id: [ejercicio ? ejercicio.team_id : null],
    });

    if (ejercicio && ejercicio.duration_repetitions) {
      this.repetitionDuration = ejercicio.duration_repetitions;
    }
    if (ejercicio && ejercicio.repetitions) {
      this.repetitions = ejercicio.repetitions;
    }
  }

  onSubmit() {
    this.submitted = true;

    if (this.formulario.invalid) {
      return;
    }

    let contentIds: number[] = [];
    let data;

    this.loading = true;

    if (this.role === 'sport' || this.exerciseRole === 'team') {
      this.workoutContentList.forEach((content) => {
        content.sub_contents.forEach((subContent: any) => {
          subContent.targets.forEach((target: any) => {
            if (this.selectedTargets.some((item) => item === target.value)) {
              contentIds = [...contentIds, content.id];
            }
          });
        });

        content.targets.forEach((target: any) => {
          if (this.selectedTargets.some((item) => item === target.value)) {
            contentIds = [...contentIds, content.id];
          }
        });
      });

      data = {
        ...this.formulario.value,
        content_exercise_ids: [...new Set(contentIds)],
        target_ids: this.selectedTargets.map((item) => item),
        team_id: this.team?.id || null,
      };
    } else {
      this.contentBlocks.forEach((content) => {
        contentIds = [...contentIds, content.id];
      });

      data = {
        ...this.formulario.value,
        exercise_education_level_id: this.selectedEducationalTargets || null,
        content_block_ids: this.selectedBlockTargets,
      };
    }

    if (this.role === 'sport' || this.exerciseRole === 'team') {
      this.exerciseService.update(data).subscribe(
        (res) => {
          this.msg.succes(res.message);
          this.refreshExercises.emit(false);
          this.formulario.reset();
          this.loading = false;
        },
        ({ error }) => {
          this.msg.error(error);
          this.loading = false;
        }
      );
    } else {
      this.exerciseService
        .updateClassroomExercise(data, this.team.id)
        .subscribe(
          (res) => {
            this.msg.succes(res.message);
            this.refreshExercises.emit(false);
            this.formulario.reset();
            this.loading = false;
          },
          ({ error }) => {
            this.msg.error(error);
            this.loading = false;
          }
        );
    }
  }

  save() {
    this.submitted = true;
    const stepOneValidation =
      this.step === 1 && this.f?.title?.errors?.required;
    const stepTwoValidation =
      this.step === 2 && this.f?.duration?.errors?.required;

    if (this.formulario.invalid && (stepOneValidation || stepTwoValidation)) {
      return;
    }
    if (this.step < 4 + this.extraSteps.length - 1) {
      this.step++;
      return;
    }
    this.onSubmit();
  }

  open3D(): void {
    this.openModel.emit({
      ...this.ejercicio,
      ...this.team,
      exercise_code: this.ejercicio.code,
      mode: 'edit',
    });
  }

  handleTargets(): void {
    if (this.selectedTargets.length > 0) this.contentError = '';
  }

  selectIntensity(value: number, index: number): void {
    this.formulario.get('intensity')?.setValue(value);
    this.selectedIntesityIndex = index;

    this.formulario.get('intensity')?.value;
  }

  handleRepetitions(value: string, type: string): void {
    let separateValue: string[];
    if (type === 'repetition' && value) {
      this.repetitions = parseInt(value);

      if (this.repetitionDuration)
        this.handleDuration(this.repetitionDuration.split(':'));
    }

    if (type === 'duration' && value) {
      separateValue = value.split(':');

      this.handleDuration(separateValue);
    }
  }

  handleDuration(separateValue: any): void {
    let minToSecons: number;
    let secondsToMin: number;
    let totalSeconds: number;
    let seconds: number;
    let repetitionTotalDuration: number;
    let totalDurationMinutes: string;
    let totalDurationSeconds: string;
    let totalDuration: string = '00:00';

    const isFullField = separateValue.every(
      (item: string) => !item.includes('_')
    );

    if (isFullField) {
      minToSecons = parseInt(separateValue[0]) * 60;
      seconds = parseInt(separateValue[1]);

      repetitionTotalDuration = this.repetitions * (minToSecons + seconds);

      if (repetitionTotalDuration > 0) {
        secondsToMin = Math.floor(repetitionTotalDuration / 60);
        totalSeconds = repetitionTotalDuration - secondsToMin * 60;

        totalDurationMinutes =
          secondsToMin < 10 ? `0${secondsToMin}` : `${secondsToMin}`;
        totalDurationSeconds =
          totalSeconds < 10 ? `0${totalSeconds}` : `${totalSeconds}`;

        totalDuration = `${totalDurationMinutes}:${totalDurationSeconds}`;

        this.formulario.get('duration')?.setValue(totalDuration);
      }
    }
  }

  /**
   * Filter content
   * @param e Event
   */
  setValue() {
    if (this.role === 'sport') {
      let filterSubContents: any[] = [];
      let filterTargets: any[] = [];

      this.allList?.forEach((item) => {
        item.sub_contents.forEach((sub: any) => {
          const list = sub.targets.filter((subContent: { name: string }) =>
            subContent.name.toLowerCase().includes(this.searchContent)
          );

          filterSubContents = [
            ...filterSubContents,
            {
              id: item.id,
              name: sub.name,
              targets: list.map((listItem: any) => ({
                ...listItem,
              })),
            },
          ];
        });

        if (item.targets.length > 0) {
          const list = item.targets.filter((subContent: { name: string }) =>
            subContent.name.toLowerCase().includes(this.searchContent)
          );

          filterTargets = [...filterTargets, list];
        }
      });

      if (this.searchContent) {
        filterSubContents.forEach((sub: any) => {
          this.workoutContentList?.forEach((workoutItem, i) => {
            workoutItem.sub_contents.forEach(
              (subContent: { name: any }, j: number) => {
                if (sub.name === subContent.name) {
                  this.workoutContentList[i].sub_contents[j].targets =
                    sub.targets;
                }
              }
            );
          });
        });

        filterTargets.forEach((item: any) => {
          item.forEach((target: any) => {
            this.workoutContentList?.forEach((workoutItem, i) => {
              if (workoutItem.id === target.content_exercise_id) {
                this.workoutContentList[i].targets = item;
              }
            });
          });
        });
      } else {
        this.workoutContentList = cloneDeep(this.allList);
      }
    } else {
      this.searchBlocks();
    }
  }

  searchBlocks(): void {
    const filterCompetition = this.contentBlocks?.filter((item) =>
      item.name.toLowerCase().includes(this.searchContent)
    );

    if (this.searchContent.length > 0) {
      this.contentBlocks = filterCompetition;
    } else {
      this.contentBlocks = this.allList;
    }
  }

  salir() {
    this.dismiss.emit(false);
  }

  validateRoles(role: string, exerciseRole: string): boolean {
    if (
      (role === 'sport' && !this.isProfilepage) ||
      (role === 'sport' && exerciseRole === 'team' && this.isProfilepage)
    ) {
      return true;
    } else if (
      (role === 'teacher' && !this.isProfilepage) ||
      (role === 'teacher' && exerciseRole === 'classroom' && this.isProfilepage)
    ) {
      return true;
    } else {
      return false;
    }
  }

  ngOnDestroy(): void {
    if (this.subs$) this.subs$.unsubscribe();
  }
}
