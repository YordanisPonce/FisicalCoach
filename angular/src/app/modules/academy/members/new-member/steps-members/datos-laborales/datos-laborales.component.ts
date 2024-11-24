import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { SelectItem } from '../../../../../../_models/selectItem';
import { ClubService } from '../../../../../../_services/club.service';
import {GeneralService} from '../../../../../../_services/general.service';
import * as moment from 'moment';
import  FieldsValidation  from '../../../../../../utils/FieldsValidation'

@Component( {
  selector: 'app-datos-laborales',
  templateUrl: './datos-laborales.component.html',
  styleUrls: [ './datos-laborales.component.scss' ]
} )
export class DatosLaboralesComponent implements OnInit {
  formMember: UntypedFormGroup;
  formAddExperience: UntypedFormGroup;
  submitted = false;
  submittedAdd = false;
  showModalAdd = false;
  maxDate = new Date();
  yearRange: string;
  startDate:Date 
  @Input() listLevel: SelectItem [] = [];
  @Input() data: any;
  @Input() view = false;
  listExperience: any [] = [];
  @Output()
  nextstep: EventEmitter<any> = new EventEmitter<any>();
  @Output() goBack: EventEmitter<void> = new EventEmitter<void>();
  constructor( private formBuilder: UntypedFormBuilder,
               private clubService: ClubService,
               private generalService: GeneralService) {
  }

  get f() {
    return this.formMember.controls;
  }
  get fa() {
    return this.formAddExperience.controls;
  }
  ngOnInit(): void {
    this.yearRange = '1900:' + new Date().getFullYear();
    this.loadForm();
  }

  getScreenWidth(): any {
    return screen.width;
  }

  loadForm(): void {
    if (this.data && this.data.work_experiences){
      this.listExperience = this.data.work_experiences;
    }
    this.formMember = this.formBuilder.group( {
      study_level_id: [ this.data && this.data.study_level_id ? this.data.study_level_id : null, Validators.required ],
    } );
    this.formAddExperience = this.formBuilder.group( {
      club: [ null, Validators.required ],
      occupation: [ null, Validators.required ],
      start_date: [ null, Validators.required ],
      finish_date: [ null, Validators.required ],
    } );
  }

  onSubmit() {
    this.submitted = true;
    if ( this.formMember.invalid ) {
      return;
    }
    const dataform = this.formMember.value;
    const data = { work_experiences : this.listExperience, study_level_id:  dataform.study_level_id };
    this.nextstep.emit( data );
  }

  onSubmitExperience(){
    this.submittedAdd = true;
    let fieldsV = new FieldsValidation()
    fieldsV.validateStepFields(['club','occupation','start_date','finish_date'], this.formAddExperience)
    
    if ( this.formAddExperience.invalid){
      return;
    }
    const data = this.formAddExperience.value;
    // data.experience = this.listExperience;
    data.start_date = moment(data.start_date).format('YYYY-MM-DD');
    data.finish_date = moment(data.finish_date).format('YYYY-MM-DD');
    this.listExperience.push(data);
    this.formAddExperience.reset();
    this.startDate = new Date() 
    this.submittedAdd = false;
    this.showModalAdd = false;
  }

  delete( item: any ){
    this.listExperience = this.listExperience.filter( x => x !== item);
  }

  back(){
    this.goBack.emit();
  }

  validateDate(){
    const data = this.formMember.value;
    this.startDate = new Date(this.fa.start_date.value)
    console.log(this.startDate)
  }
}
