import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { InicioComponent } from './inicio.component';
import { CarouselComponent } from './carousel/carousel.component';
import { PartidosRecientesComponent } from './partidosRecientes/partidos-recientes.component';
import { SharedComponentsModule } from '../../sharedComponents/shared-components.module';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GamesModule } from '../home/components/games/games.module';
import { ComponentsModule } from '../components/components.module';
import { AddClubComponent } from '../academy/crear/add-club.component';
import { LicenceDialogComponent } from './licence-dialog/licence-dialog.component';
import { LastEvaluationsComponent } from './last-evaluations/last-evaluations.component';

@NgModule({
  declarations: [
    InicioComponent,
    CarouselComponent,
    PartidosRecientesComponent,
    AddClubComponent,
    LicenceDialogComponent,
    LastEvaluationsComponent,
  ],
  imports: [
    TranslateModule,
    SharedComponentsModule,
    FormsModule,
    ReactiveFormsModule,
    GamesModule,
    ComponentsModule,
  ],
  exports: [
    InicioComponent,
    CarouselComponent,
    PartidosRecientesComponent,
    AddClubComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class InicioModule {}
