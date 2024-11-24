import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { AppSettings } from '../../proyect.conf';
import { Observable } from 'rxjs';
import { Ejercicio } from '../_models/ejercicio';

@Injectable({
  providedIn: 'root',
})
export class ExerciseService {
  private urlExercises = AppSettings.serviceUrl + 'exercises';
  private urlClassroomExercises = AppSettings.serviceUrl + 'classroom';
  private urlTraining = AppSettings.serviceUrl + 'training';
  private urlServicios = AppSettings.serviceUrl + 'teams/exercises';
  private locale = localStorage.getItem('languaje');
  private role = localStorage.getItem('role');

  constructor(private httpClient: HttpClient) {}

  getUserExercises(): Observable<any> {
    return this.httpClient
      .get(`${AppSettings.serviceUrl}users/exercises`)
      .pipe(map((res) => res as any[]));
  }

  getAll(): Observable<any> {
    return this.httpClient
      .get(this.urlServicios)
      .pipe(map((res) => res as any[]));
  }

  downloadPDF(code: string): Observable<Blob> {
    return this.httpClient.get(
      `${this.urlExercises}/${code}/pdf?_locale=${this.locale}`,
      { responseType: 'blob' }
    );
  }

  getByCode(code: string, teamId: number | null): Observable<any> {
    if (teamId) {
      if (this.role === 'sport') {
        return this.httpClient
          .get(
            `${this.urlServicios}/${code}?team_id=${teamId}&_locale=${this.locale}`
          )
          .pipe(map((res) => res as any[]));
      }

      return this.httpClient
        .get(
          `${this.urlClassroomExercises}/${teamId}/exercises/${code}?_locale=${this.locale}`
        )
        .pipe(map((res) => res as any[]));
    }

    return this.httpClient
      .get(`${this.urlServicios}/${code}?_locale=${this.locale}`)
      .pipe(map((res) => res as any[]));
  }

  getAllByTeam(roleId: any): Observable<any> {
    if (this.role === 'sport') {
      return this.httpClient
        .get(`${this.urlServicios}/teams/${roleId}?_locale=${this.locale}`)
        .pipe(map((res) => res as Ejercicio[]));
    }

    return this.httpClient
      .get(`${AppSettings.serviceUrl}${'classroom'}/${roleId}/exercises`)
      .pipe(map((res) => res as Ejercicio[]));
  }

  create(exercise: Ejercicio) {
    return this.httpClient
      .post<any>(this.urlServicios, exercise)
      .pipe(map((res) => res as any));
  }

  createExercise(exercise: Ejercicio, roleId: number) {
    if (this.role === 'sport') {
      return this.httpClient
        .post<any>(`${this.urlServicios}/teams/${roleId}`, exercise)
        .pipe(map((res) => res as any));
    }

    return this.httpClient
      .post<any>(
        `${AppSettings.serviceUrl}${'classroom'}/${roleId}/exercises`,
        exercise
      )
      .pipe(map((res) => res as any));
  }

  update(exercise: any) {
    return this.httpClient
      .put<any>(`${this.urlServicios}/${exercise.code}`, exercise)
      .pipe(map((res) => res as any));
  }

  updateSessionExercise(exercise: any) {
    return this.httpClient
      .put<any>(
        `${this.urlTraining}/exercises/exercise-sessions/${exercise.code}`,
        exercise
      )
      .pipe(map((res) => res as any));
  }

  delete(exercise: any) {
    return this.httpClient
      .delete<any>(`${this.urlServicios}/${exercise.code}`)
      .pipe(map((res) => res as any));
  }

  getListDistribuciones(): Observable<any> {
    return this.httpClient
      .get(`${this.urlExercises}/distributions?_locale=${this.locale}`)
      .pipe(map((res) => res as any[]));
  }

  getListContenidos(sportCode: string): Observable<any> {
    return this.httpClient
      .get(`${this.urlExercises}/contents/${sportCode}?_locale=${this.locale}`)
      .pipe(map((res) => res as any[]));
  }

  /**
   * store exercises to session
   */
  storeExerciseSession(
    exercises: Partial<Ejercicio>[],
    exercise_session_id: number
  ) {
    return this.httpClient
      .post<any>(`${this.urlTraining}/exercises/exercise-sessions`, {
        exercise_session_id,
        exercises,
      })
      .pipe(map((res) => res as any));
  }

  /**
   * store exercises to session
   */
  storeClassroomExerciseSession(
    exercises: Partial<Ejercicio>[],
    exercise_session_id: number
  ) {
    return this.httpClient
      .post<any>(`${this.urlTraining}/exercises/exercise-sessions`, {
        exercise_session_id,
        exercises,
      })
      .pipe(map((res) => res as any));
  }

  /**
   * get session details
   */
  getSession(sessionCode: string, teamId: number, role: string) {
    if (role === 'sport') {
      return this.httpClient
        .get<any>(
          `${this.urlTraining}/exercise-sessions/${teamId}/show/${sessionCode}?_locale=${this.locale}`
        )
        .pipe(map((res) => res as any));
    }

    return this.httpClient
      .get<any>(
        `${this.urlClassroomExercises}/${teamId}/exercise-sessions/${sessionCode}?_locale=${this.locale}`
      )
      .pipe(map((res) => res as any));
  }

  /**
   * get assistances
   */
  getSessionAssistances(sessionCode: string) {
    return this.httpClient
      .get<any>(
        `${this.urlTraining}/assistance/exercise-sessions/${sessionCode}`
      )
      .pipe(map((res) => res as any));
  }

