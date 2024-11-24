import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import {
  DowngradePlan,
  PackageAttribute,
  SportCodes,
  Subpackage,
} from 'src/app/_models/user';
import { UsersService } from 'src/app/_services/users.service';
import { AlertsApiService } from 'src/app/generals-services/alerts-api.service';
import { ProfieService } from '../../profile-services/profie.service';
import { AppStateService } from 'src/app/stateManagement/appState.service';
import { ConfirmationService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';

type listProps = {
  total: number;
  clubs: any[];
};

@Component({
  selector: 'app-downgrade-plan-dialog',
  templateUrl: './downgrade-plan-dialog.component.html',
  styleUrls: ['./downgrade-plan-dialog.component.scss'],
})
export class DowngradePlanDialogComponent implements OnInit, OnDestroy {
  @Input() visible: boolean;
  @Input() packageAttributes: PackageAttribute[];
  @Input() currentPackage: string;
  @Input() packageDetails: any;
  @Input() selectedPackage: Subpackage;
  @Input() intervalType: string;
  @Output() close: EventEmitter<boolean> = new EventEmitter<boolean>();

  subs = new Subscription();
  step: number = 0;
  teamData: any;
  teamList: listProps = { clubs: [], total: 0 };
  competitionList: listProps = { clubs: [], total: 0 };
  playerList: listProps = { clubs: [], total: 0 };
  sessionList: listProps = { clubs: [], total: 0 };
  testList: listProps = { clubs: [], total: 0 };
  injuryPreventionList: listProps = { clubs: [], total: 0 };
  rfdList: listProps = { clubs: [], total: 0 };
  physiotherapyList: listProps = { clubs: [], total: 0 };
  effortRecoveryList: listProps = { clubs: [], total: 0 };
  nutritionList: listProps = { clubs: [], total: 0 };
  psychologyList: listProps = { clubs: [], total: 0 };

  selectedTeams: number[];
  selectedCompetition: number[];
  selectedPlayer: number[];
  selectedSession: number[];
  selectedTest: number[];
  selectedInjuryPrevention: number[];
  selectedRfd: number[];
  selectedNutrition: number[];
  selectedPhysiotherapy: number[];
  selectedPsychology: number[];
  selectedRecoveryExtension: number[];

  planData: DowngradePlan = {
    interval: '',
    package_price_id: 0,
    type: '',
    sport: {
      teams: [],
      matches: [],
      exercises: [],
      training_sessions: [],
      players: [],
      tests: [],
      injury_prevention: [],
      rfd_injuries: [],
      fisiotherapy: [],
      recovery_exertion: [],
      nutrition: [],
      psychology_reports: [],
    },
  };

  attributeQuantity: number = 0;
  currentTotalQuantity: number = 0;
  currentCode: SportCodes;
  showData: boolean = false;

  loading: boolean = false;
  loadingSubmit: boolean = false;
  locale: string;

  constructor(
    private userservice: UsersService,
    private msg: AlertsApiService,
    public profileService: ProfieService,
    private appStateService: AppStateService,
    private confirmationService: ConfirmationService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.getTeams();
    this.locale = localStorage.getItem('languaje') as string;
  }

  /**
   * select attributes
   */
  handleSelectAttributesData(code: SportCodes, id: number): void {
    let list: number[] = [];

    if (this.planData?.sport[code].includes(id)) {
      list = this.planData.sport[code].filter((item) => item !== id);
    } else {
      list = [...new Set(this.planData.sport[code]), id];
    }

    this.planData = {
      ...this.planData,
      sport: {
        ...this.planData.sport,
        [code]: list,
      },
    };
  }

  /**
   * move directly to the previous step with data
   * @param code
   * @param list
   * @param step
   */
  handleBackStep(backCode: SportCodes): void {
    let finalStep: number = 0;
    let finalCode: SportCodes = 'psychology_reports';
    let enableFinalStep: boolean = true;

    this.attributeQuantity = this.getPlanQuantity(
      this.currentCode === 'tests' ? 'test' : this.currentCode
    );

    const data: {
      list: listProps;
      step: number;
      code: SportCodes;
    }[] = [
      { list: this.nutritionList, step: 9, code: 'nutrition' },
      { list: this.effortRecoveryList, step: 8, code: 'recovery_exertion' },
      { list: this.physiotherapyList, step: 7, code: 'fisiotherapy' },
      { list: this.rfdList, step: 6, code: 'rfd_injuries' },
      { list: this.injuryPreventionList, step: 5, code: 'injury_prevention' },
      { list: this.testList, step: 4, code: 'tests' },
      { list: this.sessionList, step: 3, code: 'training_sessions' },
      { list: this.competitionList, step: 2, code: 'matches' },
      { list: this.playerList, step: 1, code: 'players' },
      { list: this.teamList, step: 0, code: 'teams' },
    ];

    for (let index = 0; index < data.length; index++) {
      const quantity = this.getPlanQuantity(
        data[index].code === 'tests' ? 'test' : data[index].code
      );

      // if (
      //   data[index].list.clubs.length > 0 &&
      //   data[index].list.total > quantity
      // ) {
      //   finalStep = data[index].step;
      //   finalCode = data[index].code;

      //   this.attributeQuantity = this.getPlanQuantity(
      //     data[index].code === 'tests' ? 'test' : data[index].code
      //   );

      //   this.currentTotalQuantity = data[index].list.total;

      //   this.showData = true;

      //   break;
      // }
      // this.attributeQuantity = this.getPlanQuantity(
      //   data[index].code === 'tests' ? 'test' : data[index].code
      // );

      // this.currentTotalQuantity = data[index].list.total;

      // if (data[index].list.clubs.length > 0 && backCode === data[index].code) {
      //   this.showData = true;
      //   this.step -= 1;
      //   break;
      // } else {
      //   this.step -= 1;
      //   this.showData = false;
      //   break
      // }
    }

    const findPreviousStep = data.find((item) => item.code === backCode);

    this.attributeQuantity = this.getPlanQuantity(
      backCode === 'tests' ? 'test' : backCode
    );

    console.log(this.attributeQuantity);
    console.log(findPreviousStep);

    if ((findPreviousStep?.list?.total as number) <= this.attributeQuantity) {
      this.showData = false;
    } else {
      this.showData = true;
    }

    this.step > 0 && (this.step = this.step - 1);

    if (this.step >= 0) this.currentCode = backCode as SportCodes;
  }

  /**
   * @param isBack
   * @param code
   * @param callback
   */
  handleStepCase(
    isBack: boolean,
    code: SportCodes | null,
    callback: () => void
  ): void {
    if (isBack) {
      this.handleBackStep(code as SportCodes);
    } else {
      callback.bind(this)();
    }
  }

  /**
   * handle step calls
   */
  handleSteps(
    isBack: boolean = false,
    showConfirmDialog: boolean = false
  ): void {
    if (this.step > 11) return;

    switch (this.step) {
      case 0:
        this.handleStepCase(isBack, 'teams', this.getPlayers);

        break;

      case 1:
        this.handleStepCase(isBack, 'teams', this.getMatches);

        break;

      case 2:
        this.handleStepCase(isBack, 'players', this.getSessions);
        break;

      case 3:
        this.handleStepCase(isBack, 'matches', this.getTests);

        break;

      case 4:
        this.handleStepCase(
          isBack,
          'training_sessions',
          this.getUserInjuryPreventions
        );
        break;

      case 5:
        this.handleStepCase(isBack, 'tests', this.getUserRfds);
        break;

      case 6:
        this.handleStepCase(
          isBack,
          'injury_prevention',
          this.getUserPhysiotherapyTests
        );
        break;

      case 7:
        this.handleStepCase(
          isBack,
          'rfd_injuries',
          this.getUserEffortRecoveryReports
        );
        break;

      case 8:
        this.handleStepCase(
          isBack,
          'fisiotherapy',
          this.getUserNutritionSheets
        );
        break;

      case 9:
        this.handleStepCase(
          isBack,
          'recovery_exertion',
          this.getUserPsychologyReports
        );
        break;

      case 10:
        if (isBack) {
          this.handleStepCase(isBack, 'nutrition', () => {});
        } else {
          if (!showConfirmDialog) {
            this.confirm();
          }
        }

        break;

      default:
        break;
    }
  }

  /**
   * get step title translation
   */
  getTitleTranslation(code: string): string {
    return this.translateService.instant(`donwgrade_plan.${code}`);
  }

  /**
   * get step title translation
   */
  getSingularTranslation(type: 'male' | 'female'): string {
    if (localStorage.getItem('languaje') === 'es') {
      return type === 'male' ? 'los' : 'las';
    }

    return 'the';
  }

  /**
   *
   * @param step
   * @param isSingular
   * @param capitalize
   * @returns
   */

  getStepTitle(
    step: number,
    isSingular: boolean,
    isTitle: boolean = true
  ): string {
    switch (step) {
      case 0:
        return `${
          isSingular ? '' : this.getSingularTranslation('male')
        } ${this.getTitleTranslation(isTitle ? 'teams_title' : 'teams')}`;

      case 1:
        return `${
          isSingular ? '' : this.getSingularTranslation('male')
        }  ${this.getTitleTranslation(isTitle ? 'players_title' : 'players')}`;

      case 2:
        return `${
          isSingular ? '' : this.getSingularTranslation('male')
        } ${this.getTitleTranslation(isTitle ? 'matches_title' : 'matches')}`;

      case 3:
        return `${
          isSingular ? '' : this.getSingularTranslation('female')
        }  ${this.getTitleTranslation(
          isTitle ? 'training_sessions_title' : 'training_sessions'
        )}`;

      case 4:
        return `${
          isSingular ? '' : this.getSingularTranslation('male')
        }  ${this.getTitleTranslation(isTitle ? 'tests_title' : 'tests')}`;

      case 5:
        return `${
          isSingular ? '' : this.getSingularTranslation('female')
        } ${this.getTitleTranslation(
          isTitle ? 'injury_prevention_title' : 'injury_prevention'
        )}`;

      case 6:
        return `${
          isSingular ? '' : this.getSingularTranslation('male')
        }  ${this.getTitleTranslation(
          isTitle ? 'rfd_injuries_title' : 'rfd_injuries'
        )}`;

      case 7:
        return `${
          isSingular ? '' : this.getSingularTranslation('male')
        }  ${this.getTitleTranslation(
          isTitle ? 'physiotherapy_sheets_title' : 'physiotherapy_sheets'
        )}`;

      case 8:
        return `${
          isSingular ? '' : this.getSingularTranslation('male')
        } ${this.getTitleTranslation(
          isTitle ? 'effort_recovery_title' : 'effort_recovery'
        )}`;

      case 9:
        return `${
          isSingular ? '' : this.getSingularTranslation('female')
        }  ${this.getTitleTranslation(
          isTitle ? 'nutrition_title' : 'nutrition'
        )}`;

      case 10:
        return `${
          isSingular ? '' : this.getSingularTranslation('male')
        }  ${this.getTitleTranslation(
          isTitle ? 'psychology_title' : 'psychology'
        )}`;

      default:
        break;
    }

    return ' - ';
  }

  /**
   * get selected translation
   */
  getSelectedTranslation(type: 'male' | 'female'): string {
    if (localStorage.getItem('languaje') === 'es') {
      return type === 'male' ? 'seleccionados:' : 'seleccionadas:';
    }

    return 'Selected:';
  }

  getStepTitleByCode(step: number): string {
    switch (step) {
      case 0:
        return `${this.getTitleTranslation(
          'teams'
        )}  ${this.getSelectedTranslation('male')}`;

      case 1:
        return `${this.getTitleTranslation(
          'players'
        )}  ${this.getSelectedTranslation('male')}`;

      case 2:
        return `${this.getTitleTranslation(
          'matches'
        )}  ${this.getSelectedTranslation('male')}`;

      case 3:
        return `${this.getTitleTranslation(
          'training_sessions'
        )} ${this.getSelectedTranslation('female')}`;

      case 4:
        return `${this.getTitleTranslation(
          'tests'
        )} ${this.getSelectedTranslation('male')}`;

      case 5:
        return `${this.getTitleTranslation(
          'injury_prevention'
        )} ${this.getSelectedTranslation('male')}`;

      case 6:
        return `${this.getTitleTranslation(
          'rfd_injuries'
        )} ${this.getSelectedTranslation('male')}`;

      case 7:
        return `${this.getTitleTranslation(
          'physiotherapy_sheets'
        )} ${this.getSelectedTranslation('male')}`;

      case 8:
        return `${this.getTitleTranslation(
          'effort_recovery'
        )} ${this.getSelectedTranslation('male')}`;

      case 9:
        return `${this.getTitleTranslation(
          'nutrition'
        )} ${this.getSelectedTranslation('female')}`;

      case 10:
        return `${this.getTitleTranslation(
          'psychology'
        )} ${this.getSelectedTranslation('male')}`;

      default:
        break;
    }

    return ' - ';
  }

  handleFilters(type: 'recent' | 'latest' | '', list: number[]): number[] {
    if (!type) return list;

    if (type === 'latest') {
      list = list.slice(-this.getStepTotal());
    }

    if (type === 'recent') {
      list = list.slice(0, this.getStepTotal());
    }

    return list;
  }

  selectAllIds(type: 'recent' | 'latest' | ''): void {
    switch (this.step) {
      case 0:
        this.selectedTeams = this.teamList.clubs
          .map((club) => club.teams.map((team: { id: number }) => team.id))
          .reduce((acum, currentArray) => {
            return acum.concat(currentArray);
          }, []);

        this.selectedTeams = this.handleFilters(type, this.selectedTeams);

        this.planData.sport.teams = this.selectedTeams;

        break;

      case 1:
        this.selectedPlayer = this.playerList.clubs
          .map((club) =>
            club.teams
              .map((team: any) => team.players.map((player: any) => player.id))
              .reduce((acum: string | any[], currentArray: any) => {
                return acum.concat(currentArray);
              }, [])
          )
          .reduce((acum, currentArray) => {
            return acum.concat(currentArray);
          }, []);

        this.selectedPlayer = this.handleFilters(type, this.selectedPlayer);

        this.planData.sport.players = this.selectedPlayer;

        break;

      case 2:
        this.selectedCompetition = this.getListIds(
          this.competitionList.clubs,
          'matches',
          true,
          'competitions'
        );

        this.selectedCompetition = this.handleFilters(
          type,
          this.selectedCompetition
        );

        this.planData.sport.matches = this.selectedCompetition;

        break;

      case 3:
        this.selectedSession = this.sessionList.clubs
          .map((club: { teams: any[] }) =>
            club.teams
              .map((team: any) =>
                team.exercise_sessions.map((session: any) => session.id)
              )
              .reduce((acum, currentArray) => {
                return acum.concat(currentArray);
              }, [])
          )
          .reduce((acum, currentArray) => {
            return acum.concat(currentArray);
          }, []);

        this.selectedSession = this.handleFilters(type, this.selectedSession);

        this.planData.sport.training_sessions = this.selectedSession;

        break;

      case 4:
        this.selectedTest = this.getListIds(this.testList.clubs, 'tests', true);

        this.selectedTest = this.handleFilters(type, this.selectedTest);

        this.planData.sport.tests = this.selectedTest;

        break;

      case 5:
        this.selectedInjuryPrevention = this.getListIds(
          this.injuryPreventionList.clubs,
          'injuries_prevention',
          true
        );

        this.selectedInjuryPrevention = this.handleFilters(
          type,
          this.selectedInjuryPrevention
        );

        this.planData.sport.injury_prevention = this.selectedInjuryPrevention;

        break;

      case 6:
        this.selectedRfd = this.getListIds(
          this.rfdList.clubs,
          'injuries_rfd',
          true
        );

        this.selectedRfd = this.handleFilters(type, this.selectedRfd);

        this.planData.sport.rfd_injuries = this.selectedRfd;

        break;

      case 7:
        this.selectedPhysiotherapy = this.getListIds(
          this.physiotherapyList.clubs,
          'files_fisiotherapy',
          true
        );

        this.selectedPhysiotherapy = this.handleFilters(
          type,
          this.selectedPhysiotherapy
        );

        this.planData.sport.fisiotherapy = this.selectedPhysiotherapy;

        break;

      case 8:
        this.selectedRecoveryExtension = this.getListIds(
          this.effortRecoveryList.clubs,
          'tests',
          true
        );

        this.selectedRecoveryExtension = this.handleFilters(
          type,
          this.selectedRecoveryExtension
        );

        this.planData.sport.recovery_exertion = this.selectedRecoveryExtension;

        break;

      case 9:
        this.selectedNutrition = this.getListIds(
          this.nutritionList.clubs,
          'tests',
          true
        );

        this.selectedNutrition = this.handleFilters(
          type,
          this.selectedNutrition
        );

        this.planData.sport.nutrition = this.selectedNutrition;

        break;

      case 10:
        this.selectedPsychology = this.getListIds(
          this.psychologyList.clubs,
          'tests',
          true
        );

        this.selectedPsychology = this.handleFilters(
          type,
          this.selectedPsychology
        );

        this.planData.sport.psychology_reports = this.selectedPsychology;

        break;

      default:
        break;
    }
  }

  /**
   * convert Data
   */
  getListWithData(data: any, code: string, isPlayerData: boolean = false): [] {
    if (isPlayerData) {
      return data.filter((club: { teams: any[] }) =>
        club.teams.some((team) =>
          team.players.some(
            (player: { [key: string]: [] }) => player[code].length > 0
          )
        )
      );
    }

    return data.filter((club: { teams: any[] }) =>
      club.teams.some((team) => team[code]?.length > 0)
    );
  }

  /**
   * get all ids
   */
  getListIds(
    data: any,
    code: string,
    isPlayerData: boolean = false,
    secondCode: string = 'players'
  ): any[] {
    if (isPlayerData) {
      const list = data.map((club: { teams: any[] }) =>
        club.teams.map((team: any) =>
          team[secondCode].map((player: any) =>
            player[code].map((item: any) => item.id)
          )
        )
      );

      return this.flattenArray(list);
    }

    return data.filter((club: { teams: any[] }) =>
      club.teams.map((team) =>
        team[code].map((item: { id: number }) => item.id)
      )
    );
  }

  flattenArray(data: any) {
    let result: any[] = [];

    data.forEach((element: any) => {
      if (Array.isArray(element)) {
        result = result.concat(this.flattenArray(element));
      } else {
        result.push(element);
      }
    });

    return result;
  }

  /**
   * get plan qty
   */
  getPlanQuantity(code: string): number {
    const quantity = this.packageAttributes.find((item) => item.code === code)
      ?.pivot?.quantity;

    return quantity ? parseInt(quantity) : 0;
  }

  /**
   * get teams by user
   */
  getTeams(): void {
    this.subs = this.userservice.getUserTeams().subscribe((res) => {
      this.teamList = {
        clubs: res.data.clubs,
        total: res.data.total_teams,
      };

      if (this.teamList.clubs.length > 0) {
        this.attributeQuantity = this.getPlanQuantity('teams');
        this.currentTotalQuantity = this.teamList.total;
        this.currentCode = 'teams';

        if (this.currentTotalQuantity <= this.attributeQuantity) {
          // this.step += 1;
          this.handleSteps(false, true);
          return;
        }

        this.showData = true;
      } else {
        this.step += 1;
        this.handleSteps();
      }
    });
  }

  /**
   * get matches by user
   */
  getMatches(): void {
    this.loading = true;
    this.subs = this.userservice.getUserMatches().subscribe(
      (res) => {
        this.competitionList = {
          clubs: res.data.clubs.filter((club: { teams: any[] }) =>
            club.teams.some((team) =>
              team.competitions.some(
                (competition: { matches: [] }) => competition.matches.length > 0
              )
            )
          ),
          total: res.data.total_matches,
        };

        this.currentTotalQuantity = this.competitionList.total;
        this.handleStepsValidation('matches', this.competitionList.clubs);
      },
      ({ error }) => {
        this.msg.error(error);
        this.loading = false;
      }
    );
  }

  /**
   * get players by user
   */
  getPlayers(): void {
    this.loading = true;
    this.subs = this.userservice.getUserPlayers().subscribe(
      (res) => {
        this.playerList = {
          clubs: this.getListWithData(res.data.clubs, 'players'),
          total: res.data.total_teams,
        };

        this.currentTotalQuantity = this.playerList.total;
        this.handleStepsValidation('players', this.playerList.clubs);
      },
      ({ error }) => {
        this.msg.error(error);
        this.loading = false;
      }
    );
  }

  /**
   * get sessions by user
   */
  getSessions(): void {
    this.loading = true;
    this.subs = this.userservice.getUserSessions().subscribe(
      (res) => {
        this.sessionList = {
          clubs: this.getListWithData(res.data.clubs, 'exercise_sessions'),
          total: res.data.total_exercise_sessions,
        };

        this.currentTotalQuantity = this.sessionList.total;
        this.handleStepsValidation('training_sessions', this.sessionList.clubs);
      },
      ({ error }) => {
        this.msg.error(error);
        this.loading = false;
      }
    );
  }

  /**
   * get tests by user
   */
  getTests(): void {
    this.loading = true;
    this.subs = this.userservice.getUserTests().subscribe(
      (res) => {
        this.testList = {
          clubs: this.getListWithData(res.data.clubs, 'tests', true),
          total: res.data.total_tests,
        };

        this.currentTotalQuantity = this.testList.total;
        this.handleStepsValidation('tests', this.testList.clubs);
      },
      ({ error }) => {
        this.msg.error(error);
        this.loading = false;
      }
    );
  }

  /**
   * get injuries prevention by user
   */
  getUserInjuryPreventions(): void {
    this.loading = true;
    this.subs = this.userservice.getUserInjuryPreventions().subscribe(
      (res) => {
        this.injuryPreventionList = {
          clubs: this.getListWithData(
            res.data.clubs,
            'injuries_prevention',
            true
          ),
          total: res.data.total_injuries_prevention,
        };

        this.currentTotalQuantity = this.injuryPreventionList.total;
        this.handleStepsValidation(
          'injury_prevention',
          this.injuryPreventionList.clubs
        );
      },
      ({ error }) => {
        this.msg.error(error);
        this.loading = false;
      }
    );
  }

  /**
   * get rfd injuries  by user
   */
  getUserRfds(): void {
    this.loading = true;
    this.subs = this.userservice.getUserRfd().subscribe(
      (res) => {
        this.rfdList = {
          clubs: this.getListWithData(res.data.clubs, 'injuries_rfd', true),
          total: res.data.total_injuries_rfd,
        };

        this.currentTotalQuantity = this.rfdList.total;
        this.handleStepsValidation('rfd_injuries', this.rfdList.clubs);
      },
      ({ error }) => {
        this.msg.error(error);
        this.loading = false;
      }
    );
  }

  /**
   * get rfd injuries  by user
   */
  getUserPhysiotherapyTests(): void {
    this.loading = true;
    this.subs = this.userservice.getUserPhysiotherapyTests().subscribe(
      (res) => {
        this.physiotherapyList = {
          clubs: this.getListWithData(
            res.data.clubs,
            'files_fisiotherapy',
            true
          ),
          total: res.data.total_files_fisiotherapy,
        };

        this.currentTotalQuantity = this.physiotherapyList.total;
        this.handleStepsValidation(
          'fisiotherapy',
          this.physiotherapyList.clubs
        );
      },
      ({ error }) => {
        this.msg.error(error);
        this.loading = false;
      }
    );
  }

  /**
   * get rfd injuries  by user
   */
  getUserNutritionSheets(): void {
    this.loading = true;
    this.subs = this.userservice.getUserNutritionSheets().subscribe(
      (res) => {
        this.nutritionList = {
          clubs: this.getListWithData(res.data.clubs, 'tests', true),
          total: res.data.total_nutritional_sheets,
        };

        this.currentTotalQuantity = this.nutritionList.total;
        this.handleStepsValidation('nutrition', this.nutritionList.clubs);
      },
      ({ error }) => {
        this.msg.error(error);
        this.loading = false;
      }
    );
  }

  /**
   * get effort recovery reports
   */
  getUserEffortRecoveryReports(): void {
    this.loading = true;
    this.subs = this.userservice.getUserEfforRecoveryReports().subscribe(
      (res) => {
        this.effortRecoveryList = {
          clubs: this.getListWithData(res.data.clubs, 'tests', true),
          total: res.data.total_efforts_recovery,
        };

        this.currentTotalQuantity = this.effortRecoveryList.total;
        this.handleStepsValidation(
          'recovery_exertion',
          this.effortRecoveryList.clubs
        );
      },
      ({ error }) => {
        this.msg.error(error);
        this.loading = false;
      }
    );
  }

  /**
   * get psycology reports  by user
   */
  getUserPsychologyReports(): void {
    this.loading = true;
    this.subs = this.userservice.getUserPsychologyReports().subscribe(
      (res) => {
        this.psychologyList = {
          clubs: this.getListWithData(res.data.clubs, 'tests', true),
          total: res.data.total_psychology_reports,
        };

        this.currentTotalQuantity = this.psychologyList.total;
        this.handleStepsValidation(
          'psychology_reports',
          this.psychologyList.clubs
        );
      },
      ({ error }) => {
        this.msg.error(error);
        this.loading = false;
      }
    );
  }

  /**
   * downgrade plan
   */
  submit(): void {
    const data = {
      package_price_id: this.selectedPackage.prices
        ? (this.selectedPackage.prices[0]?.id as number)
        : 0,
      interval: this.intervalType,
      type: 'sport',
      sport: {
        teams: this.planData.sport.teams,
        matches: this.planData.sport.matches,
        // exercises: this.planData.sport.exercises,
        exercise_sessions: this.planData.sport.training_sessions,
        players: this.planData.sport.players,
        tests: this.planData.sport.tests,
        injuries_prevention: this.planData.sport.injury_prevention,
        injuries_rfd: this.planData.sport.rfd_injuries,
        files_fisiotherapy: this.planData.sport.fisiotherapy,
        efforts_recovery: this.planData.sport.recovery_exertion,
        nutritional_sheets: this.planData.sport.nutrition,
        psychology_reports: this.planData.sport.psychology_reports,
      },
    };

    console.log;

    this.loadingSubmit = true;
    this.loading = true;

    this.subs = this.userservice.dongradeUserPlan(data).subscribe(
      (res) => {
        this.getUserProfile(res.message);
      },
      ({ error }) => {
        this.msg.error(error);
        this.loadingSubmit = false;
        this.loading = false;
      }
    );
  }

  closeDialog(): void {
    this.close.emit(true);
  }

  getUserProfile(message: string): void {
    this.profileService.getProfile().subscribe(
      (res: any) => {
        const userData = res.data;

        this.appStateService.updateUserData(userData);
        this.appStateService.setTax(userData?.tax);

        const subscriptions = userData.subscriptions;
        localStorage.setItem('name', userData.full_name);
        localStorage.setItem('user', JSON.stringify(userData));

        this.msg.succes(message);
        this.loadingSubmit = false;
        this.loading = false;

        location.reload();
      },
      ({ error }) => {
        this.loadingSubmit = false;
        this.loading = false;
        this.msg.error(error);
      }
    );
  }

  /**
   * confirm update
   * @param data
   */
  confirm() {
    this.confirmationService.confirm({
      header: this.translateService.instant('LBL_CONFIRM_PLAN_UPDATE'),
      message: this.translateService.instant('LBL_CONFIRM_DIALOG'),
      acceptLabel: this.translateService.instant('LBL_YES'),
      rejectLabel: this.translateService.instant('LBL_NO'),
      accept: () => {
        this.submit();
      },
    });
  }

  /**
   * validate empty steps
   */
  handleStepsValidation(code: SportCodes, list: any[]): void {
    this.attributeQuantity = this.getPlanQuantity(
      code === 'tests' ? 'test' : code
    );

    this.currentCode = code;

    if (list.length > 0 && this.currentTotalQuantity > this.attributeQuantity) {
      this.loading = false;
      this.showData = true;

      this.step += 1;
    } else {
      if (code !== 'psychology_reports') {
        this.step += 1;
        this.handleSteps(false, true);
      } else {
        this.step = 10;

        return;
      }

      this.showData = false;

      this.loading = false;
    }
  }

  /**
   * calculate step total
   */
  getStepTotal(): number {
    const total = this.currentTotalQuantity - this.attributeQuantity;

    if (total < 0) return total * -1;

    return total;
  }

  /**
   * validate disabled button
   */
  handleSubmitValidation(): boolean {
    if (
      this.currentCode === 'psychology_reports' &&
      this.planData.sport[this.currentCode]?.length !== this.getStepTotal() &&
      this.currentTotalQuantity > this.attributeQuantity
    ) {
      return true;
    }

    if (
      this.currentCode !== 'psychology_reports' &&
      (this.loading ||
        this.loadingSubmit ||
        this.planData.sport[this.currentCode]?.length < this.getStepTotal())
    ) {
      return true;
    }
    return false;
  }

  ngOnDestroy(): void {
    if (this.subs) this.subs.unsubscribe();
  }
}
