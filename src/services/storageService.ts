import { Product, Category } from '../types/product';
import { Order, FulfilmentStatus, PaymentStatus } from '../types/order';
import { BulkEnquiry, EnquiryStatus } from '../types/enquiry';
import { SiteSettings } from '../types/settings';
import {
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_SETTINGS,
  INITIAL_ORDERS,
  INITIAL_ENQUIRIES,
} from './seedData';
import { supabase, isSupabaseConfigured } from './supabaseClient';
import { verifyAdminSession, AdminRole } from '../context/AdminAuthContext';

const STORAGE_KEYS = {
  PRODUCTS: 'ge_ind_products_v2',
  CATEGORIES: 'ge_ind_categories_v2',
  ORDERS: 'ge_ind_orders_v2',
  ENQUIRIES: 'ge_ind_enquiries_v2',
  SETTINGS: 'ge_ind_settings_v1',
  CART: 'ge_ind_cart_v1',
  ADMIN_AUTH: 'ge_ind_admin_auth_v1',
};

/**
 * Backend Data-Layer Security Enforcer:
 * Validates administrative session token and role clearance before permitting privileged mutations.
 */
function requireAdminClearance(actionDescription: string, requiredRole?: AdminRole): void {
  const auth = verifyAdminSession();
  if (!auth.authorized) {
    const reason = auth.error || 'Administrator credentials required';
    throw new Error(`403 Forbidden: Security clearance denied for [${actionDescription}]. ${reason}`);
  }

  if (requiredRole && auth.role !== requiredRole && auth.role !== 'superadmin') {
    throw new Error(
      `403 Forbidden: Elevated clearance tier (${requiredRole}) required for [${actionDescription}]. Current tier: ${auth.role}`
    );
  }
}

// ==========================================
// PRODUCTS (Public Read, Admin Write/Delete)
// ==========================================
export async function getProducts(): Promise<Product[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('products').select('*');
      if (!error && data && data.length > 0) return data as Product[];
    } catch (e) {
      console.warn('Supabase fetch failed, falling back to local storage', e);
    }
  }

  const stored = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
  if (!stored) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    return INITIAL_PRODUCTS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_PRODUCTS;
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await getProducts();
  return products.find((p) => p.slug === slug) || null;
}

export async function getProductById(id: string): Promise<Product | null> {
  const products = await getProducts();
  return products.find((p) => p.id === id) || null;
}

export async function saveProduct(product: Product): Promise<Product> {
  // Authorization validation
  requireAdminClearance('Save/Update Product Catalogue');

  const products = await getProducts();
  const existingIdx = products.findIndex((p) => p.id === product.id);
  const now = new Date().toISOString();

  let updatedProduct: Product;
  let updatedList: Product[];

  if (existingIdx >= 0) {
    updatedProduct = { ...product, updated_at: now };
    updatedList = [...products];
    updatedList[existingIdx] = updatedProduct;
  } else {
    updatedProduct = {
      ...product,
      id: product.id || `prod_${Date.now()}`,
      created_at: now,
      updated_at: now,
    };
    updatedList = [updatedProduct, ...products];
  }

  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updatedList));

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('products').upsert(updatedProduct);
    } catch (e) {
      console.error('Failed to sync product to Supabase', e);
    }
  }

  return updatedProduct;
}

export async function deleteProduct(id: string): Promise<boolean> {
  // Authorization validation
  requireAdminClearance('Delete Product From Catalogue');

  const products = await getProducts();
  const filtered = products.filter((p) => p.id !== id);
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(filtered));

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('products').delete().eq('id', id);
    } catch (e) {
      console.error('Failed to delete product from Supabase', e);
    }
  }

  return true;
}

// ==========================================
// CATEGORIES (Public Read, Admin Write)
// ==========================================
export async function getCategories(): Promise<Category[]> {
  const stored = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
  if (!stored) {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
    return INITIAL_CATEGORIES;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_CATEGORIES;
  }
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const categories = await getCategories();
  return categories.find((c) => c.slug === slug) || null;
}

