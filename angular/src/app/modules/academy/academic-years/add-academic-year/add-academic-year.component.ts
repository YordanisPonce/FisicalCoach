import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-add-academic-year',
  templateUrl: './add-academic-year.component.html',
  styleUrls: ['./add-academic-year.component.scss'],
})
export class AddAcademicYearComponent implements OnInit {
  academicYearForm!: UntypedFormGroup;
  academicPeriodForm!: UntypedFormGroup;
  periodDialog: boolean = false;
  minDate: Date;
  maxDate: Date;
  minDatePeriods: Date;
  maxDatePeriods: Date;
  range: string;
  disabledDates: Date[] = [];
  submittedYear: boolean = false;
  submittedPeriod: boolean = false;
  @Output() saveData: EventEmitter<any> = new EventEmitter<any>();
  @Input() displayButtons: boolean = false;
  @Input() viewDetail: boolean = false;
  @Input() academicYear!: any;
  @Input() academicYears: any[] = [];

  constructor(private formBuilder: UntypedFormBuilder) {}

  get f() {
    return this.academicYearForm.controls;
  }

  get fp() {
    return this.academicPeriodForm.controls;
  }

  get periods() {
    return this.academicYearForm.controls['periods'] as UntypedFormArray;
  }

  get academicPeriodListAsArray() {
    return this.f.periods.value;
  }

  ngOnInit(): void {
    this.loadForm(this.academicYear);
    const today = moment().get('year');
    this.range = `${today - 10}:${today + 10}`;
  }

  newPeriod() {
    this.loadPeriodForm();
    this.periodDialog = true;
    this.minDatePeriods = this.f.start_date.value;
    this.maxDatePeriods = this.f.end_date.value;
    this.setDisabledDates();
  }

  savePeriod() {
    this.academicPeriodForm.markAllAsTouched();
    this.submittedPeriod = true;
    if (this.academicPeriodForm.invalid) {
      return;
    }
    const period = this.academicPeriodForm.value;
    this.addPeriod(period);
  }

  onSelectDateInit() {
    const dateStart = this.f.start_date.value;
    const dateEnd = this.f.end_date.value;
    this.minDate = dateStart;
    if (dateEnd && moment(dateStart).isAfter(dateEnd)) {
      this.f.end_date.setValue(null);
    }
  }

  closeModal() {
    this.periodDialog = false;
    this.academicPeriodForm.reset();
  }

  deletePeriod(index: number) {
    this.periods.removeAt(index);
  }

  onChangeStatusPeriod(event: any, index: any) {
    if (event.checked) {
      this.periods.controls.map((x: any) => {
        x.controls.is_active.setValue(!event.checked);
        x.controls.is_active.updateValueAndValidity();
      });
    }
    const period = this.periods.controls[index] as any;
    period.controls.is_active.setValue(event.checked);
    period.controls.is_active.updateValueAndValidity();
  }

  closeAcademicYear() {}

  saveAcademicYear() {
    this.academicYearForm.markAllAsTouched();
    this.submittedYear = true;
    if (this.academicYearForm.valid) {
      const temp = this.academicYearForm.value;
      const data = { ...temp };

      data.end_date = this.formatDate(data.end_date);
      data.start_date = this.formatDate(data.start_date);
      const periodsTemp = Object.assign([], data.periods);
      const periods = periodsTemp.map((x: any) => {
        return Object.assign({}, x);
      });
      periods.map((x: any) => {
        x.end_date = this.formatDate(x.end_date);
        x.start_date = this.formatDate(x.start_date);
      });
      data.periods = periods;
      this.emitData(data);
    } else {
      this.emitData(null);
    }
  }

  emitData(data?: any) {
    const dataToSave = {
      data: data,
      valid: this.academicYearForm.valid,
    };
    this.saveData.emit(dataToSave);
  }

  formatDate(date: any) {
    return moment(date).format('YYYY-MM-DD');
  }

  invalidField(field: UntypedFormControl | AbstractControl) {
    return field.invalid && field.touched;
  }

  private setPeriodsOnEdit() {
    this.academicYear.academic_periods.map((x: any) => {
      const item = this.formBuilder.group({
        id: [{ value: x.id, disabled: this.viewDetail }, Validators.required],
        title: [
          { value: x.title, disabled: this.viewDetail },
          Validators.required,
        ],
        start_date: [
          {
            value: new Date(x.start_date + ' 00:00:00'),
            disabled: this.viewDetail,
          },
          Validators.required,
        ],
        is_active: [{ value: x.is_active, disabled: this.viewDetail }],
        end_date: [
          {
            value: new Date(x.end_date + ' 00:00:00'),
            disabled: this.viewDetail,
          },
          Validators.required,
        ],
      });
      this.periods.push(item);
    });
    setTimeout(() => {
      this.setDisabledDates();
    }, 500);
  }

