import { Component, OnDestroy, OnInit } from '@angular/core';
import { EffortRecoveryService } from 'src/app/_services/effort-recovery.service';
import { AppStateQuery } from 'src/app/stateManagement/appState.query';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { Player } from 'src/app/_models/player';
import { PermissionMethods } from 'src/app/_directivas/user-permission.directive';
import { Subscription } from 'rxjs';
import { effortRecoveryFilterList } from 'src/app/utils/filterOptions';

@Component({
  selector: 'app-effort-recovery',
  templateUrl: './effort-recovery.component.html',
  styleUrls: ['./effort-recovery.component.scss'],
})
export class EffortRecoveryComponent implements OnInit, OnDestroy {
  players: any;
  newQuestions: boolean = false;
  programId: string;
  loading: boolean = false;
  effortRecoveryList: any = [];
  urlImages = environment.images;
  selectedPlayer: Player[] = [];
  selectedIndex: any = null;
  showPermission: PermissionMethods;
  subs$ = new Subscription();
  selectedFilter: any;
  filterOptions: any[] | undefined;

  constructor(
    private effortRecoveryService: EffortRecoveryService,
    private translate: TranslateService,
    private appStateQuery: AppStateQuery
  ) {}

  getTeamId(): string {
    let clubId: string = '';
    this.subs$ = this.appStateQuery.team$.subscribe((res) => {
      clubId = res?.id;
    });
    return clubId;
  }

  playerImage(player: any) {
    if (!player.image) {
      const genderUrl =
        player?.gender?.code === 'female'
          ? this.urlImages + 'images/player/girl.svg'
          : this.urlImages + 'images/player/boy.svg';
      return genderUrl;
    } else {
      return player.image?.full_url;
    }
  }

  getBatteryToolTip(status: string) {
    return this.translate.instant('effort_recovery')[status];
  }

  searchPlayer(event: any) {
    const search = event.target.value.toLowerCase();
    const filter = this.players.filter((item: any) =>
      item.full_name?.toLowerCase().includes(search)
    );

    if (search.length > 0) {
      this.effortRecoveryList = filter;
    } else {
      this.effortRecoveryList = this.players;
    }
  }

  newTest(program: string) {
    this.newQuestions = true;
    this.programId = program;
  }

  refreshAllData(): void {
    this.selectedPlayer = [];
    this.refreshListPrograms();
  }

  getEffortRecoveryPrograms() {
    this.effortRecoveryService
      .getEffortRecoveryList(this.getTeamId())
      .subscribe((data: any) => {
        this.loading = false;

        const result = data.data.map((item: any) => {
          let answerData = {};

          if (item?.latest_effort_recovery) {
            item.latest_effort_recovery.answers.forEach((answer: any) => {
              answerData = {
                ...answerData,
                [answer.origin_type]: answer.origin_type,
              };
            });
          }

          return {
            ...item,
            answers: answerData || [],
          };
        });

        this.effortRecoveryList = this.players = result;
      });
  }

  refreshListPrograms() {
    this.loading = true;
    this.effortRecoveryList = [];
    this.getEffortRecoveryPrograms();
  }

  handlePermission(permission: PermissionMethods): void {
    this.showPermission = { ...this.showPermission, ...permission };
  }

  ngOnInit(): void {
    this.loading = true;
    this.getEffortRecoveryPrograms();

    this.subs$ = this.translate.get('effort_recovery').subscribe((res) => {
      this.filterOptions = effortRecoveryFilterList.map((item) => ({
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
   * select nutrition player
   * @param player
   */
  handleSelectPlayer(player: Player, index: number): void {
    if (this.selectedIndex === null || this.selectedIndex !== index) {
      this.selectedPlayer = [player];
      this.selectedIndex = index;
    } else {
      this.selectedPlayer = [];
      this.selectedIndex = null;
    }
  }

  handleSelectFilter(): void {
    if (this.selectedFilter.key === '0') {
      this.effortRecoveryList = this.players;

      this.selectedFilter = null;
      return;
    } else {
      this.effortRecoveryList = this.players;
      this.effortRecoveryList = this.players.filter(
        (item: { has_strategy: any }) =>
          (this.selectedFilter.code === 'use_strategy' &&
            !!item.has_strategy) ||
          (this.selectedFilter.code === 'no_strategy' && !item.has_strategy)
      );
    }
  }

  ngOnDestroy(): void {
    if (this.subs$) {
      this.subs$.unsubscribe();
    }
  }
}
