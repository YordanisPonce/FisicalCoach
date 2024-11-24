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
import { Player } from '../../../../../_models/player';
import { PlayersService } from '../../../../../_services/players.service';
import { SelectItem } from '../../../../../_models/selectItem';
import { TeamService } from '../../../../../_services/team.service';
import * as moment from 'moment';
import { AppStateQuery } from '../../../../../stateManagement/appState.query';
import { Subscription } from 'rxjs';
import FieldsValidation from 'src/app/utils/FieldsValidation';
import { AlertsApiService } from '../../../../../generals-services/alerts-api.service';
import HandleErrors from '../../../../../utils/errors';
import { TranslateService } from '@ngx-translate/core';
import { AppStateService } from '../../../../../stateManagement/appState.service';
import { ITeam } from '../../../../../_models/ITeam.interface';

@Component({
  selector: 'app-player-sporting-data',
  templateUrl: './player-sporting-data.component.html',
  styleUrls: ['./player-sporting-data.component.scss'],
})
export class PlayerSportingDataComponent
  extends HandleErrors
  implements OnInit, OnDestroy
{
  analyzePlayerDialog: boolean = false;
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
  maxDate = new Date();
  yearRange = '';
  trayectory: any[] = [];
  assessment: any = {};
  savingTrayectory = false;
  loading = true;
  loadingAssessment = true;
  saving = false;
  selectedCLub: any;

  @Input() playerSportingData: any = {};
  @Input() listPositionsAll: any[] = [];
  @Input() listLateralityAll: any[] = [];
  @Input() listSkill: any[] = [];
  @Input() listPuntuations: any[] = [];
  @Input() isAvancedFormRegister: boolean = false;
  @Output() nextstep: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  saveDataLocal: EventEmitter<any> = new EventEmitter<any>();
  subsPlayer: Subscription;
  validation: any = new FieldsValidation();
  team: ITeam;
  constructor(
    private formBuilder: UntypedFormBuilder,
    private playersService: PlayersService,
    private translateService: TranslateService,
    private teamService: TeamService,
    public alertsApiService: AlertsApiService,
    public appStateService: AppStateService,
    private appStateQuery: AppStateQuery,
    private playerService: PlayersService
  ) {
    super(alertsApiService);
  }

  @Input() set player(value: Player) {
    this.playerSportingData = value;
    this.dorsal = this.playerSportingData?.shirt_number;
    this.loadData();
  }

  get f() {
    return this.formSportingData.controls;
  }

  get ft() {
    return this.formTrajectory.controls;
  }

  ngOnInit(): void {
    this.team = this.appStateService.getTeam();
  }

  loadData() {
    this.yearRange = '1900:' + new Date().getFullYear();
    if (this.playerSportingData.position_id) {
      this.getPositionSpec({ value: this.playerSportingData.position_id });
      this.dorsal = this.playerSportingData.shirt_number;
    }
    this.getList();
    this.loadForm();
    this.getTrayectory();
    this.getAssessment();
  }

  ngOnDestroy() {
    if (!this.playerSportingData.id && !this.submitted) {
      const data = this.formSportingData.value;
      this.saveDataLocal.emit(data);
    }
    this.subsPlayer?.unsubscribe();
  }

  loadForm() {
    this.formSportingData = this.formBuilder.group({
      alias: [this.playerSportingData?.alias || null, Validators.required],
      position_id: [
        this.playerSportingData?.position_id || null,
        this.listPositions.length > 0 ? Validators.required : [],
      ],
      shirt_number: [
        this.playerSportingData?.shirt_number || null,
        Validators.required,
      ],
      position_spec_id: [this.playerSportingData.position_spec_id || null],
      agents: [this.playerSportingData.agents || null],
      laterality_id: [
        this.playerSportingData?.laterality_id !== null &&
        this.playerSportingData?.laterality_id !== undefined
          ? this.playerSportingData?.laterality_id?.toString()
          : null,
      ],
    });

    this.loadTrayectoryform();
  }

  loadTrayectoryform(club: any = null): void {
    this.formTrajectory = this.formBuilder.group({
      title: [club ? club.title : null, Validators.required],
      category: [club ? club.category : null, Validators.required],
      start_date: [
        club ? new Date(club.start_date) : null,
        Validators.required,
      ],
      agents: [null],
      end_date: [club ? new Date(club.end_date) : null, Validators.required],
      club_arrival_type_id: [
        club ? club.club_arrival_type.id : null,
        Validators.required,
      ],
    });
  }

  onSubmit() {
    this.submitted = true;
    this.validation.validateStepFields(
      ['alias', 'position_id', 'shirt_number'],
      this.formSportingData
    );
    if (this.formSportingData.invalid) {
      return;
    }
    const data = this.formSportingData.value;
    data.shirt_number = this.dorsal;
    if (!this.playerSportingData.id) {
      this.nextstep.emit(data);
      return;
    }
    data.id = this.playerSportingData.id;
    const player = Object.assign({}, data);
    this.saving = true;
    player.team_id = this.team.id;
    this.playerService
      .add(player, true)
      .then((r: any) => {
        const res = JSON.parse(r);
        const data = { ...this.playerSportingData, ...res.data };
        data.position_id = Number(data.position_id);
        this.appStateService.updatePlayer(data);
        this.saving = false;
        this.alertsApiService.succes(res.message);
      })
      .catch((error) => {
        this.handleError(
          error,
          this.translateService.instant('PLAYERS.ACTUALIZACIONERROR')
        );
        this.saving = false;
      });
  }

  changeDorsal() {
    this.formSportingData.controls.shirt_number.setValue(this.dorsal);
    this.showModal = false;
  }

  getList() {
    this.listPositions = [];
    this.listLaterality = [];
    this.listTypeArrival = [];
    this.listPositionsAll.forEach((r: any) => {
      this.listPositions.push({ label: r.name, value: r.id });
    });
    this.listLateralityAll.forEach((r: any) => {
      this.listLaterality.push({ label: r.code, value: r.id });
    });
    this.playersService.getTypeArrival().subscribe((r: any) => {
      r?.data?.map((x: any) => {
        this.listTypeArrival.push({ label: x.name, value: x.id });
      });
    });
  }

  getPositionSpec(event: any) {
    const id = event.value;
    this.teamService.getListPositionSpecs(id).subscribe((r) => {
      const lista: any = [];
      r?.data?.map((item: any) => {
        lista.push({ label: item.name, value: item.id });
      });
      this.listPositionsSpec = lista;
      this.showListeSpec = this.listPositionsSpec.length > 0;
    });
  }

  handleDorsal() {
    const data = this.formSportingData.value;
    this.dorsal = data.shirt_number;
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
      .addArrival(data, this.playerSportingData.id)
      .then((r) => {
        this.savingTrayectory = false;
        this.handleBack();
        this.getTrayectory();
        this.alertsApiService.succes(
          this.translateService.instant('PLAYERS.TRAYECTORIAGUARDADA')
        );
      })
      .catch((error) => {
        this.handleError(
          error,
          this.translateService.instant('PLAYERS.ACTUALIZACIONERROR')
        );
      });
  }

  handleBack() {
    this.showModalTrajectory = false;
    this.formTrajectory.reset();
    this.submittedTrajectory = false;
    if (this.selectedCLub) {
      this.selectedCLub = null;
    }
  }

  getTrayectory() {
    if (this.playerSportingData.id) {
      this.loading = true;
      this.playersService
        .getTrayectory(this.playerSportingData.id)
        .subscribe((r) => {
          this.trayectory = r.data;

          this.loading = false;
        });
    }
  }

  getAssessment() {
    if (this.playerSportingData.id) {
      this.loadingAssessment = true;
      this.playersService
        .getAssessment(this.playerSportingData.id)
        .subscribe((r) => {
          this.assessment = r.data;
          this.loadingAssessment = false;
        });
    }
  }

  showTrayectoryModal(club: any): void {
    this.selectedCLub = club;
    this.showModalTrajectory = true;

    this.loadTrayectoryform(this.selectedCLub);
  }

  /**
   *
   * @param reload
   */

  assessmentValidation(reload: boolean) {
    this.analyzePlayerDialog = false;
    if (reload) {
      this.getAssessment();
    }
  }
}
