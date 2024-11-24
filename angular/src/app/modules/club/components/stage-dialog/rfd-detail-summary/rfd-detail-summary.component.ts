import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-rfd-detail-summary',
  templateUrl: './rfd-detail-summary.component.html',
  styleUrls: ['./rfd-detail-summary.component.scss'],
})
export class RfdDetailSummaryComponent implements OnInit {
  @Input() visible: boolean = false;
  @Input() loadingClosedPhase: boolean = false;
  @Input() previousAnswers: any;
  @Input() phase: any;
  @Input() categoryQuestions: any[] = [];
  @Input() index: number = 0;
  @Output() close = new EventEmitter<boolean>();
  @Output() editPhase = new EventEmitter<boolean>();

  constructor() {}

  closeDialog() {
    this.close.emit(false);
  }

  ngOnInit(): void {}

  /**
   * go to phase answers
   */
  goToEdit(): void {
    this.editPhase.emit(true);
  }
}
