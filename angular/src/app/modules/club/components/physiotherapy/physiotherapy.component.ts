import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AlertsApiService } from 'src/app/generals-services/alerts-api.service';
import { AppStateService } from 'src/app/stateManagement/appState.service';
import { Injury } from 'src/app/_models/injury';
import { Player, PlayerFile } from 'src/app/_models/player';
import { PhysiotherapyService } from 'src/app/_services/fisiotherapy.service';
import { TeamService } from 'src/app/_services/team.service';
import { environment } from 'src/environments/environment';
import { PermissionMethods } from 'src/app/_directivas/user-permission.directive';
import { TranslateService } from '@ngx-translate/core';
import { physiotherapyGeneralFilter } from 'src/app/utils/filterOptions';

@Component({
  selector: 'physiotherapy',
  templateUrl: './physiotherapy.component.html',
  styleUrls: ['./physiotherapy.component.scss'],
})
export class PhysiotherapyComponent implements OnInit {
  constructor(
    private physiotherapyService: PhysiotherapyService,
    private appStateService: AppStateService,
    private teamService: TeamService,
    private translate: TranslateService,
    private msg: AlertsApiService
  ) {}

  selectedPlayer: any = [];
  selectedIndex: any = null;
  selectedPlayerFile: Player[] = [];
  selectedPlayerDailyWork: Player[] = [];
  playerInjuries: Injury[] = [];
  staffList: any[] = [];
  $subscriptions = new Subscription();
  team: any;
  searchPlayer: string;
  loading: boolean = false;
  loadingPlayerFile: boolean = false;
  playerFileDetails: PlayerFile | any;
  players: Player[] = [];
  allPlayers: Player[] = [];
  newTab: boolean = false;
  filterType: any[];
  showEndFileDialog: boolean = false;
  dailyWorkDialog: boolean = false;
  urlBase = environment.images;
  showPermission: PermissionMethods;
  selectedFilter: any;
  filterOptions: any[] | undefined;

