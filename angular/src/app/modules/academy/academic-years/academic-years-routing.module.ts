import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AcademicYearsComponent } from './academic-years/academic-years.component';

const routes: Routes = [
  {
    path: '',
    component: AcademicYearsComponent,
  },
];

@NgModule( {
  imports: [ RouterModule.forChild( routes ) ],
  exports: [ RouterModule ]
} )
export class AcademicYearsRoutingModule {
}
