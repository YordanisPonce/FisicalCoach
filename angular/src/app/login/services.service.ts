import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable( {
  providedIn: 'root'
} )
export class ServicesService {
  locale = localStorage.getItem( 'languaje' );
  public url: string = environment.API_URL + 'auth/login?_locale=' + this.locale;
  public urlvirificated: string = environment.API_URL + 'users/email/verify/';
  public recuperate: string = environment.API_URL + 'auth/forgot-password';
  public active: string = environment.API_URL + 'users/email/verify/resend';
  public headers: any;
  public urlsplash: string = environment.API_URL + 'splashs/external?_locale=' + this.locale;

  constructor( public http: HttpClient ) {
    this.headers = new HttpHeaders().set( 'Content-Type', 'application/json' );
  }

  sendData( env: any ) {
    return this.http.post( this.url, env );
  }

  verificated( ida: any, idb: any ) {
    return this.http.get( this.urlvirificated + ida + '/' + idb, { headers: this.headers } );
  }

  recuperatePass( email: any ) {
    let env = { email };
    return this.http.post( this.recuperate, env, { headers: this.headers } );
  }

  activeUser( login: any ) {
    return this.http.post( this.active, { login }, { headers: this.headers } );
  }

  getSplash() {
    return this.http.get( this.urlsplash, { headers: this.headers } );
  }
}

//un comentario ramdon
