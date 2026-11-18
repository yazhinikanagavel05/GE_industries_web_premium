import { CartItem } from './cart';

export interface CustomerDetails {
  name: string;
  email: string;
  phone: string;
}

export interface ShippingAddress {
  street: string;
  apartment?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  landmark?: string;
}

export type PaymentMethod = 'demo_online' | 'demo_cod' | 'demo_bank_transfer' | 'razorpay_test';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type FulfilmentStatus = 'unfulfilled' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  order_number: string;
  customer: CustomerDetails;
  shipping_address: ShippingAddress;
  billing_address?: ShippingAddress;
  same_as_shipping: boolean;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  fulfilment_status: FulfilmentStatus;
  is_demo: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
}
