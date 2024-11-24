import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProfieService {
  public url: string = environment.API_URL + 'users/profile';
  public urlEdit: string = environment.API_URL + 'users/edit';
  public token: any = 'Bearer ' + localStorage.getItem('token');
  public urlGender: string = environment.API_URL + 'users/gender?_locale=';

  public urlGenderIdentity: string =
    environment.API_URL + 'users/gender-identity?_locale=';
  public language: any = localStorage.getItem('languaje') || 'es';

  public urlCountries: string = environment.API_URL + 'countries?_locale=';
  public urlPackges: string = environment.API_URL + 'packages?_locale=';
  public urlProvincias: string = environment.API_URL + 'countries/';
  public data: any = [];

  constructor(private http: HttpClient) {}

  getProfile() {
    const headers = {
      'Content-Type': 'application/json',
      // 'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    };
    return this.http.get(this.url + `?_locale=${this.language}`, { headers });
  }

  getPackeges() {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    this.language = localStorage.getItem('languaje');
    return this.http.get(this.urlPackges + this.language, { headers });
  }

  getGender() {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    this.language = localStorage.getItem('languaje');
    return this.http.get(this.urlGender + this.language, { headers });
  }

  getGenderIdentity() {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    this.language = localStorage.getItem('languaje');
    return this.http.get(this.urlGenderIdentity + this.language, { headers });
  }

  getCountries() {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    this.language = localStorage.getItem('languaje');
    return this.http.get(this.urlCountries + this.language, { headers });
  }

  getProvincias(id: any) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    this.language = localStorage.getItem('languaje');
    return this.http.get(
      this.urlProvincias + id + '/provinces?_locale=' + this.language,
      { headers }
    );
  }

  sendData(env: any) {
    this.token = 'Bearer ' + localStorage.getItem('token');
    return new Promise((resolve, reject) => {
      const fb: FormData = new FormData();
      const xhr = new XMLHttpRequest();
      this.setValue('full_name', env.full_name, fb);
      this.setValue('gender', env.gender, fb);
      this.setValue('gender_identity_id', env.gender_identity_id, fb);
      this.setValue('country_id', env.country_id, fb);
      this.setValue('address', env.address, fb);
      this.setValue('dni', env.dni, fb);
      this.setValue('zipcode', env.zipcode, fb);
      this.setValue('username', env.username, fb);
      this.setValue('province_id', env.province_id, fb);
      this.setValue('city', env.city, fb);
      this.setValue('is_company', env.is_company, fb);
      this.setValue('password', env.password, fb);
      this.setValue('password_confirmation', env.password_confirmation, fb);
      if (env.is_company) {
        this.setValue('company_name', env.company_name, fb);
        this.setValue('company_idnumber', env.company_idnumber, fb);
        this.setValue('company_vat', env.company_vat, fb);
        this.setValue('company_address', env.company_address, fb);
        this.setValue('company_city', env.company_city, fb);
        this.setValue('company_zipcode', env.company_zipcode, fb);
        this.setValue('company_phone', env.company_phone, fb);
      }
      if (env.image) {
        fb.append('image', env.image);
      }
      if (env.cover) {
        fb.append('cover', env.cover);
      }
      if (typeof env.phone === 'string' || env.phone === 'number') {
        const tem = [env.phone];
        // tslint:disable-next-line:forin
        for (const phone in tem) {
          fb.append(`phone[${phone}]`, tem[phone]);
        }
      } else {
        // tslint:disable-next-line:forin
        for (const phone in env.phone) {
          fb.append(`phone[${phone}]`, env.phone[phone]);
        }
      }
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200 || xhr.status === 201) {
            resolve(xhr.response);
          } else {
            reject(xhr.response);
          }
        }
      };
      xhr.open(
        'POST',
        `${this.urlEdit}/${env.id}?_locale=${this.language}`,
        true
      );
      xhr.setRequestHeader(
        'Authorization',
        'Bearer ' + localStorage.getItem('token')
      );
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.send(fb);
    });
  }

  private setValue(field: string, value: any, fb: FormData) {
    if (value !== null && value !== undefined) {
      fb.append(field, value);
    }
  }
}
