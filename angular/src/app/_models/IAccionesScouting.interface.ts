export interface IAccionesScoutingInterface {
  id: number;
  name: string;
  image_id: number;
  rival_team_action: boolean;
  side_effect: string;
  sport_id: number;
  created_at: Date;
  updated_at: Date;
  slug: string;
  image_url: string;
  image: Image;
  code: string;
  custom_params: any;
}

export interface Image {
  id: number;
  url: string;
  mime_type: string;
  size: number;
  created_at: Date;
  updated_at: Date;
}
