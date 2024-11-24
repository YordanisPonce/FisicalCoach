import { Component, OnDestroy, OnInit } from '@angular/core';
import { forkJoin, Subscription } from 'rxjs';
import { PlayersService } from '../../../../_services/players.service';
import { AppStateQuery } from '../../../../stateManagement/appState.query';
import { AppStateService } from '../../../../stateManagement/appState.service';
import { InjuryService } from '../../../../_services/injury.service';
import { AlumnsService } from 'src/app/_services/alumns.service';
import { environment } from 'src/environments/environment';
import { GeneralService } from 'src/app/_services/general.service';
import { SchoolService } from 'src/app/_services/school.service';
import { ConfirmationService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { AlertsApiService } from 'src/app/generals-services/alerts-api.service';

@Component({
  selector: 'app-alumns',
  templateUrl: './alumns.component.html',
  styleUrls: ['./alumns.component.scss'],
  providers: [ConfirmationService],
})
export class AlumnsComponent implements OnInit, OnDestroy {
  responsiveOptions = [
    {
      breakpoint: '1920px',
      numVisible: 4,
      numScroll: 4,
    },
    {
      breakpoint: '1600px',
      numVisible: 3,
      numScroll: 3,
    },
    {
      breakpoint: '1200px',
      numVisible: 2,
      numScroll: 2,
    },
    {
      breakpoint: '992px',
      numVisible: 1,
      numScroll: 1,
    },
    {
      breakpoint: '768px',
      numVisible: 1,
      numScroll: 1,
    },
    {
      breakpoint: '560px',
      numVisible: 1,
      numScroll: 1,
    },
  ];
  alumns: any[];
  alumnsAll: any[];
  loading: boolean = false;
  listCountries: any = [];
  listKinships: any = [];
  listLaterality: any = [];
  listGenders: any = [];
  listAcneaeTypes: any = [];
  listPositions: any = [];
  listSports: any = [];
  listCourses: any = [];
  listGenderIdentity: any = [];
  loadingList = true;
  values: any[];
  createPlayerDialog: boolean = false;
  class: any;
  subsTeam: Subscription;
  imgUrl: string = environment.images;
  girlAlumnImage: string = this.imgUrl + 'images/alumn/alumna.svg';
  boyAlumnImage: string = this.imgUrl + 'images/alumn/alumno.svg';

  constructor(
    private playerService: PlayersService,
    private appStateQuery: AppStateQuery,
    private appStateService: AppStateService,
    private injuryService: InjuryService,
    private alumnsService: AlumnsService,
    private generalService: GeneralService,
    private schoolService: SchoolService,
    private translate: TranslateService,
    private confirmationService: ConfirmationService,
    public alerts: AlertsApiService
  ) {
    this.values = [];
  }

  searchAlumn(event: any) {
    const search = event.target.value.toLowerCase();
    const filter = this.alumnsAll.filter((item: any) =>
      item?.alumn?.full_name?.toLowerCase().includes(search)
    );
    if (search.length > 0) {
      this.alumns = filter;
    } else {
      this.alumns = this.alumnsAll;
    }
  }

  ngOnInit(): void {
    this.loadList();
    this.subsTeam = this.appStateQuery.class$.subscribe((res) => {
      this.class = res;
    });
    this.getAlumns();
    this.getSports();
    this.getCourses();
    this.getAcneaTypes();
    this.getGenderIdentityList();
  }

  getLateralityName(laterlaityId: any): string {
    if (laterlaityId >= 0) {
      const laterality = this.listLaterality.find(
        (el: any) => el.id === laterlaityId
      );
      return laterality?.code;
    } else {
      return '';
    }
  }

  newAlumn() {
    const school = this.appStateService.getSchool();
    const academicYears = school.academic_years;
    const activeAcademicYear = academicYears.filter(
      (year: any) => year.is_active
    );
    if (activeAcademicYear.length > 0) {
      let periodActive: number = 0;
      activeAcademicYear.map((x: any) => {
        if (
          x.academic_periods.filter((period: any) => period.is_active).length >
          0
        ) {
          periodActive++;
        }
      });
      if (periodActive > 0) {
        this.createPlayerDialog = true;
      } else {
        this.alerts.error({
          message: this.translate.instant('alumns.cant_create_alumn'),
        });
      }
    } else {
      this.alerts.error({
        message: this.translate.instant('alumns.cant_create_alumn'),
      });
    }
  }

  getAlumns() {
    this.alumnsService
      .getAlummsByClassroom(this.appStateService.getClassroomAcademicYear())
      .subscribe((res) => {
        this.alumns = res.data;
        this.alumnsAll = res.data;
      });
  }

  getSports() {
    this.generalService.getListSport().subscribe((res) => {
      this.listSports = res?.data;
    });
  }

  getAcneaTypes() {
    this.generalService.getAcneaeTypes().subscribe((res: any) => {
      this.listAcneaeTypes = res.data;
    });
  }

  getCourses() {
    this.schoolService
      .getSubjectList(this.appStateService.getSchool().id)
      .subscribe((res) => {
        this.listCourses = res.data;
      });
  }

  getGenderIdentityList() {
    this.generalService.getGenderIdentity().subscribe((res) => {
      this.listGenderIdentity = res.data;
    });
  }

  loadList() {
    this.appStateQuery.listCountry$.subscribe((data) => {
      const r = Object.assign([], data);
      this.listCountries = r;
    });
    this.appStateQuery.listLaterality$.subscribe((data) => {
      const r = Object.assign([], data);
      this.listLaterality = r;
    });
    this.appStateQuery.listPositions$.subscribe((data) => {
      const r = Object.assign([], data);
      this.listPositions = r;
      this.loadingList = false;
    });
    this.appStateQuery.listGender$.subscribe((data) => {
      const r = Object.assign([], data);
      this.listGenders = r;
    });
    this.appStateQuery.listCivilStatus$.subscribe((data) => {
      const r = Object.assign([], data);
      this.listKinships = r;
    });
    const locale = localStorage.getItem('languaje');
    this.appStateQuery.listInjuries$.subscribe((data) => {
      if (!data) {
        forkJoin(
          this.injuryService.getListMechanismsInjury(),
          this.injuryService.getListInjuryExtrinsicFactors(),
          this.injuryService.getListInjuryIntrinsicFactors(),
          this.injuryService.getListInjurySituationTypes(),
          this.injuryService.getListInjuryLocations(),
          this.injuryService.getListInjurySeverities(),
          this.injuryService.getListInjuryAffectedSideTypes(),
          this.injuryService.getListInjuryTypes(),
          this.injuryService.getListClinicalTestTypes()
        ).subscribe(
          ([
            mechanismsInjury,
            injuryExtrinsicFactors,
            injuryIntrinsicFactors,
            injurySituationTypes,
            injuryLocations,
            injurySeverities,
            injuryAffectedSideTypes,
            injuryTypes,
            clinicalTestTypes,
          ]) => {
            const dataList = {
              mechanismsInjury: mechanismsInjury.data,
              injuryExtrinsicFactors: injuryExtrinsicFactors.data,
              injuryIntrinsicFactors: injuryIntrinsicFactors.data,
              injurySituationTypes: injurySituationTypes.data,
              injuryLocations: injuryLocations.data,
              injurySeverities: injurySeverities.data,
              injuryAffectedSideTypes: injuryAffectedSideTypes.data,
              injuryTypes: injuryTypes.data,
              clinicalTestTypes: clinicalTestTypes.data,
            };
            this.appStateService.updateListInjuries(dataList);
          }
        );
      }
    });
    this.appStateQuery.listAnalizePlayer$.subscribe((data) => {
      if (!data) {
        forkJoin(
          this.playerService.getListPuntuation(),
          this.playerService.getListSkills()
        ).subscribe(([punt, skill]) => {
          const dataList = {
            listSkill: skill.data,
            listPuntuations: punt.data,
          };
          this.appStateService.updateListAnalizePlayer(dataList);
        });
      }
    });
  }

  deleteAlumn(alumnId: string) {
    this.alumnsService.deleteAlumn(alumnId).subscribe((res: any) => {
      this.getAlumns();
    });
  }

  ngOnDestroy(): void {
    if (this.subsTeam) {
      this.subsTeam.unsubscribe();
    }
  }

  hanledClosed(event: any) {
    this.createPlayerDialog = false;
    if (event) {
      this.getAlumns();
    }
  }

  confirm(data: any) {
    this.confirmationService.confirm({
      header: this.translate.instant('LBL_CONFIRM_DELETE'),
      message: this.translate.instant('LBL_CONFIRM_DIALOG'),
      acceptLabel: this.translate.instant('LBL_YES'),
      rejectLabel: this.translate.instant('LBL_NO'),
      accept: () => {
        this.deleteAlumn(data);
      },
    });
  }
}
