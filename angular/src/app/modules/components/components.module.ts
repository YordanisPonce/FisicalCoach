import { ActivityComponent } from './activity/activity.component';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SkeletonModule } from 'primeng/skeleton';

import { StepsComponent } from '../club/components/steps/steps.component';
import { StepsMembersComponent } from '../academy/members/new-member/steps-members/steps-members.component';
import { DatosPersonalesComponent } from '../academy/members/new-member/steps-members/datos-personales/datos-personales.component';
import { SharedComponentsModule } from '../../sharedComponents/shared-components.module';
import { DatosContactoComponent } from '../academy/members/new-member/steps-members/datos-contacto/datos-contacto.component';
import { DatosLaboralesComponent } from '../academy/members/new-member/steps-members/datos-laborales/datos-laborales.component';
import { InfoAdiccionalComponent } from '../academy/members/new-member/steps-members/info-adiccional/info-adiccional.component';

import { NewMemberComponent } from '../academy/members/new-member/new-member.component';

import { CreatePlayerDialogComponent } from '../club/components/create-player-dialog/create-player-dialog.component';

import { NewPlayerComponent } from '../club/components/new-player/new-player.component';
import { PlayerPersonalDataComponent } from '../club/components/players/player-personal-data/player-personal-data.component';
import { AlumnAcademicDataComponent } from '../teacher/components/alumn-academic-data/alumn-academic-data.component';
import { PlayerSportingDataComponent } from '../club/components/players/player-sporting-data/player-sporting-data.component';
import { AnalyzePlayerDialogComponent } from '../club/components/analyze-player-dialog/analyze-player-dialog.component';
import { AlumnSportingDataComponent } from '../teacher/components/alumn-sporting-data/alumn-sporting-data.component';
import { PlayerContactDataComponent } from '../club/components/players/player-contact-data/player-contact-data.component';
import { PlayerFamilyDataComponent } from '../club/components/players/player-family-data/player-family-data.component';
import { NewAgentComponent } from '../club/components/new-agent/new-agent.component';
import { PlayerHealthInformationDataComponent } from '../club/components/players/players-health/player-health-information-data/player-health-information-data.component';
import { PlayerHealthInjuriesHistoryDataComponent } from '../club/components/players/players-health/player-health-injuries-history-data/player-health-injuries-history-data.component';
import { NewInjuriesComponent } from '../club/components/injuries/new-injuries/new-injuries.component';
import { MomentAndCauseComponent } from '../club/components/injuries/new-injuries/components/moment-and-cause/moment-and-cause.component';
import { InjuryPrognosisComponent } from '../club/components/injuries/new-injuries/components/injury-prognosis/injury-prognosis.component';
import { SurgeryComponent } from '../club/components/injuries/new-injuries/components/surgery/surgery.component';
import { ComplementaryClinicalTestComponent } from '../club/components/injuries/new-injuries/components/complementary-clinical-test/complementary-clinical-test.component';
import { InjuryProfileComponent } from '../club/components/injuries/new-injuries/components/injury-profile/injury-profile.component';
import { PlayerHealthTotalInjuriesComponent } from '../club/components/players/players-health/player-health-total-injuries/player-health-total-injuries.component';
import { PlayerHealthInjuriesDetailsComponent } from '../club/components/players/players-health/player-health-injuries-details/player-health-injuries-details.component';
import { RiskCalculatorComponent } from '../club/components/risk-calculator/risk-calculator.component';
import { InjuryBodyComponent } from './injury-body/injury-body.component';
import { DividerModule } from 'primeng/divider';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ImageCropperComponent } from './image-cropper/image-cropper.component';
import { AngularCropperjsModule } from 'angular-cropperjs';
import { OrderButtonComponent } from './order-button/order-button.component';

@NgModule({
  declarations: [
    ActivityComponent,
    StepsComponent,
    StepsMembersComponent,
    DatosPersonalesComponent,
    DatosContactoComponent,
    DatosLaboralesComponent,
    InfoAdiccionalComponent,
    NewMemberComponent,
    CreatePlayerDialogComponent,
    NewPlayerComponent,
    PlayerPersonalDataComponent,
    AlumnAcademicDataComponent,
    PlayerSportingDataComponent,
    AnalyzePlayerDialogComponent,
    AlumnSportingDataComponent,
    PlayerContactDataComponent,
    PlayerFamilyDataComponent,
    NewAgentComponent,
    PlayerHealthInformationDataComponent,
    PlayerHealthInjuriesHistoryDataComponent,
    NewInjuriesComponent,
    MomentAndCauseComponent,
    InjuryPrognosisComponent,
    SurgeryComponent,
    ComplementaryClinicalTestComponent,
    InjuryProfileComponent,
    PlayerHealthTotalInjuriesComponent,
    PlayerHealthInjuriesDetailsComponent,
    RiskCalculatorComponent,
    InjuryBodyComponent,
    ImageCropperComponent,
    OrderButtonComponent,
  ],
  imports: [
    TranslateModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedComponentsModule,
    SkeletonModule,
    DividerModule,
    InfiniteScrollModule,
    AngularCropperjsModule
  ],
  exports: [
    ActivityComponent,
    StepsComponent,
    StepsMembersComponent,
    DatosPersonalesComponent,
    DatosContactoComponent,
    DatosLaboralesComponent,
    InfoAdiccionalComponent,
    NewMemberComponent,
    CreatePlayerDialogComponent,
    NewPlayerComponent,
    PlayerPersonalDataComponent,
    AlumnAcademicDataComponent,
    PlayerSportingDataComponent,
    AnalyzePlayerDialogComponent,
    AlumnSportingDataComponent,
    PlayerContactDataComponent,
    PlayerFamilyDataComponent,
    NewAgentComponent,
    PlayerHealthInformationDataComponent,
    PlayerHealthInjuriesHistoryDataComponent,
    NewInjuriesComponent,
    MomentAndCauseComponent,
    InjuryPrognosisComponent,
    SurgeryComponent,
    ComplementaryClinicalTestComponent,
    InjuryProfileComponent,
    PlayerHealthTotalInjuriesComponent,
    PlayerHealthInjuriesDetailsComponent,
    RiskCalculatorComponent,
    InjuryBodyComponent,
    ImageCropperComponent,
    OrderButtonComponent
  ],
  providers: [
    // PlayerPersonalDataComponent,
    // NewPlayerComponent,
    // PlayerContactDataComponent,
    PlayerSportingDataComponent,
    // PlayerFamilyDataComponent,
    // NewAgentComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ComponentsModule {}
