import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ResponseInterface } from '../_models/response.interface';
import { InvoiceInterface } from '../_models/invoice.interface';


@Injectable( {
  providedIn: 'root'
} )
export class InvoiceService {
  
  public url: string = environment.API_URL + 'users/invoices';
  private locale: any;
  
  constructor( private httpClient: HttpClient ) {
    this.locale = localStorage.getItem( 'languaje' );
  }
  
  public getAllInvoices() {
    return this.httpClient.get<ResponseInterface<InvoiceInterface> | any>( `${ this.url }?_locale=${ this.locale }` ).pipe( map( res => res as ResponseInterface<InvoiceInterface> ) );
  }
  
  public downloadPDF( code: string ) {
    // @ts-ignore
    return this.httpClient.get<any>( `${ this.url }/${ code }/pdf?_locale=${ this.locale }` ,{ responseType: 'blob' });
  }
  
  public getPDFDetails( alumnId: string, classroomId: string, qualificationId: string ): Observable<Blob> {
    return this.httpClient.get( `${ this.url }/${ qualificationId }/alumn/${ alumnId }/classroom/${ classroomId }/pdf?_locale=${ this.locale }`, { responseType: 'blob' } );
  }
  
}
