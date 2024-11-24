import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Competition, Match } from 'src/app/_models/competition';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-competition-match-modal',
  templateUrl: './competition-match-modal.component.html',
  styleUrls: ['./competition-match-modal.component.scss']
})
export class CompetitionMatchModalComponent implements OnInit {

  @Input() match: Competition & Match;
  @Input() visible: any = false;
  @Output() close = new EventEmitter<boolean>()
  urlBase = environment.images;

  constructor() { }

  ngOnInit(): void {
  }

  closeModal(): void {
    this.close.emit(false);
  }

}
