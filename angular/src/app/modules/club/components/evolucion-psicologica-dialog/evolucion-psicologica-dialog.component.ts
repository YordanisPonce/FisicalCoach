import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

interface City {
  name: string;
  code: string;
}

@Component({
  selector: 'evolucion-psicologica-dialog',
  templateUrl: './evolucion-psicologica-dialog.component.html',
  styleUrls: ['./evolucion-psicologica-dialog.component.scss'],
})
export class EvolucionPsicologicaDialogComponent implements OnInit {
  step: number = 1;
  @Input() visible: boolean = false;
  @Output() close = new EventEmitter<boolean>();
  questions: any;
  currentQuestion: number = 1;
  valueBar: number = 0;

  selectedValues: string[] = [];
  options: any = [
    {
      label: 'Muy mal',
      value: 'val1',
      selected: false,
    },
    {
      label: 'Mal',
      value: 'val2',
      selected: false,
    },
    {
      label: 'Regular',
      value: 'val3',
      selected: false,
    },
    {
      label: 'Bien',
      value: 'val4',
      selected: false,
    },
    {
      label: 'Muy bien',
      value: 'val5',
      selected: false,
    },
  ];

  constructor() {}

  closeDialog() {
    // this.advancedDialog = false
    this.close.emit(false);
  }

  ngOnInit(): void {}
}
