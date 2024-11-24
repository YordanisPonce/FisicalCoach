import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { SelectItem } from '../../../../../_models/selectItem';
import { GeneralService } from '../../../../../_services/general.service';
import { ClubService } from '../../../../../_services/club.service';
import { TeamService } from '../../../../../_services/team.service';
import { SchoolService } from 'src/app/_services/school.service';
import { Club } from '../../../../../_models/club';
import { AppStateQuery } from '../../../../../stateManagement/appState.query';
import { Subscription } from 'rxjs';
import { AppStateService } from '../../../../../stateManagement/appState.service';
import { AlertsApiService } from 'src/app/generals-services/alerts-api.service';

@Component({
  selector: 'app-steps-members',
  templateUrl: './steps-members.component.html',
  styleUrls: ['./steps-members.component.scss'],
})
export class StepsMembersComponent implements OnInit, OnDestroy {
  items: any[] = [];
  @Input() data: any = {};
  @Input() listJobArea: SelectItem[] = [];
  @Input() listGender: SelectItem[] = [];
  @Input() view: boolean;
  @Output() save: EventEmitter<any> = new EventEmitter<any>();
  step: number = 1;
  listCountries: SelectItem[] = [];
  listLevel: SelectItem[] = [];
  listAllCountries: any[] = [];
  formData = {} as any;
  club: Club;
  team: any;
  subs: Subscription;
  steps: any[];
  idCountry: number;
  saving = false;
  language: string | null = 'es';
  @Input() member: 'team' | 'club' | 'teacher' = 'club';

  constructor(
    private generalService: GeneralService,
    private appStateQuery: AppStateQuery,
    private clubService: ClubService,
    private teamService: TeamService,
    private schoolService: SchoolService,
    private appStateService: AppStateService,
    public alerts: AlertsApiService
  ) {}

