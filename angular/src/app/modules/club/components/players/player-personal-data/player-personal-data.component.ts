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
import * as moment from 'moment';
import { SelectItem } from '../../../../../_models/selectItem';
import { Subscription } from 'rxjs';
import { AppStateQuery } from '../../../../../stateManagement/appState.query';
import { PlayersService } from '../../../../../_services/players.service';
import { AlertsApiService } from '../../../../../generals-services/alerts-api.service';
import { environment } from 'src/environments/environment';
import FieldsValidation from 'src/app/utils/FieldsValidation';
import { AppStateService } from 'src/app/stateManagement/appState.service';
import { AlumnsService } from 'src/app/_services/alumns.service';
import { TranslateService } from '@ngx-translate/core';
import HandleErrors from '../../../../../utils/errors';
import { ITeam } from 'src/app/_models/ITeam.interface';

@Component({
  selector: 'app-player-personal-data',
  templateUrl: './player-personal-data.component.html',
  styleUrls: ['./player-personal-data.component.scss'],
})
export class PlayerPersonalDataComponent
  extends HandleErrors
  implements OnInit, OnDestroy
{
  @Input() player: any = {};
  @Input() listCountriesAll: SelectItem[] = [];
  @Input() listGenders: any[] = [];
  @Input() listGenderIdentity: any[] = [];
  @Output()
  nextstep: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  saveDataLocal: EventEmitter<any> = new EventEmitter<any>();
  selectedValue: any = 'val1';
  formDataPersonal: UntypedFormGroup;
  submitted = false;
  saving = false;
  birthdate: Date | null = null;
  maxDate = new Date();
  yearRange = '';
  listCountries: SelectItem[] = [];
  urlBase = environment.images;
  subscription: Subscription;
  imagen: any;
  imagenPreview: any;
  girlAlumnImage: string = this.urlBase + 'images/alumn/alumna.svg';
  boyAlumnImage: string = this.urlBase + 'images/alumn/alumno.svg';
  girlPlayerImage: string = this.urlBase + 'images/player/girl.svg';
  boyPlayerImage: string = this.urlBase + 'images/player/boy.svg';
  role: 'teacher' | 'sport' = 'sport';
  validation: any = new FieldsValidation();
  team: ITeam;
  imageSizeError: boolean = false;
  openCropperDialog: boolean = false;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private appStateQuery: AppStateQuery,
    private playerService: PlayersService,
    public translateService: TranslateService,
    public alerts: AlertsApiService,
    private appStateService: AppStateService,
    private alumnsService: AlumnsService
  ) {
    super(alerts);
  }

  @Input() set playerData(value: any) {
    this.player = value;
    this.loadForm();
    this.birthdate = this.player.date_birth
      ? new Date(this.player.date_birth)
      : null;
  }

  get f() {
    return this.formDataPersonal.controls;
  }

  getAvatar(person: any) {
    if (this.role === 'teacher') {
      if (person?.gender?.code === 'female') {
        return this.girlAlumnImage;
      } else {
        return this.boyAlumnImage;
      }
    } else {
      if (person?.gender?.code === 'female') {
        return this.girlPlayerImage;
      } else {
        return this.boyPlayerImage;
      }
    }
  }

  ngOnInit(): void {
    this.team = this.appStateService.getTeam();
    this.role = localStorage.getItem('role') as 'teacher' | 'sport';
    this.loadCountries();
    this.loadForm();
    const year = moment(new Date(), 'DD/MM/YYYY').year();
    this.yearRange = '1900:' + year;
    if (this.role === 'teacher') {
      this.subscription = this.alumnsService.alumn$.subscribe((res) => {
        setTimeout(() => {
          this.loadForm();
          this.calculateImc();
          this.birthdate = this.player.date_birth
            ? new Date(this.player.date_birth)
            : null;
          this.calculateMaximumHeartRate();
        }, 500);
      });
    }
  }

  ngOnDestroy() {
    if (!this.player.id && !this.submitted) {
      const data = this.formDataPersonal.value;
      this.saveDataLocal.emit(data);
    }
    this.subscription?.unsubscribe();
  }

  public onSubmit() {
    this.submitted = true;
    this.validation.validateStepFields(
      ['full_name', 'gender_id', 'date_birth', 'country_id'],
      this.formDataPersonal
    );
    if (this.formDataPersonal.invalid) {
      return;
    }
    const data = this.formDataPersonal.getRawValue();
    if (!this.player.id) {
      this.nextstep.emit(data);
      return;
    }
    data.id = this.player.id;
    data.team_id = this.team.id;

    if (this.team?.gender_id) {
      data.gender_id = this.team?.gender_id;
    } else {
      data.gender_id = this.formDataPersonal.get('gender_id')?.value || 0;
    }

    const player = Object.assign({}, data);
    this.saving = true;

    if (this.role === 'teacher') {
      this.alumnsService
        .add(player, this.appStateService.getClassroomAcademicYear(), true)
        .then((r: any) => {
          const resp = JSON.parse(r);
          this.alumnsService.setAlumnsDetailsData(
            Object.assign(this.alumnsService.getAlumnsDetailsData(), {
              alumn: JSON.parse(r).data,
            })
          );
          this.saving = false;
          this.alerts.succes(resp.message);
        })
        .catch((error) => {
          this.saving = false;
          this.handleError(
            error,
            this.translateService.instant('PLAYERS.ACTUALIZACIONERROR')
          );
        });
    } else {
      this.playerService
        .add(player, true)
        .then((r: any) => {
          const resp = JSON.parse(r);

          console.log(JSON.parse(r).data);

          this.appStateService.updatePlayer(JSON.parse(r).data);
          this.saving = false;
          this.alerts.succes(resp.message);
        })
        .catch((error) => {
          this.saving = false;
          this.handleError(
            error,
            this.translateService.instant('PLAYERS.ACTUALIZACIONERROR')
          );
        });
    }
  }

  calculateMaximumHeartRate() {
    const data = this.formDataPersonal.value;
    if (data.date_birth && data.gender_id) {
      const year = moment(new Date());
      const date_birth = moment(this.birthdate);
      const years = Number(year.diff(date_birth, 'years'));
      let fm = 0;
      if (data.gender_id === 1) {
        fm = 208.7 - 0.73 * years;
        this.formDataPersonal.controls.max_heart_rate.setValue(fm);
      } else {
        fm = 208.1 - 0.77 * years;
        this.formDataPersonal.controls.max_heart_rate.setValue(fm);
      }
    }
  }

  setBirthdateTimestamp() {
    const TIMESTAMP = new Date(this.birthdate!).getTime();
    this.formDataPersonal.patchValue({ date_birth: TIMESTAMP });
  }

  preview(file: File) {
    if (!file) {
      return;
    }
    const mimeType = file.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }

    const maxSizeInBytes = 1048576; // 1 MB en bytes
    const fileSizeInBytes = file.size;

    if (fileSizeInBytes > maxSizeInBytes) {
      this.imageSizeError = true;
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      this.imagenPreview = { url: reader.result, id: null };
      this.imageSizeError = false;
    };
  }

  async fileUpload(file: File) {
    this.imagen = file;
    this.preview(file);
    this.formDataPersonal.patchValue({ image: file });

    this.openCropperDialog = false;
  }

  calculateImc() {
    const data = this.formDataPersonal.value;
    if (data.height && data.weight) {
      const imc = data.weight / Math.pow(data.height / 100, 2);
      this.formDataPersonal.controls.imc.setValue(imc);
    }
  }

  private loadCountries() {
    this.listCountries = [];
    this.listCountriesAll.map((r: any) => {
      this.listCountries.push({ label: r.emoji + ' ' + r.name, value: r.id });
    });
  }

  private loadForm() {
    const gender = this.team?.gender_id || this.player?.gender_id;
    this.formDataPersonal = this.formBuilder.group({
      full_name: [
        this.player && this.player.full_name ? this.player.full_name : null,
        Validators.required,
      ],
      gender_id: [gender, Validators.required],
      gender_identity_id: [
        this.player && this.player.gender_identity_id != null
          ? this.player.gender_identity_id
          : null,
      ],
      date_birth: [
        this.player && this.player.date_birth ? this.player.date_birth : null,
      ],
      country_id: [
        this.player && (this.player.address || this.player.country_id)
          ? this.player.country_id || this.player.address.country_id
          : null,
      ],
      height: [this.player && this.player.height ? this.player.height : null],
      weight: [
        this.player && this.player.weight ? Number(this.player.weight) : null,
      ],
      heart_rate: [
        this.player && this.player.heart_rate ? this.player.heart_rate : null,
      ],
      max_heart_rate: [
        { value: this.player?.max_heart_rate || null, disabled: true },
      ],
      imc: [{ value: this.player?.imc || null, disabled: true }],
      image: [null],
    });

    if ((gender === 1 || gender === 2) && this.team?.gender_id !== 0)
      this.formDataPersonal.get('gender_id')?.disable();
  }
}
