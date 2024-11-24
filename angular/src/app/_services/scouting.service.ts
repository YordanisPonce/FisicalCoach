import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { AppSettings } from '../../proyect.conf';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { IResponseApiInterface } from '../_models/IResponseApi.interface';
import { IAccionesScoutingInterface } from '../_models/IAccionesScouting.interface';

@Injectable({
  providedIn: 'root',
})
export class ScoutingService {
  private urlServicios = AppSettings.serviceUrl + 'scouting/';
  private urlServiciosBase = AppSettings.serviceUrl;
  private language = localStorage.getItem('languaje');

  constructor(private httpClient: HttpClient) {}

  getListbyTeam(idEquipo: any, filter: string = ''): Observable<any> {
    return this.httpClient
      .get(
        this.urlServicios +
          'available/' +
          `${idEquipo}${filter ? '?' + `${filter}` : ''}`
      )
      .pipe(map((res) => res as any[]));
  }

  getActionsbySport(
    deporte: string
  ): Observable<IResponseApiInterface<IAccionesScoutingInterface[]>> {
    return this.httpClient
      .get(this.urlServicios + `actions/${deporte}?_locale=${this.language}`)
      .pipe(
        map((res) => res as IResponseApiInterface<IAccionesScoutingInterface[]>)
      );
    // return this.httpClient.get( this.urlServicios + `actions/${ deporte }?locale=es` )
    //   .pipe( map( res => res as IResponseApiInterface<IAccionesScoutingInterface[]> ) );
  }

  getListCivilStatus(): Observable<any> {
    return this.httpClient
      .get(this.urlServicios + `marital-statuses?_locale=${this.language}`)
      .pipe(map((res) => res as any[]));
  }

  getListAllergies(): Observable<any> {
    return this.httpClient
      .get(this.urlServicios + `allergies?_locale=${this.language}`)
      .pipe(map((res) => res as any[]));
  }

  getListDiseases(): Observable<any> {
    return this.httpClient
      .get(this.urlServicios + `diseases?_locale=${this.language}`)
      .pipe(map((res) => res as any[]));
  }

  getListPhysicalProblems(): Observable<any> {
    return this.httpClient
      .get(
        this.urlServicios + `physical-exertion-problems?locale=${this.language}`
      )
      .pipe(map((res) => res as any[]));
  }

  getListTypeMedicines(): Observable<any> {
    return this.httpClient
      .get(this.urlServicios + `type-medicines?_locale=${this.language}`)
      .pipe(map((res) => res as any[]));
  }

  getListAlcoholConsumptions(): Observable<any> {
    return this.httpClient
      .get(this.urlServicios + `alcohol-consumptions?_locale=${this.language}`)
      .pipe(map((res) => res as any[]));
  }

  getListTobaccoConsumptions(): Observable<any> {
    return this.httpClient
      .get(this.urlServicios + `tobacco-consumptions?_locale=${this.language}`)
      .pipe(map((res) => res as any[]));
  }

  getPlayerListByTeam(teamId: string): Observable<any> {
    return this.httpClient
      .get(this.urlServicios + `${teamId}`)
      .pipe(map((res) => res as any[]));
  }

