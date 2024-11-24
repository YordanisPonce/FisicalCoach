import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { Criterias, InjuryPhase } from 'src/app/_models/injury';
import { PlayerRDFInjury } from 'src/app/_models/player';
import { InjuryService } from 'src/app/_services/injury.service';
import { environment } from 'src/environments/environment';
import { ITeam } from 'src/app/_models/ITeam.interface';
import { AppStateService } from 'src/app/stateManagement/appState.service';

@Component({
  selector: 'app-reeducacion-rfd',
  templateUrl: './reeducacion-rfd.component.html',
  styleUrls: ['./reeducacion-rfd.component.scss'],
})
export class ReeducacionRfdComponent implements OnInit, OnDestroy {
  evolucionPsicologica: boolean = false;
  stageProgress: boolean = false;
  phaseDetails: boolean = false;
  loadingPhases: boolean = false;
  loading: boolean = false;
  loadingPhase: boolean = false;
  closeRfdDialog: boolean = false;
  dailyWorkModal: boolean = false;
  dailyWorkDay: string;
  showRfdInfoModal: boolean = false;
  psychological: {
    code: string;
    percentage_complete: string;
    previous_application: any;
    phase_passed: boolean;
  } = {
    code: '',
    percentage_complete: '0',
    previous_application: '',
    phase_passed: false,
  };
  player_rfd: PlayerRDFInjury;
  playerInjuryDate = new Date();
  selectedDates: any[] = [new Date()];
  dailyControls: any[] = [];
  selectedDailyWork: any;
  sub = new Subscription();
  phase: InjuryPhase;
  rdf_code: string;
  phaseStep: number = 0;
  criterias: Criterias[] = [];
  AllphasesPassed: boolean = false;
  phaseIndex: number = 0;
  resources = environment.images + 'images';
  team: ITeam;

  constructor(
    private injuryService: InjuryService,
    private route: ActivatedRoute,
    private appStateService: AppStateService
  ) {}

  ngOnInit(): void {
    this.team = this.appStateService.getTeam();
    this.rdf_code = this.route.snapshot.paramMap.get('rdf_code') as string;
    this.getPlayerInjuryById(this.rdf_code as string);
    this.dailyWorklist();
  }

  /**
   * get player rf injury by id
   */
  getPlayerInjuryById(code: string = ''): void {
    this.loadingPhases = true;
    this.sub = this.injuryService
      .showRfdInjury(code as string, this.team.id)
      .subscribe((res) => {
        let psychological: InjuryPhase;
        let phases: InjuryPhase;
        psychological = res.data.phase_details.find(
          (item: any) => item.phase.code === 'psychological'
        );
        if (psychological) {
          this.psychological = psychological;
        }
        phases = res.data.phase_details.filter(
          (item: any) => item.phase.code !== 'psychological'
        );
        res.data.phase_details = phases;
        this.player_rfd = res.data;

        this.AllphasesPassed = this.player_rfd.phase_details.every(
          (phase: any) => phase.phase_passed
        );
        this.playerInjuryDate = new Date(res.data.injury?.injury_date);
        this.criterias = res.data.criterias;
        this.loadingPhases = false;
      });
  }

  /**
   * get phase details for test
   */
  getPhaseDetailsForTest(
    code: string,
    phase: InjuryPhase | any,
    index: number
  ): void {
    if (this.player_rfd.closed) {
      this.loadingPhase = true;
      this.stageProgress = true;
      this.phase = phase;

      this.phase.percentage_complete =
        this.phase.percentage_complete === '0'
          ? 0
          : (+this.phase.percentage_complete * 1).toFixed(0);
      this.phaseIndex = index;
    } else {
      this.stageProgress = true;
      this.phase = phase;

      this.phase.percentage_complete =
        this.phase.percentage_complete === '0'
          ? 0
          : (+this.phase.percentage_complete * 1).toFixed(0);

      this.phaseIndex = index;
    }
  }

  /**
   * get daily work List
   */
  dailyWorklist(): void {
    this.sub = this.injuryService
      .showDailyWork(this.rdf_code)
      .subscribe((res) => {
        const data = res.data;
        if (data.length > 0) {
          this.selectedDates = data.map((date: any) => {
            const utc = new Date(moment(date.day).format('MM-DD-YYYY'));
            return utc;
          });
          this.dailyControls = res.data;
        }
      });
  }

  /**
   * calculate percentage color
   */
  getPercentageColor(value: string, psychological: boolean = false): string {
    const parseValue = parseInt(value);
    const parseMinValue = 60;
    const psychologicalMinValue = 35;

    if (psychological) {
      return parseValue >= 40
        ? '#00E9C5'
        : parseValue >= psychologicalMinValue
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
   * calculate psycological phase
   * @param value
   * @returns
   */
  getPsychologicalPhaseLevel(value: string): string {
    const parseValue = parseInt(value);
    const parseMinValue = 35;

    return parseValue >= 40
      ? 'user_questionarie_passed'
      : parseValue >= parseMinValue
      ? 'user_questionarie_almost_passed'
      : 'user_questionarie_not_passed';
  }

  /**
   * calculate percentage color
   */
  getPhaseLevel(value: string): { color: string; text: string; icon: string } {
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
      icon:
        parseValue >= 84.6
          ? '/check.svg'
          : parseValue >= parseMinValue
          ? '/cronometro.svg'
          : '/relojarena.svg',
    };
  }

  /**
   * Validate if phase is avaiable to test
   */
  validatePhase(phase_passed: boolean, index: number): boolean {
    if (phase_passed) {
      this.phaseStep = index + 1;
    }

    if (
      phase_passed ||
      (!phase_passed && index === this.phaseStep) ||
      index === 0
    ) {
      return false;
    }

    return true;
  }

  /**
   * calculate dates
   */
  calculateDiff(rfdDate: string = ''): any {
    const currentDate = moment();

    if (!rfdDate) {
      return '';
    }

    return `${currentDate.diff(moment(rfdDate), 'days')} `;
  }

  /**
   * Validate if phase is avaiable to test
   */
  validatePhaseText(phase_passed: boolean, index: number): boolean {
    if (phase_passed) {
      this.phaseStep = index + 1;
    }

    if (!phase_passed && this.phaseStep === 0) {
      return false;
    }

    if (phase_passed || (!phase_passed && index === this.phaseStep)) {
      return true;
    }
    return false;
  }

  /**
   * refresh calendar daily work
   */
  refreshCalendar(): void {
    this.dailyWorklist();
  }

  /**
   * refresh injury phases
   */
  refreshInjuryPhases(): void {
    this.getPlayerInjuryById(this.rdf_code);
  }

  /**
   * parse percentaje
   */
  parsePercentaje(percentaje: string): string {
    return parseInt(percentaje).toFixed(0);
  }

  /**
   * click calendar day
   * @param event
   */
  calendarDay(event: any): void {
    this.dailyWorkDay = moment(event).format('YYYY-MM-DD');
    this.dailyWorkModal = true;
    let selected = null;

    if (this.dailyControls.length > 0) {
      selected = this.dailyControls.find(
        (control) => control.day === this.dailyWorkDay
      );

      if (selected) {
        this.selectedDailyWork = selected;
      }
    }
  }

  /**
   * close RFD Injury
   */
  closeRFD(code: string): void {
    this.closeRfdDialog = true;
  }

  /**
   * close stage dialog
   */
  closeDialog(): void {
    this.stageProgress = false;
    this.closeRfdDialog = false;
    this.dailyWorkModal = false;
    this.selectedDailyWork = null;
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}
