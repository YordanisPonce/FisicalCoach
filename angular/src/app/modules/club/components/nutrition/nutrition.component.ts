import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppStateService } from 'src/app/stateManagement/appState.service';

import { Player } from '../../../../_models/player';
import { NutritionService } from 'src/app/_services/nutrition.service';

import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ITeam } from 'src/app/_models/ITeam.interface';
import { TranslateService } from '@ngx-translate/core';
import { AlertsApiService } from '../../../../generals-services/alerts-api.service';
import { PermissionMethods } from 'src/app/_directivas/user-permission.directive';
import { nutritionGeneralFilter } from 'src/app/utils/filterOptions';

@Component({
  selector: 'app-nutrition',
  templateUrl: './nutrition.component.html',
  styleUrls: ['./nutrition.component.scss'],
})
export class NutritionComponent implements OnInit, OnDestroy {
  newSheetDialog: boolean = false;
  loading: boolean = false;
  team: any;
  playerList: Player[] = [];
  players: Player[] = [];
  selectedPlayer: Player[] = [];
  searchPlayer: string;
  weightDialog: boolean = false;
  subs: Subscription;
  selectedIndex: any = null;
  urlBase = environment.images;
  errorMessage: string;
  showPermission: PermissionMethods;
  selectedFilter: any;
  filterOptions: any[] | undefined;

  constructor(
    private playerService: NutritionService,
    private appStateService: AppStateService,
    private translateService: TranslateService,
    private alert: AlertsApiService
  ) {}

  ngOnInit(): void {
    this.team = this.appStateService.getTeam();
    this.getNutrition(this.team.id);

    this.subs = this.translateService.get('nutrition').subscribe((res) => {
      this.filterOptions = nutritionGeneralFilter.map((item) => ({
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
   * Get nutrition data
   */
  getNutrition(team: ITeam): void {
    this.loading = true;
    this.subs = this.playerService.getNutritionList(this.team.id).subscribe(
      (res) => {
        this.players = res.data;
        this.playerList = res.data;

        this.loading = false;
      },
      ({ error }) => {
        this.loading = false;
        this.errorMessage = error.message;
      }
    );
  }

  /**
   * Order data
   */
  handleOrderData(value: string = 'asc'): void {
    if (value === 'asc') {
      this.players = _.orderBy(
        this.players,
        [(player: any) => player.full_name.toLowerCase()],
        [value]
      );
    }
  }

  /**
   * select nutrition player
   * @param player
   */
  handleNutritionPlayer(player: Player, index: number): void {
    if (this.selectedIndex === null || this.selectedIndex !== index) {
      this.selectedPlayer = [player];
      this.selectedIndex = index;
    } else {
      this.selectedPlayer = [];
      this.selectedIndex = null;
    }
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
   * Reload nutritional data after creating a sheet
   */
  reloadData(reload: boolean): void {
    if (reload) {
      this.getNutrition(this.team.id);
    }
  }

  /**
   * create new sheet
   */
  createNewSheet(): void {
    if (
      this.selectedPlayer[0].height &&
      this.selectedPlayer[0].weight &&
      this.selectedPlayer[0].age  
    ) {
      this.newSheetDialog = true;
    } else {
      this.alert.error(
        this.translateService.instant('nutrition.sinpesootalla')
      );
    }
  }

  /**
   * CLose dialog
   */
  close(): void {
    this.newSheetDialog = false;
  }

  /**
   * refreshPlayerList
   */
  refreshPlayerList(): void {
    this.getNutrition(this.team.id);
  }

  /***
   * parse int value
   */
  parseValue(str: string): string {
    return parseInt(str).toFixed(1);
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
          (this.selectedFilter.code === 'active' && !!item.nutritional_sheet) ||
          (this.selectedFilter.code === 'inactive' && !item.nutritional_sheet)
      );
    }
  }

  handlePermission(permission: PermissionMethods): void {
    this.showPermission = { ...this.showPermission, ...permission };
  }

  ngOnDestroy(): void {
    if (this.subs) {
      this.subs.unsubscribe();
    }
  }
}
