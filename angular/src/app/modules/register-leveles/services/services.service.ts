import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ServicesService {
  public urlCountries: string = environment.API_URL + 'countries?_locale=';
  public urlGender: string = environment.API_URL + 'users/gender?_locale=';
  public urlRegister: string = environment.API_URL + 'users/register?_locale=';
  public urlLicenseRegister: string =
    environment.API_URL + 'users/license-register';
  public urlPackges: string = environment.API_URL + 'packages?_locale=';
  public urlSubpackage: string = environment.API_URL + 'subpackages/';
  public urlProvincias: string = environment.API_URL + 'countries/';
  public urlSubscripcion: string = environment.API_URL + 'subscriptions';
  public ulrStripe: string = environment.API_URL;
  public language: any = '';
  public urlvirificated: string = environment.API_URL + 'user/register/confirm';
  locale = localStorage.getItem('languaje');
  public urlsplash: string =
    environment.API_URL + 'splashs/external?_locale=' + this.locale;

  constructor(public http: HttpClient) {}

  getProvincias(id: any) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    this.language = localStorage.getItem('languaje');
    return this.http.get(
      this.urlProvincias + id + '/provinces?_locale=' + this.language,
      { headers }
    );
  }

  getSplash() {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get(this.urlsplash, { headers });
  }

  getCountries() {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    this.language = localStorage.getItem('languaje');
    return this.http.get(this.urlCountries + this.language, { headers });
  }

  getGender() {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    this.language = localStorage.getItem('languaje');
    return this.http.get(this.urlGender + this.language, { headers });
  }

  getPackeges() {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    this.language = localStorage.getItem('languaje');
    return this.http.get(this.urlPackges + this.language, { headers });
  }

  sendData(env: any) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post(this.urlRegister + this.language, env, { headers });
  }

  cancelSubscription(env: any) {
    return this.http.post(
      this.urlSubscripcion + '/cancel?_locale=' + this.language,
      env
    );
  }

  verificated(env: any) {
    return this.http.put(this.urlvirificated, env);
  }

  sendSubscripcion(env: any) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post(
      `${this.urlSubscripcion}?_locale=${this.language}`,
      env,
      { headers }
    );
  }

  /**
   * update subscription on profile view
   * @param env
   * @returns
   */
  updateSubscription(data: any) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.put(
      `${this.urlSubscripcion}?_locale=${this.language}`,
      data,
      { headers }
    );
  }

  /**
   * handle and verify licence invitation
   */
  handleLicenceInvitation(token: string): Observable<any> {
    return this.http
      .get(this.urlSubscripcion + '/licenses/' + token + '/handle')
      .pipe(map((res) => res as any[]));
  }

  /**
   * register with licence token verification
   */
  sendWithLicenseVerification(env: any) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post(
      `${this.urlLicenseRegister}?_locale=${this.language}`,
      env,
      { headers }
    );
  }

  getSubpackage(id: any) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    this.language = localStorage.getItem('languaje');
    return this.http.get(
      `${this.urlSubpackage}${id}?_locale=${this.language}`,
      { headers }
    );
  }
}
