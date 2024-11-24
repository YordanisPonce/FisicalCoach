import { NgModule } from '@angular/core';
import { Routes, RouterModule, UrlSegment, Route } from '@angular/router';
import { EvaluationComponent } from './components/evaluation/evaluation.component';
import { DailyCheckComponent } from './components/daily-check/daily-check.component';
import { TeacherComponent } from './teacher.component';
import { CalificationComponent } from './components/calification/calification.component';
import { TutorComponent } from './components/tutor/tutor.component';
import { TutorshipDetailsComponent } from './components/tutorship-details/tutorship-details.component';
import { TutorshipsRecordComponent } from './components/tutorships-record/tutorships-record.component';
import { AlumnsComponent } from './components/alumns/alumns.component';
import { GeneralComponent } from './components/alumn-profile/general/general.component';
import { AlumnProfileComponent } from './components/alumn-profile/alumn-profile.component';
import { InformationComponent } from './components/alumn-profile/information/information.component';
import { HealthComponent } from './components/alumn-profile/health/health.component';
import { ClassDetailsComponent } from './components/class-details/class-details.component';
import { RubricsByAlumnComponent } from './components/rubrics-by-alumn/rubrics-by-alumn.component';
import { WorkoutComponent } from '../academy/components/workout/workout.component';
import { TestComponent } from '../club/components/test/test.component';
import { TrainingSessionsComponent } from '../club/components/training-sessions/training-sessions.component';
// import { AlumnDataResolverResolver } from 'src/app/_resolvers/alumn-data-resolver.resolver';

const routes: Routes = [
  {
    path: '',
    component: TeacherComponent,
    children: [
      {
        path: 'home',
        component: ClassDetailsComponent
      },
      {
        path: 'evaluation',
        component: EvaluationComponent
      },
      {
        path: 'evaluation/rubrics-by-alumn/:alumnId',
        component: RubricsByAlumnComponent
      },
      {
        path: 'alumns',
        component: AlumnsComponent,
      },
      {
        path: 'daily-check',
        component: DailyCheckComponent
      },
      {
        path: 'workout',
        component: WorkoutComponent
      },
      {
        path: 'test',
        component: TestComponent
      },
      {
        path: 'training-sessions',
        component: TrainingSessionsComponent
      },
      {
        path: 'calification',
        component: CalificationComponent
      },
      {
        path: 'tutor',
        component: TutorComponent
      },
      {
        path: 'tutor/detalles/:tutorshipId',
        component: TutorshipDetailsComponent
      },
      {
        path: 'tutor/record/:alumnId',
        component: TutorshipsRecordComponent
      },
      {
        path: 'alumns/profile/:alumnId',
        component: AlumnProfileComponent,
        // resolve: {
        //   alumn: AlumnDataResolverResolver
        // },
        // canLoad: [(route: Route, segments: UrlSegment[]) => false],
        children: [
          {
            path: '',
            pathMatch: 'prefix',
            redirectTo: 'general'
          },
          {
            path: 'general',
            component: GeneralComponent,
          },
          {
            path: 'information',
            component: InformationComponent,
            // resolve: {
            //   alumn: AlumnDataResolverResolver
            // },
          },
          {
            path: 'health',
            component: HealthComponent,
          },
          {
            path: 'evaluation',
            component: RubricsByAlumnComponent,
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeacherRoutingModule { }
