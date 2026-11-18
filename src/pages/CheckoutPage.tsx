import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Lock, 
  Truck, 
  CreditCard, 
  Building, 
  Banknote, 
  ArrowLeft, 
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { PaymentMethod } from '../types/order';

const INDIAN_STATES = [
  'Tamil Nadu',
  'Kerala',
  'Karnataka',
  'Andhra Pradesh',
  'Telangana',
  'Maharashtra',
  'Gujarat',
  'Delhi NCR',
  'Rajasthan',
  'Uttar Pradesh',
  'West Bengal',
  'Madhya Pradesh',
  'Punjab',
  'Haryana',
  'Odisha',
  'Other State / Union Territory',
];

export const CheckoutPage: React.FC = () => {
  const { cart, clearCart, settings } = useCart();
  const { createOrder } = useStore();
  const navigate = useNavigate();

  // Customer Details Form State
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  // Shipping Address State
  const [street, setStreet] = useState('');
  const [apartment, setApartment] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Tamil Nadu');
  const [pincode, setPincode] = useState('');
  const [sameAsShipping, setSameAsShipping] = useState(true);

  // Billing Address State (if different)
  const [billingStreet, setBillingStreet] = useState('');
  const [billingCity, setBillingCity] = useState('');
  const [billingState, setBillingState] = useState('Tamil Nadu');
  const [billingPincode, setBillingPincode] = useState('');

  // Payment method selection
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('demo_online');
  const [orderNotes, setOrderNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Redirect if cart is empty
  if (cart.items.length === 0) {
    return (
      <div className="min-h-[65vh] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-bold text-brand-navy">Your cart is empty</h2>
        <p className="text-sm text-steel-500 mt-2">Add equipment before proceeding to checkout.</p>
        <Link
          to="/shop"
          className="mt-6 px-6 py-2.5 bg-brand-navy text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-brand-royal transition-colors"
        >
          Browse Catalogue
        </Link>
      </div>
    );
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Field Validations
    if (!customerName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!customerEmail.trim() || !customerEmail.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!customerPhone.trim() || customerPhone.replace(/\D/g, '').length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!street.trim()) {
      setErrorMessage('Please enter the delivery street address.');
      return;
    }
    if (!city.trim()) {
      setErrorMessage('Please enter your city.');
      return;
    }
    if (!pincode.trim() || pincode.trim().length < 6) {
      setErrorMessage('Please enter a valid 6-digit PIN code.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate brief network verification
      await new Promise((resolve) => setTimeout(resolve, 800));

      const newOrder = await createOrder({
        customer: {
          name: customerName.trim(),
          email: customerEmail.trim(),
          phone: customerPhone.trim(),
        },
        shipping_address: {
          street: street.trim(),
          apartment: apartment.trim() || undefined,
          city: city.trim(),
          state,
          pincode: pincode.trim(),
          country: 'India',
        },
        billing_address: !sameAsShipping
          ? {
              street: billingStreet.trim(),
              city: billingCity.trim(),
              state: billingState,
              pincode: billingPincode.trim(),
              country: 'India',
            }
          : undefined,
        same_as_shipping: sameAsShipping,
        items: [...cart.items],
        subtotal: cart.subtotal,
        shipping: cart.shipping,
        tax: cart.tax,
        discount: 0,
        total: cart.total,
        payment_method: paymentMethod,
        payment_status: paymentMethod === 'demo_online' ? 'paid' : 'pending',
        fulfilment_status: 'processing',
        is_demo: true,
        notes: orderNotes.trim() || undefined,
      });

      // Clear the cart
      clearCart();

      // Navigate to order confirmation
      navigate(`/order-confirmation/${newOrder.order_number}`);
    } catch {
      setIsSubmitting(false);
      setErrorMessage('Failed to generate order. Please check inputs and retry.');
    }
  };

  return (
    <div className="min-h-screen bg-brand-light py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Navigation back */}
        <div className="mb-6">
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 text-xs font-semibold text-steel-600 hover:text-brand-navy"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Equipment Cart</span>
          </Link>
        </div>

        {/* Demo Mode Notice Banner */}
        <div className="mb-8 p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-start gap-3 text-amber-950">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed">
            <strong className="uppercase font-bold tracking-wider">Demo Store Simulation:</strong>{' '}
            This checkout simulates the entire purchase lifecycle (order number generation, ledger entry, and confirmation).
            <strong> No real credit card or bank account will be charged.</strong> Real factory orders and merchant accounts will be connected upon company production approval.
          </div>
        </div>

        <form onSubmit={handlePlaceOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Column: Form Fields (7 cols) */}
            <div className="lg:col-span-7 space-y-8">
              {/* Customer Contact */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-steel-200 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-brand-navy uppercase tracking-wider flex items-center gap-2 border-b border-steel-100 pb-3">
                  <span className="w-6 h-6 rounded-full bg-brand-navy text-white text-xs flex items-center justify-center font-mono">1</span>
                  <span>Contact Information</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-steel-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Sundaram"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-steel-300 focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-steel-700 mb-1">
                      Email Address (for order tracking) *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-steel-300 focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-steel-700 mb-1">
                      Mobile Number (for delivery coordination) *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98401 23456"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-steel-300 focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-steel-200 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-brand-navy uppercase tracking-wider flex items-center gap-2 border-b border-steel-100 pb-3">
                  <span className="w-6 h-6 rounded-full bg-brand-navy text-white text-xs flex items-center justify-center font-mono">2</span>
                  <span>Heavy Freight Delivery Address</span>
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-steel-700 mb-1">
                      Street Address / Building Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Door / Plot No., Street, Area"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-steel-300 focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-steel-700 mb-1">
                      Apartment / Suite / Landmark (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Near Bus Stand / 2nd Floor"
                      value={apartment}
                      onChange={(e) => setApartment(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-steel-300 focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-steel-700 mb-1">
                        City / Town *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Karur / Chennai"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-steel-300 focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-steel-700 mb-1">
                        State *
                      </label>
                      <select
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-steel-300 bg-white focus:outline-none focus:border-brand-accent"
                      >
                        {INDIAN_STATES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-steel-700 mb-1">
                        PIN Code (6 digits) *
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        placeholder="639003"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-steel-300 focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent font-mono"
                      />
                    </div>
                  </div>

                  {/* Billing Checkbox */}
                  <div className="pt-2">
                    <label className="flex items-center gap-2 text-xs font-semibold text-steel-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={sameAsShipping}
                        onChange={(e) => setSameAsShipping(e.target.checked)}
                        className="rounded text-brand-royal focus:ring-brand-accent"
                      />
                      <span>Billing address is the same as shipping address</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-steel-200 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-brand-navy uppercase tracking-wider flex items-center gap-2 border-b border-steel-100 pb-3">
                  <span className="w-6 h-6 rounded-full bg-brand-navy text-white text-xs flex items-center justify-center font-mono">3</span>
                  <span>Payment Simulation Mode</span>
                </h3>

                <div className="space-y-3">
                  {/* Demo Online Payment */}
                  <label
                    className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'demo_online'
                        ? 'border-brand-royal bg-brand-royal/5 ring-1 ring-brand-royal'
                        : 'border-steel-200 hover:border-steel-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment_method"
                      value="demo_online"
                      checked={paymentMethod === 'demo_online'}
                      onChange={() => setPaymentMethod('demo_online')}
                      className="mt-1 text-brand-royal focus:ring-brand-accent"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-brand-navy text-sm flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-brand-accent" />
                          <span>Simulated Online Payment (UPI / Card / NetBanking)</span>
                        </span>
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                          Instant Test
                        </span>
                      </div>
                      <p className="text-xs text-steel-500 mt-1">
                        Simulates instant online payment confirmation for demo testing without charging any card or UPI ID.
                      </p>
                    </div>
                  </label>

                  {/* Demo Bank Transfer */}
                  <label
                    className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'demo_bank_transfer'
                        ? 'border-brand-royal bg-brand-royal/5 ring-1 ring-brand-royal'
                        : 'border-steel-200 hover:border-steel-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment_method"
                      value="demo_bank_transfer"
                      checked={paymentMethod === 'demo_bank_transfer'}
                      onChange={() => setPaymentMethod('demo_bank_transfer')}
                      className="mt-1 text-brand-royal focus:ring-brand-accent"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-brand-navy text-sm flex items-center gap-2">
                          <Building className="w-4 h-4 text-brand-royal" />
                          <span>Direct Factory Bank Transfer (NEFT / RTGS)</span>
                        </span>
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-steel-100 text-steel-700 font-semibold">
                          Invoice
                        </span>
                      </div>
                      <p className="text-xs text-steel-500 mt-1">
                        Generates a formal proforma order invoice with GE Industries factory account details.
                      </p>
                    </div>
                  </label>

                  {/* Demo COD / Pay on Dispatch */}
                  <label
                    className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'demo_cod'
                        ? 'border-brand-royal bg-brand-royal/5 ring-1 ring-brand-royal'
                        : 'border-steel-200 hover:border-steel-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment_method"
                      value="demo_cod"
                      checked={paymentMethod === 'demo_cod'}
                      onChange={() => setPaymentMethod('demo_cod')}
                      className="mt-1 text-brand-royal focus:ring-brand-accent"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-brand-navy text-sm flex items-center gap-2">
                          <Banknote className="w-4 h-4 text-brand-royal" />
                          <span>Pay on Freight Dispatch / Cash On Delivery</span>
                        </span>
                      </div>
                      <p className="text-xs text-steel-500 mt-1">
                        Order registered in factory queue with payment collected upon freight dispatch confirmation.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Delivery instructions */}
              <div className="bg-white p-6 rounded-2xl border border-steel-200 shadow-sm space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy">
                  Special Delivery Instructions (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Gate instructions, unloading help required, preferred delivery hours..."
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-steel-300 focus:outline-none focus:border-brand-accent"
                />
              </div>
            </div>

            {/* Right Column: Order Review & Confirmation (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-steel-200 shadow-sm space-y-5 sticky top-24">
                <h3 className="text-base font-bold uppercase tracking-wider text-brand-navy border-b border-steel-100 pb-3 flex items-center justify-between">
                  <span>Order Review</span>
                  <span className="text-xs font-mono text-steel-500 font-normal">
                    {cart.total_items} items
                  </span>
                </h3>

                {/* Items list snapshot */}
                <div className="divide-y divide-steel-100 max-h-60 overflow-y-auto pr-1">
                  {cart.items.map((item) => (
                    <div key={item.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-10 h-10 object-contain p-1 rounded border border-steel-100 bg-brand-light"
                        />
                        <div>
                          <p className="font-semibold text-brand-navy truncate max-w-[170px]">
                            {item.product.name}
                          </p>
                          <p className="text-[11px] text-steel-500">
                            Qty: {item.quantity} × ₹{item.unit_price.toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-brand-navy">
                        ₹{item.line_total.toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Calculations breakdown */}
                <div className="space-y-2 text-xs text-steel-600 border-t border-steel-200 pt-3">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-brand-navy">₹{cart.subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Heavy Freight Shipping</span>
                    <span className="font-semibold text-brand-navy">
                      {cart.shipping === 0 ? (
                        <span className="text-emerald-600 font-bold">FREE</span>
                      ) : (
                        `₹${cart.shipping.toLocaleString('en-IN')}`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST ({settings.ecommerce.tax_rate_percentage}%)</span>
                    <span className="font-semibold text-brand-navy">
                      ₹{cart.tax.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="border-t border-steel-200 pt-3 flex justify-between text-lg font-bold text-brand-navy">
                    <span>Grand Total</span>
                    <span className="text-brand-accent">
                      ₹{cart.total.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                {/* Error Banner */}
                {errorMessage && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium">
                    {errorMessage}
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-brand-navy hover:bg-brand-royal text-white font-bold rounded-xl text-sm uppercase tracking-wider transition-all shadow-lg shadow-brand-navy/25 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Lock className="w-4 h-4 text-brand-accent" />
                  <span>{isSubmitting ? 'Simulating Order Placement...' : 'Place Demo Test Order'}</span>
                </button>

                <p className="text-[11px] text-center text-steel-400">
                  Simulated factory checkout. No financial charge is processed.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
