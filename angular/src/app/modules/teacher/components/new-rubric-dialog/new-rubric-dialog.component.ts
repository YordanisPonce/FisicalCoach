import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { EvaluationService } from 'src/app/_services/evaluation.service';
import { TranslateService } from '@ngx-translate/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { AppStateQuery } from 'src/app/stateManagement/appState.query';
import FieldsValidation from 'src/app/utils/FieldsValidation';
import { invalid } from 'moment';
import { AlertsApiService } from '../../../../generals-services/alerts-api.service';
import HandleErrors from '../../../../utils/errors';

@Component( {
  selector: 'new-rubric-dialog',
  templateUrl: './new-rubric-dialog.component.html',
  styleUrls: [ './new-rubric-dialog.component.scss' ]
} )
export class NewRubricDialogComponent implements OnInit {
  
  validation = new FieldsValidation();
  @Input() refreshIndicators: any = false;
  @Input() visible: boolean = false;
  @Input() editing: boolean;
  @Input() details: boolean;
  @Input() rubric: any = null;
  @Input() classroomId: string | number = '';
  @Input() classroomAcademicYear: string | number = '';
  @Output() close = new EventEmitter<boolean>();
  @Output() rubricsUpdated = new EventEmitter();
  indicators: any = [];
  loading: boolean = false;
  loadingIndicators: boolean = false;
  newRubricForm = this.formBuilder.group( {
    name: [ '', Validators.required ],
    indicators: [ '', Validators.required ],
    classroom_academic_year_ids: [ '', Validators.required ]
  } );
  showIndicadorDialog: boolean = false;
  isEditingIndicator: boolean = false;
  seletedIndicator: any;
  competences: any[] = [];
  indexEditedIndicator: number;
  errors: HandleErrors = new HandleErrors( this.msg );
  
  constructor( private appStateQuery: AppStateQuery,
               private msg: AlertsApiService,
               private translate: TranslateService,
               private evaluation: EvaluationService,
               private formBuilder: UntypedFormBuilder,
  ) {
  }
  
  get newRubricControls() {
    return this.newRubricForm.controls;
  }
  
  addIndicator() {
    this.seletedIndicator = null;
    this.isEditingIndicator = false;
    this.showIndicadorDialog = true;
  }
  
  getCompetencesList() {
    this.evaluation.getCompetencesList().subscribe( ( res: any ) => {
      this.competences = res.data;
    } );
  }
  
  editIndicator( indicator: any ) {
    if ( !indicator.id ) {
      this.indexEditedIndicator = this.indicators.indexOf( indicator );
    }
    this.seletedIndicator = indicator;
    this.isEditingIndicator = true;
    this.showIndicadorDialog = true;
  }
  
  closeDialog() {
    this.close.emit( false );
    this.newRubricForm.reset();
    this.indicators = [];
    this.setClassroomAcademicYear();
  }
  
  setFormIndicators() {
    this.newRubricForm.patchValue( { indicators: this.indicators } );
  }
  
  removeIndicator( indicator: any ) {
    const index = this.indicators.indexOf( indicator );
    this.indicators.splice( index, 1 );
  }
  
  create() {
    this.evaluation.createRubric( this.newRubricForm.value ).subscribe( ( res: any ) => {
        this.rubricsUpdated.emit();
        this.closeDialog();
      }, ( error ) => {
        this.errors.handleError( error, this.translate.instant( 'new_rubric.errorsave' ) );
        this.loading = false;
      },
      () => {
        this.loading = false;
      }
    );
  }
  
  edit( rubricId: string ) {
    this.evaluation.editRubric( rubricId, this.newRubricForm.value ).subscribe( ( res: any ) => {
        this.rubricsUpdated.emit();
        this.closeDialog();
        this.loading = false;
      },
      ( error ) => {
        this.errors.handleError( error, this.translate.instant( 'new_rubric.errorupdate' ) );
        this.loading = false;
      }
    );
  }
  
  
  onSubmit() {
    this.setFormIndicators();
    if ( !this.validation.validateStepFields( [ 'name', 'indicators', 'classroom_academic_year_ids' ], this.newRubricForm ) ) {
      if ( this.getIndicatorsTotalpercentage() === 100 ) {
        if ( this.newRubricForm.invalid ) {
          return;
        } else {
          this.loading = true;
          if ( this.editing ) {
            this.edit( this.rubric.id );
          } else {
            this.create();
          }
        }
      }
    }
  }
  
  getIndicatorsTotalpercentage() {
    let initialValue = 0;
    return this.indicators.reduce( ( previousValue: any, currentValue: any ) => previousValue + Number( currentValue.percentage ), initialValue );
  }
  
  setRubricData() {
    this.indicators = this.rubric.indicators;
    this.newRubricForm.patchValue(
      {
        name: this.rubric.name
      }
    );
  }
  
  ngOnChanges( changes: SimpleChanges ) {
    if ( changes.details ) {
      if ( changes.details.previousValue === false && changes.details.currentValue === true ) {
        this.setRubricData();
      }
    }
    if ( changes.editing ) {
      if ( changes.editing.previousValue === false && changes.editing.currentValue === true ) {
        this.setRubricData();
      }
    }
    if ( changes.refreshIndicators && changes.refreshIndicators.firstChange != true ) {
      if ( changes.refreshIndicators.currentValue != null ) {
        if ( this.editing == true ) {
          const EDITED_INDICATOR_INDEX = this.indicators.findIndex( ( indicator: any ) => indicator.name == changes.refreshIndicators.currentValue.oldIndicator.name );
          this.indicators[ EDITED_INDICATOR_INDEX ] = changes.refreshIndicators.currentValue.newIndicator;
        } else {
          this.indicators = [ ...this.indicators, changes.refreshIndicators.currentValue ];
        }
      }
    }
  }
  
  setClassroomAcademicYear() {
    this.newRubricForm.patchValue( { classroom_academic_year_ids: this.classroomAcademicYear } );
  }
  
  addOrUpdateIndicator( { edit, indicator }: any ) {
    if ( edit ) {
      if ( indicator?.id ) {
        const index = this.indicators.findIndex( ( x: any ) => x.id === indicator.id );
        this.indicators[ index ] = indicator;
      } else {
        this.indicators[ this.indexEditedIndicator ] = indicator;
      }
      
    } else {
      this.indicators.push( indicator );
    }
  }
  
  ngOnInit(): void {
    this.getCompetencesList();
    this.setClassroomAcademicYear();
  }
}
