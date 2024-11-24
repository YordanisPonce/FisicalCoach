import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppSettings } from 'src/proyect.conf';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class SchoolService {
  private urlService = AppSettings.serviceUrl + 'school-center';
  private classUrlService = AppSettings.serviceUrl + 'classroom';
  private schoolCenterType = AppSettings.serviceUrl + 'school-center-types';
  private alumnUrlService = AppSettings.serviceUrl + 'alumns';
  private locale: any;

  constructor(private httpClient: HttpClient) {
    this.locale = localStorage.getItem('languaje');
  }

  /********** school module ************/

  /**
   * get school list
   * @returns schools
   */
  getSchools(): Observable<any> {
    return this.httpClient
      .get(`${this.urlService}?_locale=${this.locale}`)
      .pipe(map((res) => res as any));
  }

  schoolCenterData(school: any, file: File): FormData {
    const stringItems = [
      'email',
      'name',
      'webpage',
      'street',
      'city',
      'postal_code',
      'webpage',
      'country_id',
      'province_id',
    ];
    const formData: FormData = new FormData();
    Object.entries(school).forEach((item: any) => {
      if (stringItems.includes(item[0])) {
        if (item[1] != null) {
          formData.append(item[0], item[1]);
        }
      } else {
        if (['phone', 'mobile_phone'].includes(item[0])) {
          if (item[1] != null) {
            formData.append(item[0], JSON.stringify(item[1]));
          }
        } else if (item[0] !== 'image') {
          formData.append(item[0], JSON.stringify(item[1]));
        }
      }
    });
    if (file) {
      formData.append('image', file);
    }
    return formData;
  }

  /**
   * create a school center
   * @returns school center
   */
  createSchoolCenter(school: any, file: File): any {
    const token = localStorage.getItem('token');
    const xhr = new XMLHttpRequest();
    return new Promise((resolve, reject) => {
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200 || xhr.status === 201) {
            resolve(xhr.response);
          } else {
            reject(xhr.response);
          }
        }
      };
      xhr.open('POST', `${this.urlService}?_locale=${this.locale}`, true);
      xhr.setRequestHeader('Authorization', 'Bearer ' + token);
      xhr.send(this.schoolCenterData(school, file));
    });
  }

  /**
   * edit a school center
   * @returns school center
   */
  editSchoolCenter(school: any, file: File): any {
    const token = localStorage.getItem('token');
    const xhr = new XMLHttpRequest();
    return new Promise((resolve, reject) => {
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
        `${this.urlService}/${school.id}?_locale=${this.locale}`,
        true
      );
      xhr.setRequestHeader('Authorization', 'Bearer ' + token);
      xhr.send(this.schoolCenterData(school, file));
    });
  }

  /**
   * getSchoolCenter type list
   * @returns school center types
   */
  getSchoolCenterType(): Observable<any> {
    return this.httpClient
      .get(`${this.schoolCenterType}?_locale=${this.locale}`)
      .pipe(map((res) => res as any));
  }

  /**
   * show school center
   * @returns school center
   */
  showSchoolCenter(schoolId: number): Observable<any> {
    return this.httpClient
      .get(`${this.urlService}/${schoolId}?_locale=${this.locale}`)
      .pipe(map((res) => res as any));
  }

  /**
   * edit school center
   * @returns school center
   */
  public update(school: any, file: File) {
    const token = localStorage.getItem('token');
    return new Promise((resolve, reject) => {
      const formData: FormData = new FormData();
      const stringItems = [
        'email',
        'name',
        'webpage',
        'street',
        'city',
        'postal_code',
        'webpage',
        'id',
      ];
      const xhr = new XMLHttpRequest();
      Object.entries(school).forEach((item: any) => {
        if (stringItems.includes(item[0])) {
          formData.append(item[0], item[1]);
        } else {
          formData.append(item[0], JSON.stringify(item[1]));
        }
      });
      if (file) {
        formData.append('image', file);
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
        this.urlService + '/' + school.id + `?_locale=${this.locale}`,
        true
      );
      xhr.setRequestHeader('Authorization', 'Bearer ' + token);
      xhr.send(formData);
    });
  }

  /**
   * delete school
   */
  deleteSchool(schoolId: number) {
    return this.httpClient
      .delete(this.urlService + '/' + schoolId + `?_locale=${this.locale}`)
      .pipe(map((res) => res as any));
  }

  /********** classroom module *******************/

  /**
   * get classroom ages
   */
  getClassroomAges(): Observable<any> {
    return this.httpClient
      .get(`${this.classUrlService}/ages?_locale=${this.locale}`)
      .pipe(map((res) => res as any));
  }

  /**
   * show classroom ages
   */
  showClassroomAge(ageId: number): Observable<any> {
    return this.httpClient
      .get(`${this.classUrlService}/ages/${ageId}?_locale=${this.locale}`)
      .pipe(map((res) => res as any));
  }

  /**
   *
   * @param schoolId
   * @param data
   * @param classroomId
   */
  createClassroom(schoolId: number, data: any, classroomId?: string) {
    return new Promise((resolve, reject) => {
      const formData: any = new FormData();
      const xhr = new XMLHttpRequest();
      for (const property in data) {
        this.setValue(property, data[property], formData);
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
        `${this.classUrlService}/${schoolId}/classrooms?_locale=${this.locale}`,
        true
      );
      xhr.setRequestHeader(
        'Authorization',
        'Bearer ' + localStorage.getItem('token')
      );
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.send(formData);
    });
  }

  /**
   *
   * @param schoolId
   * @param classroomId
   * @param data
   */
  updateClassroom(schoolId: number, classroomId: number, data: any) {
    return new Promise((resolve, reject) => {
      const formData: any = new FormData();
      const xhr = new XMLHttpRequest();
      for (const property in data) {
        formData.append(property, data[property]);
      }
      formData.append('_method', 'PUT');
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
        'PUT',
        `${this.classUrlService}/${schoolId}/classrooms/${classroomId}?_locale=${this.locale}`,
        true
      );
      xhr.setRequestHeader(
        'Authorization',
        'Bearer ' + localStorage.getItem('token')
      );
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.send(formData);
    });
  }

  /**
   * delete teacher
   */
  deleteClassroom(schoolId: number, classroomId: number): Observable<any> {
    return this.httpClient
      .delete(`${this.classUrlService}/${schoolId}/classrooms/${classroomId}`)
      .pipe(map((res) => res as any));
  }

  /**
   * get teacher list
   */
  getTeacherList(schoolId: number): Observable<any> {
    return this.httpClient
      .get(
        `${this.classUrlService}/${schoolId}/teachers?_locale=${this.locale}`
      )
      .pipe(map((res) => res as any));
  }

  // get assigned class teachers
  getClassroomTeachers(schoolId: string, classroomId: string): Observable<any> {
    return this.httpClient
      .get(
        `${this.urlService}/${schoolId}/classroom/${classroomId}/teachers-subjects?_locale=${this.locale}`
      )
      .pipe(map((res) => res as any));
  }

  // assign a teacher to classroom
  assignClassTeacher(schoolId: string, classroomId: string, data: any) {
    return this.httpClient
      .post(
        `${this.urlService}/${schoolId}/classroom/${classroomId}/teachers-subjects?_locale=${this.locale}`,
        data
      )
      .pipe(map((res) => res as any));
  }

  deallocateTeacherClass(schoolId: string, classroomId: string, data: any) {
    return this.httpClient
      .post(
        `${this.urlService}/${schoolId}/classroom/${classroomId}/remove/teachers-subjects?_locale=${this.locale}`,
        data
      )
      .pipe(map((res) => res as any));
  }

  /**
   * show teacher
   */
  showTeacherByClassroom(schoolId: number, teacherId: number): Observable<any> {
    return this.httpClient
      .get(
        `${this.classUrlService}/${schoolId}/teachers/${teacherId}?_locale=${this.locale}`
      )
      .pipe(map((res) => res as any));
  }

  /**
   * add and update teacher
   */

  teacherFormData(teacher: any, advancedTeacher?: boolean): FormData {
    const formData: FormData = new FormData();
    const date = moment(teacher.birth_date).format('YYYY-MM-DD');
    const keys = Object.keys(teacher);
    formData.append('name', teacher.name);
    formData.append('email', teacher.email);
    formData.append(
      'responsibility',
      teacher.responsibility != null ? teacher.responsibility : ''
    );
    formData.append('gender_id', teacher.gender_id);
    if (teacher.image) {
      formData.append('image', teacher.image);
    }
    formData.append('teacher_area_id', teacher.teacher_area_id);
    if (advancedTeacher) {
      formData.append('birth_date', date);
      keys.forEach((item) => {
        if (
          ![
            'name',
            'email',
            'responsibility',
            'gender_id',
            'work_experiences',
            'birth_date',
            'image',
          ].includes(item)
        ) {
          if (teacher[item] !== null) {
            if (['mobile_phone'].includes(item)) {
              formData.append(item, JSON.stringify(teacher[item]));
            } else {
              formData.append(item, teacher[item]);
            }
          } else {
            formData.append(item, '');
          }
        }
      });
      if (teacher.work_experiences && teacher.work_experiences.length > 0) {
        formData.append(
          'work_experiences',
          JSON.stringify(teacher.work_experiences)
        );
      }
    }

    return formData;
  }

  addTeacher(teacher: any, schoolId: any, advancedMember?: boolean) {
    const token = localStorage.getItem('token');
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200 || xhr.status === 201) {
            resolve(xhr.response);
          } else {
            reject(xhr.response);
          }
        }
      };
      xhr.open('POST', `${this.classUrlService}/${schoolId}/teachers?_locale=${this.locale}`, true);
      xhr.setRequestHeader('Authorization', 'Bearer ' + token);
      xhr.send(this.teacherFormData(teacher, advancedMember));
    });
  }

  updateTeacher(teacher: any, schoolId: number, teacherId: number) {
    console.log(teacher);
    const token = localStorage.getItem('token');
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
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
        'PUT',
        `${this.classUrlService}/${schoolId}/teachers/${teacherId}?_locale=${this.locale}`,
        true
      );
      xhr.setRequestHeader('Authorization', 'Bearer ' + token);
      const formData: FormData = this.teacherFormData(teacher, true);
      formData.append('_method', 'PUT');
      xhr.send(formData);
    });
  }

  /**
   * delete teacher
   */
  deleteTeacherByClassroom(
    schoolId: number,
    teacherId: number
  ): Observable<any> {
    return this.httpClient
      .delete(
        `${this.classUrlService}/${schoolId}/teachers/${teacherId}?_locale=${this.locale}`
      )
      .pipe(map((res) => res as any));
  }

  /**
   * get subject list
   */
  getSubjectList(schoolId: number): Observable<any> {
    return this.httpClient
      .get(`${this.classUrlService}/subjects?_locale=${this.locale}`)
      .pipe(map((res) => res as any));
  }

  /**
   * get class list
   * @returns classes
   */
  getClasses(
    schoolId: number,
    isProfilePage: boolean = false
  ): Observable<any> {
    if (isProfilePage) {
      return this.httpClient
        .get(`${this.classUrlService}/classrooms?_locale=${this.locale}`)
        .pipe(map((res) => res as any));
    }
    return this.httpClient
      .get(
        `${this.classUrlService}/${schoolId}/classrooms?_locale=${this.locale}`
      )
      .pipe(map((res) => res as any));
  }

  /**
   * get class list
   * @returns classes
   */
  getClassesByUser(userId: number): Observable<any> {
    return this.httpClient
      .get(
        `${this.classUrlService}/classrooms-by-user/${userId}?_locale=${this.locale}`
      )
      .pipe(map((res) => res as any));
  }

  /**
   * show class
   * @returns class
   */
  getCLass(schoolId: number, classId: number): Observable<any> {
    return this.httpClient
      .get(
        `${this.classUrlService}/${schoolId}/classrooms/${classId}?_locale=${this.locale}`
      )
      .pipe(map((res) => res as any));
  }

  /**
   * get alumn list
   * @returns alumns
   */
  getAlumnsByClass(classId: number): Observable<any> {
    return this.httpClient
      .get(`${this.alumnUrlService}/${classId}?_locale=${this.locale}`)
      .pipe(map((res) => res as any));
  }

  getListTeacherAreas(schoolId: string): Observable<any> {
    return this.httpClient
      .get(
        this.classUrlService +
          `/${schoolId}/teacher-areas?_locale=${this.locale}`
      )
      .pipe(map((res) => res as any));
  }

  getAcademicYearBySchoolCenter(id: any) {
    return this.httpClient
      .get(this.urlService + `/${id}/academic-years?_locale=${this.locale}`)
      .pipe(map((res) => res as any));
  }

  saveAcademicYears(academicYears: any, id: any) {
    return this.httpClient
      .post(this.urlService + `/${id}/academic-years?_locale=${this.locale}`, {
        academic_years: [academicYears],
      })
      .pipe(map((res) => res as any));
  }
  updateAcademicYears(academicYears: any, id: any) {
    return this.httpClient
      .put(
        this.urlService +
          `/${id}/academic-years/${academicYears.id}?_locale=${this.locale}`,
        { academic_years: [academicYears] }
      )
      .pipe(map((res) => res as any));
  }

  private setValue(field: string, value: any, fb: FormData) {
    if (value !== null && value !== undefined) {
      fb.append(field, value);
    }
  }
}
