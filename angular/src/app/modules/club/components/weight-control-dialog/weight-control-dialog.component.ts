import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormControl,
  Validators,
} from '@angular/forms';

import { NutritionService } from '../../../../_services/nutrition.service';

import { Player } from 'src/app/_models/player';
import { Weight } from 'src/app/_models/nutrition';
import { AlertsApiService } from 'src/app/generals-services/alerts-api.service';
import { environment } from 'src/environments/environment';
import { ITeam } from 'src/app/_models/ITeam.interface';
import { AppStateService } from 'src/app/stateManagement/appState.service';

interface City {
  name: string;
  code: string;
}

@Component({
  selector: 'weight-control-dialog',
  templateUrl: './weight-control-dialog.component.html',
  styleUrls: ['./weight-control-dialog.component.scss'],
})
export class WeightControlDialogComponent implements OnInit {
  constructor(
    private nutritionService: NutritionService,
    private appStateService: AppStateService,
    public msg: AlertsApiService
  ) {
    this.cities = [
      { name: 'New York', code: 'NY' },
      { name: 'Rome', code: 'RM' },
      { name: 'London', code: 'LDN' },
      { name: 'Istanbul', code: 'IST' },
      { name: 'Paris', code: 'PRS' },
    ];
  }

  step: number = 1;
  @Input() visible: boolean = false;
  @Input() selectedPlayer: Player[];
  @Input() players: Player[];
  @Input() handlePlayerStep: number = 0;
  @Output() close = new EventEmitter<boolean>();
  @Output() refreshPlayerList = new EventEmitter<boolean>();

  cities: City[];
  loading: boolean = false;
  team: ITeam;
  selectedCity!: any;
  selectedValue: any;
  createWeightControlForm = new UntypedFormGroup({
    weight: new UntypedFormControl(null, [
      Validators.required,
      Validators.min(0),
    ]),
  });
  urlBase = environment.images;
  resources = environment.images + 'images';

  closeDialog() {
    // this.advancedDialog = false
    this.close.emit(false);
    this.createWeightControlForm.reset();
  }

  ngOnInit(): void {
    console.log(this.players);
    this.team = this.appStateService.getTeam();
  }

  /***
   * Submit weight control
   */
  onSubmit(): void {
    this.loading = true;
    const player_id = this.players[this.handlePlayerStep].id;

    const data: Weight = {
      player_id,
      weight: this.createWeightControlForm.get('weight')?.value,
      team_id: this.team.id,
    };

    this.nutritionService.createWeightControl(data).subscribe(
      (res: any) => {
        if (res.success) {
          this.loading = false;
          this.close.emit(false);
          this.msg.succes(res.message);
        }
        this.refreshPlayerList.emit(true);
      },
      ({ error }) => {
        this.loading = false;
        this.close.emit(false);
        this.msg.error(error);
      }
    );
  }
}
