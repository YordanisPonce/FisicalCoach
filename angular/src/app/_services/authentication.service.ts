import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  public usuarioLogueado: any;
  private jwtHelper: JwtHelperService = new JwtHelperService();

  constructor(private http: HttpClient) {

  }

  isLogin() {
    const token = localStorage.getItem('token');
    if (!token)
    {
      return false;
    } else
    {
      const isExpired = !this.jwtHelper.isTokenExpired(token);
      if (!isExpired)
      {
        localStorage.removeItem('token');
      }
      return !this.jwtHelper.isTokenExpired(token);
    }
  }

  getToken() {
    return localStorage.getItem('token');
  }
}
