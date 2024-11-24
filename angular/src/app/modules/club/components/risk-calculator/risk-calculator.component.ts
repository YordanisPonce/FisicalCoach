import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CalculatorService } from 'src/app/_services/calculator.service';
import { TranslateService } from '@ngx-translate/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import FieldsValidation from 'src/app/utils/FieldsValidation';
import { resourcesUrl } from 'src/app/utils/resources';

@Component({
  selector: 'risk-calculator',
  templateUrl: './risk-calculator.component.html',
  styleUrls: ['./risk-calculator.component.scss'],
})
export class RiskCalculatorComponent implements OnInit {
  constructor(
    private calculatorService: CalculatorService,
    private translate: TranslateService,
    private formBuilder: UntypedFormBuilder
  ) {}

  @Input() visible: boolean = false;
  @Input() entityId: number | null;
  @Output() close = new EventEmitter<boolean>();
  @Output() calculated = new EventEmitter<boolean>();
  @Output() rankResult = new EventEmitter<any>();

  validation = new FieldsValidation();

  submittedForm: boolean = false;

  loading: boolean = false;

  step: number = 0;

  answers: any = [];
  resources = resourcesUrl;

  calculatorForm = this.formBuilder.group({
    item2: ['', Validators.required],
    item3: ['', Validators.required],
    item4: ['', Validators.required],
    item5: ['', Validators.required],
    item6: ['', Validators.required],
    item7: ['', Validators.required],
    item8: ['', Validators.required],
    item9: ['', Validators.required],
    item10: ['', Validators.required],
    item11: ['', Validators.required],
  });

  calculatorOptions: any = [];

  role: 'teacher' | 'sport' = 'sport';

  selectOption(event: any) {
    // console.warn(event)
  }

  validateStep() {
    // console.log('hola')
    // console.log(this.calculatorForm.value)
    let fields = [];
    switch (this.step) {
      case 0:
        this.step = this.step + 1;
        break;
      case 1:
        fields = ['item2', 'item3', 'item4', 'item5', 'item6'];
        if (!this.validation.validateStepFields(fields, this.calculatorForm))
          this.step = this.step + 1;
        break;
      case 2:
        fields = ['item7', 'item8', 'item9', 'item10', 'item11'];
        if (!this.validation.validateStepFields(fields, this.calculatorForm)) {
          this.onSubmit();
        }
        break;
      default:
        break;
    }
  }

  onSubmit() {
    this.submittedForm = true;
    if (this.calculatorForm.invalid) {
      return;
    } else {
      this.loading = true;

      const DATA: any = {
        entity: this.role === 'teacher' ? 'alumn' : 'player',
        entity_id: this.entityId,
        answers: [],
      };

      let answers = Object.values(this.calculatorForm.value).map((obj: any) => {
        let answer = {
          item_id: obj.calculator_item_id,
          option_id: obj.id,
        };
        return answer;
      });

      DATA.answers = answers;

      this.calculatorService.calculate(DATA).subscribe((res) => {
        this.calculatorForm.reset();
        // this.step = 4
        this.closeDialog();
        this.calculated.emit(true);
        this.rankResult.emit(res.data);
        this.loading = this.submittedForm = false;
      });
    }
  }

  closeDialog() {
    this.close.emit(false);
    this.step = 0;
  }

  ngOnInit(): void {
    this.role = localStorage.getItem('role') as 'teacher' | 'sport';
    this.calculatorService.getCalculatorOptions().subscribe((data: any) => {
      // console.log(data)
      this.calculatorOptions = data.data;
    });
  }
}
