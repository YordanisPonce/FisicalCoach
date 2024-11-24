import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
} from '@angular/core';
import { EvaluationService } from 'src/app/_services/evaluation.service';
import { TranslateService } from '@ngx-translate/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import FieldsValidation from 'src/app/utils/FieldsValidation';
import { environment } from 'src/environments/environment';
import { AppStateService } from '../../../../stateManagement/appState.service';

@Component({
  selector: 'new-indicator-dialog',
  templateUrl: './new-indicator-dialog.component.html',
  styleUrls: ['./new-indicator-dialog.component.scss'],
})
export class NewIndicatorDialogComponent implements OnInit {
  competitions: any[];
  selectedCompetitions: any;
  validation: any = new FieldsValidation();
  step: number = 1;
  @Input() showModal: boolean = false;
  @Input() competences: any;
  @Input() editing: boolean = false;
  @Input() editingRubric: boolean = false;
  @Output() showModalChange: EventEmitter<boolean> =
    new EventEmitter<boolean>();
  @Output() dataToSave: EventEmitter<any> = new EventEmitter<any>();
  classroomId: string | number = '';
  selectedCompetences: any = [];
  loading: boolean = false;
  urlBase = environment.images;
  newIndicatorForm = this.formBuilder.group({
    id: [null],

    name: ['', Validators.required],
    percentage: [
      '',
      [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(3),
        Validators.max(100),
      ],
    ],
    evaluation_criteria: ['', [Validators.maxLength(255)]],
    insufficient_caption: ['', [Validators.maxLength(255)]],
    sufficient_caption: ['', [Validators.maxLength(255)]],
    remarkable_caption: ['', [Validators.maxLength(255)]],
    outstanding_caption: ['', [Validators.maxLength(255)]],
    competences: ['', [Validators.required]],
  });

  constructor(
    private translate: TranslateService,
    private evaluation: EvaluationService,
    private formBuilder: UntypedFormBuilder,
    private appStateService: AppStateService
  ) {}

  _indicator: any;

  @Input() set indicator(value: any) {
    this._indicator = value;
    if (this._indicator) {
      this.setIndicatorData();
    }
  }

  get newIndicatorControls() {
    return this.newIndicatorForm.controls;
  }

  ngOnInit(): void {
    this.classroomId = this.appStateService.getClass().id;
  }

  validateStep() {
    let fields = [];
    switch (this.step) {
      case 1:
        fields = ['name', 'percentage', 'competences'];
        if (
          !this.validation.validateStepFields(fields, this.newIndicatorForm)
        ) {
          this.step = this.step + 1;
        }
        break;
      default:
        break;
    }
  }

  closeDialog() {
    this.close();
    this.newIndicatorForm.reset();
    this.selectedCompetences = this._indicator = [];
    this.loading = false;
    this.editing = false;
    this.step = 1;
  }

  setFormCompetences() {
    const competencesValue = this.selectedCompetences.toLocaleString();
    this.newIndicatorForm.patchValue({ competences: competencesValue });
  }

  create() {
    const indicator = this.newIndicatorForm.value;
    if (this.editingRubric) {
      const listTemp: any[] = [];
      indicator.competences.split(',').map((x: any) => {
        const competencia = this.competences.find((c: any) => c.id == x);
        listTemp.push({ id: competencia.id, name: competencia.name });
      });
      indicator.competences = listTemp;
    }
    this.dataToSave.emit({ edit: this.editing, indicator });
    this.close();
  }

  edit(indicatorId: string) {
    const indicator = this.newIndicatorForm.value;
    if (this._indicator?.id || this.editingRubric) {
      const listTemp: any[] = [];
      indicator.competences.split(',').map((x: any) => {
        const competencia = this.competences.find((c: any) => c.id == x);
        listTemp.push({ id: competencia.id, name: competencia.name });
      });
      indicator.competences = listTemp;
    }
    this.dataToSave.emit({ edit: this.editing, indicator });
    this.closeDialog();
  }

  setIndicatorData() {
    if (this._indicator?.id || this.editingRubric) {
      this.selectedCompetences = this._indicator.competences.map(
        (el: any) => el.id
      );
    } else {
      this.selectedCompetences = this._indicator.competences
        .split(',')
        .map((item: any) => Number(item));
    }
    this.loadForm();
    this.setFormCompetences();
  }

  loadForm() {
    this.newIndicatorForm.patchValue({
      id: this._indicator.id,
      name: this._indicator.name,
      percentage: Number(this._indicator.percentage),
      evaluation_criteria: this._indicator.evaluation_criteria,
      insufficient_caption: this._indicator.insufficient_caption,
      sufficient_caption: this._indicator.sufficient_caption,
      remarkable_caption: this._indicator.remarkable_caption,
      outstanding_caption: this._indicator.outstanding_caption,
    });
  }

  onSubmit(): void {
    if (this.newIndicatorForm.invalid) {
      return;
    } else {
      this.loading = true;
      if (this.editing) {
        this.edit(this._indicator.id);
      } else {
        this.create();
      }
    }
  }

  private close() {
    this.showModal = false;
    this.showModalChange.emit(this.showModal);
  }
}
