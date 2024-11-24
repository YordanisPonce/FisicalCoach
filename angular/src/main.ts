import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}
import { persistState } from '@datorama/akita';
const storage = persistState();
const providers = [ { provide: 'persistStorage', useValue: storage } ];
platformBrowserDynamic(providers).bootstrapModule(AppModule)
  .catch(err => console.error(err));
