import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { AppSettings } from '../../proyect.conf';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PhysiotherapyService {
  private urlServicios = AppSettings.serviceUrl + 'fisiotherapy';
  locale: string = 'es';

  constructor(private httpClient: HttpClient) {
    this.locale = localStorage.getItem('languaje') as string;
  }

  /**
   * create file
   * @returns create file
   */
  getPlayersList(team_id: number, params = {}): Observable<any> {
    return this.httpClient
      .get(this.urlServicios + `/${team_id}` + '/players', { params })
      .pipe(map((res) => res as any[]));
  }

  /**
   * player file
   * @returns player file
   */
  getPlayerFileById(
    team_id: number,
    player_id: number,
    file_id: number
  ): Observable<any> {
    return this.httpClient
      .get(`${this.urlServicios}/${team_id}/players/${player_id}/files/${file_id}`)
      .pipe(map((res) => res as any[]));
  }

  /**
   * create file
   * @returns create file
   */
  createFisiotherapyFile(
    team_id: number,
    player_id: number,
    data: any
  ): Observable<any> {
    return this.httpClient
      .post(
        `${this.urlServicios}/${team_id}/players/${player_id}/files?_locale=${this.locale}`,
        data
      )
      .pipe(map((res) => res as any[]));
  }

  /**
   * update file
   * @returns update file
   */
  updateFisiotherapyFile(
    team_id: number,
    player_id: number,
    file_id: number,
    data: any
  ): Observable<any> {
    return this.httpClient
      .put(
        `${this.urlServicios}/${team_id}/players/${player_id}/files/${file_id}?_locale=${this.locale}`,
        data
      )
      .pipe(map((res) => res as any[]));
  }

  /**
   * delete file
   * @returns delete file
   */
  deleteFisiotherapyFile(
    team_id: number,
    player_id: number,
    file_id: number
  ): Observable<any> {
    return this.httpClient
      .delete(
        `${this.urlServicios}/${team_id}/players/${player_id}/files/${file_id}`
      )
      .pipe(map((res) => res as any[]));
  }

  /**
   * treatments list
   * @returns treatments list
   */
  getTratmentsList(): Observable<any> {
    return this.httpClient
      .get(`${this.urlServicios}/treatments?_locale=${this.locale}`)
      .pipe(map((res) => res as any[]));
  }

  /**
   * create daily work
   * @returns created daily work
   */
  createDailyWork(
    data: any,
    team_id: number,
    player_id: number,
    file_id?: number
  ): Observable<any> {
    return this.httpClient
      .post(
        `${this.urlServicios}/${team_id}/players/${player_id}/files/${file_id}/daily-work?_locale=${this.locale}`,
        data
      )
      .pipe(map((res) => res as any[]));
  }

  /**
   * get player daily work
   * @returns get player daily work
   */
  getPlayerDailyWork(
    team_id: number,
    player_id: number,
    file_id?: number
  ): Observable<any> {
    return this.httpClient
      .get(
        `${this.urlServicios}/${team_id}/players/${player_id}/files/${file_id}/daily-work?_locale=${this.locale}`
      )
      .pipe(map((res) => res as any[]));
  }

  /**
   * store test
   * @returns created test
   */
  storeTest(data: any, teamId: number): Observable<any> {
    return this.httpClient
      .post(
        `${this.urlServicios}/${teamId}/players/test?_locale=${this.locale}`,
        data
      )
      .pipe(map((res) => res as any[]));
  }

  /**
   * test information
   * @returns test
   */
  getTestinformation(
    file_id: number,
    teamId: number,
    playerId: number
  ): Observable<any> {
    return this.httpClient
      .get(
        `${this.urlServicios}/${teamId}/players/${playerId}/files/${file_id}/test?_locale=${this.locale}`
      )
      .pipe(map((res) => res as any[]));
  }
}
