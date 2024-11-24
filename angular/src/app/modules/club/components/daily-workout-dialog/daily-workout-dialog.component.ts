import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

interface City {
  name: string,
  code: string
}

@Component({
  selector: 'daily-workout-dialog',
  templateUrl: './daily-workout-dialog.component.html',
  styleUrls: ['./daily-workout-dialog.component.scss']
})
export class DailyWorkoutDialogComponent implements OnInit {

  constructor() {
    this.cities = [
      { name: 'New York', code: 'NY' },
      { name: 'Rome', code: 'RM' },
      { name: 'London', code: 'LDN' },
      { name: 'Istanbul', code: 'IST' },
      { name: 'Paris', code: 'PRS' }
    ];
  }

  @Input() visible:boolean = false
  @Output() close = new EventEmitter<boolean>()

  cities: City[];
  selectedCity!: any;
  selectedValue: any

  

  closeDialog(){
    // this.advancedDialog = false
    this.close.emit(false)
  }

  ngOnInit(): void {
  }

}
