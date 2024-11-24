import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { AppStateQuery } from 'src/app/stateManagement/appState.query';
import { SchoolService } from 'src/app/_services/school.service';
import { Subscription } from 'rxjs';
import { Age, School, Teacher } from 'src/app/_models/schools';
import { AppStateService } from 'src/app/stateManagement/appState.service';
import { AlertsApiService } from 'src/app/generals-services/alerts-api.service';
import { ComunicationComponentService } from 'src/app/_services/comunicationComponent.service';
import FieldsValidation from 'src/app/utils/FieldsValidation';
import HandleErrors from '../../../../utils/errors';
import { TranslateService } from '@ngx-translate/core';

@Component( {
  selector: 'app-add-classroom',
  templateUrl: './add-classroom.component.html',
  styleUrls: [ './add-classroom.component.scss' ]
} )
export class AddClassroomComponent implements OnInit, OnDestroy {
  
  
  @Input() visible: boolean;
  @Input() selectedClass: any;
  @Output() close = new EventEmitter<boolean>();
  @Output() resetClass = new EventEmitter<any>();
  
  step: number = 1;
  colors: any = [ '#024CAC', '#EF1616', '#A71212', '#050C44', '#00E9C5' ];
  color: string;
  customColor: string = '';
  loading: boolean = false;
  submittedForm: boolean = false;
  isFileRejectedBySize: boolean = false;
  isFileRejectedByType: boolean = false;
  subs = new Subscription();
  ageList: Age[] = [];
  teacherList: Teacher[] = [];
  selectedSchool: School;
  classroomForm = this.formBuilder.group( {
    name: [ null, Validators.required ],
    age_id: [ null ],
    observations: [ null ],
    image: [ null ],
    cover: [ null ],
    color: [ null, Validators.required ],
  } );
  validation: any = new FieldsValidation();
  schoolYear: any[] = [];
  classImgPrev: any = '';
  error: HandleErrors = new HandleErrors( this.msg );
  
  constructor( private formBuilder: UntypedFormBuilder,
               private appsStateQuery: AppStateQuery,
               private appStateService: AppStateService,
               private comunicationService: ComunicationComponentService,
               private schoolService: SchoolService,
               private translateService: TranslateService,
               private msg: AlertsApiService,
               private sanitizer: DomSanitizer,
  ) {
  }
  
  get classroomControls() {
    return this.classroomForm.controls;
  }
  
  ngOnInit(): void {
    this.selectedSchool = this.appStateService.getClub();
    this.getClassroomAges();
    this.getTeachers( this.selectedSchool?.id as number );
    if ( this.selectedClass ) {
      this.loadForm();
    }
    const SCHOOL_CENTER = this.appStateService.getSchool();
    this.schoolYear.push( {
      name: SCHOOL_CENTER.academic_years[ 0 ].title
    } );
  }
  
  loadForm(): void {
    this.classroomForm = this.formBuilder.group( {
      name: this.selectedClass.name,
      age_id: this.selectedClass.age_id,
      observations: this.selectedClass.observations,
      color: this.selectedClass.color,
      image: this.selectedClass.image,
      cover: this.selectedClass.cover,
    } );
    this.classImgPrev = this.selectedClass.image?.full_url || '';
  }
  
  validateStep() {
    let fields = [];
    switch ( this.step ) {
      case 1:
        fields = [ 'name' ];
        if ( !this.validation.validateStepFields( fields, this.classroomForm ) ) {
          this.step = this.step + 1;
        }
        break;
      case 2:
        fields = [ 'age_id' ];
        if ( !this.validation.validateStepFields( fields, this.classroomForm ) ) {
          this.step = this.step + 1;
        }
        break;
      default:
        break;
    }
  }
  
