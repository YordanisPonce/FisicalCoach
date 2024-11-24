import { Component, OnInit } from '@angular/core';
import { PsychologyService } from '../../../../_services/psychology.service';
import { AppStateQuery } from '../../../../stateManagement/appState.query';
import { forkJoin, Subscription } from 'rxjs';
import { PlayersService } from '../../../../_services/players.service';
import { ClubService } from '../../../../_services/club.service';
import { AppStateService } from '../../../../stateManagement/appState.service';
import { Router } from '@angular/router';
import { TeamService } from '../../../../_services/team.service';
import { environment } from 'src/environments/environment';
import { Player } from 'src/app/_models/player';
import { PermissionMethods } from 'src/app/_directivas/user-permission.directive';
import { psychologyGeneralFilter } from 'src/app/utils/filterOptions';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-psicologia',
  templateUrl: './psicologia.component.html',
  styleUrls: ['./psicologia.component.scss'],
})
export class PsicologiaComponent implements OnInit {
  players: any[] = [];
  allPlayers: any[] = [];
  searchPlayer: string;
  staffs: any[] = [];
  newTest: boolean = false;
  listPlayersSpecialists: any[] = [];
  team: any;
  club: any;
  subsTeam: Subscription;
  loading = true;
  filter = '';
  selectedFilter: any;
  filters: any[];
  locale: string | null;
  urlBase = environment.images;
  resources = environment.images + 'images';
  selectedIndex: any = null;
  selectedPlayer: any[] = [];
  errorMessage: string;
  showPermission: PermissionMethods;
  filterOptions: any[] | undefined;

  constructor(
    private psychologyService: PsychologyService,
    private appStateQuery: AppStateQuery,
    private appStateService: AppStateService,
    private route: Router,
    private translateService: TranslateService
  ) {
    this.locale = localStorage.getItem('languaje');
  }

  ngOnInit(): void {
    this.subsTeam = this.appStateQuery.team$.subscribe((res) => {
      this.team = res;
    });
    this.appStateQuery.club$.subscribe((res: any) => {
      this.club = res;
      this.getListPlayers();
    });

    this.translateService.get('PSYCHOLOGY').subscribe((res) => {
      this.filterOptions = psychologyGeneralFilter.map((item) => ({
        ...item,
        label: res[item.code],
        children: item.children.map((child) => ({
          ...child,
          label: res[child.code],
        })),
      }));
    });
  }

  getListPlayers() {
    const filter = this.getFilter();
    this.loading = true;
    this.psychologyService
      .getListPlayersPsychology(this.locale, this.team.id, filter)
      .subscribe(
        (r) => {
          this.listPlayersSpecialists = r.data;
          this.allPlayers = r.data;
          this.loading = false;
        },
        ({ error }) => {
          this.errorMessage = error?.message;
          this.loading = false;
        }
      );
  }

  getFilter() {
    if (this.selectedFilter && this.selectedFilter.code) {
      return '&staff=' + this.selectedFilter.code;
    }
    return '';
  }

  reload() {
    this.getListPlayers();
  }
  viewDetail(player: any) {
    this.appStateService.updatePlayerPsychology$(player);
    this.route.navigate(['/club/psychology/detail']);
  }

  handleChangeFilter(event: any) {
    this.getListPlayers();
  }

  handlePermission(permission: PermissionMethods): void {
    this.showPermission = { ...this.showPermission, ...permission };
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

  /**
   * handle filter
   */
  handleSelectFilter(): void {
    let list: any[] = [];

    if (this.selectedFilter.key === '0') {
      this.listPlayersSpecialists = this.allPlayers;

      this.selectedFilter = null;
      return;
    } else {
      this.allPlayers.forEach((item) => {
        const psychology_reports = item.psychology_reports;

        if (
          !!psychology_reports.find(
            (report: any) =>
              report.psychology_specialist_id === this.selectedFilter.id
          )
        ) {
          list = [...list, item];
        }
      });

      this.listPlayersSpecialists = list;
    }
  }

  /**
   * Filter players
   * @param e Event
   */
  setValue(e: KeyboardEvent) {
    const filterCompetition = this.listPlayersSpecialists?.filter((item) =>
      item.full_name.toLowerCase().includes(this.searchPlayer)
    );

    if (this.searchPlayer.length > 0) {
      this.listPlayersSpecialists = filterCompetition;
    } else {
      this.listPlayersSpecialists = this.allPlayers;
    }
  }
}
