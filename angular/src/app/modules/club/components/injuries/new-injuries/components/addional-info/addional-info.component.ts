import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ComponentBaseClass } from '../../componentBase.class';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { IListaItem } from '../../../../../../../_models/IListaItem';
import { InjuryService } from '../../../../../../../_services/injury.service';
import { AppStateQuery } from '../../../../../../../stateManagement/appState.query';

@Component({
  selector: 'app-addional-info',
  templateUrl: './addional-info.component.html',
  styleUrls: ['./addional-info.component.scss']
})

export class AddionalInfoComponent extends ComponentBaseClass implements OnInit, AfterViewInit {
  @Output() next: EventEmitter<any> = new EventEmitter<any>();
  formulario: UntypedFormGroup;
  listClinicalTestTypes: IListaItem[] = [];
  disabledForm!: boolean;
  data: any;

  constructor(private formBuilder: UntypedFormBuilder,
    private cdRef: ChangeDetectorRef,
    private injuryService: InjuryService,
    private appStateQuery: AppStateQuery) {
    super();
  }

  @Input() set detalle(value: boolean) {
    this.disabledForm = value;
  }

  @Input() set formData(value: any) {
    this.loadForm(value);
    this.cdRef.detectChanges();
    this.data = value;
  }

  @Input() set resetForm(value: any) {
    if (value) {
      this.formulario.reset();
    }
  }

  ngOnInit(): void {
    this.cargarListado();
    this.loadForm(this.data);
  }

  loadForm(data?: any) {
    this.formulario = this.formBuilder.group({
      clinical_test_types: [data ? data.clinical_test_types : null],
      surgery_extra_info: [data ? data.surgery_extra_info : null],
    });
  }

  onSubmit(): void {
  }

  cargarListado() {
    this.appStateQuery.listInjuries$.subscribe(data => {
      this.listClinicalTestTypes = data.clinicalTestTypes;
    });
  }

  validateForm(): boolean {
    if (!this.disabledForm)
    {
      if (this.formulario.valid)
      {
        this.next.emit(this.formulario.value);
        return true;
      } else
      {
        return false;
      }
    } else
    {
      return true;
    }

  }

  ngAfterViewInit(): void {
    if (this.disabledForm)
    {
      this.formulario.disable();
    }
  }

}
