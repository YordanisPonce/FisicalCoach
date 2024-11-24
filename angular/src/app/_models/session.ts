import { Ejercicio } from './ejercicio';

export interface Session {
  author: string;
  code: string;
  difficulty: number;
  duration: string;
  entity_id: number;
  entity_type: string;
  like: boolean;
  contents: any[];
  content_blocks: any[];
  exercise_session_exercises: {
    author?: string;
    code: string;
    duration: string;
    order: number;
    difficulty: number;
    intensity: number;
    id: number;
    exercise: Ejercicio;
  }[];
  exercise_session_details: {
    date_session: string;
    exercise_session_id: number;
    exercise_session_place: any;
    hour_session: string;
    id: number;
    observation: null;
    place_session: string;
  }[];
  icon: string;
  id: number;
  intensity: number;
  materials: number;
  number_exercises: number;
  targets: any[];
  targets_groups: any[];
  title: string;
  training_period: { id: number; name: string };
  type_exercise_session: { id: number; name: string };
  order: number;
}
