import { Pipe } from '@angular/core';
import { resourcesUrl } from '../utils/resources';
import { environment } from 'src/environments/environment';

@Pipe({
  name: 'rivalAvatarPipe',
})
export class RivalAvatarPipe {
  resources = resourcesUrl;
  urlBase = environment.images;
  transform(image_preview: string | undefined): any {
    if (image_preview?.includes('rival-teams')) {
      return `${this.urlBase}${image_preview}`;
    }

    if (!image_preview) {
      return `${this.resources}/images/competition/rival_team.svg`;
    }
    return image_preview;
  }
}
