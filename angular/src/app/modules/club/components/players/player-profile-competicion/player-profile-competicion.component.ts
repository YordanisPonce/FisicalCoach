import { Component, OnDestroy, OnInit } from '@angular/core';
import { PlayersService } from '../../../../../_services/players.service';
import { AppStateService } from '../../../../../stateManagement/appState.service';
import { environment } from '../../../../../../environments/environment';
import { Subscription } from 'rxjs';
import { AppStateQuery } from '../../../../../stateManagement/appState.query';
import { FootBallMatchResults } from '../../../../../_models/competition';
import { ScoutingService } from '../../../../../_services/scouting.service';
import { AlertsApiService } from '../../../../../generals-services/alerts-api.service';

@Component({
  selector: 'app-player-profile-competicion',
  templateUrl: './player-profile-competicion.component.html',
  styleUrls: ['./player-profile-competicion.component.scss'],
})
export class PlayerProfileCompeticionComponent implements OnInit, OnDestroy {
  playerTemp: any;
  games: any[] = [];
  urlImages = environment.images;
  visible: any = false;
  loading: boolean = false;
  subs: Subscription;
  dataStatistics: any;
  team: any;
  general_statistics: any;
  general_statistics_list: any[] = [];
  general_statistics_keys: any[] = [];
  playerResultDialog: boolean = false;
  playerStatistics: any[];
  playerName: string;
  $subs = new Subscription();
  matchId: string;
  scoutingResults: FootBallMatchResults;

  constructor(
    private playersService: PlayersService,
    private appStateQuery: AppStateQuery,
    private scoutingService: ScoutingService,
    private msg: AlertsApiService,
    public appStateService: AppStateService
  ) {}

  ngOnInit(): void {
    this.team = this.appStateService.getTeam();
    this.subs = this.appStateQuery.player$.subscribe((res) => {
      this.getData();
    });
  }

  getData() {
    this.loading = true;
    this.playerTemp = this.appStateService.getPlayer();
    this.playersService
      .getStatiticsCompetition(this.playerTemp.id)
      .subscribe((res) => {
        this.dataStatistics = res.data;
        this.games = res.data.competition_matches;
        this.games.map((game: any) => {
          const score = res.data.stats_per_game?.find(
            (x: any) => x.competition_match_id === game.competition_match_id
          );
          game.score = score;
        });

        this.getGeneralStatistics(res);
        this.loading = false;
      });
  }

  getGeneralStatistics(res: any) {
    this.general_statistics = res.data.general_statistics;
    this.general_statistics_keys = Object.keys(this.general_statistics);

    this.general_statistics_keys.map((x: any) => {
      this.general_statistics_list = [
        ...this.general_statistics_list,
        this.general_statistics[x],
      ];
    });
    this.general_statistics_list = this.general_statistics_list
      .filter((x) => x.name && x?.show_player)
      .sort((a: any, b: any) => {
        return a.order - b.order;
      });
  }

  getScoreRival(game: any) {
    if (game?.competition_match?.rivals?.length > 0) {
      return game?.score?.score?.rival_sets_won || 0;
    } else {
      return game?.score?.score?.rival || 0;
    }
  }

  getScoreOwn(game: any) {
    if (game?.competition_match?.rivals?.length > 0) {
      return game?.score?.score?.own_sets_won || 0;
    } else {
      return game?.score?.score?.own || 0;
    }
  }

  showStatics(event: any) {
    this.matchId = event.competition_match_id;
    this.playerResults(event.player_id, this.playerTemp.full_name);
  }

  ngOnDestroy(): void {
    this.subs?.unsubscribe();
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
          this.playerResultDialog = true;
        },
        ({ error }) => {
          this.msg.error(error);
        }
      );
  }
}
