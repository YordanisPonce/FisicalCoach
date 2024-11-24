import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileComponent } from './profile.component';
import { InformationsComponent } from './components/informations/informations.component';
import { SubscriptionsComponent } from './components/subscriptions/subscriptions.component';
import { UpdateSubscripcionComponent } from './components/update-subscripcion/update-subscripcion.component';
import { LicencesComponent } from './components/licences/licences.component';
import { NewSubscriptionProcessComponent } from './components/new-subscription-process/new-subscription-process.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { MyExercisesComponent } from './components/my-exercises/my-exercises.component';
import { InvoicesComponent } from './components/invoices/invoices.component';

const routes: Routes = [
  {
    path: '',
    component: ProfileComponent,
    children: [
      {
        path: 'informations',
        component: InformationsComponent,
      },
      {
        path: 'details',
        component: PerfilComponent,
      },
      {
        path: 'subscriptions',
        component: SubscriptionsComponent,
      },
      {
        path: 'security',
        component: ChangePasswordComponent,
      },
      {
        path: 'licences',
        component: LicencesComponent,
      },
      {
        path: 'update-subscription/:role',
        component: UpdateSubscripcionComponent,
      },
      {
        path: 'new-subscription-process',
        component: NewSubscriptionProcessComponent,
      },
      {
        path: 'my-exercises',
        component: MyExercisesComponent,
      },
      {
        path: 'invoices',
        component: InvoicesComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileRoutingModule {}
