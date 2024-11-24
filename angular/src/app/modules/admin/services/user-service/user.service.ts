import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../../../../_models/user';

// Aquí creamos la interfaz de la respuesta, que contiene la propiedad "users" como un arreglo de User
export interface SearchUserResponse {
  users: User[];  // La propiedad 'users' es un arreglo de objetos de tipo User
}


@Injectable({
  providedIn: 'root'
})
export class UserService {
  public language: any = localStorage.getItem('languaje') || 'es';

  constructor(private http: HttpClient) { }

  grantPermissions(userIds: number[], permissions: string[]): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    });
  
    const body = {
      userIds, // Aquí enviamos un array de userIds
      permissions
    };
  
    const url = `http://localhost:8083/api/v1/users/permissions/assignPermissions`;
  
    return this.http.post(url + `?_locale=${this.language}`, body, { headers });
  }
  searchUsers(query: string): Observable<SearchUserResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    });
  
    const url = `http://localhost:8083/api/v1/users/search`; 
  
    return this.http.get<SearchUserResponse>(`${url}?query=${query}`, { headers }); 
  }
 
  
  getUsers(): Observable<any> {
    return this.http.get<any>(`http://localhost:8083/api/v1/users/list`); // Se devuelve un Observable de tipo any, ya que esperamos que la respuesta sea de tipo JSON.
  }
}