  add(player: any, update: boolean = false) {
    const token = localStorage.getItem('token');
    return new Promise((resolve, reject) => {
      const formData: FormData = new FormData();
      const xhr = new XMLHttpRequest();
      const date = moment(player.date_birth).format('YYYY-MM-DD');
      const keys = Object.keys(player);
      keys.forEach((item) => {
        if (item !== 'date_birth' && player[item]) {
          formData.append(item, player[item]);
        }
      });
      formData.append('date_birth', date);
      if (player.image) {
        formData.append('image', player.image);
      }
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200 || xhr.status === 201) {
            resolve(xhr.response);
          } else {
            reject(xhr.response);
          }
        }
      };
      const ruta = update ? `players/${player.id}` : 'players';
      xhr.open(
        'POST',
        `${this.urlServiciosBase}${ruta}?_locale=${this.language}`,
        true
      );
      xhr.setRequestHeader('Authorization', 'Bearer ' + token);
      xhr.send(formData);
    });
  }

  addContract(data: any, id: number): Observable<any> {
    return this.httpClient
      .post(this.urlServicios + `${id}/contracts`, data)
      .pipe(map((res) => res as any));
  }

  getContracts(id: number): Observable<any> {
    return this.httpClient
      .get(this.urlServicios + `${id}/contracts`)
      .pipe(map((res) => res as any[]));
  }

  public getHealthStatus(playerId: any) {
    return this.httpClient
      .get(`${this.urlServicios}${playerId}/health`)
      .pipe(map((res) => res as any[]));
  }

  public addHealthStatus(playerId: any, data: any) {
    return this.httpClient
      .post(`${this.urlServicios}${playerId}/health`, data)
      .pipe(map((res) => res as any[]));
  }

  getTypeArrival() {
    return this.httpClient
      .get(this.urlServicios + 'club-arrival-types')
      .pipe(map((res) => res as {}));
  }

  addArrival(arrival: any, idPlayer: number) {
    const token = localStorage.getItem('token');
    return new Promise((resolve, reject) => {
      const formData: FormData = new FormData();
      const xhr = new XMLHttpRequest();

      const keys = Object.keys(arrival);
      keys.forEach((item) => {
        if (arrival[item]) {
          formData.append(item, arrival[item]);
        }
      });
      if (arrival.image) {
        formData.append('image', arrival.image);
      }
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status === 200 || xhr.status === 201) {
            resolve(xhr.response);
          } else {
            reject(xhr.response);
          }
        }
      };
      xhr.open(
        'POST',
        `${this.urlServiciosBase}players/${idPlayer}/trajectory`,
        true
      );
      xhr.setRequestHeader('Authorization', 'Bearer ' + token);
      xhr.send(formData);
    });
  }

  getTrayectory(id: number): Observable<any> {
    return this.httpClient
      .get(this.urlServicios + `${id}/trajectory`)
      .pipe(map((res) => res as any[]));
  }

  getAllPlayersByTeam(id: number): Observable<any> {
    return this.httpClient
      .get(this.urlServicios + `${id}`)
      .pipe(map((res) => res as any[]));
  }

  /**
   * Store activity by team or player
   */
  storeActivity(id: number, data: any, _lang = 'es'): Observable<any> {
    return this.httpClient
      .post(`${this.urlServicios}${id}/activity?_locale=${this.language}`, data)
      .pipe(map((res) => res as any[]));
  }

  /**
   * undo activity
   * @param id
   * @returns
   */
  undoActivity(id: number): Observable<any> {
    return this.httpClient
      .post(`${this.urlServicios}${id}/undo?_locale=${this.language}`, {})
      .pipe(map((res) => res as any[]));
  }

  /**
   * redo activity
   * @param id
   * @returns
   */
  redoActivity(id: number): Observable<any> {
    return this.httpClient
      .post(`${this.urlServicios}${id}/redo?_locale=${this.language}`, {})
      .pipe(map((res) => res as any[]));
  }

  /**
   * start scouting
   */
  startScouting(id: number): Observable<any> {
    return this.httpClient
      .post(`${this.urlServicios}${id}/start?_locale=${this.language}`, {})
      .pipe(map((res) => res as any[]));
  }

  /**
   * pause scouting
   */
  pauseScouting(
    id: number,
    in_game_time: number,
    in_period_time: number
  ): Observable<any> {
    return this.httpClient
      .post(`${this.urlServicios}${id}/pause?_locale=${this.language}`, {
        in_game_time,
        in_period_time,
      })
      .pipe(map((res) => res as any[]));
  }

  /**
   * stop scouting
   */
  finishScouting(
    id: number,
    in_game_time: number,
    in_real_time: string
  ): Observable<any> {
    if (in_real_time) {
      return this.httpClient
        .post(`${this.urlServicios}${id}/finish?_locale=${this.language}`, {
          in_game_time,
          in_real_time,
        })
        .pipe(map((res) => res as any[]));
    }

    return this.httpClient
      .post(`${this.urlServicios}${id}/finish?_locale=${this.language}`, {
        in_game_time,
      })
      .pipe(map((res) => res as any[]));
  }

  /**
   * list scouting activities
   */
  getListOfScoutingActivities(id: number): Observable<any> {
    return this.httpClient
      .get(this.urlServicios + `${id}/activities?_locale=${this.language}`)
      .pipe(map((res) => res as any[]));
  }

  /**
   * results of a competition match
   *
   */
  getMatchResults(id: number, allStatistics: boolean = false): Observable<any> {
    return this.httpClient
      .get(
        this.urlServicios +
          `${id}/results?all_statistics=${allStatistics}&_locale=${this.language}`
      )
      .pipe(map((res) => res as any[]));
  }

  /**
   *  scouting status
   */
  getScoutingStatus(id: number): Observable<any> {
    return this.httpClient
      .get(this.urlServicios + `${id}/status?_locale=${this.language}`)
      .pipe(map((res) => res as any[]));
  }

  /**
   * player results
   */
  getPlayerResults(matchId: number, playerid: number): Observable<any> {
    return this.httpClient
      .get(
        this.urlServicios +
          `${matchId}/player/${playerid}/results?all_statistics=true&_locale=${this.language}`
      )
      .pipe(map((res) => res as any[]));
  }

  /**
   * sent history results
   */
  sendResults(matchId: number, data: any): Observable<any> {
    return this.httpClient
      .post(
        this.urlServicios + `${matchId}/results?_locale=${this.language}`,
        data
      )
      .pipe(map((res) => res as any[]));
  }

  /**
   * match information
   */
  getScoutingMatchInfo(matchId: number): Observable<any> {
    return this.httpClient
      .get(this.urlServicios + `${matchId}/status?_locale=${this.language}`)
      .pipe(map((res) => res as any[]));
  }

  /**
   * send the team that start the scouting
   */
  setTeamToStartScouting(
    matchId: number,
    start_match: string,
    sets?: number
  ): Observable<any> {
    return this.httpClient
      .put(this.urlServicios + `${matchId}?_locale=${this.language}`, {
        start_match,
        sets,
      })
      .pipe(map((res) => res as any[]));
  }
}
