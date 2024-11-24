import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { AppSettings } from '../../proyect.conf';
import { Observable } from 'rxjs';
import { IResponseRest } from '../_models/IResponseRest';
import { IResponseListRest } from '../_models/IResponseListRest';
import { IListaItem } from '../_models/IListaItem';
import { Injury } from '../_models/injury';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class InjuryService {
  private url = AppSettings.serviceUrl + 'injuries/';
  private alumnUrlServicios = AppSettings.serviceUrl + 'alumns/injuries/';
  private urlServicios = AppSettings.serviceUrl + 'players/injuries/';
  private urlPlayer = AppSettings.serviceUrl + 'players/';
  private locale = localStorage.getItem('languaje');
  constructor(private httpClient: HttpClient) {}

  getAllInjuries(idPlayer: any): Observable<any> {
    return this.httpClient
      .get(`${this.urlServicios}${idPlayer}?_locale=${this.locale}`)
      .pipe(map((res) => res as any));
  }

  /**
   * Listado de mecanismos de lesion
   */
  getListMechanismsInjury(): Observable<IResponseListRest<IListaItem>> {
    return this.httpClient
      .get(`${this.url}mechanisms-injury?_locale=${this.locale}`)
      .pipe(
        map((res) => {
          return res as IResponseListRest<IListaItem>;
        })
      );
  }

  /**
   * Listado de Tipos de Lesion
   */
  getListInjuryTypes(): Observable<IResponseListRest<IListaItem>> {
    return this.httpClient
      .get(`${this.url}types?_locale=${this.locale}`)
      .pipe(map((res) => res as IResponseListRest<IListaItem>));
  }

  /**
   * Listado de Tipos de Lesion Especificados
   */
  getListInjuryTypesSpecs(
    locale: any,
    injurytypeid: any
  ): Observable<IResponseListRest<IListaItem>> {
    return this.httpClient
      .get(`${this.url}types/${injurytypeid}/specs?_locale=${this.locale}`)
      .pipe(map((res) => res as IResponseListRest<IListaItem>));
  }

  /**
   * Listado de Factores Extrinsecos de Lesion
   */
  getListInjuryExtrinsicFactors(): Observable<IResponseListRest<IListaItem>> {
    return this.httpClient
      .get(`${this.url}extrinsic-factors?_locale=${this.locale}`)
      .pipe(map((res) => res as IResponseListRest<IListaItem>));
  }

  /**
   * Listado de Factores Intrinsecos de Lesion
   */
  getListInjuryIntrinsicFactors(): Observable<IResponseListRest<IListaItem>> {
    return this.httpClient
      .get(`${this.url}intrinsic-factors?_locale=${this.locale}`)
      .pipe(map((res) => res as IResponseListRest<IListaItem>));
  }

  /**
   * Listado de Grado de Severidad de Lesiones
   */
  getListInjurySeverities(): Observable<IResponseListRest<IListaItem>> {
    return this.httpClient
      .get(`${this.url}severities?_locale=${this.locale}`)
      .pipe(map((res) => res as IResponseListRest<IListaItem>));
  }

  /**
   * Listado de localizaciones
   */
  getListInjuryLocations(): Observable<IResponseListRest<IListaItem>> {
    return this.httpClient
      .get(`${this.url}locations?_locale=${this.locale}`)
      .pipe(map((res) => res as IResponseListRest<IListaItem>));
  }

  /**
   * Listado de Tipos de Examenes Clinicos pruebas clinicas
   */
  getListClinicalTestTypes(): Observable<IResponseListRest<IListaItem>> {
    return this.httpClient
      .get(`${this.url}clinical-test-types?_locale=${this.locale}`)
      .pipe(map((res) => res as IResponseListRest<IListaItem>));
  }

  /**
   * Listado de Tipos de Situacion de Lesion
   */
  getListInjurySituationTypes(): Observable<IResponseListRest<IListaItem>> {
    return this.httpClient
      .get(`${this.url}situation-types?_locale=${this.locale}`)
      .pipe(map((res) => res as IResponseListRest<IListaItem>));
  }

  /**
   * Listado de Tipos de Lados Afectados por Lesion
   */
  getListInjuryAffectedSideTypes(): Observable<IResponseListRest<IListaItem>> {
    return this.httpClient
      .get(`${this.url}affected-side-types?_locale=${this.locale}`)
      .pipe(map((res) => res as IResponseListRest<IListaItem>));
  }

  /**
   * Mostrar Lesion de Jugador
   */
  getPlayerInjury(
    locale: any,
    playerinjuryid: number
  ): Observable<IResponseRest> {
    return this.httpClient
      .get(`${this.urlServicios}show/${playerinjuryid}?_locale=${locale}`)
      .pipe(map((res) => res as IResponseRest));
  }

  /**
   * Creacion de lesion
   */
  create(injuryData: Injury, id: string, alumn: boolean = false) {
    if (injuryData.injury_date) {
      injuryData.injury_date = moment(injuryData.injury_date).format(
        'YYYY-MM-DD'
      );
    }
    if (injuryData.medically_discharged_at) {
      injuryData.medically_discharged_at = moment(
        injuryData.medically_discharged_at
      ).format('YYYY-MM-DD');
    }
    if (injuryData.sportly_discharged_at) {
      injuryData.sportly_discharged_at = moment(
        injuryData.sportly_discharged_at
      ).format('YYYY-MM-DD');
    }
    if (injuryData.competitively_discharged_at) {
      injuryData.competitively_discharged_at = moment(
        injuryData.competitively_discharged_at
      ).format('YYYY-MM-DD');
    }
    if (injuryData.surgery_date) {
      injuryData.surgery_date = moment(injuryData.surgery_date).format(
        'YYYY-MM-DD'
      );
    }
    injuryData.area_body_id = injuryData.injury_location_id;

    return this.httpClient
      .post<any>(
        `${alumn ? this.alumnUrlServicios : this.urlServicios}${id}`,
        injuryData
      )
      .pipe(map((res) => res as any));
  }

  /**
   * Actualizacion
   */
  update(injury: Injury) {
    return this.httpClient
      .put<any>(`${this.urlServicios}${injury.id}`, injury)
      .pipe(map((res) => res as any));
  }

  delete(injury: Injury) {
    return this.httpClient
      .delete<any>(`${this.urlServicios}${injury.id}`)
      .pipe(map((res) => res as any));
  }

  /**
   * Listado de area del cuerpo
   */
  getListAreasBody(locale: any): Observable<IResponseListRest<IListaItem>> {
    return this.httpClient
      .get(`${this.urlPlayer}areas-body?_locale=${locale}`)
      .pipe(map((res) => res as IResponseListRest<IListaItem>));
  }

  getPlayerRFD(id: number): Observable<any> {
    return this.httpClient
      .get(`${this.url}players/injuries/${id}?_locale=${this.locale}`)
      .pipe(map((res) => res as any[]));
  }

  getPlayerByIdRFD(
    player_id: number
  ): Observable<IResponseListRest<IListaItem>> {
    return this.httpClient
      .get(`${this.url}players/${player_id}/injuries?_locale=${this.locale}`)
      .pipe(map((res) => res as IResponseListRest<IListaItem>));
  }

  /**
   * Get rfd injuries
   * @returns
   */

  getRfdInjuries(): Observable<any> {
    return this.httpClient
      .get(`${this.url}?_locale=${this.locale}`)
      .pipe(map((res) => res as any[]));
  }

  /**
   * Get rfd all phases
   * @returns
   */

  getRfdPhases(): Observable<any> {
    return this.httpClient
      .get(`${this.url}phases?_locale=${this.locale}`)
      .pipe(map((res) => res as any[]));
  }

  /**
   * Get rfd phase detail for test
   * @returns
   */

  getRfdDetailForTest(code: string): Observable<any> {
    return this.httpClient
      .get(`${this.url}phase-detail/${code}?_locale=${this.locale}`)
      .pipe(map((res) => res as any[]));
  }

  /**
   * create injury rfd
   * @returns
   */

  createInjuryRfd(data: any): Observable<any> {
    return this.httpClient
      .post(`${this.url}?_locale=${this.locale}`, data)
      .pipe(map((res) => res as any));
  }

  /**
   * show rfd injurry
   * @returns
   */
  showRfdInjury(code: string, teamId: number): Observable<any> {
    return this.httpClient
      .get(`${this.url}${code}?team_id=${teamId}&_locale=${this.locale}`)
      .pipe(map((res) => res as any));
  }

  /**
   * delete rfd injurry
   * @returns
   */
  deleteRfd(code: string, teamId: number): Observable<any> {
    return this.httpClient
      .delete(`${this.url}${code}?team_id=${teamId}&_locale=${this.locale}`)
      .pipe(map((res) => res as any));
  }

  /**
   * evaluate rfd phase
   * @returns
   */
  evaluatePhase(code: string, data: any): Observable<any> {
    return this.httpClient
      .post(`${this.url}phase-detail/${code}?_locale=${this.locale}`, data)
      .pipe(map((res) => res as any));
  }

  /**
   * update rfd injurry
   * @returns
   */
  updateRfd(code: string, data: any): Observable<any> {
    return this.httpClient
      .put(`${this.url}${code}?_locale=${this.locale}`, data)
      .pipe(map((res) => res as any));
  }

  /**
   * close rfd injurry
   * @returns
   */
  closeRfd(code: string): Observable<any> {
    return this.httpClient
      .delete(`${this.url}closed/${code}?_locale=${this.locale}`)
      .pipe(map((res) => res as any));
  }

  /**
   * show daily word RFD
   * @returns
   */
  showDailyWork(code: string): Observable<any> {
    return this.httpClient
      .get(`${this.url}daily-works/${code}/rfd?_locale=${this.locale}`)
      .pipe(map((res) => res as any));
  }

  /**
   * create daily word RFD
   * @returns
   */
  createDailyWork(data: any): Observable<any> {
    return this.httpClient
      .post(`${this.url}daily-works?_locale=${this.locale}`, data)
      .pipe(map((res) => res as any));
  }

  /**
   * show historial RFD
   * @returns
   */
  showRFDHistorical(playerId: number): Observable<any> {
    return this.httpClient
      .get(`${this.url}players/${playerId}/rfds?_locale=${this.locale}`)
      .pipe(map((res) => res as any));
  }
}
