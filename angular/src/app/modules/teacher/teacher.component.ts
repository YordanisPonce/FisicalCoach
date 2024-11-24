import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ITeam } from 'src/app/_models/ITeam.interface';
import { AppStateService } from 'src/app/stateManagement/appState.service';


@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.scss']
})
export class TeacherComponent implements OnInit {
  sidebarVisible: boolean = false;

  constructor(private appStateService: AppStateService) { }

  team: ITeam;

  ngOnInit(): void {
    this.team = this.appStateService.getTeam();

    console.log( this.team)
  }
}
