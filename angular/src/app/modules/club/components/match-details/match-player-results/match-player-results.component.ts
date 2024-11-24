import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-match-player-results',
  templateUrl: './match-player-results.component.html',
  styleUrls: ['./match-player-results.component.scss'],
})
export class MatchPlayerResultsComponent implements OnInit {
  @Input() playerStatistics: any[] = [];
  @Input() playerName: string;
  @Input() visible: boolean;

  @Output() close: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() {}

  ngOnInit(): void {}

  closeDialog(): void {
    this.close.emit(false);
  }
}
