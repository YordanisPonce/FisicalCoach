import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { AlertsApiService } from 'src/app/generals-services/alerts-api.service';
import { AppStateService } from 'src/app/stateManagement/appState.service';
import { Ejercicio } from 'src/app/_models/ejercicio';
import { ITeam } from 'src/app/_models/ITeam.interface';
import { Sport } from 'src/app/_models/sport';
import { ExerciseService } from 'src/app/_services/exercise.service';
import { SportService } from 'src/app/_services/sport.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-my-exercises',
  templateUrl: './my-exercises.component.html',
  styleUrls: ['./my-exercises.component.scss'],
  providers: [ConfirmationService],
})
export class MyExercisesComponent implements OnInit, OnDestroy {
  constructor(
    private exerciseService: ExerciseService,
    private appStateService: AppStateService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private msg: AlertsApiService,
    private sportService: SportService,
    private translateService: TranslateService
  ) {}

  $subs = new Subscription();
  exercises: Ejercicio[] = [];
  allExercises: Ejercicio[] = [];
  allExercisesSelected: Ejercicio[] = [];
  exercise: Ejercicio;
  team: ITeam;
  urlIframe: string = '';
  updateCurrentStep: number = 1;
  exerciseCreated: Ejercicio;
  loading: boolean = false;
  showCreate: boolean = false;
  showUpdate: boolean = false;
  showIFrame: boolean = false;
  showSaveChanges: boolean = false;
  assingTeamDialog: boolean = false;
  selectedExercise: number;
  searchExercise: string;
  sportList: Sport[] = [];
  selectedSports: Sport[] = [];
  exerciseRole: string;
  exerciseSportId: number;

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

  ngOnInit(): void {
    this.team = this.appStateService.getTeam();
    this.getUserExercises();
    this.getSportList();
  }

  /**
   * get user sports
   */
  getSportList(): void {
    this.$subs = this.sportService.getSportList('true').subscribe((res) => {
      this.sportList = res.data;
    });
  }

  /**
   * handle selected sports
   * @param sport
   */
  handleSelectSports(): void {
    this.resetList();

    this.exercises = this.exercises.filter((exercise) =>
      this.selectedSports.find((sport) => sport.id === exercise.sport_id)
    );

    this.allExercises = this.exercises.filter((exercise) =>
      this.selectedSports.find((sport) => sport.id === exercise.sport_id)
    );

    if (this.selectedSports.length === 0) this.resetList();
  }

  resetList(): void {
    this.exercises = this.allExercisesSelected;
    this.allExercises = this.allExercisesSelected;
  }

  /**
   * show all
   */
  showAllexercises(): void {
    this.exercises = this.allExercisesSelected;
    this.allExercises = this.allExercisesSelected;
    this.searchExercise = '';
    this.selectedSports = [];
  }

  /**
   * search exercises
   * @param e Event
   */
  setValue(e: KeyboardEvent) {
    const filterCompetition = this.exercises?.filter((item) =>
      item.title.toLowerCase().includes(this.searchExercise)
    );

    if (this.searchExercise.length > 0) {
      this.exercises = filterCompetition;
    } else {
      this.exercises = this.allExercises;
    }
  }

  openAssingTeamDialog({
    exerciseId,
    exerciseRole,
    sport_id,
  }: {
    exerciseId: number;
    exerciseRole: string;
    sport_id: number;
  }): void {
    this.selectedExercise = exerciseId;
    this.exerciseRole = exerciseRole;
    this.exerciseSportId = sport_id;
    this.assingTeamDialog = true;
  }

  getUserExercises(): void {
    this.loading = true;
    this.$subs = this.exerciseService.getUserExercises().subscribe((res) => {
      this.exercises = res.data;

      this.allExercises = res.data;
      this.allExercisesSelected = res.data;
      this.loading = false;
    });
  }

  open3DIframe(event: any) {
    this.showCreate = false;
    this.urlIframe = event?.sport ? event.sport.model_url : '';
    this.showIFrame = true;
    this.exerciseCreated = event;
  }

  verDetalle(event: any) {
    this.exercise = event;
    this.appStateService.setWorkout(event);
    this.router.navigate(['club/workout/detalle']);
  }

  updateExercise(event: any) {
    this.exercise = event.exercise;
    this.exerciseRole = event.exerciseRole;
    this.showUpdate = true;
    this.updateCurrentStep = 1;
  }

  deleteExercise(event: any) {
    this.exercise = event;

    this.confirm(event);
  }

  closeDialog(): void {
    this.showCreate = false;
  }

  cerrarModalIframe(event: any) {
    this.showIFrame = event;
    this.showUpdate = true;
    this.updateCurrentStep = 2;
  }

  closeModalIframe(event: any) {
    this.showIFrame = event;
  }

  close3DModal(event: any): void {
    this.showIFrame = event;
  }

  cerrarModalUpdate() {
    this.showUpdate = false;
  }

  refreshData(): void {
    this.getUserExercises();
    this.showUpdate = false;
  }

  confirm(event: any) {
    const message = this.translateService.instant(
      'workout.areYouSureToDeleteExercice'
    );

    this.confirmationService.confirm({
      message: message,
      accept: () => {
        this.$subs = this.exerciseService.delete(event).subscribe(
          (res) => {
            this.msg.succes(res.message);
            this.getUserExercises();
          },
          ({ error }) => {
            this.msg.error(error);
          }
        );
      },
    });
  }

  ngOnDestroy(): void {
    if (this.$subs) this.$subs.unsubscribe();
  }
}
