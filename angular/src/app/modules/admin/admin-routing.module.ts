import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { AdminPlansModule } from './pages/admin-plans/admin-plans.module';
import { AdminUsersModule } from './pages/admin-users/admin-users.module';
import { AdminUsersComponent } from './pages/admin-users/admin-users.component';

const routes: Routes = [
  { 
    path: '', 
    redirectTo: 'dashboard/admin', 
    pathMatch: 'full' 
  }, 
  // { path: 'login', component: LoginComponent },
  { 
    path: 'dashboard', 
    component: AdminComponent, 
    children: [
      {
        path: 'plans',
        loadChildren: () =>
          import('./pages/admin-plans/admin-plans.module').then(
            (m) => m.AdminPlansModule
          ),
      },
      {
        path: 'users',
        component: AdminUsersComponent  
      },
     
     
    ] 
  }, 
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
