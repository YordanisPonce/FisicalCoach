import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { AppStateQuery } from '../../../../stateManagement/appState.query';
import { AlertsApiService } from '../../../../generals-services/alerts-api.service';
import FieldsValidation from 'src/app/utils/FieldsValidation';
import { AppStateService } from 'src/app/stateManagement/appState.service';
import { GeneralService } from 'src/app/_services/general.service';
import { AlumnsService } from 'src/app/_services/alumns.service';

@Component({
  selector: 'app-alumn-academic-data',
  templateUrl: './alumn-academic-data.component.html',
  styleUrls: ['./alumn-academic-data.component.scss'],
})
export class AlumnAcademicDataComponent implements OnInit {
  @Input() alumn: any = {};
  @Input() listCourses: any = [];
  @Input() acneaeTypes: any = [];
  @Output() saveDataLocal: EventEmitter<any> = new EventEmitter<any>();
  @Output() nextstep: EventEmitter<any> = new EventEmitter<any>();
  formAcademicData: UntypedFormGroup;
  submitted = false;
  subsAlumn: Subscription;
  validation = new FieldsValidation();
  selectedAcneae: any;
  acneaeSubtypes: object[] = [];
  saving: boolean = false;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private alerts: AlertsApiService,
    private appStateService: AppStateService,
    private generalService: GeneralService,
    private alumnService: AlumnsService
  ) {}

  @Input() set alumnData(value: any) {
    this.alumn = value;
  }

  get f() {
    return this.formAcademicData.controls;
  }

  ngOnInit(): void {
    this.loadForm();

    this.subsAlumn = this.alumnService.alumn$.subscribe((res) => {
      setTimeout(() => {
        if (this.formAcademicData.get('acneae')?.value === true) {
          this.selectedAcneae = this.acneaeTypes.filter(
            (el: any) =>
              el.id === this.formAcademicData.get('acneae_type_id')?.value
          )[0];
          if (this.selectedAcneae) {
            this.setAcneaeSubtypes(this.selectedAcneae);
          }
        }
        this.loadForm();
      }, 500);
    });
  }

  ngOnDestroy() {
    if (!this.alumn.id && !this.submitted) {
      const data = this.formAcademicData.value;
      this.saveDataLocal.emit(data);
    }
    this.subsAlumn.unsubscribe();
  }

  loadForm() {
    this.formAcademicData = this.formBuilder.group({
      list_number: [
        this.alumn && this.alumn.list_number
          ? Number(this.alumn.list_number)
          : null,
        Validators.required,
      ],
      is_new_entry: [
        this.alumn && this.alumn.is_new_entry ? this.alumn.is_new_entry : null,
      ],
      is_advanced_course: [
        this.alumn && this.alumn.is_advanced_course
          ? this.alumn.is_advanced_course
          : null,
      ],
      is_repeater: [
        this.alumn && this.alumn.is_repeater ? this.alumn.is_repeater : null,
      ],
      pending_subjects: [
        this.alumn && this.alumn.pending_subjects
          ? this.loadPendingSubjects(this.alumn.pending_subjects)
          : null,
      ],
      is_delegate: [
        this.alumn && this.alumn.is_delegate ? this.alumn.is_delegate : null,
      ],
      is_sub_delegate: [
        this.alumn && this.alumn.is_sub_delegate
          ? this.alumn.is_sub_delegate
          : null,
      ],
      has_digital_difficulty: [
        this.alumn && this.alumn.has_digital_difficulty
          ? this.alumn.has_digital_difficulty
          : null,
      ],
      acneae: [this.alumn && this.alumn.acneae_type_id ? true : null],
      acneae_type_id: [
        this.alumn && this.alumn.acneae_type_id
          ? this.alumn.acneae_type_id
          : null,
      ],
      acneae_subtype_id: [
        this.alumn && this.alumn.acneae_subtype_id
          ? this.alumn.acneae_subtype_id
          : null,
      ],
      acneae_description: [
        this.alumn && this.alumn.acneae_description
          ? this.alumn.acneae_description
          : null,
      ],
    });
  }

  clearAcneaeData(checked: boolean) {
    // console.log(event)
    // console.log(event.target.value)
    if (!checked) {
      this.selectedAcneae = undefined;
      this.formAcademicData.patchValue({
        acneae_type_id: '',
        acneae_subtype_id: '',
        acneae_description: '',
      });
    }
  }

  clearPendingSubjects(checked: boolean) {
    if (!checked) {
      this.selectedAcneae = undefined;
      this.formAcademicData.patchValue({
        pending_subjects: '',
      });
    }
  }

  setAcneaeValue() {
    this.formAcademicData.patchValue({
      acneae_type_id: this.selectedAcneae.id,
    });
  }

  setAcneaeSubtypes(acneaeType: any) {
    // console.log(acneaeType)
    // console.log(this.selectedAcneae)
    this.setAcneaeValue();
    if (['acnee', 'attention_or_learning_disorder'].includes(acneaeType.code)) {
      this.acneaeSubtypes = acneaeType.subtypes;
    }
  }

  loadPendingSubjects(subjects: string | number[]) {
    if (typeof subjects === 'string') {
      return subjects.split(',').map((el: string) => Number(el));
    } else {
      const PENDING_SUBJECTS = subjects.map((subject: any) => subject.id);
      // console.log(PENDING_SUBJECTS)
      return PENDING_SUBJECTS;
    }
  }

  onSubmit() {
    console.log(this.formAcademicData.value);
    this.submitted = true;
    this.validation.validateStepFields(['list_number'], this.formAcademicData);

    if (this.formAcademicData.invalid) {
      return;
    }
    const data = this.formAcademicData.value;
    if (data.pending_subjects != null) {
      data.pending_subjects = data.pending_subjects.toLocaleString();
    }
    // console.log(data)
    if (!this.alumn.id) {
      this.nextstep.emit(data);
      return;
    }
    data.id = this.alumn.id;
    const alumn = Object.assign({}, data);
    this.saving = true;
    this.alumnService
      .add(alumn, this.appStateService.getClassroomAcademicYear(), true)
      .then((r: any) => {
      
        this.alumnService.setAlumnsDetailsData(
          Object.assign(this.alumnService.getAlumnsDetailsData(), {
            alumn: JSON.parse(r).data,
          })
        );
        this.alerts.succes(JSON.parse(r).message);
        this.saving = false;
      })
      .catch(({ error }) => {
        this.saving = false;
        this.alerts.error(error);
      });
  }
}
