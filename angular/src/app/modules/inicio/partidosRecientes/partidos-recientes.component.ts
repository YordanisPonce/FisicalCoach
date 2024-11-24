import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ClubService } from 'src/app/_services/club.service';
import { CompetitionService } from 'src/app/_services/competitions.service';
import { TeamService } from 'src/app/_services/team.service';

@Component({
  selector: 'app-partidos-recientes',
  templateUrl: './partidos-recientes.component.html',
  styleUrls: ['./partidos-recientes.component.scss'],
})
export class PartidosRecientesComponent implements OnInit, OnDestroy {
  subs = new Subscription();
  games: any[] = [];
  clubs: any[] = [];
  loading: boolean = false;
  loadingMatches: boolean = false;
  activeIndex: number = 0;
  role: string;

  constructor(
    private clubService: ClubService,
    private teamService: TeamService,
    private competitionService: CompetitionService
  ) {}

  ngOnInit(): void {
    this.role = localStorage.getItem('role') as string;
    this.getRecentMatches();
  }

  /**
   * get clubs
   * @param
   */

  getClubs(): void {
    this.games = [
      {
        club: 'Club 1',
      },
      {
        club: 'Club 2',
      },
    ];
    this.loadingMatches = true;
    this.clubService.getList().subscribe(
      (res) => {
        this.clubs = res.data;
        this.loading = false;
      },
      (error) => {
        this.loading = false;
      }
    );
  }

  /**
   * get recent matches by club
   * @param clubId
   */
  getRecentMatches(): void {
    this.subs = this.competitionService
      .getRecentMatchesByClub()
      .subscribe((res) => {
        this.clubs = res.data;
      });
  }

  ngOnDestroy(): void {
    if (this.subs) {
      this.subs.unsubscribe();
    }
  }
}
