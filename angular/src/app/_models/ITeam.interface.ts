import { Sport } from './sport';

export interface ITeam {
  id: number;
  code: string;
  name: string;
  color: string;
  category: string;
  type_id: number;
  modality_id: number;
  season_id: number;
  gender_id: number;
  image_id: number;
  cover_id: null;
  sport_id: number;
  club_id: number;
  created_at: Date;
  updated_at: Date;
  image_url: string;
  cover_url: null;
  image: Image;
  cover: Cover;
  sport: Sport;
  staff_count: number;
  slug: string;
}

export interface Image {
  id: number;
  url: string;
  mime_type: string;
  size: number;
  created_at: Date;
  updated_at: Date;
  full_url: string;
}
export interface Cover {
  id: number;
  url: string;
  mime_type: string;
  full_url: string;
}
