export interface PlayerInterface {
  player: Player;
  matches: number;
  last_match: LastMatch|null;
  health_status: boolean;
  lastet_injury: LastetInjury;
  injuries_history: InjuriesHistory[];
}

export interface InjuriesHistory {
  severity_location: SeverityLocation;
}

export interface SeverityLocation {
  id: number;
  severity_id: number;
  location_id: number;
  image_id: number;
  image: Image;
}

export interface Image {
  id: number;
  full_url: string;
}

export interface LastetInjury {
  id: number;
  entity_id: number;
  is_active: boolean;
  injury_date: Date;
  injury_day: number;
  mechanism_injury_id: number;
  injury_situation_id: number;
  is_triggered_by_contact: boolean;
  injury_type_id: number;
  injury_type_spec_id: number;
  detailed_diagnose: string;
  area_body_id: number;
  detailed_location: string;
  affected_side_id: number;
  is_relapse: boolean;
  injury_severity_id: number;
  injury_location_id: number;
  injury_forecast: string;
  days_off: number;
  matches_off: number;
  medically_discharged_at: Date;
  sportly_discharged_at: Date;
  competitively_discharged_at: Date;
  surgery_date: Date;
  surgeon_name: string;
  medical_center_name: string;
  surgery_extra_info: string;
  extra_info: string;
  severity_location: SeverityLocation;
  affected_side: AffectedSide;
  location: Location;
}

export interface AffectedSide {
  id: number;
  code: string;
  name: string;
  translations?: Translation[];
}

export interface Translation {
  id: number;
  family_member_type_id: number;
  locale: string;
  name: string;
}

export interface Location {
  id: number;
  image_id: number;
  name: string;
}

export interface Player {
  id: number;
  full_name: string;
  alias: string;
  shirt_number: number;
  date_birth: Date;
  gender_id: number;
  gender_identity_id: null;
  height: string;
  weight: string;
  heart_rate: string;
  email: string;
  agents: string;
  profile: null;
  user_id: null;
  laterality_id: number;
  team_id: number;
  position_id: number;
  position_spec_id: null;
  position_text: null;
  position_spec_text: null;
  image_id: null;
  performance_assessment: number;
  laterality: Gender;
  bmi: string;
  age: number;
  gender: Gender;
  gender_identity: Gender;
  max_heart_rate: number;
  image: null;
  team: Team;
  position: Position;
  position_spec: null;
  psychology_reports: any[];
  address: Address;
  family: Family;
  diseases: any[];
  allergies: any[];
  body_areas: any[];
  physical_problems: any[];
  medicine_types: any[];
  surgeries: any[];
}

export interface Address {
  id: number;
  street: string;
  city: string;
  postal_code: string;
  phone: string[] | null;
  mobile_phone: string[] | null;
  country_id: number;
  province_id: number;
  country: Position;
  province: Position;
}

export interface Position {
  id: number;
  name: string;
}

export interface Family {
  id: number;
  parents_marital_status_id: number;
  parents_marital_status: Gender;
  members: Member[];
  address: Address;
}

export interface Member {
  id: number;
  full_name: string;
  email: string;
  phone: string[];
  mobile_phone: string[];
  family_member_type_id: number;
  user_id: number;
  type: AffectedSide;
}

export interface Gender {
  id: number;
  code: string;
}

export interface Team {
  id: number;
  name: string;
  category: string;
  club_id: number;
  sport_id: number;
  image_url: null;
  cover_url: null;
  staff_count: null;
  season: null;
  sport: Sport;
  type: null;
  image: null;
  cover: null;
}

export interface Sport {
  id: number;
  code: string;
  has_scouting: boolean;
  time_game: number;
  court_id: number;
  model_url: string;
  field_image: null;
  name: string;
}



export interface LastMatch {
  id:                        number;
  competition_id:            number;
  start_at:                  Date;
  location:                  string;
  observation:               null;
  competition_rival_team_id: number;
  match_situation:           string;
  referee_id:                null;
  weather_id:                number;
  test_category_id:          null;
  test_type_category_id:     null;
  modality_id:               null;
  score:                     Score;
  competition_name:          string;
  competition_url_image:     string;
  weather:                   Weather;
  referee:                   null;
  modality:                  null;
  test_category:             null;
  test_type_category:        null;
  lineup:                    null;
  competition_rival_team:    CompetitionRivalTeam;
  scouting:                  Scouting;
}

export interface CompetitionRivalTeam {
  id:             number;
  competition_id: number;
  rival_team:     string;
  image_id:       number;
  url_image:      string;
}

export interface Score {
  own:   number;
  rival: number;
}

export interface Scouting {
  id:                   number;
  start_date:           Date;
  finish_date:          null;
  status:               string;
  competition_match_id: number;
  start_match:          null;
  created_at:           Date | string;
  updated_at:           Date;
  in_game_time:         string;
  in_period_time:       null;
  in_real_time:         null;
}

export interface Weather {
  id:   number;
  code: string;
  name: string;
}


