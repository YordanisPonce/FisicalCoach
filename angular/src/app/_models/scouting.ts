import { Player } from './player';

export interface Activity {
  action: any;
  action_id: number;
  created_at: string;
  custom_params: any;
  id: number;
  in_game_time: any;
  player_id: number;
  player: Player;
  rival_team_activity: boolean;
  scouting_id: number;
  status: boolean;
  updated_at: string;
}
