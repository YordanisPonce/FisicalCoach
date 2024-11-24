import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { EvaluationService } from 'src/app/_services/evaluation.service';
import { QualificationService } from 'src/app/_services/qualification.service';
// import { DatePipe } from '@angular/common';
import FieldsValidation from 'src/app/utils/FieldsValidation';
import { environment } from 'src/environments/environment';
import { AppStateService } from 'src/app/stateManagement/appState.service';
import { timingSafeEqual } from 'crypto';
import HandleErrors from '../../../../utils/errors';
import { AlertsApiService } from '../../../../generals-services/alerts-api.service';
import { TranslateService } from '@ngx-translate/core';

@Component( {
  selector: 'new-calification-dialog',
  templateUrl: './new-calification-dialog.component.html',
  styleUrls: [ './new-calification-dialog.component.scss' ]
} )
export class NewCalificationDialogComponent implements OnInit {
  
  @Input() visible: boolean = false;
  @Input() editing: boolean;
  @Input() details: boolean | undefined;
  @Input() qualification: any;
  @Output() close = new EventEmitter<boolean>();
  @Output() created = new EventEmitter<boolean>();
  @Output() edited = new EventEmitter<boolean>();
  validation = new FieldsValidation();
  editingRubric: boolean = false;
  editingRubricIndex: any;
  selectedRubric: any = null;
  loading: boolean = false;
  loadingRubrics: boolean = false;
  addRubricDialog: boolean = false;
  qualificationRubrics: any = [];
  rubrics: any = [];
  rubricsList: any = [];
  academicYear: string = this.appStateService.getClass().active_academic_years.classroom_academic_year_id;
  periods: any = [];
  newCalificationForm = this.formBuilder.group( {
    title: [ '', [ Validators.required, Validators.minLength( 3 ) ] ],
    description: [ '', [ Validators.required, Validators.minLength( 3 ) ] ],
    classroom_academic_year_id: [ '', Validators.required ],
    classroom_academic_period_id: [ null, Validators.required ],
    items: [ '', Validators.required ]
  } );
  addRubricForm = this.formBuilder.group( {
    name: [ null ],
    classroom_rubric_id: [ null, Validators.required ],
    percentage: [ null, [ Validators.required, Validators.minLength( 1 ), Validators.maxLength( 3 ), Validators.max( 100 ), Validators.min( 1 ) ] ],
  } );
  error = new HandleErrors( this.alertsApiService );
  
  constructor( private formBuilder: UntypedFormBuilder,
               private appStateService: AppStateService,
               private evaluationService: EvaluationService,
               private translateService: TranslateService,
               public alertsApiService: AlertsApiService,
               private qualificationService: QualificationService ) {
  }
  
  get newCalificationControls() {
    return this.newCalificationForm.controls;
  }
  
  get addRubricControls() {
    return this.addRubricForm.controls;
  }
  
  closeRubricDialog() {
    this.addRubricDialog = false;
    this.editingRubric = false;
    this.selectedRubric = null;
    this.addRubricForm.reset();
  }
  
  closeDialog() {
    this.close.emit( false );
    this.qualificationRubrics = [];
    this.newCalificationForm.reset();
    this.newCalificationForm.patchValue( { classroom_academic_year_id: this.academicYear } );
    this.loading = false;
  }
  
  getRubricsList() {
    this.evaluationService.getClassroomRubrics( this.academicYear ).subscribe( ( res: any ) => {
      this.rubrics = res.data;
      this.rubricsList = res.data;
      this.loading = false;
    } );
  }
  
  addRubric() {
    const rubicsTemp = this.qualificationRubrics.map( ( x: any ) => {
      return x.classroom_rubric_id;
    } );
    this.rubricsList = this.rubrics.filter( ( x: any ) => !rubicsTemp.includes( x.id ) );
    this.addRubricDialog = true;
  }
  
  editRubric( rubric: any, index: any ) {
    this.editingRubricIndex = index;
    this.addRubricForm.patchValue( {
      classroom_rubric_id: rubric.classroom_rubric_id,
      classroom_academic_period_id: rubric.classroom_academic_period_id,
      name: rubric.name,
      percentage: rubric.percentage,
    } );
    this.selectedRubric = this.rubrics.find( ( el: any ) => el.id == rubric.classroom_rubric_id );
    const rubicsTemp = this.qualificationRubrics.map( ( x: any ) => {
      return x.classroom_rubric_id;
    } );
    this.rubricsList = this.rubrics.filter( ( x: any ) => !rubicsTemp.includes( x.id ) );
    this.rubricsList.unshift( this.selectedRubric );
    this.editingRubric = true;
    this.addRubricDialog = true;
  }
  
