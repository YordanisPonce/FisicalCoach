import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppStateQuery } from '../../../../../stateManagement/appState.query';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { AppStateService } from '../../../../../stateManagement/appState.service';
import { PlayersService } from '../../../../../_services/players.service';
import { PlayerInterface } from '../../../../../_models/PlayerProfile.interface';
import { PlayerBaseComponent } from '../player-base.component';
import { environment } from '../../../../../../environments/environment';
import { ScoutingService } from '../../../../../_services/scouting.service';
import { AlertsApiService } from '../../../../../generals-services/alerts-api.service';

@Component({
  selector: 'app-player-profile-general',
  templateUrl: './player-profile-general.component.html',
  styleUrls: ['./player-profile-general.component.scss'],
})
export class PlayerProfileGeneralComponent
  extends PlayerBaseComponent
  implements OnInit, OnDestroy
{
  subsPlayer: Subscription;
  playerInterface: PlayerInterface = {} as PlayerInterface;
  healthConditions: any[] = [];
  urlImages = environment.images;
  team = this.appStateService.getTeam();

  $subs = new Subscription();

  constructor(
    public appStateQuery: AppStateQuery,
    public playersService: PlayersService,
    private router: Router,
    private msg: AlertsApiService,
    public scoutingService: ScoutingService,
    public appStateService: AppStateService,
    private translateService: TranslateService
  ) {
    super(playersService, appStateService, scoutingService);
  }

  ngOnInit(): void {
    this.loadHealthConditions();
    this.subsPlayer = this.appStateQuery.player$.subscribe((res) => {
      this.getData();
    });
  }

  goToTests() {
    this.router.navigate(['/club/test-details']);
  }

  goToMakeTest() {
    this.appStateService.setPlayerToTest(this.playerInterface.player);
    this.router.navigate(['/club/test']);
  }

  goTo(type: string) {
    let url = '';
    switch (type) {
      case 'injury-prevention':
        url = `club/injury-prevention/record/${this.team.id}/${this.playerInterface.player.id}`;
        break;
      case 'rfd-lesiones':
        url = `club/rfd-injuries`;
        break;
      case 'physiotherapyl':
        url = `club/physiotherapy/detalles/${this.playerInterface.player.id}`;
        break;
      case 'effort-recovery':
        url = `club/effort-recovery/record/${this.playerInterface.player.id}`;
        break;
      case 'nutricion':
        url = `club/nutrition/player/${this.playerInterface.player.id}`;
        break;
      case 'psychology':
        this.appStateService.updatePlayerPsychology$(
          this.playerInterface.player
        );
        url = `club/psychology/detail`;
        break;
      case 'test':
        url = `club/test-details/${this.playerInterface.player.id}`;
        break;
    }
    this.router.navigate([url]);
  }

  goToLastInjury() {
    this.router.navigate(['/club/players/perfil/estado-de-salud']);
  }

  ngOnDestroy(): void {
    this.subsPlayer?.unsubscribe();
  }

  goToCompetition() {
    if (this.playerInterface.last_match?.competition_id) {
      this.router.navigate([
        '/club/competition/details/' +
          this.playerInterface.last_match?.competition_id,
      ]);
    }
  }

  goToMatch() {
    if (!this.matchId) {
      return;
    }
    this.playerResultDialog = true;
  }

  private loadHealthConditions() {
    setTimeout(() => {
      this.healthConditions.push({
        label: 'testprofile',
        key: 'test',
      });
      this.healthConditions.push({
        label: 'injury-prevention',
        key: 'injury-prevention',
      });
      this.healthConditions.push({
        label: 'rfd-lesiones',
        key: 'rfd-lesiones',
      });
      this.healthConditions.push({
        label: 'physiotherapyl',
        key: 'physiotherapyl',
      });
      this.healthConditions.push({
        label: 'effort-recovery',
        key: 'effort-recovery',
      });
      this.healthConditions.push({
        label: 'nutricion',
        key: 'nutricion',
      });
      this.healthConditions.push({
        label: 'psychology',
        key: 'psychology',
      });
    }, 200);
  }
}
