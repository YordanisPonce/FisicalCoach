export interface Injury {
  id: string | number;
  injury_date: string;
  mechanism_injury_id: number;
  injury_situation_id: number;
  is_triggered_by_contact: boolean;
  injury_intrinsic_factor_id: number;
  injury_extrinsic_factor_id: number;
  injury_id?: number;
  injury_type_id: number;
  injury_type_spec_id: number;
  is_relapse: boolean;
  affected_side_id: number;
  injury_location_id: number;
  detailed_location: string;
  injury_severity_id: number;

  injury_forecast: string;
  medically_discharged_at: string;
  days_off: number;
  sportly_discharged_at: string;
  matches_off: number;
  competitively_discharged_at: string;
  surgery_date: string;
  medical_center_name: string;
  surgeon_name: string;
  surgery_extra_info: string;

  clinical_test_types: number[];
  detailed_diagnose: string;
  name?: string;
  location?: { id: number; name: string };

  area_body_id: number;
}

export interface InjuryPhase {
  code: string;
  percentage_complete: any;
  previous_application: any;
  phase_passed: boolean;
  phase: {
    code: string;
    id: number;
    min_percentage_pass: string;
    name: string;
    percentage_value: string;
    test_code: string;
  };
}

export interface Criterias {
  code: string;
  id: number;
  name: string;
  value: boolean;
  pivot: {
    reinstatement_criteria_id: number;
    created_at: string;
    injury_rfd_id: number;
    updated_at: string;
    value: boolean;
  };
}
