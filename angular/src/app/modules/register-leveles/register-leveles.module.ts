import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegisterLevelesRoutingModule } from './register-leveles-routing.module';
import { RegisterLevelesComponent } from './register-leveles.component';
import { SelectPaysComponent } from './component/select-pays/select-pays.component';
import { FormRegisterComponent } from './component/form-register/form-register.component';
import { MembershipPaysComponent } from './component/membership-pays/membership-pays.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {ScrollPanelModule} from 'primeng/scrollpanel';
import { TablePaysComponent } from './component/table-pays/table-pays.component';
import { StripeModule } from "stripe-angular"
import { StripeComponent } from './component/stripe/stripe.component';
import {InputTextModule} from 'primeng/inputtext';
import {CarouselModule} from 'primeng/carousel';
import {SelectButtonModule} from 'primeng/selectbutton';
import {DropdownModule} from "primeng/dropdown";
import {DialogModule} from "primeng/dialog";
import { VerifyInvitationComponent } from './component/verify-invitation/verify-invitation.component';

@NgModule({
	declarations: [RegisterLevelesComponent, StripeComponent,
    SelectPaysComponent, FormRegisterComponent, MembershipPaysComponent, TablePaysComponent, VerifyInvitationComponent],
  imports: [
    InputTextModule,
    ScrollPanelModule,
    CarouselModule,
    SelectButtonModule,
    SweetAlert2Module.forRoot(),
    CommonModule,
    StripeModule.forRoot("pk_test_51ISlHGK6ttgcW7bgO4tZlypfjhfVOpmMtgDoKYPz5CAYKlMdWtNBcaFa9ZyGTl6Q9pexZwsMdVOQmZPK8ok5DpFs00PGjUM6eo"),
    RegisterLevelesRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    DropdownModule,
    DialogModule,
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }})
  ],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RegisterLevelesModule { }

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
    return new TranslateHttpLoader(http);
}
