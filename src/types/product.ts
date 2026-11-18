export interface ProductSpecification {
  [key: string]: string;
}

export interface ProductVariantOption {
  label: string;
  value: string;
  price_adjustment?: number;
}

export interface ProductVariant {
  id: string;
  name: string; // e.g., "Frame Finish" or "J-Cup Style"
  options: ProductVariantOption[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  model: string;
  description: string;
  short_description: string;
  category_id: string;
  price: number;
  sale_price?: number;
  images: string[];
  specifications: ProductSpecification;
  variants?: ProductVariant[];
  stock_quantity: number;
  availability: 'in_stock' | 'made_to_order' | 'out_of_stock';
  warranty: string;
  is_demo: boolean;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image?: string;
  is_active: boolean;
}
