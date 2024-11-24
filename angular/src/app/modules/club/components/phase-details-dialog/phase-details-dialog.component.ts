import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'phase-details-dialog',
  templateUrl: './phase-details-dialog.component.html',
  styleUrls: ['./phase-details-dialog.component.scss']
})
export class PhaseDetailsDialogComponent implements OnInit {

  constructor() { }

  players = [
    {
      lessonDay: '17/07/2021',
      name: 'Carlos Agustin',
      activeLesson: true,
      lessonType: 'Cartilaginosa',
      historyRFD: '1',
      actions: ''
    },
    {
      lessonDay: '17/07/2021',
      name: 'Carlos Agustin',
      activeLesson: false,
      lessonType: 'Cartilaginosa',
      historyRFD: '1',
      actions: ''
    },
  ]

  @Input() visible:boolean = false
  @Output() close = new EventEmitter<boolean>()

  closeDialog(){
    // this.advancedDialog = false
    this.close.emit(false)
  }

  ngOnInit(): void {
  }

}
