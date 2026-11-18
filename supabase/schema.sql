-- ====================================================================
-- GE Industries — PostgreSQL Database Schema for Supabase
-- Gym Equipment Manufacturing E-Commerce
-- Karur, Tamil Nadu, India
-- Hardened Security & Role-Based Access Control (RBAC) Specification
-- ====================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ====================================================================
-- 1. CATEGORIES TABLE
-- ====================================================================
CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY DEFAULT 'cat_' || substring(uuid_generate_v4()::text, 1, 8),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    image TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- 2. PRODUCTS TABLE
-- ====================================================================
CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY DEFAULT 'prod_' || substring(uuid_generate_v4()::text, 1, 8),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    sku TEXT NOT NULL UNIQUE,
    model TEXT NOT NULL,
    short_description TEXT NOT NULL,
    description TEXT NOT NULL,
    category_id TEXT REFERENCES categories(id) ON DELETE SET NULL,
    price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
    sale_price NUMERIC(12, 2) CHECK (sale_price IS NULL OR sale_price >= 0),
    images TEXT[] NOT NULL DEFAULT '{}',
    specifications JSONB NOT NULL DEFAULT '{}'::jsonb,
    variants JSONB DEFAULT '[]'::jsonb,
    stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    availability TEXT NOT NULL DEFAULT 'in_stock' CHECK (availability IN ('in_stock', 'made_to_order', 'out_of_stock')),
    warranty TEXT DEFAULT '1 Year Structural Warranty',
    is_demo BOOLEAN NOT NULL DEFAULT TRUE,
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- 3. CUSTOMERS TABLE
-- ====================================================================
CREATE TABLE IF NOT EXISTS customers (
    id TEXT PRIMARY KEY DEFAULT 'cust_' || substring(uuid_generate_v4()::text, 1, 8),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- 4. ORDERS TABLE
-- ====================================================================
CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY DEFAULT 'ord_' || substring(uuid_generate_v4()::text, 1, 8),
    order_number TEXT NOT NULL UNIQUE,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    shipping_street TEXT NOT NULL,
    shipping_apartment TEXT,
    shipping_city TEXT NOT NULL,
    shipping_state TEXT NOT NULL,
    shipping_pincode TEXT NOT NULL,
    shipping_country TEXT NOT NULL DEFAULT 'India',
    billing_address JSONB,
    same_as_shipping BOOLEAN DEFAULT TRUE,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    subtotal NUMERIC(12, 2) NOT NULL CHECK (subtotal >= 0),
    shipping NUMERIC(12, 2) NOT NULL DEFAULT 0,
    tax NUMERIC(12, 2) NOT NULL DEFAULT 0,
    discount NUMERIC(12, 2) NOT NULL DEFAULT 0,
    total NUMERIC(12, 2) NOT NULL CHECK (total >= 0),
    payment_method TEXT NOT NULL,
    payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    fulfilment_status TEXT NOT NULL DEFAULT 'unfulfilled' CHECK (fulfilment_status IN ('unfulfilled', 'processing', 'shipped', 'delivered', 'cancelled')),
    is_demo BOOLEAN NOT NULL DEFAULT TRUE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- 5. ORDER ITEMS TABLE (NORMALIZED SNAPSHOT)
-- ====================================================================
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id TEXT REFERENCES products(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    sku TEXT NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(12, 2) NOT NULL CHECK (unit_price >= 0),
    line_total NUMERIC(12, 2) NOT NULL CHECK (line_total >= 0)
);

-- ====================================================================
-- 6. ENQUIRIES TABLE (BULK & COMMERCIAL)
-- ====================================================================
CREATE TABLE IF NOT EXISTS enquiries (
    id TEXT PRIMARY KEY DEFAULT 'enq_' || substring(uuid_generate_v4()::text, 1, 8),
    full_name TEXT NOT NULL,
    company_name TEXT,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    requirement_type TEXT NOT NULL,
    products_of_interest TEXT[] DEFAULT '{}',
    estimated_quantity TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in_review', 'contacted', 'quoted', 'closed')),
    internal_notes TEXT,
    is_demo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- 7. SITE SETTINGS TABLE
-- ====================================================================
CREATE TABLE IF NOT EXISTS site_settings (
    id TEXT PRIMARY KEY DEFAULT 'default',
    settings JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- 8. AUTHORIZED ADMINISTRATORS TABLE (RBAC)
-- Note: Public registration is strictly disabled.
-- Accounts must be provisioned securely by the factory owner or CLI.
-- ====================================================================
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL CHECK (role IN ('superadmin', 'manager')),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- INDEXES FOR FAST SEARCH & FILTERING
-- ====================================================================
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_is_demo ON products(is_demo);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(fulfilment_status);
CREATE INDEX IF NOT EXISTS idx_enquiries_status ON enquiries(status);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);

-- ====================================================================
-- SECURITY DEFINER AUTHORIZATION FUNCTIONS
-- Validated directly inside PostgreSQL against trusted admin_users table
-- ====================================================================
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM admin_users
        WHERE id = auth.uid()
        AND is_active = TRUE
        AND role IN ('superadmin', 'manager')
    );
END;
$$;

CREATE OR REPLACE FUNCTION is_superadmin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM admin_users
        WHERE id = auth.uid()
        AND is_active = TRUE
        AND role = 'superadmin'
    );
