import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { SubPackage } from 'src/app/_models/subscription';
import {
  DowngradePlanTeacher,
  PackageAttribute,
  Subpackage,
  TeacherCodes,
} from 'src/app/_models/user';
import { UsersService } from 'src/app/_services/users.service';
import { AlertsApiService } from 'src/app/generals-services/alerts-api.service';
import { ProfieService } from '../../profile-services/profie.service';
import { AppStateService } from 'src/app/stateManagement/appState.service';
import { ConfirmationService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';

type listProps = {
  schools_center: any[];
  [key: string]: any;
};

@Component({
  selector: 'app-downgrade-plan-teacher-dialog',
  templateUrl: './downgrade-plan-teacher-dialog.component.html',
  styleUrls: ['../downgrade-plan-dialog/downgrade-plan-dialog.component.scss'],
})
export class DowngradePlanTeacherDialogComponent implements OnInit, OnDestroy {
  @Input() visible: boolean;
  @Input() packageAttributes: PackageAttribute[];
  @Input() currentPackage: SubPackage;
  @Input() selectedPackage: Subpackage;
  @Input() intervalType: string;
  @Output() close: EventEmitter<boolean> = new EventEmitter<boolean>();

  subs = new Subscription();
  step: number = 0;
  teamData: any;
  tutorshipList: listProps = { schools_center: [], total_tutorships: 0 };
  rubricList: listProps = { schools_center: [], total_tutorships: 0 };
  testList: listProps = { schools_center: [], total_tutorships: 0 };
  sessionList: listProps = { schools_center: [], total_tutorships: 0 };

  selectedTutorships: number[];
  selectedSessions: number[];
  selectedTests: number[];

  currentCode: TeacherCodes;
  currentTotalQuantity: number = 0;
  attributeQuantity: number;
  showData: boolean = false;

  planData: DowngradePlanTeacher = {
    interval: '',
    package_price_id: 0,
    type: '',
    teacher: {
      exercises: [],
      exercise_sessions: [],
      tests: [],
      tutorships: [],
    },
  };

  loading: boolean = false;
  loadingSubmit: boolean = false;

  constructor(
    private userservice: UsersService,
    private msg: AlertsApiService,
    public profileService: ProfieService,
    private appStateService: AppStateService,
    private confirmationService: ConfirmationService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.getTutorships();
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

  getListIds(data: any, code: string): any[] {
    return data.map((center: any) =>
      center.classrooms.map((classroom: any) =>
        classroom.academicYears.map((year: any) =>
          year.alumns.map((alumn: any) =>
            alumn[code].map((item: any) => item.id)
          )
        )
      )
    );
  }

  selectAllIds(type: 'recent' | 'latest' | ''): void {
    switch (this.step) {
      case 0:
        this.selectedTutorships = this.getListIds(
          this.tutorshipList.schools_center,
          'tutorships'
        );

        this.selectedTutorships = this.flattenArray(this.selectedTutorships);

        this.selectedTutorships = this.handleFilters(
          type,
          this.selectedTutorships
        );

        this.planData.teacher.tutorships = this.selectedTutorships;

        break;

      case 1:
        this.selectedTests = this.getListIds(
          this.testList.schools_center,
          'tests'
        );

        this.selectedTests = this.flattenArray(this.selectedTests);

        this.selectedTests = this.handleFilters(type, this.selectedTests);

        this.planData.teacher.tests = this.selectedTests;

        break;

      case 2:
        this.selectedSessions = this.sessionList.schools_center.map((center) =>
          center.classrooms.map((classroom: { exercise_sessions: any[] }) =>
            classroom.exercise_sessions.map(
              (session: { id: any }) => session.id
            )
          )
        );

        this.selectedSessions = this.flattenArray(this.selectedSessions);

        this.selectedSessions = this.handleFilters(type, this.selectedSessions);

        this.planData.teacher.exercise_sessions = this.selectedSessions;

        break;

      default:
        break;
    }
  }

  /**
   * select attributes
   */
  handleSelectAttributesData(code: TeacherCodes, id: number): void {
    let list: number[] = [];

    if (this.planData?.teacher[code].includes(id)) {
      list = this.planData.teacher[code].filter((item) => item !== id);
    } else {
      list = [...new Set(this.planData.teacher[code]), id];
    }

    this.planData = {
      ...this.planData,
      teacher: {
        ...this.planData.teacher,
        [code]: list,
      },
    };
  }

  /**
   * get plan qty
   */
  getPlanQuantity(code: string): number {
    const quantity = this.packageAttributes.find((item) => item.code === code)
      ?.pivot?.quantity;

    return quantity ? parseInt(quantity) : 0;
  }

  handleStepCase(
    isBack: boolean,
    code: TeacherCodes | null,
    callback: () => void
  ): void {
    if (isBack) {
      this.step > 0 && (this.step = this.step - 1);

      if (this.step > 0) this.currentCode = code as TeacherCodes;
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
    if (this.step > 4) return;

    switch (this.step) {
      case 0:
        this.handleStepCase(isBack, 'tests', this.getTest);

        break;

      case 1:
        this.handleStepCase(isBack, 'exercise_sessions', this.getSessions);

        break;

      case 2:
        if (isBack) {
          this.handleStepCase(isBack, 'exercise_sessions', () => {});
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

  getStepTitleByCode(step: number): string {
    switch (step) {
      case 0:
        return `Tutorías seleccionadas:`;

      case 1:
        return `Test seleccionados:`;

      case 2:
        return `Sessiones de ejercicio seleccionadas:`;

      default:
        break;
    }

    return ' - ';
  }

  getStepTitle(
    step: number,
    isSingular: boolean,
    capitalize: boolean = false
  ): string {
    switch (step) {
      case 0:
        return `${isSingular ? '' : 'las'} ${
          capitalize ? 'Tutorías' : 'tutorías'
        }`;

      case 1:
        return `${isSingular ? '' : 'los'} ${capitalize ? 'Tests' : 'tests'}`;

      case 2:
        return `${isSingular ? '' : 'las'} ${
          capitalize ? 'Sesiones de ejercicio' : 'sesiones de ejercicio'
        }`;

      default:
        break;
    }

    return ' - ';
  }

  capitalizeFirstLetter(word: string) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  /**
   * convert Data
   */
  getListWithData(data: any, code: string): any {
    return data.filter((classroom: { academicYears: any[] }) =>
      classroom.academicYears.some((year) =>
        year.alumns.some((alumn: any) => alumn[code].length > 0)
      )
    );
  }

  /**
   * get tutorshipts by teacher
   */
  getTutorships(): void {
    this.subs = this.userservice.getTeacherTutorships().subscribe((res) => {
      const data = res.data.schools_center.map((item: any) => ({
        ...item,
        classrooms: this.getListWithData(item.classrooms, 'tutorships'),
      }));

      this.tutorshipList = {
        schools_center: data
          .filter((center: any) => center.classrooms.length > 0)
          .map((item: any) => ({
            ...item,
            classrooms: item.classrooms,
          })),
        total_tutorships: res.data.total_tutorships,
      };

      this.attributeQuantity = this.getPlanQuantity('tutorials');
      this.currentTotalQuantity = this.tutorshipList.total_tutorships;

      if (
        this.tutorshipList.schools_center.length > 0 &&
        this.currentTotalQuantity > this.attributeQuantity
      ) {
        this.currentCode = 'tutorships';
        this.showData = true;
      } else {
        this.step += 1;
        this.handleSteps();
        this.loading = false;
      }
    });
  }

  /**
   * get rubrics by teacher
   */
  // getRubrics(): void {
  //   this.loading = true;
  //   this.subs = this.userservice.getTeacherRubrics().subscribe((res) => {
  //     this.rubricList = {
  //       schools_center: res.data.schools_center.filter(
  //         (center: { classrooms: any[] }) =>
  //           center.classrooms.some((classroom) => classroom.rubrics.length > 0)
  //       ),
  //       total_rubrics: res.data.total_rubrics,
  //     };

  //     this.step += 1;

  //     this.loading = false;
  //   });
  // }

  /**
   * get test by teacher
   */
  getTest(): void {
    this.loading = true;
    this.subs = this.userservice.getTeacherTests().subscribe((res) => {
      const data = res.data.clubs.map((item: any) => ({
        ...item,
        classrooms: this.getListWithData(item.classrooms, 'tests'),
      }));

      this.testList = {
        schools_center: data
          .filter((center: any) => center.classrooms.length > 0)
          .map((item: any) => ({
            ...item,
            classrooms: item.classrooms,
          })),
      };

      this.currentTotalQuantity = res.data.total_tests;

      this.handleStepsValidation('tests', this.testList.schools_center);
    });
  }

  /**
   * get sessions by teacher
   */
  getSessions(): void {
    this.loading = true;
    this.subs = this.userservice.getTeacherSessions().subscribe((res) => {
      this.sessionList = {
        schools_center: res.data.clubs.filter((center: { classrooms: any[] }) =>
          center.classrooms.some(
            (classroom) => classroom.exercise_sessions.length > 0
          )
        ),
        total_exercise_sessions: res.data.total_exercise_sessions,
      };

      this.currentTotalQuantity = res.data.total_exercise_sessions;

      this.handleStepsValidation(
        'exercise_sessions',
        this.sessionList.schools_center
      );
    });
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
      type: 'teacher',
      teacher: {
        // exercises: this.,
        exercise_sessions: this.selectedSessions,
        tests: this.selectedTests,
        tutorships: this.selectedTutorships,
      },
    };

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

  getUserProfile(message: string): void {
    this.profileService.getProfile().subscribe(
      (res: any) => {
        const userData = res.data;

        this.appStateService.updateUserData(userData);
        this.appStateService.setTax(userData?.tax);

        const subscriptions = userData.subscriptions;
        localStorage.setItem('name', userData.full_name);
        localStorage.setItem('role', subscriptions[0]?.package_code);
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

  handleStepsValidation(code: TeacherCodes, list: any[]): void {
    let attributeCode = '';

    if (code === 'tests') attributeCode = 'test';
    if (code === 'exercise_sessions') attributeCode = 'training_sessions';

    this.attributeQuantity = this.getPlanQuantity(attributeCode);

    this.currentCode = code;

    if (list.length > 0 && this.currentTotalQuantity > this.attributeQuantity) {
      this.loading = false;
      this.showData = true;

      this.step += 1;
    } else {
      if (code !== 'exercise_sessions') {
        this.step += 1;
        this.handleSteps(false, true);
      } else {
        this.step = 2;

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
      this.currentCode === 'exercise_sessions' &&
      this.planData.teacher[this.currentCode]?.length !== this.getStepTotal() &&
      this.currentTotalQuantity > this.attributeQuantity
    ) {
      return true;
    }

    if (
      this.currentCode !== 'exercise_sessions' &&
      (this.loading ||
        this.loadingSubmit ||
        this.planData.teacher[this.currentCode]?.length < this.getStepTotal())
    ) {
      return true;
    }
    return false;
  }

  closeDialog(): void {
    this.close.emit(true);
  }

  ngOnDestroy(): void {
    if (this.subs) this.subs.unsubscribe();
  }
}
