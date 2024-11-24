import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

export interface AppState {
  club: any;
  clubs: any;
  school: any;
  clubEdit: any;
  team: any;
  class: any;
  workout: any;
  listCountry: any;
  listGender: any;
  listGenderIdentity: any;
  listCivilStatus: any;
  listLaterality: any;
  listPositions: any;
  player: any;
  alumn: any;
  players: any;
  playerPsychology: any;
  listInjuries: any;
  listAnalizePlayer: any;
  player_file_id: any;
  userData: any;
  playerToTest:any;
  tax:any;
  refreshClassInactive: any;
}

export function createInitialState(): AppState {
  return {
    club: null,
    clubs: null,
    school: null,
    clubEdit: null,
    team: null,
    class: null,
    workout: null,
    listCountry: null,
    listGender: null,
    listGenderIdentity: null,
    listCivilStatus: null,
    listLaterality: null,
    listPositions: null,
    player: null,
    alumn: null,
    players: null,
    playerPsychology: null,
    listInjuries: null,
    listAnalizePlayer: null,
    player_file_id: null,
    userData: null,
    playerToTest: null,
    tax: null,
    refreshClassInactive: null
  };
}

@StoreConfig( { name: 'appState' } )
@Injectable( { providedIn: 'root' } )
export class AppStateStore extends Store<AppState> {
  constructor() {
    super( createInitialState() );
  }
}

