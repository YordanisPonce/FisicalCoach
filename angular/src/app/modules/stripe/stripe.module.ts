import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StripeRoutingModule } from './stripe-routing.module';
import { StripeComponent } from './stripe.component';
import { StripeModule } from 'stripe-angular';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../register-leveles/register-leveles.module';
import { HttpClient } from '@angular/common/http';
import { TooltipModule } from 'primeng/tooltip';
import { environment } from 'src/environments/environment';

@NgModule({
  declarations: [StripeComponent],
  exports: [StripeComponent],
  imports: [
    CommonModule,
    StripeRoutingModule,
    StripeModule.forRoot(environment.STRIPE_TOKEN),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    TooltipModule,
  ],
})
export class StripeModules {}
