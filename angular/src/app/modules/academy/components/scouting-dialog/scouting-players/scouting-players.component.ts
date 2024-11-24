import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AlertsApiService } from 'src/app/generals-services/alerts-api.service';
import { AppStateService } from 'src/app/stateManagement/appState.service';
import { MatchPlayer, Player } from 'src/app/_models/player';
import { ScoutingService } from 'src/app/_services/scouting.service';
import { ScoutingDialogComponent } from '../scouting-dialog.component';

@Component({
  selector: 'app-scouting-players',
  templateUrl: './scouting-players.component.html',
})
export class ScoutingPlayers extends ScoutingDialogComponent implements OnInit {
  @Input() matchPlayers: MatchPlayer[];
  @Input() sportCode: string;
  @Input() headlineIds: number[];
  @Input() alternateIds: number[];
  @Input() substitutionPlayers: string[];
  @Output() setHeadlinePlayers: EventEmitter<any[]> = new EventEmitter<any[]>();
  @Output() setAlternatePlayers: EventEmitter<any[]> = new EventEmitter<
    any[]
  >();
  @Output() setMatchPlayers: EventEmitter<any[]> = new EventEmitter<any[]>();

  allPlayers = ['baseball', 'tennis', 'padel', 'badminton', 'swimming'];

  constructor(
    public scoutingService: ScoutingService,
    public appStateService: AppStateService,
    public translateService: TranslateService,
    public msg: AlertsApiService,
    public router: Router
  ) {
    super(scoutingService, appStateService, translateService, msg, router);
  }

  ngOnInit(): void {
    if (this.substitutionPlayers.includes(this.sportCode)) {
      let headlinePlayers: any = [];
      let alternatePlayers: any = [];

      this.matchPlayers.forEach((player: any) => {
        if (this.headlineIds.includes(player.lineup_player_type_id)) {
          player.isSubstituted = false;
          headlinePlayers = [...headlinePlayers, player];
        }
        if (this.alternateIds.includes(player.lineup_player_type_id)) {
          player.isSubstituted = false;
          alternatePlayers = [...alternatePlayers, player];
        }
      });

      this.setHeadlinePlayers.emit(headlinePlayers);
      this.setAlternatePlayers.emit(alternatePlayers);
    }

    if (this.allPlayers.includes(this.sportCode)) {
      this.setHeadlinePlayers.emit(this.matchPlayers);
    }
  }
}
