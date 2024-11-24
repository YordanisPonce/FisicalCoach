import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class EffortRecoveryService {
  private locale: any;
  public url: string = environment.API_URL + 'effort-recovery';
  constructor(public httpClient: HttpClient) {
    this.locale = localStorage.getItem('languaje');
  }

  public getEffortRecoveryList(teamId: string): Observable<any> {
    return this.httpClient
      .get(this.url + `/${teamId}/players?_locale=${this.locale}`)
      .pipe(map((res) => res as any[]));
  }

  public getEffortProgramDetails(
    playerId: string,
    recoveryProgramId: string
  ): Observable<any> {
    return this.httpClient
      .get(
        this.url +
          `/${playerId}/show/${recoveryProgramId}?_locale=${this.locale}`
      )
      .pipe(map((res) => res as any[]));
  }

  public getEffortProgramsRecord(
    playerId: string,
    teamId: number
  ): Observable<any> {
    return this.httpClient
      .get(
        this.url + `/team/${teamId}/player/${playerId}?_locale=${this.locale}`
      )
      .pipe(map((res) => res as any[]));
  }

  public getEffortRecoveryStrategies(): Observable<any> {
    return this.httpClient
      .get(this.url + `/strategies?_locale=${this.locale}`)
      .pipe(map((res) => res as any[]));
  }

  public getQuestionnaireQuestions(): Observable<any> {
    return this.httpClient
      .get(this.url + `/questionnaire/types?_locale=${this.locale}`)
      .pipe(map((res) => res as any[]));
  }

  public getQuestionnaireAnswersOptions(
    questionnaire_item_type: string
  ): Observable<any> {
    return this.httpClient
      .get(
        this.url +
          `/questionnaire/items/${questionnaire_item_type}?_locale=${this.locale}`
      )
      .pipe(map((res) => res as any[]));
  }

  public createNewProgram(data: any, playerId: string): Observable<any> {
    return this.httpClient.post(
      `${this.url}/${playerId}?_locale=${this.locale}`,
      data
    );
  }

  public editProgram(
    data: any,
    playerId: string,
    recoveryProgramId: string
  ): Observable<any> {
    return this.httpClient.put(
      `${this.url}/${playerId}/update/${recoveryProgramId}?_locale=${this.locale}`,
      data
    );
  }

  public createRecoveryTest(
    data: any,
    recoveryProgramId: string
  ): Observable<any> {
    return this.httpClient.post(
      `${this.url}/questionnaire/${recoveryProgramId}?_locale=${this.locale}`,
      data
    );
  }

  public editRecoveryTest(
    data: any,
    recoveryProgramId: string,
    questionnaireId: string
  ): Observable<any> {
    return this.httpClient.put(
      `${this.url}/${recoveryProgramId}/questionnaire/${questionnaireId}?_locale=${this.locale}`,
      data
    );
  }

  public deleteRecoveryProgram(
    playerId: string,
    recoveryProgramId: string
  ): Observable<any> {
    return this.httpClient
      .delete(
        this.url +
          `/${playerId}/delete/${recoveryProgramId}?_locale=${this.locale}`
      )
      .pipe(map((res) => res as any));
  }

  public getRecoveryProgramPdf(
    playerId: string,
    recoveryProgramId: string
  ): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/pdf');
    return this.httpClient.get(
      `${this.url}/${playerId}/pdf/${recoveryProgramId}?_locale=${this.locale}`,
      { headers: headers, responseType: 'blob' }
    );
  }

  public getAllRecoveryProgramsPdf(playerId: string): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/pdf');
    return this.httpClient.get(
      `${this.url}/${playerId}/pdfs?_locale=${this.locale}`,
      { headers: headers, responseType: 'blob' }
    );
  }
}
