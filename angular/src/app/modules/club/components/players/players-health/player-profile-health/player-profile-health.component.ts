import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppStateQuery } from '../../../../../../stateManagement/appState.query';


@Component( {
  selector: 'app-player-profile-health',
  templateUrl: './player-profile-health.component.html',
  styleUrls: [ './player-profile-health.component.scss' ]
} )
export class PlayerProfileHealthComponent implements OnInit, OnDestroy {
  
  details: boolean = false;
  injuryDetails: any = null;
  show: string = Type.GENERAL;
  type = Type;
  subs: Subscription;
  injuriesTotal: boolean;
  
  constructor( private appStateQuery: AppStateQuery ) {
  }
  
  setInjuryDetails( event: any ) {
    this.injuryDetails = event;
    this.details = true;
    this.show = Type.DETAIL;
  }
  
  ngOnInit(): void {
    this.subs = this.appStateQuery.player$.subscribe( res => {
      this.show = Type.GENERAL;
    } );
  }
  
  view( type: string ) {
    this.show = type;
  }
  
  closeDetail() {
    this.details = false;
    this.show = Type.HISTORY;
  }
  
  ngOnDestroy(): void {
    this.subs?.unsubscribe();
  }
  
  goToList() {
    this.injuriesTotal = false;
    this.show = Type.HISTORY;
  }
}

export enum Type {
  GENERAL = 'GENERAL',
  HISTORY = 'HISTORY',
  DETAIL = 'DETAIL'
}
