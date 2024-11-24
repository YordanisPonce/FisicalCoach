import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterLevelesComponent } from './register-leveles.component';
import { SelectPaysComponent } from './component/select-pays/select-pays.component';
import { FormRegisterComponent } from './component/form-register/form-register.component';
import { MembershipPaysComponent } from './component/membership-pays/membership-pays.component';
import { TablePaysComponent } from './component/table-pays/table-pays.component';
import { StripeComponent } from "./component/stripe/stripe.component";
import { VerifyInvitationComponent } from './component/verify-invitation/verify-invitation.component';




const routes: Routes = [
	{
		path: '',
		component: RegisterLevelesComponent,
		children: [
			{ path: '', redirectTo: 'form', pathMatch: 'full' },
			{
				path: 'register-pays/:id',
				component: SelectPaysComponent,
			},
			{
				path: 'form',
				component: FormRegisterComponent
			},
			{
				path: 'subscription/licenses/:token',
				component: VerifyInvitationComponent
			},
			{
				path: 'stripe',
				component: StripeComponent
			},
			{
				path: 'confirm',
				component: FormRegisterComponent,
				data: { title: 'token' }
			},

			{
				path: 'pays-metos',
				component: MembershipPaysComponent
			},
			{
				path: 'tables-pays',
				component: TablePaysComponent
			},

		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class RegisterLevelesRoutingModule { }
