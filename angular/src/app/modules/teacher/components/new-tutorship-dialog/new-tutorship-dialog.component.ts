import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { SchoolService } from 'src/app/_services/school.service';
import { TutorshipService } from 'src/app/_services/tutorship.service';
import FieldsValidation from 'src/app/utils/FieldsValidation';
import { DatePipe } from '@angular/common';
import { AppStateService } from 'src/app/stateManagement/appState.service';
import { ConfirmScoutingDialogComponent } from 'src/app/modules/academy/components/scouting/components/confirm-scouting-dialog/confirm-scouting-dialog.component';
import { AlertsApiService } from 'src/app/generals-services/alerts-api.service';

@Component({
  selector: 'new-tutorship-dialog',
  templateUrl: './new-tutorship-dialog.component.html',
  styleUrls: ['./new-tutorship-dialog.component.scss'],
  providers: [DatePipe],
})
export class NewTutorshipDialogComponent implements OnInit {
  constructor(
    private formBuilder: UntypedFormBuilder,
    private tutorshipService: TutorshipService,
    private schoolService: SchoolService,
    private datePipe: DatePipe,
    private appStateService: AppStateService,
    private msg: AlertsApiService
  ) {}

  @Input() visible: boolean = false;
  @Input() student: any = [];
  @Input() editingTutorship: boolean = false;
  @Output() close = new EventEmitter<boolean>();
  @Output() actionExecuted = new EventEmitter<boolean>();
  loading: boolean = false;
  step: number = 0;
  urlImages = environment.images;
  dateValue: Date = new Date();
  validation = new FieldsValidation();
  teachers: any = [];
  tutorshipTypes: any = [];
  specialists: any = [];

  newTutorshipForm = this.formBuilder.group({
    date: ['', Validators.required],
    teacher_id: ['', Validators.required],
    tutorship_type_id: ['', Validators.required],
    specialist_referral_id: ['', Validators.required],
    alumn_id: ['', Validators.required],
    reason: ['', [Validators.required, Validators.maxLength(1000)]],
    resume: ['', [Validators.required, Validators.maxLength(1000)]],
  });

  get newTutorshipControls() {
    return this.newTutorshipForm.controls;
  }

  closeDialog() {
    this.close.emit(false);
    this.visible = false;
    this.step = 0;
    this.editingTutorship = false;
    this.dateValue = new Date();
    // this.student = null
    this.newTutorshipForm.reset();
  }

  setTutorshipDate(val: Date) {
    // console.log(val)
    const tutorshipDate = this.datePipe.transform(val, 'yyyy-MM-dd');
    // console.log(tutorshipDate)
    this.newTutorshipForm.patchValue({ date: tutorshipDate });
    // console.log(this.dateValue)
  }

  validateStep() {
    // console.log(this.newTutorshipForm.value)
    let fields = [];
    switch (this.step) {
      case 0:
        this.step = 1;
        break;
      case 1:
        fields = ['date', 'teacher_id', 'tutorship_type_id'];
        if (!this.validation.validateStepFields(fields, this.newTutorshipForm))
          this.step = this.step + 1;
        break;
      case 2:
        fields = ['specialist_referral_id', 'alumn_id', 'reason', 'resume'];
        if (!this.validation.validateStepFields(fields, this.newTutorshipForm))
          this.onSubmit();
        break;
      default:
        break;
    }
  }

  saveTutorship() {
    this.tutorshipService
      .createTutorship(
        this.appStateService.getSchool().id,
        this.newTutorshipForm.value
      )
      .subscribe(
        (res: any) => {
          // console.log(res)
          this.loading = false;
          this.actionExecuted.emit(true);
          this.closeDialog();
        },
        ({ error }) => {
          this.loading = false;
          this.msg.error(error);
        }
      );
  }

  updateTutorship(tutorshipId: string) {
    this.tutorshipService
      .updateTutorship(tutorshipId, this.newTutorshipForm.value)
      .subscribe(
        (res: any) => {
          // console.log(res)
          this.loading = false;
          // this.getStudentsList()
          this.actionExecuted.emit(true);
          this.closeDialog();
        },
        (error) => {
          this.loading = false;
        }
      );
  }

  onSubmit(): void {
    if (this.newTutorshipForm.invalid) {
      return;
    } else {
      this.loading = true;
      // this.saveTutorship()
      if (this.editingTutorship) {
        this.updateTutorship(
          this.student.tutorships
            ? this.student.tutorships[0].id
            : this.student.id
        );
      } else {
        this.saveTutorship();
      }
    }
  }

  getTeachersList() {
    this.schoolService
      .getTeacherList(Number(this.appStateService.getSchool().id))
      .subscribe((res: any) => {
        // console.log(res)
        this.teachers = res.data;
      });
  }

  getTutorshipTypes() {
    this.tutorshipService.getTutorshipsTypes().subscribe((res: any) => {
      // console.log(res)
      this.tutorshipTypes = res.data;
    });
  }

  getSpecialistsList() {
    this.tutorshipService.getTutorshipsSpecialists().subscribe((res: any) => {
      // console.log(res)
      this.specialists = res.data;
    });
  }

  ngOnInit(): void {
    this.getTutorshipTypes();
    this.getTeachersList();
    this.getSpecialistsList();
  }

  ngOnChanges(changes: SimpleChanges) {
    // console.log(changes)
    if (
      changes.student &&
      changes.student.currentValue &&
      changes.student.currentValue.id &&
      !changes.student.firstChange
    ) {
      // console.log('aqui')
      this.newTutorshipForm.patchValue({
        alumn_id: changes.student.currentValue.id,
      });
    }

    if (
      changes.editingTutorship &&
      changes.editingTutorship.currentValue == true
    ) {
      let tutorship = null;
      // console.log('vergatario')
      if (this.student && this.student.tutorships) {
        // console.log('uno')
        tutorship = this.student.tutorships[0];
      } else {
        // console.log('dos')
        tutorship = this.student;
      }
      // console.log(tutorship)
      this.newTutorshipForm.patchValue({
        date: tutorship.date,
        teacher_id: tutorship.tutor.id,
        tutorship_type_id: tutorship.tutorship_type_id,
        specialist_referral_id: tutorship.specialist_referral_id,
        alumn_id: tutorship.alumn_id,
        reason: tutorship.reason,
        resume: tutorship.resume,
      });
      // this.dateValue = this.datePipe.transform(tutorship.tutorships[0].date, 'dd/MM/yy')
      this.dateValue = new Date(tutorship.date);
      // console.log(this.dateValue)
    }

    // console.log(this.newTutorshipForm.value)
  }
}