END;
$$;

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- CATEGORIES: Public can view active categories; Admins can manage
CREATE POLICY "Public can view active categories" ON categories 
    FOR SELECT USING (is_active = true OR is_admin());

CREATE POLICY "Admins can insert categories" ON categories 
    FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "Admins can update categories" ON categories 
    FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "Admins can delete categories" ON categories 
    FOR DELETE USING (is_admin());

-- PRODUCTS: Public can view published products; Admins can manage
CREATE POLICY "Public can view published products" ON products 
    FOR SELECT USING (is_published = true OR is_admin());

CREATE POLICY "Admins can insert products" ON products 
    FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "Admins can update products" ON products 
    FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "Admins can delete products" ON products 
    FOR DELETE USING (is_admin());

-- ORDERS: Public can create orders (guest checkout); Admins can view and manage
CREATE POLICY "Public can submit orders" ON orders 
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view orders" ON orders 
    FOR SELECT USING (is_admin());

CREATE POLICY "Admins can update orders" ON orders 
    FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "Superadmin can delete orders" ON orders 
    FOR DELETE USING (is_superadmin());

-- ENQUIRIES: Public can submit enquiries; Admins can view and manage
CREATE POLICY "Public can submit enquiries" ON enquiries 
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view enquiries" ON enquiries 
    FOR SELECT USING (is_admin());

CREATE POLICY "Admins can update enquiries" ON enquiries 
    FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "Superadmin can delete enquiries" ON enquiries 
    FOR DELETE USING (is_superadmin());

-- SITE SETTINGS: Public can view; Only admins can update
CREATE POLICY "Public can view site settings" ON site_settings 
    FOR SELECT USING (true);

CREATE POLICY "Admins can update site settings" ON site_settings 
    FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- ADMIN USERS: No public access; Admins can view own role; Superadmin can manage
CREATE POLICY "Admins can view own role" ON admin_users 
    FOR SELECT USING (id = auth.uid());

CREATE POLICY "Superadmin can manage admin_users" ON admin_users 
    FOR ALL USING (is_superadmin()) WITH CHECK (is_superadmin());

-- ====================================================================
-- PROVISIONING INITIAL OWNER ACCOUNT (NO PUBLIC SIGNUP)
-- Run via Supabase SQL Editor or migration to provision the initial superadmin:
-- 1. Create auth user in Supabase Authentication tab:
--    Email: admin@geindustries.com
-- 2. Link UUID to admin_users table:
--    INSERT INTO admin_users (id, email, role, is_active)
--    SELECT id, email, 'superadmin', true 
--    FROM auth.users 
--    WHERE email = 'admin@geindustries.com'
--    ON CONFLICT (id) DO NOTHING;
-- ====================================================================
