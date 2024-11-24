import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { AppSettings } from '../../proyect.conf';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { IResponseListRest } from '../_models/IResponseListRest';
import { TraininLoad } from '../_models/trainigLoad';

@Injectable({
  providedIn: 'root',
})
export class PlayersService {
  private urlServicios = AppSettings.serviceUrl + 'players/';
  private urlServiciosBase = AppSettings.serviceUrl;
  private language = localStorage.getItem('languaje');

  constructor(private httpClient: HttpClient) {}

  getStatiticsCompetition(playerId: any): Observable<any> {
    return this.httpClient
      .get(
        this.urlServicios + playerId + '/statistics?_locale=' + this.language
      )
      .pipe(map((res) => res as any[]));
  }

  getListLaterality(): Observable<any> {
    return this.httpClient
      .get(this.urlServicios + 'laterities?_locale=' + this.language)
      .pipe(map((res) => res as any[]));
  }

  getListTypeArrival(): Observable<any> {
    return this.httpClient
      .get(this.urlServicios + `typearrival/club/list?_locale=${this.language}`)
      .pipe(map((res) => res as any[]));
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
        this.urlServicios +
          `physical-exertion-problems?_locale=${this.language}`
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
      .get(this.urlServicios + `${teamId}?_locale=${this.language}`)
      .pipe(map((res) => res as any[]));
  }

