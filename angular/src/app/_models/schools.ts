import { Image } from './ITeam.interface';

export interface School {
  id?: number;
  address: {
    address: string;
    city: string;
    id: number;
    mobile_phone: any;
    phone: any;
    postal_code: string;
    street: string;
  };
  club_type_id: number;
  email: string;
  image: { url: string; full_url: string };
  name: string;
  owner: {
    id: number;
    full_name: string;
    email: string;
    username: string;
  };
  school_center_type_id: number;
  slug: string;
  users: [];
  users_count: number;
  webpage: string;
  code: string;
  postal_code: string;
  phone: any;
  mobile_phone: any;
  city: string;
  province_id: string;
  country_id: string;
  province: any;
  country: any;
  logo: string;
  sportType: string;
  sport_profile: any;
}

export interface SchoolCenterType {
  code: string;
  id: number;
  name: string;
}

export interface Classroom {
  age_id: number;
  club_id: number;
  id: number;
  name: string;
  physical_teacher_id: number;
  subject_id: number;
  tutor_id: number;
  club: School;
  image: any;
  cover: any;
  color: string;
  active_academic_years: any;
}
export interface Age {
  id: number;
  range: string;
}
export interface Subject {
  id: number;
  name: string;
  club_id: number;
  image_id: number;
}

export interface Teacher {
  id: number;
  alias: string;
  citizenship: string;
  teacher_area_id: number;
  gender: string;
  date_of_birth: string;
  name: string;
  club_id: number;
  image_id: number;
}
