import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedComponentsModule } from '../../sharedComponents/shared-components.module';
import { ClubHomeRoutingModule } from './club-home-routing.module';
import { ClubHomeComponent } from './club-home.component';
import { ClubComponent } from './inicio/club.component';
import { MenuClubComponent } from './menu-club/menu-club.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from '../components/components.module';
import { EquipoComponent } from './components/equipo/equipo.component';
import { CompeticionComponent } from './components/competicion/competicion.component';
import { JugadoresComponent } from './components/jugadores/jugadores.component';
import { CuerpoTecnicoComponent } from './components/cuerpo-tecnico/cuerpo-tecnico.component';
import { MatchesComponent } from './components/matches/matches.component';
import { CompeticionesComponent } from './components/competiciones/competiciones.component';
import { CalendarioComponent } from './components/calendario/calendario.component';
import { CrearCompeticionDialogComponent } from './components/crear-competicion-dialog/crear-competicion-dialog.component';
import { MatchDetailsComponent } from './components/match-details/match-details.component';
import { CompeticionDetailsComponent } from './components/competicion-details/competicion-details.component';
import { CreateMatchDialogComponent } from './components/create-match-dialog/create-match-dialog.component';
import { GamesModule } from '../home/components/games/games.module';
import { WorkoutComponent } from '../academy/components/workout/workout.component';
import { ScoutingComponent } from '../academy/components/scouting/scouting.component';
import { ScoutingDialogComponent } from '../academy/components/scouting-dialog/scouting-dialog.component';
import { TrainingSessionsComponent } from './components/training-sessions/training-sessions.component';
import { NewSessionDialogComponent } from './components/new-session-dialog/new-session-dialog.component';
import { TestComponent } from './components/test/test.component';
import { InjuryPreventionComponent } from './components/injuries/injury-prevention/injury-prevention.component';
import { InjuryPreventionDetailsComponent } from './components/injuries/injury-prevention-details/injury-prevention-details.component';
import { NewProgramDialogComponent } from './components/new-program-dialog/new-program-dialog.component';
import { TestDialogComponent } from './components/test-dialog/test-dialog.component';
import { TrainingsSessionsDetailsComponent } from './components/trainings-sessions-details/trainings-sessions-details.component';
import { TrainingSessionsCalendarComponent } from './components/training-sessions-calendar/training-sessions-calendar.component';
import { SingleWorkoutComponent } from './components/single-workout/single-workout.component';
import { MaterialesDialogComponent } from './components/materiales-dialog/materiales-dialog.component';
import { AddWorkoutDialogComponent } from './components/add-workout-dialog/add-workout-dialog.component';
import { WorkoutDetailsComponent } from './components/workout-details/workout-details.component';
import { AsistenceComponent } from './components/asistence/asistence.component';
import { StrategyPreventionDialogComponent } from './components/strategy-prevention-dialog/strategy-prevention-dialog.component';
import { RfdLesionesComponent } from './components/rfd-lesiones/rfd-lesiones.component';
import { PhysiotherapyComponent } from './components/physiotherapy/physiotherapy.component';
import { EffortRecoveryComponent } from './components/effort-recovery/effort-recovery.component';
import { MySuscriptionDialogComponent } from './components/my-suscription-dialog/my-suscription-dialog.component';
import { NewTabDialogComponent } from './components/new-tab-dialog/new-tab-dialog.component';
import { PhysiotherapyDetailsComponent } from './components/physiotherapy-details/physiotherapy-details.component';
import { EffortQuestionsDialogComponent } from './components/effort-questions-dialog/effort-questions-dialog.component';
import { NewRfdDialogComponent } from './components/new-rfd-dialog/new-rfd-dialog.component';
import { CreateSheetDialogComponent } from './components/create-sheet-dialog/create-sheet-dialog.component';
import { CreateNewExerciseDialogComponent } from './components/create-new-exercise-dialog/create-new-exercise-dialog.component';
import { NutritionPlayerComponent } from './components/nutrition-player/nutrition-player.component';
import { CreateNewDietDialogComponent } from './components/create-new-diet-dialog/create-new-diet-dialog.component';
import { ReeducacionRfdComponent } from './components/reeducacion-rfd/reeducacion-rfd.component';
import { EvolucionPsicologicaDialogComponent } from './components/evolucion-psicologica-dialog/evolucion-psicologica-dialog.component';
import { StageDialogComponent } from './components/stage-dialog/stage-dialog.component';
import { PlayerEvolutionDialogComponent } from './components/players/player-evolution-dialog/player-evolution-dialog.component';
import { TrabajoDiarioDialogComponent } from './components/trabajo-diario-dialog/trabajo-diario-dialog.component';
import { NutritionComponent } from './components/nutrition/nutrition.component';
import { PsicologiaComponent } from './components/psicologia/psicologia.component';
import { NewTestPsicologicoDialogComponent } from './components/new-test-psicologico-dialog/new-test-psicologico-dialog.component';
import { NutritionElementsDialogComponent } from './components/nutrition-elements-dialog/nutrition-elements-dialog.component';
import { WeightControlDialogComponent } from './components/weight-control-dialog/weight-control-dialog.component';
import { PsicologiaPlayerComponent } from './components/psicologia-player/psicologia-player.component';
import { CompetitionMatchModalComponent } from './components/competition-match-modal/competition-match-modal.component';
import { DailyWorkoutDialogComponent } from './components/daily-workout-dialog/daily-workout-dialog.component';
import { PhaseDetailsDialogComponent } from './components/phase-details-dialog/phase-details-dialog.component';
import { EndFileDialogComponent } from './components/physiotherapy/end-file-dialog/end-file-dialog.component';
import { TransformTimestampPipe } from 'src/app/pipes/transform-timestamp.pipe';
import { ConfirmScoutingDialogComponent } from '../academy/components/scouting/components/confirm-scouting-dialog/confirm-scouting-dialog.component';
import { DefaultlBoardComponent } from '../academy/components/scouting-dialog/default-board/default-board.component';
import { BaseballBoardComponent } from '../academy/components/scouting-dialog/baseball-board/baseball-board.component';
import { InjuryPreventionRecordComponent } from './components/injuries/injury-prevention-record/injury-prevention-record.component';
import { EffortRecoveryRecordComponent } from './components/effort-recovery-record/effort-recovery-record.component';
import { EffortRecoveryDetailsComponent } from './components/effort-recovery-details/effort-recovery-details.component';
import { TestSubTypeDialogComponent } from './components/test-sub-type-dialog/test-sub-type-dialog.component';
import { NuevoEquipoComponent } from './components/nuevoEquipo/nuevo-equipo.component';
import { AddionalInfoComponent } from './components/injuries/new-injuries/components/addional-info/addional-info.component';
import { TestInputTypeComponent } from './components/test-dialog/test-input-type/test-input-type.component';
import { TestPlayerListComponent } from './components/test-dialog/test-player-list/test-player-list.component';
import { TestPlayerResultsComponent } from './components/test-dialog/test-player-results/test-player-results.component';
import { TestDetailsComponent } from './components/test/test-details/test-details.component';
import { PlayerResultsComponent } from './components/test/player-results/player-results.component';
import { FinishRfdDialogComponent } from './components/reeducacion-rfd/finish-rfd-dialog/finish-rfd-dialog.component';
import { DailyWorkModalComponent } from './components/reeducacion-rfd/daily-work-modal/daily-work-modal.component';
import { ClasificationColorsPipe } from 'src/app/pipes/clasificationColors.pipe';
import { UtcDatePipe } from 'src/app/pipes/utcDate.pipe';
import { PlayerAvatarPiple } from 'src/app/pipes/playerAvatarPipe';
import { RfdDetailSummaryComponent } from './components/stage-dialog/rfd-detail-summary/rfd-detail-summary.component';
import { MedalDialogComponent } from './components/medal-dialog/medal-dialog.component';
import { TeamAvatarComponent } from '../academy/components/scouting-dialog/team-avatar/team-avatar.component';
import { HeaderActionsComponent } from '../academy/components/scouting-dialog/header-actions/header-actions.component';
import { ScoutingPlayers } from '../academy/components/scouting-dialog/scouting-players/scouting-players.component';
import { MatchPlayerResultsComponent } from './components/match-details/match-player-results/match-player-results.component';
import { TestIntroductionDialogComponent } from './components/test-introduction-dialog/test-introduction-dialog.component';
import { ScoutingMatchCardComponent } from '../academy/components/scouting/components/scouting-match-card/scouting-match-card.component';
import { ScoutingAfterMatchComponent } from '../academy/components/scouting-after-match/scouting-after-match.component';
import { LateralActionsComponent } from '../academy/components/scouting-dialog/actions/lateral-actions/lateral-actions.component';
import { OneStepDialogComponent } from './components/create-match-dialog/one-step-dialog/one-step-dialog.component';
import { TennisBoardComponent } from '../academy/components/scouting-dialog/tennis-board/tennis-board.component';
import { CloseScoutingDialogComponent } from '../academy/components/scouting-dialog/close-scouting-dialog/close-scouting-dialog.component';
import { PlayersComponent } from './components/players/players.component';
import { PlayerProfileComponent } from './components/players/player-profile/player-profile.component';
import { PlayerProfileGeneralComponent } from './components/players/player-profile-general/player-profile-general.component';
import { PlayerProfileInformationComponent } from './components/players/player-profile-information/player-profile-information.component';
import { PlayerWorkingDataComponent } from './components/players/player-working-data/player-working-data.component';
import { PlayerProfileHealthComponent } from './components/players/players-health/player-profile-health/player-profile-health.component';
import { PlayerProfileCompeticionComponent } from './components/players/player-profile-competicion/player-profile-competicion.component';
import { PlayerProfileTrainingComponent } from './components/players/player-profile-training/player-profile-training.component';
import { CalculateRpeDialogComponent } from './components/calculate-rpe-dialog/calculate-rpe-dialog.component';
import { FilterArrayPipe } from '../../_pipes/filterArray.pipe';
import { FileUploadModule } from 'primeng/fileupload';
import { SharedModule } from '../shared-module/shared-module.module';
import { WorkoutGroupsDialogComponent } from './components/workout-groups-dialog/workout-groups-dialog.component';
import { RegisterInvitationComponent } from './register-invitation/register-invitation.component';
import { CardiacFrecuencyDialogComponent } from './components/cardiac-frecuency-dialog/cardiac-frecuency-dialog.component';
import { TargetsAndObjetivesDialogComponent } from './components/targets-and-objetives-dialog/targets-and-objetives-dialog.component';
import { ConfirmationService } from 'primeng/api';
import { TeacherAvatarPipe } from '../../pipes/teacherAvatarPipe';
import { RatingExerciseDialogComponent } from './components/rating-exercise-dialog/rating-exercise-dialog.component';
import { SessionCalendarComponent } from './components/session-calendar/session-calendar.component';

