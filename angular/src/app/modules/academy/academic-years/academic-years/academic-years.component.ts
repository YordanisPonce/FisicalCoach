import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectItem } from '../../../../_models/selectItem';
import { Club } from '../../../../_models/club';
import { environment } from '../../../../../environments/environment';
import { SchoolService } from '../../../../_services/school.service';
import { AppStateService } from '../../../../stateManagement/appState.service';
import { AddAcademicYearComponent } from '../add-academic-year/add-academic-year.component';
import { ConfirmationService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import HandleErrors from '../../../../utils/errors';
import { AlertsApiService } from '../../../../generals-services/alerts-api.service';
import * as moment from 'moment';
import { AppStateQuery } from 'src/app/stateManagement/appState.query';
import { ComunicationComponentService } from 'src/app/_services/comunicationComponent.service';

@Component({
  selector: 'app-academic-years',
  templateUrl: './academic-years.component.html',
  styleUrls: ['./academic-years.component.scss'],
})
export class AcademicYearsComponent implements OnInit {
  showModal = false;
  loading = true;
  listJobArea: SelectItem[] = [];
  listGender: SelectItem[] = [];
  club: Club;
  filter = '';
  urlBase = environment.images;
  academicYears: any[] = [];
  displayModalAcademicYear: boolean = false;
  @ViewChild('academicyear') academicyear: AddAcademicYearComponent;
  academicYearData!: any;
  saving: boolean = false;
  school: any;
  academicYear: any;
  viewDetail: boolean = false;
  errors: HandleErrors = new HandleErrors(this.alerts);
  updating: boolean = false;

  constructor(
    private schoolService: SchoolService,
    public alerts: AlertsApiService,
    private confirmationService: ConfirmationService,
    private translateService: TranslateService,
    private appStateService: AppStateService,
    private comunicationService: ComunicationComponentService
  ) {}

  ngOnInit(): void {
    this.club = this.appStateService.getClub();
    this.school = Object.assign({}, this.appStateService.getSchool());
    this.getData();
  }

  formatDate(date: any) {
    const dateTemp = date.split('/');
    const dateToFormat = `${dateTemp[2]}-${dateTemp[1]}-${dateTemp[0]}`;
    return moment(dateToFormat).format('YYYY-MM-DD');
  }

  getData() {
    this.loading = true;
    this.academicYears = [];
    this.schoolService
      .getAcademicYearBySchoolCenter(this.club.id)
      .subscribe((res) => {
        this.academicYears = res.data.academic_years;
        this.academicYears.map((x: any) => {
          x.end_date = moment(x.end_date).format('DD/MM/YYYY');
          x.start_date = moment(x.start_date).format('DD/MM/YYYY');
        });
        this.school.academic_years = this.academicYears;
        this.appStateService.updateShool(this.school);
        this.loading = false;
      });
  }

  handleView(event: any) {
    this.viewDetail = true;
    this.academicYear = event;
    this.displayModalAcademicYear = true;
  }

  handleEdit(event: any) {
    this.academicYear = { ...event };
    const end_date = this.academicYear.end_date.split('/');
    const start_date = this.academicYear.start_date.split('/');
    this.academicYear.end_date = `${end_date[2]}-${end_date[1]}-${end_date[0]}`;
    this.academicYear.start_date = `${start_date[2]}-${start_date[1]}-${start_date[0]}`;
    this.displayModalAcademicYear = true;
  }

  onChangeStatus(event: any) {
    if (
      event.is_active &&
      this.academicYears.filter((x) => x.is_active).length >= 2
    ) {
      this.confirmation(
        event,
        this.translateService.instant('academicyear.message2')
      );
    } else {
      this.update(event);
    }
  }

  handleQuickCreate() {
    this.viewDetail = false;
    this.academicYear = null;
    this.displayModalAcademicYear = true;
  }

  closeModalAcademicYear() {
    this.viewDetail = false;
    this.displayModalAcademicYear = false;
  }

  saveAcademicYear() {
    this.academicyear.saveAcademicYear();
    if (this.academicYearData.valid) {
      const temp = this.academicYears.filter(
        (x) => x.is_active && x.id !== this.academicYearData.data.id
      );
      if (this.academicYearData.data.is_active && temp) {
        if (this.academicYearData.data.id) {
          this.confirmation(
            this.academicYearData.data,
            this.translateService.instant('academicyear.message2')
          );
        } else {
          this.confirmation(
            this.academicYearData.data,
            this.translateService.instant('academicyear.message1')
          );
        }
      } else {
        if (this.academicYearData.data.id) {
          this.update(this.academicYearData.data);
        } else {
          this.save();
        }
      }
    }
  }

  private update(data?: any) {
    const dataToSave = { ...data };
    if (!dataToSave.periods) {
      dataToSave.periods = Object.assign(dataToSave.academic_periods);
    }
    dataToSave.end_date = this.formatDate(dataToSave.end_date);
    dataToSave.start_date = this.formatDate(dataToSave.start_date);
    this.saving = true;
    this.schoolService.updateAcademicYears(dataToSave, this.club.id).subscribe(
      (res) => {
        this.saving = false;
        this.displayModalAcademicYear = false;
        this.getData();
        this.alerts.succes(
          this.translateService.instant('academicyear.editadoexitoso')
        );

        this.comunicationService.refreshClassList(true);
      },
      (error) => {
        data.is_active = !data.is_active;
        this.errors.handleError(
          error,
          this.translateService.instant('academicyear.error')
        );
        this.saving = false;
      }
    );
  }

  private save() {
    this.saving = true;
    this.schoolService
      .saveAcademicYears(this.academicYearData.data, this.club.id)
      .subscribe(
        (res) => {
          this.saving = false;
          this.displayModalAcademicYear = false;
          this.getData();
          this.alerts.succes(
            this.translateService.instant('academicyear.guadadoexitoso')
          );
        },
        (error) => {
          this.errors.handleError(
            error,
            this.translateService.instant('academicyear.error')
          );
          this.saving = false;
        }
      );
  }

  private confirmation(data: any, message: string) {
    this.confirmationService.confirm({
      header: this.translateService.instant('academicyear.header'),
      message,
      key: 'academicyear',
      accept: () => {
        if (data.id) {
          this.update(data);
        } else {
          this.save();
        }

        this.translateService.instant('academicyear.error');
      },
      reject: () => {
        data.is_active = !data.is_active;
      },
    });
  }
}
