import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ScrollPanelModule} from 'primeng/scrollpanel';
import { SkeletonModule } from 'primeng/skeleton';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import {  HttpClientModule, HttpClient } from '@angular/common/http';

import { AdminPlansRoutingModule } from './admin-plans-routing.module';
import { AdminPlansComponent } from './admin-plans.component';

import { SharedComponentsModule } from '../../../../sharedComponents/shared-components.module';
import { AdminSportPackComponent } from './components/admin-sport-pack/admin-sport-pack.component';
import { AdminTeacherPackComponent } from './components/admin-teacher-pack/admin-teacher-pack.component';
import { MatDialogModule } from '@angular/material/dialog';
// import { DialogModule } from 'primeng/dialog';
import { EditPlanModalComponent } from '../../components/edit-plan-modal/edit-plan-modal.component';
import { CreatePlanModalComponent } from './components/create-plan-modal/create-plan-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';  // Asegúrate de importar FormsModule
import { ComponentsModule } from 'src/app/modules/components/components.module';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AdminPlansComponent,
    AdminSportPackComponent,
    AdminTeacherPackComponent,
    EditPlanModalComponent,
    CreatePlanModalComponent
  ],
  imports: [
    CommonModule,
    AdminPlansRoutingModule,
    ScrollPanelModule,
    SkeletonModule,
    SharedComponentsModule,
    MatDialogModule,
    // DialogModule,
    FormsModule,
    ReactiveFormsModule,
    ComponentsModule,
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
export class AdminPlansModule { }
