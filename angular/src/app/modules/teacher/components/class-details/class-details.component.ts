import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppStateService } from 'src/app/stateManagement/appState.service';
import { Sport } from 'src/app/_models/sport';
import { Staff } from 'src/app/_models/team';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { SchoolService } from 'src/app/_services/school.service';
import { Classroom, School } from 'src/app/_models/schools';
import { Subscription } from 'rxjs';
import { EvaluationService } from 'src/app/_services/evaluation.service';
import { AlertsApiService } from 'src/app/generals-services/alerts-api.service';
import { ComunicationComponentService } from 'src/app/_services/comunicationComponent.service';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import moment from 'moment';

@Component({
  selector: 'app-class-details',
  templateUrl: './class-details.component.html',
  styleUrls: ['./class-details.component.scss'],
  providers: [ConfirmationService],
})
export class ClassDetailsComponent implements OnInit, OnDestroy {
  urlBase = environment.images;
  sub = new Subscription();
  recentEvaluations: any[];
  loadingEvaluations: boolean = true;
  assingTeacherDialog: boolean = false;
  loadingCover: boolean = false;
  teachersClass: Staff[] = [];
  loadingTeachersClass: boolean = false;
  loadingAlumns: boolean = false;
  alumns: any[] = [];
  class: Classroom;
  school: School;
  role: string;
  selectedClass: boolean = false;
  sport: Sport;
  loadingSport: boolean = false;
  coverImgPrev: any;
  backgroundImage: string = '/assets/img/portada_equipo.png';
  girlAlumnImage: string = this.urlBase + 'images/alumn/alumna.svg';
  boyAlumnImage: string = this.urlBase + 'images/alumn/alumno.svg';
  openCropperDialog: boolean = false;
  classTabs = [
    {
      name: 'Evaluaciones recientes',
      code: 'recent_evaluations',
    },
    {
      name: 'Cuerpo técnico',
      code: 'teachers',
    },
  ];
  tabs: any[] = [];
  selectedTab!: Number;

  constructor(
    private appStateService: AppStateService,
    private sanitizer: DomSanitizer,
    private schoolService: SchoolService,
    private evaluationService: EvaluationService,
    private comunicationService: ComunicationComponentService,
    private msg: AlertsApiService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private translate: TranslateService
  ) {}

  normalizeString(string: string): string {
    return string.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  replaceSpaces(string: string): string {
    return string.toLowerCase().replace(' ', '_');
  }

  ngOnInit(): void {
    this.class = this.appStateService.getClass();
    this.school = this.appStateService.getSchool();
    this.role = localStorage.getItem('role') as string;
    this.getClassBySchool();
    this.getRecentEvaluations();
    if (this.class) {
      this.getTeachersClass();
      this.getAgesByClass(this.class.age_id);
      if (this.class.cover) {
        this.backgroundImage = this.class.cover.full_url;
      }
    }
    this.tabs = this.classTabs;
  }

  assingTeacher() {
    this.assingTeacherDialog = true;
  }

  checkActiveAcademicYear(classInfo: any): string {
    const isActive: boolean = classInfo.is_active;
    if (isActive) {
      const start_date = moment(classInfo.start_date).format('DD/MM/YYYY');
      const end_date = moment(classInfo.end_date).format('DD/MM/YYYY');
      return `${start_date} - ${end_date}`;
    }
    return '';
  }

  checkActiveAcademicPeriod(period: any[]): string {
    const findActivePeriod: any = period.find(
      (item: { is_active: boolean }) => item.is_active
    );
    if (!!findActivePeriod) {
      const start_date = moment(findActivePeriod.start_date).format(
        'DD/MM/YYYY'
      );
      const end_date = moment(findActivePeriod.end_date).format('DD/MM/YYYY');
      return `${start_date} - ${end_date}`;
    }
    return '';
  }

  removeTeacherFromClassroom(data: any) {
    const schoolId = this.appStateService.getSchool().id;
    const classId = this.appStateService.getClass().id;
    this.schoolService
      .deallocateTeacherClass(schoolId, classId, data)
      .subscribe(
        (res) => {
          this.getTeachersClass();
        },
        ({ error }) => {}
      );
  }

  // Select a new cover image
  onFileSelected(file: any) {
    this.loadingCover = true;

    if (file) {
      this.coverImgPrev = this.sanitizer.bypassSecurityTrustUrl(
        URL.createObjectURL(file)
      );
      this.backgroundImage = this.coverImgPrev;
      this.schoolService
        .updateClassroom(
          this.appStateService.getSchool().id,
          this.appStateService.getClass().id,
          { cover: file }
        )
        .then((res: any) => {
          this.appStateService.updateClass(JSON.parse(res).data);
          this.loadingCover = false;
        })
        .catch((res) => {
          this.loadingCover = false;
        });
    }
  }

  getAgesByClass(ageId: number): void {
    this.sub = this.schoolService
      .showClassroomAge(ageId)
      .subscribe((res) => {});
  }

  getRecentEvaluations() {
    this.evaluationService
      .getRecentEvaluations(this.appStateService.getClassroomAcademicYear())
      .subscribe((res: any) => {
        this.recentEvaluations = res.data;
        this.loadingEvaluations = false;
      });
  }

  getTeachersClass() {
    this.schoolService
      .getClassroomTeachers(
        this.appStateService.getClub().id,
        this.appStateService.getClass().id
      )
      .subscribe((res: any) => {
        this.teachersClass = res.data;
        this.loadingTeachersClass = false;
      });
  }

  getTutorByClass(schoolId: number, teacherId: number): void {
    this.sub = this.schoolService
      .showTeacherByClassroom(schoolId, teacherId)
      .subscribe((res) => {});
  }

  resetClass(classParam: Classroom): void {
    this.class = classParam;
    this.appStateService.updateClass(this.class);
  }

  deleteClass() {
    this.schoolService
      .deleteClassroom(
        this.appStateService.getSchool().id,
        this.appStateService.getClass().id
      )
      .subscribe((res: any) => {
        this.msg.succes(res.message);
        this.comunicationService.recargarMenuListaClubs(true);
        setTimeout(() => {
          this.router.navigate([
            `/academy/home/${this.appStateService.getSchool().id}`,
          ]);
        }, 200);
      });
  }

  confirm() {
    this.confirmationService.confirm({
      header: this.translate.instant('LBL_CONFIRM_DELETE'),
      message: this.translate.instant('LBL_CONFIRM_DIALOG'),
      acceptLabel: this.translate.instant('LBL_YES'),
      rejectLabel: this.translate.instant('LBL_NO'),
      acceptButtonStyleClass: 'next_btn',
      rejectButtonStyleClass: 'back_btn',
      accept: () => {
        //Actual logic to perform a confirmation
        this.deleteClass();
      },
    });
  }

  /**
   * Get alumns by class
   */
  getClassBySchool(): void {
    this.loadingAlumns = true;

    this.sub = this.schoolService
      .getAlumnsByClass(this.class.id)
      .subscribe((res) => {
        this.alumns = res.data;

        this.loadingAlumns = false;
      });
  }

  handleDelete(data: any) {
    this.removeTeacherFromClassroom(data);
  }

  getImage(file: File): void {
    this.readURL(file);
  }

  /**
   * read competition and rival image urls
   * @param event
   * @param type
   */
  readURL(file: File): void {
    if (file) {
      this.onFileSelected(file);

      this.openCropperDialog = false;
    }
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}
