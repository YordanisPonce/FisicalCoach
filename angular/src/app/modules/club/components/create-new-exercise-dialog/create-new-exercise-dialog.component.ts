import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { AlertsApiService } from 'src/app/generals-services/alerts-api.service';
import { Supplement } from 'src/app/_models/nutrition';
import { NutritionService } from 'src/app/_services/nutrition.service';

@Component({
  selector: 'app-create-new-exercise-dialog',
  templateUrl: './create-new-exercise-dialog.component.html',
  styleUrls: ['./create-new-exercise-dialog.component.scss']
})
export class CreateNewExerciseDialogComponent implements OnInit {

  constructor(
    public msg: AlertsApiService,
    private nutritionService: NutritionService
  ) {
  }

  @Input() visible: boolean = false
  @Output() close = new EventEmitter<boolean>()
  @Output() supplementsSelected = new EventEmitter<Supplement[]>()
  @Output() otherSupplements = new EventEmitter<string>()


  other: string = '';
  selectedSupplements: Supplement[] = [];
  supplements: Supplement[];

  getScreenWidth(): any {
    return screen.width
  }

  closeDialog() {
    this.close.emit(false)
  }

  ngOnInit(): void {
    this.getSupplements();
  }

  /**
   * get Supplements
   */
  getSupplements(): void {
    this.nutritionService.getSupplements().subscribe(res => {
      this.supplements = res.data;
    })
  }

  /**
   * select supplements
   */
  handleSupplements(supplement: any): void {

    if (!this.selectedSupplements.includes(supplement))
    {
      this.selectedSupplements.push(supplement);
    } else
    {
      this.selectedSupplements = this.selectedSupplements.filter((item: any) => item.id !== supplement.id);
    }

  }

  /**
   * Save selected supplements
   */
  saveSupplements(): void {
    this.otherSupplements.emit(this.other);
    this.supplementsSelected.emit(this.selectedSupplements);
    this.close.emit(false);
  }
}
