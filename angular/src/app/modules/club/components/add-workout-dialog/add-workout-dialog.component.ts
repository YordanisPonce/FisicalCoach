import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { AppStateService } from 'src/app/stateManagement/appState.service';
import { ITeam } from 'src/app/_models/ITeam.interface';
import { ExerciseService } from 'src/app/_services/exercise.service';
import { Ejercicio } from 'src/app/_models/ejercicio';
import { Subscription } from 'rxjs';
import { AlertsApiService } from 'src/app/generals-services/alerts-api.service';
import { TrainingSessionService } from 'src/app/_services/training.service';

@Component({
  selector: 'add-workout-dialog',
  templateUrl: './add-workout-dialog.component.html',
  styleUrls: ['./add-workout-dialog.component.scss'],
})
export class AddWorkoutDialogComponent implements OnInit, OnDestroy {
  constructor(
    private exerciseService: ExerciseService,
    private trainingService: TrainingSessionService,
    private appStateService: AppStateService,
    private msg: AlertsApiService
  ) {}

  $subs = new Subscription();
  materials: any[];
  loading: boolean = false;
  team: ITeam;
  exerciseList: Ejercicio[] = [];
  allExercises: Ejercicio[] = [];
  selectedExerciseList: Ejercicio[] = [];
  searchExercise: string;
  sending: boolean = false;
  role: string;

  ratingIcons = [
    {
      icon: '5_green_face.svg',
      value: 1,
      text: 'very_good',
      color: '#00E9C5',
    },

    {
      icon: '4_Blue_face.svg',
      value: 2,
      text: 'good',
      color: '#035AC8',
    },

    {
      icon: '3_yellow_face.svg',
      value: 3,
      text: 'regular',
      color: '#869E1D',
    },
    {
      icon: '2_orange_face.svg',
      value: 4,
      text: 'bad',
      color: '#9C6F17',
    },
    {
      icon: '1_red_face.svg',
      value: 5,
      text: 'very_bad',
      color: '#F92F28',
    },
  ];

  @Input() visible: boolean = false;
  @Input() trainingId: number;
  @Input() sessionCode: string;
  @Input() exerciseListLength: number;
  @Output() close = new EventEmitter<boolean>();
  @Output() refreshList = new EventEmitter<boolean>();

  ngOnInit(): void {
    this.role = localStorage.getItem('role') as string;
    this.team = this.appStateService.getTeam();
    this.getExercises();
  }

  getExercises() {
    this.loading = true;
    this.trainingService
      .getAvailableExercises(this.sessionCode, this.team.id, this.role)
      .subscribe((res) => {
        this.exerciseList = res.data;
        this.allExercises = res.data;
        this.loading = false;
      });
  }

  closeDialog() {
    this.close.emit(false);
  }

  selectExercises(exercise: Ejercicio): void {
    if (this.selectedExerciseList.find((item) => item.id === exercise.id)) {
      this.selectedExerciseList = this.selectedExerciseList
        .filter((exerciseItem) => exerciseItem.id !== exercise.id)
        .map((item, i) => ({
          ...item,
          order: i + 1,
        }));
    } else {
      exercise.order = this.selectedExerciseList.length + 1;

      this.selectedExerciseList = [...this.selectedExerciseList, exercise];
    }
  }

  /**
   * Filter exercises
   * @param e
   */
  /**
   * Filter competition
   * @param e Event
   */
  setValue(e: KeyboardEvent) {
    const filterCompetition = this.exerciseList?.filter((item) =>
      item.title.toLowerCase().includes(this.searchExercise)
    );

    if (this.searchExercise.length > 0) {
      this.exerciseList = filterCompetition;
    } else {
      this.exerciseList = this.allExercises;
    }
  }

  /**
   * submit exercises
   */
  submit(): void {
    this.sending = true;

    const exercices: Partial<Ejercicio>[] = this.selectedExerciseList.map(
      (item, i) => ({
        exercise_id: item.id,
        work_groups: [],
        duration: item.duration || '00:00',
        repetitions: item.repetitions,
        duration_repetitions: item.duration_repetitions,
        break_repetitions: item.break_repetitions,
        series: item.series,
        sport_id: item.sport_id,
        break_series: item.break_series,
        difficulty: item.difficulty || 0,
        intensity: item.intensity || 0,
        order: item.order + this.exerciseListLength,
      })
    );

    this.$subs = this.exerciseService
      .storeExerciseSession(exercices, this.trainingId)
      .subscribe(
        (res) => {
          this.msg.succes(res.message);
          this.close.emit(true);
          this.refreshList.emit(true);
          this.sending = false;
        },
        ({ error }) => {
          this.msg.error(error);
          this.sending = false;
        }
      );
  }

  ngOnDestroy(): void {
    if (this.$subs) this.$subs.unsubscribe;
  }
}
