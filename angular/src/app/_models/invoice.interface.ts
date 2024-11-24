export interface InvoiceInterface {
  id: number;
  description: string;
  invoice_stripe_id: string;
  invoice_number: string;
  code: string;
  amount: string;
  status: string;
  invoice_pdf_url: string;
  user_id: number;
  subscription_id: number;
  subtotal: string;
  tax: string;
  created_at: Date;
  updated_at: Date;
  total: number;
}
