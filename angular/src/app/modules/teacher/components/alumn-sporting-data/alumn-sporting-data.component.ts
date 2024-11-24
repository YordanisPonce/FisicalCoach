import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { PlayersService } from '../../../../_services/players.service';
import { SelectItem } from '../../../../_models/selectItem';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import FieldsValidation from 'src/app/utils/FieldsValidation';
import { AppStateService } from 'src/app/stateManagement/appState.service';
import { AlumnsService } from 'src/app/_services/alumns.service';
import { AlertsApiService } from '../../../../generals-services/alerts-api.service';

@Component({
  selector: 'app-alumn-sporting-data',
  templateUrl: './alumn-sporting-data.component.html',
  styleUrls: ['./alumn-sporting-data.component.scss'],
})
export class AlumnSportingDataComponent implements OnInit {
  formSportingData: UntypedFormGroup;
  formTrajectory: UntypedFormGroup;
  selectedValue: any;
  submitted = false;
  submittedTrajectory = false;
  showModal = false;
  showModalTrajectory = false;
  showListeSpec = false;
  dorsal: number;
  listLaterality: SelectItem[] = [];
  listPositions: SelectItem[] = [];
  listPositionsSpec: SelectItem[] = [];
  listTypeArrival: SelectItem[] = [];
  // listSports: SelectItem[] = [];
  maxDate = new Date();
  yearRange = '';
  trayectory: any[] = [];
  assessment: any = {};
  savingTrayectory = false;
  loading = true;
  loadingAssessment = true;
  saving = false;
  @Input() alumnSportingData: any = {};
  @Input() listPositionsAll: any[] = [];
  @Input() listLateralityAll: any[] = [];
  @Input() sportsList: any[] = [];
  @Output() nextstep: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  saveDataLocal: EventEmitter<any> = new EventEmitter<any>();
  subsPlayer: Subscription;
  validation: any = new FieldsValidation();

  constructor(
    private formBuilder: UntypedFormBuilder,
    private alerts: AlertsApiService,
    private playersService: PlayersService,
    private alumnService: AlumnsService,
    private appStateService: AppStateService
  ) {}

  @Input() set alumnData(value: any) {
    this.alumnSportingData = value;
    this.loadForm();
  }

  get f() {
    return this.formSportingData.controls;
  }

  ngOnInit(): void {
    this.yearRange = '1900:' + new Date().getFullYear();
    this.getList();
    this.loadForm();
    this.subsPlayer = this.alumnService.alumn$.subscribe((res) => {
      setTimeout(() => {
        this.loadForm();
      }, 500);
    });
  }

  ngOnDestroy() {
    if (!this.alumnSportingData.id && !this.submitted) {
      const data = this.formSportingData.value;
      this.saveDataLocal.emit(data);
    }
    // this.subsPlayer.unsubscribe();
  }

  loadForm() {
    this.formSportingData = this.formBuilder.group({
      has_sport: [
        this.alumnSportingData && this.alumnSportingData.has_sport
          ? this.alumnSportingData.has_sport
          : null,
      ],
      has_extracurricular_sport: [
        this.alumnSportingData &&
        this.alumnSportingData.has_extracurricular_sport
          ? this.alumnSportingData.has_extracurricular_sport
          : null,
      ],
      has_federated_sport: [
        this.alumnSportingData && this.alumnSportingData.has_federated_sport
          ? this.alumnSportingData.has_federated_sport
          : null,
      ],
      sports_played: [
        this.alumnSportingData && this.alumnSportingData.sports
          ? this.loadSportsPlayed(this.alumnSportingData.sports)
          : null,
      ],
      favorite_sport_id: [
        this.alumnSportingData && this.alumnSportingData.favorite_sport_id
          ? this.alumnSportingData.favorite_sport_id
          : null,
      ],
      laterality_id: [
        this.alumnSportingData &&
        this.alumnSportingData?.laterality !== null &&
        this.alumnSportingData?.laterality !== undefined
          ? this.alumnSportingData.laterality.id
          : (this.alumnSportingData.laterality_id !== null &&
              this.alumnSportingData.laterality_id !== undefined) ||
            null,
      ],
    });

    this.formTrajectory = this.formBuilder.group({
      title: [null, Validators.required],
      category: [null, Validators.required],
      start_date: [null, Validators.required],
      end_date: [null, Validators.required],
      club_arrival_type_id: [null, Validators.required],
    });
  }

  loadSportsPlayed(sports: any) {
    const PLAYED_SPORTS = sports.map((sport: any) => sport.id);
    return PLAYED_SPORTS;
  }

  onSubmit() {
    this.submitted = true;
    if (this.formSportingData.invalid) {
      return;
    }

    const data = this.formSportingData.value;
    if (data.sports_played != null) {
      data.sports_played = data.sports_played.toLocaleString();
    }
    if (!this.alumnSportingData.id) {
      this.nextstep.emit(data);
      return;
    }

    data.id = this.alumnSportingData.id;
    const player = Object.assign({}, data);
    this.saving = true;

    this.alumnService
      .add(player, this.appStateService.getClassroomAcademicYear(), true)
      .then((r: any) => {
        this.alumnService.setAlumnsDetailsData(
          Object.assign(this.alumnService.getAlumnsDetailsData(), {
            alumn: JSON.parse(r).data,
          })
        );
        this.saving = false;
        this.alerts.succes(JSON.parse(r).message);
      })
      .catch(({ error }) => {
        this.saving = false;
        this.alerts.error(error);
      });
  }

  getList() {
    this.listPositionsAll.forEach((r: any) => {
      this.listPositions.push({ label: r.name, value: r.id });
    });
    this.listLateralityAll.forEach((r: any) => {
      this.listLaterality.push({ label: r.code, value: r.id });
    });
    this.playersService.getTypeArrival().subscribe((r: any) => {
      if (r.data) {
        r.data.map((x: any) => {
          this.listTypeArrival.push({ label: x.name, value: x.id });
        });
      }
    });
  }

  onSubmitArrival() {
    this.submittedTrajectory = true;
    if (this.formTrajectory.invalid) {
      return;
    }
    this.savingTrayectory = true;
    const data = this.formTrajectory.value;
    data.start_date = moment(data.start_date).format('YYYY-MM-DD');
    data.end_date = moment(data.end_date).format('YYYY-MM-DD');
    this.playersService
      .addArrival(data, this.alumnSportingData.id)
      .then((r) => {
        this.savingTrayectory = false;
        this.handleBack();
      });
  }

  handleBack() {
    this.showModalTrajectory = false;
    this.formTrajectory.reset();
    this.submittedTrajectory = false;
  }

  // getTrayectory() {
  //   if (this.alumnSportingData.id) {
  //     this.loading = true;
  //     this.playersService
  //       .getTrayectory(this.alumnSportingData.id)
  //       .subscribe((r) => {
  //         this.trayectory = r.data;
  //         this.loading = false;
  //       });
  //   }
  // }

  // getAssessment() {
  //   if (this.alumnSportingData.id) {
  //     this.loadingAssessment = true;
  //     this.playersService
  //       .getAssessment(this.alumnSportingData.id)
  //       .subscribe((r) => {
  //         this.assessment = r.data;
  //         this.loadingAssessment = false;
  //         console.log(r);
  //       });
  //   }
  // }
}