// ==========================================
// ORDERS
// Public: Can insert order (createOrder) and read own receipt (getOrderByNumber)
// Admin: Can view all orders (getOrders) and update fulfilment (updateOrderStatus)
// ==========================================
export async function getOrders(): Promise<Order[]> {
  // Security check: Only authenticated admins can browse all customer orders
  const auth = verifyAdminSession();
  if (!auth.authorized) {
    return [];
  }

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) return data as Order[];
    } catch (e) {
      console.warn('Supabase fetch failed, falling back to local storage', e);
    }
  }

  const stored = localStorage.getItem(STORAGE_KEYS.ORDERS);
  if (!stored) {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
    return INITIAL_ORDERS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_ORDERS;
  }
}

export async function getOrderByNumber(orderNumber: string): Promise<Order | null> {
  const clean = orderNumber.trim().toUpperCase();

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .ilike('order_number', clean)
        .maybeSingle();
      if (!error && data) return data as Order;
    } catch (e) {
      console.warn('Supabase order lookup failed, using local fallback', e);
    }
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.ORDERS);
    if (stored) {
      const orders: Order[] = JSON.parse(stored);
      const found = orders.find((o) => o.order_number.toUpperCase() === clean);
      if (found) return found;
    }
  } catch {
    // fallback
  }

  return INITIAL_ORDERS.find((o) => o.order_number.toUpperCase() === clean) || null;
}

export async function createOrder(
  orderInput: Omit<Order, 'id' | 'order_number' | 'created_at' | 'updated_at'>
): Promise<Order> {
  const now = new Date();
  const timestampStr = now.toISOString();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const orderNumber = `GE-ORD-${now.getFullYear()}-${randomSuffix}`;
  const id = `ord_${Date.now()}_${randomSuffix}`;

  const newOrder: Order = {
    ...orderInput,
    id,
    order_number: orderNumber,
    created_at: timestampStr,
    updated_at: timestampStr,
  };

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.ORDERS);
    const existingOrders: Order[] = stored ? JSON.parse(stored) : INITIAL_ORDERS;
    const updatedOrders = [newOrder, ...existingOrders];
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updatedOrders));
  } catch (e) {
    console.error('Failed to store order locally', e);
  }

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('orders').insert(newOrder);
    } catch (e) {
      console.error('Failed to sync order to Supabase', e);
    }
  }

  return newOrder;
}

export async function updateOrderStatus(
  orderId: string,
  fulfilment_status: FulfilmentStatus,
  payment_status: PaymentStatus,
  notes?: string
): Promise<Order | null> {
  // Authorization validation
  requireAdminClearance('Update Order Status & Fulfilment');

  let orders: Order[] = [];
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.ORDERS);
    orders = stored ? JSON.parse(stored) : INITIAL_ORDERS;
  } catch {
    orders = INITIAL_ORDERS;
  }

  const index = orders.findIndex((o) => o.id === orderId);
  if (index === -1) return null;

  const updated: Order = {
    ...orders[index],
    fulfilment_status,
    payment_status,
    notes: notes !== undefined ? notes : orders[index].notes,
    updated_at: new Date().toISOString(),
  };

  orders[index] = updated;
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase
        .from('orders')
        .update({
          fulfilment_status,
          payment_status,
          notes: updated.notes,
          updated_at: updated.updated_at,
        })
        .eq('id', orderId);
    } catch (e) {
      console.error('Failed to update order in Supabase', e);
    }
  }

  return updated;
}

