import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AlertsApiService } from 'src/app/generals-services/alerts-api.service';
import { Criterias } from 'src/app/_models/injury';
import { InjuryService } from 'src/app/_services/injury.service';
import { ITeam } from 'src/app/_models/ITeam.interface';
import { AppStateService } from 'src/app/stateManagement/appState.service';

@Component({
  selector: 'app-finish-rfd-dialog',
  templateUrl: './finish-rfd-dialog.component.html',
  styleUrls: ['./finish-rfd-dialog.component.scss'],
})
export class FinishRfdDialogComponent implements OnInit, OnDestroy {
  step: number = 1;
  @Input() visible: boolean = false;
  @Input() criterias: Criterias[];
  @Input() rdf_code: string;
  @Output() close = new EventEmitter<boolean>();
  @Output() refreshPhases = new EventEmitter<boolean>();
  subs = new Subscription();
  answers: any = {};
  multipleResponseList: any[] = [];
  isValid: any[] = [];
  loading: boolean = false;
  team: ITeam;

  selectedValues: string[] = [];

  constructor(
    private msg: AlertsApiService,
    private appStateService: AppStateService,
    private injuryService: InjuryService,
    private router: Router
  ) {}

  closeDialog() {
    this.step = 1;
    this.close.emit(false);
    this.multipleResponseList = [];
  }

  ngOnInit(): void {
    this.team = this.appStateService.getTeam();

    this.multipleResponseList = this.criterias.map((criteria) => ({
      id: criteria.id,
      value: false,
    }));

    this.isValid = Object.values(this.multipleResponseList).map(
      (item: any) => item.value
    );
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
   * submit answers
   */
  submit(): void {
    this.loading = true;

    const data = {
      criterias: Object.values(this.answers).map((item: any) => ({
        id: parseInt(item.id),
        value: item.value,
      })),
      team_id: this.team.id,
    };

    this.subs = this.injuryService.updateRfd(this.rdf_code, data).subscribe(
      (res) => {
        if (res.success) {
          this.injuryService.closeRfd(this.rdf_code).subscribe(
            (res) => {
              if (res.success) {
                this.msg.succes(res.message);

                setTimeout(() => {
                  this.router.navigate(['/club/rfd-injuries']);
                }, 3500);
              }
              this.loading = false;
              this.closeDialog();
              this.refreshPhases.emit(true);
            },
            ({ error }) => {
              this.msg.error(error);
              this.loading = false;
            }
          );
        }
      },
      ({ error }) => {
        this.msg.error(error);
        this.loading = false;
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
  getPercentageColor(value: string, minValue: string): string {
    const parseValue = parseInt(value);
    const parseMinValue = parseInt(minValue);

    return parseValue >= 90
      ? '#6CDE74'
      : parseValue >= parseMinValue
      ? '#E9C200'
      : '#EF5115';
  }

  ngOnDestroy(): void {
    if (this.subs) this.subs.unsubscribe();
  }
}
