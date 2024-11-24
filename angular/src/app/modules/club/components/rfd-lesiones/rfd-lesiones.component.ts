import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { AlertsApiService } from 'src/app/generals-services/alerts-api.service';
import { AppStateService } from 'src/app/stateManagement/appState.service';
import { ITeam } from 'src/app/_models/ITeam.interface';
import { Player } from 'src/app/_models/player';
import { PlayersService } from 'src/app/_services/players.service';
import { environment } from 'src/environments/environment';
import { InjuryService } from '../../../../_services/injury.service';
import { PermissionMethods } from 'src/app/_directivas/user-permission.directive';
import { physiotherapyGeneralFilter } from 'src/app/utils/filterOptions';

@Component({
  selector: 'rfd-lesiones',
  templateUrl: './rfd-lesiones.component.html',
  styleUrls: ['./rfd-lesiones.component.scss'],
})
export class RfdLesionesComponent implements OnInit, OnDestroy {
  constructor(
    private injuryService: InjuryService,
    private playerService: PlayersService,
    private appStateService: AppStateService,
    private msg: AlertsApiService,
    private translateService: TranslateService
  ) {}

  subs = new Subscription();
  players: Player[] = [];
  newRfd: boolean;
  dailyWorkout: boolean;
  team: ITeam;
  selectedPlayerList: Player[] = [];
  selectedPlayer: Player[] = [];
  selectedIndex: any = null;
  searchPlayer: string;
  playerList: Player[] = [];
  resetForm: boolean = false;
  loadingPlayers: boolean = false;
  loadingAction: boolean = false;
  openRFDDialog: boolean = false;
  baseUrl = environment.images;
  resources = environment.images + 'images';
  showPermission: PermissionMethods;
  selectedFilter: any;
  filterOptions: any[] | undefined;

  ngOnInit(): void {
    this.team = this.appStateService.getTeam();
    this.getPlayers(this.team.id);

    this.translateService.get('physiotherapy').subscribe((res) => {
      this.filterOptions = physiotherapyGeneralFilter.map((item) => ({
        ...item,
        label: res[item.code],
        children: item.children.map((child) => ({
          ...child,
          label: res[child.code],
        })),
      }));
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
   * get general player list by team
   */
  getPlayers(id: number): void {
    this.loadingPlayers = true;

    this.injuryService.getPlayerRFD(id).subscribe((res) => {
      this.players = res.data;
      this.playerList = res.data;

      this.loadingPlayers = false;
    });
  }

  /**
   *
   * convert injury date
   */
  converInjuryDate(date: string): string {
    return date ? moment(date).format('DD/MM/YYYY') : 'N/A';
  }

  /**
   * select test player
   * @param player
   */
  handlePlayer(player: Player, index: number): any {
    if (this.selectedIndex === null || this.selectedIndex !== index) {
      this.selectedIndex = index;
      this.selectedPlayer = [player];
      return;
    }

    if (this.selectedIndex === index) {
      this.selectedIndex = null;
      this.selectedPlayer = [];
    }
  }

  /**
   * delete rdf
   */
  deleteRfdInjury(code: string): void {
    this.loadingAction = true;
    this.subs = this.injuryService.deleteRfd(code, this.team.id).subscribe(
      (res) => {
        this.subs = this.translateService
          .get('RFD.deletedRFD')
          .subscribe((res) => this.msg.succes(res));

        this.getPlayers(this.team.id);

        this.loadingAction = false;
      },
      ({ error }) => {
        this.msg.error(error);
        this.loadingAction = false;
      }
    );
  }
  playerImage(player: any) {
    if (!player.player_url) {
      const genderUrl =
        player?.gender === 'female'
          ? this.baseUrl + 'images/player/girl.svg'
          : this.baseUrl + 'images/player/boy.svg';
      return genderUrl;
    } else {
      return this.baseUrl + player.player_url;
    }
  }
  /**
   * open rfd form
   */
  openRFDForm(): void {
    this.openRFDDialog = false;
    this.newRfd = true;
  }

  /**
   * calculate dates
   */
  calculateDiff(rfdDate: string): any {
    const currentDate = moment();

    return `${currentDate.diff(moment(rfdDate), 'days')} `;
  }

  resetPlayerList(): void {
    this.selectedPlayerList = [];
    this.getPlayers(this.team.id);
  }

  handlePermission(permission: PermissionMethods): void {
    this.showPermission = { ...this.showPermission, ...permission };
  }

  handleSelectFilter(): void {
    if (this.selectedFilter.key === '0') {
      this.players = this.playerList;
      this.selectedFilter = null;
      return;
    } else {
      this.players = this.playerList;
      this.players = this.playerList.filter(
        (item) =>
          (this.selectedFilter.code === 'active' &&
            item.injury_status &&
            !item.closed_rfd) ||
          (this.selectedFilter.code === 'inactive' &&
            !item.injury_status &&
            !item.closed_rfd) ||
          (this.selectedFilter.code === 'finished' && item.closed_rfd)
      );
    }
  }

  ngOnDestroy(): void {
    if (this.subs) this.subs.unsubscribe();
  }
}
