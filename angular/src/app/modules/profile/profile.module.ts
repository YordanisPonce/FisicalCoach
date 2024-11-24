import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import { AngularCropperjsModule } from 'angular-cropperjs';
import { EditPortadaComponent } from './components/edit-portada/edit-portada.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { InformationsComponent } from './components/informations/informations.component';
import { SubscriptionsComponent } from './components/subscriptions/subscriptions.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { EditAvatarComponent } from './components/edit-avatar/edit-avatar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { UpdateSubscripcionComponent } from './components/update-subscripcion/update-subscripcion.component';
import { ImagesPipe } from 'src/app/pipes/images.pipe';
import { LicencesComponent } from './components/licences/licences.component';
import { SharedComponentsModule } from 'src/app/sharedComponents/shared-components.module';
import { NewSubscriptionProcessComponent } from './components/new-subscription-process/new-subscription-process.component';
import { StripeModules } from '../stripe/stripe.module';
import { KeyFilterModule } from 'primeng/keyfilter';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { SubpackegeDetailComponent } from './components/subpackege-detail/subpackege-detail.component';
import { DividerModule } from 'primeng/divider';
import { ConfirmUpdateSubscriptionComponent } from './components/confirm-update-subscription/confirm-update-subscription.component';
import { CheckoutPackageComponent } from './components/checkout-package/checkout-package.component';
import { MyExercisesComponent } from './components/my-exercises/my-exercises.component';
import { SharedModule } from '../shared-module/shared-module.module';
import { AssingTeamDialogComponent } from './components/assing-team-dialog/assing-team-dialog.component';
import { InvoicesComponent } from './components/invoices/invoices.component';
import { StripeModule } from 'stripe-angular';
import { StripeComponent } from '../stripe/stripe.component';
import { DowngradePlanDialogComponent } from './components/downgrade-plan-dialog/downgrade-plan-dialog.component';
import { PlayerAvatarPiple } from 'src/app/pipes/playerAvatarPipe';
import { DowngradePlanTeacherDialogComponent } from './components/downgrade-plan-teacher-dialog/downgrade-plan-teacher-dialog.component';

@NgModule({
  declarations: [
    ProfileComponent,
    ImagesPipe,
    EditPortadaComponent,
    PerfilComponent,
    InformationsComponent,
    SubscriptionsComponent,
    EditProfileComponent,
    EditAvatarComponent,
    UpdateSubscripcionComponent,
    LicencesComponent,
    NewSubscriptionProcessComponent,
    ChangePasswordComponent,
    SubpackegeDetailComponent,
    ConfirmUpdateSubscriptionComponent,
    CheckoutPackageComponent,
    MyExercisesComponent,
    AssingTeamDialogComponent,
    InvoicesComponent,
    DowngradePlanDialogComponent,
    DowngradePlanTeacherDialogComponent,
  ],
  imports: [
    SharedComponentsModule,
    SharedModule,
    AngularCropperjsModule,
    CommonModule,
    ProfileRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    StripeModules,
    StripeModule,
    DividerModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ProfileModule {}

// comentario del merge
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}
