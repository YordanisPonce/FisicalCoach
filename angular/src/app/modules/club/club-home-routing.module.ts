import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlayersComponent } from './components/players/players.component';
import { CompeticionesComponent } from './components/competiciones/competiciones.component';
import { CalendarioComponent } from './components/calendario/calendario.component';
import { CompeticionDetailsComponent } from './components/competicion-details/competicion-details.component';
import { PlayerProfileComponent } from './components/players/player-profile/player-profile.component';
import { PlayerProfileGeneralComponent } from './components/players/player-profile-general/player-profile-general.component';
import { PlayerProfileInformationComponent } from './components/players/player-profile-information/player-profile-information.component';
import { PlayerProfileHealthComponent } from './components/players/players-health/player-profile-health/player-profile-health.component';
import { PlayerProfileCompeticionComponent } from './components/players/player-profile-competicion/player-profile-competicion.component';
import { PlayerProfileTrainingComponent } from './components/players/player-profile-training/player-profile-training.component';
import { ClubHomeComponent } from './club-home.component';
import { ScoutingComponent } from '../academy/components/scouting/scouting.component';
import { WorkoutComponent } from '../academy/components/workout/workout.component';
import { TrainingSessionsComponent } from './components/training-sessions/training-sessions.component';
import { WorkoutDetailsComponent } from './components/workout-details/workout-details.component';
import { TrainingsSessionsDetailsComponent } from './components/trainings-sessions-details/trainings-sessions-details.component';
import { TrainingSessionsCalendarComponent } from './components/training-sessions-calendar/training-sessions-calendar.component';
import { TestComponent } from './components/test/test.component';
import { InjuryPreventionComponent } from './components/injuries/injury-prevention/injury-prevention.component';
import { InjuryPreventionDetailsComponent } from './components/injuries/injury-prevention-details/injury-prevention-details.component';
import { RfdLesionesComponent } from './components/rfd-lesiones/rfd-lesiones.component';
import { ReeducacionRfdComponent } from './components/reeducacion-rfd/reeducacion-rfd.component';
import { PhysiotherapyComponent } from './components/physiotherapy/physiotherapy.component';
import { PhysiotherapyDetailsComponent } from './components/physiotherapy-details/physiotherapy-details.component';
import { EffortRecoveryComponent } from './components/effort-recovery/effort-recovery.component';
import { EffortRecoveryDetailsComponent } from './components/effort-recovery-details/effort-recovery-details.component';
import { EffortRecoveryRecordComponent } from './components/effort-recovery-record/effort-recovery-record.component';
import { NutritionComponent } from './components/nutrition/nutrition.component';
import { PsicologiaComponent } from './components/psicologia/psicologia.component';
import { PsicologiaPlayerComponent } from './components/psicologia-player/psicologia-player.component';
import { NutritionPlayerComponent } from './components/nutrition-player/nutrition-player.component';
import { ScoutingAfterMatchComponent } from '../academy/components/scouting-after-match/scouting-after-match.component';
import { EquipoComponent } from './components/equipo/equipo.component';
import { InjuryPreventionRecordComponent } from './components/injuries/injury-prevention-record/injury-prevention-record.component';
import { MatchDetailsComponent } from './components/match-details/match-details.component';
import { TestDetailsComponent } from './components/test/test-details/test-details.component';
import { PlayerResultsComponent } from './components/test/player-results/player-results.component';
import { RegisterInvitationComponent } from './register-invitation/register-invitation.component';
import { SessionCalendarComponent } from './components/session-calendar/session-calendar.component';
import { PermissionGuard } from 'src/app/guards/permission.guard';

