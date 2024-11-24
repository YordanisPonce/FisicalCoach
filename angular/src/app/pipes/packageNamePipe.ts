import { Pipe } from '@angular/core';

@Pipe({
  name: 'packageNamePipe',
})
export class packageNamePipe {
  transform(code: string | undefined): string {
    let package_code: string = '';
    const role = localStorage.getItem('role');
    const language = localStorage.getItem('languaje');

    if (role === 'sport') {
      if (language === 'es') {
        if (code === 'sport_bronze') package_code = 'Deporte Bronce';
        if (code === 'sport_silver') package_code = 'Deporte Plata';
        if (code === 'sport_gold') package_code = 'Deporte Oro';
      }

      if (language === 'en') {
        if (code === 'sport_bronze') package_code = 'Sport Bronze';
        if (code === 'sport_silver') package_code = 'Sport Silver';
        if (code === 'sport_gold') package_code = 'Sport Gold';
      }
    }

    if (role === 'teacher') {
      if (language === 'es') {
        if (code === 'teacher_bronze') package_code = 'P.E Profesor Bronce';
        if (code === 'teacher_silver') package_code = 'P.E Profesor Plata';
        if (code === 'teacher_gold') package_code = 'P.E Profesor Pro';
      }
      if (language === 'en') {
        if (code === 'teacher_bronze') package_code = 'P.E Teacher Bronze';
        if (code === 'teacher_silver') package_code = 'P.E Teacher Silver';
        if (code === 'teacher_gold') package_code = 'P.E Teacher Gold';
      }
    }

    return package_code;
  }
}
