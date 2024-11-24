export interface TraininLoad {
  id: number;
  assistance: boolean;
  applicant_type: string;
  applicant_id: number;
  exercise_session_id: number;
  perception_effort_id: number | null;
  time_training: string;
  training_load: null | string;
  perception_effort: PerceptionEffort | null;
}

export interface PerceptionEffort {
  id: number;
  code: string;
  number: string;
  image_id: number;
  name: string;
  image: Image;
}

export interface Image {
  id: number;
  full_url: string;
}
