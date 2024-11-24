import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AcademicYearsComponent } from './academic-years/academic-years.component';
import { AcademicYearsRoutingModule } from './academic-years-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { SharedComponentsModule } from '../../../sharedComponents/shared-components.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { AddAcademicYearComponent } from './add-academic-year/add-academic-year.component';
import { DividerModule } from 'primeng/divider';


@NgModule( {
  declarations: [ AcademicYearsComponent, AddAcademicYearComponent ],
  imports: [
    CommonModule,
    AcademicYearsRoutingModule,
    TranslateModule,
    SharedComponentsModule,
    FormsModule,
    ReactiveFormsModule,
    DividerModule
  
  ], providers: [
    ConfirmationService
  ]
} )
export class AcademicYearsModule {
}
