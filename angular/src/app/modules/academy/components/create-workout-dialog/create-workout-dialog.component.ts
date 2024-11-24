import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
} from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Ejercicio } from '../../../../_models/ejercicio';
import { ExerciseService } from '../../../../_services/exercise.service';
import { DataView } from 'primeng/dataview';
import { AlertsApiService } from 'src/app/generals-services/alerts-api.service';
import { ITeam } from 'src/app/_models/ITeam.interface';
import { Sport } from 'src/app/_models/sport';

@Component({
  selector: 'app-create-workout-dialog',
  templateUrl: './create-workout-dialog.component.html',
  styleUrls: ['./create-workout-dialog.component.scss'],
})
export class CreateWorkoutDialogComponent implements OnInit {
  @Input() visible: boolean = false;
  @Input() team: ITeam;
  @Input() sportId: number;
  @Input() sportList: Sport[] = [];
  selectedValue: any;
  workoutForm: UntypedFormGroup;
  submitted!: boolean;
  @Output() dismiss: EventEmitter<any> = new EventEmitter();
  @Output() close: EventEmitter<any> = new EventEmitter();
  listadoDistribuciones: any[] = [];
  ejercicio: Ejercicio;
  cargandoEjercicios: boolean = true;
  listadoTemplates: Ejercicio[] = [];
  listadoDeportes: any[] = [];
  role: string;
  loading: boolean = false;

  template: Ejercicio;
  @ViewChild('dv') dv: DataView;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private exerciseService: ExerciseService,
    private msg: AlertsApiService
  ) {}

  get f() {
    return this.workoutForm.controls;
  }

  ngOnInit(): void {
    this.role = localStorage.getItem('role') as string;
    this.loadForm();
    this.cargarDistribuciones();
    this.cargarEjercicios();
  }

  testImage(item: Ejercicio): void {
    let tester = new Image();
    tester.addEventListener(
      'error',
      () => (item.image.full_url = item.sport.image_exercise.full_url)
    );
    tester.src = item.image.full_url;
  }

  filter(event: any) {
    return this.dv.filter(event.target.value);
  }

  cargarDistribuciones() {
    this.exerciseService.getListDistribuciones().subscribe((res) => {
      this.listadoDistribuciones = res.data;
    });
  }

  cargarEjercicios() {
    this.exerciseService.getAllByTeam(this.team.id).subscribe((res) => {
      this.listadoTemplates = res.data;

      if (this.listadoTemplates.length > 0) {
        this.listadoTemplates.forEach((item) => {
          if (item.image?.full_url) {
            this.testImage(item);
          }
        });
      }

      this.cargandoEjercicios = false;
    });
  }

  loadForm(ejercicio?: Ejercicio): void {
    this.workoutForm = this.formBuilder.group({
      id: [ejercicio ? ejercicio.id : null],
      code: [ejercicio ? ejercicio.code : null],
      title: [ejercicio ? ejercicio.title : null, Validators.required],
      description: [ejercicio ? ejercicio.description : null],
      dimentions: [ejercicio ? ejercicio.dimentions : null],
      duration: [ejercicio ? ejercicio.duration : null],
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
      content_exercise_id: [ejercicio ? ejercicio.content_exercise_id : null],
      team_id: [this.team?.id],
      sport_id: [ejercicio?.sport_id ? ejercicio.sport_id : null],
    });

    if (this.role === 'teacher') {
      this.workoutForm.controls['sport_id'].setValidators([
        Validators.required,
      ]);
    }
  }

  onSubmit() {
    this.submitted = true;
    if (this.workoutForm.invalid) {
      return;
    }

    this.loading = true;
    let data = this.workoutForm.value as Ejercicio;

    if (this.role === 'sport') {
      delete data.sport_id;
    }

    this.exerciseService.createExercise(data, this.team.id).subscribe(
      (res) => {
        this.open3DIframe({
          ...this.team,
          exercise_code: res.data.code,
          previous_code: this.template?.code || null,
          mode: 'new',
          sport: {
            model_url: res.data.sport?.model_url || this.team.sport.model_url,
          },
        });
        this.loading = false;
      },
      ({ error }) => {
        this.msg.error(error);
        this.loading = false;
      }
    );
  }

  open3DIframe(event?: any) {
    this.dismiss.emit(event);
  }

  closeDialog(event?: any) {
    this.close.emit(event);
  }

  seleccionarEjercicio(event: any) {
    this.template = event;
    this.loadForm(event);
  }
}
