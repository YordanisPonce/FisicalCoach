import { Component, Input, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { Match } from 'src/app/_models/competition';
import { AppStateService } from 'src/app/stateManagement/appState.service';

@Component({
  selector: 'games-component',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss'],
})
export class GamesComponent implements OnInit {
  constructor(
    private router: Router,
    private appStateService: AppStateService   
  ) {}

  @Input() matches: any[] = [];
  @Input() loadingMatches: boolean = true;

  urlBase = environment.images;
  role: string;

  ngOnInit(): void {
    this.role = localStorage.getItem('languaje') as string;

  }

  goToCompetitions(match: Match): void {
    if (this.role === 'sport') {
    }
    this.appStateService.updateTeam(match.competition.team);

    this.router.navigate([`/club/competition/match/details/${match.id}`]);
    
  }
}
