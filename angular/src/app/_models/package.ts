export interface Package {
  code: string;
  id: number;
  name: string;
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
