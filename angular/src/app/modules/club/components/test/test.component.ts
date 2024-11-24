import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppStateService } from 'src/app/stateManagement/appState.service';
import { Club } from 'src/app/_models/club';
import { ITeam } from 'src/app/_models/ITeam.interface';
import { Player } from 'src/app/_models/player';
import { PlayersService } from 'src/app/_services/players.service';
import { TestService } from 'src/app/_services/test.service';
import { environment } from 'src/environments/environment';
import { AppStateQuery } from '../../../../stateManagement/appState.query';
import { PermissionMethods } from 'src/app/_directivas/user-permission.directive';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
})
export class TestComponent implements OnInit, OnDestroy {
  players: Player[] = [];
  newTest: boolean = false;
  subs = new Subscription();
  team: ITeam;
  club: Club;
  playerList: Player[] = [];
  selectedPlayerList: Player[] = [];
  loadingPlayers: boolean = false;
  searchPlayer: string;
  imagesUrl: string = environment.images;
  role: string;
  subsTestPlayer!: Subscription;
  showPermission: PermissionMethods;

  constructor(private playerService: PlayersService,
    private appStateService: AppStateService,
    private appStateQuery: AppStateQuery,
    private testService: TestService) {
  }

  ngOnInit(): void {
    this.playerToTestFromPlayerList();
    this.role = localStorage.getItem('role') as string;
    this.team = this.appStateService.getTeam();
    this.getPlayers();
  }

  /**
   * player list
   */
  getPlayers(): void {
    this.loadingPlayers = true;
    const typeRole =
      this.role === 'sport'
        ? { type: 'team', userType: 'players' }
        : { type: 'classroom', userType: 'alumns' };
    this.subs = this.testService
      .getTestPlayers(this.team.id, typeRole)
      .subscribe((res) => {
        this.players = res.data;
        this.playerList = res.data;
        this.loadingPlayers = false;
      });
  }

  /**
   * Filter Player
   * @param e Event
   */
  setValue(e: KeyboardEvent) {
    const filterCompetition = this.players?.filter((item) =>
      item.full_name?.toLowerCase().includes(this.searchPlayer)
    );
    if (this.searchPlayer.length > 0) {
      this.players = filterCompetition;
    } else {
      this.players = this.playerList;
    }
  }

  /**
   * select test player
   * @param player
   */
  handleTestPlayer(player: Player, openModal: boolean = false): void {
    if (this.selectedPlayerList.includes(player)) {
      this.selectedPlayerList = this.selectedPlayerList.filter(
        (item) => item.id !== player.id
      );
    } else {
      this.selectedPlayerList = [...this.selectedPlayerList, player];

      if (openModal) this.newTest = true;
    }
  }

  /**
   * get players from modal
   */
  handleSelectedPlayersFromModal(e: any): void {
  }

  /**
   * reset players
   */
  resetPlayerList(): void {
    this.selectedPlayerList = [];
    this.getPlayers();
    this.newTest = false;
  }

  handlePermission(permission: PermissionMethods): void {
    this.showPermission = { ...this.showPermission, ...permission };
  }

  ngOnDestroy(): void {
    if (this.subs) {
      this.subs.unsubscribe();
    }
    if (this.subsTestPlayer) {
      this.subsTestPlayer.unsubscribe();
    }
  }

  private playerToTestFromPlayerList() {
    this.subsTestPlayer = this.appStateQuery.playerToTest$.subscribe(res => {
      if (res?.id) {
        this.selectedPlayerList.push(res);
        this.newTest = true;
        this.appStateService.setPlayerToTest(null);
      }
    });
  }
}
