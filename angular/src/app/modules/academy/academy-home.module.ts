import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AcademyRoutingModule } from './academy-routing.module';
import { StepsModule } from 'primeng/steps';
import { MenuAcademyComponent } from './menu-academy/menu-academy.component';
import { SharedComponentsModule } from '../../sharedComponents/shared-components.module';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MembersComponent } from './members/members.component';
import { ClubHomeModule } from '../club/club-home.module';
import { AcademyHomeComponent } from './academy-home.component';
import { AcademyComponent } from './inicio/academy.component';
import { ComponentsModule } from '../components/components.module';
import { MembersInvitationsComponent } from './members-invitations/members-invitations.component';
import { InvitarMiembrosDialogComponent } from './members-invitations/invitar-miembros-dialog/invitar-miembros-dialog.component';
import { TeacherModule } from '../teacher/teacher.module';
import { TeachersComponent } from './teachers/teachers.component';
import { NewTeacherComponent } from './teachers/new-teacher/new-teacher.component';
import { InicioModule } from '../inicio/inicio.module';

@NgModule({
  declarations: [
    MenuAcademyComponent,
    AcademyHomeComponent,
    // NewMemberComponent,
    MembersComponent,
    AcademyComponent,
    MembersInvitationsComponent,
    InvitarMiembrosDialogComponent,
    TeachersComponent,
    NewTeacherComponent,
  ],
  exports: [
    MenuAcademyComponent,
    AcademyHomeComponent,
    // NewMemberComponent,
    MembersComponent,
    AcademyComponent,
    InvitarMiembrosDialogComponent,
    TeachersComponent,
  ],
  imports: [
    TranslateModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    AcademyRoutingModule,
    StepsModule,
    SharedComponentsModule,
    ClubHomeModule,
    TeacherModule,
    ComponentsModule,
    InicioModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AcademyHomeModule {}
