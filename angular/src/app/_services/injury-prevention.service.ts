import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class InjuryPreventionService {
  private locale: any;
  public url: string = environment.API_URL + 'injury-prevention';
  constructor(public httpClient: HttpClient) {
    this.locale = localStorage.getItem('languaje');
  }

  public getInjuriesListByTeam(teamId: string): Observable<any> {
    return this.httpClient
      .get(this.url + `/${teamId}/players`)
      .pipe(map((res) => res as any[]));
  }

  public getPlayerInjurieDetails(
    teamId: string,
    playerId: string,
    injuryPreventionId: string
  ): Observable<any> {
    return this.httpClient
      .get(
        this.url +
          `/${teamId}/players/${playerId}/show/${injuryPreventionId}?_locale=${this.locale}`
      )
      .pipe(map((res) => res as any[]));
  }

  public getInjuryProgramsRecord(
    teamId: string,
    playerId: string
  ): Observable<any> {
    return this.httpClient
      .get(this.url + `/${teamId}/players/${playerId}?_locale=${this.locale}`)
      .pipe(map((res) => res as any[]));
  }

  public getPreventiveProgramTypes() {
    return this.httpClient
      .get(this.url + `/preventive-program-types?_locale=${this.locale}`)
      .pipe(map((res) => res as any[]));
  }

  public createNewProgram(
    data: any,
    teamId: string,
    playerId: string
  ): Observable<any> {
    return this.httpClient.post(
      `${this.url}/${teamId}/players/${playerId}?_locale=${this.locale}`,
      data
    );
  }

  public deleteInjuryProgram(
    teamId: string,
    playerId: string,
    injuryPreventionId: string
  ): Observable<any> {
    return this.httpClient
      .delete(
        this.url +
          `/${teamId}/players/${playerId}/delete/${injuryPreventionId}?_locale=${this.locale}`
      )
      .pipe(map((res) => res as any));
  }

  public getEvaluationQuestions() {
    return this.httpClient
      .get(this.url + `/evaluation-questions?_locale=${this.locale}`)
      .pipe(map((res) => res as any[]));
  }

  public evaluatePreventiveProgram(
    data: any,
    teamId: string,
    playerId: string,
    injuryPreventionId: string
  ): Observable<any> {
    return this.httpClient.post(
      `${this.url}/${teamId}/players/${playerId}/finalize/${injuryPreventionId}?_locale=${this.locale}`,
      data
    );
  }

  public getInjuryPreventionPdf(
    teamId: string,
    playerId: string,
    injuryPreventionId: string
  ): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/pdf');
    return this.httpClient.get(
      `${this.url}/${teamId}/players/${playerId}/pdf/${injuryPreventionId}?_locale=${this.locale}`,
      { headers: headers, responseType: 'blob' }
    );
  }

  public getAllInjuriesPreventionPdf(
    teamId: string,
    playerId: string,
    injuryPreventionId?: string
  ): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/pdf');
    return this.httpClient.get(
      `${this.url}/${teamId}/players/${playerId}/pdfs?_locale=${this.locale}`,
      { headers: headers, responseType: 'blob' }
    );
  }
}
