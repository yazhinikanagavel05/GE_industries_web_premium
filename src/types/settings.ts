export interface SiteSettings {
  company_name: string;
  tagline: string;
  supporting_headline: string;
  phone_primary: string;
  phone_secondary: string;
  email: string;
  address: string;
  gstin: string;
  announcement_bar: {
    enabled: boolean;
    text: string;
    link_text?: string;
    link_url?: string;
  };
  hero_content: {
    headline: string;
    supporting_headline: string;
    description: string;
    primary_cta_text: string;
    primary_cta_link: string;
    secondary_cta_text: string;
    secondary_cta_link: string;
  };
  brand_story: {
    title: string;
    paragraphs: string[];
    vision: string;
    mission: string;
  };
  ecommerce: {
    currency: string;
    currency_symbol: string;
    tax_rate_percentage: number; // 18% standard GST
    free_shipping_threshold: number; // e.g., 25000
    shipping_flat_rate: number; // e.g., 1200 for heavy gym equipment
    demo_mode_enabled: boolean;
    razorpay_enabled: boolean;
    razorpay_key_id?: string;
  };
  contact: {
    hours: string;
    map_query: string;
  };
}
