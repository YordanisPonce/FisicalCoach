export interface UserInvitationInterface {
  club_id:       number;
  invited_users: InvitedUser[];
}

export interface InvitedUser {
  email:            string;
  teams:            Team[];
  permissions_list?: any[];
}

export interface Team {
  id:          number;
  permissions: string[];
}
export interface Invitation {
  inviter_user_id:        number;
  inviter_user_full_name: string;
  invited_user_id:        number;
  invited_user_email:     string;
  code:                   string;
  accepted_at:            null;
  status:                 string;
  deleted_at:             null;
  position_staff_id:      number;
  jobs_area_id:           number;
  job_area:               string;
  responsability:         string;
  team_ids:               string;
}
export interface MembersInterface {
  id:                     number;
  full_name:              string;
  email:                  string;
  username:               null;
  birth_date:             null;
  user_id:                number;
  entity_type:            string;
  entity_id:              number;
  is_active:              boolean;
  gender_id:              null;
  study_level_id:         null;
  jobs_area_id:           null;
  position_staff_id:      number;
  responsibility:         string;
  additional_information: null;
  image_id:               null;
  deleted_at:             null;
  gender:                 Gender;
  user:                   User;
  image:                  null;
  study_level:            null;
  job_area:               null;
  selected:               boolean;
  position_staff:         PositionStaff;
}

export interface Gender {
  id:   number;
  code: string;
}

export interface PositionStaff {
  id:           number;
  jobs_area_id: number;
  code:         string;
  name:         string;
}

export interface User {
  id:    number;
  email: string;
  image: null;
}
export interface UserPermissions {
  index:       number;
  type:        string;
  permissions: Permission[];
}

export interface Permission {
  id:          number;
  name:        string;
  entity_code: string;
}
