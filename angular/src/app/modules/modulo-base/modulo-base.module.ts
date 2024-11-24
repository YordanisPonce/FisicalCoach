import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModuloBaseRoutingModule } from './modulo-base-routing.module';
import { ModuloBaseComponent } from './modulo-base.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';

import {TranslateLoader, TranslateModule} from '@ngx-translate/core';

import {TranslateHttpLoader} from '@ngx-translate/http-loader'
@NgModule({
  declarations: [ModuloBaseComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,	
    ReactiveFormsModule,		
    ModuloBaseRoutingModule,

    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }})
  ]
})
export class ModuloBaseModule { }


export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
    return new TranslateHttpLoader(http);
}
