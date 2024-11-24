import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './protected/auth.guard';
import { InicioComponent } from './modules/inicio/inicio.component';
import { SelectPaysComponent } from './modules/register-leveles/component/select-pays/select-pays.component';
import { ResetPasswordComponent } from './modules/reset-password/reset-password.component';
import { RegisterInvitationComponent } from './modules/club/register-invitation/register-invitation.component';
import { VerifyInvitationComponent } from './modules/register-leveles/component/verify-invitation/verify-invitation.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'clubs/invitations/:token',
    component: RegisterInvitationComponent,
  },
  {
    path: 'subscription/licenses/:token',
    component: VerifyInvitationComponent
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'users',
    children: [
      {
        path: 'email',
        children: [
          {
            path: 'verify/:id/:token',
            component: SelectPaysComponent,
          },
        ],
      },
    ],
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent,
  },
  {
    path: 'inicio',
    component: InicioComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'register',
    loadChildren: () =>
      import('./modules/register-leveles/register-leveles.module').then(
        (m) => m.RegisterLevelesModule
      ),
  },
  {
    path: 'academy',
    loadChildren: () =>
      import('./modules/academy/academy-home.module').then(
        (m) => m.AcademyHomeModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'club',
    loadChildren: () =>
      import('./modules/club/club-home.module').then((m) => m.ClubHomeModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'teacher',
    loadChildren: () =>
      import('./modules/teacher/teacher.module').then((m) => m.TeacherModule),
    canActivate: [AuthGuard],
  },

  // SuperAdmin Routes
  {
    path: 'admin',
    loadChildren: () => import('./modules/admin/admin.module').then(m => m.AdminModule),
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
