import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { SelectItem } from '../../../../_models/selectItem';
import { SchoolService } from 'src/app/_services/school.service';
import {Club} from '../../../../_models/club';
import {Subscription} from 'rxjs';
import { AppStateService } from 'src/app/stateManagement/appState.service';
import FieldsValidation from 'src/app/utils/FieldsValidation';
import { environment } from 'src/environments/environment';
import { AlertsApiService } from 'src/app/generals-services/alerts-api.service';

@Component({
  selector: 'new-teacher',
  templateUrl: './new-teacher.component.html',
  styleUrls: ['./new-teacher.component.scss']
})
export class NewTeacherComponent implements OnInit {
  step:number = 1
  validation:any = new FieldsValidation()
  loading:boolean = false
  // formMember: FormGroup;
  submitted = false;
  showImagen = false;
  saving = false;
  imagen: any;
  imagenPreview: any;
  club: Club;
  team: any;
  subs: Subscription;
  responsabilityItems:any = null
  selectedResponsability:any = null
  imageUrl:string = environment.images

  @Input() listJobArea: SelectItem [] = [];
  @Input() listGender: SelectItem [] = [];
  @Input() visible:boolean = false

  @Output() close = new EventEmitter<boolean>()
  @Output() created = new EventEmitter<boolean>()
  @Output() advancedMember = new EventEmitter<boolean>()

  newMemberForm:UntypedFormGroup = this.formBuilder.group({
    name: [ null, Validators.required ],
    email: [ null, [Validators.required,Validators.email] ],
    teacher_area_id: [ null, Validators.required ],
    // position_staff_id : [ null, Validators.required ],
    responsibility: [ null ],
    gender_id: [ null, Validators.required ]
  });

  constructor(
    private formBuilder: UntypedFormBuilder,
    private schoolService: SchoolService,
    private appStateService: AppStateService,
    public msg: AlertsApiService
    ) {
  }

  get f() {
    return this.newMemberForm.controls;
  }

  validateStep(){
    let fields = []
    switch(this.step){
      case 1:
        fields=['name','email','teacher_area_id','gender_id']
        if(!this.validation.validateStepFields(fields,this.newMemberForm)) this.step = this.step+1
        break
      default:
        break
    }
  }

  closeDialog(){
    this.close.emit(false)
    this.newMemberForm.reset()
    this.loading = false
    this.selectedResponsability = null
    this.submitted = false
    this.imagenPreview = this.imagen = undefined
    // this.editing = false
    this.step = 1
  }

  ngOnDestroy(): void {
    if ( this.subs ) {
      this.subs.unsubscribe();
    }
  }

  ngOnInit(): void {
  }

  setResponsabilityItems(){
    const area:any = this.listJobArea.find((area:any) => (area.id == this.f.teacher_area_id.value))
    this.responsabilityItems = area.positions
    // console.log(this.responsabilityItems)
  }

  setResponsabilityValue(){
    // console.log(this.selectedResponsability)
    this.newMemberForm.patchValue({position_staff_id: this.selectedResponsability.id})
    // console.log(this.newMemberForm.value)
  }

  onSubmit() {
    this.submitted = true;
    if ( this.newMemberForm.invalid ) {
      return;
    }else{
      this.loading = true
      // if(this.editing){
        // this.edit(this.indicator.id)
      // }else{
        this.createTeacher()
      // }
    }
    // this.showImagen = true;
  }

  async fileUpload( event: any, tipo: string ) {
    const file = event.target.files[ 0 ];
    this.imagen = file;
    this.preview( file );
  }

  preview( file: File ) {
    if ( !file ) {
      return;
    }
    const mimeType = file.type;
    if ( mimeType.match( /image\/*/ ) == null ) {
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL( file );
    reader.onload = ( event ) => {
      this.imagenPreview = { url: reader.result, id: null };
    };
  }

  createTeacher(){
    const data = this.newMemberForm.value;
    if(this.imagen) data.image = this.imagen
    this.schoolService.addTeacher( data, this.appStateService.getSchool().id)
    .then( r => {
      // this.savedMember()
      this.closeDialog()
      this.created.emit(true)
    } )
    .catch(({error})=>{
      this.loading = false
      this.msg.error(error)

    });
  }

}
