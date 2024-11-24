import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ExerciseService } from '../../../../_services/exercise.service';
import { AppStateQuery } from '../../../../stateManagement/appState.query';
import { Subscription } from 'rxjs';
import { DataView } from 'primeng/dataview';
import { Ejercicio } from '../../../../_models/ejercicio';
import { Router } from '@angular/router';
import { AppStateService } from '../../../../stateManagement/appState.service';
import { AlertsApiService } from 'src/app/generals-services/alerts-api.service';
import { ConfirmationService } from 'primeng/api';
import { Package, User } from 'src/app/_models/user';
import { SportService } from 'src/app/_services/sport.service';
import { Sport } from 'src/app/_models/sport';
import { ratingIcons, RatingIcon } from 'src/app/utils/rating-icons';
import { PermissionMethods } from 'src/app/_directivas/user-permission.directive';
import {
  contentCodes,
  distributionCodes,
  workoutGeneralFilterList,
} from 'src/app/utils/filterOptions';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-workout',
  templateUrl: './workout.component.html',
  styleUrls: ['./workout.component.scss'],
  providers: [ConfirmationService],
})
export class WorkoutComponent implements OnInit, AfterViewInit {
  loading: boolean = false;

  showCreate: boolean = false;
  showSaveChanges: boolean = false;
  showUpdate: boolean = false;
  showIFrame: boolean = false;
  ejercicio: Ejercicio;
  updateCurrentStep: number = 1;
  confirmDialog: boolean = false;
  user: User;
  teacherPackage: Package;

  listadoEjercicios: any[] = [];
  allExercises: any[] = [];
  subscription: Subscription;
  team: any;
  @ViewChild('dv') dv: DataView;
  urlIframe: string = '';
  exerciseCreated: Ejercicio;
  sportList: Sport[] = [];
  role: string;

  ratingIcons: RatingIcon[] = [];

  showPermission: PermissionMethods;
  filterOptions: any[] | undefined;

  selectedFilter: any;

  constructor(
    private exerciseService: ExerciseService,
    private appStateQuery: AppStateQuery,
    private appStateService: AppStateService,
    private router: Router,
    private msg: AlertsApiService,
    private confirmationService: ConfirmationService,
    private sportService: SportService,
    private translateService: TranslateService
  ) {}

  ngAfterViewInit(): void {
    this.getExercises();
  }

  ngOnInit(): void {
    this.role = localStorage.getItem('role') as string;
    this.user = this.appStateService.getUserData();

    this.ratingIcons = ratingIcons;

    this.subscription = this.appStateQuery.team$.subscribe((res) => {
      this.team = res;
    });

    // this.filterOptions = workoutGeneralFilterList;

    this.subscription = this.translateService
      .get('workout')
      .subscribe((res) => {
        this.filterOptions = workoutGeneralFilterList.map((item) => ({
          ...item,
          label:
            item.code === 'favorites' ? `${res[item.code]} ❤️` : res[item.code],
          children: item.children?.map((child) => ({
            ...child,
            label: res[child.code],
          })),
        }));
      });

    this.getSportsByClassroom();
  }

  /**
   * get sports
   */
  getSportsByClassroom(): void {
    const findTeacherPackage = this.user?.subscriptions.find(
      (item) => item.package_code === 'teacher' && this.role === 'teacher'
    );

    if (!!findTeacherPackage) {
      this.sportService
        .getSportBySubpackage(findTeacherPackage.package_price.subpackage_id)
        .subscribe((res) => {
          this.sportList = res.data.sports;
        });
    }
  }

  getExercises() {
    this.loading = true;
    this.exerciseService.getAllByTeam(this.team.id).subscribe((res) => {
      this.listadoEjercicios = res.data;
      this.allExercises = res.data;

      this.loading = false;
    });
  }

  newExercise() {
    this.showCreate = true;
  }

  open3DIframe(event: any) {
    this.showCreate = false;
    this.urlIframe = event?.sport ? event.sport.model_url : '';
    this.showIFrame = true;
    this.exerciseCreated = event;
  }

