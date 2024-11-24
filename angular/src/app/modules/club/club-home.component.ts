import { Component, OnInit } from '@angular/core';
import { ITeam } from 'src/app/_models/ITeam.interface';
import { AppStateService } from 'src/app/stateManagement/appState.service';

@Component({
  selector: 'app-club-home',
  templateUrl: './club-home.component.html',
  styleUrls: ['./club-home.component.scss'],
})
export class ClubHomeComponent implements OnInit {
  sidebarVisible: boolean = false;

  constructor(private appStateService: AppStateService) {}

  team: ITeam;

  ngOnInit(): void {
    this.team = this.appStateService.getTeam();
  }
}
