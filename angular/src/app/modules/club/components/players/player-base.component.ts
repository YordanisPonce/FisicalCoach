import { Injectable } from '@angular/core';
import * as moment from 'moment/moment';
import { PlayerInterface } from '../../../../_models/PlayerProfile.interface';
import { PlayersService } from '../../../../_services/players.service';
import { AppStateService } from '../../../../stateManagement/appState.service';
import { Subscription } from 'rxjs';
import { ScoutingService } from 'src/app/_services/scouting.service';

@Injectable({ providedIn: 'root' })
export abstract class PlayerBaseComponent {
  playerInterface: PlayerInterface = {} as PlayerInterface;
  team: any;
  injuriesHistory: any;
  injuriesImages: any;
  imc: number = 0;
  playerTemp: any;
  player: any;
  playerResultDialog: boolean = false;
  playerStatistics: any[] = [];
  playerName: string;
  $subs = new Subscription();
  matchId: any;
  loadingStatistics: boolean = false;
  loadingData: boolean = false;

  constructor(
    public playersService: PlayersService,
    public appStateService: AppStateService,
    public scoutingService: ScoutingService
  ) {}

  mapInjuryImages(injuryRecord: any) {
    return injuryRecord.map(
      (injury: any) => injury.severity_location.image.full_url
    );
  }

  getData() {
    this.loadingData = true;
    this.team = this.appStateService.getTeam();
    this.playerTemp = this.appStateService.getPlayer();
    this.playersService
      .getResumePlayer(this.team.id, this.playerTemp.id)
      .subscribe((res) => {
        this.playerInterface = res.data;
        this.player = this.playerInterface.player;
        this.injuriesImages = this.mapInjuryImages(
          this.playerInterface.injuries_history
        );
        this.injuriesHistory = this.playerInterface.injuries_history;
        this.playerInterface.player.age = moment().diff(
          this.playerInterface.player.date_birth,
          'years'
        );
        this.matchId = this.playerInterface.last_match?.id;
        this.imc = !this.playerInterface.player.height
          ? 0
          : Number(this.playerInterface.player.weight) /
            Math.pow(Number(this.playerInterface.player.height || 1) / 100, 2);
        this.player.imc = this.imc;

        if (this.matchId)
          this.playerResults(
            this.playerInterface.player.id,
            this.playerInterface.player.full_name
          );

        this.loadingData = false;
      });
  }

  playerResults(playerId: number, playerName: string): void {
    this.$subs = this.scoutingService
      .getPlayerResults(parseInt(this.matchId), playerId)
      .subscribe(
        (res) => {
          const toArray = Object.entries(res.data.statistics);
          const statistics = toArray
            .filter((item: any) => item[1].show)
            .sort((a: any[], b: any[]) => {
              return a[1]?.order - b[1]?.order;
            })
            .map((item: any) => ({
              name: item[1].name,
              value: item[1].value,
              order: item[1].order,
              image: item[1].image?.full_url,
            }));
          this.playerStatistics = statistics;
          this.playerName = playerName;
        },
        ({ error }) => {}
      );
  }
}
