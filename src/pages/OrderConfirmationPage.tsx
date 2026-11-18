import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  Printer, 
  ArrowRight, 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  Truck, 
  ShieldCheck, 
  Clock, 
  Package
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import * as storage from '../services/storageService';
import { Order } from '../types/order';

export const OrderConfirmationPage: React.FC = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const { settings } = useStore();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadOrder() {
      if (orderNumber) {
        const found = await storage.getOrderByNumber(orderNumber);
        if (isMounted && found) {
          setOrder(found);
        }
      }
    }
    loadOrder();

    // Trigger celebratory confetti
    try {
      confetti({
        particleCount: 75,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#1685F8', '#1D4F91', '#102650', '#22c55e'],
      });
    } catch {
      // Ignore if canvas-confetti fails
    }

    return () => {
      isMounted = false;
    };
  }, [orderNumber]);

  if (!order) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center bg-brand-light">
        <h2 className="text-2xl font-bold text-brand-navy">Order Details Loading...</h2>
        <p className="text-xs text-steel-500 mt-2">Checking the factory order records.</p>
        <Link
          to="/shop"
          className="mt-6 px-6 py-2.5 bg-brand-navy text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-brand-royal transition-colors"
        >
          Return to Store
        </Link>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-brand-light py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Top Success Card */}
        <div className="bg-white rounded-3xl border border-steel-200 p-8 sm:p-10 shadow-sm text-center relative overflow-hidden">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <span className="text-xs font-mono font-bold uppercase tracking-widest text-brand-royal">
            Order Successfully Placed (Demo)
          </span>
          <h1 className="text-3xl sm:text-4xl font-display font-black text-brand-navy uppercase tracking-tight mt-1">
            Thank You for Your Order!
          </h1>
          <p className="text-sm text-steel-600 mt-2 max-w-lg mx-auto">
            Your simulated equipment order has been registered in our database. A copy of the receipt has been saved under order number:
          </p>
          <div className="mt-3 inline-block bg-brand-navy text-white font-mono font-bold text-lg px-4 py-1.5 rounded-xl shadow-inner">
            {order.order_number}
          </div>

          {/* Action buttons */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand-light hover:bg-steel-200 text-brand-navy rounded-xl text-xs font-bold uppercase tracking-wider border border-steel-300 transition-colors"
            >
              <Printer className="w-4 h-4 text-brand-royal" />
              <span>Print Invoice / Receipt</span>
            </button>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-5 py-2 bg-brand-navy hover:bg-brand-royal text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-md"
            >
              <span>Continue Shopping</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Fulfillment Status Progress Tracker */}
        <div className="bg-white rounded-2xl border border-steel-200 p-6 shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-wider text-brand-navy mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-brand-accent" />
            <span>Simulated Factory Fulfillment Timeline</span>
          </h3>

          <div className="grid grid-cols-4 gap-2 text-center text-[11px]">
            <div className="space-y-1.5">
              <div className="w-7 h-7 mx-auto rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">
                ✓
              </div>
              <p className="font-bold text-brand-navy">Order Placed</p>
              <p className="text-[10px] text-steel-400">Database Confirmed</p>
            </div>
            <div className="space-y-1.5">
              <div className="w-7 h-7 mx-auto rounded-full bg-brand-royal text-white flex items-center justify-center font-bold">
                2
              </div>
              <p className="font-bold text-brand-navy">Processing</p>
              <p className="text-[10px] text-steel-400">Engineering Queue</p>
            </div>
            <div className="space-y-1.5 opacity-50">
              <div className="w-7 h-7 mx-auto rounded-full bg-steel-200 text-steel-600 flex items-center justify-center font-bold">
                3
              </div>
              <p className="font-semibold text-steel-700">Dispatch Check</p>
              <p className="text-[10px] text-steel-400">Pallet Packing</p>
            </div>
            <div className="space-y-1.5 opacity-50">
              <div className="w-7 h-7 mx-auto rounded-full bg-steel-200 text-steel-600 flex items-center justify-center font-bold">
                4
              </div>
              <p className="font-semibold text-steel-700">Freight Shipped</p>
              <p className="text-[10px] text-steel-400">Road Carrier</p>
            </div>
          </div>
        </div>

        {/* Printable Order Details / Invoice Block */}
        <div className="bg-white rounded-3xl border border-steel-200 p-8 shadow-sm space-y-8">
          {/* Invoice Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between border-b border-steel-200 pb-6 gap-4">
            <div className="flex items-center gap-3">
              <img src="/brand/logo.png" alt="GE Industries" className="h-12 w-auto" />
              <div>
                <h2 className="text-xl font-display font-black text-brand-navy uppercase tracking-wider">
                  GE INDUSTRIES
                </h2>
                <p className="text-[10px] font-mono text-steel-500 uppercase">
                  GSTIN: {settings.gstin}
                </p>
                <p className="text-xs text-steel-500">Karur, Tamil Nadu, India</p>
              </div>
            </div>

            <div className="text-left sm:text-right text-xs text-steel-600">
              <p className="font-bold text-brand-navy text-sm uppercase">Demo Tax Invoice</p>
              <p className="font-mono mt-0.5">Order #: {order.order_number}</p>
              <p className="text-steel-500">Date: {new Date(order.created_at).toLocaleDateString('en-IN', { dateStyle: 'long' })}</p>
              <span className="inline-block mt-1 px-2.5 py-0.5 rounded text-[10px] font-bold font-mono uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                Payment: {order.payment_status.toUpperCase()} ({order.payment_method})
              </span>
            </div>
          </div>

          {/* Customer & Address Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-steel-600">
            <div className="p-4 bg-brand-light rounded-xl border border-steel-200">
              <p className="font-bold text-brand-navy uppercase tracking-wider mb-2">Customer Details</p>
              <p className="font-semibold text-brand-navy text-sm">{order.customer.name}</p>
              <p className="mt-1 flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-steel-400" /> {order.customer.email}</p>
              <p className="mt-0.5 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-steel-400" /> {order.customer.phone}</p>
            </div>

            <div className="p-4 bg-brand-light rounded-xl border border-steel-200">
              <p className="font-bold text-brand-navy uppercase tracking-wider mb-2">Shipping Destination</p>
              <p className="font-medium text-brand-navy">{order.shipping_address.street}</p>
              {order.shipping_address.apartment && <p>{order.shipping_address.apartment}</p>}
              <p>{order.shipping_address.city}, {order.shipping_address.state} – {order.shipping_address.pincode}</p>
              <p className="text-steel-500 mt-1">{order.shipping_address.country}</p>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-brand-navy text-white uppercase font-mono">
                <tr>
                  <th className="py-3 px-4 rounded-l-lg">Item & Model</th>
                  <th className="py-3 px-4">SKU</th>
                  <th className="py-3 px-4 text-center">Qty</th>
                  <th className="py-3 px-4 text-right">Unit Price</th>
                  <th className="py-3 px-4 text-right rounded-r-lg">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-steel-100 font-medium">
                {order.items.map((item) => (
                  <tr key={item.id} className="hover:bg-brand-light/50">
                    <td className="py-3.5 px-4 font-bold text-brand-navy">
                      {item.product.name}
                      {item.selected_variant && (
                        <span className="block text-[11px] font-normal text-steel-500">
                          {item.selected_variant.variant_name}: {item.selected_variant.option_label}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-steel-500">{item.product.sku}</td>
                    <td className="py-3.5 px-4 text-center font-bold text-brand-navy">{item.quantity}</td>
                    <td className="py-3.5 px-4 text-right font-mono">₹{item.unit_price.toLocaleString('en-IN')}</td>
                    <td className="py-3.5 px-4 text-right font-bold text-brand-navy font-mono">₹{item.line_total.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Total Breakdown */}
          <div className="border-t border-steel-200 pt-4 flex justify-end">
            <div className="w-full sm:w-72 space-y-2 text-xs text-steel-600">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-semibold text-brand-navy">₹{order.subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Heavy Freight Shipping:</span>
                <span className="font-semibold text-brand-navy">
                  {order.shipping === 0 ? 'FREE' : `₹${order.shipping.toLocaleString('en-IN')}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>GST (18%):</span>
                <span className="font-semibold text-brand-navy">₹{order.tax.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
              </div>
              <div className="border-t border-steel-200 pt-2 flex justify-between text-base font-bold text-brand-navy">
                <span>Grand Total:</span>
                <span className="text-brand-accent">₹{order.total.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>

          {/* Factory Footer Info */}
          <div className="p-4 bg-brand-light rounded-2xl border border-steel-200 text-center text-xs text-steel-500 space-y-1">
            <p className="font-semibold text-brand-navy">GE Industries • Gym Equipment Manufacturing</p>
            <p>{settings.address}</p>
            <p>Direct Factory Enquiries: {settings.phone_primary} / {settings.phone_secondary} • {settings.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
