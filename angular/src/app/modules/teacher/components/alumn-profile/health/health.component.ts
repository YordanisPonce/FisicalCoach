import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppStateQuery } from 'src/app/stateManagement/appState.query';
import { AlumnsService } from 'src/app/_services/alumns.service';
import {
  PlayerHealthInjuriesHistoryDataComponent
} from '../../../../club/components/players/players-health/player-health-injuries-history-data/player-health-injuries-history-data.component';

declare var $: any;

@Component( {
  selector: 'app-health',
  templateUrl: './health.component.html',
  styleUrls: [ './health.component.scss' ]
} )
export class HealthComponent implements OnInit {
  
  details: boolean = false;
  injuryDetails: any = null;
  nestedChildActive: boolean = false;
  role: 'teacher' | 'sport' = 'sport';
  subscription: Subscription;
  person: any;
  @ViewChild( PlayerHealthInjuriesHistoryDataComponent ) injuriesHistory: PlayerHealthInjuriesHistoryDataComponent;
  
  constructor( private alumnsService: AlumnsService,
               private appStateQuery: AppStateQuery, ) {
  }
  
  setInjuryDetails( event: any ) {
    this.injuryDetails = event;
    // console.log(this.injuryDetails)
    this.details = true;
    $( '#v-pills-injury-details-tab' ).tab( 'show' );
  }
  
  closeNestedChildComponent() {
    if ( this.details ) {
      this.injuriesHistory.injuriesTotal = true;
      $( '#v-pills-injury-details-tab' ).tab( 'dispose' );
      $( '#v-pills-sporting-data-tab' ).tab( 'show' );
      this.details = false;
    } else {
      this.nestedChildActive = false;
      this.injuriesHistory.injuriesTotal = false;
    }
  }

  ngOnInit(): void {
    this.role = localStorage.getItem('role') as 'sport'|'teacher';
    let query = this.role==='teacher' ? this.alumnsService.alumn$ : this.appStateQuery.player$
    this.subscription = query.subscribe((res:any) => {
      const data = Object.assign({}, this.role==='teacher' ? res.alumn : res );
      this.person = data;
    })    
  }

}
