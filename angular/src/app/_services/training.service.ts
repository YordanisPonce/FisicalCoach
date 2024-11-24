import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { AppSettings } from '../../proyect.conf';
import { Observable } from 'rxjs';
import { TrainingExerciseSession } from '../_models/training';
import { Ejercicio } from '../_models/ejercicio';

@Injectable({
  providedIn: 'root',
})
export class TrainingSessionService {
  private urlServicios = AppSettings.serviceUrl + 'training';
  private clasroomUrlService = AppSettings.serviceUrl + 'classroom';
  private languaje = localStorage.getItem('languaje');

  constructor(private httpClient: HttpClient) {}

  /**
   * get all training sessions
   * @returns training sessions
   */
  getTrainingSessionList(team_id: number): Observable<any> {
    return this.httpClient
      .get(
        `${this.urlServicios}/exercise-sessions/${team_id}?_locale=${this.languaje}`
      )
      .pipe(map((res) => res as any[]));
  }

  /**
   * get all classroom training sessions
   * @returns training sessions
   */
  getClassroomTrainingSessionList(classroomId: number): Observable<any> {
    return this.httpClient
      .get(
        `${this.clasroomUrlService}/${classroomId}/exercise-sessions?_locale=${this.languaje}`
      )
      .pipe(map((res) => res as any[]));
  }

  downloadSessionPDF(code: string): Observable<Blob> {
    return this.httpClient.get(
      `${this.urlServicios}/exercise-sessions/${code}/pdf?_locale=${this.languaje}`,
      { responseType: 'blob' }
    );
  }

  /**
   * get all List of type exercise sessions
   * @returns List of type exercise sessions
   */
  getTypeExerciseSession(): Observable<any> {
    return this.httpClient
      .get(
        `${this.urlServicios}/type-exercise-session?_locale=${this.languaje}`
      )
      .pipe(map((res) => res as any[]));
  }

  /**
   * get all List of training periods
   * @returns List of training periods
   */
  getTypeOfTrainingPeriod(): Observable<any> {
    return this.httpClient
      .get(`${this.urlServicios}/training-periods?_locale=${this.languaje}`)
      .pipe(map((res) => res as any[]));
  }

  /**
   * get all List Target session
   * @returns List Target session
   */
  getListTargetSession(): Observable<any> {
    return this.httpClient
      .get(this.urlServicios + '/targets')
      .pipe(map((res) => res as any[]));
  }

  /**
   * get all content exercises
   * @returns content exercises
   */
  getContentExercises(): Observable<any> {
    return this.httpClient
      .get(AppSettings.serviceUrl + 'teams' + '/contents-exercise')
      .pipe(map((res) => res as any[]));
  }

  /**
   * get target by content
   * @returns target by content
   */
  getTargetByContent(
    content: string,
    sport: string = 'football'
  ): Observable<any> {
    return this.httpClient
      .get(this.urlServicios + '/targets/content/' + content + '/' + sport)
      .pipe(map((res) => res as any[]));
  }

  /**
   * get subContent by content
   * @returns subContent by content
   */
  getSubContentByContent(content: string): Observable<any> {
    return this.httpClient
      .get(this.urlServicios + '/sub-content-session/' + content + '/content')
      .pipe(map((res) => res as any[]));
  }

  /**
   * get target by sub content
   * @returns target by sub content
   */
  getTargetBySubContent(
    subContent: string,
    sport: string = 'football'
  ): Observable<any> {
    return this.httpClient
      .get(
        this.urlServicios + '/targets/sub-content/' + subContent + '/' + sport
      )
      .pipe(map((res) => res as any[]));
  }

  /**
   * create exercise session
   * @returns exercise session created
   */
  createExerciseSession(
    data: TrainingExerciseSession,
    teamId: number
  ): Observable<any> {
    return this.httpClient
      .post(
        `${this.urlServicios}/exercise-sessions/${teamId}?_locale=${this.languaje}`,
        data
      )
      .pipe(map((res) => res as any[]));
  }

  /**
   * edit exercise session
   * @returns exercise session updated
   */
  updateExerciseSession(
    data: TrainingExerciseSession,
    teamId: number,
    role = 'sport'
  ): Observable<any> {
    if (role === 'sport') {
      return this.httpClient
        .put(
          `${this.urlServicios}/exercise-sessions/${teamId}/update/${data.code}?_locale=${this.languaje}`,
          data
        )
        .pipe(map((res) => res as any[]));
    }

    return this.httpClient
      .put(
        `${this.clasroomUrlService}/${teamId}/exercise-sessions/${data.code}?_locale=${this.languaje}`,
        data
      )
      .pipe(map((res) => res as any[]));
  }

