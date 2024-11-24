import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { AppStateService } from 'src/app/stateManagement/appState.service';
import { ITeam } from 'src/app/_models/ITeam.interface';
import { resourcesUrl } from 'src/app/utils/resources';

@Component({
  selector: 'app-confirm-scouting-dialog',
  templateUrl: './confirm-scouting-dialog.component.html',
  styleUrls: ['./confirm-scouting-dialog.component.scss'],
})
export class ConfirmScoutingDialogComponent implements OnInit, OnDestroy {
  constructor(private appStateService: AppStateService) {}

  @Input() visible: boolean = false;
  @Input() match_id: number;
  @Input() matchInfo: any;
  @Output() startScouting = new EventEmitter<{
    matchId: number;
    start_match?: string;
    sets?: number;
  }>();
  @Output() refreshDialog = new EventEmitter<boolean>();
  @Output() close = new EventEmitter<boolean>();

  subs = new Subscription();
  team: ITeam;
  loading: boolean = false;
  selectedTeamToStart: string;
  showTeamsToStart: string[] = [
    'baseball',
    'cricket',
    'tennis',
    'badminton',
    'padel',
    'volleyball',
    'beach_volleyball',
  ];

  selectedSet: number = 0;
  resources = resourcesUrl;

  ngOnInit(): void {
    this.team = this.appStateService.getTeam();
  }

  closeDialog(): void {
    this.refreshDialog.emit(true);
  }

  /**
   * initialize scouting
   */
  handleScouting(): void {
    this.loading = true;

    if (this.selectedTeamToStart) {
      const data: {
        matchId: number;
        start_match?: string;
        sets?: number;
      } = {
        matchId: this.match_id,
        start_match: this.selectedTeamToStart,
        sets: this.selectedSet,
      };

      this.startScouting.emit(data);
    } else {
      this.getScoutingStatus();
    }
  }

  /**
   * handle scouting status
   */
  getScoutingStatus(): void {
    this.startScouting.emit({
      matchId: this.match_id,
    });
  }

  /**
   * select team to start
   */
  selectTeam(match_start: string): void {
    if (match_start === 'L' && this.selectedTeamToStart === 'L') {
      this.selectedTeamToStart = '';
    } else if (match_start === 'V' && this.selectedTeamToStart === 'V') {
      this.selectedTeamToStart = '';
    } else {
      this.selectedTeamToStart = match_start;
    }
  }

  /**
   * tennis set
   */
  selectTennisSet(setType: number): void {
    this.selectedSet = setType;
  }

  ngOnDestroy(): void {
    if (this.subs) this.subs.unsubscribe();
  }
}