const routes: Routes = [
  {
    path: '',
    component: ClubHomeComponent,
    children: [
      {
        path: 'home',
        component: EquipoComponent,
      },
      {
        path: 'players',
        component: PlayersComponent,
        canActivate: [PermissionGuard],
        data: {
          permissions: 'team_players_list',
        },
      },
      {
        path: 'competitions',
        component: CompeticionesComponent,
        canActivate: [PermissionGuard],
        data: {
          permissions: 'team_competition_list',
        },
      },
      {
        path: 'competition/details/:id',
        component: CompeticionDetailsComponent,
        canActivate: [PermissionGuard],
        data: {
          permissions: 'team_competition_match_list',
        },
      },
      {
        path: 'competition/match/details/:id',
        component: MatchDetailsComponent,
        canActivate: [PermissionGuard],
        data: {
          permissions: 'team_competition_match_list',
        },
      },
      {
        path: 'nutrition/player/:id',
        component: NutritionPlayerComponent,
        canActivate: [PermissionGuard],
        data: {
          permissions: 'team_nutrition_list',
        },
      },
      {
        path: 'nutrition',
        component: NutritionComponent,
        canActivate: [PermissionGuard],
        data: {
          permissions: 'team_nutrition_list',
        },
      },
      {
        path: 'competitions/calendar',
        component: CalendarioComponent,
        canActivate: [PermissionGuard],
        data: {
          permissions: 'team_competition_list',
        },
      },
      {
        path: 'players/perfil',
        component: PlayerProfileComponent,
        canActivate: [PermissionGuard],
        data: {
          permissions: 'team_players_list',
        },
        children: [
          {
            path: '',
            pathMatch: 'prefix',
            redirectTo: 'general',
          },
          {
            path: 'general',
            component: PlayerProfileGeneralComponent,
            canActivate: [PermissionGuard],
            data: {
              permissions: 'team_players_list',
            },
          },
          {
            path: 'informacion',
            component: PlayerProfileInformationComponent,
            canActivate: [PermissionGuard],
            data: {
              permissions: 'team_players_list',
            },
          },
          {
            path: 'estado-de-salud',
            component: PlayerProfileHealthComponent,
            canActivate: [PermissionGuard],
            data: {
              permissions: 'team_players_list',
            },
          },
          {
            path: 'competicion',
            component: PlayerProfileCompeticionComponent,
            canActivate: [PermissionGuard],
            data: {
              permissions: 'team_players_list',
            },
          },
          {
            path: 'carga-de-entrenamiento',
            component: PlayerProfileTrainingComponent,
            canActivate: [PermissionGuard],
            data: {
              permissions: 'team_players_list',
            },
          },
        ],
      },
      {
        path: 'scouting',
        component: ScoutingComponent,
        canActivate: [PermissionGuard],
        data: {
          permissions: 'team_scouting_list',
        },
      },
      {
        path: 'scouting/finalizado',
        component: ScoutingAfterMatchComponent,
        canActivate: [PermissionGuard],
        data: {
          permissions: 'team_scouting_list',
        },
      },
      {
        path: 'workout',
        component: WorkoutComponent,
        canActivate: [PermissionGuard],
        data: {
          permissions: 'team_exercise_list',
        },
      },
      {
        path: 'workout/details/:code',
        component: WorkoutDetailsComponent,
        canActivate: [PermissionGuard],
        data: {
          permissions: 'team_exercise_list',
        },
      },
      {
        path: 'training-sessions',
        component: TrainingSessionsComponent,
        canActivate: [PermissionGuard],
        data: {
          permissions: 'team_session_exercise_list',
        },
      },
      {
        path: 'training-sessions/calendar',
        component: SessionCalendarComponent,
        canActivate: [PermissionGuard],
        data: {
          permissions: 'team_session_exercise_list',
        },
      },
      {
        path: 'training-sessions/calendar',
        component: TrainingSessionsCalendarComponent,
        canActivate: [PermissionGuard],
        data: {
          permissions: 'team_session_exercise_list',
        },
      },
      {
        path: 'training-sessions/details/:code',
        component: TrainingsSessionsDetailsComponent,
        canActivate: [PermissionGuard],
        data: {
          permissions: 'team_session_exercise_list',
        },
      },
      {
        path: 'training-sessions/exercise/details/:code',
        component: WorkoutDetailsComponent,
        canActivate: [PermissionGuard],
        data: {
          permissions: 'team_session_exercise_list',
        },
      },
      {
        path: 'test',
        component: TestComponent,
        canActivate: [PermissionGuard],
        data: {
          permissions: 'team_test_list',
        },
      },
      {
        path: 'test-details/:id',
        component: TestDetailsComponent,
        canActivate: [PermissionGuard],
        data: {
          permissions: 'team_test_list',
        },
      },
      {
        path: 'test-details',
        component: TestDetailsComponent,
        canActivate: [PermissionGuard],
        data: {
          permissions: 'team_test_list',
        },
      },
      {
        path: 'test-player-results/:code',
        component: PlayerResultsComponent,
        canActivate: [PermissionGuard],
        data: {
          permissions: 'team_test_list',
        },
      },
      {
        path: 'injury-prevention',
        component: InjuryPreventionComponent,
        canActivate: [PermissionGuard],
        data: {
          permissions: 'team_injury_prevention_list',
        },
      },
      {
        path: 'injury-prevention/detalles/:team/:player/:injuryPrevention',
        component: InjuryPreventionDetailsComponent,
        canActivate: [PermissionGuard],
        data: {
          permissions: 'team_injury_prevention_list',
        },
      },
      {
        path: 'injury-prevention/record/:team/:player',
        component: InjuryPreventionRecordComponent,
        canActivate: [PermissionGuard],
        data: {
          permissions: 'team_injury_prevention_list',
        },
      },
      {
        path: 'rfd-injuries',
        component: RfdLesionesComponent,
        canActivate: [PermissionGuard],
        data: {
          permissions: 'team_injury_rfd_list',
        },
      },
      {
        path: 'rfd-injuries/reeducacion/:rdf_code',
        component: ReeducacionRfdComponent,
        canActivate: [PermissionGuard],
        data: {
          permissions: 'team_injury_rfd_list',
        },
      },
      {
        path: 'physiotherapy',
        component: PhysiotherapyComponent,
        canActivate: [PermissionGuard],
        data: {
          permissions: 'team_fisiotherapy_list',
        },
      },
      {
        path: 'physiotherapy/detalles/:id',
        component: PhysiotherapyDetailsComponent,
        canActivate: [PermissionGuard],
        data: {
          permissions: 'team_fisiotherapy_list',
        },
      },
      {
        path: 'effort-recovery',
        component: EffortRecoveryComponent,
        canActivate: [PermissionGuard],
        data: {
          permissions: 'team_effort_recovery_list',
        },
      },
      {
        path: 'effort-recovery/detalles/:player/:effortRecovery',
        component: EffortRecoveryDetailsComponent,
        canActivate: [PermissionGuard],
        data: {
          permissions: 'team_effort_recovery_list',
        },
      },
      {
        path: 'effort-recovery/record/:effortRecovery',
        component: EffortRecoveryRecordComponent,
        canActivate: [PermissionGuard],
        data: {
          permissions: 'team_effort_recovery_list',
        },
      },

      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'psychology',
        component: PsicologiaComponent,
        canActivate: [PermissionGuard],
        data: {
          permissions: 'team_psychology_list',
        },
      },
      /*
      {
        path: 'nutrition',
        component: NutritionComponent,
      },
      {
        path: 'nutrition/detalles',
        component: NutritionDetailsComponent,
      },
      {
        path: 'psicologia',
        component: PsicologiaComponent,
      }, */
      {
        path: 'psychology/detail',
        component: PsicologiaPlayerComponent,
        canActivate: [PermissionGuard],
        data: {
          permissions: 'team_psychology_list',
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClubHomeRoutingModule {}