// ==========================================
// ENQUIRIES (Bulk & Commercial)
// Public: Can insert enquiry (createEnquiry)
// Admin: Can view all enquiries (getEnquiries) and update status (updateEnquiryStatus)
// ==========================================
export async function getEnquiries(): Promise<BulkEnquiry[]> {
  // Security check: Only authenticated admins can browse commercial enquiries
  const auth = verifyAdminSession();
  if (!auth.authorized) {
    return [];
  }

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('enquiries')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) return data as BulkEnquiry[];
    } catch (e) {
      console.warn('Supabase fetch failed, falling back to local storage', e);
    }
  }

  const stored = localStorage.getItem(STORAGE_KEYS.ENQUIRIES);
  if (!stored) {
    localStorage.setItem(STORAGE_KEYS.ENQUIRIES, JSON.stringify(INITIAL_ENQUIRIES));
    return INITIAL_ENQUIRIES;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_ENQUIRIES;
  }
}

export async function createEnquiry(
  enquiryInput: Omit<BulkEnquiry, 'id' | 'status' | 'created_at' | 'updated_at'>
): Promise<BulkEnquiry> {
  const now = new Date().toISOString();
  const id = `enq_${Date.now()}`;

  const newEnquiry: BulkEnquiry = {
    ...enquiryInput,
    id,
    status: 'new',
    created_at: now,
    updated_at: now,
  };

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.ENQUIRIES);
    const existing: BulkEnquiry[] = stored ? JSON.parse(stored) : INITIAL_ENQUIRIES;
    const updatedEnquiries = [newEnquiry, ...existing];
    localStorage.setItem(STORAGE_KEYS.ENQUIRIES, JSON.stringify(updatedEnquiries));
  } catch (e) {
    console.error('Failed to store enquiry locally', e);
  }

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('enquiries').insert(newEnquiry);
    } catch (e) {
      console.error('Failed to sync enquiry to Supabase', e);
    }
  }

  return newEnquiry;
}

export async function updateEnquiryStatus(
  enquiryId: string,
  status: EnquiryStatus,
  internalNotes?: string
): Promise<BulkEnquiry | null> {
  // Authorization validation
  requireAdminClearance('Update Commercial Enquiry Status');

  let enquiries: BulkEnquiry[] = [];
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.ENQUIRIES);
    enquiries = stored ? JSON.parse(stored) : INITIAL_ENQUIRIES;
  } catch {
    enquiries = INITIAL_ENQUIRIES;
  }

  const index = enquiries.findIndex((e) => e.id === enquiryId);
  if (index === -1) return null;

  const updated: BulkEnquiry = {
    ...enquiries[index],
    status,
    internal_notes: internalNotes !== undefined ? internalNotes : enquiries[index].internal_notes,
    updated_at: new Date().toISOString(),
  };

  enquiries[index] = updated;
  localStorage.setItem(STORAGE_KEYS.ENQUIRIES, JSON.stringify(enquiries));

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase
        .from('enquiries')
        .update({
          status,
          internal_notes: updated.internal_notes,
          updated_at: updated.updated_at,
        })
        .eq('id', enquiryId);
    } catch (e) {
      console.error('Failed to update enquiry in Supabase', e);
    }
  }

  return updated;
}

// ==========================================
// SITE SETTINGS (Public Read, Admin Write)
// ==========================================
export async function getSettings(): Promise<SiteSettings> {
  const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
  if (!stored) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
    return INITIAL_SETTINGS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_SETTINGS;
  }
}

export async function saveSettings(settings: SiteSettings): Promise<SiteSettings> {
  // Authorization validation
  requireAdminClearance('Save Factory Site Settings');

  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase
        .from('site_settings')
        .upsert({ id: 'default', settings, updated_at: new Date().toISOString() });
    } catch (e) {
      console.error('Failed to sync settings to Supabase', e);
    }
  }

  return settings;
}

// ==========================================
// RESET DEMO SEED (Strict Superadmin Only)
// ==========================================
export function resetToDemoSeed(): void {
  // Strict superadmin authorization required
  requireAdminClearance('Reset Database to Factory Initial Seed', 'superadmin');

  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
  localStorage.setItem(STORAGE_KEYS.ENQUIRIES, JSON.stringify(INITIAL_ENQUIRIES));
}
