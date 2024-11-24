import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';

import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { AlertsApiService } from 'src/app/generals-services/alerts-api.service';
import { AppStateService } from 'src/app/stateManagement/appState.service';
import { InjuryPhase } from 'src/app/_models/injury';
import { ITeam } from 'src/app/_models/ITeam.interface';
import { Staff } from 'src/app/_models/team';
import { RFDTest } from 'src/app/_models/test';
import { InjuryService } from 'src/app/_services/injury.service';
import { TeamService } from 'src/app/_services/team.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'stage-dialog',
  templateUrl: './stage-dialog.component.html',
  styleUrls: ['./stage-dialog.component.scss'],
})
export class StageDialogComponent implements OnInit, OnDestroy {
  step: number = 1;
  @Input() visible: boolean = false;
  @Input() phaseDetail: InjuryPhase;
  @Input() phaseTest: RFDTest;
  @Input() phaseIndex: number = 0;
  @Input() loadingClosedPhase: boolean = false;
  @Output() close = new EventEmitter<boolean>();
  @Output() refreshPhases = new EventEmitter<boolean>();
  @Output() closePhase = new EventEmitter<boolean>();
  currentQuestion: number = 0;
  valueBar: number = 0;
  value: number = 0;
  subs = new Subscription();
  loadingTest: boolean = false;
  loadingPhase: boolean = false;
  loadingSummary: boolean = false;
  showLoading: boolean = false;
  hasPreviousAnswers: boolean = false;
  answers: any = {};
  multipleResponseList: any[] = [];
  selectedMultiResponse: any[] = [];
  previousResponses: any[] = [];
  team: ITeam;
  staff: Staff[] = [];
  questionCategoryCodes: string[];
  valorationReadaptationPhase: {
    question_test: { code: any; question: any; responses: any[] }[];
  } = { question_test: [] };
  category_questions: string[] = [
    'valoration_readaptation',
    'valoration_retraining',
  ];
  selectedStaff: number = 0;
  urlBase = environment.images;
  openSummaryDialog: any;
  testPassed: boolean = false;
  showTestPassedDialog: boolean = false;
  resources = environment.images + 'images';
  value2: number = 30;

  selectedValues: string[] = [];
  options: any = [
    {
      label: 'Muy mal',
      value: 'val1',
      selected: false,
    },
    {
      label: 'Mal',
      value: 'val2',
      selected: false,
    },
    {
      label: 'Regular',
      value: 'val3',
      selected: false,
    },
    {
      label: 'Bien',
      value: 'val4',
      selected: false,
    },
    {
      label: 'Muy bien',
      value: 'val5',
      selected: false,
    },
  ];

  constructor(
    private injuryService: InjuryService,
    private teamService: TeamService,
    private appStateservice: AppStateService,
    private msg: AlertsApiService
  ) {}

  closeDialog() {
    // this.advancedDialog = false
    this.step = 1;
    this.close.emit(false);
    this.multipleResponseList = [];
    this.phaseTest = null as any;
    this.showTestPassedDialog = false;
  }

  ngOnInit(): void {
    this.team = this.appStateservice.getTeam();
    this.getStaff();

    if (this.loadingClosedPhase)
      this.getPhaseDetailTest(this.phaseDetail.code, true);
  }

  /**
   * get staff
   */
  getStaff(): void {
    this.loadingSummary = true;
    this.subs = this.teamService
      .getStaffByTeam(this.team.id as unknown as string)
      .subscribe((res) => {
        if (res.success) {
          this.staff = res.data;
          this.getExistingStaff();
        }
      });
  }

  /**
   * get staff for existing phase
   */
  getExistingStaff(): void {
    this.subs = this.injuryService
      .getRfdDetailForTest(this.phaseDetail.code)
      .subscribe((res) => {
        const test = res.data;

        if (test.previous_application) {
          this.selectedStaff =
            test.previous_application?.professional_directs_id;
          this.hasPreviousAnswers = true;
        } else {
          this.selectedStaff = this.staff[0].id;
          this.hasPreviousAnswers = false;
        }
        this.loadingSummary = false;
      });
  }

  /**
   * calculate percentage color
   */
  getPhaseLevel(value: string): { color: string; text: string } {
    const parseValue = parseInt(value);
    const parseMinValue = 60;

    return {
      color:
        parseValue >= 84.6
          ? '#00E9C5'
          : parseValue >= parseMinValue
          ? '#E9C200'
          : '#EF5115',
      text:
        parseValue >= 84.6
          ? 'user_phase_passed'
          : parseValue >= parseMinValue
          ? 'user_phase_almost_passed'
          : 'user_phase_not_passed',
    };
  }

