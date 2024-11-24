import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { AppSettings } from '../../proyect.conf';
import { Observable } from 'rxjs';

import * as moment from 'moment';
import { Match } from '../_models/competition';

@Injectable({
  providedIn: 'root',
})
export class CompetitionService {
  private urlServicios = AppSettings.serviceUrl + 'competitions';
  private urlReferee = AppSettings.serviceUrl + 'referees';
  private readonly locale = localStorage.getItem('languaje');

  constructor(private httpClient: HttpClient) {}

  /**
   * get all competitions
   * @returns competitions
   */
  getCompetitionsList(): Observable<any> {
    return this.httpClient
      .get(this.urlServicios)
      .pipe(map((res) => res as any[]));
  }

  /**
   * get competitions by id
   * @param id
   * @returns competitions by id
   */
  getCompetitionDetailsById(id: number): Observable<any> {
    return this.httpClient
      .get(this.urlServicios + '/' + id)
      .pipe(map((res) => res as any[]));
  }

  /**
   * get competitions by team
   * @param id
   * @returns competitions by team
   */
  getCompetitionsListByTeam(id: number): Observable<any> {
    return this.httpClient
      .get(this.urlServicios + '/team/' + id)
      .pipe(map((res) => res as any[]));
  }

  /**
   * get nex competitions by team
   * @returns next matches
   */
  getRecentMatchesByTeam(id: number): Observable<any> {
    return this.httpClient
      .get(this.urlServicios + '/matches/recent/team/' + id)
      .pipe(map((res) => res as any[]));
  }

  /**
   * get nex competitions by team
   * @returns next matches
   */
  getNextMatchesByTeam(id: number): Observable<any> {
    return this.httpClient
      .get(this.urlServicios + '/matches/next/team/' + id)
      .pipe(map((res) => res as any[]));
  }

  /**
   * get rival teams by competition
   * @returns rival teams
   */
  getRivalTeamsByCompetitionId(id: number): Observable<any> {
    return this.httpClient
      .get(this.urlServicios + '/rival-teams/competition/' + id)
      .pipe(map((res) => res as any[]));
  }

  /**
   * get last match lineup by competition
   * @returns rival teams
   */
  getLastMatchLineupByCompetition(id: number): Observable<any> {
    return this.httpClient
      .get(this.urlServicios + '/matches/lineups/competition/' + id + '/last')
      .pipe(map((res) => res as any[]));
  }

  /**
   * Get Last Match Players By Competition
   * @returns rival teams
   */
  getLastMatchPlayersByCompetition(id: number): Observable<any> {
    return this.httpClient
      .get(this.urlServicios + '/matches/players/competition/' + id + '/last')
      .pipe(map((res) => res as any[]));
  }

  /**
   * create competition
   * @param data
   * @returns competition created
   */
  createCompetition(data: any) {
    const token = localStorage.getItem('token');

    return new Promise((resolve, reject) => {
      const formData: FormData = new FormData();
      const xhr = new XMLHttpRequest();

      formData.append('name', data.name);
      formData.append('type_competition_id', data.type_competition_id);
      formData.append(
        'date_start',
        moment(data.date_start).format('YYYY-MM-DD')
      );
      formData.append('date_end', moment(data.date_end).format('YYYY-MM-DD'));

      formData.append('team_id', data.team_id);
      formData.append('image', data.image);

      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status === 200 || xhr.status === 201) {
            resolve(xhr.response);
          } else {
            reject(xhr.response);
          }
        }
      };

