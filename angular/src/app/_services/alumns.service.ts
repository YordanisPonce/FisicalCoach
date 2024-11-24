import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AlumnsService implements OnDestroy {
  private url = environment.API_URL + 'alumns/';
  private urlServiciosBase = environment.API_URL;
  private locale = localStorage.getItem('languaje');
  private alumnDetailsData = new BehaviorSubject<any>({});

  alumn$ = this.alumnDetailsData.asObservable();

  constructor(private httpClient: HttpClient) {
    // console.log('iniciado el servicio de alumno')
  }

  ngOnDestroy() {
    // console.log('localService is destroyed');
  }

  public setAlumnsDetailsData(data: any) {
    this.alumnDetailsData.next(data);
  }

  public getAlumnsDetailsData() {
    return this.alumnDetailsData.getValue();
  }

  public getAlummsByClassroom(academicYearId: string): Observable<any> {
    return this.httpClient
      .get(
        `${this.url}resume/classroom/${academicYearId}?_locale=${this.locale}`
      )
      .pipe(map((res) => res as any[]));
  }

  public getAlumnById(alumnId: number): Observable<any> {
    return this.httpClient
      .get(`${this.url}${alumnId}?_locale=${this.locale}`)
      .pipe(map((res) => res as any[]));
  }

  public getAlumnDetails(
    alumnId: string,
    academicYearId: string
  ): Observable<any> {
    return this.httpClient
      .get(
        `${this.url}resume/${alumnId}/classroom/${academicYearId}?_locale=${this.locale}`
      )
      .pipe(map((res) => res as any[]));
  }

  public add(alumn: any, academicYearId: string, update: boolean = false) {
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
      const formData: any = new FormData();
      const xhr = new XMLHttpRequest();
      const date = moment(alumn.date_birth).format('YYYY-MM-DD');
      const keys = Object.keys(alumn);
      keys.forEach((item) => {
        if (
          item !== 'image' &&
          item !== 'date_birth' &&
          !phoneNumbers.includes(item) &&
          alumn[item] !== null
        ) {
          if (
            [
              'gender_identity_id',
              'parents_marital_status_id',
              'laterality_id',
            ].includes(item)
          ) {
            formData.append(item, String(alumn[item]));
          } else {
            formData.append(item, alumn[item]);
          }
        }
      });
      if (alumn.date_birth !== null) {
        formData.append('date_birth', date);
      }
      formData.append('classroom_academic_year_id', academicYearId);
      if (update) {
        formData.append('_method', 'PUT');
      }
      if (alumn.image) {
        formData.append('image', alumn.image);
      }
      phoneNumbers.forEach((phone) => {
        if (alumn[phone]) {
          formData.append(phone, `${alumn[phone]}`);
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

      const ruta = update ? `alumns/${alumn.id}` : 'alumns';
      xhr.open(
        update ? 'PUT' : 'POST',
        `${this.urlServiciosBase}${ruta}?_locale=${this.locale}`,
        true
      );
      xhr.setRequestHeader('Authorization', 'Bearer ' + token);
      xhr.send(formData);
    });
  }

  public deleteAlumn(alumnId: string) {
    return this.httpClient
      .delete(`${this.url}${alumnId}?_locale=${this.locale}`)
      .pipe(map((res) => res as any[]));
  }

  public getAlumnHealth(alumnId: string) {
    return this.httpClient
      .get(`${this.url}${alumnId}/health?_locale=${this.locale}`)
      .pipe(map((res) => res as any[]));
  }

  public getHealthStatus(alumnId: string) {
    return this.httpClient
      .get(`${this.url}${alumnId}/health`)
      .pipe(map((res) => res as any[]));
  }

  public addHealthStatus(alumnId: string, data: any) {
    return this.httpClient
      .post(`${this.url}${alumnId}/health`, data)
      .pipe(map((res) => res as any[]));
  }

  public getAlumnInjuries(alumnId: string): Observable<any> {
    return this.httpClient
      .get(`${this.url}injuries/${alumnId}?_locale=${this.locale}`)
      .pipe(map((res) => res as any));
  }

  public getInjuryDetails(injuryId: string) {
    return this.httpClient
      .get(`${this.url}injuries/show/${injuryId}?_locale=${this.locale}`)
      .pipe(map((res) => res as any));
  }
}
