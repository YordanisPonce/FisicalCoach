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
import { SelectItem } from '../../../../../../../_models/selectItem';
import { ComponentBaseClass } from '../../componentBase.class';
import { IListaItem } from '../../../../../../../_models/IListaItem';
import FieldsValidation from 'src/app/utils/FieldsValidation';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-moment-and-cause',
  templateUrl: './moment-and-cause.component.html',
  styleUrls: ['./moment-and-cause.component.scss'],
})
export class MomentAndCauseComponent
  extends ComponentBaseClass
  implements OnInit, AfterViewInit
{
  @Input() listMechanismsInjury: IListaItem[] = [];
  @Input() listInjuryExtrinsicFactors: IListaItem[] = [];
  @Input() listInjuryIntrinsicFactors: IListaItem[] = [];
  @Input() listInjurySituationTypes: IListaItem[] = [];
  @Input() formData: any;
  @Output() next: EventEmitter<any> = new EventEmitter<any>();
  selectedMechanismsInjury: IListaItem;
  listJobArea: SelectItem[] = [];
  listGender: SelectItem[] = [];
  submitted = false;
  yearRange: string;
  disabledForm!: boolean;

  formulario: UntypedFormGroup;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private translateService: TranslateService
  ) {
    super();
  }

  validateFields = new FieldsValidation();

  @Input() set detalle(value: boolean) {
    this.disabledForm = value;
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
    this.yearRange = '1900:' + new Date().getFullYear();

    this.listJobArea = [
      { label: this.translateService.instant('LBL_CONTACT'), value: true },
      { label: this.translateService.instant('LBL_NO_CONTACT'), value: false },
    ];
 

    this.loadForm(this.formData);
  }

  loadForm(data?: any) {

    console.log(data)
    this.formulario = this.formBuilder.group({
      mechanism_injury_id: [data ? data.mechanism_injury_id : null],
      injury_situation_id: [data ? data.injury_situation_id : ''],
      injury_intrinsic_factor: [data ? data.injury_intrinsic_factor : ''],
      injury_extrinsic_factor: [data ? data.injury_extrinsic_factor : ''],
      is_triggered_by_contact: [data ? data.is_triggered_by_contact : null],
    });
  }

  onSubmit() {
    this.submitted = true;
  }

  validateForm(): boolean {
    if (!this.disabledForm) {
      this.submitted = true;
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
