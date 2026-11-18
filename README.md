# GE Industries — Animated Gym Equipment E-Commerce Platform
> **"Your Strength. Our Engineering."**  
> Built for Home Gyms. Made for Commercial Fitness.  
> Karur, Tamil Nadu, India.

---

## 🏋️‍♂️ Project Overview
A complete, premium, responsive, animated e-commerce platform custom-engineered for **GE Industries**, a gym equipment manufacturing enterprise based in **Karur, Tamil Nadu**.

This platform is architected with a **dual-mode operational system**:
1. **Interactive Demo Mode (Active Out-of-the-Box):** Preloaded with 4 illustrative demo products, seed categories, simulated checkout flow, bulk quotation registry, and an authorized Admin Dashboard with live local persistence.
2. **Production Ready Mode:** Seamlessly transitions to live factory inventory, real Supabase PostgreSQL data persistence, and Razorpay merchant payments without code refactoring.

---

## 🎨 Brand Identity & Design Direction
- **Manufacturing Aesthetic:** Industrial steel framing, precision chamfers, laser-cut hole patterns, clean white backgrounds contrasted by deep navy sections.
- **Brand Palette:**
  - **Deep Navy Blue:** `#102650` (Primary brand foundation)
  - **Royal Blue:** `#1D4F91` (Secondary structural accents)
  - **Bright Blue Accent:** `#1685F8` (Interactive buttons, focus states, highlights)
  - **Charcoal:** `#222831` & **Steel Grey:** `#8A929E` (Technical text & specs)
  - **Light Grey:** `#F3F5F8` & **White:** `#FFFFFF` (Clean backdrop)
- **Typography:**
  - Display / Headings: `Barlow Condensed` / `Oswald` (Bold, uppercase industrial stance)
  - Body & UI: `Inter` (High-legibility modern sans-serif)
  - Specs & SKU: `JetBrains Mono`
- **Motion Design:** Framer Motion scroll reveals, hero entrance sequences, interactive zoom lenses on equipment galleries, slide-in cart drawer, and celebratory order confetti.

---

## 📦 Demo Product Catalogue (4 Core Manufactured Models)
All 4 models feature studio photography, detailed dimensional specifications, and are marked with an editable `is_demo: true` badge:

1. **GE Power Rack PR-01**
   - **Category:** Strength Training Equipment
   - **Demo Price:** ₹18,999 (Intro Offer / MRP: ₹22,499)
   - **Specifications:** Mild steel structural tubing (60 × 60 mm, 2.5 mm wall gauge), 120 × 120 × 210 cm, 250 kg tested load rating, multi-grip knurled pull-up bar, solid pin-pipe safeties, J-cups with protective inserts.
2. **GE Adjustable Workout Bench AB-02**
   - **Category:** Workout Benches
   - **Demo Price:** ₹6,499 (MRP: ₹7,999)
   - **Specifications:** Reinforced mild steel box tubing, 6 backrest positions (0° to 85°), 3 seat angles, 125 × 55 × 45 cm, 250 kg capacity, rear transport wheels with front grab handle.
3. **GE Dumbbell Storage Rack DR-03**
   - **Category:** Free Weights & Accessories
   - **Demo Price:** ₹8,999 (MRP: ₹10,499)
   - **Specifications:** 3-tier angled trays, heavy-gauge mild steel, 120 × 50 × 90 cm, 200 kg distributed load capacity, holds 10–12 pairs of dumbbells, anti-slip rubber floor bumpers.
4. **GE Compact Squat Stand SS-04**
   - **Category:** Home Gym Equipment
   - **Demo Price:** ₹9,499 (MRP: ₹11,999)
   - **Specifications:** Compact space-saving dual uprights, 5 height positions (100 to 150 cm), 60 × 55 × 150 cm, 150 kg load rating, integrated 25 cm safety spotter catch arms.

---

## 🚀 Key Features & Routes

