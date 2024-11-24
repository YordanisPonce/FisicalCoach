import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SelectItem } from '../../../../../../../_models/selectItem';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ComponentBaseClass } from '../../componentBase.class';

@Component({
  selector: 'app-surgery',
  templateUrl: './surgery.component.html',
  styleUrls: ['./surgery.component.scss']
})
export class SurgeryComponent extends ComponentBaseClass implements OnInit, AfterViewInit {

  @Output() next: EventEmitter<any> = new EventEmitter<any>();
  formulario: UntypedFormGroup;
  listJobArea: SelectItem[] = [];
  listGender: SelectItem[] = [];
  submitted!: boolean;
  yearRange: string;
  disabledForm!: boolean;
  data: any;

  constructor(private formBuilder: UntypedFormBuilder,
    private cdRef: ChangeDetectorRef) {
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
    if (value)
    {
      this.formulario.reset();
    }
  }

  @Input() minDate:Date

  ngOnInit(): void {
    this.yearRange = '1900:' + new Date().getFullYear();
    this.loadForm(this.data);
  }

  loadForm(data?: any) {
    this.formulario = this.formBuilder.group({
      surgery_date: [data ? data.surgery_date : null],
      medical_center_name: [data ? data.medical_center_name : null],
      surgeon_name: [data ? data.surgeon_name : null],
      surgery_extra_info: [data ? data.surgery_extra_info : null],
    });
  }

  onSubmit() {
    this.submitted = true;
  }

  validateForm(): boolean {
    if (!this.disabledForm)
    {
      this.submitted = true;
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
