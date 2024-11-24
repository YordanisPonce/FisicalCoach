import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { AppSettings } from '../../proyect.conf';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PsychologyService {
  private urlServicios = AppSettings.serviceUrl;
  private language = localStorage.getItem('languaje');
  private url = `${this.urlServicios}psychologies`;

  constructor(private httpClient: HttpClient) {
  }


  /**
   * get special lists
   * @returns special list
   */
  getListSpecialists(): Observable<any> {
    return this.httpClient.get(`${this.url}/specialists?_locale=${this.language}`).pipe(map(res => res as any[]));
  }

  /**
   * get list of players
   * @param locale 
   * @param idTeam 
   * @param filter 
   * @returns players with psycology report
   */
  getListPlayersPsychology(locale: any, idTeam: number, filter: any): Observable<any> {
    return this.httpClient.get(this.urlServicios +
      `players/${idTeam}/psychology?_locale=${locale}${filter}`).pipe(map(res => res as any[]));
  }

  /**
   * create psycology report
   * @param data
   */
  add(data: any) {
    return this.httpClient.post(`${this.url}/reports?_locale=${this.language}`, data).pipe(map(res => res as any));
  }

  /**
   * update psycology report by
   * @param data 
   * @param id 
   */
  update(data: any, id: number) {
    return this.httpClient.put(`${this.url}/reports/${id}?_locale=${this.language}`, data).pipe(map(res => res as any));
  }

  /**
   * delete player report
   * @param id
   */
  deleteReport(id: number) {
    return this.httpClient.delete(`${this.url}/reports/${id}?_locale=${this.language}`).pipe(map(res => res as any));
  }

  /**
   * download pdf reports
   */
   downloadReports(playerId: number): any {
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/pdf');

    return this.httpClient.get(`${this.url}/reports/${playerId}/pdfs?_locale=${this.language}`, {
      headers, responseType: 'arraybuffer' || 'blob' || 'json' || 'text'
    })

  }

  /**
   * download pdf report by id
   */
  downloadReportById(id: number): any {
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/pdf');

    return this.httpClient.get(`${this.url}/reports/${id}/pdf?_locale=${this.language}`, {
      headers, responseType: 'arraybuffer' || 'blob' || 'json' || 'text'
    })

  }
}
