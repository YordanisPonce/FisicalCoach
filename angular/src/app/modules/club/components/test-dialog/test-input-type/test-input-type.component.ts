import { Component, Input, EventEmitter, OnInit, Output } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-test-input-type',
  templateUrl: './test-input-type.component.html',
  styleUrls: ['./test-input-type.component.scss'],
})
export class TestInputTypeComponent implements OnInit {
  @Input() type: string;
  @Input() isConfig: boolean = false;
  @Input() name: string;
  @Input() id: string;
  @Input() required: boolean;
  @Input() meassurement: string;
  @Input() responseList: any;
  @Input() question: any;
  // @Input() inputValue: any;
  @Output() model: EventEmitter<any> = new EventEmitter<any>();
  @Output() selectedMeassureOuput: EventEmitter<string> =
    new EventEmitter<string>();

  meassurementList = [
    'Sistema de medición',
    'Sistema métrico (balón medicinal)',
  ];
  inputValue: any;

  constructor() {}

  ngOnInit(): void {

    console.log(this.responseList)

    const question = this.question;

    if (question?.id) {
      switch (question?.type) {
        case 'select':
          this.inputValue = { id: question.questionId, value: question.id };
          break;
        case 'date':
          const utcHours = moment.utc(question.text).get('hours');
          const utcTime = moment(question.text).set('hours', utcHours).toDate();

          this.inputValue = utcTime;
          break;
        case 'text':
          this.inputValue = question.text;
          break;
        default:
          this.inputValue = '';
          break;
      }
    }
  }

  handleInput(type: string, e: any, name?: string, event?: any): any {
    if (e < 0) {
      this.inputValue = 0;
      return;
    }

    switch (type) {
      case 'select':
        this.model.emit({
          questionId: e.id,
          questionResponseId: e.value,
          type,
          required: this.required,
        });
        break;
      case 'date':
        this.model.emit({
          questionId: this.responseList[0]?.value?.id,
          questionResponseId: this.responseList[0]?.value?.value,
          text: moment(e).format('YYYY-MM-DD'),
          type,
          required: this.required,
        });
        break;
      case 'text':
        this.model.emit({
          questionId: this.responseList[0]?.value?.id,
          questionResponseId: this.responseList[0]?.value?.value,
          text: e,
          type,
          required: this.required,
        });
        break;
      case 'number':
        this.model.emit({
          questionId: this.responseList[0]?.value?.id,
          questionResponseId: this.responseList[0]?.value?.value,
          text: e,
          type,
          required: this.required,
        });
        break;
      case 'textarea':
        this.model.emit({
          questionId: this.responseList[0]?.value?.id,
          questionResponseId: this.responseList[0]?.value?.value,
          text: e,
          type,
        });
        break;
      default:
        break;
    }

    if (name && this.meassurementList.includes(name)) {
      this.selectedMeassureOuput.emit(event?.originalEvent.target.outerText);
    }
  }
}
