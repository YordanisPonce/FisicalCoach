import { ITeam } from './ITeam.interface';
import { Scouting } from './PlayerProfile.interface';

import { Referee } from './referee';

export interface Competition {
  id?: number;
  name: string;
  team_id?: number;
  created_at: string;
  state?: number;
  type_competition_id: number;
  type_competition_name: string;
  date_start: string;
  date_end: string;
  image: any;
  url_image: string;
  teams: any[];
  team?: ITeam;
  current_team?: any;
  matches: Match[];
  rivals?: CompetitionRivalTeam[];
  type_competition?: {
    id: number;
    code: string;
    name: string;
  };
}

export interface RivalTeam {
  code: string;
  name: string;
  id?: string;
}

export interface TestCategory {
  code: string;
  name: string;
  id?: string;
  value: number;
  type: string;
}

export interface CompetitionRivalTeam {
  competition_id: number;
  id: number;
  image_id: number;
  rival_team: string;
  url_image: string;
}

export interface Match {
  id?: number | string;
  match_id?: number | string;
  competition: Competition;
  competition_id: string | number;
  competition_type: string;
  start_at: string;
  start_at_hour?: string;
  start_at_date?: string;
  location: string;
  lane: string;
  observation: string;
  rival_name?: string;
  test_category_id: number;
  modality: number;
  modality_id?: number;
  test_type_category_id: number;
  competition_rival_team_id: string;
  competition_player_id: string;
  rivals: { competition_match_id: number; id: number; rival_player: string }[];
  competition_url_image?: string;
  competition_rival_team: CompetitionRivalTeam;
  rival_team_image_url?: string;
  competition_rival_team_name?: string;
  match_situation: string;
  referee_id: string;
  referee: Referee;
  weather_id: string;
  rivalTeam?: any;
  lineup: {
    type_lineup_id?: number;
    players: [
      {
        full_name?: string;
        player_id: number;
        lineup_player_type_id: number;
      }
    ];
  };
  players: any;
  players_match: any;
  scouting?: Scouting;
  test_category?: {
    code: string;
    id: string;
    name: string;
  };
}

export interface FootBallMatchResults {
  score: {
    own: any;
    rival: any;
    position?: number;
  };
  statistics: Statistics;
}

export interface TennisMatchResults {
  score: {
    own: number[];
    rival: number[];
  };
  statistics: Statistics;
}

export interface BaseballMatchResults {
  score: {
    balls: number;
    current_inning: string;
    outs: number;
    own: number;
    own_errors: number;
    rival: number;
    rival_errors: number;
    strikes: number;
    current_over: string;
  };
  statistics: Statistics;
}

export interface MatchResult {
  score: FootBallMatchResults | BaseballMatchResults | TennisMatchResults;
  statistics: {
    total_duels: number;
    total_passes: number;
    total_seven_meter_throws: number;
    total_throws: number;
  };
}

export interface MatchStatus {
  competition_match_id: number;
  created_at: string;
  finish_date: string;
  id: number;
  in_game_time: string;
  start_date: string;
  status: string;
  updated_at: string;
}

export interface Statistics {
  fouls_committed?: number;
  fouls_received?: number;
  goal_assists?: number;
  goal_scoring_chances?: number;
  injuries?: number;
  number_of_substitutions?: number;
  period?: number;
  recoveries?: number;
  shots_off_target?: number;
  shots_on_target?: number;
  total_air_duels?: number;
  total_corner_kicks?: number;
  total_duels?: number;
  total_penalties?: number;
  total_second_plays?: number;
  total_shots?: number;
  total_throws_in?: number;
}

export interface TypePlayer {
  code: string;
  color: string;
  id: number;
  name: string;
}

export interface CompetitionType {
  id: number;
  code: string;
  name: string;
}
