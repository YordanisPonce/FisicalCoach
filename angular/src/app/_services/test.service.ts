import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppSettings } from 'src/proyect.conf';

@Injectable({
  providedIn: 'root',
})
export class TestService {
  private urlService = AppSettings.serviceUrl + 'tests';
  private urlBase = AppSettings.serviceUrl;
  private locale: any;
  constructor(private httpClient: HttpClient) {
    this.locale = localStorage.getItem('languaje');
  }

  /**
   * get test type list
   * @returns test types
   */
  getTestList(): Observable<any> {
    return this.httpClient
      .get(this.urlService + `?_locale=${this.locale}`)
      .pipe(map((res) => res as any));
  }

  /**
   * get test players
   * @returns test player list
   */
  getTestPlayers(
    teamId: number,
    roleType: { type: string; userType: string }
  ): Observable<any> {
    return this.httpClient
      .get(
        `${this.urlService}/${roleType.type}/${teamId}/${roleType.userType}?_locale=${this.locale}`
      )
      .pipe(map((res) => res as any));
  }

  /**
   * get alumn tests
   * @returns test alumn test
   */
  getAlumnTests(classroomId: number): Observable<any> {
    return this.httpClient
      .get(
        `${this.urlService}/classroom/${classroomId}/alumns?_locale=${this.locale}`
      )
      .pipe(map((res) => res as any));
  }

  /**
   * get test list by type
   * @returns test
   */
  getTestsByType(testType: string): Observable<any> {
    return this.httpClient
      .get(this.urlService + `/${testType}/type?_locale=${this.locale}`)
      .pipe(map((res) => res as any));
  }

  /**
   * get test list by type
   * @returns test
   */
  getTestsBySubType(subTestType: string): Observable<any> {
    return this.httpClient
      .get(this.urlService + `/${subTestType}/sub-type?_locale=${this.locale}`)
      .pipe(map((res) => res as any));
  }

  /**
   * get test type list
   * @returns test types
   */
  getTestTypeList(code: string): Observable<any> {
    return this.httpClient
      .get(
        this.urlService +
          `/test-type/?classification=${code}&_locale=${this.locale}`
      )
      .pipe(map((res) => res as any));
  }

  /**
   * get test sub type lists
   * @returns test sub types
   */
  getTestSubTypeList(): Observable<any> {
    return this.httpClient
      .get(this.urlService + `/test-sub-type?_locale=${this.locale}`)
      .pipe(map((res) => res as any));
  }

  /**
   * get test unitlist
   * @returns test unist
   */
  getTestUnit(): Observable<any> {
    return this.httpClient
      .get(this.urlService + `/unit?_locale=${this.locale}`)
      .pipe(map((res) => res as any));
  }

  /**
   * show test
   * @returns test
   */
  showTest(code: string): Observable<any> {
    return this.httpClient
      .get(this.urlService + `/${code}?_locale=${this.locale}`)
      .pipe(map((res) => res as any));
  }

  /**
   * show tests by user
   * @returns users tests
   */
  showTestsByUser(
    playerid: number,
    userType: string = 'player',
    teamId: number,
    params?: any
  ): Observable<any> {
    if (params) {
      return this.httpClient
        .get(
          `${this.urlService}/application/${userType}/${playerid}?team_id=${teamId}&entity_name=test&_locale=${this.locale}&${params.type}=${params.value}`
        )
        .pipe(map((res) => res as any));
    }
    return this.httpClient
      .get(
        `${this.urlService}/application/${userType}/${playerid}?team_id=${teamId}&entity_name=test&_locale=${this.locale}`
      )
      .pipe(map((res) => res as any));
  }

  /**
   * get test application result
   * @returns application result
   */
  getTestApplicationResult(code: string): Observable<any> {
    return this.httpClient
      .get(this.urlService + `/application/${code}?_locale=${this.locale}`)
      .pipe(map((res) => res as any));
  }

  /**
   * store test
   * @returns test
   */
  storeTest(data: any): Observable<any> {
    return this.httpClient
      .post(this.urlService + `/application?_locale=${this.locale}`, data)
      .pipe(map((res) => res as any));
  }

  /**
   * delete test
   */
  deleteTest(code: string): Observable<any> {
    return this.httpClient
      .delete(`${this.urlService}/${code}?_locale=${this.locale}`)
      .pipe(map((res) => res as any));
  }

  /**
   * download pdf report by id
   */
  downloadReportById(code: number): any {
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/pdf');

    return this.httpClient.get(
      `${this.urlService}/application/${code}/pdf?_locale=${this.locale}`,
      {
        headers,
        responseType: 'arraybuffer' || 'blob' || 'json' || 'text',
      }
    );
  }
}
