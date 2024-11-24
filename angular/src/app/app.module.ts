import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {
  HttpClient,
  HttpClientModule,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from './core/services/auth.service';
import { AuthButtonComponent } from './login/components/auth-button/auth-button.component';
import {
  SocialLoginModule,
  SocialAuthServiceConfig,
  GoogleLoginProvider,
} from '@abacritt/angularx-social-login';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { RequestsInterceptor } from './_interceptor/requests.interceptor';
import { AppMenuComponent } from './menu/app-menu.component';
import { SidebarNotificacionesComponent } from './sidebarNotificaciones/sidebar-notificaciones.component';
import { GamesModule } from './modules/home/components/games/games.module';
import { SharedComponentsModule } from './sharedComponents/shared-components.module';
import { InicioModule } from './modules/inicio/inicio.module';
import { AkitaNgDevtools } from '@datorama/akita-ngdevtools';
import { ClubHomeModule } from './modules/club/club-home.module';
import { AcademyHomeModule } from './modules/academy/academy-home.module';
import { RecoverPasswordDialogComponent } from './login/components/recover-password-dialog/recover-password-dialog.component';
import { StripeModule } from 'stripe-angular';
import { TeacherModule } from './modules/teacher/teacher.module';
import { ResetPasswordComponent } from './modules/reset-password/reset-password.component';
import { ActiveUserDialogComponent } from './login/components/active-user-dialog/active-user-dialog.component';
// import { SuperadminComponent } from './modules/superadmin/superadmin.component'; 

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AuthButtonComponent,
    AppMenuComponent,
    SidebarNotificacionesComponent,
    RecoverPasswordDialogComponent,
    ActiveUserDialogComponent,
    ResetPasswordComponent,
    ActiveUserDialogComponent,
    // SuperadminComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SocialLoginModule,
    FontAwesomeModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    AkitaNgDevtools.forRoot(),
    StripeModule.forRoot(
      'pk_test_51ISlHGK6ttgcW7bgO4tZlypfjhfVOpmMtgDoKYPz5CAYKlMdWtNBcaFa9ZyGTl6Q9pexZwsMdVOQmZPK8ok5DpFs00PGjUM6eo'
    ),
    GamesModule,
    AcademyHomeModule,
    SharedComponentsModule,
    InicioModule,
    ClubHomeModule,
    TeacherModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequestsInterceptor,
      multi: true,
    },
    AuthService,
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '1011554830890-djple5daq7put9bf6735flrd895fg57n.apps.googleusercontent.com'
            ),
          },
        ],
      } as SocialAuthServiceConfig,
    },
  ],
  exports: [TranslateModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
