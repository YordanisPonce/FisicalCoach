import { ITeam } from './ITeam.interface';
import { Player } from './player';
import { Classroom } from './schools';
import { Sport } from './sport';

export interface EducationalLevel {
  code: string;
  id: 2;
  name: string;
}
export interface Ejercicio {
  id: number;
  code: string;
  like: boolean;
  exercise_code: string;
  title: string;
  description: string;
  dimensions: string;
  dimentions: string;
  distribution: {
    name: string;
    code: string;
  };
  user: any;
  author?: string;
  duration: string;
  repetitions: number;
  contents: any[];
  content_blocks: any[];
  exercise_education_level: EducationalLevel;
  image: {
    full_url: string;
    id: number;
  };
  duration_repetitions: string;
  break_repetitions: string;
  series: number;
  break_series: string;
  difficulty: number;
  intensity: number;
  distribution_exercise_id: number;
  content_exercise_ids?: number;
  content_exercise_id: number;
  team_id: number;
  previous_code?: string;
  targets: any[];
  sub_contents: any[];
  thumbnail: string;
  mode?: string;
  sport_id?: number;
  exercise_education_level_id?: number;
  sport: Sport;
  teams: ITeam;
  classrooms: Classroom;
  exercise_session_id: number;
  order: number;
}

export interface WorkoutGroup {
  code: string;
  description: string;
  id: number;
  name: string;
  players: Player[];
  alumns: Player[];
  team_id: number;
  color: string;
}