  private setPeriodsOnEditForm(data: any): any {
    const periodos: any[] = [];
    const array = data && data.periods ? data.periods : data.academic_periods;
    array.map((x: any) => {
      const item = this.formBuilder.group({
        title: [
          { value: x.title, disabled: this.viewDetail },
          Validators.required,
        ],
        start_date: [
          { value: new Date(x.start_date), disabled: this.viewDetail },
          Validators.required,
        ],
        is_active: [{ value: x.is_active, disabled: this.viewDetail }],
        end_date: [
          { value: new Date(x.end_date), disabled: this.viewDetail },
          Validators.required,
        ],
      });
      periodos.push(item);
    });
    return periodos;
  }

  private setMixDateOnEdit() {
    const dateStart = this.f.start_date.value;
    this.minDate = dateStart;
  }

  private addPeriod(data: any) {
    
    const item = this.formBuilder.group({
      title: [data.title, Validators.required],
      start_date: [data.start_date, Validators.required],
      is_active: [this.periods.length <= 0],
      end_date: [data.end_date, Validators.required],
    });
    if (this.validateDateBetween()) {
      this.periods.push(item);
      this.closeModal();
    } else {
      console.log(
        ' la fecha ingresada comprende uno o mas peridodos existentes'
      );
    }
  }

  private loadForm(data?: any) {
    this.academicYearForm = this.formBuilder.group({
      id: [data ? data.id : null],
      title: [
        { value: data ? data.title : null, disabled: this.viewDetail },
        [Validators.required],
      ],
      start_date: [
        {
          value: data ? new Date(data.start_date) : null,
          disabled: this.viewDetail,
        },
        [Validators.required],
      ],
      end_date: [
        {
          value: data ? new Date(data.end_date) : null,
          disabled: this.viewDetail,
        },
        [Validators.required],
      ],
      is_active: [{ value: this.setIsActive(data), disabled: false }],
      periods: this.formBuilder.array([], ValidatorPeriodsActive()),
    });
    if (this.academicYear) {
      setTimeout(() => {
        this.setPeriodsOnEdit();
        this.setMixDateOnEdit();
      }, 200);
    }
  }

  private desabledIsActive(data: any) {
    if (this.viewDetail) {
      return true;
    } else if (data?.is_active) {
      return false;
    } else {
      const academicYearActive = this.academicYears.filter((x) => x.is_active);
      if (academicYearActive.length > 1) {
        return true;
      } else if (
        academicYearActive.length === 1 &&
        academicYearActive[0].id === data?.id
      ) {
        return false;
      } else if (academicYearActive.length === 0) {
        return false;
      } else {
        return true;
      }
    }
  }

  private setIsActive(data: any) {
    const academicYearActive = this.academicYears.filter((x) => x.is_active);
    if (data?.id) {
      return data?.is_active;
    } else {
      return academicYearActive.length <= 1;
    }
  }

  private loadPeriodForm() {
    this.academicPeriodForm = this.formBuilder.group({
      id: [null],
      title: [null, [Validators.required]],
      start_date: [null, [Validators.required]],
      is_active: [false],
      end_date: [null, [Validators.required]],
    });
  }

  private setDisabledDates() {
    const temp: any[] = [];
    const array = this.academicPeriodListAsArray;
    array?.map((x: any) => {
      let start = x.start_date;
      const end = x.end_date;
      while (moment(start).isBefore(end)) {
        temp.push(start);
        start = moment(start).add(1, 'day');
        start = new Date(start);
      }
      temp.push(end);
    });
    this.disabledDates = temp;
  }

  private validateDateBetween() {
    const start = this.fp.start_date.value;
    const end = this.fp.end_date.value;
    const array = this.academicPeriodListAsArray;
    let valid = true;
    array.map((x: any) => {
      if (
        moment(x.start_date).isBetween(moment(start), moment(end)) ||
        moment(x.end_date).isBetween(moment(start), moment(end))
      ) {
        valid = false;
      }
    });
    return valid;
  }
}

export function ValidatorPeriodsActive(): ValidatorFn | any {
  return function validate(statuses: UntypedFormArray) {
    let defaultCounter = 0;
    if (statuses.controls.length > 0) {
      Object.keys(statuses.controls).forEach((key) => {
        // @ts-ignore
        const control = statuses.controls[key].controls;
        if (control.is_active.value === true) {
          defaultCounter++;
        }
      });
    }
    return (defaultCounter <= 0 && statuses.controls.length > 0) ||
      defaultCounter === 0
      ? { atLeastOneActive: true }
      : null;
  };
}
