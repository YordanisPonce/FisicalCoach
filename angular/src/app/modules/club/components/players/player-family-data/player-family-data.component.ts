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
import { SelectItem } from '../../../../../_models/selectItem';
import { PlayersService } from '../../../../../_services/players.service';
import { GeneralService } from '../../../../../_services/general.service';
import { Subscription } from 'rxjs';
import { AppStateQuery } from '../../../../../stateManagement/appState.query';
import { AppStateService } from 'src/app/stateManagement/appState.service';
import { AlumnsService } from 'src/app/_services/alumns.service';
import { AlertsApiService } from '../../../../../generals-services/alerts-api.service';
import { TranslateService } from '@ngx-translate/core';
import HandleErrors from '../../../../../utils/errors';
import { ITeam } from '../../../../../_models/ITeam.interface';

@Component({
  selector: 'app-player-family-data',
  templateUrl: './player-family-data.component.html',
  styleUrls: ['./player-family-data.component.scss'],
})
export class PlayerFamilyDataComponent implements OnInit, OnDestroy {
  formFamilyData: UntypedFormGroup;
  selectedValue: string;
  listCountries: SelectItem[] = [];
  @Input() listCountriesAll: any[] = [];
  @Input() listCivilStatusAll: any[] = [];
  listCities1: SelectItem[] = [];
  listCities2: SelectItem[] = [];
  listCivilStatus: SelectItem[] = [];
  submitted = false;
  @Input() playerFamilyData: any = {};
  @Output() nextstep: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  saveDataLocal: EventEmitter<any> = new EventEmitter<any>();
  subsPlayer: Subscription;
  saving = false;
  role: 'teacher' | 'sport' = 'sport';
  errors: HandleErrors = new HandleErrors(this.alerts);
  team: ITeam;
  constructor(
    private formBuilder: UntypedFormBuilder,
    private playerService: PlayersService,
    private alumnsService: AlumnsService,
    private translateService: TranslateService,
    private generalService: GeneralService,
    private appStateQuery: AppStateQuery,
    private appStateService: AppStateService,
    private alerts: AlertsApiService
  ) {}

  @Input() set playerData(value: any) {
    this.playerFamilyData = value;
    this.loadForm();
  }

  get f() {
    return this.formFamilyData.controls;
  }

  ngOnInit(): void {
    this.team = this.appStateService.getTeam();
    this.role = localStorage.getItem('role') as 'teacher' | 'sport';
    this.listCountriesAll.map((r: any) => {
      this.listCountries.push({ label: r.emoji + ' ' + r.name, value: r.id });
    });
    this.listCivilStatus = [];
    this.listCivilStatusAll.map((res: any) => {
      this.listCivilStatus.push({ label: res.code, value: res.id });
    });
  }

  ngOnDestroy() {
    if (!this.playerFamilyData.id && !this.submitted) {
      const data = this.formFamilyData.value;
      this.saveDataLocal.emit(data);
    }
    this.subsPlayer?.unsubscribe();
  }

