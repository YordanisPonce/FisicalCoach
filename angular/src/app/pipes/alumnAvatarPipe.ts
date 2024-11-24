import { Pipe } from '@angular/core';
import { Player } from '../_models/player';
import { environment } from '../../environments/environment';

@Pipe({
  name: 'alumnAvatarPipe',
})
export class AlumnAvatarPipe {
  baseUrl = environment.images;
  girlAlumnImage: string = this.baseUrl + 'images/alumn/alumna.svg';
  boyAlumnImage: string = this.baseUrl + 'images/alumn/alumno.svg';
  transform({ gender, image }: Player | any): any {
    if (!image || !image?.full_url) {
      const genderUrl =
        gender?.code === 'female' ? this.girlAlumnImage : this.boyAlumnImage;
      return genderUrl;
    }
    return image.full_url;
  }
}
