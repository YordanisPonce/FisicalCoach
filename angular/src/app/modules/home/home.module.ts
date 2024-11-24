import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';

import {ScrollPanelModule} from 'primeng/scrollpanel';
import {CarouselModule} from 'primeng/carousel';
import {ButtonModule} from 'primeng/button';
import {TabViewModule} from 'primeng/tabview';
import { GamesModule } from './components/games/games.module'


// import { ActivityComponent } from '../components/activity/activity.component';
import { ActivityModule } from '../components/activity/activity.module';

@NgModule({
  declarations: [HomeComponent],
  
  imports: [
    CommonModule,
    HomeRoutingModule,
    ScrollPanelModule,
    CarouselModule,
    ButtonModule,
    TabViewModule,
    GamesModule,
    ActivityModule
    // DialogModule
  ],
  exports:[
    // ActivityComponent
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class HomeModule { }
