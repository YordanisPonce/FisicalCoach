import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResponseInterface } from '../_models/response.interface';
import { PaymentMethod } from '../_models/paymenMethod.interface';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private apiUrl = environment.API_URL;
  private url = environment.API_URL + 'users';
  private urlSubscriptions = environment.API_URL + 'subscriptions';
  private urlPackages = environment.API_URL + 'packages';
  private userSubscriptions = environment.API_URL + 'users/subscriptions';
  private userAuth = environment.API_URL + 'auth';
  private userpayment = environment.API_URL + 'users/payment-method';
  private language = localStorage.getItem('languaje') || 'es';

  constructor(private httpClient: HttpClient) {}

  public getUsersPermissions(): Observable<any> {
    return this.httpClient
      .get(this.url + `/permissions/list`)
      .pipe(map((res) => res as any[]));
  }

  public getUsersPaymentMethod() {
    return this.httpClient
      .get<ResponseInterface<PaymentMethod>>(
        `${this.userpayment}?_locale=${this.language}`
      )
      .pipe(map((res) => res as ResponseInterface<PaymentMethod>));
  }

  public deletepaymentMethod() {
    return this.httpClient
      .delete<any>(`${this.userpayment}?_locale=${this.language}`)
      .pipe(map((res) => res as any));
  }

  public saveUsersPaymentMethod(payment_method_token: string): Observable<any> {
    return this.httpClient
      .post(this.userpayment, { payment_method_token })
      .pipe(map((res) => res as any));
  }

  /**
   * get user licences
   */
  getUserLicences(): Observable<any> {
    return this.httpClient
      .get(this.urlSubscriptions + `/licenses?_locale=${this.language}`)
      .pipe(map((res) => res as any[]));
  }

  /**
   * user invitation with a licence
   */
  sendInvitation(data: { code: string; email: string }): Observable<any> {
    return this.httpClient
      .post(
        this.urlSubscriptions +
          `/licenses/single-invite?_locale=${this.language}`,
        data
      )
      .pipe(map((res) => res as any[]));
  }

  /**
   * revoke invitaton
   */
  revokeInvitation(code: string): Observable<any> {
    return this.httpClient
      .post(
        this.urlSubscriptions +
          `/licenses/${code}/revoke?_locale=${this.language}`,
        {}
      )
      .pipe(map((res) => res as any[]));
  }

  /**
   * user subscription
   */
  getUserSubscriptions(): Observable<any> {
    return this.httpClient
      .get(`${this.userSubscriptions}?_locale=${this.language}`, {})
      .pipe(map((res) => res as any[]));
  }

  /**
   * update subscription
   */
  updateUserSubscription(data: any): Observable<any> {
    return this.httpClient
      .put(`${this.urlSubscriptions}?_locale=${this.language}`, data)
      .pipe(map((res) => res as any[]));
  }

  /**
   * confirm payment
   */
  confirmPaymentMethod(): Observable<any> {
    return this.httpClient
      .post(
        `${this.urlSubscriptions}/confirm-payment?_locale=${this.language}`,
        {}
      )
      .pipe(map((res) => res as any[]));
  }

  /**
   * reset user password
   */
  resetPassword(data: {
    email: string;
    password: string;
    token: string;
    password_confirmation: string;
  }): Observable<any> {
    return this.httpClient
      .post(`${this.userAuth}/reset-password?_locale=${this.language}`, data)
      .pipe(map((res) => res as any[]));
  }

  /**
   * confirm licence invitation
   */
  handleLicenceInvitation(token: string): Observable<any> {
    return this.httpClient
      .get(
        `${this.urlSubscriptions}/licenses/${token}/handle?_locale=${this.language}`
      )
      .pipe(map((res) => res as any[]));
  }

  /***
   * handle add or remove licenses
   */
  handleLicensesCount(data: any): Observable<any> {
    return this.httpClient
      .post(
        `${this.urlSubscriptions}/update-quantity?_locale=${this.language}`,
        data
      )
      .pipe(map((res) => res as any[]));
  }

  /**
   * get package price updated
   */

  getLicensePrice(
    sportCode: string,
    subpackage: string,
    licenses: number,
    period: string
  ): Observable<any> {
    return this.httpClient
      .get(
        `${this.urlPackages}/subpackages/detail?type=${sportCode}&subpackage=${subpackage}&licenses=${licenses}&period=${period}&_locale=${this.language}`
      )
      .pipe(map((res) => res as any[]));
  }

  /***
   * get teams to update plan
   */
  getUserTeams(): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}teams/list/user?_locale=${this.language}`)
      .pipe(map((res) => res as any[]));
  }

  /***
   * get matches to update plan
   */
  getUserMatches(): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}competitions/matches/user?_locale=${this.language}`)
      .pipe(map((res) => res as any[]));
  }

  /***
   * get players to update plan
   */
  getUserPlayers(): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}players/list/user?_locale=${this.language}`)
      .pipe(map((res) => res as any[]));
  }

  /***
   * get sessions to update plan
   */
  getUserSessions(): Observable<any> {
    return this.httpClient
      .get(
        `${this.apiUrl}training/exercise-sessions/all/team/user?_locale=${this.language}`
      )
      .pipe(map((res) => res as any[]));
  }

  /***
   * get tests to update plan
   */
  getUserTests(): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}tests/application/list/user?_locale=${this.language}`)
      .pipe(map((res) => res as any[]));
  }

  /***
   * get injuries prevention to update plan
   */
  getUserInjuryPreventions(): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}injury-prevention/list/user?_locale=${this.language}`)
      .pipe(map((res) => res as any[]));
  }

  /***
   * get rfd tests to update plan
   */
  getUserRfd(): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}injuries/rfd/list/user?_locale=${this.language}`)
      .pipe(map((res) => res as any[]));
  }

  /***
   * get physiotherapy tests to update plan
   */
  getUserPhysiotherapyTests(): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}fisiotherapy/list/user?_locale=${this.language}`)
      .pipe(map((res) => res as any[]));
  }

  /***
   * get nutrition sheets to update plan
   */
  getUserNutritionSheets(): Observable<any> {
    return this.httpClient
      .get(
        `${this.apiUrl}nutrition/nutritional-sheet/list/user?_locale=${this.language}`
      )
      .pipe(map((res) => res as any[]));
  }

  /***
   * get effort recovery reports to update plan
   */
  getUserEfforRecoveryReports(): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}effort-recovery/list/user?_locale=${this.language}`)
      .pipe(map((res) => res as any[]));
  }

  /***
   * get psycology reports to update plan
   */
  getUserPsychologyReports(): Observable<any> {
    return this.httpClient
      .get(
        `${this.apiUrl}psychologies/reports/list/user?_locale=${this.language}`
      )
      .pipe(map((res) => res as any[]));
  }

  /**
   * Teacher ********************************
   */

  /***
   * get tutorships
   */
  getTeacherTutorships(): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}tutorships/list/user?_locale=${this.language}`)
      .pipe(map((res) => res as any[]));
  }

  /***
   * get Rubrics
   */
  getTeacherRubrics(): Observable<any> {
    return this.httpClient
      .get(
        `${this.apiUrl}evaluation/rubrics/list/user?_locale=${this.language}`
      )
      .pipe(map((res) => res as any[]));
  }

  /***
   * get test
   */
  getTeacherTests(): Observable<any> {
    return this.httpClient
      .get(
        `${this.apiUrl}tests/application/classroom/list/user?_locale=${this.language}`
      )
      .pipe(map((res) => res as any[]));
  }

  /***
   * get sessions
   */
  getTeacherSessions(): Observable<any> {
    return this.httpClient
      .get(
        `${this.apiUrl}training/exercise-sessions/all/classroom/user?_locale=${this.language}`
      )
      .pipe(map((res) => res as any[]));
  }

  /**
   * donwgrade plan
   */
  dongradeUserPlan(data: any): Observable<any> {
    return this.httpClient
      .put(`${this.apiUrl}subscriptions?_locale=${this.language}`, data)
      .pipe(map((res) => res as any[]));
  }
}
