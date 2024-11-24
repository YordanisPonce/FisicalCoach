import { NgModule, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import {ScrollPanelModule} from 'primeng/scrollpanel';
import { SkeletonModule } from 'primeng/skeleton';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
// import { LoginComponent } from './pages/auth/login/login.component';
import { AdminSidebarComponent } from './components/admin-sidebar/admin-sidebar.component';
import { AdminSecondarySidebarComponent } from './components/admin-secondary-sidebar/admin-secondary-sidebar.component';
import { SharedComponentsModule } from '../../sharedComponents/shared-components.module';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import {  HttpClientModule, HttpClient } from '@angular/common/http';
import { AdminUsersComponent } from './pages/admin-users/admin-users.component';


export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AdminComponent,
    // LoginComponent,
    AdminSidebarComponent,
    AdminSecondarySidebarComponent,
    
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    ReactiveFormsModule,
    ScrollPanelModule,
    SkeletonModule,
    SharedComponentsModule,

    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),

  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  exports: [TranslateModule],
})
export class AdminModule { }
