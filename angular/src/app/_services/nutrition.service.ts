import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { AppSettings } from '../../proyect.conf';
import { Observable } from 'rxjs';
import { Nutrition, Weight } from '../_models/nutrition';


@Injectable({
  providedIn: 'root'
})
export class NutritionService {
  private urlServicios = AppSettings.serviceUrl + 'nutrition';
  private language = localStorage.getItem('languaje');

  constructor(private httpClient: HttpClient) {
  }

  /**
   * 
   * @returns player nutritions
   */
  getNutritionList(id: number): Observable<any> {
    return this.httpClient.get(`${this.urlServicios}/team/${id}?_locale=${this.language}`).pipe(map(res => res as any[]));
  }

  /**
  * 
  * @returns supplements
  */
  getSupplements(): Observable<any> {
    return this.httpClient.get(`${this.urlServicios}/supplements?_locale=${this.language}`).pipe(map(res => res as any[]));
  }

  /**
* 
* @returns diets
*/
  getDiets(): Observable<any> {
    return this.httpClient.get(`${this.urlServicios}/diets?_locale=${this.language}`).pipe(map(res => res as any[]));
  }

  /**
* 
* @returns nutritional sheet by id
*/
  getNutritionalSheetById(id: number): Observable<any> {
    return this.httpClient.get(this.urlServicios + '/nutritional-sheet/' + `${id}?_locale=${this.language}`).pipe(map(res => res as any[]));
  }

  /**
* 
* @returns nutritional sheet by id
*/
  getPlayerNutritionalSheetsById(playerId: number): Observable<any> {
    return this.httpClient.get(this.urlServicios + '/nutritional-sheet/players/' + `${playerId}?_locale=${this.language}`).pipe(map(res => res as any[]));
  }

  /**
   * 
   * @param data Nutrition Sheet
   * @returns created Nutrition sheet
   */
  createNutritionSheet(data: Nutrition): Observable<any> {
    return this.httpClient.post(this.urlServicios + `/nutritional-sheet?_locale=${this.language}`, data).pipe(map(res => res as any[]));
  }

  /**
   * 
   * @param data Activity player
   * @returns get activity factor
   */
  getActivityFactorById(data: any): Observable<any> {
    return this.httpClient.post(`${this.urlServicios}/athlete-activity-factor?_locale=${this.language}`, data).pipe(map(res => res));
  }


  /**
  * 
  * @param data Weight control data
  * @returns created weight control data
  */
  createWeightControl(data: Weight): Observable<any> {
    return this.httpClient.post(this.urlServicios + `/weight-control?_locale=${this.language}`, data).pipe(map(res => res as any[]));
  }

  /**
   * download pdf nutrition reports
   */
  downloadReports(playerId: number): any {
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/pdf');

    return this.httpClient.get(`${this.urlServicios}/nutritional-sheet/${playerId}/pdfs?_locale=${this.language}`, {
      headers, responseType: 'arraybuffer' || 'blob' || 'json' || 'text'
    })

  }

  /**
   * download pdf nutrition report by id
   */
  downloadReportById(id: number): any {
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/pdf');

    return this.httpClient.get(`${this.urlServicios}/nutritional-sheet/${id}/pdf?_locale=${this.language}`, {
      headers, responseType: 'arraybuffer' || 'blob' || 'json' || 'text'
    })

  }
}