  removeRubric( rubricId: string ) {
    this.qualificationRubrics = this.qualificationRubrics.filter( ( rubric: any ) => rubric.classroom_rubric_id != rubricId );
  }
  
  selectRubric( data: any ) {
    this.setRubricName( data );
  }
  
  // filteredRubrics() {
  //   if ( this.editingRubric ) {
  //     // si estoy editando una rubrica
  //     return this.rubrics.filter( ( rubric: any ) => rubric.id == this.addRubricForm.get( 'classroom_rubric_id' )?.value );
  //   } else {
  //     // si estoy creando una rubrica
  //     if ( this.qualificationRubrics && this.qualificationRubrics.length > 0 ) {
  //       // si ya tengo rubricas creadas
  //       return this.rubrics.filter( ( rubric: any ) => {
  //         if ( !this.qualificationRubrics.some( ( el: any ) => el.classroom_rubric_id == rubric.id ) ) {
  //           return rubric;
  //         }
  //       } );
  //     } else {
  //       // si no tengo rubricas creadas
  //       return this.rubrics;
  //     }
  //   }
  // }
  
  setRubricName( data: any ) {
    this.addRubricForm.patchValue( { classroom_rubric_id: data.id } );
    this.addRubricForm.patchValue( { name: data.name } );
  }
  
  newQualification() {
    this.qualificationService.createQualification( this.newCalificationForm.value ).subscribe( ( res: any ) => {
        this.created.emit( true );
        this.closeDialog();
        this.loading = false;
      },
      error => {
        this.loading = false;
        this.error.handleError( error, this.translateService.instant( 'qualification.errorsave' ) );
      },
      () => {
        this.loading = false;
      }
    );
  }
  
  updateQualification() {
    const qualificationId = this.qualification.id;
    this.qualificationService.editQualification( qualificationId, this.newCalificationForm.value ).subscribe( ( res: any ) => {
        this.created.emit( true );
        this.closeDialog();
        this.loading = false;
      },
      error => {
        this.error.handleError( error, this.translateService.instant( 'qualification.errorupdate' ) );
        this.loading = false;
      },
      () => {
        this.loading = false;
      }
    );
  }
  
  onSubmit() {
    this.newCalificationForm.patchValue( { items: this.qualificationRubrics } );
    this.validation.validateStepFields( [ 'title', 'description', 'classroom_academic_year_id', 'items' ], this.newCalificationForm );
    this.loading = true;
    if ( this.editing ) {
      this.updateQualification();
    } else {
      this.newQualification();
    }
  }
  
  onSubmitRubric() {
    this.validation.validateStepFields( [ 'classroom_rubric_id', 'classroom_academic_period_id', 'percentage' ], this.addRubricForm );
    if ( this.addRubricForm.invalid ) {
      return;
    } else {
      if ( this.editingRubric ) {
        this.qualificationRubrics[ this.editingRubricIndex ] = this.addRubricForm.value;
      } else {
        const item = this.addRubricForm.value;
        this.qualificationRubrics = [ ...this.qualificationRubrics, this.addRubricForm.value ];
      }
      this.closeRubricDialog();
    }
  }
  
  getIndicatorsTotalpercentage() {
    let initialValue = 0;
    return this.qualificationRubrics.reduce( ( previousValue: any, currentValue: any ) => previousValue + Number( currentValue.percentage ), initialValue );
  }
  
  ngOnInit(): void {
    this.loading = true;
    this.periods = this.appStateService.getClass().active_academic_years.academic_periods;
    this.newCalificationForm.patchValue( { classroom_academic_year_id: this.academicYear } );
    this.getRubricsList();
  }
  
  ngOnChanges( changes: SimpleChanges ) {
    if ( changes.qualification ) {
      if ( changes.qualification.currentValue != undefined ) {
        if ( changes.details && changes.details.currentValue ) {
          this.details = true;
        } else {
          this.editing = true;
        }
        const qualification = changes.qualification.currentValue;
        this.newCalificationForm.patchValue( {
          title: qualification.title,
          description: qualification.description,
          classroom_academic_year_id: qualification.classroom_academic_year_id,
          classroom_academic_period_id: qualification.classroom_academic_period_id,
        } );
        this.qualificationRubrics = qualification.qualification_items.map( ( item: any ) => {
          return {
            name: item.rubric.name,
            classroom_rubric_id: item.rubric.id,
            classroom_academic_period_id: item.classroom_academic_period_id,
            percentage: item.percentage
          };
        } );
      } else {
        this.editing = false;
      }
    }
  }
  
}