  onSubmit( event: any ): void {
    event.preventDefault();
    this.submittedForm = true;
    if ( this.classroomForm.invalid ) {
      return;
    } else {
      this.loading = true;
      const data = this.classroomForm.value;
      data.club_id = this.selectedSchool.id;
      data.scholar_year = 'scholar_year';
      if ( !( data.image instanceof File ) ) {
        delete data.image;
      }
      if ( !( data.cover instanceof File ) ) {
        delete data.cover;
      }
      if ( this.selectedClass ) {
        this.schoolService.updateClassroom( data.club_id as number, this.selectedClass.id, data ).then( ( res: any ) => {
          const resp = JSON.parse( res );
          this.msg.succes( resp.message );
          this.loading = this.submittedForm = false;
          this.comunicationService.refreshTeamOrClassList( true );
          this.resetClass.emit( JSON.parse( res ).data );
          this.closeDialog();
        }, ( error ) => {
          this.error.handleError( error, this.translateService.instant( 'create_new_classroom.errorupdate' ) );
          this.loading = this.submittedForm = false;
        } );
      } else {
        this.schoolService.createClassroom( data.club_id as number, data ).then( ( res: any ) => {
          const resp = JSON.parse( res );
          this.msg.succes( resp.message );
          this.classroomForm.reset();
          this.loading = this.submittedForm = false;
          this.comunicationService.refreshTeamOrClassList( true );
          this.closeDialog();
        }, ( error ) => {
          this.error.handleError( error, this.translateService.instant( 'create_new_classroom.errosave' ) );
          this.loading = this.submittedForm = false;
        } );
      }
    }
  }
  
  closeDialog() {
    this.close.emit( false );
    this.step = 1;
  }
  
  onFileSelected( event: any ) {
    const [ file ] = event.target.files;
    if ( file ) {
      const types = [ 'image/jpeg', 'image/png', 'image/jpg', 'image/svg', 'image/JPEG', 'image/PNG', 'image/JPG', 'image/SVG' ];
      const file = event.target.files[ 0 ];
      const sizeToMb = ( file.size / ( 1024 * 1024 ) ).toFixed( 2 );
      const isPngType = types.includes( file.type );
      if ( Number( sizeToMb ) <= 0.99 && isPngType ) {
        this.isFileRejectedBySize = false;
        this.isFileRejectedByType = false;
        this.classroomForm.controls.image.setValue( file );
        // this.classroomForm.controls.cover.setValue( file );
        this.classroomForm.controls.color.setValidators( null );
        this.classroomForm.controls.color.updateValueAndValidity();
        this.classImgPrev = this.sanitizer.bypassSecurityTrustUrl( URL.createObjectURL( file ) );
      } else {
        if ( !isPngType ) {
          this.isFileRejectedByType = true;
        } else {
          this.isFileRejectedBySize = true;
        }
        this.classImgPrev = '';
        this.classroomForm.controls.image.setValue( null );
      }
      this.classroomForm.controls.image.updateValueAndValidity();
    }
  }
  
  setTeamColor( color: any, customColor: boolean ): void {
    if ( customColor ) {
      this.customColor = color;
    } else {
      this.customColor !== '' ? this.customColor = '' : '';
    }
    this.classroomForm.patchValue( { color } );
    this.isFileRejectedBySize = false;
    this.isFileRejectedByType = false;
  }
  
  getClubId(): void {
    this.appsStateQuery.club$.subscribe( res => {
      const CLUBID = res.id;
      this.classroomForm.patchValue( { club_id: CLUBID } );
    } );
  }
  
  /**
   * list classroom ages
   */
  getClassroomAges(): void {
    this.subs = this.schoolService.getClassroomAges().subscribe( res => {
      const data = res.data.map( ( item: any ) => ( { label: item.range, value: item.id } ) );
      this.ageList = data;
    } );
  }
  
  /**
   * list teachers
   */
  getTeachers( schoolId: number ): void {
    this.subs = this.schoolService.getTeacherList( schoolId ).subscribe( res => {
      const data = res.data.map( ( item: Teacher ) => ( { label: item.name, value: item.id } ) );
      this.teacherList = data;
    } );
  }
  
  ngOnDestroy(): void {
    if ( this.subs ) {
      this.subs.unsubscribe();
    }
  }
}
