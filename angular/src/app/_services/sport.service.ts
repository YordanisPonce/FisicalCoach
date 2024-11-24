import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { AppSettings } from '../../proyect.conf';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SportService {
  private urlServicios = AppSettings.serviceUrl;
  private classroomSubpackageUrl = `${AppSettings.serviceUrl}subpackages`;
  locale = localStorage.getItem('languaje');

  constructor(private httpClient: HttpClient) {}

  getSportList(scouting: string = 'false'): Observable<any> {
    return this.httpClient
      .get(
        this.urlServicios + `sports?scouting=${scouting}&_locale=${this.locale}`
      )
      .pipe(map((res) => res as any[]));
  }

  /**
   * get classroom sports
   */
  getSportBySubpackage(subPackageId: number): Observable<any> {
    return this.httpClient
      .get<any>(
        `${this.classroomSubpackageUrl}/${subPackageId}/sports?_locale=${this.locale}`
      )
      .pipe(map((res) => res as any));
  }
}
