import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as moment from 'moment';
import { AppStateService } from 'src/app/stateManagement/appState.service';
import { ITeam } from 'src/app/_models/ITeam.interface';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-scouting-match-card',
  templateUrl: './scouting-match-card.component.html',
  styleUrls: ['./scouting-match-card.component.scss'],
})
export class ScoutingMatchCardComponent implements OnInit {
  @Input() match: any;
  @Input() isHistoryView: boolean = false;
  @Output() startScouting: EventEmitter<any> = new EventEmitter();

  urlBase = environment.images;

  team: ITeam;
  showSportsWithPlayers: string[] = [
    'tennis',
    'badminton',
    'padel',
    'swimming',
  ];
  buttonList: { name: string; value: boolean }[] = [];
  selectedButton: string = '';

  constructor(private appStateService: AppStateService) {}

  ngOnInit(): void {
    this.team = this.appStateService.getTeam();

    this.buttonList = [
      {
        name:
          this.match.scouting_status === 'STARTED' ||
          this.match.scouting_status === 'PAUSED'
            ? 'restartScouting'
            : 'makeScouting',
        value: true,
      },
      { name: 'registerStatistics', value: false },
    ];
  }

  handleScouting(
    isStarted: boolean,
    match: any,
    goToStatistics: boolean = false
  ): void {
    this.startScouting.emit({ isStarted, match, goToStatistics });
  }

  /**
   * get date from server and convert with moment
   * @param date string
   * @param type string
   * @returns date or hours
   */
  convertDate(date: string, type: string): string {
    const convert =
      type === 'date'
        ? moment(new Date(date)).format('DD/MM/YYYY')
        : moment.utc(new Date(date)).format('hh:mm');

    return convert;
  }
}
