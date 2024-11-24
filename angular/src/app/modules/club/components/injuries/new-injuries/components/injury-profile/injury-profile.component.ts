import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ComponentBaseClass } from '../../componentBase.class';
import { InjuryService } from '../../../../../../../_services/injury.service';
import { IListaItem } from '../../../../../../../_models/IListaItem';
import { AppStateQuery } from '../../../../../../../stateManagement/appState.query';
import FieldsValidation from 'src/app/utils/FieldsValidation';

@Component({
  selector: 'app-injury-profile',
  templateUrl: './injury-profile.component.html',
  styleUrls: ['./injury-profile.component.scss'],
})
export class InjuryProfileComponent
  extends ComponentBaseClass
  implements OnInit, AfterViewInit
{
  @Output() next: EventEmitter<any> = new EventEmitter<any>();
  @Input() prognosis: boolean;
  @Input() rfdData: any;
  formulario: UntypedFormGroup;
  listLocalizaciones: IListaItem[] = [];
  listInjurySeverities: IListaItem[] = [];
  listInjuryAffectedSideTypes: IListaItem[] = [];
  listInjuryTypes: IListaItem[] = [];
  listInjuryTypesSpecs: IListaItem[] = [];
  listGender: any[] = [
    {
      value: 1,
      label: 'Traumatica',
    },
    {
      value: 2,
      label: 'Sobreuso',
    },
  ];
  listRecaida: any[] = [
    {
      value: 1,
      label: 'YES',
    },
    {
      value: 0,
      label: 'NO',
    },
  ];
  submitted: boolean;
  yearRange: string;
  disabledForm!: boolean;
  data: any;
  loadingLessionType: boolean;
  maxDate: Date = new Date();

  constructor(
    private formBuilder: UntypedFormBuilder,
    private cdRef: ChangeDetectorRef,
    private injuryService: InjuryService,
    private appStateQuery: AppStateQuery
  ) {
    super();
  }

  validateFields = new FieldsValidation();

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

  get f() {
    return this.formulario.controls;
  }

  ngOnInit(): void {
    this.cargarListados();
    this.loadForm(this.data);

    if (this.rfdData) this.loadDatafromRFD(this.rfdData.injury);
  }

  /**
   * get rfd information
   * @param rfdData
   */
  loadDatafromRFD(rfdData: any) {
    this.formulario = this.formBuilder.group({
      injury_date: [
        rfdData ? new Date(rfdData.injury_date) : null,
        Validators.required,
      ],
      injury_type_id: [
        rfdData ? rfdData.injury_type_id : null,
        Validators.required,
      ],
      injury_type_spec_id: [
        rfdData ? rfdData.injury_type_spec_id : null,
        Validators.required,
      ],
      is_relapse: [null],
      affected_side_id: [rfdData ? rfdData.affected_side.id : null],
      injury_location_id: [null, Validators.required],
      detailed_location: [null],
      injury_severity_id: [rfdData ? rfdData.severity.id : null],
    });
    if (this.data) {
      this.cambioTipoLesion(this.data.injury_type_id, false);
    }
  }

  loadForm(data?: any) {
    this.formulario = this.formBuilder.group({
      injury_date: [
        data ? new Date(data.injury_date) : null,
        Validators.required,
      ],
      injury_type_id: [data ? data.injury_type_id : null, Validators.required],
      injury_type_spec_id: [
        data ? data.injury_type_spec_id : null,
        Validators.required,
      ],
      is_relapse: [data ? data.is_relapse : null],
      affected_side_id: [data ? data.affected_side_id : null],
      injury_location_id: [
        data ? data.injury_location_id : null,
        Validators.required,
      ],
      detailed_location: [data ? data.detailed_location : null],
      injury_severity_id: [
        data ? data.injury_severity_id : null,
        Validators.required,
      ],
      prognosis: [data ? data.prognosis : null],
    });
    if (this.data) {
      this.cambioTipoLesion(this.data.injury_type_id, false);
    }
  }

  cambioTipoLesion(event: any, reset = true) {
    if (reset) {
      this.formulario.controls.injury_type_spec_id.setValue(null);
    }

    this.loadingLessionType = true;

    this.injuryService.getListInjuryTypesSpecs('es', event).subscribe((res) => {
      this.listInjuryTypesSpecs = res.data;

      this.loadingLessionType = false;
    });
  }

  cargarListados() {
    this.injuryService.getListInjuryTypes().subscribe(
      (res: any) => {
        this.listInjuryTypes = res.data;

        this.injuryService.getListInjurySeverities().subscribe(
          (res: any) => {
            this.listInjurySeverities = res.data;

            this.injuryService.getListInjuryAffectedSideTypes().subscribe(
              (res: any) => {
                this.listInjuryAffectedSideTypes = res.data;

                this.injuryService.getListInjuryLocations().subscribe(
                  (res: any) => {
                    this.listLocalizaciones = res.data;
                  },
                  (error) => {
                    console.log(error);
                  }
                );
              },
              (error) => {
                console.log(error);
              }
            );
          },
          (error) => {
            console.log(error);
          }
        );
      },
      (error) => {
        console.log(error);
      }
    );
  }

  onSubmit() {
    this.submitted = true;
  }

  validateForm(): boolean {
    if (!this.disabledForm) {
      this.submitted = true;
      this.validateFields.validateStepFields(
        [
          'injury_date',
          'injury_type_id',
          'injury_type_spec_id',
          'injury_location_id',
          'detailed_location',
          'injury_severity_id',
        ],
        this.formulario
      );
      if (this.formulario.valid) {
        this.next.emit(this.formulario.value);
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }

  ngAfterViewInit(): void {
    if (this.disabledForm) {
      this.formulario.disable();
    }
  }
}
