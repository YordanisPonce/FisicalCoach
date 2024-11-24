import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AlertsApiService } from 'src/app/generals-services/alerts-api.service';
import { NutritionService } from 'src/app/_services/nutrition.service';

@Component({
  selector: 'app-create-new-diet-dialog',
  templateUrl: './create-new-diet-dialog.component.html',
  styleUrls: ['./create-new-diet-dialog.component.scss']
})
export class CreateNewDietDialogComponent implements OnInit {

  constructor(
    public msg: AlertsApiService,
    private nutritionService: NutritionService
  ) {
  }

  @Input() visible: boolean = false
  @Output() close = new EventEmitter<boolean>()
  @Output() dietsSelected = new EventEmitter<string[]>()
  @Output() otherDiets = new EventEmitter<string>()


  other: string = '';
  selectedDiets: string[] = [];
  diets: any[] = [];

  getScreenWidth(): any {
    return screen.width
  }

  closeDialog() {
    this.close.emit(false)
  }

  ngOnInit(): void {
    this.getDiets();
  }

  /**
   * get diets
   */
  getDiets(): void {
    this.nutritionService.getDiets().subscribe(res => {
      this.diets = res.data;
    })
  }

  /**
   * select diets
   */
  handleDiets(diets: any): void {

    if (!this.selectedDiets.includes(diets))
    {
      this.selectedDiets.push(diets);
    } else
    {
      this.selectedDiets = this.selectedDiets.filter((item: any) => item.id !== diets.id);
    }

  }

  /**
   * Save selected diets
   */
  saveDiets(): void {
    this.otherDiets.emit(this.other);
    this.dietsSelected.emit(this.selectedDiets);
    this.close.emit(false);
  }
}
