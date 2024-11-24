import { Query } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { AppState, AppStateStore } from './appState.store';

@Injectable( { providedIn: 'root' } )
export class AppStateQuery extends Query<AppState> {
  allState$ = this.select();
  club$ = this.select( 'club' );
  class$ = this.select( 'class' );
  team$ = this.select( 'team' );
  // class$ = this.select( 'class' );
  player$ = this.select( 'player' );
  alumn$ = this.select( 'alumn' );
  clubEdit$ = this.select( 'clubEdit' );
  workout$ = this.select( 'workout' );
  listCountry$ = this.select( 'listCountry' );
  listGender$ = this.select( 'listGender' );
  listGenderIdentity$ = this.select( 'listGenderIdentity' );
  listCivilStatus$ = this.select( 'listCivilStatus' );
  listLaterality$ = this.select( 'listLaterality' );
  listPositions$ = this.select( 'listPositions' );
  listPlayers$ = this.select( 'players' );
  playerPsychology$ = this.select( 'playerPsychology' );
  listInjuries$ = this.select( 'listInjuries' );
  listAnalizePlayer$ = this.select( 'listAnalizePlayer' );
  userData$ = this.select( 'userData' );
  clubs$ = this.select( 'clubs' );
  playerToTest$ = this.select( 'playerToTest' );
  tax$ = this.select( 'tax' );
  refreshClassList$ = this.select( 'refreshClassInactive' );

  constructor( protected store: AppStateStore ) {
    super( store );
  }
}
