import { Component, Input, OnInit } from '@angular/core';
import { AppStateService } from 'src/app/stateManagement/appState.service';
import { Player } from 'src/app/_models/player';

@Component({
  selector: 'jugadores-component',
  templateUrl: './jugadores.component.html',
  styleUrls: ['./jugadores.component.scss']
})
export class JugadoresComponent implements OnInit {

  @Input() players: any[] = [];

  constructor(private appStateService: AppStateService) {
  }

  ngOnInit(): void {
  }


  detalle(event: Player) {
    this.appStateService.setPlayer(event);
  }
}