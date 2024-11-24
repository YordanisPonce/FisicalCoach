import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class QualificationService {

  private locale:any
  public url:string = environment.API_URL+'qualification'

  constructor(
    private httpClient: HttpClient
    ) {
    this.locale = localStorage.getItem('languaje')
  }

  public getQualificationList(academicYearId:string): Observable<any> {
    return this.httpClient.get(`${this.url}/school-section/${academicYearId}?_locale=${this.locale}`).pipe(map(res => res as any[]));
  }

  public getPDFAll(alumnId:string, classroomId: string): Observable<Blob> {
    return this.httpClient.get(`${this.url}/alumn/${alumnId}/classroom/${classroomId}/pdf?_locale=${this.locale}`,  { responseType: 'blob' });
  }

  public getPDFDetails(alumnId:string, classroomId: string, qualificationId: string): Observable<Blob> {
    return this.httpClient.get(`${this.url}/${qualificationId}/alumn/${alumnId}/classroom/${classroomId}/pdf?_locale=${this.locale}`,  { responseType: 'blob' });
  }

  public createQualification(data:any){
    return this.httpClient.post(`${this.url}`,data).pipe( map( res => res as any [] ) );
  }

  public editQualification(qualificationId:string,data:any){
    return this.httpClient.put(`${this.url}/${qualificationId}`, data).pipe(map(res => res as any))
  }

  public deleteQualification(qualificationId:string){
    return this.httpClient.delete(`${this.url}/${qualificationId}`).pipe(map(res => res as any))
  }

  public getAlumnsQualifications(academicYearId:string){
    return this.httpClient.get(`${this.url}/results/school-section/${academicYearId}?_locale=${this.locale}`).pipe(map(res => res as any[]));
  }

  public getQualificationResume(qualificationId:string, alumnId:string, academicYearId:string){
    return this.httpClient.get(`${this.url}/${qualificationId}/alumns/${alumnId}/school-section/${academicYearId}?_locale=${this.locale}`).pipe(map(res => res as any[]));
  }
}