  ngOnDestroy(): void {
    if (this.subs) {
      this.subs.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.language = localStorage.getItem('languaje')
      ? localStorage.getItem('languaje')
      : 'es';
    this.loadSteps();
    if (this.member === 'team') {
      this.subs = this.appStateQuery.team$.subscribe((res) => {
        this.team = res;
      });
    } else {
      this.subs = this.appStateQuery.club$.subscribe((res) => {
        this.club = res;
      });
    }
    this.items = [
      { label: 'Step 1' },
      { label: 'Step 2' },
      { label: 'Step 3' },
    ];
    this.loadList();
  }

  loadList() {
    this.generalService.getCountry().subscribe((res) => {
      const list: any = [];
      res.data.map((r: any) => {
        list.push({ label: r.name, value: r.id });
      });
      this.listCountries = list;
      this.listAllCountries = res.data;
    });
    this.generalService.getListStudy().subscribe((r) => {
      r.data.map((m: any) => {
        this.listLevel.push({ label: m.name, value: m.id });
      });
    });
  }

  nextStep(event: any) {
    const id = this.step;
    this.steps[id].disabled = false;
    if (id === 1) {
      this.idCountry = event.country_id;
    }
    if (id > 1 && this.steps.filter((x) => x.disabled).length > 0) {
      this.steps.map((x) => {
        x.disabled = false;
      });
    }
    this.formData = Object.assign(this.formData, event ? event : this.data);
    this.data = Object.assign(this.data, this.formData);
    if (this.data && !this.data.id) {
      this.data = Object.assign({}, this.formData);
    }
    this.step++;
  }

  saveclubMember() {
    if (this.data && this.data.id) {
      this.clubService
        .updateMember(this.formData, this.club.id, this.data.id)
        .then((r) => {
          this.save.emit(this.formData);
        })
        .catch((data) => {
          const parseError = JSON.parse(data);
          this.saving = false;
          this.alerts.error(parseError);
        });
    } else {
      this.clubService
        .addMember(this.formData, this.club, true)
        .then((r) => {
          this.save.emit(this.formData);
          const club = Object.assign({}, this.club);
          club.users_count = club.users_count++;
          this.appStateService.setClubEdit(club);
        })
        .catch((data) => {
          const parseError = JSON.parse(data);
          this.saving = false;
          this.alerts.error(parseError);
        });
    }
  }

  saveTeamMember() {
    if (this.data && this.data.id) {
      this.teamService
        .updateMember(this.formData, this.team.id, this.data.id)
        .then((r) => {
          this.save.emit(this.formData);
        })
        .catch(({ error }) => {
          this.saving = false;
          this.alerts.error(error);
        });
    } else {
      this.teamService
        .addMember(this.formData, this.team, true)
        .then((r) => {
          this.save.emit(this.formData);
        })
        .catch(({ error }) => {
          this.saving = false;
          this.alerts.error(error);
        });
    }
  }

  saveSchoolteacher() {
    if (this.data && this.data.id) {
      this.schoolService
        .updateTeacher(
          this.formData,
          this.appStateService.getSchool().id,
          this.data.id
        )
        .then((r) => {
          this.save.emit(this.formData);
        })
        .catch(({ error }) => {
          this.saving = false;
          this.alerts.error(error);
        });
    } else {
      this.schoolService
        .addTeacher(this.formData, this.appStateService.getSchool().id, true)
        .then((r) => {
          this.save.emit(this.formData);
        })
        .catch(({ error }) => {
          this.saving = false;
          this.alerts.error(error);
        });
    }
  }

  onSubmit(event: any) {
    this.formData = Object.assign(this.formData, event);

    if (
      this.formData.responsibility === '' ||
      this.formData.responsibility === null
    ) {
      const { responsibility, ...data } = this.formData;
      this.formData = data;
    }
    this.saving = true;
    if (this.member === 'teacher') {
      this.saveSchoolteacher();
    } else {
      if (this.member === 'team') {
        this.saveTeamMember();
      } else {
        this.saveclubMember();
      }
    }
  }

  goBack() {
    this.step--;
  }
  selectItem(id: number) {
    this.step = id;
  }
  loadSteps() {
    const spanish = this.language === 'es';
    this.steps = [
      {
        title: spanish ? 'Datos personales' : 'Personal information',
        subtitle: spanish ? 'Ingresar datos personales' : 'Enter personal data',
        contentTitle: spanish
          ? 'Ingresa los datos personales'
          : 'Ingresa los datos personales',
        icon: 'datos-personales-innactive.png',
        icon_active: 'datos-personales-active.png',
        selected: true,
        disabled: false,
      },
      {
        title: spanish ? 'Datos de contacto' : 'Contact information',
        subtitle: spanish
          ? 'Ingresar datos de contacto'
          : 'Enter contact details',
        contentTitle: spanish
          ? 'Ingrese los datos de contacto'
          : 'Enter contact details',
        icon: 'datos-contacto-innactive.png',
        icon_active: 'datos-contacto-active.png',
        selected: true,
        disabled: this.data && this.data.id ? false : true,
      },
      {
        title: spanish ? 'Datos Laborales' : 'Labor data',
        subtitle: spanish ? 'Ingresar los datos laborales' : 'Enter work data',
        contentTitle: spanish
          ? 'Ingresar los datos laborales'
          : 'Enter work data',
        icon: 'datos-laborales-innactive.png',
        icon_active: 'datos-laborales-active.png',
        selected: true,
        disabled: this.data && this.data.id ? false : true,
      },
      {
        title: spanish ? 'Info adicional' : 'Additional information',
        subtitle: spanish ? 'Información adicional' : 'Additional information',
        contentTitle: spanish
          ? 'Información del miembro'
          : 'Member information',
        icon: 'info-adicional-innactive.png',
        icon_active: 'info-adicional-active.png',
        selected: true,
        disabled: this.data && this.data.id ? false : true,
      },
    ];
  }
}
