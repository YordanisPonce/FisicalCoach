import { Component, OnDestroy, OnInit } from '@angular/core';
import { forkJoin, Subscription } from 'rxjs';
import { GeneralService } from '../../../../_services/general.service';
import { PlayersService } from '../../../../_services/players.service';
import { TeamService } from '../../../../_services/team.service';
import { AppStateQuery } from '../../../../stateManagement/appState.query';
import { Player } from '../../../../_models/player';
import { AppStateService } from '../../../../stateManagement/appState.service';
import { InjuryService } from '../../../../_services/injury.service';
import { ITeam } from 'src/app/_models/ITeam.interface';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/api';
import { PermissionMethods } from 'src/app/_directivas/user-permission.directive';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.scss'],
})
export class PlayersComponent implements OnInit, OnDestroy {
  responsiveOptions = [
    {
      breakpoint: '1440px',
      numVisible: 3,
      numScroll: 3,
    },
    {
      breakpoint: '1024px',
      numVisible: 2,
      numScroll: 2,
    },
    {
      breakpoint: '768px',
      numVisible: 2,
      numScroll: 2,
    },
    {
      breakpoint: '560px',
      numVisible: 1,
      numScroll: 1,
    },
  ];
  players: Player[] = [];
  allPlayers: Player[] = [];
  listCountries: any = [];
  listKinships: any = [];
  listLaterality: any = [];
  listGenders: any = [];
  listGendersIdentity: any = [];
  listPositions: any = [];
  loadingList = false;
  loadingPlayers: boolean = false;
  values: any[];
  createPlayerDialog: boolean = false;
  team: ITeam;
  subsTeam: Subscription;
  sportName: string;
  urlImages = environment.images;
  showPermission: PermissionMethods;

  constructor(
    private generalService: GeneralService,
    private playerService: PlayersService,
    private teamService: TeamService,
    private translateService: TranslateService,
    private appStateQuery: AppStateQuery,
    private appStateService: AppStateService,
    private router: Router,
    private translate: TranslateService,
    private confirmationService: ConfirmationService,
    private injuryService: InjuryService
  ) {
    this.values = [];
  }

  getImage(player: any) {
    if (player.rpe_last_match) {
      return player.rpe_last_match.image?.full_url;
    } else {
      return '';
    }
  }

  newPlayer() {
    this.createPlayerDialog = true;
    this.appStateService.setPlayer(null);
  }

  ngOnInit(): void {
    this.loadList();
    this.subsTeam = this.appStateQuery.team$.subscribe((res) => {
      this.team = res;
      if (this.team?.sport_id) {
        this.sportName = this.team?.slug;
        this.getPositionsBySportId(this.team.sport_id);
      }
    });
    this.cargarJugadores();
  }

  getLateralidad(event: string) {
    switch (event) {
      case 'ambidextrous':
        break;
      case 'right_handed':
        break;
      case 'left_handed':
        break;
    }
  }

  cargarJugadores() {
    this.loadingPlayers = true;
    this.playerService.getAllPlayersByTeam(this.team.id).subscribe(
      (res) => {
        this.players = res.data;
        this.allPlayers = res.data;
        this.appStateService.updateListPlayers(res.data);
        this.loadingPlayers = false;
      },
      (error) => {
        this.loadingPlayers = false;
      }
    );
  }

  /**
   * get positions by sport
   */
  getPositionsBySportId(sportId: number): void {
    this.loadingList = true;
    this.teamService.getListPositionBySportId(sportId).subscribe((res) => {
      this.listPositions = res.data;
      this.appStateService.updateListPositions(this.listPositions);
      this.loadingList = false;
    });
  }

