import { Price } from './subscription';

export interface User {
  active: boolean;
  address: string;
  card_brand: string;
  card_last_four: string;
  city: string;
  company_address: string;
  company_city: string;
  company_idnumber: string;
  company_name: string;
  company_phone: string;
  company_vat: string;
  company_zipcode: string;
  country_id: number;
  cover: string;
  cover_id: number;
  created_at: string;
  deleted_at: string;
  dni: string;
  email: string;
  email_verified_at: string;
  entity_permissions: any[];
  full_name: string;
  gender: number;
  id: number;
  image: any;
  image_id: number;
  is_company: boolean;
  mobile_phone: string;
  phone: string;
  provider_google_id: number;
  province_id: number;
  roles: any[];
  stripe_id: number;
  subscriptions: any[];
  trial_ends_at: string;
  updated_at: string;
  username: string;
  zipcode: string;
  permissions: UserPermission[];
}

export interface UserSubscription {
  id?: number;
  user_id?: number;
  name?: string;
  stripe_id?: string;
  stripe_status?: string;
  stripe_plan?: null;
  quantity: number;
  trial_ends_at?: Date;
  ends_at?: null;
  package_price_id?: number;
  interval?: string;
  amount?: null;
  package_price_name?: string;
  subpackage_name?: string;
  subpackage_code?: string;
  package_name?: string;
  package_code?: string;
  items?: any[];
  package_price?: PackagePrice;
}

export interface PackagePrice {
  id?: number;
  name?: string;
  subpackage_id?: number;
  min_licenses?: number;
  max_licenses?: number;
  subpackage?: Subpackage;
}

export interface Subpackage {
  id?: number;
  code?: string;
  package_id?: number;
  name?: string;
  package?: ListPosition;
  prices?: Price[];
}

export interface ListPosition {
  id?: number;
  code?: string;
  sport_id?: number;
  name?: string;
}

export interface Package {
  id: number;
  licenses: Licence[];
  name: string;
  package_code: string;
  package_name: string;
  package_price_name: string;
  subpackage_name: string;
  user_id: number;
}

export interface Licence {
  accepted_at: string;
  code: string;
  expires_at: string;
  id: number;
  status: string;
  subscription_id: number;
  updated_at: string;
  user_id: number;
  user: User;
}

export interface Permission {
  entity_code: string;
  id: number;
  name: string;
  pivot: {
    model_id: number;
    entity_id: number;
    permission_id: number;
  };
}

export interface UserPermission {
  entity: string;
  entity_id: number;
  lists: string[];
}

export interface Pivot {
  attribute_id: number;
  available: boolean;
  quantity: string;
  subpackage_id: number;
}
export interface PackageAttribute {
  code: string;
  id: number;
  name: string;
  pivot: Pivot;
}

export interface DowngradePlan {
  package_price_id: number;
  interval: string;
  type: string;
  sport: {
    teams: number[];
    matches: number[];
    exercises: number[];
    training_sessions: number[];
    players: number[];
    tests: number[];
    injury_prevention: number[];
    rfd_injuries: number[];
    fisiotherapy: number[];
    recovery_exertion: number[];
    nutrition: number[];
    psychology_reports: number[];
  };
}

export interface DowngradePlanTeacher {
  package_price_id: number;
  interval: string;
  type: string;
  teacher: {
    exercises: number[];
    exercise_sessions: number[];
    tests: number[];
    tutorships: number[];
  };
}

export type SportCodes =
  | 'teams'
  | 'matches'
  | 'exercises'
  | 'training_sessions'
  | 'players'
  | 'tests'
  | 'injury_prevention'
  | 'rfd_injuries'
  | 'fisiotherapy'
  | 'recovery_exertion'
  | 'nutrition'
  | 'psychology_reports';

export type TeacherCodes =
  | 'exercises'
  | 'exercise_sessions'
  | 'tests'
  | 'tutorships';
