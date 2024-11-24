import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { AlertsApiService } from 'src/app/generals-services/alerts-api.service';
import { AppStateService } from 'src/app/stateManagement/appState.service';
import { ITeam } from 'src/app/_models/ITeam.interface';
import { Staff } from 'src/app/_models/team';
import { RFDTest } from 'src/app/_models/test';
import { PhysiotherapyService } from 'src/app/_services/fisiotherapy.service';
import { TeamService } from 'src/app/_services/team.service';
import { TestService } from 'src/app/_services/test.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'player-evolution-dialog',
  templateUrl: './player-evolution-dialog.component.html',
  styleUrls: ['./player-evolution-dialog.component.scss'],
})
export class PlayerEvolutionDialogComponent implements OnInit {
  step: number = 1;
  @Input() visible: boolean = false;
  @Input() test: RFDTest;
  @Input() testDetails: any;
  @Input() player_id: string | null;
  @Input() file_id: any;

  @Output() close = new EventEmitter<boolean>();
  @Output() resetDetails = new EventEmitter<boolean>();
  questions: any;
  currentQuestion: number = 0;
  valueBar: number = 0;
  answers: any = {};
  loadingPhase: boolean = false;
  urlBase = environment.images;
  subs = new Subscription();
  team: ITeam;
  staff: Staff[];
  selectedStaff: number;

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
    private teamService: TeamService,
    private appStateService: AppStateService,
    private msg: AlertsApiService,
    private physiotherapyService: PhysiotherapyService
  ) {}

  ngOnInit(): void {
    this.team = this.appStateService.getTeam();

    this.getStaff();

    if (this.testDetails.previous_application)
      this.loadPrevioudAnswers(this.testDetails.previous_application);
  }

  closeDialog() {
    // this.advancedDialog = false
    this.close.emit(false);
  }

  /**
   * load previous answers
   */
  loadPrevioudAnswers(previous_application: { answers: any[] }): void {
    let answers: any = null;

    this.test.question_test.forEach((question_test) => {
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
   * get staff
   */
  getStaff(): void {
    this.subs = this.teamService
      .getStaffByTeam(this.team.id as unknown as string)
      .subscribe((res) => {
        if (res.success) {
          this.staff = res.data;
          this.selectedStaff = this.staff[0].id;
        }
      });
  }

  /**
   * submit test
   */
  submit(): void {
    this.loadingPhase = true;

    const data = {
      test_id: this.test.id,
      applicable_id: this.file_id,
      answers: Object.values(this.answers).map((item: any) => ({
        id: parseInt(item.id),
        text: item.text,
      })),
      date_application: moment(new Date()).format('YYYY-MM-DD'),
      player_id: this.player_id,
      professional_directs_id: this.selectedStaff,
    };

    this.subs = this.physiotherapyService
      .storeTest(data, this.team.id)
      .subscribe(
        (res) => {
          this.close.emit(true);
          this.msg.succes(res.message);
          this.resetDetails.emit(true);
        },
        ({ error }) => {
          this.msg.error(error);
        }
      );
  }
}
