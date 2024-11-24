import { Pipe } from '@angular/core';
import { environment } from '../../environments/environment';

type Player = {
  gender?: {
    code: string;
  };
  image?: {
    full_url: string;
  };
};

@Pipe({
  name: 'avatarPipe',
})
export class PlayerAvatarPiple {
  baseUrl = environment.images;
  transform(player: Player | any): any {
    if (!player?.image || !player?.image?.full_url) {
      const genderUrl =
        player?.gender && player.gender?.code === 'female'
          ? this.baseUrl + 'images/player/girl.svg'
          : this.baseUrl + 'images/player/boy.svg';
      return genderUrl;
    }
    return player.image.full_url;
  }
}
