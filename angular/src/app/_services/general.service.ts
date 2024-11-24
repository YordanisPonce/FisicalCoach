import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { AppSettings } from '../../proyect.conf';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GeneralService {
  private urlServicios = AppSettings.serviceUrl + 'countries';
  private urlServiciosSport = AppSettings.serviceUrl + 'sports';
  private url = AppSettings.serviceUrl;
  private locale: any;

  constructor(private httpClient: HttpClient) {
    this.locale = localStorage.getItem('languaje');
  }

  getAutocomplete(local: string, data: any): Observable<any> {
    return this.httpClient
      .get(this.urlServicios + 'list?_locale=' + this.locale + '&name=' + data)
      .pipe(map((res) => res as any[]));
  }

  getCountry(): Observable<any> {
    return this.httpClient
      .get(`${this.urlServicios}?_locale=${this.locale}`)
      .pipe(map((res) => res as any[]));
  }

  getCities(locale: any, code: string): Observable<any> {
    return this.httpClient
      .get(this.urlServicios + `/${code}/provinces?_locale=${this.locale}`)
      .pipe(map((res) => res as any[]));
  }

  getProvincies(code: string): Observable<any> {
    return this.httpClient
      .get(this.urlServicios + `/${code}/provinces?_locale=${this.locale}`)
      .pipe(map((res) => res as any[]));
  }

  getListSport(
    allSports: boolean = true,
    scouting: boolean = false
  ): Observable<any> {
    if (!allSports) {
      return this.httpClient
        .get(
          this.urlServiciosSport +
            `?scouting=${scouting}&_locale=${this.locale}`
        )
        .pipe(map((res) => res as any[]));
    } else {
      return this.httpClient
        .get(this.urlServiciosSport + `?_locale=${this.locale}`)
        .pipe(map((res) => res as any[]));
    }
  }

  getListGender(): Observable<any> {
    return this.httpClient
      .get(this.url + `users/gender?_locale=${this.locale}`)
      .pipe(map((res) => res as any[]));
  }

  getListGenderIdentity(): Observable<any> {
    return this.httpClient
      .get(this.url + `users/gender-identity?_locale=${this.locale}`)
      .pipe(map((res) => res as any[]));
  }

  getGenderIdentity(): Observable<any> {
    return this.httpClient
      .get(this.url + `users/gender-identity?_locale=${this.locale}`)
      .pipe(map((res) => res as any[]));
  }

  getTeamGenders(): Observable<any> {
    return this.httpClient
      .get(this.url + `teams/genders?_locale=${this.locale}`)
      .pipe(map((res) => res as any[]));
  }

  getListStudy(): Observable<any> {
    return this.httpClient
      .get(this.url + 'study-levels?_locale=' + this.locale)
      .pipe(map((res) => res as any[]));
  }

  getWeatherList(): Observable<any> {
    return this.httpClient
      .get(this.url + 'weathers?_locale=' + this.locale)
      .pipe(map((res) => res as any[]));
  }

  getSeasons(): Observable<any> {
    return this.httpClient
      .get(this.url + 'seasons?_locale=' + this.locale)
      .pipe(map((res) => res as any[]));
  }

  getTeamTypes(): Observable<any> {
    return this.httpClient.get(this.url + `teams/types?_locale=${this.locale}`);
  }

  getWeekDays(): Observable<any> {
    return this.httpClient.get(this.url + `week-days/?_locale=${this.locale}`);
  }

  getTax(): Observable<any> {
    return this.httpClient.get(this.url + `taxes?_locale=${this.locale}`);
  }

  getTaxByCountryAndProvince(
    isCompany: boolean,
    countryId: number,
    provinceId: any = null
  ): Observable<any> {
    return provinceId
      ? this.httpClient.get(
          this.url +
            `taxes/${isCompany}/${countryId}/${provinceId}?_locale=${this.locale}`
        )
      : this.httpClient.get(
          this.url + `taxes/${isCompany}/${countryId}?_locale=${this.locale}`
        );
  }

  public getAcneaeTypes() {
    return this.httpClient
      .get(`${this.url}acneae/types?_locale=${this.locale}`)
      .pipe(map((res) => res as any[]));
  }

  getBannerData(): Observable<any> {
    return this.httpClient
      .get(`${this.url}splashs?_locale=${this.locale}`)
      .pipe(map((res) => res as any[]));
  }
}
