import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DailyCheckService {
  constructor(
    public httpClient: HttpClient
  ) { 
    this.locale = localStorage.getItem('languaje')
  }

  private locale:any
  public url:string = environment.API_URL+'daily-control'

  getClassroomDailyControlList(classroomId:string):Observable<any>{
    return this.httpClient.get(`${this.url}/${classroomId}?_locale=${this.locale}`).pipe( map( res => res as any [] ) );
  }

  getDailyControlItems():Observable<any>{
    return this.httpClient.get(this.url+'/items').pipe( map( res => res as any [] ) );
  }

  getStudentDailyControl(classroomId:string,alumnId:string):Observable<any>{
    return this.httpClient.get(`${this.url}/${classroomId}/show/${alumnId}`).pipe( map( res => res as any [] ) );
  }

  updateStudentDailyControl(classroomId:string, data:object):Observable<any>{
    return this.httpClient.put(`${this.url}/${classroomId}`,data).pipe(map(res => res as any[]))
  }

  resetStudentDailyControl(classroomId:string,data:object|null = null):Observable<any>{
    return this.httpClient.put(`${this.url}/${classroomId}/reset`,data).pipe(map(res => res as any[]))
  }
}