  loadForm() {
    this.formFamilyData = this.formBuilder.group({
      parents_marital_status_id: [
        this.playerFamilyData && this.playerFamilyData.family
          ? this.playerFamilyData.family.parents_marital_status_id
          : this.playerFamilyData?.parents_marital_status_id || null,
      ],
      father_full_name: [
        this.playerFamilyData && this.playerFamilyData.family?.members
          ? this.playerFamilyData.family?.members[1]?.full_name
          : this.playerFamilyData?.father_full_name || null,
      ],
      father_phone: [
        this.playerFamilyData?.family?.members?.length > 0
          ? this.formatItem(this.playerFamilyData?.family?.members[1]?.phone)
          : null,
      ],
      father_mobile_phone: [
        this.playerFamilyData?.family?.members?.length > 0
          ? this.formatItem(
              this.playerFamilyData?.family?.members[1]?.mobile_phone
            )
          : null,
      ],
      father_email: [
        this.playerFamilyData && this.playerFamilyData.family?.members
          ? this.playerFamilyData.family?.members[1]?.email
          : this.playerFamilyData?.father_email || null,
        this.playerFamilyData?.father_email
          ? Validators.compose([Validators.required, Validators.email])
          : Validators.email,
      ],
      mother_full_name: [
        this.playerFamilyData && this.playerFamilyData.family?.members
          ? this.playerFamilyData.family?.members[0]?.full_name
          : this.playerFamilyData?.mother_full_name || null,
      ],
      mother_phone: [
        this.playerFamilyData?.family?.members?.length > 0
          ? this.formatItem(this.playerFamilyData?.family?.members[0]?.phone)
          : null,
      ],
      mother_mobile_phone: [
        this.playerFamilyData?.family?.members?.length > 0
          ? this.formatItem(
              this.playerFamilyData?.family?.members[0]?.mobile_phone
            )
          : null,
      ],
      mother_email: [
        this.playerFamilyData && this.playerFamilyData.family?.members
          ? this.playerFamilyData.family?.members[0]?.email
          : this.playerFamilyData?.mother_email || null,
        this.playerFamilyData?.mother_email
          ? Validators.compose([Validators.required, Validators.email])
          : Validators.email,
      ],
      family_address_street: [
        this.playerFamilyData && this.playerFamilyData.family?.address
          ? this.playerFamilyData.family?.address.street
          : this.playerFamilyData?.family_address_street || null,
      ],
      family_address_country_id: [
        this.playerFamilyData && this.playerFamilyData.family?.address
          ? this.playerFamilyData.family?.address.country_id
          : this.playerFamilyData?.family_address_country_id,
      ],
      family_address_city: [
        this.playerFamilyData && this.playerFamilyData.family?.address
          ? this.playerFamilyData.family?.address.city
          : this.playerFamilyData?.family_address_city || null,
      ],
      family_address_postal_code: [
        this.playerFamilyData && this.playerFamilyData.family?.address
          ? this.playerFamilyData.family?.address.postal_code
          : this.playerFamilyData?.family_address_postal_code || null,
      ],
      family_address_province_id: [
        this.playerFamilyData && this.playerFamilyData.family?.address
          ? this.playerFamilyData.family?.address.province_id
          : this.playerFamilyData?.family_address_province_id || null,
      ],
    });
  }

  formatItem(item: any) {
    if (item === '' || item === null || item === undefined) {
      return [];
    } else if (item.length <= 0) {
      return [];
    } else {
      return item.filter((x: any) => x !== '');
    }
  }

  onSubmit() {
    if (this.formFamilyData.invalid) {
      return;
    }
    this.submitted = true;
    const data = this.formFamilyData.value;
    if (!this.playerFamilyData.id) {
      this.nextstep.emit(data);
      return;
    }
    data.id = this.playerFamilyData.id;
    const player = Object.assign({}, data);
    this.saving = true;
    player.team_id = this.team.id;
    if (this.role === 'teacher') {
      this.alumnsService
        .add(player, this.appStateService.getClassroomAcademicYear(), true)
        .then((r: any) => {
          this.alumnsService.setAlumnsDetailsData(
            Object.assign(this.alumnsService.getAlumnsDetailsData(), {
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
    } else {
      this.playerService
        .add(player, true)
        .then((r: any) => {
          this.appStateService.updatePlayer(JSON.parse(r).data);
          this.saving = false;
          this.alerts.succes(JSON.parse(r).message);
        })
        .catch((error) => {
          this.saving = false;
          this.errors.handleError(
            error,
            this.translateService.instant('PLAYERS.ERRORDATOSFAMILIARES')
          );
        });
    }
  }

  handleCity(event: any, tipo: number) {
    const countrySelected = this.listCountriesAll.find(
      (x) => x.id === event.value
    );
    const code = countrySelected.iso2;
    const locale = localStorage.getItem('languaje');
    this.generalService.getCities(locale, code).subscribe((r) => {
      if (tipo === 1) {
        this.listCities1 = [];
        r.data.map((m: any) => {
          this.listCities1.push({ label: m.name, value: m.id });
        });
      } else {
        this.listCities2 = [];
        r.data.map((m: any) => {
          this.listCities2.push({ label: m.name, value: m.id });
        });
      }
    });
  }
}
