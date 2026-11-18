import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  Settings, 
  LogOut, 
  Plus, 
  Edit2, 
  Trash2, 
  Search, 
  Download, 
  CheckCircle, 
  AlertTriangle, 
  Eye, 
  RotateCcw, 
  X, 
  Save, 
  ExternalLink,
  Shield,
  FileText,
  Clock,
  ArrowUpRight
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { Product } from '../../types/product';
import { FulfilmentStatus, Order, PaymentStatus } from '../../types/order';
import { BulkEnquiry, EnquiryStatus } from '../../types/enquiry';
import { SiteSettings } from '../../types/settings';

export const AdminDashboardPage: React.FC = () => {
  const { 
    products, 
    categories, 
    orders, 
    enquiries, 
    settings, 
    refreshOrders,
    refreshEnquiries,
    refreshProducts,
    saveProduct, 
    deleteProduct, 
    updateOrderStatus, 
    updateEnquiryStatus, 
    saveSettings, 
    resetSeedData 
  } = useStore();

  const { adminUser, logout } = useAdminAuth();

  useEffect(() => {
    // When authorized admin mounts the dashboard, fetch privileged records
    refreshOrders();
    refreshEnquiries();
    refreshProducts();
  }, [refreshOrders, refreshEnquiries, refreshProducts]);

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'enquiries' | 'settings'>('overview');

  // Product modal state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  // Order detail modal state
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);

  // Enquiry detail modal state
  const [viewingEnquiry, setViewingEnquiry] = useState<BulkEnquiry | null>(null);

  // Search & Filters state
  const [productSearch, setProductSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [enquirySearch, setEnquirySearch] = useState('');
  const [enquiryStatusFilter, setEnquiryStatusFilter] = useState<string>('all');

  // Toast / feedback message
  const [toastMsg, setToastMsg] = useState('');

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  // ==========================================
  // EXPORT TO CSV HELPERS
  // ==========================================
  const exportOrdersCSV = () => {
    const headers = ['Order Number', 'Date', 'Customer Name', 'Phone', 'Email', 'City', 'State', 'Total (INR)', 'Payment Status', 'Fulfilment Status', 'Items Count'];
    const rows = orders.map((o) => [
      o.order_number,
      new Date(o.created_at).toLocaleDateString(),
      `"${o.customer.name}"`,
      o.customer.phone,
      o.customer.email,
      `"${o.shipping_address.city}"`,
      `"${o.shipping_address.state}"`,
      o.total,
      o.payment_status,
      o.fulfilment_status,
      o.items.length,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `GE_Industries_Orders_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast('Orders exported to CSV successfully.');
  };

  const exportEnquiriesCSV = () => {
    const headers = ['Date', 'Full Name', 'Company', 'Phone', 'Email', 'City', 'State', 'Type', 'Quantity', 'Status', 'Message'];
    const rows = enquiries.map((e) => [
      new Date(e.created_at).toLocaleDateString(),
      `"${e.full_name}"`,
      `"${e.company_name || 'N/A'}"`,
      e.phone,
      e.email,
      `"${e.city}"`,
      `"${e.state}"`,
      `"${e.requirement_type}"`,
      `"${e.estimated_quantity}"`,
      e.status,
      `"${e.message.replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `GE_Industries_Enquiries_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast('Enquiries exported to CSV successfully.');
  };

  // ==========================================
  // METRICS CALCULATIONS
  // ==========================================
  const totalRevenue = orders.reduce((sum, o) => sum + (o.payment_status === 'paid' ? o.total : 0), 0);
  const pendingOrdersCount = orders.filter((o) => o.fulfilment_status === 'processing' || o.fulfilment_status === 'unfulfilled').length;
  const newEnquiriesCount = enquiries.filter((e) => e.status === 'new').length;
  const demoProductsCount = products.filter((p) => p.is_demo).length;

  // ==========================================
  // PRODUCT EDIT / CREATE HANDLERS
  // ==========================================
  const handleOpenCreateProduct = () => {
    setEditingProduct({
      id: '',
      name: '',
      slug: '',
      sku: '',
      model: '',
      category_id: categories[0]?.id || 'cat-treadmills',
      price: 12999,
      sale_price: 15999,
      short_description: '',
      description: '',
      images: ['/images/products/manual-treadmill-white.jpg'],
      specifications: {
        'Material': 'Structural mild steel',
        'Dimensions': '115 × 53 × 112 cm',
        'Tested Load Rating': '120 kg',
      },
      stock_quantity: 10,
      availability: 'in_stock',
      warranty: '1 Year Structural Warranty',
      is_demo: false, // new products can be marked real/approved
      is_published: true,
      created_at: '',
      updated_at: '',
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct({ ...prod });
    setIsProductModalOpen(true);
  };

  const handleSaveProductForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    if (!editingProduct.name.trim()) {
      alert('Product name is required.');
      return;
    }

    const slug = editingProduct.slug || editingProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const toSave: Product = {
      ...editingProduct,
      slug,
      sku: editingProduct.sku || `GE-MOD-${Date.now().toString().slice(-4)}`,
    };

    await saveProduct(toSave);
    setIsProductModalOpen(false);
    setEditingProduct(null);
    triggerToast(`Product "${toSave.name}" saved successfully.`);
  };

  const handleDeleteProductConfirm = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}" from the catalogue?`)) {
      await deleteProduct(id);
      triggerToast(`Product "${name}" deleted.`);
    }
  };

  return (
    <div className="min-h-screen bg-[#0E1726] text-white flex flex-col">
      {/* Top Admin Header Bar */}
      <header className="bg-[#121E36] border-b border-brand-royal/30 px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2.5 group">
            <img src="/brand/logo.png" alt="GE Industries" className="h-8 w-auto" />
            <div>
              <span className="font-display font-black text-base text-white uppercase tracking-wider block">
                GE INDUSTRIES
              </span>
              <span className="text-[9px] font-mono font-bold text-brand-accent uppercase tracking-widest block">
                Factory Admin Panel
              </span>
            </div>
          </Link>
          <span className="hidden sm:inline-block px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            DEMO MODE ACTIVE
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/"
            target="_blank"
            className="hidden md:inline-flex items-center gap-1 text-xs text-steel-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/5 border border-white/10"
          >
            <span>View Live Storefront</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <div className="text-right hidden sm:block">
            <p className="text-xs font-semibold text-white">{adminUser?.email}</p>
            <p className="text-[10px] text-brand-accent uppercase font-mono tracking-wider">{adminUser?.role || 'Admin'} Clearance</p>
          </div>

          <button
            onClick={logout}
            className="p-2 text-steel-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
            title="Log out of Admin Portal"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Admin Content Layout */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar Nav */}
        <aside className="w-full md:w-64 bg-[#101B30] border-r border-brand-royal/20 p-4 flex-shrink-0 space-y-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all text-left ${
              activeTab === 'overview'
                ? 'bg-brand-royal text-white shadow-md'
                : 'text-steel-300 hover:bg-white/5 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-brand-accent" />
            <span>Overview & Metrics</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all text-left ${
              activeTab === 'products'
                ? 'bg-brand-royal text-white shadow-md'
                : 'text-steel-300 hover:bg-white/5 hover:text-white'
            }`}
          >
            <span className="flex items-center gap-3">
              <Package className="w-4 h-4 text-brand-accent" />
              <span>Products Catalog</span>
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-white">
              {products.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all text-left ${
              activeTab === 'orders'
                ? 'bg-brand-royal text-white shadow-md'
                : 'text-steel-300 hover:bg-white/5 hover:text-white'
            }`}
          >
            <span className="flex items-center gap-3">
              <ShoppingBag className="w-4 h-4 text-brand-accent" />
              <span>Orders Management</span>
            </span>
            {pendingOrdersCount > 0 && (
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500 text-brand-dark">
                {pendingOrdersCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('enquiries')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all text-left ${
              activeTab === 'enquiries'
                ? 'bg-brand-royal text-white shadow-md'
                : 'text-steel-300 hover:bg-white/5 hover:text-white'
            }`}
          >
            <span className="flex items-center gap-3">
              <Users className="w-4 h-4 text-brand-accent" />
              <span>Commercial Enquiries</span>
            </span>
            {newEnquiriesCount > 0 && (
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-white">
                {newEnquiriesCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all text-left ${
              activeTab === 'settings'
                ? 'bg-brand-royal text-white shadow-md'
                : 'text-steel-300 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Settings className="w-4 h-4 text-brand-accent" />
            <span>Site Content & CMS</span>
          </button>

          <div className="pt-6 mt-6 border-t border-white/10 space-y-2">
            <button
              onClick={async () => {
                if (window.confirm('Reset all demo products, initial orders, enquiries, and factory settings to default demo state?')) {
                  await resetSeedData();
                  triggerToast('Store reset to initial demo seeds.');
                }
              }}
              className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-amber-300 hover:bg-amber-500/10 rounded-xl transition-colors border border-amber-500/30 text-left"
            >
              <RotateCcw className="w-4 h-4 flex-shrink-0" />
              <span>Reset Demo Seed Data</span>
            </button>
          </div>
        </aside>

        {/* Content Pane */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {/* Toast Alert */}
          {toastMsg && (
            <div className="mb-6 p-4 bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 rounded-2xl flex items-center gap-2 text-xs font-medium shadow-lg animate-fadeIn">
              <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{toastMsg}</span>
            </div>
          )}

          {/* ===================================================================== */}
          {/* TAB 1: OVERVIEW & METRICS                                             */}
          {/* ===================================================================== */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div>
                <h1 className="text-2xl font-display font-black uppercase tracking-wider">
                  Factory Operations Overview
                </h1>
                <p className="text-xs text-steel-400 mt-1">
                  Key metrics, active demo orders, and commercial fitness requests for GE Industries.
                </p>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-[#14233D] border border-brand-royal/30">
                  <span className="text-[10px] font-mono font-bold uppercase text-steel-400">
                    Simulated Revenue
                  </span>
                  <p className="text-2xl font-bold font-mono text-emerald-400 mt-1">
                    ₹{totalRevenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </p>
                  <span className="text-[10px] text-steel-400 mt-1 block">From verified demo checkouts</span>
                </div>

                <div className="p-5 rounded-2xl bg-[#14233D] border border-brand-royal/30">
                  <span className="text-[10px] font-mono font-bold uppercase text-steel-400">
                    Total Orders
                  </span>
                  <p className="text-2xl font-bold font-mono text-white mt-1">
                    {orders.length}
                  </p>
                  <span className="text-[10px] text-amber-300 mt-1 block">
                    {pendingOrdersCount} pending fulfillment
                  </span>
                </div>

                <div className="p-5 rounded-2xl bg-[#14233D] border border-brand-royal/30">
                  <span className="text-[10px] font-mono font-bold uppercase text-steel-400">
                    Commercial Enquiries
                  </span>
                  <p className="text-2xl font-bold font-mono text-brand-accent mt-1">
                    {enquiries.length}
                  </p>
                  <span className="text-[10px] text-emerald-300 mt-1 block">
                    {newEnquiriesCount} new unread submissions
                  </span>
                </div>

                <div className="p-5 rounded-2xl bg-[#14233D] border border-brand-royal/30">
                  <span className="text-[10px] font-mono font-bold uppercase text-steel-400">
                    Catalogue Equipment
                  </span>
                  <p className="text-2xl font-bold font-mono text-white mt-1">
                    {products.length}
                  </p>
                  <span className="text-[10px] text-amber-400 mt-1 block">
                    {demoProductsCount} demo concepts active
                  </span>
                </div>
              </div>

              {/* Recent Orders Snapshot */}
              <div className="bg-[#14233D] rounded-2xl border border-brand-royal/30 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                    Recent Customer Orders
                  </h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs text-brand-accent hover:underline font-semibold"
                  >
                    View All Orders →
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="text-steel-400 uppercase font-mono border-b border-white/10">
                      <tr>
                        <th className="pb-3">Order Number</th>
                        <th className="pb-3">Customer</th>
                        <th className="pb-3">Location</th>
                        <th className="pb-3 text-right">Amount</th>
                        <th className="pb-3 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-medium">
                      {orders.slice(0, 5).map((ord) => (
                        <tr key={ord.id} className="hover:bg-white/5 cursor-pointer" onClick={() => { setViewingOrder(ord); setActiveTab('orders'); }}>
                          <td className="py-3 font-mono text-brand-accent font-bold">{ord.order_number}</td>
                          <td className="py-3">{ord.customer.name}</td>
                          <td className="py-3 text-steel-300">{ord.shipping_address.city}, {ord.shipping_address.state}</td>
                          <td className="py-3 text-right font-mono font-bold">₹{ord.total.toLocaleString('en-IN')}</td>
                          <td className="py-3 text-center">
                            <span className="px-2 py-0.5 rounded text-[10px] uppercase font-mono font-bold bg-brand-royal text-white">
                              {ord.fulfilment_status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Recent Commercial Enquiries Snapshot */}
              <div className="bg-[#14233D] rounded-2xl border border-brand-royal/30 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                    Recent Bulk & Commercial Inquiries
                  </h3>
                  <button
                    onClick={() => setActiveTab('enquiries')}
                    className="text-xs text-brand-accent hover:underline font-semibold"
                  >
                    Manage Enquiries →
                  </button>
                </div>

                <div className="space-y-3">
                  {enquiries.slice(0, 3).map((enq) => (
                    <div
                      key={enq.id}
                      onClick={() => { setViewingEnquiry(enq); setActiveTab('enquiries'); }}
                      className="p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 cursor-pointer transition-colors flex items-center justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">{enq.full_name}</span>
                          {enq.company_name && (
                            <span className="text-xs text-steel-400">({enq.company_name})</span>
                          )}
                          <span className="text-[10px] uppercase px-2 py-0.5 rounded bg-brand-royal/40 text-brand-accent font-mono">
                            {enq.requirement_type}
                          </span>
                        </div>
                        <p className="text-xs text-steel-300 line-clamp-1 mt-1">
                          {enq.message}
                        </p>
                      </div>
                      <span className="text-xs font-mono text-steel-400">
                        {enq.city}, {enq.state}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* TAB 2: PRODUCTS CATALOG MANAGER                                       */}
          {/* ===================================================================== */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-display font-black uppercase tracking-wider">
                    Gym Equipment Catalogue
                  </h1>
                  <p className="text-xs text-steel-400 mt-0.5">
                    Manage specifications, pricing, stock quantities, and replace demo content with real manufacturing specs.
                  </p>
                </div>

                <button
                  onClick={handleOpenCreateProduct}
                  className="px-4 py-2.5 bg-brand-royal hover:bg-brand-accent text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-colors shadow-md flex items-center gap-2 self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Manufactured Model</span>
                </button>
              </div>

              {/* Search bar */}
              <div className="relative max-w-md">
                <Search className="w-4 h-4 text-steel-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search products by model or name..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-[#14233D] text-white text-xs rounded-xl border border-steel-700 focus:outline-none focus:border-brand-accent"
                />
              </div>

              {/* Products Table */}
              <div className="bg-[#14233D] rounded-2xl border border-brand-royal/30 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="text-steel-400 uppercase font-mono border-b border-white/10 bg-white/5">
                      <tr>
                        <th className="py-3.5 px-4">Model & Name</th>
                        <th className="py-3.5 px-4">Category</th>
                        <th className="py-3.5 px-4">Price (INR)</th>
                        <th className="py-3.5 px-4">Stock</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-medium">
                      {products
                        .filter((p) =>
                          p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
                          p.model.toLowerCase().includes(productSearch.toLowerCase())
                        )
                        .map((product) => {
                          const catName = categories.find((c) => c.id === product.category_id)?.name || 'General';
                          return (
                            <tr key={product.id} className="hover:bg-white/5">
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-3">
                                  <img
                                    src={product.images[0]}
                                    alt={product.name}
                                    className="w-10 h-10 object-contain rounded bg-white p-1"
                                  />
                                  <div>
                                    <p className="font-bold text-white">{product.name}</p>
                                    <p className="text-[11px] font-mono text-steel-400">
                                      Model: {product.model} • SKU: {product.sku}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-4 text-steel-300">{catName}</td>
                              <td className="py-3 px-4 font-mono font-bold text-white">
                                ₹{product.price.toLocaleString('en-IN')}
                              </td>
                              <td className="py-3 px-4 font-mono">{product.stock_quantity} units</td>
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-1.5">
                                  {product.is_demo ? (
                                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                                      DEMO
                                    </span>
                                  ) : (
                                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                      APPROVED
                                    </span>
                                  )}
                                  {product.is_published ? (
                                    <span className="text-[10px] text-steel-400">Published</span>
                                  ) : (
                                    <span className="text-[10px] text-red-400 font-bold">Draft</span>
                                  )}
                                </div>
                              </td>
                              <td className="py-3 px-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={() => handleOpenEditProduct(product)}
                                    className="p-1.5 rounded-lg text-steel-300 hover:text-white hover:bg-white/10 transition-colors"
                                    title="Edit specifications and pricing"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteProductConfirm(product.id, product.name)}
                                    className="p-1.5 rounded-lg text-steel-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                                    title="Delete product"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* TAB 3: ORDERS MANAGEMENT                                              */}
          {/* ===================================================================== */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-display font-black uppercase tracking-wider">
                    Factory Orders Ledger
                  </h1>
                  <p className="text-xs text-steel-400 mt-0.5">
                    Track incoming equipment orders, update fulfillment and road freight dispatch statuses.
                  </p>
                </div>

                <button
                  onClick={exportOrdersCSV}
                  className="px-4 py-2.5 bg-brand-royal hover:bg-brand-accent text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-colors shadow-md flex items-center gap-2 self-start sm:self-auto"
                >
                  <Download className="w-4 h-4" />
                  <span>Export Orders (CSV)</span>
                </button>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-3 items-center">
                <div className="relative flex-1 min-w-[220px]">
                  <Search className="w-4 h-4 text-steel-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="Search by order #, customer, city..."
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-[#14233D] text-white text-xs rounded-xl border border-steel-700 focus:outline-none focus:border-brand-accent"
                  />
                </div>

                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="px-3 py-2 bg-[#14233D] text-white text-xs rounded-xl border border-steel-700 focus:outline-none focus:border-brand-accent"
                >
                  <option value="all">All Fulfillment Statuses</option>
                  <option value="processing">Processing</option>
                  <option value="unfulfilled">Unfulfilled</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* Orders Table */}
              <div className="bg-[#14233D] rounded-2xl border border-brand-royal/30 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="text-steel-400 uppercase font-mono border-b border-white/10 bg-white/5">
                      <tr>
                        <th className="py-3.5 px-4">Order #</th>
                        <th className="py-3.5 px-4">Date</th>
                        <th className="py-3.5 px-4">Customer</th>
                        <th className="py-3.5 px-4">Destination</th>
                        <th className="py-3.5 px-4 text-right">Total</th>
                        <th className="py-3.5 px-4">Payment</th>
                        <th className="py-3.5 px-4">Fulfillment Status</th>
                        <th className="py-3.5 px-4 text-right">View</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-medium">
                      {orders
                        .filter((o) => {
                          const matchesSearch =
                            o.order_number.toLowerCase().includes(orderSearch.toLowerCase()) ||
                            o.customer.name.toLowerCase().includes(orderSearch.toLowerCase()) ||
                            o.shipping_address.city.toLowerCase().includes(orderSearch.toLowerCase());
                          const matchesStatus = orderStatusFilter === 'all' || o.fulfilment_status === orderStatusFilter;
                          return matchesSearch && matchesStatus;
                        })
                        .map((order) => (
                          <tr key={order.id} className="hover:bg-white/5">
                            <td className="py-3 px-4 font-mono font-bold text-brand-accent">
                              {order.order_number}
                              {order.is_demo && (
                                <span className="block text-[9px] text-amber-400 font-mono">DEMO ORDER</span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-steel-400">
                              {new Date(order.created_at).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4">
                              <p className="font-bold text-white">{order.customer.name}</p>
                              <p className="text-[11px] text-steel-400">{order.customer.phone}</p>
                            </td>
                            <td className="py-3 px-4 text-steel-300">
                              {order.shipping_address.city}, {order.shipping_address.state}
                            </td>
                            <td className="py-3 px-4 font-mono font-bold text-white text-right">
                              ₹{order.total.toLocaleString('en-IN')}
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] uppercase font-mono font-bold ${
                                  order.payment_status === 'paid'
                                    ? 'bg-emerald-500/20 text-emerald-400'
                                    : 'bg-amber-500/20 text-amber-400'
                                }`}
                              >
                                {order.payment_status}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <select
                                value={order.fulfilment_status}
                                onChange={async (e) => {
                                  const newStatus = e.target.value as FulfilmentStatus;
                                  await updateOrderStatus(order.id, newStatus, order.payment_status);
                                  triggerToast(`Order ${order.order_number} status updated to ${newStatus}.`);
                                }}
                                className="bg-[#0E1726] border border-steel-700 text-white rounded-lg px-2 py-1 text-xs"
                              >
                                <option value="unfulfilled">Unfulfilled</option>
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <button
                                onClick={() => setViewingOrder(order)}
                                className="p-1.5 rounded-lg text-steel-300 hover:text-white hover:bg-white/10"
                                title="View full order invoice"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* TAB 4: COMMERCIAL ENQUIRIES                                           */}
          {/* ===================================================================== */}
          {activeTab === 'enquiries' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-display font-black uppercase tracking-wider">
                    Commercial & Bulk Enquiries
                  </h1>
                  <p className="text-xs text-steel-400 mt-0.5">
                    Direct inquiries from gym owners, dealers, and fitness centers across India.
                  </p>
                </div>

                <button
                  onClick={exportEnquiriesCSV}
                  className="px-4 py-2.5 bg-brand-royal hover:bg-brand-accent text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-colors shadow-md flex items-center gap-2 self-start sm:self-auto"
                >
                  <Download className="w-4 h-4" />
                  <span>Export Enquiries (CSV)</span>
                </button>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-3 items-center">
                <div className="relative flex-1 min-w-[220px]">
                  <Search className="w-4 h-4 text-steel-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="Search by contact name, company, city..."
                    value={enquirySearch}
                    onChange={(e) => setEnquirySearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-[#14233D] text-white text-xs rounded-xl border border-steel-700 focus:outline-none focus:border-brand-accent"
                  />
                </div>

                <select
                  value={enquiryStatusFilter}
                  onChange={(e) => setEnquiryStatusFilter(e.target.value)}
                  className="px-3 py-2 bg-[#14233D] text-white text-xs rounded-xl border border-steel-700 focus:outline-none focus:border-brand-accent"
                >
                  <option value="all">All Enquiry Statuses</option>
                  <option value="new">New</option>
                  <option value="in_review">In Review</option>
                  <option value="contacted">Contacted</option>
                  <option value="quoted">Quoted</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              {/* Enquiries Table */}
              <div className="bg-[#14233D] rounded-2xl border border-brand-royal/30 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="text-steel-400 uppercase font-mono border-b border-white/10 bg-white/5">
                      <tr>
                        <th className="py-3.5 px-4">Date</th>
                        <th className="py-3.5 px-4">Contact & Business</th>
                        <th className="py-3.5 px-4">Type</th>
                        <th className="py-3.5 px-4">Location</th>
                        <th className="py-3.5 px-4">Quantity</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4 text-right">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-medium">
                      {enquiries
                        .filter((e) => {
                          const matches =
                            e.full_name.toLowerCase().includes(enquirySearch.toLowerCase()) ||
                            (e.company_name && e.company_name.toLowerCase().includes(enquirySearch.toLowerCase())) ||
                            e.city.toLowerCase().includes(enquirySearch.toLowerCase());
                          const statusMatch = enquiryStatusFilter === 'all' || e.status === enquiryStatusFilter;
                          return matches && statusMatch;
                        })
                        .map((enq) => (
                          <tr key={enq.id} className="hover:bg-white/5">
                            <td className="py-3 px-4 text-steel-400">
                              {new Date(enq.created_at).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4">
                              <p className="font-bold text-white">{enq.full_name}</p>
                              {enq.company_name && (
                                <p className="text-[11px] text-brand-accent">{enq.company_name}</p>
                              )}
                              <p className="text-[10px] text-steel-400">{enq.phone} • {enq.email}</p>
                            </td>
                            <td className="py-3 px-4">
                              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-brand-royal/40 text-brand-accent">
                                {enq.requirement_type}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-steel-300">
                              {enq.city}, {enq.state}
                            </td>
                            <td className="py-3 px-4 font-mono text-steel-300">
                              {enq.estimated_quantity}
                            </td>
                            <td className="py-3 px-4">
                              <select
                                value={enq.status}
                                onChange={async (e) => {
                                  const next = e.target.value as EnquiryStatus;
                                  await updateEnquiryStatus(enq.id, next);
                                  triggerToast(`Enquiry status updated to ${next}.`);
                                }}
                                className="bg-[#0E1726] border border-steel-700 text-white rounded-lg px-2 py-1 text-xs"
                              >
                                <option value="new">New</option>
                                <option value="in_review">In Review</option>
                                <option value="contacted">Contacted</option>
                                <option value="quoted">Quoted</option>
                                <option value="closed">Closed</option>
                              </select>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <button
                                onClick={() => setViewingEnquiry(enq)}
                                className="p-1.5 rounded-lg text-steel-300 hover:text-white hover:bg-white/10"
                                title="View inquiry message & internal notes"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* TAB 5: SITE SETTINGS & CONTENT CMS                                    */}
          {/* ===================================================================== */}
          {activeTab === 'settings' && (
            <div className="space-y-8 max-w-4xl">
              <div>
                <h1 className="text-2xl font-display font-black uppercase tracking-wider">
                  Website Content & Settings (CMS)
                </h1>
                <p className="text-xs text-steel-400 mt-0.5">
                  Update headlines, brochure brand messages, contact phone numbers, and fiscal parameters.
                </p>
              </div>

              {/* Announcement Bar Settings */}
              <div className="bg-[#14233D] rounded-2xl border border-brand-royal/30 p-6 space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-white border-b border-white/10 pb-2">
                  Top Announcement Bar
                </h3>

                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-xs font-semibold text-steel-300">
                    <input
                      type="checkbox"
                      checked={settings.announcement_bar.enabled}
                      onChange={(e) => {
                        saveSettings({
                          ...settings,
                          announcement_bar: { ...settings.announcement_bar, enabled: e.target.checked },
                        });
                        triggerToast('Announcement bar status updated.');
                      }}
                      className="rounded text-brand-accent focus:ring-brand-accent"
                    />
                    <span>Enable Announcement Bar on Storefront</span>
                  </label>

                  <div>
                    <label className="block text-xs font-semibold text-steel-400 mb-1">
                      Announcement Banner Copy
                    </label>
                    <input
                      type="text"
                      value={settings.announcement_bar.text}
                      onChange={(e) => {
                        saveSettings({
                          ...settings,
                          announcement_bar: { ...settings.announcement_bar, text: e.target.value },
                        });
                      }}
                      className="w-full px-3.5 py-2 bg-[#0E1726] text-white text-xs rounded-xl border border-steel-700 focus:outline-none focus:border-brand-accent"
                    />
                  </div>
                </div>
              </div>

              {/* Hero Section Copy */}
              <div className="bg-[#14233D] rounded-2xl border border-brand-royal/30 p-6 space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-white border-b border-white/10 pb-2">
                  Homepage Hero Messaging
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-steel-400 mb-1">
                      Primary Headline
                    </label>
                    <input
                      type="text"
                      value={settings.hero_content.headline}
                      onChange={(e) => {
                        saveSettings({
                          ...settings,
                          hero_content: { ...settings.hero_content, headline: e.target.value },
                        });
                      }}
                      className="w-full px-3.5 py-2 bg-[#0E1726] text-white text-xs rounded-xl border border-steel-700 focus:outline-none focus:border-brand-accent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-steel-400 mb-1">
                      Supporting Headline
                    </label>
                    <input
                      type="text"
                      value={settings.hero_content.supporting_headline}
                      onChange={(e) => {
                        saveSettings({
                          ...settings,
                          hero_content: { ...settings.hero_content, supporting_headline: e.target.value },
                        });
                      }}
                      className="w-full px-3.5 py-2 bg-[#0E1726] text-white text-xs rounded-xl border border-steel-700 focus:outline-none focus:border-brand-accent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-steel-400 mb-1">
                      Hero Paragraph Description
                    </label>
                    <textarea
                      rows={3}
                      value={settings.hero_content.description}
                      onChange={(e) => {
                        saveSettings({
                          ...settings,
                          hero_content: { ...settings.hero_content, description: e.target.value },
                        });
                      }}
                      className="w-full px-3.5 py-2 bg-[#0E1726] text-white text-xs rounded-xl border border-steel-700 focus:outline-none focus:border-brand-accent"
                    />
                  </div>
                </div>
              </div>

              {/* Contact & Legal Factory Information */}
              <div className="bg-[#14233D] rounded-2xl border border-brand-royal/30 p-6 space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-white border-b border-white/10 pb-2">
                  Company Identity & Official Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-steel-400 mb-1">Primary Phone</label>
                    <input
                      type="text"
                      value={settings.phone_primary}
                      onChange={(e) => saveSettings({ ...settings, phone_primary: e.target.value })}
                      className="w-full px-3.5 py-2 bg-[#0E1726] text-white text-xs rounded-xl border border-steel-700"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-steel-400 mb-1">Secondary Phone</label>
                    <input
                      type="text"
                      value={settings.phone_secondary}
                      onChange={(e) => saveSettings({ ...settings, phone_secondary: e.target.value })}
                      className="w-full px-3.5 py-2 bg-[#0E1726] text-white text-xs rounded-xl border border-steel-700"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-steel-400 mb-1">Email Desk</label>
                    <input
                      type="email"
                      value={settings.email}
                      onChange={(e) => saveSettings({ ...settings, email: e.target.value })}
                      className="w-full px-3.5 py-2 bg-[#0E1726] text-white text-xs rounded-xl border border-steel-700"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-steel-400 mb-1">GSTIN Number</label>
                    <input
                      type="text"
                      value={settings.gstin}
                      onChange={(e) => saveSettings({ ...settings, gstin: e.target.value })}
                      className="w-full px-3.5 py-2 bg-[#0E1726] text-white text-xs rounded-xl border border-steel-700 font-mono"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-steel-400 mb-1">Manufacturing Address</label>
                    <textarea
                      rows={2}
                      value={settings.address}
                      onChange={(e) => saveSettings({ ...settings, address: e.target.value })}
                      className="w-full px-3.5 py-2 bg-[#0E1726] text-white text-xs rounded-xl border border-steel-700"
                    />
                  </div>
                </div>
              </div>

              {/* Fiscal & E-Commerce Settings */}
              <div className="bg-[#14233D] rounded-2xl border border-brand-royal/30 p-6 space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-white border-b border-white/10 pb-2">
                  E-Commerce & Heavy Freight Rates
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-steel-400 mb-1">GST Rate (%)</label>
                    <input
                      type="number"
                      value={settings.ecommerce.tax_rate_percentage}
                      onChange={(e) =>
                        saveSettings({
                          ...settings,
                          ecommerce: { ...settings.ecommerce, tax_rate_percentage: Number(e.target.value) },
                        })
                      }
                      className="w-full px-3.5 py-2 bg-[#0E1726] text-white text-xs rounded-xl border border-steel-700 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-steel-400 mb-1">Flat Freight Charge (₹)</label>
                    <input
                      type="number"
                      value={settings.ecommerce.shipping_flat_rate}
                      onChange={(e) =>
                        saveSettings({
                          ...settings,
                          ecommerce: { ...settings.ecommerce, shipping_flat_rate: Number(e.target.value) },
                        })
                      }
                      className="w-full px-3.5 py-2 bg-[#0E1726] text-white text-xs rounded-xl border border-steel-700 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-steel-400 mb-1">Free Freight Threshold (₹)</label>
                    <input
                      type="number"
                      value={settings.ecommerce.free_shipping_threshold}
                      onChange={(e) =>
                        saveSettings({
                          ...settings,
                          ecommerce: { ...settings.ecommerce, free_shipping_threshold: Number(e.target.value) },
                        })
                      }
                      className="w-full px-3.5 py-2 bg-[#0E1726] text-white text-xs rounded-xl border border-steel-700 font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ========================================================================= */}
      {/* PRODUCT CREATE / EDIT MODAL                                               */}
      {/* ========================================================================= */}
      {isProductModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-3xl bg-[#14233D] rounded-3xl border border-brand-royal/50 shadow-2xl overflow-hidden z-10 text-white my-8">
            <div className="p-6 bg-[#101B30] border-b border-brand-royal/30 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold uppercase tracking-wider text-white">
                  {editingProduct.id ? `Edit: ${editingProduct.name}` : 'Create New Manufactured Equipment'}
                </h3>
                <p className="text-xs text-steel-400">
                  Update mild steel specifications, load capacity, prices, and imagery.
                </p>
              </div>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-1.5 text-steel-400 hover:text-white rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProductForm} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-steel-300 mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0E1726] rounded-xl border border-steel-700 text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-steel-300 mb-1">Model Code *</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.model}
                    onChange={(e) => setEditingProduct({ ...editingProduct, model: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0E1726] rounded-xl border border-steel-700 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-steel-300 mb-1">Category</label>
                  <select
                    value={editingProduct.category_id}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category_id: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0E1726] rounded-xl border border-steel-700 text-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-steel-300 mb-1">Price (₹ INR) *</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#0E1726] rounded-xl border border-steel-700 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-steel-300 mb-1">Original / MRP (₹)</label>
                  <input
                    type="number"
                    value={editingProduct.sale_price || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, sale_price: Number(e.target.value) || undefined })}
                    className="w-full px-3 py-2 bg-[#0E1726] rounded-xl border border-steel-700 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-steel-300 mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    value={editingProduct.stock_quantity}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock_quantity: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#0E1726] rounded-xl border border-steel-700 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-steel-300 mb-1">Availability</label>
                  <select
                    value={editingProduct.availability}
                    onChange={(e) => setEditingProduct({ ...editingProduct, availability: e.target.value as any })}
                    className="w-full px-3 py-2 bg-[#0E1726] rounded-xl border border-steel-700 text-white"
                  >
                    <option value="in_stock">In Stock</option>
                    <option value="made_to_order">Made to Order</option>
                    <option value="out_of_stock">Out of Stock</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-steel-300 mb-1">SKU</label>
                  <input
                    type="text"
                    value={editingProduct.sku}
                    onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0E1726] rounded-xl border border-steel-700 text-white font-mono"
                  />
                </div>
              </div>

              {/* Image Manager with File Upload & Gallery */}
              <div className="space-y-3 pt-2 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <label className="font-bold uppercase tracking-wider text-brand-accent">
                    Product Photography & Gallery ({editingProduct.images.length} images)
                  </label>
                  <label className="cursor-pointer px-3 py-1.5 bg-brand-royal hover:bg-brand-accent text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors inline-flex items-center gap-1.5 shadow">
                    <span>+ Upload Photo from Computer</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            if (typeof reader.result === 'string') {
                              setEditingProduct((prev) =>
                                prev ? { ...prev, images: [reader.result as string, ...prev.images] } : null
                              );
                              triggerToast('Photo uploaded from device and added to gallery.');
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>

                {/* Thumbnails list with delete & primary indicators */}
                <div className="flex flex-wrap gap-3 p-3 bg-[#0E1726] rounded-xl border border-steel-700 min-h-[90px] items-center">
                  {editingProduct.images.map((img, idx) => (
                    <div key={idx} className="relative group w-20 h-20 bg-white rounded-lg p-1 border border-steel-600 flex items-center justify-center overflow-hidden">
                      <img src={img} alt={`Preview ${idx}`} className="max-h-full max-w-full object-contain" />
                      {idx === 0 && (
                        <span className="absolute bottom-0 inset-x-0 bg-brand-navy/90 text-brand-accent text-[8px] font-bold text-center py-0.5 uppercase tracking-tighter">
                          Main Photo
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          const filtered = editingProduct.images.filter((_, i) => i !== idx);
                          setEditingProduct({ ...editingProduct, images: filtered.length > 0 ? filtered : ['/brand/logo.png'] });
                        }}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove image"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}

                  <div className="flex-1 min-w-[200px]">
                    <p className="text-[11px] text-steel-400">
                      Upload from your device or paste an image URL / path below:
                    </p>
                    <div className="flex gap-2 mt-1.5">
                      <input
                        type="text"
                        placeholder="/images/products/custom-model.png or https://..."
                        id="new-img-input"
                        className="flex-1 px-2.5 py-1.5 bg-[#14233D] rounded-lg border border-steel-700 text-white text-xs font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const input = document.getElementById('new-img-input') as HTMLInputElement;
                          if (input && input.value.trim()) {
                            setEditingProduct({
                              ...editingProduct,
                              images: [...editingProduct.images, input.value.trim()],
                            });
                            input.value = '';
                          }
                        }}
                        className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold"
                      >
                        Add URL
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-steel-300 mb-1">Short Summary (1–2 lines on card)</label>
                <input
                  type="text"
                  value={editingProduct.short_description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, short_description: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0E1726] rounded-xl border border-steel-700 text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-steel-300 mb-1">Full Engineering Description</label>
                  <textarea
                    rows={3}
                    value={editingProduct.description}
                    onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0E1726] rounded-xl border border-steel-700 text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-steel-300 mb-1">Warranty Details</label>
                  <textarea
                    rows={3}
                    value={editingProduct.warranty || ''}
                    placeholder="e.g. 1 Year Structural Warranty on Mild Steel Frame..."
                    onChange={(e) => setEditingProduct({ ...editingProduct, warranty: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0E1726] rounded-xl border border-steel-700 text-white"
                  />
                </div>
              </div>

              {/* Technical Specifications Key-Value rows */}
              <div className="pt-2 border-t border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold uppercase tracking-wider text-brand-accent">
                    Engineering Specifications
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const specKey = prompt('Enter new specification name (e.g. "Tube Gauge", "Coating", "Load Capacity"):');
                      if (specKey) {
                        setEditingProduct({
                          ...editingProduct,
                          specifications: { ...editingProduct.specifications, [specKey]: '' },
                        });
                      }
                    }}
                    className="px-2 py-1 bg-white/10 hover:bg-white/20 text-white rounded text-[11px] font-semibold"
                  >
                    + Add Spec Row
                  </button>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {Object.entries(editingProduct.specifications).map(([key, val]) => (
                    <div key={key} className="flex items-center gap-2">
                      <span className="w-1/3 text-steel-300 truncate font-semibold">{key}:</span>
                      <input
                        type="text"
                        value={val}
                        onChange={(e) => {
                          setEditingProduct({
                            ...editingProduct,
                            specifications: { ...editingProduct.specifications, [key]: e.target.value },
                          });
                        }}
                        className="flex-1 px-2.5 py-1.5 bg-[#0E1726] rounded-lg border border-steel-700 text-white"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = { ...editingProduct.specifications };
                          delete updated[key];
                          setEditingProduct({ ...editingProduct, specifications: updated });
                        }}
                        className="text-steel-400 hover:text-red-400 p-1"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="pt-3 border-t border-white/10 flex flex-wrap gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.is_demo}
                    onChange={(e) => setEditingProduct({ ...editingProduct, is_demo: e.target.checked })}
                    className="rounded text-brand-accent"
                  />
                  <span>Mark as Demo Concept (shows demo badge)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.is_published}
                    onChange={(e) => setEditingProduct({ ...editingProduct, is_published: e.target.checked })}
                    className="rounded text-brand-accent"
                  />
                  <span>Published on Storefront</span>
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-brand-royal hover:bg-brand-accent text-white font-bold rounded-xl shadow-lg flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Equipment</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ORDER DETAIL MODAL                                                        */}
      {/* ========================================================================= */}
      {viewingOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-[#14233D] rounded-3xl border border-brand-royal/50 shadow-2xl p-6 sm:p-8 text-white z-10 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-mono text-brand-accent uppercase font-bold">Order Details</span>
                <h3 className="text-xl font-bold font-mono text-white">{viewingOrder.order_number}</h3>
              </div>
              <button onClick={() => setViewingOrder(null)} className="p-1.5 text-steel-400 hover:text-white rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 bg-[#0E1726] rounded-xl border border-steel-700">
                <p className="font-bold text-steel-300 uppercase">Customer Information</p>
                <p className="font-bold text-white mt-1">{viewingOrder.customer.name}</p>
                <p className="text-steel-400">{viewingOrder.customer.phone}</p>
                <p className="text-steel-400">{viewingOrder.customer.email}</p>
              </div>
              <div className="p-3.5 bg-[#0E1726] rounded-xl border border-steel-700">
                <p className="font-bold text-steel-300 uppercase">Shipping Destination</p>
                <p className="text-white mt-1">{viewingOrder.shipping_address.street}</p>
                <p className="text-steel-400">{viewingOrder.shipping_address.city}, {viewingOrder.shipping_address.state} - {viewingOrder.shipping_address.pincode}</p>
              </div>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-steel-300 mb-2">Order Items Snapshot</p>
              <div className="divide-y divide-white/5 border border-white/10 rounded-xl overflow-hidden bg-[#0E1726]">
                {viewingOrder.items.map((it) => (
                  <div key={it.id} className="p-3 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-white">{it.product.name}</p>
                      <p className="text-[11px] text-steel-400">Qty: {it.quantity} × ₹{it.unit_price.toLocaleString('en-IN')}</p>
                    </div>
                    <span className="font-mono font-bold text-brand-accent">₹{it.line_total.toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 bg-[#0E1726] rounded-xl border border-steel-700 flex justify-between items-center text-xs">
              <div>
                <span>Payment: <strong className="text-emerald-400 uppercase font-mono">{viewingOrder.payment_status}</strong> ({viewingOrder.payment_method})</span>
              </div>
              <div className="text-right">
                <span className="text-steel-400">Total: </span>
                <span className="font-mono text-base font-bold text-brand-accent">₹{viewingOrder.total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setViewingOrder(null)}
                className="px-5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ENQUIRY DETAIL MODAL                                                      */}
      {/* ========================================================================= */}
      {viewingEnquiry && (
        <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-[#14233D] rounded-3xl border border-brand-royal/50 shadow-2xl p-6 sm:p-8 text-white z-10 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-mono text-brand-accent uppercase font-bold">Commercial Enquiry</span>
                <h3 className="text-xl font-bold text-white">{viewingEnquiry.full_name}</h3>
                {viewingEnquiry.company_name && (
                  <p className="text-xs text-brand-accent font-semibold">{viewingEnquiry.company_name}</p>
                )}
              </div>
              <button onClick={() => setViewingEnquiry(null)} className="p-1.5 text-steel-400 hover:text-white rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 bg-[#0E1726] rounded-xl border border-steel-700 space-y-1">
                <p className="font-bold text-steel-300 uppercase">Contact Information</p>
                <p>Phone: <strong className="text-white">{viewingEnquiry.phone}</strong></p>
                <p>Email: <strong className="text-white">{viewingEnquiry.email}</strong></p>
                <p>Location: {viewingEnquiry.city}, {viewingEnquiry.state}</p>
              </div>
              <div className="p-3.5 bg-[#0E1726] rounded-xl border border-steel-700 space-y-1">
                <p className="font-bold text-steel-300 uppercase">Project Parameters</p>
                <p>Requirement Type: <strong className="text-brand-accent">{viewingEnquiry.requirement_type}</strong></p>
                <p>Estimated Quantity: <strong className="text-white">{viewingEnquiry.estimated_quantity}</strong></p>
                <p>Registered Date: {new Date(viewingEnquiry.created_at).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="p-4 bg-[#0E1726] rounded-xl border border-steel-700 text-xs space-y-2">
              <p className="font-bold text-steel-300 uppercase">Client Message</p>
              <p className="text-steel-200 leading-relaxed font-normal">{viewingEnquiry.message}</p>
            </div>

            {/* Internal Notes editor */}
            <div className="space-y-2 text-xs">
              <label className="block font-bold text-steel-300 uppercase">Factory Internal Notes</label>
              <textarea
                rows={3}
                placeholder="Add notes for your sales & engineering staff (e.g., 'Discussed freight quotation on phone, follow up next Monday')..."
                value={viewingEnquiry.internal_notes || ''}
                onChange={async (e) => {
                  const updated = await updateEnquiryStatus(viewingEnquiry.id, viewingEnquiry.status, e.target.value);
                  if (updated) setViewingEnquiry(updated);
                }}
                className="w-full px-3 py-2 bg-[#0E1726] rounded-xl border border-steel-700 text-white"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2 text-xs">
                <span>Status:</span>
                <select
                  value={viewingEnquiry.status}
                  onChange={async (e) => {
                    const next = e.target.value as EnquiryStatus;
                    const updated = await updateEnquiryStatus(viewingEnquiry.id, next, viewingEnquiry.internal_notes);
                    if (updated) setViewingEnquiry(updated);
                    triggerToast(`Enquiry marked as ${next}.`);
                  }}
                  className="bg-[#0E1726] border border-steel-700 text-white rounded-lg px-2.5 py-1 text-xs"
                >
                  <option value="new">New</option>
                  <option value="in_review">In Review</option>
                  <option value="contacted">Contacted</option>
                  <option value="quoted">Quoted</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <button
                onClick={() => setViewingEnquiry(null)}
                className="px-5 py-2 bg-brand-royal hover:bg-brand-accent text-white rounded-xl text-xs font-bold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
