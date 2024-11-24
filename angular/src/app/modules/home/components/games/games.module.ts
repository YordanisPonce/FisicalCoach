import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GamesComponent } from './games.component';
import { TableModule } from 'primeng/table';
import { SharedComponentsModule } from 'src/app/sharedComponents/shared-components.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [GamesComponent],
  imports: [CommonModule, TableModule, SharedComponentsModule, TranslateModule],
  exports: [GamesComponent],
})
export class GamesModule {}