  loadList() {
    this.appStateQuery.listCountry$.subscribe((data) => {
      this.listCountries = Object.assign([], data);
    });
    this.appStateQuery.listLaterality$.subscribe((data) => {
      this.listLaterality = Object.assign([], data);
    });
    this.appStateQuery.listGender$.subscribe((data) => {
      this.listGenders = Object.assign([], data);
    });
    this.appStateQuery.listGenderIdentity$.subscribe((data) => {
      this.listGendersIdentity = Object.assign([], data);
    });
    this.appStateQuery.listCivilStatus$.subscribe((data) => {
      this.listKinships = Object.assign([], data);
    });
    this.appStateQuery.listInjuries$.subscribe((data) => {
      if (!data) {
        forkJoin(
          this.injuryService.getListMechanismsInjury(),
          this.injuryService.getListInjuryExtrinsicFactors(),
          this.injuryService.getListInjuryIntrinsicFactors(),
          this.injuryService.getListInjurySituationTypes(),
          this.injuryService.getListInjuryLocations(),
          this.injuryService.getListInjurySeverities(),
          this.injuryService.getListInjuryAffectedSideTypes(),
          this.injuryService.getListInjuryTypes(),
          this.injuryService.getListClinicalTestTypes()
        ).subscribe(
          ([
            mechanismsInjury,
            injuryExtrinsicFactors,
            injuryIntrinsicFactors,
            injurySituationTypes,
            injuryLocations,
            injurySeverities,
            injuryAffectedSideTypes,
            injuryTypes,
            clinicalTestTypes,
          ]) => {
            const dataList = {
              mechanismsInjury: mechanismsInjury.data,
              injuryExtrinsicFactors: injuryExtrinsicFactors.data,
              injuryIntrinsicFactors: injuryIntrinsicFactors.data,
              injurySituationTypes: injurySituationTypes.data,
              injuryLocations: injuryLocations.data,
              injurySeverities: injurySeverities.data,
              injuryAffectedSideTypes: injuryAffectedSideTypes.data,
              injuryTypes: injuryTypes.data,
              clinicalTestTypes: clinicalTestTypes.data,
            };
            this.appStateService.updateListInjuries(dataList);
          }
        );
      }
    });
    this.appStateQuery.listAnalizePlayer$.subscribe((data) => {
      if (!data) {
        forkJoin(
          this.playerService.getListPuntuation(),
          this.playerService.getListSkills()
        ).subscribe(([punt, skill]) => {
          const dataList = {
            listSkill: skill.data,
            listPuntuations: punt.data,
          };
          this.appStateService.updateListAnalizePlayer(dataList);
        });
      }
    });
  }

  getBatteryToolTip(status: string) {
    return this.translateService.instant('effort_recovery')[status];
  }

  detalle(event: Player) {
    this.appStateService.setPlayer(event);
  }

  edit(event: Player) {
    this.appStateService.setPlayer(event);
  }

  delete(event: Player) {
    this.confirm(event);
  }

  getInjutyRisk(event: any) {
    if (event && event.rank) {
      return `<label style="color:${event.rank.color}">${event.rank.name}</label>`;
    } else {
      return '';
    }
  }

  goToTest(event: any) {
    this.appStateService.setPlayerToTest(event);
    this.router.navigate(['/club/test']);
  }

  ngOnDestroy(): void {
    if (this.subsTeam) {
      this.subsTeam.unsubscribe();
    }
  }

  hanledClosed(event: any) {
    this.createPlayerDialog = false;
    if (event) {
      this.cargarJugadores();
    }
  }

  searchPlayer(event: any) {
    const query = event.target.value;
    if (query !== '') {
      this.filterPlayer(query.trim());
    } else {
      this.loadingPlayers = true;
      setTimeout(() => {
        this.loadingPlayers = false;
        this.players = Object.assign([], this.allPlayers);
      }, 300);
    }
  }

  deletePlayer(player: any) {
    this.playerService.deletePlayer(player).subscribe((res) => {
      this.players.splice(
        this.players.findIndex((x) => x.id === player.id),
        1
      );
      this.loadList();
    });
  }

  confirm(data: any) {
    this.confirmationService.confirm({
      header: this.translate.instant('LBL_CONFIRM_DELETE'),
      message: this.translate.instant('LBL_CONFIRM_DIALOG'),
      acceptLabel: this.translate.instant('LBL_YES'),
      rejectLabel: this.translate.instant('LBL_NO'),
      accept: () => {
        this.deletePlayer(data);
      },
    });
  }

  private filterPlayer(query: string) {
    const array = this.allPlayers.filter(
      (x) =>
        x.full_name?.toLowerCase().includes(query.toLowerCase()) ||
        x.alias?.toLowerCase().includes(query.toLowerCase()) ||
        x.position?.name?.toLowerCase().includes(query.toLowerCase()) ||
        x.shirt_number === parseInt(query.toLowerCase())
    );
    this.loadingPlayers = true;
    setTimeout(() => {
      this.loadingPlayers = false;
      this.players = Object.assign([], array);
    }, 300);
  }
  handlePermission(permission: PermissionMethods): void {
    this.showPermission = { ...this.showPermission, ...permission };
  }
}
