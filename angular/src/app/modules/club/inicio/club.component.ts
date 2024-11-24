import { Component, OnInit } from '@angular/core';
import { Club } from '../../../_models/club';

@Component( {
  selector: 'app-club',
  templateUrl: './club.component.html',
  styleUrls: [ './club.component.scss' ]
} )
export class ClubComponent implements OnInit {
  teams: any [] = [];

  constructor() {
  }

  ngOnInit(): void {
  }

}
