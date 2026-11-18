export type RequirementType = 
  | 'Home Gym' 
  | 'Commercial Gym' 
  | 'Dealer' 
  | 'Wholesale' 
  | 'Other';

export type EnquiryStatus = 'new' | 'in_review' | 'contacted' | 'quoted' | 'closed';

export interface BulkEnquiry {
  id: string;
  full_name: string;
  company_name?: string;
  phone: string;
  email: string;
  city: string;
  state: string;
  requirement_type: RequirementType;
  products_of_interest: string[];
  estimated_quantity: string;
  message: string;
  status: EnquiryStatus;
  internal_notes?: string;
  is_demo: boolean;
  created_at: string;
  updated_at: string;
}
