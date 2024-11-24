import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { InjuryService } from '../../../../../../_services/injury.service';
import { AppStateQuery } from '../../../../../../stateManagement/appState.query';
import { Player } from '../../../../../../_models/player';
import { Injury } from '../../../../../../_models/injury';
import { AlumnsService } from 'src/app/_services/alumns.service';
import { AppStateService } from '../../../../../../stateManagement/appState.service';
import { ComunicationComponentService } from '../../../../../../_services/comunicationComponent.service';

@Component( {
  selector: 'app-player-health-injuries-history-data',
  templateUrl: './player-health-injuries-history-data.component.html',
  styleUrls: [ './player-health-injuries-history-data.component.scss' ]
} )
export class PlayerHealthInjuriesHistoryDataComponent implements OnInit {
  
  step = 1;
  injuries: any[] = [];
  injuriesBySeverity: any[] = [];
  injuriesByType: any[] = [];
  injuryRisk: any[] = [];
  total: number;
  showModal = false;
  player: Player;
  cargando = true;
  injuryDetail: Injury;
  detail: boolean;
  role: 'teacher' | 'sport' = 'sport';
  
  @Input() injuriesTotal = false;
  @Output() injuriesTotalChange = new EventEmitter<boolean>();
  @Output() details = new EventEmitter<string>();
  @Output() totalInjuries = new EventEmitter<boolean>();
  
  constructor( private injuryService: InjuryService,
               private appStateQuery: AppStateQuery,
               private comunicationComponentService: ComunicationComponentService,
               private appStateService: AppStateService,
               private alumnsService: AlumnsService
  ) {
  }
  
  ngOnInit(): void {
    this.role = localStorage.getItem( 'role' ) as 'teacher' | 'sport';
    const query = this.role === 'teacher' ? this.alumnsService.alumn$ : this.appStateQuery.player$;
    query.subscribe( res => {
      if ( res ) {
        this.player = this.role === 'teacher' ? res.alumn : res;
        if ( this.player ) {
          this.cargarLesiones( String( this.player.id ) );
        }
      }
    } );
  }
  
  cargarLesiones( idPlayer: string ) {
    switch ( this.role ) {
      case 'teacher':
        this.getAlumnInjuries( idPlayer );
        break;
      case 'sport':
        this.getPlayerInjuries( idPlayer );
        break;
    }
  }
  
  closeModal( event: any ) {
    this.showModal = event;
    if ( !this.detail ) {
      this.cargarLesiones( String( this.player.id ) );
    }
  }
  
  eliminar( event: Injury ) {
    this.injuryService.delete( event ).subscribe( res => {
      this.injuries.splice( this.injuries.indexOf( event ), 1 );
    } );
  }
  
  detalle( injuryId: string ) {
    this.details.emit( injuryId );
  }
  
  showTotalInjuries() {
    this.injuriesTotal = true;
    this.injuriesTotalChange.emit( this.injuriesTotal );
    this.totalInjuries.emit( true );
  }
  
  private getAlumnInjuries( idPlayer: any ) {
    this.alumnsService.getAlumnInjuries( idPlayer ).subscribe( ( res: any ) => {
      this.injuries = res.data.injuries;
      this.total = res.data.total_injuries;
      this.injuriesBySeverity = res.data.injuries_by_severity;
      this.injuriesByType = res.data.injuries_by_type;
      this.injuryRisk = res.data.injury_risk;
      this.cargando = false;
    } );
  }
  
  private getPlayerInjuries( idPlayer: any ) {
    this.injuryService.getAllInjuries( idPlayer ).subscribe( ( res: any ) => {
      this.injuries = res.data.injuries;
      this.total = res.data.total_injuries;
      this.injuriesBySeverity = res.data.injuries_by_severity;
      this.injuriesByType = res.data.injuries_by_type;
      this.injuryRisk = res.data.injury_risk;
      this.cargando = false;
    } );
  }
}