  /**
   * delete exercise session
   * @returns exercise session deleted
   */
  deleteExerciseSession(
    teamId: number,
    code: string,
    role: string
  ): Observable<any> {
    if (role === 'sport') {
      return this.httpClient
        .delete(
          `${this.urlServicios}/exercise-sessions/${teamId}/delete/${code}?_locale=${this.languaje}`
        )
        .pipe(map((res) => res as any[]));
    }

    return this.httpClient
      .delete(
        `${this.clasroomUrlService}/${teamId}/exercise-sessions/${code}?_locale=${this.languaje}`
      )
      .pipe(map((res) => res as any[]));
  }

  /**
   * create exercise session
   * @returns exercise session created
   */
  createClassroomExerciseSession(
    data: TrainingExerciseSession,
    classroomId: number
  ): Observable<any> {
    return this.httpClient
      .post(
        `${this.clasroomUrlService}/${classroomId}/exercise-sessions?_locale=${this.languaje}`,
        data
      )
      .pipe(map((res) => res as any[]));
  }

  /**
   * get subjetive perception effort list
   * @returns subjetive perception effort list
   */
  getSubjetivePerceptionEffor(): Observable<any> {
    return this.httpClient
      .get(
        `${this.urlServicios}/subjective-perception-effort?_locale=${this.languaje}`
      )
      .pipe(map((res) => res as any[]));
  }

  /**
   * get players assistance
   * @returns exercise assistance
   */
  getPlayersAssistance(
    exercise_session_detail_code: string,
    role: string,
    academycYearId?: number | null
  ): Observable<any> {
    if (role === 'sport') {
      return this.httpClient
        .get(
          `${this.urlServicios}/assistance/exercise-sessions/${exercise_session_detail_code}?_locale=${this.languaje}`
        )
        .pipe(map((res) => res as any[]));
    }

    return this.httpClient
      .get(
        `${this.urlServicios}/assistance/exercise-sessions/${exercise_session_detail_code}/${academycYearId}?_locale=${this.languaje}`
      )
      .pipe(map((res) => res as any[]));
  }

  /**
   * create players assistance
   * @returns exercise assistance
   */
  createPlayersAssistance(data: {
    assistances: {
      assistance: boolean;
      player_id?: number;
      alumn_id?: number;
    }[];
    exercise_session_id: number;
  }): Observable<any> {
    return this.httpClient
      .post(
        `${this.urlServicios}/assistance/exercise-sessions?_locale=${this.languaje}`,
        data
      )
      .pipe(map((res) => res as any[]));
  }

  /**
   * fc test
   * @returns fc test
   */
  createHearFrecuencyTest(data: any, testType: string): Observable<any> {
    return this.httpClient
      .post(
        `${this.urlServicios}/exercise-sessions/tests/sessions?_locale=${this.languaje}`,
        data
      )
      .pipe(map((res) => res as any[]));
  }

  /**
   * set sesion like
   */
  setLike(sessionId: number, like: boolean): Observable<any> {
    return this.httpClient
      .post<any>(
        `${this.urlServicios}/exercise-sessions/${sessionId}/user/like`,
        {
          like,
        }
      )
      .pipe(map((res) => res as any));
  }

  /**
   * set sesion like
   */
  deleteSessionExercise(code: string): Observable<any> {
    return this.httpClient
      .delete<any>(
        `${this.urlServicios}/exercises/exercise-sessions/${code}?_locale=${this.languaje}`
      )
      .pipe(map((res) => res as any));
  }

  /**
   * get available exercises on session
   * @param teamId
   * @returns
   */

  getAvailableExercises(
    sessioncode: string,
    teamId: number,
    role: string
  ): Observable<any> {
    if (role === 'sport') {
      return this.httpClient
        .get(
          `${this.urlServicios}/exercise-sessions/${sessioncode}/team/${teamId}/list-exercises?_locale=${this.languaje}`
        )
        .pipe(map((res) => res as Ejercicio[]));
    }

    return this.httpClient
      .get(
        `${this.urlServicios}/exercise-sessions/${sessioncode}/classroom/${teamId}/list-exercises?_locale=${this.languaje}`
      )
      .pipe(map((res) => res as Ejercicio[]));
  }

  /**
   * update exercises order
   */
  updateOrderExercise(
    sessionId: number,
    data: { id: number; order: number }[]
  ): Observable<any> {
    return this.httpClient
      .put<any>(
        `${this.urlServicios}/exercises/exercise-sessions/${sessionId}/exercises/order?_locale=${this.languaje}`,
        { exercises: data }
      )
      .pipe(map((res) => res as any));
  }

  /**
   * get places
   * @returns places
   */
  getSessionPlaces(id: number): Observable<any> {
    return this.httpClient
      .get(
        `${this.urlServicios}/exercise-sessions/${id}/places?_locale=${this.languaje}`
      )
      .pipe(map((res) => res as any[]));
  }

  /**
   * get test info
   * @returns test
   */
  getSessionTestData(
    id: number,
    testType: string,
    playerId: number
  ): Observable<any> {
    return this.httpClient
      .get(
        `${this.urlServicios}/exercise-sessions/${id}/tests/${testType}/sessions/players/${playerId}?_locale=${this.languaje}`
      )
      .pipe(map((res) => res as any[]));
  }
}
