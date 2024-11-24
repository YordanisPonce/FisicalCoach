import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode';
import { SocialUser } from '@abacritt/angularx-social-login';
import { Router } from '@angular/router';
import { ProfieService } from 'src/app/modules/profile/profile-services/profie.service';
import { AppStateService } from '../../stateManagement/appState.service';

@Injectable( { providedIn: 'root' } )
export class AuthService {

  public headers: any;

  constructor( public http: HttpClient,
               public ruta: Router,
               public httpProfile: ProfieService,
               private appStateService: AppStateService ) {

    this.headers = new HttpHeaders().set( 'Content-Type', 'application/json' );

  }

  login( username: string, password: string ): void {
    console.log('Login iniciado con:', username, password);
    this.http.post<any>( environment.API_URL + 'auth/login', { username, password }, { headers: this.headers } ).subscribe( {
      next: data => {
        console.log('Token recibido:', data.token);
        localStorage.setItem( 'token', data.token );
        this.ruta.navigate( [ '/inicio' ] );
      },
      error: error => {
        console.error( 'There was an error!', error );
      }
    } );
  }

  loginGOAuth2( socialUser: SocialUser ): void {
    const { id, name, photoUrl, firstName, lastName, authToken, idToken, provider, response } = socialUser;

    this.http.post<any>( environment.API_URL + 'auth/login-google', {
      id,
      name,
      photoUrl,
      firstName,
      lastName,
      auth_toke: authToken,
      idToken,
      provider,
      response

    }, { headers: this.headers } ).subscribe( {
      next: data => {
        const decoded = jwt_decode( data.token );
        localStorage.setItem( 'jwt', JSON.stringify( decoded ) );
        localStorage.setItem( 'token', data.token );
        this.httpProfile.getProfile().subscribe( ( datos: any ) => {
          console.log( datos );
          this.appStateService.updateUserData( datos.data );
          if ( datos.data.subscription_active != null ) {
            localStorage.setItem( 'name', datos.data.full_name );
            this.ruta.navigate( [ '/inicio' ] );

          } else {
            localStorage.removeItem( 'token' );
            localStorage.setItem( 'uvr', datos.data.id );
            this.ruta.navigateByUrl( '/register/register-pays' );
          }
        } );

      },
      error: error => {
        localStorage.setItem( 'data', JSON.stringify( socialUser ) );
        this.ruta.navigateByUrl( '/register' );
        console.log( 'There was an error!', error );
      }
    } );
  }
}
