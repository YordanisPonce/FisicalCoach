import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { UntypedFormControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { SelectItem } from '../../../../../../_models/selectItem';
import { ClubService } from '../../../../../../_services/club.service';
import  FieldsValidation  from '../../../../../../utils/FieldsValidation'

@Component( {
  selector: 'app-datos-personales',
  templateUrl: './datos-personales.component.html',
  styleUrls: [ './datos-personales.component.scss' ]
} )
export class DatosPersonalesComponent implements OnInit {

  formMember: UntypedFormGroup;
  submitted!: boolean;
  maxDate = new Date();
  dataUploadArchivo: any;
  yearRange: string;
  @Input() data: any = {};
  @Input() view = false;
  @Input() listJobArea: SelectItem [] = [];
  responsabilityItems: any = [];
  selectedResponsability:any = null
  @Input() listGender: SelectItem [] = [];
  @Input() listCountries: SelectItem [] = [];
  @Input() idCountry: number;
  @Input() member:'team'|'club'|'teacher' = 'club'
  @Output()
  nextstep: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private formBuilder: UntypedFormBuilder,
    private clubService: ClubService,
    ) {
      
  }

  get f() {
    return this.formMember.controls;
  }

  ngOnChanges(changes:SimpleChanges){
    console.log(changes)
    if(changes.data && changes.data.currentValue!=undefined){
      console.log(this.data)
      this.loadForm()
    }
  }

  ngOnInit(): void {
    this.loadForm();
    this.yearRange = '1900:' + new Date().getFullYear();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 16);
    // console.log(this.maxDate);
  }

  getScreenWidth(): any {
    return screen.width;
  }

  loadForm(): void {
    console.log(this.data)
    this.formMember = this.formBuilder.group( {
      // jobs_area_id: [ this.data && this.data.jobs_area_id ? this.data.jobs_area_id : null, Validators.required ],
      // position_staff_id: [ this.data && this.data.position_staff_id ? this.data.position_staff_id : null, Validators.required ],
      responsibility: [ this.data && this.data.responsibility ? this.data.responsibility : null ],
      // full_name: [ this.data && this.data.full_name ? this.data.full_name : null, [Validators.required] ],
      gender_id: [ this.data && this.data.gender_id ? this.data.gender_id : null, Validators.required ],
      username: [ this.data && this.data.username ? this.data.username : null ],
      birth_date: [ this.data && this.data.birth_date ? new Date(this.data.birth_date) : null, Validators.required ],
      country_id: [ this.data && this.data.address?.country?.id ? this.data.address.country.id : null, Validators.required ],
    } );

    if(this.member === 'teacher'){
      this.formMember.addControl('name', new UntypedFormControl(this.data && this.data.name ? this.data.name : null, Validators.required));
      this.formMember.addControl('teacher_area_id', new UntypedFormControl(this.data && this.data.teacher_area_id ? this.data.teacher_area_id : null, Validators.required));
    }else{
      this.formMember.addControl('full_name', new UntypedFormControl(this.data && this.data.full_name ? this.data.full_name : null, Validators.required));
      this.formMember.addControl('jobs_area_id', new UntypedFormControl(this.data && this.data.jobs_area_id ? this.data.jobs_area_id : null, Validators.required));
      this.formMember.addControl('position_staff_id', new UntypedFormControl(this.data && this.data.position_staff_id ? this.data.position_staff_id : null, Validators.required));
    }

    if(this.data && this.data.jobs_area_id){
      // console.log('hola')
      this.setResponsabilityItems()
      const POSITION_ID = this.f.position_staff_id.value
      this.selectedResponsability = this.responsabilityItems.find((el:any) => el.id == POSITION_ID)
      // console.log(this.selectedResponsability)
    }
  }

  setResponsabilityItems(){
    const AREA_ID = this.member === 'teacher' ? this.f.teacher_area_id.value : this.f.jobs_area_id.value
    const area:any = this.listJobArea.find((area:any) => (area.id == AREA_ID))
    this.responsabilityItems = area.positions
    console.log(this.responsabilityItems)
  }

  setResponsabilityValue(){
    // console.log(this.selectedResponsability)
    this.formMember.patchValue({position_staff_id: this.selectedResponsability.id})
    
    // console.log(this.formMember.value)
  }

  onSubmit() {
    // console.log(this.formMember.value)
    // console.log(this.listCountries)
    this.submitted = true;
    let fieldsV = new FieldsValidation()
    if(this.member === 'teacher'){
      fieldsV.validateStepFields(['teacher_area_id','responsibility','name','gender_id','birth_date','country_id'], this.formMember)
    }else{
      fieldsV.validateStepFields(['jobs_area_id','position_staff_id','responsibility','full_name','gender_id','birth_date','country_id'], this.formMember)
    }
    if ( this.formMember.invalid ) {
      return;
    }
    const data1 = this.formMember.value;
    data1.image = this.dataUploadArchivo;
    this.nextstep.emit( data1 );
  }

  fileUpload( event: any ) {
    const file = event.target.files;
    this.dataUploadArchivo = file[ 0 ];
  }

  handleCountry(id: number){
    this.idCountry = id;
  }
}
