import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { resourcesUrl } from 'src/app/utils/resources';

@Component({
  selector: 'app-close-scouting-dialog',
  templateUrl: './close-scouting-dialog.component.html',
  styleUrls: ['./close-scouting-dialog.component.scss'],
})
export class CloseScoutingDialogComponent implements OnInit {
  constructor() {}

  @Input() visible: boolean = false;
  @Input() sportCode: string = '';
  @Input() loading: boolean = false;
  @Input() time: number = 0;
  @Output() close = new EventEmitter<boolean>();
  @Output() finishScouting = new EventEmitter<any>();

  submit: boolean = false;
  errorMessage: string = '';
  resources = resourcesUrl;
  finalTimer: string = '00:00';

  ngOnInit(): void {
    this.finalTimer = this.convertSecondsToMinutes(this.time);
  }

  closeDialog(): void {
    this.close.emit(false);
  }

  convertSecondsToMinutes(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = remainingSeconds.toString().padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
  }

  /**
   * finalize scouting
   */
  handleScouting(): void {
    if (this.sportCode === 'swimming') {
      this.submit = true;

      if (this.submit && !this.finalTimer) {
        this.errorMessage = 'LBL_FIELD_REQUIRED';
      } else {
        this.submit = false;
        this.finishScouting.emit(this.finalTimer);
      }
    } else {
      this.finishScouting.emit(false);
    }
  }
}
