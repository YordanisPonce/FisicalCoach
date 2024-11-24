export interface Subscription {
  amount: number;
  ends_at: string;
  id: number;
  interval: string;
  items: any;
  name: string;
  package_code: string;
  code: string;
  package_name: string;
  package_price: any;
  package_price_id: number;
  package_price_name: string;
  quantity: number;
  stripe_id: string;
  stripe_plan: string;
  stripe_status: string;
  subpackage_name: string;
  trial_ends_at: string;
  user_id: number;
  subpackages: SubPackage[];
}

export interface SubPackage {
  id?: number;
  code?: string;
  package_id?: number;
  name?: string;
  attributes?: AttributesData[];
  prices?: Price[];
}

export interface AttributesData {
  id?: number;
  code?: string;
  name?: string;
  subpackages?: SubPackage[];
  pivot?: Pivot;
}

export interface Price {
  id?: number;
  subpackage_id?: number;
  code?: string;
  name?: string;
  min_licenses?: number;
  max_licenses?: number;
  month?: string;
  year?: string;
}


export interface Pivot {
  subpackage_id?: number;
  attribute_id?: number;
  quantity?: null | string;
  available?: boolean;
}