| Route | Page / Function | Features |
|---|---|---|
| `/` | **Home** | Full-width animated hero, authentic metrics, featured products, category exploration, home gym section, commercial bulk quote CTA, brochure brand story, footer. |
| `/shop` | **Shop All Products** | Live search, category tabs, price & name sorting, In-Stock filter, responsive card grid. |
| `/product/:slug` | **Product Details** | Interactive hover-zoom gallery, specification table, variant selector, quantity stepper, Add to Cart, Buy Now, bulk quote modal trigger. |
| `/cart` | **Cart & Drawer** | Slide-out cart drawer + full cart page, free shipping progress indicator (₹30,000 threshold), 18% GST calculation, quantity steppers. |
| `/checkout` | **Simulated Checkout** | Comprehensive Indian customer details, 6-digit PIN code validation, Indian states selector, simulated online payment / COD / bank transfer modes. |
| `/order-confirmation/:id` | **Order Confirmation** | Official invoice with order number (`GE-ORD-2026-XXXX`), fulfillment tracker, celebratory confetti, print invoice action. |
| `/home-gym` | **Home Gym Solutions** | Space-saving layouts, apartment training advice, recommended compact equipment. |
| `/commercial` | **Commercial & Wholesale** | Dedicated bulk quotation form for gym owners, dealers, and fitness centers, factory benefits. |
| `/about` | **About GE Industries** | Company profile, vision, mission, and 5 core manufacturing values from brochure. |
| `/contact` | **Contact Factory** | Address in Karur, phone numbers, direct email, interactive contact form. |
| `/faq` | **Frequently Asked Questions** | Accordion covering steel fabrication, powder coating, logistics, custom sizes, warranty. |
| `/shipping-policy` | **Shipping Policy** | Details on palletized road freight transit times, dispatch from Karur, Tamil Nadu. |
| `/returns-policy` | **Returns & Refunds** | 7-day transit damage inspection, parts replacement, warranty claims. |
| `/admin/login` | **Admin Portal Login** | Secure authentication with brute-force lockout protection and autofill demo helper. |
| `/admin` | **Admin Control Panel** | Overview metrics, Product CRUD (specs, prices, stock, image replacement), Orders ledger with status updates & CSV export, Commercial Enquiries manager with internal notes & CSV export, CMS Site Content editor, and 1-Click Demo Reset. |

---

## 🛠️ Technology Stack
- **Framework:** React 19 with TypeScript & Vite
- **Styling:** Tailwind CSS with custom industrial color extensions & typography
- **Motion & Interaction:** Framer Motion animations & canvas-confetti
- **Icons:** Lucide React
- **Routing:** React Router DOM (v7/v6 with scroll restoration)
- **Database / Backend Support:** Supabase PostgreSQL Client (`@supabase/supabase-js`) + LocalStorage mock fallback
- **Assets:** Official GE Industries brochure assets, logo extracts, and high-resolution commercial studio product renders

---

## 💻 Quick Start & Local Execution

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

### 3. Production Build
```bash
npm run build
npm run preview
```

---

## 🔐 Admin Dashboard Access
- **URL:** `/admin` or `/admin/login`
- **Default Email:** `admin@geindustries.com`
- **Default Password:** `geindustries2026`
*(Credentials can be configured via environment variables in `.env`)*

### In the Admin Dashboard, the factory owner can:
1. **Replace Demo Products:** Click on any product (e.g., PR-01) to update the name, upload/replace image paths, change prices, update mild steel gauge specs, or uncheck the "Demo Concept" box once approved.
2. **Add New Products:** Click **"+ Add New Manufactured Model"** to add equipment without modifying code.
3. **Track Commercial Quotes:** Review incoming gym owner inquiries, update status (*New*, *In Review*, *Contacted*, *Quoted*, *Closed*), add internal sales notes, and download Excel/CSV reports.
4. **Manage Orders:** Update fulfillment (*Processing*, *Shipped*, *Delivered*) and view itemized invoices.
5. **Update Website Content:** Edit the top announcement bar, hero headlines, phone numbers, GSTIN, and freight shipping rates directly from the browser.
6. **Reset Seed Data:** Revert the catalog and orders back to the initial brochure state with one click.

---

## 🗄️ Supabase PostgreSQL Setup (Optional)
To connect a cloud PostgreSQL database:
1. Create a project on [Supabase](https://supabase.com).
2. Run the SQL script located in `supabase/schema.sql` in the Supabase SQL Editor.
3. Add your credentials to `.env`:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```
4. Restart Vite. The application will automatically synchronize products, orders, enquiries, and settings with Supabase.

---

## 📋 Checklist for Real-World Commercial Launch
When GE Industries is ready to transition from demo mode to full commercial operations:
- [ ] Provide factory-verified prices and confirmed load test certificates for each model.
- [ ] Replace demo images with high-resolution studio photographs of manufactured units.
- [ ] Provide Razorpay Live Merchant Key ID and Secret Key for online credit card/UPI transactions.
- [ ] Connect company domain (e.g. `geindustries.in`) and SSL certificate.
- [ ] Connect logistics road transport API for automated tracking numbers (e.g., V-Trans, TCI Freight, or Delhivery Heavy).
- [ ] Set `demo_mode_enabled: false` in the Admin Dashboard Settings to remove all demo watermarks across the store.

---

## 🏢 Factory Contact Details
- **Company Name:** GE Industries
- **Tagline:** *Your Strength. Our Engineering.*
- **Address:** No. 2/159/A, Appipalayam Road, AK Pudhu Nagar, AK Bharathi Nagar, Karuppampalayam, Karur – 639003, Tamil Nadu, India.
- **Phone:** +91 87789 13412 / +91 93842 33229
- **Email:** geindustries3@gmail.com
- **GSTIN:** 33DEZPB5659Q2ZG
