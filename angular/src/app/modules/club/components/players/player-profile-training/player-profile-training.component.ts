import { Component, OnDestroy, OnInit } from '@angular/core';
import { PlayersService } from '../../../../../_services/players.service';
import { AppStateService } from '../../../../../stateManagement/appState.service';
import { AppStateQuery } from '../../../../../stateManagement/appState.query';
import { Subscription } from 'rxjs';
import { IResponseListRest } from '../../../../../_models/IResponseListRest';
import { TraininLoad } from '../../../../../_models/trainigLoad';
import { Router } from '@angular/router';
import { ITeam } from '../../../../../_models/ITeam.interface';
import {
  FootBallMatchResults,
  Match,
} from '../../../../../_models/competition';
import { ScoutingService } from '../../../../../_services/scouting.service';
import { AlertsApiService } from '../../../../../generals-services/alerts-api.service';

@Component({
  selector: 'app-player-profile-training',
  templateUrl: './player-profile-training.component.html',
  styleUrls: ['./player-profile-training.component.scss'],
})
export class PlayerProfileTrainingComponent implements OnInit, OnDestroy {
  list: TraininLoad[] = [];
  visible: boolean = false;
  player: any;
  subs: Subscription;
  statistics: any[] = [];

  constructor(
    private playersService: PlayersService,
    private appStateQuery: AppStateQuery,
    private router: Router,
    public appStateService: AppStateService
  ) {}

  ngOnInit(): void {
    this.subs = this.appStateQuery.player$.subscribe((res) => {
      this.player = this.appStateService.getPlayer();
      this.getTrainingLoad();
      this.getTrainingLoadPeriod();
    });
  }

  ngOnDestroy() {
    this.subs?.unsubscribe();
  }

  goToExercise(event: any) {
    this.router.navigate([
      '/club/training-sessions/details/' + event?.exercise_session?.code,
    ]);
  }

  verSessiones() {
    this.router.navigate(['/club/training-sessions']);
  }

  private getTrainingLoad() {
    this.playersService
      .getTrainingLoad('player', this.player.id)
      .subscribe((res: IResponseListRest<TraininLoad>) => {
        this.list = res.data;
      });
  }

  private getTrainingLoadPeriod() {
    this.playersService
      .getTrainingLoadPeriod('player', this.player.id)
      .subscribe((res: IResponseListRest<TraininLoad>) => {
        this.statistics = res.data;
      });
  }
}
