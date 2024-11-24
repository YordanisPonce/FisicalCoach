import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ComponentBaseClass } from '../../componentBase.class';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { InjuryService } from '../../../../../../../_services/injury.service';
import { IListaItem } from '../../../../../../../_models/IListaItem';
import { AppStateQuery } from '../../../../../../../stateManagement/appState.query';

@Component( {
  selector: 'app-complementary-clinical-test',
  templateUrl: './complementary-clinical-test.component.html',
  styleUrls: [ './complementary-clinical-test.component.scss' ]
} )
export class ComplementaryClinicalTestComponent extends ComponentBaseClass implements OnInit, AfterViewInit {

  @Output() next: EventEmitter<any> = new EventEmitter<any>();
  formulario: UntypedFormGroup;
  listClinicalTestTypes: IListaItem[] = [];
  disabledForm!: boolean;
  data: any;

  constructor( private formBuilder: UntypedFormBuilder,
               private cdRef: ChangeDetectorRef,
               private injuryService: InjuryService,
               private appStateQuery: AppStateQuery ) {
    super();
  }
  @Input() set detalle( value: boolean ) {
    this.disabledForm = value;
  }

  @Input() set formData( value: any ) {
    this.loadForm( value );
    this.cdRef.detectChanges();
    this.data = value;
  }

  ngOnInit(): void {
    this.cargarListado();
    this.loadForm( this.data );
  }

  loadForm( data?: any ) {
    this.formulario = this.formBuilder.group( {
      clinical_test_types: [ data ? data.clinical_test_types : null ],
      detailed_diagnose: [ data ? data.detailed_diagnose : null ],
    } );
  }

  onSubmit(): void {
  }

  cargarListado() {
    // this.appStateQuery.listInjuries$.subscribe( data => {
    //   this.listClinicalTestTypes = data.clinicalTestTypes;
    // } );

    this.injuryService.getListClinicalTestTypes().subscribe((res:any) => {
      console.log(res)
      this.listClinicalTestTypes = res.data
    },
    (error) => {
      console.log(error)
    })
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