      xhr.open('POST', this.urlServicios + '?_locale=es', true);
      xhr.setRequestHeader('Authorization', 'Bearer ' + token);
      xhr.send(formData);
    });
  }

  /**
   * create competition
   * @param data
   * @returns competition created
   */
  updateCompetition(data: any, competitionId: number = 0) {
    const token = localStorage.getItem('token');

    return new Promise((resolve, reject) => {
      const formData: FormData = new FormData();
      const xhr = new XMLHttpRequest();

      formData.append('name', data.name);
      formData.append('type_competition_id', data.type_competition_id);
      formData.append(
        'date_start',
        moment(data.date_start).format('YYYY-MM-DD')
      );
      formData.append('date_end', moment(data.date_end).format('YYYY-MM-DD'));

      formData.append('team_id', data.team_id);
      formData.append('image', data.image);

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
        'PUT',
        this.urlServicios + `/${competitionId}` + '?_locale=es',
        true
      );

      xhr.setRequestHeader('Authorization', 'Bearer ' + token);
      xhr.send(formData);
    });
  }

  /**
   * delete competition
   */
  deleteCompetition(id: number): Observable<any> {
    return this.httpClient
      .delete(`${this.urlServicios}/${id}?_locale=${this.locale}`)
      .pipe(map((res) => res as any));
  }

  /**
   * create competition match
   * @param id
   * @returns match created
   */
  createRivalTeams(data: any): Observable<any> {
     

    return this.httpClient
      .post(
        `${this.urlServicios}/rival-teams/bulk?_locale=${this.locale}`,
        data
      )
      .pipe(map((res) => res as any));
  }

  /**
   * get rivals by team
   * @param id
   * @returns rivals by team
   */
  getRivalsByTeamId(id: number): Observable<any> {
    return this.httpClient
      .get(this.urlServicios + '/rival-teams/competition/' + id)
      .pipe(map((res) => res as any[]));
  }

  /**
   * create competition match
   * @param id
   * @returns match created
   */
  createMatchCompetition(data: Match): Observable<any> {
    return this.httpClient
      .post(this.urlServicios + '/matches/add', data)
      .pipe(map((res) => res as any));
  }

  /**
   * edit competition match
   * @param id
   * @returns match created
   */
  editMatchCompetition(
    data: Match,
    teamId: number,
    id: number
  ): Observable<any> {
    return this.httpClient
      .put(this.urlServicios + '/' + teamId + '/matches/' + id, data)
      .pipe(map((res) => res as any));
  }

  /**
   * create match Lineup
   * @param id
   * @returns match lineup created
   */
  createMatchLineUp(data: any): Observable<any> {
    return this.httpClient
      .post(this.urlServicios + '/matches/lineups/add', data)
      .pipe(map((res) => res as any));
  }

  /**
   * create match players bulk
   * @param id
   * @returns match players bulk created
   */
  createMatchPlayersBulks(data: any): Observable<any> {
    return this.httpClient
      .post(this.urlServicios + '/matches/players/bulk', { players: data })
      .pipe(map((res) => res as any));
  }

  /**
   * get matches by competition
   */

  getMatchesByCompetiton(id: number): Observable<any> {
    return this.httpClient
      .get(this.urlServicios + '/matches/competition/' + id)
      .pipe(map((res) => res as any[]));
  }

  /**
   * get matches by competition
   */

  getMatchByTeam(matchId: number, teamId: number): Observable<any> {
    return this.httpClient
      .get(this.urlServicios + '/' + teamId + '/matches/' + matchId)
      .pipe(map((res) => res as any[]));
  }

  /**
   * get referees by sport
   */

  getRefereeListBySport(sport: string = 'football'): Observable<any> {
    return this.httpClient
      .get(AppSettings.serviceUrl + 'referees/' + 'sport/' + sport)
      .pipe(map((res) => res as any[]));
  }

  /**
   * get referees by team id
   */

  getRefereeListByTeamId(teamID: number): Observable<any> {
    return this.httpClient
      .get(AppSettings.serviceUrl + 'referees/' + teamID)
      .pipe(map((res) => res as any[]));
  }

  /**
   * get all matches by Competition
   * @returns next matches
   */
  getAllMatchesbyCompetition(id: number): Observable<any> {
    return this.httpClient
      .get(this.urlServicios + '/' + id + '/matches')
      .pipe(map((res) => res as any[]));
  }

  /**
   * verify match date and hour
   */
  verifyMatches(
    teamId: number,
    date: string,
    competitionId: number
  ): Observable<any> {
    return this.httpClient
      .get(
        `${this.urlServicios}/${competitionId}/team/${teamId}/verify-matches?date_start=${date}`
      )
      .pipe(map((res) => res as any[]));
  }

  /**
   *  create referee
   */
  createRefereeByName(name: any, team_id: number): Observable<any> {
    return this.httpClient
      .post(this.urlReferee, { name, team_id })
      .pipe(map((res) => res as any));
  }

  /**
   * add rival team by existing competition
   */
  addRivalTeamByCompetition(data: any) {
    const token = localStorage.getItem('token');

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200 || xhr.status === 201) {
            resolve(xhr.response);
          } else {
            reject(xhr.response);
          }
        }
      };
      xhr.open('POST', this.urlServicios + '/rival-teams/store', true);
      xhr.setRequestHeader('Authorization', 'Bearer ' + token);
      xhr.send(data);
    });
  }

  /**
   *  delete rival team
   */
  deleteRival(id: number): Observable<any> {
    return this.httpClient
      .delete(`${this.urlServicios}/rival-teams/${id}`)
      .pipe(map((res) => res as any));
  }

  /**
   * get types
   * @returns competition types
   */
  getCompetitionType(code: string): Observable<any> {
    return this.httpClient
      .get(
        `${this.urlServicios}/type-competitions/${code}?_locale=${this.locale}`
      )
      .pipe(map((res) => res as any[]));
  }

  /**
   * get test categories
   * @returns categories
   */
  getTestCategories(): Observable<any> {
    return this.httpClient
      .get(`${this.urlServicios}/test-categories/match?_locale=${this.locale}`)
      .pipe(map((res) => res as any[]));
  }

  /**
   * get test categories
   * @returns categories
   */
  getTestTypeCategories(typeCode: string): Observable<any> {
    return this.httpClient
      .get(
        `${this.urlServicios}/test-categories/type/${typeCode}/match?_locale=${this.locale}`
      )
      .pipe(map((res) => res as any[]));
  }

  /**
   * get sport competition modality
   * @param sportCode
   * @returns
   */
  getCompetitionModality(sportCode: string): Observable<any> {
    return this.httpClient
      .get(
        this.urlServicios +
          `/match/type-modalities/${sportCode}/?_locale=${this.locale}`
      )
      .pipe(map((res) => res as any));
  }

  /**
   * update player perception effor
   * @param sportCode
   * @returns
   */
  updatePerceptionEffort(
    matchId: number,
    data: {
      player_id: number;
      perception_effort_id: number;
    }
  ): Observable<any> {
    return this.httpClient
      .post(
        this.urlServicios +
          `/matches/competition/${matchId}/percept_effort?_locale=${this.locale}`,
        data
      )
      .pipe(map((res) => res as any));
  }

  /**
   * get next matches by club
   * @returns club matches
   */
  getRecentMatchesByClub(): Observable<any> {
    return this.httpClient
      .get(`${this.urlServicios}/matches/recent`)
      .pipe(map((res) => res as any[]));
  }
}
