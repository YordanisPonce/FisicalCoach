import { Pipe } from '@angular/core';
import { Player } from '../_models/player';
import { environment } from '../../environments/environment';

@Pipe( {
  name: 'avatarTeacherPipe',
} )
export class TeacherAvatarPipe {
  baseUrl= environment.images;
  transform( { gender, image }: Player | any ): any {
    if ( !image || !image?.full_url ) {
      const genderUrl =
        gender?.code === 'female'
          ? this.baseUrl+'images/teachers/profesora.svg'
          : this.baseUrl+'images/teachers/profesor.svg';
      return genderUrl;
    }
    return image.full_url;
  }
}
