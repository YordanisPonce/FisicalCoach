import { Component, EventEmitter, Input, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { AlumnsService } from 'src/app/_services/alumns.service';
import { Subscription } from 'rxjs';

@Component( {
  selector: 'app-player-health-injuries-details',
  templateUrl: './player-health-injuries-details.component.html',
  styleUrls: [ './player-health-injuries-details.component.scss' ]
} )
export class PlayerHealthInjuriesDetailsComponent implements OnInit, OnDestroy {
  
  @Input() injuryId: any;
  details: any;
  close: EventEmitter<boolean> = new EventEmitter<boolean>();
  subs: Subscription;
  
  constructor( private alumnsService: AlumnsService ) {
  }
  
  ngOnChanges( changes: SimpleChanges ) {
    if ( changes.injuryId && changes.injuryId.currentValue !== null ) {
      this.alumnsService.getInjuryDetails( changes.injuryId.currentValue ).subscribe( ( res: any ) => {
        this.details = res.data;
      } );
    }
  }
  
  ngOnInit(): void {
  }
  
  goBack() {
    this.close.emit( false );
  }
  
  mapElements( elements: any ) {
    if ( elements === null ) {
      return 'N/A';
    }
    const elementsNames: string[] = [];
    elements.forEach( ( element: any, index: number ) => {
      elementsNames.push( element.name );
    } );
    return elementsNames.join( ', ' );
  }
  
  ngOnDestroy(): void {
    this.subs?.unsubscribe();
  }
}
