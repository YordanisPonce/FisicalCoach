import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import {
  UntypedFormGroup,
  UntypedFormControl,
  Validators,
  UntypedFormArray,
} from '@angular/forms';
import { AlertsApiService } from 'src/app/generals-services/alerts-api.service';
import { AppStateService } from 'src/app/stateManagement/appState.service';
import { Diet, Nutrition, Supplement } from 'src/app/_models/nutrition';
import { Player } from 'src/app/_models/player';
import { NutritionService } from 'src/app/_services/nutrition.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-create-sheet-dialog',
  templateUrl: './create-sheet-dialog.component.html',
  styleUrls: ['./create-sheet-dialog.component.scss'],
})
export class CreateSheetDialogComponent implements OnInit {
  constructor(
    private appStateService: AppStateService,
    public msg: AlertsApiService,
    public nutritionService: NutritionService
  ) {
    this.createSheetForm.valueChanges.subscribe((res) => {
      const sumActivity =
        res?.repose +
        res?.very_light +
        res?.light +
        res?.moderate +
        res?.intense;
      this.activityTotal = sumActivity;

      if (sumActivity > 24 || sumActivity < 24) {
        this.disableButton = true;
      } else {
        this.disableButton = false;
      }
    });
  }

  @Input() visible: boolean = false;
  @Input() selectedPlayer: Player[];
  @Output() supplementsSelected = new EventEmitter<string[]>();
  @Output() close = new EventEmitter<boolean>();
  @Output() reloadNutritionData = new EventEmitter<boolean>();

  team: any;
  step: number = 1;
  newExersice: boolean = false;
  newDiet: boolean = false;
  supplementsSelectedList: any[] = [];
  dietSelectedList: any[] = [];
  disableButton: boolean = false;
  activityTotal: number = 0;
  loading: boolean = false;
  createSheetForm = new UntypedFormGroup({
    take_supplements: new UntypedFormControl(true, Validators.required),
    take_diets: new UntypedFormControl(true, Validators.required),
    supplement_name: new UntypedFormControl(''),
    additional_notes: new UntypedFormControl(''),
    other_supplement: new UntypedFormControl(''),
    other_diet: new UntypedFormControl(''),
    repose: new UntypedFormControl(0, [Validators.min(0), Validators.max(24)]),
    very_light: new UntypedFormControl(0, [
      Validators.min(0),
      Validators.max(24),
    ]),
    light: new UntypedFormControl(0, [Validators.min(0), Validators.max(24)]),
    moderate: new UntypedFormControl(0, [
      Validators.min(0),
      Validators.max(24),
    ]),
    intense: new UntypedFormControl(0, [Validators.min(0), Validators.max(24)]),
    supplements: new UntypedFormArray([]),
    diets: new UntypedFormArray([]),
  });
  resources: string = environment.images + 'images/';

  getScreenWidth(): any {
    return screen.width;
  }

  closeDialog() {
    this.close.emit(false);
    this.createSheetForm.reset();
    this.supplements.clear();
    this.diets.clear();
    this.loading = false;

    this.step = 1;
  }

  ngOnInit(): void {
    this.team = this.appStateService.getTeam();
  }

  /**
   * get selected supplements
   */
  get supplements(): UntypedFormArray | any {
    return this.createSheetForm.get('supplements') as UntypedFormArray;
  }

  /**
   * get selected diets
   */
  get diets(): UntypedFormArray | any {
    return this.createSheetForm.get('diets') as UntypedFormArray;
  }

  /**
   * add supplements
   */
  addSupplements(supplements: any): void {
    const supplement: UntypedFormArray = new UntypedFormArray(
      supplements.map((item: any) => new UntypedFormControl(item))
    );
    this.createSheetForm.setControl('supplements', supplement);
  }

  /**
   * add diets
   */
  addDiets(diets: any): void {
    const diet: UntypedFormArray = new UntypedFormArray(
      diets.map((item: any) => new UntypedFormControl(item))
    );
    this.createSheetForm.setControl('diets', diet);
  }

  /**
   * Delete selected supplement
   */
  deleteSupplement(index: number): void {
    this.supplements.removeAt(index);
  }

  /**
   * Delete selected diet
   */
  deleteDiet(index: number): void {
    this.diets.removeAt(index);
  }

  /**
   * clear supplements data if the option is false
   */
  updateSupplements(value: boolean): void {
    if (!value) {
      this.supplements.clear();
      this.createSheetForm.get('other_supplement')?.patchValue('');
    }
  }

  /**
   * clear diets data if the option is false
   */
  updateDiets(value: boolean): void {
    if (!value) {
      this.diets.clear();
      this.createSheetForm.get('other_diet')?.patchValue('');
    }
  }

  /**
   * Submit
   */
  onSubmit(): void {
    this.loading = true;
    const athlete_activity = {
      repose: this.createSheetForm.get('repose')?.value,
      very_light: this.createSheetForm.get('very_light')?.value,
      light: this.createSheetForm.get('light')?.value,
      moderate: this.createSheetForm.get('moderate')?.value,
      intense: this.createSheetForm.get('intense')?.value,
    };

    const nutritionSheetData: Nutrition = {
      take_supplements:
        this.createSheetForm.get('take_supplements')?.value || false,
      take_diets: this.createSheetForm.get('take_diets')?.value || false,
      total_energy_expenditure: 0,
      activity_factor: 0,
      other_supplement:
        this.createSheetForm.get('other_supplement')?.value || '',
      player_id: this.selectedPlayer[0].id,
      team_id: this.team.id,
      other_diet: this.createSheetForm.get('other_diet')?.value || '',
      supplements: this.createSheetForm
        .get('supplements')
        ?.value.map((item: Supplement) => item.id),
      diets: this.createSheetForm
        .get('diets')
        ?.value.map((item: Diet) => item.id),
      athlete_activity,
    };

    this.nutritionService
      .getActivityFactorById({
        ...athlete_activity,
        player_id: this.selectedPlayer[0].id,
      })
      .subscribe(
        (res) => {
          if (res.success) {
            nutritionSheetData.activity_factor = res.data.ActivityFactor;
            nutritionSheetData.total_energy_expenditure =
              res.data.totalEnergyExpenditure;
          }

          this.nutritionService
            .createNutritionSheet(nutritionSheetData)
            .subscribe(
              (res) => {
                this.loading = false;
                this.msg.succes(res.message);
                this.reloadNutritionData.emit(true);
                this.close.emit(false);
              },
              ({ error }) => {
                console.log(error);

                this.msg.error(error);

                this.close.emit(false);
                this.loading = false;
              }
            );
        },
        ({ error }) => {
          console.log(error);
          this.close.emit(false);
          this.loading = false;
          this.msg.error(error);
        }
      );
  }

  closeDg(type: string) {
    if (type === 'exersice') {
      this.newExersice = false;
    }
    if (type === 'diet') {
      this.newDiet = false;
    }
  }
}
