import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AppStateService } from 'src/app/stateManagement/appState.service';
import { EvaluationService } from 'src/app/_services/evaluation.service';
import { SchoolService } from 'src/app/_services/school.service';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/api';
import { environment } from 'src/environments/environment';
import { AlertsApiService } from '../../../../generals-services/alerts-api.service';
import HandleErrors from '../../../../utils/errors';

@Component( {
  selector: 'app-evaluation',
  templateUrl: './evaluation.component.html',
  styleUrls: [ './evaluation.component.scss' ],
  providers: [ ConfirmationService ]
} )
export class EvaluationComponent extends HandleErrors implements OnInit, AfterViewInit {
  
  images: string = environment.images;
  girlAlumnImage: string = this.images + 'images/alumn/alumna.svg';
  boyAlumnImage: string = this.images + 'images/alumn/alumno.svg';
  views: any[]=[];
  editingRubric: boolean = false;
  editingIndicator: boolean = false;
  details: boolean = false;
  selectedView: string = 'rubrics';
  inputSearch: string = '';
  evaluationDialog: boolean = false;
  newRubricDialog: boolean = false;
  newIndicatorDialog: boolean = false;
  rubricsListDialog: boolean = false;
  exportRubricDialog: boolean = false;
  refreshIndicators: any = [];
  rubric: any = null;
  indicator: any = null;
  step: number = 0;
  classroomRubrics: any = [];
  classroomStudents: any = [];
  classroomRubricsAll: any = [];
  classroomStudentsAll: any = [];
  loading: boolean = false;
  
  constructor( private appStateService: AppStateService,
               private evaluation: EvaluationService,
               private schoolService: SchoolService,
               private translate: TranslateService,
               public alerts: AlertsApiService,
               private confirmationService: ConfirmationService ) {
    super( alerts );
    
  }
  
  resetFilter() {
    this.inputSearch = '';
    this.classroomRubrics = this.classroomRubricsAll;
    this.classroomStudents = this.classroomStudentsAll;
  }
  
  search( event: any ) {
    const search = event.target.value.toLowerCase();
    if ( this.selectedView === 'rubrics' ) {
      const filter = this.classroomRubricsAll.filter( ( item: any ) => item?.name?.toLowerCase().includes( search ) );
      if ( search.length > 0 ) {
        this.classroomRubrics = filter;
      } else {
        this.classroomRubrics = this.classroomRubricsAll;
      }
    } else {
      const filter = this.classroomStudentsAll.filter( ( item: any ) => item?.full_name?.toLowerCase().includes( search ) );
      if ( search.length > 0 ) {
        this.classroomStudents = filter;
      } else {
        this.classroomStudents = this.classroomStudentsAll;
      }
    }
    
  }
  
  getClassroomId(): string {
    let classroomId = '';
    classroomId = this.appStateService.getClass().id;
    return classroomId;
  }
  
  getClassroomName(): string {
    let classroomName = '';
    classroomName = this.appStateService.getClass().name;
    return classroomName;
  }
  
  getClassroomAcademicYear() {
    let academicYear = '';
    academicYear = this.appStateService.getClass().active_academic_years.classroom_academic_year_id;
    return academicYear;
  }
  
  getClassroomStudents() {
    this.schoolService.getAlumnsByClass( Number( this.getClassroomId() ) ).subscribe( ( res: any ) => {
      this.classroomStudents = res.data;
      this.classroomStudentsAll = res.data;
      this.loading = false;
    }, error => {
      this.loading = false;
      this.handleError( error, this.translate.instant( 'errorlist' ) );
    } );
  }
  
  classroomRubricsList() {
    this.evaluation.getClassroomRubrics( this.getClassroomAcademicYear() ).subscribe( ( res: any ) => {
      this.classroomRubrics = res.data;
      this.classroomRubricsAll = res.data;
      this.loading = false;
    }, error => {
      this.loading = false;
      this.handleError( error, this.translate.instant( 'errorlist' ) );
    } );
  }
  
  rubricDetails( rubric: any ) {
    this.editingRubric = false;
    this.editingIndicator = false;
    this.details = true;
    this.rubric = rubric;
    this.newRubricDialog = true;
  }
  
  editRubric( rubric: any ) {
    this.editingRubric = true;
    this.details = false;
    this.rubric = Object.assign( {}, rubric );
    this.newRubricDialog = true;
  }
  
  confirm( rubric: any ) {
    this.confirmationService.confirm( {
      header: this.translate.instant( 'LBL_CONFIRM_DELETE' ),
      message: this.translate.instant( 'LBL_CONFIRM_DIALOG' ),
      acceptLabel: this.translate.instant( 'LBL_YES' ),
      rejectLabel: this.translate.instant( 'LBL_NO' ),
      acceptButtonStyleClass: 'next_btn',
      rejectButtonStyleClass: 'back_btn',
      accept: () => {
        this.classroomRubrics = [];
        this.removeRubric( rubric.id );
      }
    } );
  }
  
  removeRubric( rubricId: any ) {
    this.loading = true;
    this.evaluation.deleteRubric( rubricId ).subscribe( ( res: any ) => {
        this.classroomRubricsList();
      },
      ( error ) => this.loading = false
    );
  }
  
  evaluate( rubric: any ) {
    this.rubric = rubric;
    this.evaluationDialog = true;
  }
  
  updateIndicator( indicator: any ) {
    this.editingIndicator = true;
    this.indicator = indicator;
    this.newIndicatorDialog = true;
  }
  
  updateIndicatorsList( data: any ) {
    this.refreshIndicators = data;
  }
  
  ngOnInit(): void {
    setTimeout( () => {
      const general = this.translate.instant( 'evaluation.rubrics' );
      const info = this.translate.instant( 'evaluation.students' );
      // this.views = [
      //   { name: general, value: 'rubrics' },
      //   { name: info, value: 'students' },
      // ];
    }, 100 );
    this.loading = true;
    this.classroomRubricsList();
    this.getClassroomStudents();
  }
  
  ngAfterViewInit(): void {
    setTimeout( () => {
    this.views=[
      { name: this.translate.instant( 'evaluation.rubrics' ), value: 'rubrics' },
      { name: this.translate.instant( 'evaluation.students' ), value: 'students' },
    ];
    }, 500 );
  }
  
  
}
