import { Component, OnInit } from '@angular/core';
import { AppStateQuery } from 'src/app/stateManagement/appState.query';
import { EvaluationService } from 'src/app/_services/evaluation.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { saveAs } from 'file-saver';
import { AppStateService } from 'src/app/stateManagement/appState.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'rubrics-by-alumn',
  templateUrl: './rubrics-by-alumn.component.html',
  styleUrls: [
    './rubrics-by-alumn.component.scss',
    '../evaluation/evaluation.component.scss',
  ],
})
export class RubricsByAlumnComponent implements OnInit {
  alumn: any;
  alumnId: string;
  evaluations: any;
  loading: boolean = false;
  evaluationDialog: boolean = false;
  rubric: any = null;
  classroomAcademicYear: string;
  disabledElement: boolean = false;
  images: string = environment.images;
  girlAlumnImage: string = this.images + 'images/alumn/alumna.svg';
  boyAlumnImage: string = this.images + 'images/alumn/alumno.svg';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private appStateQuery: AppStateQuery,
    private evaluation: EvaluationService,
    private appStateService: AppStateService
  ) {
    this.classroomAcademicYear =
      this.appStateService.getClassroomAcademicYear();
  }

  getClassroomId(): string {
    let classroomId = '';
    this.appStateQuery.class$.subscribe((res) => {
      classroomId = res.id;
    });
    return classroomId;
  }

  getClassroomName(): string {
    let classroomName = '';
    this.appStateQuery.class$.subscribe((res) => {
      classroomName = res.name;
    });
    return classroomName;
  }

  getRubricsByAlumn() {
    const alumnId =
      this.route.snapshot.paramMap.get('alumnId')! ||
      this.route.parent?.snapshot.paramMap.get('alumnId')!;
    this.evaluation
      .getAlumnRubrics(alumnId, this.classroomAcademicYear)
      .subscribe((res: any) => {
        this.alumn = res.data.alumn;
        this.alumnId = this.alumn.id;
        this.evaluations = res.data.evaluations;
        this.loading = false;
      });
  }

  evaluate(rubric: any) {
    this.rubric = rubric;
    this.evaluationDialog = true;
  }

  download(rubricId: string) {
    this.evaluation
      .getRubricPdf(rubricId, this.alumnId, this.classroomAcademicYear)
      .subscribe((res: any) => {
        const blob = new Blob([res], { type: 'application/pdf' });
        saveAs(blob, 'rubric.pdf');
      });
  }

  ngOnInit(): void {
    this.router.events.forEach((event) => {
      if (event instanceof NavigationEnd) {
        this.getRubricsByAlumn();
      }
    });
    this.route.parent?.url.subscribe((p) => {
      p.forEach((el) => {
        if (el.path === 'profile') {
          this.disabledElement = true;
        }
      });
    });

    this.loading = true;
    this.getRubricsByAlumn();
  }

  handleCalifications(grade: string): {
    color: string;
    icon: string;
    text: string;
    label: string;
    value: string;
  } {
    const parseGrade: number = parseInt(grade);
    const url = 'https://testing-cdn.fisicalcoach.com/resources/images/face';

    if (parseGrade <= 4) {
      return {
        text: 'insufficient (1-4)',
        value: ' (1-4)',
        label: 'insufficient',
        color: '#F94C46',
        icon: `${url}/1_red_face.svg`,
      };
    }

    if (parseGrade > 4 && parseGrade <= 6) {
      return {
        text: 'sufficient (5-6)',
        value: ' (5-6)',
        label: 'sufficient',
        color: '#c8d16b',
        icon: `${url}/3_yellow_face.svg`,
      };
    }

    if (parseGrade > 6 && parseGrade <= 8) {
      return {
        text: 'notable (7-8)',
        value: ' (7-8)',
        label: 'notable',
        color: '#A9E6FF',
        icon: `${url}/4_Blue_face.svg`,
      };
    }

    if (parseGrade > 8 && parseGrade <= 10) {
      return {
        text: 'outstanding (9-10)',
        value: ' (9-10)',
        label: 'outstanding',
        color: '#9AF9E9',
        icon: `${url}/5_green_face.svg`,
      };
    }

    return {
      text: '',
      value: '',
      label: '',
      color: '',
      icon: '',
    };
  }
  ngAfterViewInit() {
    let routeParams: any = {};
    this.route.queryParamMap.subscribe((params) => {
      routeParams = { ...params.keys, ...params };
    });
    const rubricID = routeParams.params.rubric;
    if (rubricID && history.state.indicators) {
      this.evaluate(history.state);
    }
  }
}