  /**
   * get test questions
   * @param code
   */
  getPhaseDetailTest(code: string, isSummary: boolean = false): void {
    this.loadingTest = true;
    this.showLoading = isSummary;

    this.subs = this.injuryService
      .getRfdDetailForTest(code)
      .subscribe((res) => {
        this.phaseTest = res.data;

        if (this.category_questions.includes(this.phaseTest.code)) {
          this.questionCategoryCodes = [
            ...new Set(
              this.phaseTest.question_test.map(
                (item) => item.question.question_category_code
              )
            ),
          ];

          let categoryList: any = {};

          this.questionCategoryCodes.forEach((category) => {
            this.phaseTest.question_test.forEach((test) => {
              if (test.question.question_category?.code === category) {
                const phaseQuestion = {
                  name: test.question.question_category.name,
                };

                let phaseResponses = this.phaseTest.question_test
                  .filter(
                    (item) => item.question.question_category?.code === category
                  )
                  .map((item) => item.responses)
                  .map((item) => item[0]);

                categoryList[category] = phaseResponses;

                this.valorationReadaptationPhase.question_test = [
                  ...new Set(this.valorationReadaptationPhase.question_test),
                  {
                    question: phaseQuestion,
                    responses: categoryList[category],
                    code: test.id,
                  },
                ];
              }
            });
          });

          this.valorationReadaptationPhase.question_test =
            this.valorationReadaptationPhase.question_test.filter(
              (value, index, self) => {
                return (
                  index ===
                  self.findIndex((t) => t.question.name === value.question.name)
                );
              }
            );
        }

        if (this.phaseTest.previous_application) {
          this.loadPrevioudAnswers(
            this.phaseTest.previous_application,
            this.category_questions.includes(this.phaseTest.code)
          );
        }

        this.loadingTest = false;
        this.showLoading = false;

        if (isSummary) {
          this.openSummaryDialog = true;
        } else {
          this.step = 2;
        }
      });
  }

  /**
   * go to phase answers from summary dialog
   */
  handlePhasefromSummary(): void {
    this.step = 2;
    this.openSummaryDialog = false;
  }

  /**
   * load previous answers
   */
  loadPrevioudAnswers(
    previous_application: { answers: any[] },
    isCategoryQuestion: boolean
  ): void {
    let answers: any = null;

    if (!isCategoryQuestion) {
      this.phaseTest.question_test.forEach((question_test) => {
        const responses = question_test.responses;

        responses.forEach(
          (response: { question_responses_id: any; value: string }) => {
            previous_application.answers.map((answer) => {
              if (
                answer.question_responses_id === response.question_responses_id
              ) {
                answers = {
                  [question_test.code]: {
                    id: answer.question_responses_id,
                    text: answer.text_response,
                    responseId: response.value,
                  },
                };

                this.answers = Object.assign(this.answers, answers);
              }
            });
          }
        );
      });
    } else {
      this.multipleResponseList = previous_application.answers.map(
        (answer) => `${answer.question_responses_id}`
      );

      previous_application.answers.map((answer) => {
        answers = {
          [answer.question_responses_id]: {
            id: answer.question_responses_id,
            text: answer.response,
          },
        };

        this.answers = Object.assign(this.answers, answers);
      });
    }
  }

  /**
   * validate selected answer
   */
  handleSelectedAnswer(
    e: any,
    code: string,
    questionResponseId: number,
    text: string,
    fieldType: string
  ): void {
    let answers: any = null;
    if (fieldType === 'alphanumber') {
      answers = {
        [code]: {
          id: questionResponseId,
          text,
          responseId: e,
        },
      };

      this.answers = Object.assign(this.answers, answers);
    }
    if (fieldType === 'checkbox') {
      if (this.answers[questionResponseId]?.id === questionResponseId) {
        delete this.answers[questionResponseId];
      } else {
        answers = {
          [questionResponseId]: {
            id: questionResponseId,
            text,
          },
        };
      }

      this.answers = Object.assign(this.answers, answers);
    }
  }

  /**
   * select all checkbox answers
   */
  handleSelectAllAnswers(): void {
    let responses: any = {};

    console.log(this.multipleResponseList);
    this.valorationReadaptationPhase.question_test.forEach((question) => {
      question.responses.forEach((response) => {
        responses = {
          ...responses,

          [response.question_responses_id]: {
            id: response.question_responses_id,
            text: response.name,
          },
        };

        this.multipleResponseList = [
          ...this.multipleResponseList,
          `${response.question_responses_id}`,
        ];
      });
    });

    this.answers = Object.assign(this.answers, responses);
  }

  /**
   * submit answers
   */
  submit(): void {
    this.loadingPhase = true;

    const data = {
      professional_directs_id: this.selectedStaff,
      test_passed: null,
      not_pain: true,
      answers: Object.values(this.answers).map((item: any) => ({
        id: parseInt(item.id),
        text: item.text,
        unit_id: null,
      })),
      date_application: moment(new Date()).format('YYYY-MM-DD'),
    };

    this.subs = this.injuryService
      .evaluatePhase(this.phaseDetail.code, data)
      .subscribe(
        (res) => {
          this.testPassed = res.data.data.phase_passed;

          this.showTestPassedDialog = true;
          this.refreshPhases.emit(true);
          this.loadingPhase = false;

          this.currentQuestion = 0;
        },
        ({ error }) => {
          this.msg.error(error);
          this.loadingPhase = false;
        }
      );
  }

  /**
   * parse percentaje
   */
  parsePercentaje(percentaje: string): string {
    return parseInt(percentaje).toFixed(0);
  }

  /**
   * calculate percentage color
   */
  getPercentageColor(value: string): string {
    const parseValue = parseInt(value);
    const parseMinValue = 60;

    if (this.phaseIndex === 0) {
      return parseValue >= 40
        ? '#00E9C5'
        : parseValue >= 35
        ? '#E9C200'
        : '#EF5115';
    }

    return parseValue >= 84.6
      ? '#00E9C5'
      : parseValue >= parseMinValue
      ? '#E9C200'
      : '#EF5115';
  }

  /**
   * validate evolution phase
   */
  isEvolutionPhase(): boolean {
    return this.phaseDetail.phase?.test_code === 'valoration_psychological';
  }

  /**
   * close dialog
   */
  closeSummaryDialog(): void {
    if (this.loadingClosedPhase) {
      this.closeDialog();
    }
    this.openSummaryDialog = false;
  }

  ngOnDestroy(): void {
    if (this.subs) this.subs.unsubscribe();
  }
}
