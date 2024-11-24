import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CalculatorService {
  private locale:any
  public url:string = environment.API_URL+'calculator'
  constructor(
    public httpClient: HttpClient
  ) {
    this.locale = localStorage.getItem('languaje')
  }

  public getCalculatorOptions(): Observable<any> {
    return this.httpClient.get( this.url + `/items?item_type=injury_prevention&_locale=${this.locale}`).pipe( map( res => res as any [] ) );
  }

  public calculate(data: any ): Observable<any> {
    return this.httpClient.post( this.url + `/items`, data ).pipe( map( res => res as any) );
  }

}