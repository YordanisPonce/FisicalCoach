import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ITeam } from 'src/app/_models/ITeam.interface';
import { environment } from 'src/environments/environment';
import { Ejercicio } from '../../../../_models/ejercicio';

@Component({
  selector: 'app-exercise-card',
  templateUrl: './exercise-card.component.html',
  styleUrls: ['./exercise-card.component.scss'],
})
export class ExerciseCardComponent implements OnInit {
  @Input() ejercicio: Ejercicio;
  @Input() team: ITeam;
  @Input() exerciseList: Ejercicio[] = [];
  @Input() isSessionPage: boolean = false;
  @Input() isSessionDetailsPage: boolean = false;
  @Input() isProfilePage: boolean = false;
  @Input() ratingIcons: {
    icon: string;
    value: number;
    text: string;
    color: string;
  }[] = [];
  @Output() detalle: EventEmitter<any> = new EventEmitter<any>();
  @Output() assingTeam: EventEmitter<{
    exerciseId: number;
    exerciseRole: string;
    sport_id: number;
  }> = new EventEmitter<{
    exerciseId: number;
    exerciseRole: string;
    sport_id: number;
  }>();
  @Output() updateExercise: EventEmitter<any> = new EventEmitter<any>();
  @Output() deleteExercise: EventEmitter<any> = new EventEmitter<any>();
  @Output() openModel: EventEmitter<any> = new EventEmitter<any>();
  @Output() handleExerciseId: EventEmitter<Ejercicio> =
    new EventEmitter<Ejercicio>();

  resources = environment.images + 'images';
  intensityIcon: {
    icon: string;
    value: number;
    text: string;
    color: string;
  };

  constructor(private router: Router) {}

  ngOnInit(): void {
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

  handleExerciseDetails(exerciseCode: string = '') {
    if (this.isSessionDetailsPage) {
      this.router.navigate([
        `training-sessions/exercise/details/${exerciseCode}`,
      ]);
    } else {
      this.openModel.emit({
        ...this.ejercicio,
        ...this.team,
        exercise_code: this.ejercicio.code,
        mode: 'show',
      });
    }
  }

  createModel3D(thumbnail?: string): void {
    if (thumbnail) {
      console.log('show');
      this.openModel.emit({
        ...this.ejercicio,
        ...this.team,
        sport: {
          ...this.ejercicio.sport,
          model_url: this.ejercicio.sport.model_url,
        },
        exercise_code: this.ejercicio.code,
        mode: 'show',
      });
    } else {
      console.log('new');
      this.openModel.emit({
        ...this.ejercicio,
        ...this.team,
        sport: {
          ...this.ejercicio.sport,
          model_url: this.ejercicio.sport.model_url,
        },
        exercise_code: this.ejercicio.code,
        mode: 'new',
      });
    }
  }

  assingTeamDialog() {
    this.assingTeam.emit({
      exerciseId: this.ejercicio.id,
      exerciseRole: !!this.ejercicio.teams ? 'team' : 'classroom',
      sport_id: this.ejercicio.sport_id || 0,
    });
  }

  update() {
    this.updateExercise.emit({
      exercise: this.ejercicio,
      exerciseRole: !!this.ejercicio.teams ? 'team' : 'classroom',
    });
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

  handleDelete(): void {
    this.deleteExercise.emit(this.ejercicio);
  }
}
