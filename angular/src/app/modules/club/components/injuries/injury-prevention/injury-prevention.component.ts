import { Component, OnInit } from '@angular/core';
import { InjuryPreventionService } from 'src/app/_services/injury-prevention.service';
import { AppStateQuery } from 'src/app/stateManagement/appState.query';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../../../../environments/environment';
import { PermissionMethods } from 'src/app/_directivas/user-permission.directive';
import { injuryGeneralFilter } from 'src/app/utils/filterOptions';

// import { TransformTimestampPipe } from 'src/app/pipes/transform-timestamp.pipe';

@Component({
  selector: 'app-injury-prevention',
  templateUrl: './injury-prevention.component.html',
  styleUrls: ['./injury-prevention.component.scss'],
})
export class InjuryPreventionComponent implements OnInit {
  players: any = [];
  injuryPreventionList: any = [];
  loading: boolean = false;
  newProgram: boolean = false;
  medalDialog: boolean = false;
  strategyPrevention: boolean = false;
  riskCalculator: boolean = false;
  selectedPlayer: any = [];
  selectedIndex: any = null;
  evaluatingProgram: string | null = null;
  injuryRiskId: number | null = null;
  evaluationResult: boolean = false;
  baseUrl = environment.images;
  showPermission: PermissionMethods;
  selectedFilter: any;
  filterOptions: any[] | undefined;

  constructor(
    private injuryPreventionService: InjuryPreventionService,
    private translate: TranslateService,
    private appStateQuery: AppStateQuery // private timestampPipe: TransformTimestampPipe
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.getInjuryPreventionPrograms();

    this.translate.get('injury_prevention').subscribe((res) => {
      this.filterOptions = injuryGeneralFilter.map((item) => ({
        ...item,
        label: res[item.code],
        children: item.children.map((child) => ({
          ...child,
          label: res[child.code],
        })),
      }));
    });
  }

  getTeamId(): string {
    let clubId: string = '';
    this.appStateQuery.team$.subscribe((res) => {
      clubId = res.id;
    });
    return clubId;
  }

  searchPlayer(event: any) {
    const search = event.target.value.toLowerCase();
    const filter = this.players.filter((item: any) =>
      item.full_name?.toLowerCase().includes(search)
    );

    if (search.length > 0) {
      this.injuryPreventionList = filter;
    } else {
      this.injuryPreventionList = this.players;
    }
  }

  onRowSelect(player: any, index: number) {
    if (this.selectedIndex === null || this.selectedIndex !== index) {
      this.selectedPlayer = [player];
      this.selectedIndex = index;
      this.injuryRiskId = this.selectedPlayer[0].player_id;
    } else {
      this.selectedPlayer = [];
      this.selectedIndex = null;
    }
  }

  evaluateProgram(injuryItem: any) {
    this.evaluatingProgram = injuryItem;
    this.strategyPrevention = true;
  }

  getInjuryPreventionPrograms() {
    this.injuryPreventionService
      .getInjuriesListByTeam(this.getTeamId())
      .subscribe((data: any) => {
        this.loading = false;
        this.injuryPreventionList = this.players = data.data;
      });
  }

  showEvaluationResult(result: number) {
    if (result >= 8) {
      this.evaluationResult = true;
    } else {
      this.evaluationResult = false;
      // this.medalDialog = false
    }
    this.medalDialog = true;
    this.refreshListPrograms();
  }

  refreshListPrograms() {
    this.loading = true;
    this.injuryPreventionList = [];
    this.selectedPlayer = [];
    this.injuryRiskId = null;
    this.getInjuryPreventionPrograms();
  }

  playerImage(player: any) {
    if (!player.player_image) {
      const genderUrl =
        player?.gender === 'female'
          ? this.baseUrl + 'images/player/girl.svg'
          : this.baseUrl + 'images/player/boy.svg';
      return genderUrl;
    } else {
      return this.baseUrl + player.player_image;
    }
  }
  handlePermission(permission: PermissionMethods): void {
    this.showPermission = { ...this.showPermission, ...permission };
  }

  handleSelectFilter(): void {
    if (this.selectedFilter.key === '0') {
      this.injuryPreventionList = this.players;
      this.selectedFilter = null;
      return;
    } else {
      this.injuryPreventionList = this.players;
      this.injuryPreventionList = this.players.filter(
        (item: { is_finished: null }) =>
          (this.selectedFilter.code === 'active' &&
            item.is_finished === false) ||
          (this.selectedFilter.code === 'not_started' &&
            item.is_finished === null) ||
          (this.selectedFilter.code === 'finished' && item.is_finished)
      );
    }
  }
}
