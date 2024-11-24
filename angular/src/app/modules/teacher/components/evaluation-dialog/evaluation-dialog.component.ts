import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
} from '@angular/core';
import { EvaluationService } from 'src/app/_services/evaluation.service';
import { DailyCheckService } from 'src/app/_services/daily-check.service';
import { SchoolService } from 'src/app/_services/school.service';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';
import { AppStateQuery } from 'src/app/stateManagement/appState.query';
import { environment } from 'src/environments/environment';
import { DatePipe } from '@angular/common';
import { AlertsApiService } from 'src/app/generals-services/alerts-api.service';

@Component({
  selector: 'evaluation-dialog',
  templateUrl: './evaluation-dialog.component.html',
  styleUrls: ['./evaluation-dialog.component.scss'],
  providers: [DatePipe],
})
export class EvaluationDialogComponent implements OnInit {
  constructor(
    private translate: TranslateService,
    private evaluation: EvaluationService,
    private dailyCheck: DailyCheckService,
    private school: SchoolService,
    private msg: AlertsApiService
  ) {
    this.responsiveOptions = [
      {
        breakpoint: '1366px',
        numVisible: 4,
        numScroll: 1,
      },
      {
        breakpoint: '1200px',
        numVisible: 3,
        numScroll: 1,
      },
      {
        breakpoint: '1200px',
        numVisible: 2,
        numScroll: 2,
      },
      // {
      //     breakpoint: '768px',
      //     numVisible: 2,
      //     numScroll: 2
      // },
      {
        breakpoint: '560px',
        numVisible: 1,
        numScroll: 1,
      },
    ];
  }

  @Input() visible: boolean = false;
  @Input() editing: boolean = false;
  @Input() rubric: any = null;
  @Input() studentId: string;
  @Input() classroomAcademicYear: string = '';
  @Input() classroomId: string = '';
  @Input() classroomName: string = '';

  @Output() close = new EventEmitter<boolean>();

  urlImages = environment.images;
  girlAlumnImage: string = this.urlImages + 'images/alumn/alumna.svg';
  boyAlumnImage: string = this.urlImages + 'images/alumn/alumno.svg';
  loading: boolean = false;
  selectedStudent: any = null;
  studentDailyControl: any = null;
  students: any = [];
  scoreValue: string | number = 0;
  competencesResult: any = null;
  evaluateStatus: string = '';
  loadingEvaluation: boolean = false;

  responsiveOptions: any;

  indicators: any = [];

  student = {
    options: [
      {
        icon: 'retraso-icon.svg',
      },
      {
        icon: 'retraso-icon.svg',
      },
      {
        icon: 'anotacion-positiva-icon.svg',
      },
      {
        icon: 'anotacion-negativa-icon.svg',
      },
      {
        icon: 'no-higiene-icon.svg',
      },
      {
        icon: 'falta-justificada-icon.svg',
      },
      {
        icon: 'falta-icon.svg',
      },
      {
        icon: 'no-cuida-material-icon.svg',
      },
      {
        icon: 'no-respeto-icon.svg',
      },
      {
        icon: 'no-esfuerzo-icon.svg',
      },
      {
        icon: 'no-ropa-deportiva-icon.svg',
      },
      {
        icon: 'no-hace-clase-icon.svg',
      },
    ],
  };

  evaluation_performance = [
    {
      title: 'Insuficiente',
      icon: 'https://testing-cdn.fisicalcoach.com/resources/images/face/1_red_face.svg',
      values: [{ grade: 1 }, { grade: 2 }, { grade: 3 }, { grade: 4 }],
    },
    {
      title: 'Suficiente',
      icon: 'https://testing-cdn.fisicalcoach.com/resources/images/face/3_yellow_face.svg',
      values: [{ grade: 5 }, { grade: 6 }],
    },
    {
      title: 'Notable',
      icon: 'https://testing-cdn.fisicalcoach.com/resources/images/face/4_Blue_face.svg',
      values: [{ grade: 7 }, { grade: 8 }],
    },
    {
      title: 'Sobresaliente',
      icon: 'https://testing-cdn.fisicalcoach.com/resources/images/face/5_green_face.svg',
      values: [{ grade: 9 }, { grade: 10 }],
    },
  ];

  loadData() {
    this.loading = true;
    this.setIndicators(this.rubric);
    this.getStudents();
  }

  getOptionTooltip(indicator: any, optionTitle: string) {
    let tooltip: string = '';
    switch (optionTitle) {
      case this.evaluation_performance[0].title:
        tooltip = indicator.insufficient_caption;
        break;
      case this.evaluation_performance[1].title:
        tooltip = indicator.sufficient_caption;
        break;
      case this.evaluation_performance[2].title:
        tooltip = indicator.remarkable_caption;
        break;
      case this.evaluation_performance[3].title:
        tooltip = indicator.outstanding_caption;
        break;

      default:
        break;
    }
    return tooltip;
  }

