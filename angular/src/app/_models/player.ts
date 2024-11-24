export interface Player {
  id: number;
  player_id?: number;
  file_id?: number;
  full_name: string;
  file_title: string;
  rival_player: string;
  gender: any;
  gender_id: any;
  alias: string;
  age: number;
  isSubstituted: boolean;
  id_rfd?: number;
  date_birth: string;
  country_id: number;
  player: Player;
  height: number;
  weight: number;
  image?: any;
  position: any;
  position_id?: number;
  shirt_number?: number;
  resting_heart_rate: number;
  maximum_heart_rate: number;
  nutritional_sheet?: {
    total_energy_expenditure: number | any;
  };
  image_id?: any;
  imc: number;
  injury?: any;
  perception_effort_id?: number | null;
  percept_effort_url?: string;
  percept_effort: any;
  percept_number: string;
  percept_name?: string;
  assistance: boolean;
  file_discharge_date?: string;
  file_start_date?: string;
  injury_status: boolean;
  closed_rfd: boolean;
  latest_file_fisiotherapy: any;
}

export interface MatchPlayer {
  player: Player;
  competition_match_id: number;
  id: number;
  lineup_player_type_id: number;
  order: string;
  player_id: number;
}

export interface PlayerRDFInjury {
  annotations: string;
  closed: boolean;
  code: string;
  criterias: any;
  current_situation_id: number;
  daily_works: any;
  id: number;
  injury: {
    id: number;
    entity_id: number;
    entity: Player;
    injury_date: string;
    extra_info: string;
    medically_discharged_at: string;
    sportly_discharged_at: string;
    competitively_discharged_at: string;
    severity: {
      id: number;
      code: string;
      name: string;
    };
    type: {
      id: number;
      code: string;
      name: string;
    };
    type_spec: {
      id: number;
      code: string;
      name: string;
      image: { url: string; full_url: string };
    };
  };
  injury_id: number;
  percentage_complete: string;
  phase_details: any;
}
export interface PlayerFile {
  anamnesis: string;
  day_difference: number;
  discharge_date: string;
  has_medication: boolean;
  hour_difference: number;
  id: number;
  medication: string;
  medication_objective: string;
  observation: string;
  player: Player;
  player_id: number;
  injury_id: number;
  specialty: string;
  start_date: string;
  team_staff: any;
  team_staff_id: number;
  title: string;
}

export interface Treatments {
  id: number;
  code: string;
  name: string;
}

export interface PlayerSportingData {
  id: number;
  id_player: number;
  sports_name: string;
  demarcation: string;
  dorsal: number;
  specific_demarcation: string;
  laterality: string;
}

export interface PlayerContactData {
  id: number;
  id_player: number;
  street: string;
  postal_code: string;
  city: number;
  country: number;
  province: string;
  phone: number;
  mobile_phone: number;
  email: string;
}

export interface PlayerFamilyData {
  id: number;
  id_player: number;
  marital_status_parents: string;
  father_name: string;
  phone_father: number;
  phone_mobile_father: number;
  email_father: string;
  mother_name: string;
  phone_mother: number;
  phone_mobile_mother: number;
  email_mother: string;
  address_1: string;
  country_1: number;
  city_1: number;
  address_2: string;
  country_2: number;
  city_2: number;
}

export interface RFDHistorical {
  annotations: string;
  closed: boolean;
  id: number;
  injury_id: number;
  percentage_complete: string;
  phases: any[];
}

export interface PlayerType {
  code: string;
  color: string;
  id: number;
  name: string;
  sport_id: number;
}
