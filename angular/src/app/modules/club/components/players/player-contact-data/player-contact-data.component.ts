import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { SelectItem } from 'src/app/_models/selectItem';
import { GeneralService } from 'src/app/_services/general.service';
import { Subscription } from 'rxjs';
import { AppStateQuery } from 'src/app/stateManagement/appState.query';
import { PlayersService } from 'src/app/_services/players.service';
import { AlumnsService } from 'src/app/_services/alumns.service';
import { AppStateService } from 'src/app/stateManagement/appState.service';
import { AlertsApiService } from 'src/app/generals-services/alerts-api.service';
import HandleErrors from '../../../../../utils/errors';
import { TranslateService } from '@ngx-translate/core';
import { ITeam } from '../../../../../_models/ITeam.interface';

@Component({
  selector: 'app-player-contact-data',
  templateUrl: './player-contact-data.component.html',
  styleUrls: ['./player-contact-data.component.scss'],
})
export class PlayerContactDataComponent implements OnInit, OnDestroy {
  formDataContact: UntypedFormGroup;
  @Input() listCountriesAll: any[] = [];
  listCountries: SelectItem[] = [];
  listCities: SelectItem[] = [];
  submitted = false;
  saving = false;
  @Input() playerContactData: any = {};
  @Output() nextstep: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  saveDataLocal: EventEmitter<any> = new EventEmitter<any>();
  subsPlayer: Subscription;
  role: 'teacher' | 'sport' = 'sport';
  errors: HandleErrors = new HandleErrors(this.alerts);
  team: ITeam;
  constructor(
    private formBuilder: UntypedFormBuilder,
    private generalService: GeneralService,
    private appStateQuery: AppStateQuery,
    private playerService: PlayersService,
    private translateService: TranslateService,
    private alumnService: AlumnsService,
    private appStateService: AppStateService,
    private alerts: AlertsApiService
  ) {}

  @Input() set playerData(value: any) {
    this.playerContactData = value;
    this.loadForm();
  }

  get f() {
    return this.formDataContact.controls;
  }

  ngOnInit(): void {
    this.team = this.appStateService.getTeam();
    this.role = localStorage.getItem('role') as 'teacher' | 'sport';
    this.listCountries = [];
    this.listCountriesAll.map((r: any) => {
      this.listCountries.push({ label: r.emoji + ' ' + r.name, value: r.id });
    });
    this.loadForm();
    if (this.role === 'teacher') {
      this.subsPlayer = this.appStateQuery.alumn$.subscribe((res) => {
        setTimeout(() => {
          if (
            this.playerContactData.country_id ||
            this.playerContactData.address
          ) {
            this.handleCities({
              value:
                this.playerContactData.country_id ||
                this.playerContactData?.address?.country_id,
            });
          }
          this.loadForm();
        }, 500);
      });
    } else {
    }
  }

  ngOnDestroy() {
    if (!this.playerContactData.id && !this.submitted) {
      const data = this.formDataContact.value;
      this.saveDataLocal.emit(data);
    }
    this.subsPlayer?.unsubscribe();
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

  loadForm() {
    this.formDataContact = this.formBuilder.group({
      street: [
        this.playerContactData && this.playerContactData.address
          ? this.playerContactData.address.street
          : this.playerContactData.street || null,
      ],
      postal_code: [
        this.playerContactData && this.playerContactData.address
          ? this.playerContactData.address.postal_code
          : this.playerContactData.postal_code || null,
      ],
      city: [
        this.playerContactData && this.playerContactData.address
          ? this.playerContactData.address.city
          : this.playerContactData.city || null,
      ],
      country_id: [
        this.playerContactData &&
        (this.playerContactData.address || this.playerContactData.country_id)
          ? this.playerContactData.country_id ||
            this.playerContactData.address.country_id
          : this.playerContactData.country_id || null,
      ],
      province_id: [
        this.playerContactData && this.playerContactData.address
          ? this.playerContactData.address.province_id
          : this.playerContactData.province_id || null,
      ],
      phone: [
        this.playerContactData?.address
          ? this.formatItem(this.playerContactData?.address?.phone)
          : [],
      ],
      mobile_phone: [
        this.playerContactData?.address
          ? this.formatItem(this.playerContactData?.address?.mobile_phone)
          : [],
      ],
      email: [
        this.playerContactData && this.playerContactData.email
          ? this.playerContactData.email
          : null,
        this.playerContactData.email
          ? Validators.compose([Validators.required, Validators.email])
          : Validators.email,
      ],
    });
    if (this.role === 'teacher') {
      this.formDataContact.addControl(
        'academical_emails',
        new UntypedFormControl(
          this.playerContactData && this.playerContactData.academical_emails
            ? this.playerContactData.academical_emails
            : null
        )
      );
      this.formDataContact.addControl(
        'virtual_space',
        new UntypedFormControl(
          this.playerContactData && this.playerContactData.virtual_space
            ? this.playerContactData.virtual_space
            : null
        )
      );
    }
  }

  onSubmit() {
    this.submitted = true;
    if (this.formDataContact.invalid) {
      return;
    }
    const data = this.formDataContact.value;
    if (!this.playerContactData.id) {
      this.nextstep.emit(data);
      return;
    }
    data.id = this.playerContactData.id;
    let player = Object.assign({}, data);
    this.saving = true;
    if (this.playerContactData.email == player.email) {
      const { email, ...playerData } = player;
      player = playerData;
    }
    player.team_id = this.team.id;
    if (this.role === 'teacher') {
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
          this.errors.handleError(
            error,
            this.translateService.instant('PLAYERS.ERRORCONTACTO')
          );
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
          this.errors.handleError(
            error,
            this.translateService.instant('PLAYERS.ERRORCONTACTO')
          );
        });
    }
  }

  handleCities(event: any) {
    const countrySelected = this.listCountriesAll.find(
      (x) => x.id === event.value
    );
    const code = countrySelected.iso2;
    this.listCities = [];
    const locale = localStorage.getItem('languaje');
    this.generalService.getCities(locale, code).subscribe((r) => {
      r.data.map((m: any) => {
        this.listCities.push({ label: m.name, value: m.id });
      });
    });
  }

  validateMobile(event: any) {
    event.target.value = event.target.value
      .replace(/[^0-9.]/gi, '')
      .replace('..', '.');
  }
}
