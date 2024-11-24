export interface Test {
  code: string;
  created_at: string;
  deleted_at: string;
  id: number;
  image_id: number;
  name: string;
  sport_id: number;
  image: any;
  test_sub_type_id: number;
  test_type_id: number;
  type_valoration_code: string;
  updated_at: string;
  value: any;
  image_url: string;
  description: string;
  instruction: string;
  material: string;
  procedure: string;
  evaluation: string;
}

export interface TestType {
  id: number;
  name: string;
  code: string;
  image: any;
  image_url: string;
  sub_types: any[];
}

export interface TestSubType {
  id: number;
  test_type_id: number;
  name: string;
  code: string;
  image: any;
  image_url: string;
}

export interface Question {
  id: number;
  name: string;
  question_category: { name: string };
  question_category_code: number;
  is_configuration_question: boolean;
  field_type: any;
  required: boolean;
  unit?: { code?: string; abbreviation?: string };
}

export interface QuestionTest {
  id: number;
  name: string;
  code: string;
  responses: any[];
  question: Question;
}

export interface Unit {
  id: number;
  name: string;
  code: string;
}

export interface RFDTest {
  id?: number;
  image?: any;
  question_test: any[];
  previous_application: { answers: any[] };
  responses: any;
  code: string;
}

export interface TestResult {
  answers: any[];
  applicable: {
    age: number;
    agents: string;
    alias: string;
    bmi: string;
    date_birth: string;
    email: string;
    full_name: string;
    gender: { id: number; code: string };
    gender_id: number;
    heart_rate: string;
    height: string;
    id: number;
    image_id: any;
    laterality: { id: number; code: string };
    laterality_id: number;
    max_heart_rate: number;
    performance_assessment: any;
    position_id: number;
    position_spec_id: any;
    shirt_number: number;
    team_id: number;
    user_id: any;
    weight: string;
  };
  applicable_id: number;
  applicable_type: string;
  applicant: {
    age: number;
    agents: string;
    alias: string;
    bmi: string;
    date_birth: string;
    email: string;
    full_name: string;
    gender: { id: number; code: string };
    gender_id: number;
    heart_rate: string;
    image: string;
    height: string;
    id: number;
    image_id: any;
    laterality: { id: number; code: string };
    laterality_id: number;
    max_heart_rate: number;
    performance_assessment: any;
    position_id: number;
    position_spec_id: any;
    shirt_number: number;
    team_id: number;
    user_id: any;
    weight: string;
  };
  applicant_id: number;
  applicant_type: string;
  average: any;
  chart_order: any;
  code: string;
  date_application: string;
  id: number;
  median: any;
  professional_direct: any;
  professional_directs_id: any;
  result: any;
  score: any;
  test_id: number;
}
