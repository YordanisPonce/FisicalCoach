
export interface PaymentMethod {
  id:              string;
  object:          string;
  billing_details: BillingDetails;
  card:            Card;
  created:         number;
  customer:        string;
  livemode:        boolean;
  metadata:        any[];
  type:            string;
}

export interface BillingDetails {
  address: Address;
  email:   null;
  name:    null;
  phone:   null;
}

export interface Address {
  city:        null;
  country:     null;
  line1:       null;
  line2:       null;
  postal_code: null;
  state:       null;
}

export interface Card {
  brand:                string;
  checks:               Checks;
  country:              string;
  exp_month:            number;
  exp_year:             number;
  fingerprint:          string;
  funding:              string;
  generated_from:       null;
  last4:                string;
  networks:             Networks;
  three_d_secure_usage: ThreeDSecureUsage;
  wallet:               null;
}

export interface Checks {
  address_line1_check:       null;
  address_postal_code_check: null;
  cvc_check:                 string;
}

export interface Networks {
  available: string[];
  preferred: null;
}

export interface ThreeDSecureUsage {
  supported: boolean;
}
