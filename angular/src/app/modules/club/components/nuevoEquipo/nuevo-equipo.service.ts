import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NuevoEquipoService {
  public url:string = environment.API_URL+'teams'
  public headers:any
  constructor(
    public http: HttpClient
  ) {
    this.headers = new HttpHeaders().set('Content-Type','application/json')
  }

  sendData(data:any){
    return this.http.post(this.url,data,{headers:this.headers})
  }
}
