import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TeacherRoutingModule } from './teacher-routing.module';
import { EvaluationComponent } from './components/evaluation/evaluation.component';
import { SharedComponentsModule } from 'src/app/sharedComponents/shared-components.module';
import { TeacherComponent } from './teacher.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { DailyCheckComponent } from './components/daily-check/daily-check.component';
import { NewRubricDialogComponent } from './components/new-rubric-dialog/new-rubric-dialog.component';
import { NewIndicatorDialogComponent } from './components/new-indicator-dialog/new-indicator-dialog.component';
import { RubricsListDialogComponent } from './components/rubrics-list-dialog/rubrics-list-dialog.component';
import { ExportRubricDialogComponent } from './components/export-rubric-dialog/export-rubric-dialog.component';
import { CalificationComponent } from './components/calification/calification.component';
import { NewCalificationDialogComponent } from './components/new-calification-dialog/new-calification-dialog.component';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TutorComponent } from './components/tutor/tutor.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddSchoolCenterComponent } from './components/add-school-center/add-school-center.component';
import { SidebarMenuComponent } from './components/sidebar-menu/sidebar-menu.component';
import { AlumnsComponent } from './components/alumns/alumns.component';
import { AlumnProfileComponent } from './components/alumn-profile/alumn-profile.component';
import { GeneralComponent } from './components/alumn-profile/general/general.component';
import { HealthComponent } from './components/alumn-profile/health/health.component';
import { InformationComponent } from './components/alumn-profile/information/information.component';
import { EvaluationsComponent } from './components/alumn-profile/evaluations/evaluations.component';
import { AddClassroomComponent } from './components/add-classroom/add-classroom.component';
import { ClassDetailsComponent } from './components/class-details/class-details.component';
import { TutorshipDetailsComponent } from './components/tutorship-details/tutorship-details.component';
import { TutorshipsRecordComponent } from './components/tutorships-record/tutorships-record.component';
import { EvaluationDialogComponent } from './components/evaluation-dialog/evaluation-dialog.component';
import { RubricsByAlumnComponent } from './components/rubrics-by-alumn/rubrics-by-alumn.component';
import { RecentEvaluationsComponent } from './components/recent-evaluations/recent-evaluations.component';
import { TeachersClassComponent } from './components/teachers-class/teachers-class.component';
import { NewTutorshipDialogComponent } from './components/new-tutorship-dialog/new-tutorship-dialog.component';
import { ComponentsModule } from '../components/components.module';
import { NewAlumnComponent } from './components/new-alumn/new-alumn.component';
import { QualificationDetailsDialogComponent } from './components/qualification-details-dialog/qualification-details-dialog.component';
// import { AlumnAcademicDataComponent } from './components/alumn-academic-data/alumn-academic-data.component';
import { AssingTeacherComponent } from './components/assing-teacher/assing-teacher.component';
import { ClubHomeModule } from '../club/club-home.module';

@NgModule({
  declarations: [
    TeacherComponent,
    EvaluationComponent,
    DailyCheckComponent,
    NewRubricDialogComponent,
    NewIndicatorDialogComponent,
    RubricsListDialogComponent,
    ExportRubricDialogComponent,
    CalificationComponent,
    NewCalificationDialogComponent,
    TutorComponent,
    AddSchoolCenterComponent,
    SidebarMenuComponent,
    AlumnsComponent,
    AlumnProfileComponent,
    GeneralComponent,
    HealthComponent,
    InformationComponent,
    EvaluationsComponent,
    AddClassroomComponent,
    ClassDetailsComponent,
    TutorshipDetailsComponent,
    TutorshipsRecordComponent,
    EvaluationDialogComponent,
    RubricsByAlumnComponent,
    RecentEvaluationsComponent,
    TeachersClassComponent,
    NewTutorshipDialogComponent,
    NewAlumnComponent,
    QualificationDetailsDialogComponent,
    AssingTeacherComponent
    // AlumnAcademicDataComponent,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    TeacherRoutingModule,
    SharedComponentsModule,
    ComponentsModule,
    ClubHomeModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [ HttpClient ]
      }
    } ),
    ClubHomeModule
  ],
  exports: [
    AddSchoolCenterComponent,
    AddClassroomComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TeacherModule { }
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}
