import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { EvaluationService } from 'src/app/_services/evaluation.service';
import { TranslateService } from '@ngx-translate/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { AppStateQuery } from 'src/app/stateManagement/appState.query';
import { SchoolService } from 'src/app/_services/school.service';
import { AlertsApiService } from '../../../../generals-services/alerts-api.service';
import HandleErrors from '../../../../utils/errors';

@Component( {
  selector: 'export-rubric-dialog',
  templateUrl: './export-rubric-dialog.component.html',
  styleUrls: [ './export-rubric-dialog.component.scss' ]
} )
export class ExportRubricDialogComponent implements OnInit {
  
  classes: any[];
  selectedClass: any = null;
  loading: boolean = false;
  @Input() visible: boolean = false;
  @Input() rubric: any;
  @Output() close = new EventEmitter<boolean>();
  @Output() create = new EventEmitter<boolean>();
  error: HandleErrors = new HandleErrors( this.alertsApiService );
  
  constructor( private appStateQuery: AppStateQuery,
               private translate: TranslateService,
               private evaluation: EvaluationService,
               private alertsApiService: AlertsApiService,
               private formBuilder: UntypedFormBuilder,
               private school: SchoolService
  ) {
  }
  
  createIndicator() {
    this.create.emit( true );
    console.log( 'nuevo indicador' );
  }
  
  getClubId(): string {
    let clubId = '';
    this.appStateQuery.club$.subscribe( res => {
      clubId = res.id;
    } );
    return clubId;
  }
  
  getClassId(): string {
    let classId = '';
    this.appStateQuery.class$.subscribe( res => {
      classId = res.id;
    } );
    return classId;
  }
  
  getClases( schoolId: any ) {
    // this.teams = [];
    this.school.getClasses( schoolId ).subscribe( res => {
      this.classes = res.data.filter( ( el: any ) => el.id != this.getClassId() );
      this.loading = false;
    } );
  }
  
  exportRubric() {
    const classroomAcademicYearId = this.selectedClass.active_academic_years.classroom_academic_year_id;
    this.evaluation.exportRubricToClass( this.rubric.id, { classroom_academic_year_ids: classroomAcademicYearId } ).subscribe( ( res: any ) => {
        this.alertsApiService.succes( res.message );
        this.closeDialog();
      }, ( error ) => {
        this.error.handleError( error, this.translate.instant( 'export_rubric.errorExport' ) );
        this.loading = false;
      },
    );
  }
  
  closeDialog() {
    this.close.emit( false );
  }
  
  onSubmit() {
    console.log( this.selectedClass );
    // this.loading = true
    this.exportRubric();
  }
  
  ngOnInit(): void {
    this.loading = true;
    this.getClases( this.getClubId() );
  }
}
