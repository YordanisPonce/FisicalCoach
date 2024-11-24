import {
  Component,
  OnInit,
  Output,
  Input,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { AlertsApiService } from 'src/app/generals-services/alerts-api.service';
import { AppStateService } from 'src/app/stateManagement/appState.service';
import { ITeam } from 'src/app/_models/ITeam.interface';
import { Player } from 'src/app/_models/player';
import { Staff } from 'src/app/_models/team';
import {
  QuestionTest,
  Test,
  TestSubType,
  TestType,
  Unit,
} from 'src/app/_models/test';
import { TeamService } from 'src/app/_services/team.service';
import { TestService } from 'src/app/_services/test.service';
import { environment } from 'src/environments/environment';
import { isEmpty } from 'lodash';

interface City {
  name: string;
  code: string;
}

@Component({
  selector: 'app-test-dialog',
  templateUrl: './test-dialog.component.html',
  styleUrls: ['./test-dialog.component.scss'],
})
export class TestDialogComponent implements OnInit, OnDestroy {
  subs = new Subscription();
  step: number = 1;
  @Input() visible: boolean = false;
  @Input() playersList: Player[] = [];
  @Input() selectedPlayerList: Player[] = [];
  @Input() test: TestType;
  @Output() close = new EventEmitter<boolean>();
  @Output() resetPlayerList = new EventEmitter<boolean>();
  @Output() sendSelectedPlayers = new EventEmitter<Player[]>();
  staff: Staff[] = [];
  team: ITeam;
  cities: City[];
  selectedCity!: any;
  testList: Test[] | TestSubType[] = [];
  testTypeList: TestType[] = [];
  selectedTest: Partial<Test> | null;
  selectedTestType: Partial<TestType> | null;
  loadingTypes: boolean = false;
  loadingTests: boolean = false;
  loadingStartTest: boolean = false;
  showTestSubTypeDialog: boolean = false;
  unitList: Unit[] = [];
  selectedUnit: Unit;
  loadingTestApplication: boolean = false;
  urlBase = environment.images;
  isLargeQuestion: boolean = false;
  isExtraLargeQuestion: boolean = false;

  questionTest: QuestionTest[] = [];
  previousQuestionsTest: QuestionTest[] = [];
  questions: any = {};
  previousQuestions: any = {};
  previousValidations: any = {};
  validateQuestionFields: any[] = [];
  questionCategories: { name: string; position: number }[] = [];

  testSubTypeList: TestSubType[] = [];
  selectedSubTypeList: TestSubType[] = [];
  selectedSubType: TestSubType[] = [];
  selectedSubTypeText: Partial<TestSubType> | null;
  subtypeList: string[] = [
    'physical_condition',
    'motor_skills',
    'physical_exploration',
  ];
  unitResult: string = '';

  currentPlayer: Player;
  currentPlayerNumber: number = 0;
  resultList: any;
  applicationDate = new Date();
  selectedStaff: number = 0;
  selectedMeassure: any = '';
  role: string;

  testForm = new UntypedFormGroup({});

  responsiveOptions = [
    {
      breakpoint: '3000px',
      numVisible: 3,
      numScroll: 3,
    },
    {
      breakpoint: '1200px',
      numVisible: 2,
      numScroll: 2,
    },
    {
      breakpoint: '768px',
      numVisible: 2,
      numScroll: 2,
    },
    {
      breakpoint: '600px',
      numVisible: 1,
      numScroll: 1,
    },
  ];

  players: boolean = false;

  constructor(
    private testService: TestService,
    private msg: AlertsApiService,
    private teamService: TeamService,
    private appStateService: AppStateService,
    private translate: TranslateService
  ) {}

  closeDialog() {
    this.close.emit(false);
    if (this.step === 5) {
      this.resetPlayerList.emit(true);
    }
    this.step = 1;
    this.loadingTestApplication = false;
    this.selectedStaff = this.staff[0].id;
    this.selectedTestType = null;
    this.selectedTest = null;
    if (this.selectedMeassure) {
      this.selectedMeassure = null;
    }
  }

  ngOnInit(): void {
    this.role = localStorage.getItem('role') as string;
    this.team = this.appStateService.getTeam();
    this.getTestTypeList();
    this.getTestSubTypeList();
    this.getStaff();
    this.getTestUnit();
  }

  /**
   * get staff
   */
  getStaff(): void {
    this.subs = this.teamService
      .getStaffByTeam(this.team.id as unknown as string)
      .subscribe((res) => {
        if (res.success) {
          this.staff = res.data;
          this.selectedStaff = res.data[0].id;
        }
      });
  }

  /**
   * get test list
   */
  getTestsByType(type: string): void {
    this.loadingTests = true;
    this.subs = this.testService.getTestsByType(type).subscribe(
      (res) => {
        if (res.success) {
          this.testList = res.data;
        }
        this.loadingTests = false;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  /**
   * get test list by subtype
   */
  getTestsBySubType(subType: TestSubType[]): void {
    this.testList = subType;
    this.step = 2;
  }

  /**
   * get test types
   */
  getTestTypeList(): void {
    this.loadingTypes = true;
    this.subs = this.testService.getTestTypeList('test').subscribe(
      (res) => {
        if (res.success) {
          this.testTypeList = res.data;
        }
        this.loadingTypes = false;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  /**
   * get test sub types
   */
  getTestSubTypeList(): void {
    this.loadingTypes = true;
    this.subs = this.testService.getTestSubTypeList().subscribe(
      (res) => {
        if (res.success) {
          this.testSubTypeList = res.data;
        }
        this.loadingTypes = false;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  /**
   * select test
   * @param test
   */
  selectTest(test: Test): void {
    this.selectedTest = test;
  }

  /**
   * selecte test type
   */
  selectType(type: TestType): void {
    this.selectedTestType = type;
    if (this.testSubTypeList.length > 0) {
      const subTypeList = this.testSubTypeList.filter(
        (subType) => subType?.test_type_id === this.selectedTestType?.id
      );
      if (subTypeList.length > 0) {
        this.selectedSubTypeList = subTypeList;
        this.showTestSubTypeDialog = true;
      } else {
        this.selectedSubTypeText = null;
        this.getTestsByType(this.selectedTestType.code as string);
      }
    }
  }

  /**
   * get test unit
   */
  getTestUnit(): void {
    this.subs = this.testService.getTestUnit().subscribe((res) => {
      if (res.success) {
        this.unitList = res.data;
        this.selectedUnit = res.data[0];
      }
    });
  }

  /**
   * select sub type test
   */
  selectSubTpe(): void {
    this.getTestsBySubType(this.selectedSubType);
    this.step = 2;
  }

  /**
   * start test
   */
  startTest(): void {
    if (this.step === 2 && this.selectedTest) {
      this.loadingStartTest = true;
      this.subs = this.testService
        .showTest(this.selectedTest.code as string)
        .subscribe(
          (res) => {
            if (res.success) {
              this.step = 3;
              let questions: any;
              let questionsTest: any[] = [];
              let previousQuestions: any[] = [];
              let previousQuestionsTest: any[] = [];
              /** questions for all players */
              previousQuestionsTest = res.data.question_test.filter(
                (item: QuestionTest) => item.question?.is_configuration_question
              );
              this.previousQuestionsTest = previousQuestionsTest.map(
                (item) => ({
                  ...item,
                  responses: item.responses.map((response: any) => ({
                    label: response.name,
                    value: {
                      id: item.id,
                      value: response.question_responses_id,
                      color: response.color,
                      image: response.image,
                      label: response.name,
                    },
                  })),
                })
              );
              this.previousQuestionsTest.forEach((test) => {
                previousQuestions = {
                  ...previousQuestions,
                  [test.responses[0]?.value?.id]: test.question.required
                    ? {
                        required: test.question.required,
                      }
                    : '',
                };
              });
              this.previousQuestions = previousQuestions;
              this.previousValidations = previousQuestions;
              /** questions that each player must select */
              questionsTest = res.data.question_test.filter(
                (item: QuestionTest) =>
                  !item.question?.is_configuration_question
              );
              this.questionTest = questionsTest.map((item) => ({
                ...item,
                responses: item.responses.map((response: any) => ({
                  label: response.name,
                  value: {
                    id: item.id,
                    value: response.question_responses_id,
                    color: response.color,
                    image: response.image,
                    label: response.name,
                  },
                })),
              }));

              const questionCategories = this.questionTest
                .map((item, i) => {
                  return {
                    name: item.question.question_category?.name || '',
                    position: i,
                  };
                })
                .filter((item) => item.name);

              this.questionCategories = questionCategories;

              this.isLargeQuestion = this.questionTest.some(
                (item) =>
                  item.question.name.length > 17 &&
                  item.question.name.length < 26
              );

              this.isExtraLargeQuestion = this.questionTest.some(
                (item) => item.question.name.length >= 26
              );

              this.questionTest.forEach((test) => {
                questions = {
                  ...questions,
                  [test.responses[0]?.value?.id]: test.question.required
                    ? {
                        required: test.question.required,
                      }
                    : '',
                };
              });

              this.questions = questions;

              const unit = this.questionTest.filter(
                (item) => item.question.unit
              )[0]?.question?.unit?.abbreviation;

              this.unitResult = unit ? `(${unit})` : '';
            }

            this.loadingStartTest = false;
          },
          ({ error }) => {
            this.msg.error(error);
            this.loadingStartTest = true;
          }
        );
    }
  }

  /**
   * check categories
   */
  checkCategoryPosition(
    questionCategories: { name: string; position: number }[],
    index: number
  ): { name: string; position: number } {
    const findCategory = questionCategories.find(
      (item) => item.position === index
    );

    if (!!findCategory) {
      return findCategory;
    }
    return { name: '', position: 0 };
  }

  /**
   * get previous question values
   */
  handleQuestions(event: any, type: string): void {
    if (type === 'previous') {
      this.validateQuestionType(this.previousQuestions, event);
    } else {
      this.validateQuestionType(this.questions, event);
    }
  }

  /**
   * validate question type
   *
   */
  validateQuestionType(questions: any, event: any): any {
    if (event.type === 'select') {
      questions[event.questionId] = {
        id: event.questionResponseId,
        type: event.type,
        questionId: event.questionId,
        required: event.required,
      };
    } else {
      questions[event.questionId] = {
        id: event.questionResponseId,
        text: event.text,
        type: event.type,
        required: event.required,
      };
    }
  }

  /**
   * validate each field
   */
  validateRequiredFields(questions: any[]): boolean {
    let validations = Object.assign(questions);

    this.validateQuestionFields = Object.entries(validations)
      .filter((item: any) => item[1]?.required)
      .map((item: any, i) => {
        if (
          (item[1]?.required && !item[1]?.hasOwnProperty('id')) ||
          (item[1]?.hasOwnProperty('text') &&
            (item[1]?.text === '' || !item[1]?.text))
        ) {
          return { id: item[0], required: true };
        } else {
          return { id: item[0], required: false };
        }
      });

    return this.validateQuestionFields.some((item) => item.required);
  }

  addTest(): any {
    let answers = {};

    answers = new Object({ ...this.previousQuestions, ...this.questions });

    answers = Object.entries(answers)
      .filter((item) => !isEmpty(item[1]))
      .map((item: any) => {
        if (item[1].type === 'select') {
          return { ...item[1] };
        } else {
          return { ...item[1] };
        }
      });

    this.loadingTestApplication = true;

    const testData = {
      test_id: this.selectedTest?.id,
      entity_name: 'test',
      date_application: moment(this.applicationDate).format(
        'YYYY-MM-DD HH:mm:ss'
      ),
      player_id:
        this.role === 'sport'
          ? this.selectedPlayerList[this.currentPlayerNumber].id
          : undefined,
      alumn_id:
        this.role === 'teacher'
          ? this.selectedPlayerList[this.currentPlayerNumber].id
          : undefined,
      professional_directs_id: this.selectedStaff,
      answers,
      team_id: this.team.id,
    };

    if (!testData.alumn_id) {
      delete testData.alumn_id;
    }
    if (!testData.player_id) {
      delete testData.player_id;
    }

    this.subs = this.testService.storeTest(testData).subscribe(
      (res) => {
        // apply test for one player and close the modal
        this.resultList = res.data;
        this.step = 5;

        this.msg.succes(res.message);
        this.loadingTestApplication = false;
      },
      ({ error }) => {
        console.log(error);
        this.msg.error(error);

        this.loadingTestApplication = false;
      }
    );
  }

  /**
   * handle player selection
   */
  handleNextPlayer(): void {
    this.step = this.step - 1;

    if (this.selectedPlayerList.length === 1) {
      this.selectedPlayerList = [];
    }

    // apply test for one player in the list, change the array position after applying test for the current player
    if (this.selectedPlayerList.length > 1) {
      this.selectedPlayerList = this.selectedPlayerList.filter(
        (player) =>
          player.id !== this.selectedPlayerList[this.currentPlayerNumber].id
      );

      if (this.currentPlayerNumber === this.selectedPlayerList.length) {
        this.currentPlayerNumber = this.selectedPlayerList.length - 1;
      }

      this.questions = [];
    }
  }

  refreshList(): void {
    this.closeDialog();
    this.selectedMeassure = null;
    this.resetPlayerList.emit(true);
  }

  /**
   * get selected players from modal
   */
  getPlayersFromModal(e: any): void {
    this.selectedPlayerList = e;
  }

  /**
   * get meassurement
   */
  selectMeassurement(text: string): void {
    const replaceText = text.split(' ');

    this.selectedMeassure = replaceText[1];
  }

  ngOnDestroy(): void {
    if (this.subs) {
      this.subs.unsubscribe();
    }
  }
}