  add(player: any, update: boolean = false) {
    const phoneNumbers = [
      'phone',
      'mobile_phone',
      'father_phone',
      'father_mobile_phone',
      'mother_phone',
      'mother_mobile_phone',
    ];

    const token = localStorage.getItem('token');
    return new Promise((resolve, reject) => {
      const formData: FormData = new FormData();
      const xhr = new XMLHttpRequest();
      const keys = Object.keys(player);
      keys.forEach((item) => {
        if (
          item !== 'date_birth' &&
          !phoneNumbers.includes(item) &&
          player[item] !== undefined &&
          player[item] !== null
        ) {
          formData.append(item, player[item]);
        }
      });
      if (player.date_birth) {
        const date = moment(player.date_birth).format('YYYY-MM-DD');
        formData.append('date_birth', date);
      }
      if (player.image) {
        formData.append('image', player.image);
      }
      phoneNumbers.forEach((phone) => {
        console.log(player[phone]);
        if (player[phone]) {
          formData.append(phone, `${JSON.stringify(player[phone])}`);
        }
      });
      xhr.onreadystatechange = function () {
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

  deletePlayer(player: any) {
    const ruta = `players/${player.id}`;
    return this.httpClient
      .delete(`${this.urlServiciosBase}${ruta}?_locale=${this.language}`)
      .pipe(map((res) => res as any[]));
  }

  addContract(data: any, id: number, file: File) {
    // this.httpClient.post( this.urlServicios + `${ id }/contracts`, formData ).pipe( map( ( res ) => res as any ) );
    const token = localStorage.getItem('token');
    return new Promise((resolve, reject) => {
      const formData: FormData = new FormData();
      const xhr = new XMLHttpRequest();
      this.setValue('contract_creation', data.contract_creation, formData);
      this.setValue('duration', data.duration, formData);
      this.setValue('year_duration', data.year_duration, formData);
      this.setValue('title', data.title, formData);
      if (file) {
        formData.append('image', file);
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
      xhr.open(
        'POST',
        this.urlServicios + `${id}/contracts?_locale=${this.language}`,
        true
      );
      xhr.setRequestHeader('Authorization', 'Bearer ' + token);
      xhr.send(formData);
    });
  }

  getContracts(id: number): Observable<any> {
    return this.httpClient
      .get(this.urlServicios + `${id}/contracts?_locale=${this.language}`)
      .pipe(map((res) => res as any[]));
  }

  public getHealthStatus(playerId: any) {
    return this.httpClient
      .get(`${this.urlServicios}${playerId}/health?_locale=${this.language}`)
      .pipe(map((res) => res as any[]));
  }

  public addHealthStatus(playerId: any, data: any) {
    return this.httpClient
      .post(
        `${this.urlServicios}${playerId}/health?_locale=${this.language}`,
        data
      )
      .pipe(map((res) => res as any[]));
  }

  getTypeArrival() {
    return this.httpClient
      .get(`${this.urlServicios}club-arrival-types?_locale=${this.language}`)
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
      xhr.onreadystatechange = () => {
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
        `${this.urlServiciosBase}players/${idPlayer}/trajectory?_locale=${ this.language }`,
        true
      );
      xhr.setRequestHeader('Authorization', 'Bearer ' + token);
      xhr.send(formData);
    });
  }

  getTrayectory(id: number): Observable<any> {
    return this.httpClient
      .get(this.urlServicios + `${id}/trajectory?_locale=${ this.language }`)
      .pipe(map((res) => res as any[]));
  }

  getAssessment(id: number): Observable<any> {
    return this.httpClient
      .get(this.urlServicios + `assessment/${id}?_locale=${ this.language }`)
      .pipe(map((res) => res as any[]));
  }

  getAllPlayersByTeam(id: number, order = 'asc'): Observable<any> {
    return this.httpClient
      .get(
        `${AppSettings.serviceUrl}players/${id}/resumes?_locale=${this.language}&order=${order}`
      )
      .pipe(map((res) => res as any[]));
  }

  getListPuntuation(): Observable<any> {
    return this.httpClient
      .get(`${this.urlServicios}assessment/punctuation?_locale=${ this.language }`)
      .pipe(map((res) => res as any));
  }

  getListSkills(): Observable<any> {
    return this.httpClient
      .get(`${this.urlServicios}assessment/skills?_locale=${ this.language }`)
      .pipe(map((res) => res as any));
  }

  addAssessment(data: any, id: number): Observable<any> {
    return this.httpClient
      .post(this.urlServicios + `assessment/${id}?_locale=${ this.language }`, data)
      .pipe(map((res) => res as any));
  }

  getPlayersInjuriesLocations() {
    return this.httpClient
      .get(this.urlServicios + `injuries/locations?_locale=${this.language}`)
      .pipe(map((res) => res as any));
  }

  /**
   * get player injury
   */
  getPlayerInjuryById(player_id: number): Observable<any> {
    return this.httpClient
      .get(
        `${this.urlServicios}injuries/show/${player_id}?_locale=${this.language}`
      )
      .pipe(map((res) => res as any[]));
  }

  /**
   * get player by id
   */
  getPlayerById(player_id: number): Observable<any> {
    return this.httpClient
      .get(`${this.urlServicios}view/${player_id}?_locale=${ this.language }`)
      .pipe(map((res) => res as any[]));
  }

  /**
   * get players lineup
   */
  /**
   *  scouting status
   */
  getPlayersLineup(id: number): Observable<any> {
    return this.httpClient
      .get(this.urlServicios + `type-players?_locale=${ this.language }`)
      .pipe(map((res) => res as any[]));
  }

  /**
   * verify match date and hour
   */
  getTypePlayers(sport: string): Observable<any> {
    return this.httpClient
      .get(`${this.urlServicios}type-players?sport=${sport}&_locale=${ this.language }`)
      .pipe(map((res) => res as any[]));
  }

  getResumePlayer(teamId: any, playerId: any) {
    return this.httpClient
      .get(
        `${this.urlServicios}${teamId}/resume/${playerId}?_locale=${this.language}`
      )
      .pipe(map((res) => res as any));
  }
  getTrainingLoad(entity: any, id: any) {
    return this.httpClient
      .get<IResponseListRest<TraininLoad>>(
        `${this.urlServiciosBase}training/training-load/${entity}/${id}?_locale=${this.language}`
      )
      .pipe(map((res) => res as any));
  }
  getTrainingLoadPeriod(entity: any, id: any) {
    return this.httpClient
      .get<IResponseListRest<TraininLoad>>(
        `${this.urlServiciosBase}training/training-load-period/${entity}/${id}?_locale=${this.language}`
      )
      .pipe(map((res) => res as any));
  }
  private setValue(field: string, value: any, fb: FormData) {
    if (value !== null && value !== undefined) {
      fb.append(field, value);
    }
  }
}
