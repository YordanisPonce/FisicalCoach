import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { environment} from '../../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ServicesService {
  public urlCountries: string = environment.API_URL+'/api/country/list?_locale=';
  public urlGender: string = environment.API_URL+'/api/user/gender/list?_locale=';
  public urlRegister: string = environment.API_URL+'/api/user/register';
  public urlPackges: string =  environment.API_URL+'/api/packege/list?_locale=';
  public language: any = "";
  public urlvirificated: string = environment.API_URL+"/api/user/register/confirm";
  constructor(public http: HttpClient ) {
	

  }
  getCountries(){
	const headers = new HttpHeaders().set('Content-Type', 'application/json');
	this.language = localStorage.getItem('languaje')		 
	return this.http.get(this.urlCountries+this.language, {headers: headers});
  }
  getGender(){
 	const headers = new HttpHeaders().set('Content-Type', 'application/json');
	this.language = localStorage.getItem('languaje')		 
	return this.http.get(this.urlGender+this.language, {headers: headers})
  }
  getPackeges(){
	const headers = new HttpHeaders().set('Content-Type', 'application/json');
	this.language = localStorage.getItem('languaje')	
	return this.http.get(this.urlPackges+this.language, {headers: headers})	 
  }
  sendData(env: any){
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
	return this.http.post(this.urlRegister,env, {headers: headers})
  }

  verificated(env: any){
	return this.http.put(this.urlvirificated, env)
	}
}
