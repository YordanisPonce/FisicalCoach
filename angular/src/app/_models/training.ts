import { RatingIcon } from '../utils/rating-icons';

export interface TrainingExerciseSession {
  id?: number | string;
  code?: string;
  author?: string;
  title?: string;
  icon?: string;
  created_at: string;
  difficulty?: number;
  intensity?: number;
  duration?: string;
  number_exercises?: number;
  like: boolean;
  type_exercise_session_id?: number;
  exercise_session_execution: {
    date_session: string;
    exercise_session_id: number;
    hour_session: string;
    id: number;
    observation: any;
    place_session: string;
    exercise_session_place: PlaceSession;
  };
  training_period_id?: number;
  exercises?: any;
  exercise_session_exercises: any[];
  targets?: any;
  materials?: string;
  execution?: any;
  intensityIcon?: RatingIcon | null;
  order: number;
}

export interface PlaceSession {
  id: number;
  place_session: string;
}

export interface Target {
  code: string;
  content_exercise_id: number | string;
  id: number | string;
  name: string;
  sport_id: number | string;
  sub_content_session_id: number | string;
}

export interface TrainingSessionType {
  code: string;
  id: number | string;
  name: string;
}

export interface TrainingPeriod {
  code: string;
  id: number | string;
  name: string;
}

export interface SessionPlace {
  entity_id: number;
  entity_type: string;
  id: number;
  place_session: string;
}

export interface TrainingSessionForm {
  author: string;
  title: string;
  order: string;
  training_period_id?: number;
  duration: string;
  type_exercise_session_id?: number;
  execution: string;
}
