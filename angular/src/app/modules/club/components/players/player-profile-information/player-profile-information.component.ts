import { Component, OnDestroy, OnInit } from '@angular/core';
import { GeneralService } from '../../../../../_services/general.service';
import { AppStateQuery } from '../../../../../stateManagement/appState.query';
import { Subscription } from 'rxjs';
import { AppStateService } from '../../../../../stateManagement/appState.service';
import { PlayerBaseComponent } from '../player-base.component';
import { PlayersService } from '../../../../../_services/players.service';
import { ScoutingService } from 'src/app/_services/scouting.service';

@Component({
  selector: 'app-player-profile-information',
  templateUrl: './player-profile-information.component.html',
  styleUrls: ['./player-profile-information.component.scss'],
})
export class PlayerProfileInformationComponent
  extends PlayerBaseComponent
  implements OnInit, OnDestroy
{
  listCountries: any = [];
  listKinships: any = [];
  listLaterality: any = [];
  listGenders: any = [];
  listGendersIdentity: any = [];
  listPositions: any = [];
  listSkill: any = [];
  listPuntuations: any = [];
  subsPlayer: Subscription;

  constructor(
    private generalService: GeneralService,
    private appStateQuery: AppStateQuery,
    public playersService: PlayersService,
    public appStateService: AppStateService,
    public scoutingService: ScoutingService
  ) {
    super(playersService, appStateService, scoutingService);
  }

  ngOnInit(): void {
    this.loadList();
    this.getCurrentPlayerInfo();
  }

  ngOnDestroy(): void {
    this.subsPlayer?.unsubscribe();
  }

  private getCurrentPlayerInfo() {
    this.subsPlayer = this.appStateQuery.player$.subscribe((res) => {
      this.getData();
    });
  }

  private loadList() {
    this.listCountries = this.appStateService.getCountries();
    this.playersService.getListLaterality().subscribe((res) => {
      this.listLaterality = res.data;
    });
    this.generalService.getListGender().subscribe((res) => {
      this.listGenders = res.data;
    });
    this.generalService.getListGenderIdentity().subscribe((res) => {
      this.listGendersIdentity = res.data;
    });
    this.appStateQuery.listPositions$.subscribe((data) => {
      this.listPositions = data;
    });
    this.appStateQuery.listCivilStatus$.subscribe((data) => {
      this.listKinships = data;
    });
    this.appStateQuery.listAnalizePlayer$.subscribe((r) => {
      this.listPuntuations = r.listPuntuations;
      this.listSkill = r.listSkill;
    });
  }
}
