import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MembersComponent } from './members/members.component';
import { AcademyHomeComponent } from './academy-home.component';
import { AcademyComponent } from './inicio/academy.component';
import { MembersInvitationsComponent } from './members-invitations/members-invitations.component';
import { TeachersComponent } from './teachers/teachers.component';

const routes: Routes = [
  {
    path: '',
    component: AcademyHomeComponent,
    children: [
      {
        path: 'home/:idClub',
        component: AcademyComponent,
      },
      {
        path: 'members/invitations',
        component: MembersInvitationsComponent,
      },
      {
        path: 'members/:idClub',
        component: MembersComponent,
      },
      {
        path: 'academic-years/:idClub',
        loadChildren: () => import('../academy/academic-years/academic-years.module').then( m => m.AcademicYearsModule )
      },
      {
        path: 'teachers/:idClub',
        component: TeachersComponent,
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'Base',
        loadChildren: () => import('../modulo-base/modulo-base.module').then( m => m.ModuloBaseModule )
      },
      {
        path: 'profile',
        loadChildren: () => import('../profile/profile.module').then( m => m.ProfileModule )
      },
    ]
  },
];

@NgModule( {
  imports: [ RouterModule.forChild( routes ) ],
  exports: [ RouterModule ]
} )
export class AcademyRoutingModule {
}
