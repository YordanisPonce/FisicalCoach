import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { AppSettings } from '../../proyect.conf';
import { Observable } from 'rxjs';
import { Club } from '../_models/club';
import * as moment from 'moment';
import { MembersInterface } from '../modules/academy/members-invitations/_models/user-invitations.interface';

@Injectable({
  providedIn: 'root',
})
export class ClubService {
  private urlServicios = AppSettings.serviceUrl + 'clubs';
  private urlActivytiesServicios = AppSettings.serviceUrl + 'activities';
  private urlServiciosBase = AppSettings.serviceUrl;
  private locale = localStorage.getItem('languaje');

  constructor(private httpClient: HttpClient) {}

  getList(): Observable<any> {
    return this.httpClient
      .get(`${this.urlServicios}?_locale=${this.locale}`)
      .pipe(map((res) => res as Club[]));
  }

  getListActivities(idClub: any): Observable<any> {
    return this.httpClient
      .get(`${this.urlServicios}/${idClub}/activities?per_page=${2}?_locale=${this.locale}`)
      .pipe(map((res) => res as any[]));
  }

  getHistoryActivities(
    idClub: any,
    type = 'club',
    typeProfile = 'sport',
    page: number
  ): Observable<any> {
    return this.httpClient
      .get(
        this.urlServiciosBase +
          'activities' +
          `?id=${idClub}&type=${type}&type_profile=${typeProfile}&_locale=${
            this.locale
          }&per_page=${10}&page=${page}`
      )
      .pipe(map((res) => res as any[]));
  }

  getClubsActivities(): Observable<any> {
    return this.httpClient
      .get(`${this.urlActivytiesServicios}/user/clubs?_locale=${this.locale}`)
      .pipe(map((res) => res as Club[]));
  }

  getInvitationsMembers(clubId: string) {
    return this.httpClient
      .get(
        this.urlServicios +
          `/${clubId}/invitations/members-list?_locale=${this.locale}`
      )
      .pipe(map((res) => res as MembersInterface[]));
  }

  getListMember(clubId: string, filter: string): Observable<any> {
    return this.httpClient
      .get(this.urlServicios + `/${clubId}/staffs?${filter}`)
      .pipe(map((res) => res as any[]));
  }

  getMembersInvitationsList(idClub: string): Observable<any> {
    return this.httpClient
      .get(this.urlServicios + `/${idClub}/invitations?_locale=${this.locale}`)
      .pipe(map((res) => res as any[]));
  }

  public updateMembersInvitation(data: any): Observable<any> {
    return this.httpClient
      .put(
        this.urlServicios + `/invitations/update?_locale=${this.locale}`,
        data
      )
      .pipe(map((res) => res as any[]));
  }

  public inviteMembers(data: any): Observable<any> {
    return this.httpClient.post(
      `${this.urlServicios}/invite?_locale=${this.locale}`,
      data
    );
  }

  public getInvitationByCode(idClub: any, code: string) {
    return this.httpClient
      .get(
        this.urlServicios +
          `/${idClub}/invitations/${code}?_locale=${this.locale}`
      )
      .pipe(map((res) => res as any));
  }

  public cancelInvitation(code: string) {
    return this.httpClient
      .delete(this.urlServicios + `/invitations/${code}?_locale=${this.locale}`)
      .pipe(map((res) => res as any));
  }

  public deleteClub(idClub: number) {
    return this.httpClient
      .delete(this.urlServicios + '/' + idClub + `?_locale=${this.locale}`)
      .pipe(map((res) => res as any));
  }

  public add(club: Club | any, file: File) {
    const token = localStorage.getItem('token');
    return new Promise((resolve, reject) => {
      const formData: FormData = new FormData();
      const xhr = new XMLHttpRequest();
      this.setValue('full_idname', club.id, formData);
      this.setValue('name', club.name, formData);
      this.setValue('address', club.address, formData);
      this.setValue('street', club.street, formData);
      this.setValue('postal_code', club.postal_code, formData);
      this.setValue('city', club.city, formData);
      this.setValue('province_id', club.province_id, formData);
      this.setValue('country_id', club.country_id, formData);
      formData.append('phone', JSON.stringify(club.phone));
      formData.append('mobile_phone', JSON.stringify(club.mobile_phone));
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
      xhr.open('POST', this.urlServicios + '?_locale=' + this.locale, true);
      xhr.setRequestHeader('Authorization', 'Bearer ' + token);
      xhr.send(formData);
    });
  }

  public update(club: Club, file: File) {
    const token = localStorage.getItem('token');
    return new Promise((resolve, reject) => {
      const formData: FormData = new FormData();
      const xhr = new XMLHttpRequest();
      this.setValue('full_idname', club.id, formData);
      this.setValue('name', club.name, formData);
      this.setValue('address', club.address, formData);
      this.setValue('street', club.street, formData);
      this.setValue('postal_code', club.postal_code, formData);
      this.setValue('city', club.city, formData);
      this.setValue('province_id', club.province_id, formData);
      this.setValue('country_id', club.country_id, formData);
      formData.append('phone', JSON.stringify(club.phone));
      formData.append('mobile_phone', JSON.stringify(club.mobile_phone));

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
        this.urlServicios + '/' + club.id + '?_locale=' + this.locale,
        true
      );
      xhr.setRequestHeader('Authorization', 'Bearer ' + token);
      xhr.send(formData);
    });
  }

  getListJobAreas(): Observable<any> {
    return this.httpClient
      .get(this.urlServiciosBase + 'jobs-area?_locale=es')
      .pipe(map((res) => res as Club[]));
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

  addMember(member: any, club: Club, advancedMember?: boolean) {
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
      xhr.open(
        'POST',
        `${this.urlServicios}/${club.id}/staffs?_locale=${this.locale}`,
        true
      );
      xhr.setRequestHeader('Authorization', 'Bearer ' + token);
      xhr.send(this.memberFormData(member, advancedMember));
    });
  }

  public deleteMember(clubId: string, idMember: number) {
    return this.httpClient
      .delete(`${this.urlServicios}/${clubId}/staffs/${idMember}`)
      .pipe(map((res) => res as any));
  }

  updateMember(member: any, clubId: number, memberId: number) {
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
      xhr.open(
        'POST',
        `${this.urlServicios}/${clubId}/staffs/${memberId}/update?_locale=${this.locale}`,
        true
      );
      xhr.setRequestHeader('Authorization', 'Bearer ' + token);
      xhr.send(this.memberFormData(member, true));
    });
  }

  invitation(code: string, type: string) {
    return this.httpClient.get(
      `${this.urlServicios}/invitations/${code}/handle?action=${type}&_locale=${this.locale}`
    );
  }

  private setValue(field: string, value: any, fb: FormData) {
    if (value !== null && value !== undefined) {
      fb.append(field, value);
    }
  }
}
