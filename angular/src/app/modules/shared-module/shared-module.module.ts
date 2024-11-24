import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedComponentsModule } from 'src/app/sharedComponents/shared-components.module';
import { AngularCropperjsModule } from 'angular-cropperjs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../register-leveles/register-leveles.module';
import { HttpClient } from '@angular/common/http';
import { DividerModule } from 'primeng/divider';
import { ExerciseCardComponent } from '../profile/components/exercise-card/exercise-card.component';
import { CreateWorkoutDialogComponent } from '../academy/components/create-workout-dialog/create-workout-dialog.component';
import { NewWorkoutDialogComponent } from '../academy/components/new-workout-dialog/new-workout-dialog.component';
import { SaveChangesDialogComponent } from '../academy/components/save-changes-dialog/save-changes-dialog.component';
import { SaveWorkoutDialogComponent } from '../academy/components/save-workout-dialog/save-workout-dialog.component';

@NgModule({
  declarations: [
    ExerciseCardComponent,
    CreateWorkoutDialogComponent,
    NewWorkoutDialogComponent,
    SaveChangesDialogComponent,
    SaveWorkoutDialogComponent,
  ],
  imports: [
    CommonModule,
    SharedComponentsModule,
    AngularCropperjsModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    DividerModule,
  ],
  exports: [
    ExerciseCardComponent,
    CreateWorkoutDialogComponent,
    NewWorkoutDialogComponent,
    SaveChangesDialogComponent,
    SaveWorkoutDialogComponent,
  ],
})
export class SharedModule {}
