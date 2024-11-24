import { Pipe, PipeTransform } from '@angular/core';

@Pipe( {
  name: 'images'
} )
export class ImagesPipe implements PipeTransform {
  defaultImage: string = 'assets/img/logo_panel.svg';

  constructor() {
  }

  transform( url: string ): any {
    if ( url ) {
      return url;
    } else {
      return this.defaultImage;
    }
  }

}
