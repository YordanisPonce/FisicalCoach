import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
} from '@angular/core';
import FieldsValidation from 'src/app/utils/FieldsValidation';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { SchoolService } from 'src/app/_services/school.service';
import { AppStateService } from 'src/app/stateManagement/appState.service';
import { AlertsApiService } from 'src/app/generals-services/alerts-api.service';

@Component({
  selector: 'app-assing-teacher',
  templateUrl: './assing-teacher.component.html',
  styleUrls: ['./assing-teacher.component.scss'],
})
export class AssingTeacherComponent implements OnInit {
  constructor(
    private formBuilder: UntypedFormBuilder,
    private schoolService: SchoolService,
    private appStateService: AppStateService,
    public alerts: AlertsApiService
  ) {}

  validation = new FieldsValidation();
  subjectList: any = [];
  teachersList: any = [];

  @Input() refreshIndicators: any = false;
  @Input() visible: boolean = false;
  // @Input() classroomId:string|number = ''
  // @Input() classroomAcademicYear:string|number = ''

  @Output() close = new EventEmitter<boolean>();
  @Output() saved = new EventEmitter<boolean>();

  editing: boolean = false;
  details: boolean = false;
  loading: boolean = false;
  submittedForm: boolean = false;
  assingTeacherForm = this.formBuilder.group({
    teacher_id: ['', Validators.required],
    subject_id: ['', Validators.required],
    is_class_tutor: [false, Validators.required],
  });

  get assingTeacherControls() {
    return this.assingTeacherForm.controls;
  }

  ngOnInit(): void {
    this.getSubjects(this.appStateService.getSchool().id);
    this.getTeachers();
  }

  getSubjects(schoolId: number): void {
    this.schoolService.getSubjectList(schoolId).subscribe((res) => {
      const data = res.data.map((item: any) => ({
        label: item.name,
        value: item.id,
      }));
      this.subjectList = data;
    });
  }

  getTeachers() {
    this.schoolService
      .getTeacherList(this.appStateService.getSchool().id)
      .subscribe(
        (r) => {
          this.teachersList = r.data;
          this.loading = false;
        },
        (error) => {
          this.teachersList = [];
          this.loading = false;
        }
      );
  }

  closeDialog() {
    this.close.emit(false);
    this.assingTeacherForm.reset();
    this.loading = false;
  }

  onSubmit() {
    console.log(this.assingTeacherForm.value);
    if (
      !this.validation.validateStepFields(
        ['teacher_id', 'subject_id', 'is_class_tutor'],
        this.assingTeacherForm
      )
    ) {
      if (this.assingTeacherForm.invalid) {
        return;
      } else {
        this.loading = true;
        const schoolId = this.appStateService.getSchool().id;
        const classId = this.appStateService.getClass().id;
        this.schoolService
          .assignClassTeacher(schoolId, classId, this.assingTeacherForm.value)
          .subscribe(
            (res: any) => {
              console.log(res);
              this.saved.emit();
              this.closeDialog();
              this.loading = false;
            },
            ({ error }) => {
              this.loading = false;
              this.alerts.error(error);
            }
          );
      }
    }
  }
}
