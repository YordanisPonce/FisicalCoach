import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import { EffortRecoveryService } from 'src/app/_services/effort-recovery.service';
import { PlayersService } from 'src/app/_services/players.service';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { environment } from 'src/environments/environment';
import { AlertsApiService } from 'src/app/generals-services/alerts-api.service';

@Component({
  selector: 'effort-questions-dialog',
  templateUrl: './effort-questions-dialog.component.html',
  styleUrls: ['./effort-questions-dialog.component.scss'],
})
export class EffortQuestionsDialogComponent implements OnInit {
  constructor(
    private effortRecoveryService: EffortRecoveryService,
    private playersService: PlayersService,
    private formBuilder: UntypedFormBuilder,
    private msg: AlertsApiService
  ) {}

  private strategyValidators = [];

  newProgramForm = this.formBuilder.group({
    has_strategy: [false, Validators.required],
    effort_recovery_strategy_ids: ['', this.strategyValidators],
  });

  newQuestionnaireForm = this.formBuilder.group({
    question1: ['', Validators.required],
    question2: ['', Validators.required],
    question3: ['', Validators.required],
    question4: ['', Validators.required],
    question5: ['', Validators.required],
  });

  step: number = 0;
  @Input() visible: boolean = false;
  advancedDialog: boolean = true;
  @Input() playerId: any = null;
  @Input() teamId: string = '';
  @Input() recoveryProgram: string;
  @Input() editingProgram: any;

  @Output() close = new EventEmitter<boolean>();
  @Output() created = new EventEmitter<boolean>();
  @Output() resetPlayer = new EventEmitter<boolean>();

  loading: boolean = false;
  startedTest: boolean = false;
  value: number = 20;
  questionnaire: any = [];
  faces: string[] = [
    '1_red_face.svg',
    '2_orange_face.svg',
    '3_yellow_face.svg',
    '4_Blue_face.svg',
    '5_green_face.svg',
  ];

  players: any = [];
  effortRecoveryStrategies: any = [];

  urlImages = environment.images;
  girlAlumnImage: string = this.urlImages + 'images/alumn/alumna.svg';
  boyAlumnImage: string = this.urlImages + 'images/alumn/alumno.svg';

  get newProgramControls() {
    return this.newProgramForm.controls;
  }

  closeDialog() {
    this.close.emit(false);
    this.startedTest = false;
    this.step = 0;
    this.newQuestionnaireForm.reset();
    this.newProgramForm.reset();
    this.value = 20;
  }

  validateField(form: UntypedFormGroup, field: string) {
    return form.get(field)?.invalid;
  }

  validateStepFields(form: UntypedFormGroup, fields: string[]) {
    // let fields=['name','sport_id']
    let invalidFields: boolean = false;
    fields.forEach((field) => {
      if (this.validateField(form, field)) {
        invalidFields = true;
        form.get(field)?.markAsTouched({ onlySelf: true });
      }
    });
    if (invalidFields) return true;
  }

  validateStep() {
    let fields = [];
    switch (this.step) {
      case 1:
        fields = ['question1'];
        if (!this.validateStepFields(this.newQuestionnaireForm, fields))
          this.nextQuestion();
        break;
      case 2:
        fields = ['question2'];
        if (!this.validateStepFields(this.newQuestionnaireForm, fields))
          this.nextQuestion();
        break;
      case 3:
        fields = ['question3'];
        if (!this.validateStepFields(this.newQuestionnaireForm, fields))
          this.nextQuestion();
        break;
      case 4:
        fields = ['question4'];
        if (!this.validateStepFields(this.newQuestionnaireForm, fields))
          this.nextQuestion();
        break;
      case 5:
        fields = ['question5'];
        if (!this.validateStepFields(this.newQuestionnaireForm, fields)) {
          // this.onSubmit()
        }
        break;
      default:
        break;
    }
  }

  prevQuestion() {
    this.step = this.step - 1;
    this.value = this.value - 100 / this.questionnaire.length;
  }

  nextQuestion() {
    this.step += 1;
    this.value += 100 / this.questionnaire.length;
  }

  editRecoveryProgram(data: object, playerId: string) {
    this.effortRecoveryService
      .editProgram(data, playerId, this.recoveryProgram)
      .subscribe((res: any) => {
        // this.advancedDialog = true;
        this.startedTest = true;
        this.step = 1;
        this.loading = false;
        // this.recoveryProgram = res.data.id;
        this.created.emit(true);
      });
  }

