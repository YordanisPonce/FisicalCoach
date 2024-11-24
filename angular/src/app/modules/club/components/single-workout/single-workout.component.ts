import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ITeam } from 'src/app/_models/ITeam.interface';
import { environment } from 'src/environments/environment';
import { Ejercicio } from '../../../../_models/ejercicio';
import { AlertsApiService } from 'src/app/generals-services/alerts-api.service';
import { ExerciseService } from 'src/app/_services/exercise.service';
import { PermissionMethods } from 'src/app/_directivas/user-permission.directive';
import { resourcesUrl } from 'src/app/utils/resources';

@Component({
  selector: 'app-single-workout',
  templateUrl: './single-workout.component.html',
  styleUrls: ['./single-workout.component.scss'],
})
export class SingleWorkoutComponent implements OnInit {
  @Input() ejercicio: Ejercicio;
  @Input() team: ITeam;
  @Input() exerciseList: Ejercicio[] = [];
  @Input() isSessionPage: boolean = false;
  @Input() isSessionDetailsPage: boolean = false;
  @Input() isWorkoutPage: boolean = false;
  @Input() isAddList: boolean = false;
  @Input() loadingPDF: boolean = false;
  @Input() deleteLoading: boolean = false;
  @Input() exerciseListLength: number;

  @Input() ratingIcons: {
    icon: string;
    value: number;
    text: string;
    color: string;
  }[] = [];
  @Output() detalle: EventEmitter<any> = new EventEmitter<any>();
  @Output() updateExercise: EventEmitter<any> = new EventEmitter<any>();
  @Output() deleteExercise: EventEmitter<any> = new EventEmitter<any>();
  @Output() openModel: EventEmitter<any> = new EventEmitter<any>();
  @Output() refreshExerciseList: EventEmitter<boolean> =
    new EventEmitter<boolean>();
  @Output() handleExerciseId: EventEmitter<Ejercicio> =
    new EventEmitter<Ejercicio>();

  resources = environment.images + 'images';
  role: string = '';
  intensityIcon: {
    icon: string;
    value: number;
    text: string;
    color: string;
  };
  showPermission: PermissionMethods;

  constructor(
    private exerciseService: ExerciseService,
    private msg: AlertsApiService
  ) {}

  ngOnInit(): void {
    this.role = localStorage.getItem('role') as string;
    const findIntensity = this.ratingIcons.find(
      (item) => item.value === this.ejercicio.intensity
    );

    if (!!findIntensity) {
      this.intensityIcon = findIntensity;
    }

    if (this.ejercicio.image?.full_url) {
      this.testImage(this.ejercicio.image.full_url);
    }
  }

  testImage(url: string): void {
    let tester = new Image();
    tester.addEventListener(
      'error',
      () =>
        (this.ejercicio.image.full_url =
          this.ejercicio.sport.image_exercise.full_url)
    );
    tester.src = url;
  }

  createModel3D(thumbnail: string): void {
    if (thumbnail) {
      console.log('show');
      this.openModel.emit({
        ...this.ejercicio,
        ...this.team,
        exercise_code: this.ejercicio.code,
        mode: 'show',
      });
    } else {
      console.log('new');
      this.openModel.emit({
        ...this.ejercicio,
        ...this.team,
        exercise_code: this.ejercicio.code,
        mode: 'new',
      });
    }
  }

  downloadPDF(code: string, title: string): void {
    this.loadingPDF = true;

    this.exerciseService.downloadPDF(code).subscribe(
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

  handleLike(like: boolean): void {
    this.exerciseService.setLike(this.ejercicio.id, !like).subscribe(
      (res) => {
        this.ejercicio.like = !this.ejercicio.like;
      },
      ({ error }) => {
        this.msg.error(error);
      }
    );
  }

  update() {
    this.updateExercise.emit(this.ejercicio);
  }

  /**
   * get selected exercises
   */
  getSelected(exercise: Ejercicio): boolean {
    return !!this.exerciseList.find((item) => item.id === exercise.id);
  }

  /**
   * get order
   */
  getOrder(exercise: Ejercicio): number {
    if (exercise.order && !this.isAddList) {
      return exercise.order;
    }

    return this.exerciseList.find((item) => item.id === exercise.id)
      ?.order as number;
  }

  /**
   * get distribution image
   */
  getDistributionImage(code: string): string {
    const url = `${resourcesUrl}/images/distribution`;

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
  handlePermission(permission: PermissionMethods): void {
    this.showPermission = { ...this.showPermission, ...permission };
  }

  handleDelete(): void {
    this.deleteExercise.emit(this.ejercicio);
  }
}
