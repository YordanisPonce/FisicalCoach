import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { PlayersService } from '../../../../../../_services/players.service';
import { forkJoin, Subscription } from 'rxjs';
import { Player } from '../../../../../../_models/player';
import { AppStateQuery } from '../../../../../../stateManagement/appState.query';
import { AlertsApiService } from '../../../../../../generals-services/alerts-api.service';
import { AlumnsService } from 'src/app/_services/alumns.service';
import { TranslateService } from '@ngx-translate/core';
import moment from 'moment';

@Component({
  selector: 'app-player-health-information-data',
  templateUrl: './player-health-information-data.component.html',
  styleUrls: ['./player-health-information-data.component.scss'],
})
export class PlayerHealthInformationDataComponent implements OnInit, OnDestroy {
  player: Player;
  checked: any = true;
  selectedValue: any = true;
  formHealth: UntypedFormGroup;
  submitted = false;
  alergias: any[] = [];
  medicinas: any[] = [];
  problemasfisicos: any[] = [];
  enfermedades: any[] = [];
  tabaco: any[] = [];
  alcohol: any[] = [];
  modalOperacion: boolean = false;
  subsPlayer: Subscription;
  maxDate: Date = new Date();
  surgeries: any[] = [];
  formHealthSur: UntypedFormGroup;
  submittedSurg = false;
  role: 'teacher' | 'sport' = 'sport';
  saving: boolean = false;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private appStateQuery: AppStateQuery,
    private playersService: PlayersService,
    private translateService: TranslateService,
    private alumnsService: AlumnsService,
    private alerts: AlertsApiService
  ) {}

  get f() {
    return this.formHealth.controls;
  }

  get fSug() {
    return this.formHealthSur.controls;
  }

  ngOnInit(): void {
    this.role = localStorage.getItem('role') as 'teacher' | 'sport';
    const subs =
      this.role === 'teacher'
        ? this.alumnsService.alumn$
        : this.appStateQuery.player$;
    this.subsPlayer = subs.subscribe((res) => {
      this.player = this.role === 'teacher' ? res.alumn : res;
      if (this.player?.id) {
        this.cagarListados();
      }
    });
  }

  cagarListados() {
    const service =
      this.role === 'teacher' ? this.alumnsService : this.playersService;
    forkJoin(
      this.playersService.getListDiseases(),
      this.playersService.getListAllergies(),
      this.playersService.getListPhysicalProblems(),
      this.playersService.getListTypeMedicines(),
      this.playersService.getListTobaccoConsumptions(),
      this.playersService.getListAlcoholConsumptions(),
      service.getHealthStatus(String(this.player.id))
    ).subscribe(
      ([
        enfermedades,
        alergias,
        problemasFisicos,
        medicinas,
        tabaco,
        alcohol,
        healtStatus,
      ]) => {
        this.enfermedades = enfermedades.data;
        this.alergias = alergias.data;
        this.problemasfisicos = problemasFisicos.data;
        this.medicinas = medicinas.data;
        this.tabaco = tabaco.data;
        this.alcohol = alcohol.data;
        this.loadForm((healtStatus as any).data);
      }
    );
  }

  loadForm(data: any) {
    this.formHealth = this.formBuilder.group({
      id: [null],
      diseases: [null],
      IsDiseases: [null],
      allergies: [null],
      IsAllergies: [null],
      IsBody_areas: [null],
      body_areas: [null],
      physical_problems: [null],
      IsPhysical_problems: [null],
      IsMedicine_types: [null],
      medicine_types: [null],
      tobacco_consumptions: [null],
      alcohol_consumptions: [null],
    });
    this.formHealth.controls.id.setValue(data.id);
    if (data.alcohol_consumptions) {
      this.formHealth.controls.alcohol_consumptions.setValue(
        data.alcohol_consumptions.id
      );
    }
    if (data.tobacco_consumptions) {
      this.formHealth.controls.tobacco_consumptions.setValue(
        data.tobacco_consumptions.id
      );
    }
    if (data.diseases && data.diseases.length > 0) {
      this.formHealth.controls.IsDiseases.setValue(true);
      const list = data.diseases.map((x: any) => {
        return x.id;
      });
      this.formHealth.controls.diseases.setValue(list);
    }
    if (data.allergies && data.allergies.length > 0) {
      this.formHealth.controls.IsAllergies.setValue(true);
      const list = data.allergies.map((x: any) => {
        return x.id;
      });
      this.formHealth.controls.allergies.setValue(list);
    }
    if (data.physical_problems && data.physical_problems.length > 0) {
      this.formHealth.controls.IsPhysical_problems.setValue(true);
      const list = data.physical_problems.map((x: any) => {
        return x.id;
      });
      this.formHealth.controls.physical_problems.setValue(list);
    }
    if (data.medicine_types && data.medicine_types.length > 0) {
      this.formHealth.controls.IsMedicine_types.setValue(true);
      const list = data.medicine_types.map((x: any) => {
        return x.id;
      });
      this.formHealth.controls.medicine_types.setValue(list);
    }
    if (data.surgeries && data.surgeries.length > 0) {
      this.formHealth.controls.IsBody_areas.setValue(true);
      this.surgeries = data.surgeries;
    }
    // surgeries: []
  }

  onSubmit() {
    this.submitted = true;
    const dataForm = this.formHealth.value;
    const data = {} as any;
    data.id = dataForm.id;
    data.diseases = dataForm.diseases;
    data.allergies = dataForm.allergies;
    data.physical_problems = dataForm.physical_problems;
    data.medicine_types = dataForm.medicine_types;
    data.tobacco_consumptions = dataForm.tobacco_consumptions;
    data.alcohol_consumptions = dataForm.alcohol_consumptions;
    data.surgeries = this.surgeries;
    this.saving = true;

    this.alumnsService
      .addHealthStatus(String(this.player.id), data)
      .subscribe((res) => {
        this.alerts.succes(
          this.translateService.instant('PLAYERS.infoactualizada')
        );
        this.saving = false;
      });
  }

  aniadirOperacion() {
    this.modalOperacion = true;
    this.formHealthSur = this.formBuilder.group({
      player_id: [this.player.id],
      disease_id: [null],
      disease: [null, Validators.required],
      surgery_date: [null, Validators.required],
    });
  }

  ngOnDestroy(): void {
    if (this.subsPlayer) {
      this.subsPlayer.unsubscribe();
    }
  }

  changeDiseases(event: any) {
    if (!event.checked) {
      this.formHealth.controls.diseases.setValue([]);
    }
  }

  changeAllegies(event: any) {
    if (!event.checked) {
      this.formHealth.controls.allergies.setValue([]);
    }
  }

  changePhysicalProblems(event: any) {
    if (!event.checked) {
      this.formHealth.controls.physical_problems.setValue([]);
    }
  }

  changeMedicineTypes(event: any) {
    if (!event.checked) {
      this.formHealth.controls.medicine_types.setValue([]);
    }
  }

  closeModal() {
    this.submittedSurg = false;
    this.formHealthSur.reset();
  }

  addsurgeries() {
    this.submittedSurg = true;
    if (this.formHealthSur.invalid) {
      return;
    }
    const temp = this.formHealthSur.value;
    const tempDate = temp.surgery_date.split('/');
    const surgery_date = `${tempDate[1]}/${tempDate[0]}/${tempDate[2]}`;

    this.modalOperacion = false;
    const obj = {} as any;
    obj.player_id = temp.player_id;
    obj.disease_id = temp.disease.id;
    obj.disease = temp.disease;
    obj.surgery_date = surgery_date;
    this.surgeries.push(obj);
  }
}