  result(initLoad?: boolean) {
    const data = {
      alumn_id: this.selectedStudent.id,
      classroom_academic_year_id: this.classroomAcademicYear,
      rubric_id: this.rubric.id,
    };
    this.evaluation.evaluationResult(data).subscribe(
      (res: any) => {
        this.competencesResult = res.data.competences_score;
        this.scoreValue = Number(res.data.score).toFixed(2);

        this.evaluateStatus = res.data.status;

        this.indicators.forEach((indicator: any) => {
          this.resetIndicatorGrades(indicator.evaluation_performance);
        });

        if (res.data.grades.length > 0) {
          res.data.grades.forEach((grade: any) => {
            this.setIndicatorsGrades(
              grade.indicator_rubric.indicator_id,
              grade.grade
            );
          });
        }
      },
      (error) => {
        this.indicators.forEach((indicator: any) => {
          this.resetIndicatorGrades(indicator.evaluation_performance);
        });
        this.scoreValue = 0;
        this.competencesResult = null;
        this.loading = false;
      },
      () => {
        this.loading = false;
      }
    );
  }

  getCompetenceKey(key: string, abbr?: boolean) {
    if (key == 'POR EVALUAR' || key == 'UNRATED') return;
    const SPLIT_KEY = key.split('(');

    const ABBR = SPLIT_KEY[1].split(')')[0];
    if (abbr) {
      return ABBR;
    } else {
      return SPLIT_KEY[0];
    }
  }

  setIndicatorsGrades(
    indicatorId: string | number,
    gradeValue: string | number
  ) {
    const indicatorIndex = this.indicators.findIndex(
      (indicator: any) => indicator.id == indicatorId
    );

    this.indicators[indicatorIndex].evaluation_performance.forEach(
      (el: any) => {
        el.values.map((grade: any) => {
          if (grade.grade == gradeValue) {
            grade.selected = true;
          }
        });
      }
    );
  }

  resetIndicatorGrades(evaluationPerfomance: any) {
    evaluationPerfomance.forEach((gradesGroup: any) => {
      gradesGroup.values.forEach((group: any) => {
        group.selected = false;
      });
    });
  }

  selectGrade(option: any, indicatorId: string, evaluationPerfomance: any) {
    this.resetIndicatorGrades(evaluationPerfomance);
    option.selected = !option.selected;
    this.saveGrade(option.grade, indicatorId);
  }

  saveGrade(grade: string, indicatorId: string) {
    const data = {
      alumn_id: this.selectedStudent.id,
      classroom_academic_year_id: this.classroomAcademicYear,
      indicator_rubric_id: indicatorId,
      grade: grade,
    };

    this.evaluation.setGrade(data).subscribe(
      (res: any) => {
        this.result();
      },
      (error) => {
        this.loading = false;
      }
    );
  }

  setSelectedStudent(studentId?: string, notInitLoad?: boolean) {
    if (studentId) {
      this.selectedStudent = this.students.find(
        (el: any) => el.id == studentId
      );
      if (notInitLoad) {
        this.result();
      }
    } else {
      this.selectedStudent = this.students[0];
    }
    this.getAlumnDailyControl(this.selectedStudent.id);
  }

  getStudentIndex(studentId: string) {
    let studentIndex = this.students.findIndex((el: any) => el.id == studentId);
    return studentIndex;
  }

  setIndicators(rubric: any) {
    const indicators = rubric.indicators.map((indicator: any) => {
      return {
        ...indicator,
        ...JSON.parse(
          JSON.stringify({
            evaluation_performance: this.evaluation_performance,
          })
        ),
      };
    });
    this.indicators = indicators;
  }

  getStudents() {
    this.school
      .getAlumnsByClass(Number(this.classroomId))
      .subscribe((res: any) => {
        this.students = res.data;
        if (this.studentId) {
          this.setSelectedStudent(this.studentId);
        } else {
          this.setSelectedStudent();
        }
        this.result(true);
      });
  }

  getAlumnDailyControl(studentId: string) {
    this.dailyCheck
      .getStudentDailyControl(this.classroomId, studentId)
      .subscribe((res: any) => {
        this.studentDailyControl = res.data;
      });
  }

  closeDialog() {
    this.close.emit(false);
    // this.newRubricForm.reset()
    this.indicators = [];
    // this.indicatorsList()
  }

  onSubmit() {
    this.loadingEvaluation = true;
    const data = {
      alumn_id: this.selectedStudent.id,
      classroom_academic_year_id: this.classroomAcademicYear,
      rubric_id: this.rubric.id,
    };
    this.evaluation.evaluate(data).subscribe(
      (res: any) => {
        this.loadingEvaluation = false;
        this.loadData();
        this.msg.succes(res.message);
      },
      ({ error }) => {
        this.loadingEvaluation = false;
        this.msg.succes(error);
      }
    );
  }

  ngOnInit(): void {
    // this.getStudents()
    forkJoin(
      this.translate.get('new_indicator.not_enough'),
      this.translate.get('new_indicator.enough'),
      this.translate.get('new_indicator.remarkable'),
      this.translate.get('new_indicator.outstanding')
    ).subscribe(([not_enough, enough, remarkable, outstanding]) => {
      this.evaluation_performance[0].title = not_enough;
      this.evaluation_performance[1].title = enough;
      this.evaluation_performance[2].title = remarkable;
      this.evaluation_performance[3].title = outstanding;
    });
  }
}
