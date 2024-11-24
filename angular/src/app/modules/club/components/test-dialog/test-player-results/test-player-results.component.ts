import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { isPlainObject, isArray } from 'lodash';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-test-player-results',
  templateUrl: './test-player-results.component.html',
  styleUrls: ['./test-player-results.component.scss'],
})
export class TestPlayerResultsComponent implements OnInit {
  @Input() results: any;
  @Input() selectedMeassure: string;
  @Input() questions: any;

  resultType: string;
  resultList: any[] | any = [];
  formula: any[] | any = [];
  basicData: any;
  basicOptions: any;
  best_score: boolean = false;
  new_best_score: boolean = false;
  diff: string;
  configuationQuestions: any[] = [];
  nonConfiguationQuestions: any[] = [];
  resources = environment.images + 'images';

  constructor(private translateService: TranslateService) {}

  ngOnInit(): void {
    this.basicOptions = {
      plugins: {
        legend: {
          labels: {
            color: '#495057',
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: '#495057',
          },
          grid: {
            color: '#ebedef',
          },
        },
        y: {
          ticks: {
            color: '#495057',
          },
          grid: {
            color: '#ebedef',
          },
        },
        yAxes: [
          {
            display: true,
            ticks: {
              max: 120,
              min: 0,
              stepSize: 20,
              beginAtZero: true,
              padding: 10,
            },
          },
        ],
      },
    };

    this.resultType = this.results.type;

    switch (this.resultType) {
      case 'weight':
        this.resultList = this.results.value;

        this.getNonConfigurationQuestionsList(this.results.answers);

        this.basicData = {
          labels: [this.translateService.instant(`test.${this.resultType}`)],
          datasets: [
            {
              label: 'Test anterior',
              backgroundColor: '#0065E9',
              data: [this.resultList.previous_result],
            },
            {
              label: 'Test actual',
              backgroundColor: '#00e9c5',
              data: [this.resultList.result],
            },
          ],
        };

        break;

      case 'new_score':
        this.resultList = this.results.value;
        this.best_score = this.resultList.new_best_score;
        const previousResult: any[] = Object.entries(
          this.resultList.previous_result
        ).slice(-1);
        this.new_best_score = this.resultList.new_best_score;

        this.getAllQuestions(this.results.answers);

        if (this.results.formulas.length > 0)
          this.formula = this.results.formulas;

        this.resultList.previous_result =
          previousResult.length > 0 ? previousResult[0][1]?.result : 'N/A';
        this.resultList.diff =
          previousResult.length > 0 ? previousResult[0][1]?.diff : 'N/A';
        this.resultList.previous_date =
          previousResult.length > 0 ? previousResult[0][1]?.date : '+';

        this.basicData = {
          labels: [this.translateService.instant(`test.${this.resultType}`)],
          datasets: [
            {
              label: 'Test anterior',
              backgroundColor: '#0065E9',
              data: [
                previousResult.length > 0 ? previousResult[0][1].result : 0,
              ],
            },
            {
              label: 'Test actual',
              backgroundColor: '#00e9c5',
              data: [this.resultList.result],
            },
          ],
        };

        break;

      case 'measurement':
        this.resultList = Object.values(this.results.value);

        this.getNonConfigurationQuestionsList(this.results.answers);

        const labels = this.resultList.map((item: any) => item.answer_name);
        const previousValues = this.resultList.map(
          (item: any) => item.previous_answer_value
        );
        const currentValues = this.resultList.map(
          (item: any) => item.answer_value
        );

        this.basicData = {
          labels: [...labels],
          datasets: [
            {
              label: 'Test anterior',
              backgroundColor: '#0065E9',
              data: [...previousValues],
            },
            {
              label: 'Test actual',
              backgroundColor: '#00e9c5',
              data: [...currentValues],
            },
          ],
        };

        break;
      case 'average_item':
        this.resultList = Object.values(this.results.value)
          .filter((item: any) => item.question !== 'Observaciones')
          .map((item: any) => ({
            ...item,
            answer_value: item.best,
          }));

        this.getAllQuestions(this.results.answers);

        const averageLabels = this.resultList.map((item: any) => item.question);
        const averagePreviousValues = this.resultList.map(
          (item: any) => item.previous_answer_value
        );
        const averageCurrentValues = this.resultList.map(
          (item: any) => item.answer_value
        );

        this.basicData = {
          labels: [...averageLabels],
          datasets: [
            {
              label: 'Test anterior',
              backgroundColor: '#0065E9',
              data: [...averagePreviousValues],
            },
            {
              label: 'Test actual',
              backgroundColor: '#00e9c5',
              data: [...averageCurrentValues],
            },
          ],
        };

        break;

      case 'symmetric_difference':
        this.resultList = Object.values(this.results.value);

        this.getNonConfigurationQuestionsList(this.results.answers);

        const SymmetricDiffLabels = this.resultList.map(
          (item: any) => item.name
        );

        const SymmetricDiffPreviousValues = this.resultList.map(
          (item: any) => item.best_left
        );

        const SymmetricDiffCurrentValues = this.resultList.map(
          (item: any) => item.best_right
        );

        this.basicData = {
          labels: [...SymmetricDiffLabels],
          datasets: [
            {
              label: 'Izquierda',
              backgroundColor: '#0065E9',
              data: [...SymmetricDiffPreviousValues],
            },
            {
              label: 'Derecha',
              backgroundColor: '#00e9c5',
              data: [...SymmetricDiffCurrentValues],
            },
          ],
        };

        break;

      case 'average_symmetric':
        this.resultList = this.results.value;

        this.getAllQuestions(this.results.answers);

        break;

      case 'qualitative':
        this.resultList = this.results.value;

        this.resultList.previous_result =
          this.resultList.previous_result.filter(
            (item: { cal_value: boolean }) => item.cal_value
          );

        this.resultList.result = this.resultList.result.filter(
          (item: { cal_value: boolean }) => item.cal_value
        );

        break;

      default:
        break;
    }
  }

  getAllQuestions(answers: any[]): void {
    this.nonConfiguationQuestions = answers
      .filter(
        (item: { question_responses: { cal_value: any } }) =>
          item.question_responses.cal_value
      )
      .map((item: { question_responses: any }) => item);

    this.configuationQuestions = answers
      .filter(
        (item: { question_responses: { cal_value: any } }) =>
          !item.question_responses.cal_value
      )
      .map((item: { question_responses: any }) => item);
  }

  getNonConfigurationQuestionsList(answers: any[]): void {
    this.nonConfiguationQuestions = answers
      .filter(
        (item: {
          is_configuration_question: boolean;
          question_responses: { cal_value: any };
        }) =>
          item.is_configuration_question ||
          (!item.is_configuration_question &&
            !item.question_responses.cal_value)
      )
      .map((item: { question_responses: any }) => item);
  }

  /**
   * check the type of the result
   * @param type
   * @returns
   */
  checkTestType(type: any): any {
    if (isPlainObject(type)) {
      return 'object';
    } else if (isArray(type)) {
      return 'array';
    } else {
      return null;
    }
  }
}
