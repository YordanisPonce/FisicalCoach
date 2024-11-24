import { Component, OnDestroy, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { AppStateService } from 'src/app/stateManagement/appState.service';
import { Match } from 'src/app/_models/competition';
import { Player } from 'src/app/_models/player';
import { Sport } from 'src/app/_models/sport';
import { Staff } from 'src/app/_models/team';
import { CompetitionService } from 'src/app/_services/competitions.service';
import { PlayersService } from 'src/app/_services/players.service';
import { SportService } from 'src/app/_services/sport.service';
import { TeamService } from 'src/app/_services/team.service';
import { ClubService } from 'src/app/_services/club.service';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { SchoolService } from 'src/app/_services/school.service';
import { ITeam } from 'src/app/_models/ITeam.interface';
import { School } from 'src/app/_models/schools';
import { SelectItem } from '../../../../_models/selectItem';
import { AppStateQuery } from '../../../../stateManagement/appState.query';
import { ConfirmationService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { AlertsApiService } from 'src/app/generals-services/alerts-api.service';
import { Router } from '@angular/router';
import { ComunicationComponentService } from 'src/app/_services/comunicationComponent.service';

@Component({
  selector: 'app-equipo',
  templateUrl: './equipo.component.html',
  styleUrls: [
    './equipo.component.scss',
    '../../../academy/members/members.component.scss',
  ],
  providers: [ConfirmationService],
})
export class EquipoComponent implements OnInit, OnDestroy {
  urlBase = environment.images;
  sub = new Subscription();
  recentMatches: Match[] = [];
  loadingMatches: boolean = false;
  loadingCover: boolean = false;
  teamStaff: Staff[] = [];
  loadingTeamStaff: boolean = false;
  loadingPlayers: boolean = false;
  players: Player[] = [];
  team: ITeam;
  school: School;
  role: string;
  club: any;
  sport: Sport;
  loadingSport: boolean = false;
  coverImgPrev: any;
  openCropperDialog: boolean = false;
  backgroundImage: string = '/assets/img/portada_equipo.png';
  teamtabs = [
    {
      name: 'Partidos recientes',
      code: 'recent_matches',
    },
    {
      name: 'Cuerpo técnico',
      code: 'technical_staff',
    },
    {
      name: 'Jugadores',
      code: 'players',
    },
  ];
  tabs: any[] = [];
  selectedTab!: Number;
  showModal: boolean = false;
  showDataAdvance: boolean = false;
  newTeamDialog: boolean = false;
  dataBasic: any;
  listGender: SelectItem[] = [];
  listJobArea: SelectItem[] = [];
  viewMember = false;

  constructor(
    private appStateService: AppStateService,
    private competitionService: CompetitionService,
    private teamService: TeamService,
    private clubService: ClubService,
    private playerService: PlayersService,
    private sportService: SportService,
    private sanitizer: DomSanitizer,
    private schoolService: SchoolService,
    private appStateQuery: AppStateQuery,
    private confirmationService: ConfirmationService,
    private translate: TranslateService,
    private msg: AlertsApiService,
    private router: Router,
    private comunicationService: ComunicationComponentService
  ) {}

  editTeam() {
    this.newTeamDialog = true;
  }

  setNewTeamData(data: any) {
    this.team = data;
    this.appStateService.updateTeam(data);
  }

  loadMembersList() {
    this.showDataAdvance = false;
    this.getTeamStaff();
  }

  normalizeString(string: string): string {
    return string.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  replaceSpaces(string: string): string {
    return string.toLowerCase().replace(' ', '_');
  }

  ngOnInit(): void {
    this.team = this.appStateService.getTeam();
    this.school = this.appStateService.getSchool();
    this.club = this.appStateService.getClub();
    this.role = localStorage.getItem('role') as string;
    if (this.team?.cover?.full_url) {
      this.backgroundImage = this.team.cover.full_url;
    }

    this.loadList();
    this.getRecentMatches();
    this.getTeamStaff();
    this.getPlayersByTeam();
    this.tabs = this.teamtabs;
    this.getSportList();
  }

  loadList() {
    this.showDataAdvance = false;

    this.clubService.getListJobAreas().subscribe((res) => {
      this.listJobArea = res.data;
    });

    this.appStateQuery.listGender$.subscribe((data) => {
      this.listGender = [];
      const genders = Object.assign([], data);
      genders.map((r: any) => {
        if (r.id !== 0) {
          this.listGender.push({ label: r.code, value: r.id });
        }
      });
    });
  }

  handleQuickCreate() {
    this.dataBasic = {};
    this.showDataAdvance = false;
    this.showModal = true;
  }

  handleCreate() {
    this.viewMember = false;
    this.dataBasic = {};
    this.showDataAdvance = true;
    this.showModal = false;
  }

  handleEdit(data: any) {
    this.viewMember = false;
    this.dataBasic = data;
    this.showDataAdvance = true;
  }

  handleView(data: any) {
    this.viewMember = true;
    this.dataBasic = data;
    this.showDataAdvance = true;
  }

  handleDelete(data: any) {
    this.clubService.deleteMember(this.club.id, data.id).subscribe(
      (r) => {
        this.teamStaff = [];
        this.loadMembersList();
      },
      ({ error }) => {
        this.msg.error(error);
      }
    );
  }

  onFileSelected(file: File) {
    this.loadingCover = true;

    if (file) {
      this.coverImgPrev = this.sanitizer.bypassSecurityTrustUrl(
        URL.createObjectURL(file)
      );
      this.backgroundImage =
        this.coverImgPrev.changingThisBreaksApplicationSecurity;
      this.teamService
        .updateTeamCover(this.team.code, { cover: file })
        .then((res: any) => {
          this.loadingCover = false;
          const dataTeam = { ...this.team } as ITeam;
          if (dataTeam) {
            dataTeam.cover = { full_url: this.backgroundImage } as any;
          }
          this.appStateService.updateTeam(dataTeam);
        })
        .catch((res) => {
          this.loadingCover = false;
        });
    }
  }

  /**
   * get sport list
   */
  getSportList(): void {
    this.loadingSport = true;
    this.sub = this.sportService.getSportList().subscribe(
      (res) => {
        const sports = res.data as Sport[];
        const sport = sports.filter((sport) => sport.id == this.team.sport_id);
        this.sport = sport[0];
        this.loadingSport = false;
      },
      (error) => {
        this.loadingSport = false;
      }
    );
  }

  /**
   * Get recent matches by team
   */
  async getRecentMatches(): Promise<void> {
    this.loadingMatches = true;
    this.sub = this.competitionService
      .getRecentMatchesByTeam(this.team.id as number)
      .subscribe(
        async (resMatch) => {
          if (resMatch.success && resMatch.data.length > 0) {
            this.recentMatches = [...resMatch.data];
            await Promise.all(
              resMatch.data.map((match: any) => {
                this.competitionService
                  .getRivalsByTeamId(match.competition_id)
                  .subscribe((rivalTeamRes) => {
                    if (rivalTeamRes.data.length > 0) {
                      const rival = rivalTeamRes.data.find(
                        (rival: any) =>
                          rival.id === match.competition_rival_team_id
                      );
                      this.recentMatches = this.recentMatches.map((match) => ({
                        ...match,
                        ...rival,
                        currentTeam: this.team.name,
                        currentTeamImage: this.team.image_url,
                        fecha: moment(match.start_at).format('DD-MM-YYYY'),
                      }));
                    }
                    this.loadingMatches = false;
                  });
              })
            );
          } else {
            this.loadingMatches = false;
          }
        },
        (error) => {
          console.log(error);
          this.loadingMatches = false;
        }
      );
  }

  /**
   * Get staff by team
   */
  getTeamStaff(): void {
    this.loadingTeamStaff = true;
    this.sub = this.teamService
      .getStaffByTeam(String(this.team.id))
      .subscribe((res) => {
        this.teamStaff = res.data;
        this.loadingTeamStaff = false;
      });
  }

  /**
   * Get players by team
   */
  getPlayersByTeam(): void {
    this.loadingPlayers = true;
    this.sub = this.playerService
      .getAllPlayersByTeam(this.team.id)
      .subscribe((res) => {
        this.players = res.data;
        this.loadingPlayers = false;
      });
  }

  deleteTeam() {
    this.teamService.deleteTeam(this.appStateService.getTeam().code).subscribe(
      (res: any) => {
        this.msg.succes(res.message);
        this.comunicationService.recargarMenuListaClubs(true);
        setTimeout(() => {
          this.router.navigate([
            `/academy/home/${this.appStateService.getClub().id}`,
          ]);
        }, 200);
      },
      ({ error }) => {
        this.msg.error(error);
      }
    );
  }

  confirm() {
    this.confirmationService.confirm({
      header: this.translate.instant('LBL_CONFIRM_DELETE'),
      message: this.translate.instant('LBL_CONFIRM_DIALOG'),
      acceptLabel: this.translate.instant('LBL_YES'),
      rejectLabel: this.translate.instant('LBL_NO'),
      acceptButtonStyleClass: 'next_btn',
      rejectButtonStyleClass: 'back_btn',
      accept: () => {
        this.deleteTeam();
      },
    });
  }

  getImage(file: File): void {
    this.readURL(file);
  }

  /**
   * read competition and rival image urls
   * @param event
   * @param type
   */
  readURL(file: File): void {
    if (file) {
      this.onFileSelected(file);

      this.openCropperDialog = false;
    }
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}
