import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TutorshipService {
  constructor(
    public httpClient: HttpClient
  ) { 
    this.locale = localStorage.getItem('languaje')
  }

  private locale:any
  public url:string = environment.API_URL+'tutorships/tutorships'
  public pdfUrl:string = environment.API_URL+'tutorships'
  public typesUrl:string = environment.API_URL+'tutorships/types'
  public specialistUrl:string = environment.API_URL+'tutorships/specialist-referrals'

  // THIS MAY GET TEACHERS AND STUDENTS TUTORSHIPS LIST
  public getTutorshipList(schoolCenterId:string,teachers:boolean=false):Observable<any>{
    return this.httpClient.get(`${this.url}/school-center/${schoolCenterId}/${teachers ? 'teachers' : 'alumns'}?_locale=${this.locale}`).pipe( map( res => res as any [] ) );
  }

  public getTutorshipsTypes():Observable<any>{
    return this.httpClient.get(`${this.typesUrl}?_locale=${this.locale}`).pipe( map( res => res as any [] ) );
  }

  public getTutorshipsSpecialists():Observable<any>{
    return this.httpClient.get(`${this.specialistUrl}?_locale=${this.locale}`).pipe( map( res => res as any [] ) );
  }

  public getTutorshipDetails(tutorshipId:string):Observable<any>{
    return this.httpClient.get(`${this.url}/${tutorshipId}?_locale=${this.locale}`).pipe( map( res => res as any [] ) );
  }

  public getTutorshipPdf(tutorshipId:string):Observable<any>{
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/pdf');
    return this.httpClient.get(`${this.pdfUrl}/pdf/${tutorshipId}?_locale=${this.locale}`,{ headers: headers, responseType: 'blob' });
  }

  public getTutorshipsRecord(alumnId:string):Observable<any>{
    return this.httpClient.get(`${this.url}/alumn/${alumnId}?_locale=${this.locale}`).pipe( map( res => res as any [] ) );
  }

  public createTutorship(schoolCenterId:string,data:any): Observable<any>{
    return this.httpClient.post(`${this.url}/school-center/${schoolCenterId}`,data).pipe( map( res => res as any [] ) );
  }
 
  public deleteTutorship(tutorshipId:string):Observable<any>{
    return this.httpClient.delete(this.url+`/${tutorshipId}`).pipe(map(res => res as any))
  }

  public updateTutorship(tutorshipId:string,data:any):Observable<any>{
    return this.httpClient.put(`${this.url}/${tutorshipId}`,data).pipe(map(res => res as any[]))
  }
}
