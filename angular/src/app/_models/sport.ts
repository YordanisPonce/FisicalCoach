export interface Sport {
  id: number;
  code: string;
  model_url: string;
  field_image: string;
  name: string;
  image: {
    full_url: string;
  };
  image_exercise: {
    id: number;
    full_url: string;
  };
}
