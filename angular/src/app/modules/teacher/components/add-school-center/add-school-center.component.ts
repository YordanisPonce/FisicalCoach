import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  Input,
} from '@angular/core';
import {
  FormArray,
  UntypedFormBuilder,
  UntypedFormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { AlertsApiService } from 'src/app/generals-services/alerts-api.service';
import { environment } from 'src/environments/environment';
import { AppStateQuery } from 'src/app/stateManagement/appState.query';
import { ClubService } from 'src/app/_services/club.service';
import { GeneralService } from 'src/app/_services/general.service';
import { AppStateService } from 'src/app/stateManagement/appState.service';
import { ComunicationComponentService } from 'src/app/_services/comunicationComponent.service';
import { SelectItem } from 'primeng/api';
import { School, SchoolCenterType } from 'src/app/_models/schools';
import { SchoolService } from 'src/app/_services/school.service';
import * as moment from 'moment';
import FieldsValidation from 'src/app/utils/FieldsValidation';
import HandleErrors from '../../../../utils/errors';

@Component({
  selector: 'app-add-school-center',
  templateUrl: './add-school-center.component.html',
  styleUrls: ['./add-school-center.component.scss'],
})
export class AddSchoolCenterComponent implements OnInit, OnDestroy {
  validation: any = new FieldsValidation();

  addSpaceDialog: boolean = false;
  periodDialog: boolean = false;
  step: number = 0;
  formSchool = this.formBuilder.group({
    image: [''],
    name: ['', Validators.required],
    school_center_type_id: ['', Validators.required],
    email: [null, Validators.email],
    webpage: [null],
    country_id: [null],
    province_id: [null],
    street: [null],
    city: [null],
    postal_code: [null],
    phone: [null],
    mobile_phone: [null],
    academic_years_json: ['', Validators.required],
    academic_year_name: ['', Validators.required],
    academic_year_is_active: [false],
    academic_year_start_date: ['', Validators.required],
    academic_year_end_date: ['', Validators.required],
    academic_year_periods: ['', Validators.required],
  });

  periodForm = this.formBuilder.group({
    academic_year_period_title: ['', Validators.required],
    academic_year_period_start_date: ['', Validators.required],
    academic_year_period_end_date: ['', Validators.required],
  });

  academicYearRequiredInput: any = {
    academic_year_name: false,
    academic_year_start_date: false,
    academic_year_end_date: false,
  };

  periodEmptyFields: any = {
    academic_year_period_title: false,
    academic_year_period_start_date: false,
    academic_year_period_end_date: false,
  };

  academic_year: any[] = [];
  submitted!: boolean;
  loadingSubmit: boolean = false;
  listCountries: SelectItem[] = [];
  listAllCountries: any[] = [];
  listProvincies: SelectItem[] = [];
  listSport: SelectItem[] = [];
  @Input() editing: boolean;
  @Output() dismissModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  imagen: any;
  imagenPreview: any;
  school: School;
  subs: Subscription;
  imageEdit: boolean = false;
  countrySelected: any;
  urlBase = environment.images;
  schoolCenterTypeList: SchoolCenterType[] = [];
  minDate = new Date();
  disabledDates: Array<Date> = [];
  academicYearList: any[] = [];
  academicPeriodList: any[] = [];
  academicPeriodsRangeList: any[] = [];
  academicPeriodMask: any[] = [];
  isPeriodAdded: boolean = false;
  dates: any = {
    yearStart: '',
    yearEnd: '',
  };
  error: HandleErrors = new HandleErrors(this.msg);
  constructor(
    private formBuilder: UntypedFormBuilder,
    private clubService: ClubService,
    private appStateService: AppStateService,
    private appStateQuery: AppStateQuery,
    private router: Router,
    private comunicationComponentService: ComunicationComponentService,
    private generalService: GeneralService,
    private translate: TranslateService,
    private msg: AlertsApiService,
    private schoolService: SchoolService
  ) {}

  get f() {
    return this.formSchool.controls;
  }

  get addPeriodControls() {
    return this.periodForm.controls;
  }

  onChangeStatus(event: any, index: any) {
    if (event.checked) {
      this.academicPeriodList.map((x: any) => {
        x.is_active = !event.checked;
      });
    }
    const period = this.academicPeriodList[index] as any;
    period.is_active = event.checked;
  }

  ngOnDestroy(): void {
    if (this.subs) {
      this.subs.unsubscribe();
    }
    this.appStateService.setClubEdit(null);
  }

  ngOnInit(): void {
    this.subs = this.appStateQuery.clubEdit$.subscribe((res) => {
      this.school = res;
      if (this.school != null && Object.entries(this.school).length > 0) {
        this.loadForm(res);
        const yearStartDate = new Date(res.academic_years[0].start_date);
        const yearEndDate = new Date(res.academic_years[0].end_date);
        this.setDates(yearStartDate, 'yearStart');
        this.setDates(yearEndDate, 'yearEnd');
        res.academic_years[0].academic_periods.forEach((period: any) => {
          const startDate = new Date(period.start_date);
          const endDate = new Date(period.end_date);
          this.setDisableDates(startDate, endDate);
        });
      }

      this.loadList();
      this.getSchoolCenterTypes();
    });
  }

  onSubmit() {
    this.addAcademicYear();
    if (this.formSchool.invalid) {
      return;
    } else {
      this.loadingSubmit = true;
      if (this.school != null && Object.entries(this.school).length > 0) {
        this.editSchoolCenter();
      } else {
        this.newSchoolCenter();
      }
    }
  }

  getSchoolCenterTypes(): void {
    this.subs = this.schoolService.getSchoolCenterType().subscribe((res) => {
      const list: any = [];
      res.data.map((r: any) => {
        list.push({ label: r.name, value: r.id });
      });
      this.schoolCenterTypeList = list;
      if (this.school && this.school.id) {
        this.formSchool.controls['school_center_type_id']?.setValue(
          this.school.school_center_type_id
        );
      }
    });
  }

  getScreenWidth(): any {
    return screen.width;
  }

  loadList() {
    this.generalService.getCountry().subscribe((res) => {
      this.listAllCountries = res.data;
      const list: any = [];
      res.data.map((r: any) => {
        list.push({ label: r.emoji + ' ' + r.name, value: r.id });
      });
      this.listCountries = list;
      if (this.school && this.school?.id && this.school.country_id != null) {
        this.formSchool.controls.country_id.setValue(this.school.country_id);
        this.getProvince(this.school.country_id);
      }
    });
  }

  getProvince(event: any) {
    this.countrySelected = this.listAllCountries.find((x) => x.id === event);
    const code = this.countrySelected.iso2;
    this.generalService.getProvincies(code).subscribe((res) => {
      const list: any = [];
      res.data.map((r: any) => {
        list.push({ label: r.name, value: r.id });
      });
      this.listProvincies = list;
      if (this.school && this.school.id) {
        this.formSchool.controls.province_id.setValue(this.school.province_id);
      }
    });
  }

  loadForm(school?: any): void {
    this.formSchool.addControl(
      'id',
      new UntypedFormControl('', Validators.required)
    );
    this.formSchool.patchValue({
      id: school.id,
      image: school.image,
      name: school.name,
      school_center_type_id: school.school_center_type_id,
      email: school.email,
      webpage: school.webpage,
      country_id: school.country_id,
      province_id: school.province_id,
      street: school.street,
      city: school.city,
      postal_code: school.postal_code,
      phone: this.getPhoneArray(school),
      mobile_phone: this.getMobilePhoneArray(school),
      academic_years_json: school.academic_years[0],
      academic_year_is_active: school.academic_years[0].is_active,
      academic_year_name: school.academic_years[0].title,
      academic_year_start_date: this.parseDate(
        school.academic_years[0].start_date
      ),
      academic_year_end_date: this.parseDate(school.academic_years[0].end_date),
      academic_year_periods: school.academic_years[0].academic_periods,
    });

    this.academicPeriodList = school.academic_years[0].academic_periods;
  }

  getPhoneArray(school: any) {
    if (school) {
      return school.phone?.filter((x: any) => x !== '');
    } else {
      return [];
    }
  }
  getMobilePhoneArray(school: any) {
    if (school) {
      return school.mobile_phone?.filter((x: any) => x !== '');
    } else {
      return [];
    }
  }
  validateStep() {
    let fields = [];
    switch (this.step) {
      case 0:
        this.step = this.step + 1;
        break;
      case 1:
        this.step = this.step + 1;
        break;
      case 2:
        if (this.formSchool.get('email')?.value != null) {
          fields = ['name', 'school_center_type_id', 'email'];
        } else {
          fields = ['name', 'school_center_type_id'];
        }
        if (!this.validation.validateStepFields(fields, this.formSchool)) {
          this.step = this.step + 1;
        }
        break;
      case 3:
        fields = [
          'academic_year_name',
          'academic_year_start_date',
          'academic_year_end_date',
          'academic_year_periods',
        ];
        if (!this.validation.validateStepFields(fields, this.formSchool)) {
          this.onSubmit();
        }
        break;
      default:
        break;
    }
  }

  validateForm(): void {
    this.submitted = true;
    this.loadingSubmit = true;
    if (this.formSchool.invalid) {
      this.loadingSubmit = false;
      return;
    }

    const school = this.formSchool.value as any;

    if (this.school && this.school.id) {
      this.schoolService
        .update(school, this.imagen)
        .then((res: any) => {
          const response = JSON.parse(res);
          this.appStateService.updateClub(school);
          this.comunicationComponentService.recargarMenuListaClubs(true);
          this.msg.succes(response.message);
          this.closeModal();
          this.loadingSubmit = false;
          this.router.navigate(['academy/home/' + this.school.id]);
          this.loadingSubmit = false;
        })
        .catch((error) => {
          this.closeModal();
          this.router.navigate(['/inicio']);
          this.error.handleError(
            error,
            this.translate.instant('school.erroronupdate')
          );
          this.loadingSubmit = false;
        });
    } else {
      this.addAcademicYear();
      const academicYearsJson = JSON.stringify({
        academic_years: this.academicYearList,
      });
      const validateSchool: any = {
        name: school.name,
        school_center_type_id: school.school_center_type_id,
        email: school.email,
        webpage: school.webpage || null,
        country_id: school.country_id || null,
        province_id: school.province_id || null,
        street: school.street || null,
        city: school.city || null,
        postal_code: school.postal_code || null,
        phone: school.phone || [],
        mobile_phone: school.mobile_phone || [],
        academic_years_json: `${academicYearsJson}`,
      };
      Object.entries(validateSchool).forEach((item: any) => {
        if (item[1] === null) {
          delete validateSchool[item[0]];
        }
      });
      this.schoolService
        .createSchoolCenter(validateSchool, this.imagen)
        .then((res: any) => {
          const response = JSON.parse(res);
          this.msg.succes(response.message);
          delete validateSchool.academic_years_json;
          this.appStateService.updateClub({
            ...validateSchool,
            ...response.data,
          });
          this.comunicationComponentService.recargarMenuListaClubs(true);
          this.closeModal();
          this.router.navigate(['academy/home/' + response.data.id]);
          this.loadingSubmit = false;
        })
        .catch((error: any) => {
          this.error.handleError(
            error,
            this.translate.instant('school.erroronsave')
          );
          this.comunicationComponentService.recargarMenuListaClubs(true);
          this.loadingSubmit = false;
          this.closeModal();
        });
    }
  }

  newSchoolCenter() {
    this.schoolService
      .createSchoolCenter(this.formSchool.value, this.imagen)
      .then((res: any) => {
        const response = JSON.parse(res);
        this.msg.succes(response.message);
        this.comunicationComponentService.recargarMenuListaClubs(true);
        this.closeModal();
        this.loadingSubmit = false;
      })
      .catch((error: any) => {
        this.msg.error(error);
        this.comunicationComponentService.recargarMenuListaClubs(true);
        this.loadingSubmit = false;
        this.closeModal();
      });
  }

  editSchoolCenter() {
    this.schoolService
      .editSchoolCenter(this.formSchool.value, this.imagen)
      .then((res: any) => {
        const response = JSON.parse(res);
        this.msg.succes(response.message);
        this.comunicationComponentService.recargarMenuListaClubs(true);
        this.appStateService.updateClub(this.formSchool.value);
        this.closeModal();
        this.loadingSubmit = false;
      })
      .catch((error: any) => {
        this.msg.error(error);
        this.comunicationComponentService.recargarMenuListaClubs(true);
        this.loadingSubmit = false;
        this.closeModal();
      });
  }

  closeModal() {
    this.dismissModal.emit(false);
    this.academicPeriodsRangeList = [];
  }

  async fileUpload(event: any, tipo: string) {
    const file = event.target.files[0];
    this.imagen = file;
    this.imageEdit = true;
    this.preview(file);
  }

  preview(file: File) {
    if (!file) {
      return;
    }
    const mimeType = file.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      this.imagenPreview = { url: reader.result, id: null };
    };
  }

  maskPhoneCode(event: any) {
    const temp = this.formSchool.controls.phone.value;
    const list: any[] = [];
    temp.map((x: any) => {
      const code = x.substring(0, 2);
      if (code === this.countrySelected?.phone_code.toString()) {
        list.push(this.countrySelected?.phone_code + x.substring(2));
      } else {
        list.push(this.countrySelected?.phone_code + x);
      }
    });
    this.formSchool.controls.phone.setValue(list);
  }

  maskMobilePhoneCode(event: any) {
    const temp = this.formSchool.controls.mobile_phone.value;
    const list: any[] = [];
    temp.map((x: any) => {
      const code = x.substring(0, 2);
      if (code === this.countrySelected?.phone_code.toString()) {
        list.push(this.countrySelected?.phone_code + x.substring(2));
      } else {
        list.push(this.countrySelected?.phone_code + x);
      }
    });
    this.formSchool.controls.mobile_phone.setValue(list);
  }

  validateMobile(event: any) {
    event.target.value = event.target.value
      .replace(/[^0-9.]/gi, '')
      .replace('..', '.');
  }

  validatePhone(event: any) {
    event.target.value = event.target.value
      .replace(/[^0-9.]/gi, '')
      .replace('..', '.');
  }

  parseDate(date: string) {
    const DATE = date.split('-');
    return [DATE[2], DATE[1], DATE[0]].join('/');
  }

  /**
   * school academic year calendar
   */
  setDates(
    date: any,
    dateType: 'yearStart' | 'yearEnd' | 'periodStart' | 'periodEnd'
  ): void {
    this.dates[dateType] = date;

    console.log(this.dates);
  }

  setDisableDates(startDate: Date, endDate: Date) {
    const RANGE_DATES: Date[] = [];
    for (
      let i: Date = startDate;
      i <= endDate;
      i = new Date(i.setDate(i.getDate() + 1))
    ) {
      RANGE_DATES.push(i);
    }
    RANGE_DATES.push(endDate);
    this.academicPeriodsRangeList.push(RANGE_DATES);
    this.updateDisableDates();
  }

  updateDisableDates() {
    this.disabledDates = this.academicPeriodsRangeList.reduce(
      (previousValue, currentValue) => previousValue.concat(currentValue),
      []
    );
  }

  /**
   *
   * add period
   */
  addPeriod(): void {
    this.validation.validateStepFields(
      [
        'academic_year_period_title',
        'academic_year_period_start_date',
        'academic_year_period_end_date',
      ],
      this.periodForm
    );

    if (this.periodForm.invalid) {
      return;
    } else {
      const START_PERIOD_DATE = new Date(
        this.periodForm.get('academic_year_period_start_date')?.value
      );
      const FINAL_PERIOD_DATE = new Date(
        this.periodForm.get('academic_year_period_end_date')?.value
      );
      this.academicPeriodList = [
        ...this.academicPeriodList,
        {
          title: this.periodForm.get('academic_year_period_title')?.value,
          start_date: moment(
            this.periodForm.get('academic_year_period_start_date')?.value
          ).format('YYYY-MM-DD'),
          end_date: moment(
            this.periodForm.get('academic_year_period_end_date')?.value
          ).format('YYYY-MM-DD'),
          is_active: this.academicPeriodList.length === 0,
        },
      ];
      this.setDisableDates(START_PERIOD_DATE, FINAL_PERIOD_DATE);
      this.periodDialog = false;
      this.periodForm.reset();
    }
    this.formSchool.patchValue({
      academic_year_periods: this.academicPeriodList,
    });
  }

  removePeriod(index: number) {
    this.academicPeriodList.splice(index, 1);
    if (this.academicPeriodList.length === 0) {
      this.formSchool.patchValue({ academic_year_periods: '' });
    }
    this.academicPeriodsRangeList.splice(index, 1);
    this.updateDisableDates();
  }

  /**
   * add academic year
   */
  addAcademicYear(): void {
    this.isPeriodAdded = true;
    this.academic_year = [
      {
        title: this.formSchool.get('academic_year_name')?.value,
        start_date: moment(
          this.formSchool.get('academic_year_start_date')?.value
        ).format('YYYY-MM-DD'),
        end_date: moment(
          this.formSchool.get('academic_year_end_date')?.value
        ).format('YYYY-MM-DD'),
        is_active: this.f.academic_year_is_active?.value,
        periods: this.academicPeriodList,
      },
    ];
    this.formSchool.patchValue({ academic_years_json: this.academic_year });
  }

  /**
   * used to validate academic year array
   */
  validateAcademicYearList(): boolean {
    let isInvalidYear = false;
    let isInvalidPeriod = false;
    let isInvalid = false;
    Object.entries(this.academicYearRequiredInput).map((value, i) => {
      this.academicYearRequiredInput[value[0]] =
        this.formSchool.value[value[0]] === '';
    });

    isInvalidYear = Object.values(this.academicYearRequiredInput).some(
      (input) => input
    );

    if (!this.isPeriodAdded) {
      Object.entries(this.periodEmptyFields).map((value, i) => {
        this.periodEmptyFields[value[0]] =
          this.formSchool.value[value[0]] === '';
      });
      isInvalidPeriod = Object.values(this.periodEmptyFields).some(
        (input) => input
      );
      isInvalidYear = true;
    } else {
      isInvalidPeriod = false;
    }
    isInvalid = isInvalidYear && isInvalidPeriod;
    return isInvalid;
  }

  /**
   * used to validate academic year array
   */
  isEmptyPeriodFields(): boolean {
    let isValid = false;
    Object.entries(this.periodEmptyFields).map((value, i) => {
      this.periodEmptyFields[value[0]] = this.formSchool.value[value[0]] === '';
    });

    isValid = Object.values(this.periodEmptyFields).some((input) => input);

    return isValid;
  }

  /**
   * Delete item for academic year or period
   * @param index
   * @param type
   */
  deleteItem(index: number, type: string): void {
    this.academicPeriodMask = this.academicPeriodMask.filter(
      (period, i) => i !== index
    );
    this.academicPeriodList = this.academicPeriodList.filter(
      (period, i) => i !== index
    );
  }

  /**
   * get parsed date
   */
  getStartDate(date: string | Date): Date {
    return new Date(date);
  }
}