  createRecoveryProgram(data: object, playerId: string) {
    this.effortRecoveryService
      .createNewProgram(data, playerId)
      .subscribe((res: any) => {
        // this.advancedDialog = true;
        this.startedTest = true;
        this.step = 1;
        this.loading = false;
        this.recoveryProgram = res.data.id;
        this.created.emit(true);
      });
  }

  saveRecoveryProgram() {
    if (
      !this.validateStepFields(this.newProgramForm, [
        'effort_recovery_strategy_ids',
        'has_strategy',
      ])
    ) {
      this.loading = true;
      const data = this.newProgramForm.value;
      const player_id = this.playerId;
      if (this.editingProgram) {
        this.editRecoveryProgram(data, player_id);
      } else {
        this.createRecoveryProgram(data, player_id);
      }
    }
  }

  createTest(data: any) {
    this.effortRecoveryService
      .createRecoveryTest(data, String(this.recoveryProgram))
      .subscribe(
        (res: any) => {
          this.msg.succes(res.message);
          this.resetPlayer.emit(true);
          this.closeDialog();
          this.recoveryProgram = '';
        },
        ({ error }) => {
          this.loading = false;
          this.msg.error(error);
        }
      );
  }

  editTest(data: any) {
    if (this.editingProgram.latest_questionnaire_history === null) {
      this.createTest(data);
    } else {
      this.effortRecoveryService
        .editRecoveryTest(
          data,
          this.recoveryProgram,
          this.editingProgram.latest_questionnaire_history.id
        )
        .subscribe(
          (res: any) => {
            this.msg.succes(res.message);
            this.created.emit(true);
            this.closeDialog();
            this.recoveryProgram = '';
          },
          ({ error }) => {
            this.loading = false;
            this.msg.error(error);
          }
        );
    }
  }

  saveTest() {
    this.loading = true;
    const data: any = {
      answer_items: [],
    };
    let answers = Object.values(this.newQuestionnaireForm.value);
    answers = answers.map((el: any) => {
      return el.id;
    });
    data.answer_items = answers;
    if (this.editingProgram) {
      this.editTest(data);
    } else {
      this.createTest(data);
    }
  }

  ngOnInit(): void {
    this.playersService
      .getPlayerListByTeam(this.teamId)
      .subscribe((data: any) => {
        this.players = data.data;
      });

    this.effortRecoveryService
      .getEffortRecoveryStrategies()
      .subscribe((data: any) => {
        this.effortRecoveryStrategies = data.data;
      });

    this.effortRecoveryService
      .getQuestionnaireQuestions()
      .subscribe((data: any) => {
        this.questionnaire = data.data;
        this.questionnaire.map((element: any, index: number) => {
          return element.items.map(
            (option: any, index: number) => (option.icon = this.faces[index])
          );
        });

        if (this.editingProgram) {
          let program = this.editingProgram;
          let strategies = program.strategies.map(
            (strategy: any) => strategy.id
          );

          if (program.has_strategy) {
            this.newProgramForm.patchValue({
              has_strategy: program.has_strategy,
              effort_recovery_strategy_ids: strategies,
            });
          } else {
            this.newProgramForm.get('has_strategy')!.setValue(false);
          }

          let answers = program.latest_questionnaire_history?.answers;
          if (answers != null && answers.length > 0) {
            const SELECTED_ANSWERS: object[] = [];
            answers.forEach((answer: any, index: number) => {
              SELECTED_ANSWERS.push(
                this.questionnaire[index]?.items.find(
                  (item: any) => item.charge_level === answer.charge_level
                )
              );
            });
            this.newQuestionnaireForm.patchValue({
              question1: SELECTED_ANSWERS[0],
              question2: SELECTED_ANSWERS[1],
              question3: SELECTED_ANSWERS[2],
              question4: SELECTED_ANSWERS[3],
              question5: SELECTED_ANSWERS[4],
            });
          }
        } else {
          this.newProgramForm.get('has_strategy')!.setValue(false);
        }
      });

    this.newProgramForm.get('has_strategy')!.valueChanges.subscribe((value) => {
      if (value) {
        this.newProgramForm
          .get('effort_recovery_strategy_ids')!
          .setValidators(Validators.required);
        this.newProgramForm
          .get('effort_recovery_strategy_ids')!
          .updateValueAndValidity({ onlySelf: false, emitEvent: false });
        this.newProgramForm.get('effort_recovery_strategy_ids')?.enable();
      } else {
        this.newProgramForm
          .get('effort_recovery_strategy_ids')!
          .setValidators(this.strategyValidators);
        this.newProgramForm.get('effort_recovery_strategy_ids')!.setValue([]);
        this.newProgramForm.get('effort_recovery_strategy_ids')?.disable();
      }
    });
  }
}