  /**
   * show session exercise
   */
  getSessionExercise(sessionCode: string) {
    return this.httpClient
      .get<any>(
        `${this.urlTraining}/exercises/exercise-sessions/${sessionCode}?_locale=${this.locale}`
      )
      .pipe(map((res) => res as any));
  }

  /**
   * content blocks
   * @returns content blocks
   */
  getContentBlocks() {
    return this.httpClient
      .get<any>(`${this.urlExercises}/content-blocks?_locale=${this.locale}`)
      .pipe(map((res) => res as any));
  }

  /**
   * education levels
   * @returns education levels
   */
  getEducationLevels() {
    return this.httpClient
      .get<any>(`${this.urlExercises}/education-levels`)
      .pipe(map((res) => res as any));
  }

  updateClassroomExercise(exercise: any, classroomId: number) {
    return this.httpClient
      .put<any>(
        `${this.urlClassroomExercises}/${classroomId}/exercises/${exercise.code}`,
        exercise
      )
      .pipe(map((res) => res as any));
  }

  /**
   * get materials
   * @returns materials
   */
  getSessionMaterials(teamId: number, sessionCode: string) {
    return this.httpClient
      .get<any>(
        `${this.urlTraining}/exercise-sessions/${teamId}/materials/${sessionCode}/list`
      )
      .pipe(map((res) => res as any));
  }

  /**
   * groups
   * @returns groups
   */
  getWorkoutGroups(sessionId: number) {
    return this.httpClient
      .get<any>(
        `${this.urlTraining}/work-groups/exercise-session/${sessionId}?_locale=${this.locale}`
      )
      .pipe(map((res) => res as any));
  }

  /**
   * create group
   * @returns group
   */
  createWorkoutGroups(data: any) {
    return this.httpClient
      .post<any>(`${this.urlTraining}/work-groups`, data)
      .pipe(map((res) => res as any));
  }

  /**
   * update group
   * @returns group
   */
  updateWorkoutGroups(data: any, groupCode: string) {
    return this.httpClient
      .put<any>(`${this.urlTraining}/work-groups/${groupCode}`, data)
      .pipe(map((res) => res as any));
  }

  /**
   * get teams for exercise
   * @returns group
   */
  getTeamsExercise(exerciseId: number) {
    return this.httpClient
      .get<any>(`${this.urlExercises}/${exerciseId}/teams/list`)
      .pipe(map((res) => res as any));
  }

  /**
   * assing teams to exercise
   * @returns group
   */
  assingTeams(data: any, exerciseId: number) {
    return this.httpClient
      .post<any>(`${this.urlExercises}/${exerciseId}/teams/assign`, {
        teams: data,
      })
      .pipe(map((res) => res as any));
  }

  /**
   * get classrooms for exercise
   * @returns group
   */
  getClassroomsExercise(exerciseId: number) {
    return this.httpClient
      .get<any>(`${this.urlExercises}/${exerciseId}/classrooms/list`)
      .pipe(map((res) => res as any));
  }

  /**
   * assing classrooms to exercise
   * @returns group
   */
  assingClassrooms(data: any, exerciseId: number) {
    return this.httpClient
      .post<any>(`${this.urlExercises}/${exerciseId}/classrooms/assign`, {
        classrooms: data,
      })
      .pipe(map((res) => res as any));
  }

  /**
   * download pdf
   */
  downloadExercisePdf(exerciseCode: string): any {
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/pdf');

    return this.httpClient.get(
      `${this.urlExercises}/${exerciseCode}/pdf?_locale=${this.locale}`,
      {
        headers,
        responseType: 'arraybuffer' || 'blob' || 'json' || 'text',
      }
    );
  }

  /**
   * download pdf
   */
  setLike(exerciseId: number, like: boolean): Observable<any> {
    return this.httpClient
      .post<any>(`${this.urlExercises}/${exerciseId}/user/like`, {
        like,
      })
      .pipe(map((res) => res as any));
  }

  /**
   * get not assinged players
   */
  getWorkGroupPlayers(exerciseId: number, role: string): Observable<any> {
    if (role === 'sport') {
      return this.httpClient
        .get<any>(
          `${this.urlTraining}/work-groups/exercise-session/${exerciseId}/players-work-groups`
        )
        .pipe(map((res) => res as any));
    }
    return this.httpClient
      .get<any>(
        `${this.urlTraining}/work-groups/exercise-session/${exerciseId}/alumns-work-groups`
      )
      .pipe(map((res) => res as any));
  }

  /**
   * get not assinged players
   */
  getWorkGroupPlayersNotAssigned(
    exerciseId: number,
    role: string
  ): Observable<any> {
    if (role === 'sport') {
      return this.httpClient
        .get<any>(
          `${this.urlTraining}/work-groups/exercise-session/${exerciseId}/players `
        )
        .pipe(map((res) => res as any));
    }

    return this.httpClient
      .get<any>(
        `${this.urlTraining}/work-groups/exercise-session/${exerciseId}/alumns `
      )
      .pipe(map((res) => res as any));
  }

  /**
   * create thumbnail
   * @param data
   * @returns thumbnail created
   */
  createExerciseThumbnail(data: any, exerciseId: string) {
    const token = localStorage.getItem('token');

    return new Promise((resolve, reject) => {
      const formData: FormData = new FormData();
      const xhr = new XMLHttpRequest();

      console.log('data', data);

      formData.append('thumbnail', data.image);

      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status === 200 || xhr.status === 201) {
            resolve(xhr.response);
          } else {
            reject(xhr.response);
          }
        }
      };
      xhr.open('POST', `${this.urlServicios}/thumbnail-3d/${exerciseId}`, true);

      xhr.setRequestHeader('Authorization', 'Bearer ' + token);
      xhr.send(formData);
    });
  }
}
