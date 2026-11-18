import { Product } from './product';

export interface CartItem {
  id: string; // unique item id (product_id + variant selection)
  product_id: string;
  product: Product;
  quantity: number;
  selected_variant?: {
    variant_name: string;
    option_label: string;
    price_adjustment: number;
  };
  unit_price: number;
  line_total: number;
}

export interface CartState {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  total_items: number;
}
