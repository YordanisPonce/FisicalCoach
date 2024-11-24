import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SelectItem } from '../../../../../../../_models/selectItem';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ComponentBaseClass } from '../../componentBase.class';

@Component( {
  selector: 'app-injury-prognosis',
  templateUrl: './injury-prognosis.component.html',
  styleUrls: [ './injury-prognosis.component.scss' ]
} )
export class InjuryPrognosisComponent extends ComponentBaseClass implements OnInit, AfterViewInit {

  @Output() next: EventEmitter<any> = new EventEmitter<any>();
  formulario: UntypedFormGroup;
  listJobArea: SelectItem [] = [];
  listGender: SelectItem [] = [];
  submitted!: boolean;
  yearRange: string;
  disabledForm!: boolean;
  data: any;

  constructor( private formBuilder: UntypedFormBuilder,
               private cdRef: ChangeDetectorRef, ) {
    super();
  }

  @Input() minDate:Date

  @Input() set detalle( value: boolean ) {
    this.disabledForm = value;
  }
  @Input() set formData( value: any ) {
    this.loadForm( value );
    this.cdRef.detectChanges();
    this.data = value;
  }

  ngOnInit(): void {
    this.yearRange = '1900:' + new Date().getFullYear();
    this.loadForm( this.data );
  }

  loadForm( data?: any ) {
    this.formulario = this.formBuilder.group( {
      injury_forecast: [ data ? data.injury_forecast : null ],
      medically_discharged_at: [ data ? data.medically_discharged_at : null ],
      days_off: [ data ? data.days_off : null , Validators.min(0)],
      sportly_discharged_at: [ data ? data.sportly_discharged_at : null ],
      matches_off: [ data ? data.matches_off : null , Validators.min(0)],
      competitively_discharged_at: [ data ? data.competitively_discharged_at : null ],
    } );
  }

  onSubmit() {
    this.submitted = true;
  }

  validateForm(): boolean {
    if ( !this.disabledForm ) {
      if ( this.formulario.valid ) {
        this.next.emit( this.formulario.value );
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }

  ngAfterViewInit(): void {
    if ( this.disabledForm ) {
      this.formulario.disable();
    }
  }

}