@NgModule({
  declarations: [
    MenuClubComponent,
    ClubHomeComponent,
    ClubComponent,
    EquipoComponent,
    CuerpoTecnicoComponent,
    JugadoresComponent,
    CompeticionComponent,
    MatchesComponent,
    CompeticionesComponent,
    CalendarioComponent,
    PlayersComponent,
    PlayerProfileComponent,
    PlayerProfileGeneralComponent,
    PlayerProfileInformationComponent,
    PlayerWorkingDataComponent,
    PlayerProfileHealthComponent,
    PlayerProfileCompeticionComponent,
    PlayerProfileTrainingComponent,
    CrearCompeticionDialogComponent,
    CompeticionDetailsComponent,
    MatchDetailsComponent,
    CreateMatchDialogComponent,
    WorkoutComponent,
    ScoutingComponent,
    ScoutingDialogComponent,
    TrainingSessionsComponent,
    NewSessionDialogComponent,
    TestComponent,
    InjuryPreventionComponent,
    InjuryPreventionDetailsComponent,
    NewProgramDialogComponent,
    TestDialogComponent,
    TrainingsSessionsDetailsComponent,
    TrainingSessionsCalendarComponent,
    SingleWorkoutComponent,
    MaterialesDialogComponent,
    AddWorkoutDialogComponent,
    WorkoutDetailsComponent,
    AsistenceComponent,
    StrategyPreventionDialogComponent,
    RfdLesionesComponent,
    PhysiotherapyComponent,
    EffortRecoveryComponent,
    MySuscriptionDialogComponent,
    NewTabDialogComponent,
    PhysiotherapyDetailsComponent,
    EffortQuestionsDialogComponent,
    NewRfdDialogComponent,
    CreateSheetDialogComponent,
    CreateNewExerciseDialogComponent,
    NutritionPlayerComponent,
    CreateNewDietDialogComponent,
    ReeducacionRfdComponent,
    EvolucionPsicologicaDialogComponent,
    StageDialogComponent,
    PlayerEvolutionDialogComponent,
    TrabajoDiarioDialogComponent,
    NutritionComponent,
    PsicologiaComponent,
    NewTestPsicologicoDialogComponent,
    NutritionElementsDialogComponent,
    WeightControlDialogComponent,
    PsicologiaPlayerComponent,
    DailyWorkoutDialogComponent,
    PhaseDetailsDialogComponent,
    CompetitionMatchModalComponent,
    EndFileDialogComponent,
    TransformTimestampPipe,
    ConfirmScoutingDialogComponent,
    InjuryPreventionRecordComponent,
    EffortRecoveryDetailsComponent,
    EffortRecoveryRecordComponent,
    TestSubTypeDialogComponent,
    NuevoEquipoComponent,
    AddionalInfoComponent,
    TestInputTypeComponent,
    TestPlayerListComponent,
    TestPlayerResultsComponent,
    TestDetailsComponent,
    PlayerResultsComponent,
    FinishRfdDialogComponent,
    DailyWorkModalComponent,
    ClasificationColorsPipe,
    UtcDatePipe,
    RfdDetailSummaryComponent,
    DefaultlBoardComponent,
    BaseballBoardComponent,
    TeamAvatarComponent,
    HeaderActionsComponent,
    MedalDialogComponent,
    ScoutingPlayers,
    MatchPlayerResultsComponent,
    TestIntroductionDialogComponent,
    ScoutingMatchCardComponent,
    ScoutingAfterMatchComponent,
    LateralActionsComponent,
    OneStepDialogComponent,
    TennisBoardComponent,
    CloseScoutingDialogComponent,
    CalculateRpeDialogComponent,
    FilterArrayPipe,
    WorkoutGroupsDialogComponent,
    RegisterInvitationComponent,
    CardiacFrecuencyDialogComponent,
    TargetsAndObjetivesDialogComponent,
    RatingExerciseDialogComponent,
    SessionCalendarComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedComponentsModule,
    ReactiveFormsModule,
    TranslateModule,
    ClubHomeRoutingModule,
    ComponentsModule,
    FullCalendarModule,
    GamesModule,
    FileUploadModule,
    SharedModule,
  ],
  exports: [
    MenuClubComponent,
    MySuscriptionDialogComponent,
    NuevoEquipoComponent,
    FormsModule,
    ReactiveFormsModule,
    TrainingSessionsComponent,
    WorkoutComponent,
    TestComponent,
    PlayerWorkingDataComponent,
    TransformTimestampPipe,
  ],
  providers: [ConfirmationService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ClubHomeModule {}