  ngOnInit(): void {
    this.team = this.appStateService.getTeam();

    this.getPlayersList(this.team.id, {});
    this.getStaffByTeam(this.team.id);

    this.translate.get('physiotherapy').subscribe((res) => {
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

  closeDialog(): void {
    this.newTab = false;
    this.playerFileDetails = null;
    this.getPlayersList(this.team.id, {});
    this.selectedPlayer = [];
  }

  /**
   * Get players list
   * @param team_id
   */
  getPlayersList(team_id: number, params: {}): void {
    this.loading = true;
    this.$subscriptions = this.physiotherapyService
      .getPlayersList(team_id, params)
      .subscribe((res) => {
        if (res.success) {
          const data = res.data.filter(
            (player: { file_delete_date: string }) => !player.file_delete_date
          );
          this.players = res.data;
          this.allPlayers = res.data;
          this.loading = false;
        }
      });
  }

  /**
   * select Physiotherapy player
   * @param player
   */
  handlePhysiotherapyPlayer(player: Player, index: number): any {
    if (this.selectedIndex === null || this.selectedIndex !== index) {
      this.selectedIndex = index;
      this.selectedPlayer = [player];

      if (player.latest_file_fisiotherapy?.id) {
        this.loadingPlayerFile = true;
        this.$subscriptions = this.physiotherapyService
          .getPlayerFileById(
            this.team.id,
            player.id,
            player.latest_file_fisiotherapy?.id
          )
          .subscribe((res) => {
            this.loadingPlayerFile = false;

            if (res.success) {
              this.playerFileDetails = res.data;
            }
          });
      } else {
        this.playerFileDetails = null;
      }
      return;
    }

    if (this.selectedIndex === index) {
      this.selectedIndex = null;
      this.selectedPlayer = [];
      return;
    }
  }

  /**
   * Get staff by team
   */
  getStaffByTeam(teamId: any): void {
    this.$subscriptions = this.teamService
      .getStaffByTeam(teamId)
      .subscribe((res) => {
        if (res.success) {
          this.staffList = res.data;
        }
      });
  }

  /**
   * filter players
   * @param e
   */
  filterPlayers(e: any): void {
    const value = e.value;
    let params = null;

    // get all players
    if (value.code === 'all') this.getPlayersList(this.team.id, {});

    // get by start date ['asc', 'desc'] and by staff id
    if (value.parent) {
      params = { [value.parent]: value.code };
      this.getPlayersList(this.team.id, params);
    }

    // get by active players
    if (value.isActive && value.code) {
      params = { [value.code]: value.isActive };
      this.getPlayersList(this.team.id, params);
    }
  }

  /**
   * search players
   * @param e Event
   */
  setValue(e: KeyboardEvent) {
    const searchPlayers = this.allPlayers?.filter(
      (item) =>
        item.full_name.toLowerCase().includes(this.searchPlayer) ||
        item.alias.toLowerCase().includes(this.searchPlayer) ||
        item?.file_title?.toLowerCase().includes(this.searchPlayer) ||
        item.shirt_number === parseInt(this.searchPlayer)
    );

    if (this.searchPlayer.length > 0) {
      this.players = searchPlayers;
    } else {
      this.players = this.allPlayers;
    }
  }

  /**
   * Refresh player list after create a tab
   */
  refresPlayerList() {
    this.getPlayersList(this.team.id, {});
    this.selectedIndex = null;
    this.selectedPlayer = [];
  }

  /**
   * go to player details
   */
  goToPlayerDetails(id: number): void {
    this.appStateService.updatePlayerFileId(id);
  }

  /**
   * finish player file
   * @param player
   */
  selectPlayerWithFile(player: Player): void {
    if (!player.latest_file_fisiotherapy?.id) {
      this.msg.error('Debes crear una ficha primero');
    } else {
      this.selectedPlayerFile = [player];
      this.showEndFileDialog = true;
    }
  }

  /**
   * add daily work player file
   * @param player
   */
  selectPlayerDailyWork(player: Player): void {
    if (!player.latest_file_fisiotherapy?.id) {
      this.msg.error('Debes crear una ficha primero');
    } else {
      this.selectedPlayerDailyWork = [player];
      this.dailyWorkDialog = true;
    }
  }

  /** close Player Dialog */
  closePlayerDialog(): void {
    this.selectedPlayerFile = [];
    this.selectedPlayerDailyWork = [];
    this.showEndFileDialog = false;
    this.dailyWorkDialog = false;
  }

  handleSelectFilter(): void {
    if (this.selectedFilter.key === '0') {
      this.players = this.allPlayers;

      this.selectedFilter = null;
      return;
    } else {
      this.players = this.allPlayers;
      this.players = this.allPlayers.filter(
        (item) =>
          (this.selectedFilter.code === 'active' &&
            item.file_start_date &&
            !item.file_discharge_date) ||
          (this.selectedFilter.code === 'finished' &&
            item.file_discharge_date) ||
          (this.selectedFilter.code === 'inactive' &&
            !item.file_start_date &&
            !item.file_discharge_date)
      );
    }
  }

  /**
   * delete player
   */
  deletePlayer(player: Player): void {
    if (player.latest_file_fisiotherapy?.id) {
      this.$subscriptions = this.physiotherapyService
        .deleteFisiotherapyFile(
          this.team.id,
          player.id,
          player.latest_file_fisiotherapy?.id
        )
        .subscribe(
          (res) => {
            if (res.success) {
              this.msg.succes('Ficha eliminada exitosamente');

              this.getPlayersList(this.team.id, {});
            }
          },
          (error) => {
            this.msg.error('Ha ocurrido un error al eliminar al jugador');
          }
        );
    } else {
      this.msg.error('Este jugador no tiene fichas creadas');
    }
  }

  handlePermission(permission: PermissionMethods): void {
    this.showPermission = { ...this.showPermission, ...permission };
  }

  ngOnDestroy(): void {
    if (this.$subscriptions) this.$subscriptions.unsubscribe();
  }
}
