import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class EvaluationService {
  constructor(public httpClient: HttpClient) {
    this.locale = localStorage.getItem('languaje');
  }

  private locale: any;
  public url: string = environment.API_URL + 'evaluation';

  public getIndicatorsList(classroomId: string | number): Observable<any> {
    return this.httpClient
      .get(`${this.url}/indicators/${classroomId}?_locale=${this.locale}`)
      .pipe(map((res) => res as any[]));
  }

  public getCompetencesList(): Observable<any> {
    return this.httpClient
      .get(`${this.url}/competences?_locale=${this.locale}`)
      .pipe(map((res) => res as any[]));
  }

  public createIndicator(data: any): Observable<any> {
    return this.httpClient
      .post(`${this.url}/indicators`, data)
      .pipe(map((res) => res as any[]));
  }

  public editIndicator(indicatorId: string, data: any): Observable<any> {
    return this.httpClient
      .put(`${this.url}/indicators/${indicatorId}`, data)
      .pipe(map((res) => res as any[]));
  }

  public deleteIndicator(indicatorId: string): Observable<any> {
    return this.httpClient
      .delete(`${this.url}/indicators/${indicatorId}?_locale=${this.locale}`)
      .pipe(map((res) => res as any[]));
  }

  public getRubrics(): Observable<any> {
    return this.httpClient
      .get(`${this.url}/rubrics`)
      .pipe(map((res) => res as any[]));
  }

  public getClassroomRubrics(classroomId: string | number): Observable<any> {
    return this.httpClient
      .get(`${this.url}/rubrics-by-classroom/${classroomId}`)
      .pipe(map((res) => res as any[]));
  }

  public getAlumnRubrics(alumnId: string, academicYear: string) {
    return this.httpClient
      .get(`${this.url}/rubrics-by-alumn/${alumnId}/classroom/${academicYear}`)
      .pipe(map((res) => res as any[]));
  }

  public createRubric(data: any): Observable<any> {
    return this.httpClient
      .post(`${this.url}/rubrics`, data)
      .pipe(map((res) => res as any[]));
  }

  public editRubric(rubricId: string, data: any): Observable<any> {
    return this.httpClient
      .put(`${this.url}/rubrics/${rubricId}`, data)
      .pipe(map((res) => res as any[]));
  }

  public exportRubricToClass(rubricId: string, data: any) {
    return this.httpClient
      .post(
        `${this.url}/rubrics/${rubricId}/attach-classroom-academic-year`,
        data
      )
      .pipe(map((res) => res as any[]));
  }

  public deleteRubric(rubricId: string): Observable<any> {
    return this.httpClient
      .delete(`${this.url}/rubrics/${rubricId}?_locale=${this.locale}`)
      .pipe(map((res) => res as any[]));
  }

  public getRubricPdf(
    rubricId: string,
    alumnId: string,
    academicYear: string
  ): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/pdf');
    return this.httpClient.get(
      `${this.url}/rubrics-pdf/${rubricId}/alumn/${alumnId}/classroom/${academicYear}?_locale=${this.locale}`,
      { headers: headers, responseType: 'blob' }
    );
  }

  public setGrade(data: any) {
    return this.httpClient
      .post(`${this.url}/grade?_locale=${this.locale}`, data)
      .pipe(map((res) => res as any[]));
  }

  public evaluationResult(data: any) {
    return this.httpClient
      .post(`${this.url}/result?_locale=${this.locale}`, data)
      .pipe(map((res) => res as any[]));
  }

  public evaluationCompetencesResult(data: any) {
    return this.httpClient
      .post(`${this.url}/competences-result?_locale=${this.locale}`, data)
      .pipe(map((res) => res as any[]));
  }

  public evaluate(data: any) {
    return this.httpClient
      .post(`${this.url}/finish?_locale=${this.locale}`, data)
      .pipe(map((res) => res as any[]));
  }

  public getRecentEvaluations(academicYear: string | number): Observable<any> {
    return this.httpClient
      .get(`${this.url}/last-evaluations-by-classroom/${academicYear}`)
      .pipe(map((res) => res as any[]));
  }
}
