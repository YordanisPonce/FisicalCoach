import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminPlansComponent } from './admin-plans.component';
import { AdminSportPackComponent } from './components/admin-sport-pack/admin-sport-pack.component';
import { AdminTeacherPackComponent } from './components/admin-teacher-pack/admin-teacher-pack.component';


const routes: Routes = [
  { 
    path: '', 
    component: AdminPlansComponent,
    children: [
      { 
        path: 'sport', 
        component: AdminSportPackComponent
      },
      { 
        path: 'teacher', 
        component: AdminTeacherPackComponent
      },
    ]    
  },  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminPlansRoutingModule { }
