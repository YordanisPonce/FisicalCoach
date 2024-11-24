import { Component, OnInit } from '@angular/core';

@Component( {
  selector: 'app-competicion',
  templateUrl: './competicion.component.html',
  styleUrls: [ './competicion.component.scss' ]
} )
export class CompeticionComponent implements OnInit {

  games!: any[];
  search: string = '';

  constructor() {
  }

  ngOnInit(): void {
    this.games = [
      {
        name: 'Proximos'
      },
      {
        name: 'Recientes'
      },
    ];
  }


}
