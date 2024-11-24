import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { SelectItem } from '../../../../../../_models/selectItem';
import { ClubService } from '../../../../../../_services/club.service';
import {GeneralService} from '../../../../../../_services/general.service';
import  FieldsValidation  from '../../../../../../utils/FieldsValidation'

@Component( {
  selector: 'app-datos-contacto',
  templateUrl: './datos-contacto.component.html',
  styleUrls: [ './datos-contacto.component.scss' ]
} )
export class DatosContactoComponent implements OnInit {
  formMember: UntypedFormGroup;
  submitted: boolean = false;
  listJobArea: SelectItem [] = [];
  listCities: SelectItem [] = [];
  listProviencies: SelectItem [] = [];
  countrySelected: any;
  @Input()
  listCountry: SelectItem [] = [];
  @Input()
  listAllCountries: any [] = [];
  @Input() idCountry: number;
  @Input() data: any;
  @Input() view = false;
  maxDate: Date = new Date();
  @Output()
  nextstep: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  goBack: EventEmitter<void> = new EventEmitter<void>();

  constructor( private formBuilder: UntypedFormBuilder,
               private clubService: ClubService,
               private generalService: GeneralService) {
  }

  get f() {
    return this.formMember.controls;
  }

  ngOnInit(): void {
    if ( this.idCountry && this.idCountry!=null){
      const event = { value: this.idCountry ? this.idCountry : this.data.address.country.id};
      this.handleCities(event);
    }
    this.loadForm();
    this.clubService.getListJobAreas().subscribe( res => {
      const list: any = [];
      res.data.map( ( r: any ) => {
        list.push( { label: ( r.name ).replace( '__', '' ), value: r.id } );
      } );
      this.listJobArea = list;
    } );
  }

  getScreenWidth(): any {
    return screen.width;
  }

  loadForm(): void {
    this.formMember = this.formBuilder.group( {
      street: [ this.data && this.data.address ?  this.data.address.street : null ],
      postal_code: [ this.data && this.data.address ?  this.data.address.postal_code : null ],
      city: [ this.data && this.data.address ?  this.data.address.city : null ],
      mobile_phone: [ this.data.address && this.data.address.mobile_phone ?  this.data.address.mobile_phone : null ],
      email: [this.data && this.data.email ?  this.data.email : null, [ Validators.required, Validators.email ] ],
      country_id: [ this.data && this.data.address?.country?.id  ?  this.data.address.country.id : this.idCountry ],
      province_id: [ this.data && this.data.address?.province?.id ?  this.data.address.province.id : null, Validators.required ],
    } );

    // if(this.data && this.data.address){
    //   this.handleCities(
    //     {
    //       value: this.data.address.country.id
    //     }
    //   )
    // }
  }

  onSubmit() {
    this.submitted = true;
    let fieldsV = new FieldsValidation()
    fieldsV.validateStepFields(['email','country_id','province_id'], this.formMember)
    if ( this.formMember.invalid ) {
      return;
    }
    const data1 = this.formMember.value;
    this.nextstep.emit( data1 );
  }

  back() {
    this.goBack.emit();
  }

  handleCities(event: any){
    console.log(event)
    this.countrySelected = this.listAllCountries.find( x => x.id === event.value );
    const code = this.countrySelected.iso2;
    const locale = localStorage.getItem('languaje');
    this.generalService.getCities(locale, code).subscribe( r => {
      this.listCities = [];
      this.listProviencies = [];
      r.data.map((m: any) => {
        this.listCities.push({label: m.name, value: m.id});
        this.listProviencies.push({label: m.name, value: m.id});
      });
    });
  }

  validateMobile( event: any ) {
    event.target.value = event.target.value.replace( /[^0-9.]/gi, '' ).replace( '..', '.' );
  }

  maskPhoneCode( event: any ) {
    const temp = this.formMember.controls.mobile_phone.value;
    const list: any[] = [];
    temp.map( ( x: any ) => {
      const code = x.substring( 0, 2 );
      if ( code === this.countrySelected?.phone_code.toString() ) {
        list.push( this.countrySelected?.phone_code + x.substring( 2 )  );
      } else {
        list.push( this.countrySelected?.phone_code + x );
      }
    } );
    this.formMember.controls.mobile_phone.setValue( list );
  }

}
