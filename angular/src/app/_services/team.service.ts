import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { AppSettings } from '../../proyect.conf';
import { Observable } from 'rxjs';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class TeamService {
  private urlServicios = AppSettings.serviceUrl + 'teams';
  private urlClassService = AppSettings.serviceUrl + 'classrooms';
  private urlBase = AppSettings.serviceUrl;
  private locale: any;

  constructor(private httpClient: HttpClient) {
    this.locale = localStorage.getItem('languaje');
  }

  getTeamData(code: any) {
    return this.httpClient
      .get(`${this.urlServicios}/${code}/show?_locale=${this.locale}`)
      .pipe(map((res) => res as any));
  }

  getList(idClub: number, sportId?: number): Observable<any> {
    if (sportId) {
      return this.httpClient
        .get(`${this.urlServicios}?sport_id=${sportId}?_locale=${this.locale}`)
        .pipe(map((res) => res as any[]));
    }

    return this.httpClient
      .get(`${this.urlServicios}/${idClub}?_locale=${this.locale}`)
      .pipe(map((res) => res as any[]));
  }

  getClasroomList(idClub: number): Observable<any> {
    return this.httpClient
      .get(`${this.urlClassService}?_locale=${this.locale}`)
      .pipe(map((res) => res as any[]));
  }

  createTeam(data: any, editCode: string | null = null) {
    return new Promise((resolve, reject) => {
      const formData: any = new FormData();
      const xhr = new XMLHttpRequest();

      for (const property in data) {
        if (data[property] !== null) {
          formData.append(property, data[property]);
        }
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
        editCode ? 'PUT' : 'POST',
        editCode
          ? `${this.urlServicios}/${editCode}?_locale=${this.locale}`
          : this.urlServicios,
        true
      );
      xhr.setRequestHeader(
        'Authorization',
        'Bearer ' + localStorage.getItem('token')
      );
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.send(formData);
    });
  }

  /**
   * delete teacher
   */
  deleteTeam(teamCode: string): Observable<any> {
    return this.httpClient
      .delete(`${this.urlServicios}/${teamCode}?_locale=${this.locale}`)
      .pipe(map((res) => res as any));
  }

  updateTeamCover(teamCode: string, data: any) {
    return new Promise((resolve, reject) => {
      const formData: any = new FormData();
      const xhr = new XMLHttpRequest();
      for (const property in data) {
        formData.append(property, data[property]);
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
        `${this.urlServicios}/cover/${teamCode}?_locale=${this.locale}`,
        true
      );
      xhr.setRequestHeader(
        'Authorization',
        'Bearer ' + localStorage.getItem('token')
      );
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.send(formData);
    });
  }

  getTeamsModality(sportCode: string): Observable<any> {
    return this.httpClient
      .get(
        this.urlBase + `teams/modalities/${sportCode}/?_locale=${this.locale}`
      )
      .pipe(map((res) => res as any));
  }

  getListPosition() {
    return this.httpClient
      .get(this.urlBase + 'sports/2/positions?_locale=' + this.locale)
      .pipe(map((res) => res as any));
  }

  getListPositionByTeam(teamId: any) {
    return this.httpClient
      .get(
        this.urlBase + 'sports/' + teamId + '/positions?_locale=' + this.locale
      )
      .pipe(map((res) => res as any));
  }

  /**
   * get positions by sport id
   * @param id
   * @returns list of positions
   */
  getListPositionBySportId(id?: number) {
    return this.httpClient
      .get(this.urlBase + `sports/${id}/positions?_locale=` + this.locale)
      .pipe(map((res) => res as any));
  }

  getListPositionSpecs(id: number) {
    return this.httpClient
      .get(this.urlBase + `positions/${id}/specs?_locale=${this.locale}`)
      .pipe(map((res) => res as any));
  }

  getTypeLineupsBySportAndModality(
    sportCode: string,
    modalityCode: string | null
  ): Observable<any> {
    if (modalityCode) {
      return this.httpClient
        .get(
          `this.urlServicios/type-lineups/sport/${sportCode}/${modalityCode}?_locale=${this.locale}`
        )
        .pipe(map((res) => res as any[]));
    }

    return this.httpClient
      .get(this.urlServicios + '/type-lineups/sport/' + sportCode)
      .pipe(map((res) => res as any[]));
  }

  getStaffByClub(idClub: string, es: string = 'es'): Observable<any> {
    return this.httpClient
      .get(this.urlServicios + '/team-staff/club/' + idClub + '?_locale=' + es)
      .pipe(map((res) => res as any[]));
  }

  memberFormData(member: any, advancedMember?: boolean): FormData {
    const formData: FormData = new FormData();
    const keys = Object.keys(member);
    const date = moment(member.birth_date).format('YYYY-MM-DD');
    formData.append('full_name', member.full_name);
    formData.append('email', member.email);

    if (member.responsibility) {
      formData.append(
        'responsibility',
        member.responsibility != null ? member.responsibility : ''
      );
    }

    formData.append('gender_id', member.gender_id);

    if (member.image) {
      formData.append('image', member.image);
    }

    formData.append('jobs_area_id', member.jobs_area_id);
    formData.append('position_staff_id', member.position_staff_id);

    if (advancedMember) {
      formData.append('birth_date', date);

      keys.forEach((item) => {
        if (
          ![
            'name',
            'email',
            'responsibility',
            'gender_id',
            'work_experiences',
            'birth_date',
            'image',
          ].includes(item)
        ) {
          if (member[item] !== null) {
            if (['mobile_phone'].includes(item)) {
              formData.append(item, JSON.stringify(member[item]));
            } else {
              formData.append(item, member[item]);
            }
          } else {
            formData.append(item, '');
          }
        }
      });

      if (member.work_experiences && member.work_experiences.length > 0) {
        formData.append(
          'work_experiences',
          JSON.stringify(member.work_experiences)
        );
      }
    }

    return formData;
  }

  addMember(member: any, team: any, advancedMember?: boolean) {
    const token = localStorage.getItem('token');
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
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
        `${this.urlServicios}/${team.id}/staffs?_locale=${this.locale}`,
        true
      );
      xhr.setRequestHeader('Authorization', 'Bearer ' + token);
      xhr.send(this.memberFormData(member, advancedMember));
    });
  }

  updateMember(member: any, teamId: number, memberId: number) {
    console.log(member);
    const token = localStorage.getItem('token');
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
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
        `${this.urlServicios}/${teamId}/staffs/${memberId}/update?_locale=${this.locale}`,
        true
      );
      xhr.setRequestHeader('Authorization', 'Bearer ' + token);
      xhr.send(this.memberFormData(member, true));
    });
  }

  getStaffByTeam(teamId: string): Observable<any> {
    return this.httpClient
      .get(`${this.urlServicios}/${teamId}/staffs?_locale=${this.locale}`)
      .pipe(map((res) => res as any[]));
  }

  /**
   * get all matches by team
   * @returns next matches
   */
  getAllMatchesbyTeam(id: number): Observable<any> {
    return this.httpClient
      .get(`${this.urlServicios}/${id}/matches?_locale=${this.locale}`)
      .pipe(map((res) => res as any[]));
  }
}
