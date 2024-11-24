import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import moment from 'moment';
import { Subscription } from 'rxjs';
import { AlertsApiService } from 'src/app/generals-services/alerts-api.service';
import { Player } from 'src/app/_models/player';
import { TestService } from 'src/app/_services/test.service';
import { TrainingSessionService } from 'src/app/_services/training.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-cardiac-frecuency-dialog',
  templateUrl: './cardiac-frecuency-dialog.component.html',
  styleUrls: ['./cardiac-frecuency-dialog.component.scss'],
})
export class CardiacFrecuencyDialogComponent implements OnInit, OnDestroy {
  @Input() visible: boolean = false;
  @Input() sessionCode: string;
  @Input() sessionId: number;
  @Input() testType: string;
  @Input() user_id: number;
  @Input() selectedPlayers: Player[] = [];
  @Output() close = new EventEmitter<boolean>();
  @Output() refreshPlayers = new EventEmitter<boolean>();

  subs = new Subscription();
  answers: any = {};
  testFields: any[] = [];
  isValid: any[] = [];
  form: UntypedFormGroup;
  loadingTest: boolean = false;
  loading: boolean = false;
  testDetails: any;
  role: string = '';
  selectedValues: string[] = [];
  currentPlayerNumber: number = 0;

  constructor(
    private msg: AlertsApiService,
    private testService: TestService,
    private formBuilder: UntypedFormBuilder,
    private trainingService: TrainingSessionService,
    private translateService: TranslateService
  ) {}

  closeDialog() {
    this.close.emit(false);
  }

  ngOnInit(): void {
    this.role = localStorage.getItem('role') as string;
    this.loadingTest = true;
    this.subs = this.testService.showTest(this.testType).subscribe((res) => {
      this.testDetails = res.data;

      this.getTestData(res.data.question_test);
    });
  }

  /**
   * get player test info
   */
  getTestData(question_test: any): void {
    this.subs = this.trainingService
      .getSessionTestData(
        this.sessionId,
        this.testType === 'exercise_session_frecuency_cardiac'
          ? 'frecuency_cardiac'
          : 'gps',
        this.user_id
      )
      .subscribe(
        (res) => {
          const previousAnswers: any[] =
            res.data?.previous_application?.answers;

          const testQuestions: any[] = res.data?.question_test;

          let questions: any[] = question_test;

          if (previousAnswers?.length > 0) {
            const list = previousAnswers.map((asnwer) => {
              const currentQuestion =
                asnwer?.question_responses?.question_test?.question;

              const name = currentQuestion?.name;

              const field_type = currentQuestion?.field_type;

              const unit = testQuestions.find(
                (item) => item.question.unit_id === currentQuestion?.unit_id
              )?.question?.unit?.abbreviation;

              const responses = [
                {
                  question_responses_id: asnwer.question_responses_id,
                  text_response: asnwer?.text_response || '',
                },
              ];

              return {
                question: {
                  name,
                  field_type,
                  unit: {
                    abbreviation: unit ?? '',
                  },
                },
                responses,
              };
            });

            questions = list;
          }

          this.loadForm(questions);
        },
        ({ error }) => {
          this.msg.error(error);
        }
      );
  }

  loadForm(data: any[]): void {
    let formData: any;

    data.forEach((test) => {
      formData = {
        ...formData,
        [test.responses[0].question_responses_id]: [
          test.responses[0]?.text_response || '',
          null,
        ],
      };
    });

    this.form = this.formBuilder.group(formData);

    this.testFields = data.map((test) => ({
      id: test.responses[0].question_responses_id.toString(),
      name: test.question.name,
      field_type: test.question.field_type,
      unit: test.question.unit.abbreviation,
    }));

    this.loadingTest = false;
  }

  /**
   * validate selected answer
   */
  handleSelectedAnswer(
    code: string,
    id: number,
    value: boolean,
    index: number
  ): void {
    let answers: any = null;

    if (this.answers[code]?.id === id) {
      delete this.answers[code];
    } else {
      answers = {
        [code]: {
          id,
          value,
        },
      };
    }

    this.answers = Object.assign(this.answers, answers);
    this.isValid[index] = !this.isValid[index];
  }

  /**
   * validate finish button
   */
  checkValidation(): boolean {
    return this.isValid.every((item) => item);
  }

  /**
   * handle next player carousel
   */
  handleNextCarousel(currentPlayerNumber: number): any {
    if (currentPlayerNumber < this.selectedPlayers.length - 1) {
      this.currentPlayerNumber = this.currentPlayerNumber + 1;

      const selected = this.selectedPlayers[this.currentPlayerNumber];
    } else {
      return null;
    }
  }

  /**
   * handle previous player carousel
   */
  handlePreviousCarousel(currentPlayerNumber: number): void {
    if (currentPlayerNumber > 0) {
      this.currentPlayerNumber = this.currentPlayerNumber - 1;
      const selected = this.selectedPlayers[this.currentPlayerNumber];
    }
  }

  /**
   * submit answers
   */
  submit(): void {
    this.loading = true;

    const data = {
      test_id: this.testDetails.id,
      applicable_id: this.sessionId,
      answers: Object.entries(this.form.value).map((item: any) => ({
        id: parseInt(item[0]),
        text: item[1],
      })),
      date_application: moment(new Date()).format('YYYY-MM-DD'),
      [this.role === 'sport' ? 'player_id' : 'alumn_id']:
        this.selectedPlayers.length > 0
          ? this.selectedPlayers[this.currentPlayerNumber].id
          : this.user_id,
      test_name:
        this.testType === 'exercise_session_frecuency_cardiac'
          ? 'frecuency_cardiac'
          : 'gps',
    };

    this.trainingService.createHearFrecuencyTest(data, this.testType).subscribe(
      (res) => {
        const message =
          this.testType === 'exercise_session_frecuency_cardiac'
            ? 'fcMessage'
            : 'gpsMessage';

        const translateMessage = this.translateService.instant(
          `training_session.${message}`
        );

        this.msg.succes(translateMessage);

        if (this.selectedPlayers.length > 0) {
          this.handleSelectedPlayers();
          this.form.reset();
        } else {
          this.handleSelectedPlayers();
          this.close.emit(true);
        }
        this.loading = false;
      },
      ({ error }) => {
        this.msg.error(error);
        this.loading = false;
      }
    );
  }

  handleSelectedPlayers(): void {
    this.selectedPlayers = this.selectedPlayers.filter(
      (player) =>
        player.id !== this.selectedPlayers[this.currentPlayerNumber].id
    );

    if (this.currentPlayerNumber === this.selectedPlayers.length) {
      this.currentPlayerNumber = this.selectedPlayers.length - 1;
    }

    if (this.selectedPlayers.length === 0) {
      this.close.emit(true);
      this.refreshPlayers.emit(true);
    }
  }

  ngOnDestroy(): void {
    if (this.subs) this.subs.unsubscribe();
  }
}