  close3DModal(event: any): void {
    this.showIFrame = event;
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

  filter(event: any) {
    const value = event?.target?.value;

    const filterExercises = this.allExercises?.filter(
      (item) =>
        item.title.toLowerCase().includes(value) ||
        item.user?.full_name.toLowerCase().includes(value)
    );

    if (value.length > 0) {
      this.listadoEjercicios = filterExercises;
    } else {
      this.listadoEjercicios = this.allExercises;
    }
  }

  /**
   * handle filter
   */
  handleSelectFilter(): void {
    this.listadoEjercicios = this.allExercises;

    if (this.selectedFilter.code === 'favorites') {
      this.listadoEjercicios = this.listadoEjercicios.filter(
        (exercise) => exercise.like
      );

      return;
    }

    if (
      contentCodes[this.selectedFilter.code] &&
      this.selectedFilter.code !== 'contents'
    ) {
      switch (this.selectedFilter.code) {
        case contentCodes.technicians:
          this.listadoEjercicios = this.listadoEjercicios.filter((exercise) =>
            exercise.contents?.find(
              (item: { code: string }) => item.code === contentCodes.technicians
            )
          );
          return;

        case contentCodes.tactical:
          this.listadoEjercicios = this.listadoEjercicios.filter((exercise) =>
            exercise.contents?.find(
              (item: { code: string }) => item.code === contentCodes.tactical
            )
          );
          return;

        case contentCodes.physical_preparation:
          this.listadoEjercicios = this.listadoEjercicios.filter((exercise) =>
            exercise.contents?.find(
              (item: { code: string }) =>
                item.code === contentCodes.physical_preparation
            )
          );
          return;

        case contentCodes.psychosocial:
          this.listadoEjercicios = this.listadoEjercicios.filter((exercise) =>
            exercise.contents?.find(
              (item: { code: string }) =>
                item.code === contentCodes.psychosocial
            )
          );
          return;

        default:
          break;
      }
    }

    if (this.selectedFilter.code === 'contents') {
      this.listadoEjercicios = this.listadoEjercicios.filter(
        (exercise) => exercise.contents?.length > 0
      );

      return;
    }

    if (
      distributionCodes[this.selectedFilter.code] &&
      this.selectedFilter.code !== 'distribution'
    ) {
      this.listadoEjercicios = this.listadoEjercicios.filter(
        (exercise) => exercise?.distribution?.code === this.selectedFilter.code
      );
    }

    if (this.selectedFilter.code === 'distribution') {
      this.listadoEjercicios = this.listadoEjercicios.filter(
        (exercise) => !!exercise.distribution
      );

      return;
    }
  }

  verDetalle(event: any) {
    this.ejercicio = event;
    this.appStateService.setWorkout(event);
    this.router.navigate(['club/workout/detalle']);
  }

  updateExercise(event: any) {
    this.ejercicio = event;
    this.showUpdate = true;
    this.updateCurrentStep = 1;
  }

  deleteExercise(event: any) {
    this.ejercicio = event;

    this.confirm(event);
  }

  confirm(event: any) {
    const message = this.translateService.instant(
      'workout.areYouSureToDeleteExercice'
    );

    this.confirmationService.confirm({
      message: message,
      accept: () => {
        this.subscription = this.exerciseService.delete(event).subscribe(
          (res) => {
            this.msg.succes(res.message);
            this.getExercises();
          },
          ({ error }) => {
            this.msg.error(error);
          }
        );
      },
    });
  }

  handleOrderFilter(orderBy: any): void {
    if (orderBy.tooltip === 'asc') {
      this.listadoEjercicios = this.listadoEjercicios.sort((a, b) => {
        const dateA = new Date(a.created_at).getTime();

        const dateB = new Date(b.created_at).getTime();
        return dateA - dateB;
      });
    }

    if (orderBy.tooltip === 'desc') {
      this.listadoEjercicios = this.listadoEjercicios.sort((a, b) => {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return dateB - dateA;
      });
    }
  }

  cerrarModalUpdate() {
    this.showUpdate = false;
  }

  refreshData(): void {
    this.getExercises();
    this.showUpdate = false;
    this.selectedFilter = null;
  }
  handlePermission(permission: PermissionMethods): void {
    this.showPermission = { ...this.showPermission, ...permission };
  }
}
