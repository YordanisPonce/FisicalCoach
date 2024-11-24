import { NgModule } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { SidebarModule } from 'primeng/sidebar';
import { BadgeModule } from 'primeng/badge';
import { StepsModule } from 'primeng/steps';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { TabViewModule } from 'primeng/tabview';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ChipsModule } from 'primeng/chips';
import { CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';
import { TableModule } from 'primeng/table';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { NavbarComponent } from '../navbar/navbar.component';
import { TabMenuModule } from 'primeng/tabmenu';
import { ChipModule } from 'primeng/chip';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TimelineModule } from 'primeng/timeline';
import { InputSwitchModule } from 'primeng/inputswitch';
import { RatingModule } from 'primeng/rating';
import { SelectButtonModule } from 'primeng/selectbutton';
import { CheckboxModule } from 'primeng/checkbox';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ProgressBarModule } from 'primeng/progressbar';
import { TooltipModule } from 'primeng/tooltip';
import { KnobModule } from 'primeng/knob';
import { DataViewModule } from 'primeng/dataview';
import { InputMaskModule } from 'primeng/inputmask';
import { MultiSelectModule } from 'primeng/multiselect';
import { SkeletonModule } from 'primeng/skeleton';
import { CascadeSelectModule } from 'primeng/cascadeselect';
import { ColorPickerModule } from 'ngx-color-picker';
import { FormsModule } from '@angular/forms';
import { EmailOnlyDirective } from 'src/app/_directivas/email-only.directive';
import { TranslateModule } from '@ngx-translate/core';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { ChartModule } from 'primeng/chart';
import { AccordionModule } from 'primeng/accordion';
import { KeyFilterModule } from 'primeng/keyfilter';
import { GalleriaModule } from 'primeng/galleria';
import { UserPermissionDirective } from '../_directivas/user-permission.directive';
import { PlayerAvatarPiple } from '../pipes/playerAvatarPipe';
import { TeacherAvatarPipe } from '../pipes/teacherAvatarPipe';
import { RivalAvatarPipe } from '../pipes/rivalAvatarPipe';
import { ListboxModule } from 'primeng/listbox';
import { TreeSelectModule } from 'primeng/treeselect';
import { AlumnAvatarPipe } from '../pipes/alumnAvatarPipe';
import { packageNamePipe } from '../pipes/packageNamePipe';

@NgModule({
  declarations: [
    NavbarComponent,
    EmailOnlyDirective,
    UserPermissionDirective,
    PlayerAvatarPiple,
    TeacherAvatarPipe,
    RivalAvatarPipe,
    AlumnAvatarPipe,
    packageNamePipe,
  ],
  imports: [
    FormsModule,
    AvatarModule,
    SidebarModule,
    BadgeModule,
    ScrollPanelModule,
    TabViewModule,
    CarouselModule,
    ButtonModule,
    DialogModule,
    DropdownModule,
    OverlayPanelModule,
    StepsModule,
    CalendarModule,
    InputNumberModule,
    OverlayPanelModule,
    ChipsModule,
    TableModule,
    TabMenuModule,
    InputTextareaModule,
    ChipModule,
    RadioButtonModule,
    InputSwitchModule,
    RatingModule,
    SelectButtonModule,
    CheckboxModule,
    AutoCompleteModule,
    ProgressBarModule,
    TooltipModule,
    KnobModule,
    InputMaskModule,
    DataViewModule,
    MultiSelectModule,
    SkeletonModule,
    CascadeSelectModule,
    ColorPickerModule,
    // EmailOnlyDirective,
    TranslateModule,
    ConfirmDialogModule,
    ChartModule,
    // PasswordModule
    InputTextModule,
    AccordionModule,
    KeyFilterModule,
    GalleriaModule,
    ListboxModule,
    TreeSelectModule,
  ],
  exports: [
    AvatarModule,
    SidebarModule,
    BadgeModule,
    ScrollPanelModule,
    TabViewModule,
    CarouselModule,
    ButtonModule,
    DialogModule,
    DropdownModule,
    OverlayPanelModule,
    StepsModule,
    CalendarModule,
    InputNumberModule,
    OverlayPanelModule,
    ChipsModule,
    TableModule,
    TabMenuModule,
    InputTextareaModule,
    ChipModule,
    RadioButtonModule,
    NavbarComponent,
    TimelineModule,
    InputSwitchModule,
    RatingModule,
    SelectButtonModule,
    CheckboxModule,
    AutoCompleteModule,
    ProgressBarModule,
    TooltipModule,
    KnobModule,
    InputMaskModule,
    DataViewModule,
    MultiSelectModule,
    SkeletonModule,
    CascadeSelectModule,
    ColorPickerModule,
    EmailOnlyDirective,
    ConfirmDialogModule,
    ChartModule,
    InputTextModule,
    AccordionModule,
    KeyFilterModule,
    GalleriaModule,
    UserPermissionDirective,
    PlayerAvatarPiple,
    TeacherAvatarPipe,
    RivalAvatarPipe,
    ListboxModule,
    TreeSelectModule,
    AlumnAvatarPipe,
    packageNamePipe,
  ],
})
export class SharedComponentsModule {}
