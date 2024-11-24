import { Component, OnInit } from '@angular/core';
//un comnetario
// import {TimelineModule} from 'primeng/timeline';
import {PrimeIcons} from 'primeng/api';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor() { }

  events1!: any[];
  packages!: any[];
  games!: any[];

  ngOnInit() {
    this.packages = [
      {
        title: "Paquete Multi-Deporte",
        text: "Lorem ipsum dolor sic amen insectus lorem ipsum amen iscetus lorem ipsum amen insectus lorem",
      },
      {
        title: "Paquete Uni-Deporte",
        text: "Lorem ipsum dolor sic amen insectus lorem ipsum amen iscetus lorem ipsum amen insectus lorem",
      },
      {
        title: "Paquete Premium-Deporte",
        text: "Lorem ipsum dolor sic amen insectus lorem ipsum amen iscetus lorem ipsum amen insectus lorem",
      },
    ];

    this.events1 = [
      {
        status: "Ordered",
        date: "15/10/2020 10:30",
        icon: PrimeIcons.SHOPPING_CART,
        color: "#9C27B0",
        image: "game-controller.jpg"
      },
      {
        status: "Processing",
        date: "15/10/2020 14:00",
        icon: PrimeIcons.COG,
        color: "#673AB7"
      },
      {
        status: "Shipped",
        date: "15/10/2020 16:15",
        icon: PrimeIcons.ENVELOPE,
        color: "#FF9800"
      },
    ];

    this.games = [
      {
        club: 'Club 1'
      },
      {
        club: 'Club 2'
      },
    ]
  }

}
