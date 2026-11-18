import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  Truck, 
  ShieldCheck, 
  RotateCcw,
  AlertCircle
} from 'lucide-react';
import { useCart } from '../context/CartContext';

export const CartPage: React.FC = () => {
  const { cart, updateQuantity, removeFromCart, clearCart, settings } = useCart();
  const navigate = useNavigate();

  const freeShippingThreshold = settings.ecommerce.free_shipping_threshold;
  const amountNeeded = Math.max(0, freeShippingThreshold - cart.subtotal);

  if (cart.items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center bg-brand-light">
        <div className="w-20 h-20 rounded-full bg-white shadow-md border border-steel-200 flex items-center justify-center text-steel-400 mb-4">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-display font-black text-brand-navy uppercase tracking-tight">
          Your Equipment Cart is Empty
        </h1>
        <p className="text-sm text-steel-600 mt-2 max-w-md">
          Explore GE Industries manufactured power racks, workout benches, squat stands, and dumbbell racks.
        </p>
        <Link
          to="/shop"
          className="mt-6 px-8 py-3.5 bg-brand-navy hover:bg-brand-royal text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-colors shadow-lg"
        >
          Explore Catalogue
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-light py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-steel-200 gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-display font-black text-brand-navy uppercase tracking-tight">
              Shopping Cart
            </h1>
            <p className="text-xs text-steel-500 font-medium mt-1">
              {cart.total_items} {cart.total_items === 1 ? 'equipment unit' : 'equipment units'} selected
            </p>
          </div>

          <button
            onClick={clearCart}
            className="text-xs font-semibold text-steel-500 hover:text-red-600 transition-colors self-start sm:self-auto flex items-center gap-1.5"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear Cart</span>
          </button>
        </div>

        {/* Free Shipping Alert Banner */}
        <div className="mt-6 p-4 rounded-xl bg-brand-navy text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <Truck className="w-5 h-5 text-brand-accent flex-shrink-0" />
            <div className="text-xs">
              {amountNeeded > 0 ? (
                <span>
                  Add <strong className="text-brand-accent">₹{amountNeeded.toLocaleString('en-IN')}</strong> more of gym equipment to qualify for <strong>FREE Freight Delivery</strong> across India!
                </span>
              ) : (
                <span className="text-emerald-400 font-bold">
                  ✓ Your order qualifies for FREE Freight Delivery from our Karur factory!
                </span>
              )}
            </div>
          </div>
          <Link
            to="/shop"
            className="text-xs font-bold uppercase tracking-wider text-brand-accent hover:text-white underline whitespace-nowrap hidden sm:inline"
          >
            Add More
          </Link>
        </div>

        {/* Cart Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
          {/* Items Table (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white rounded-2xl border border-steel-200 overflow-hidden shadow-sm">
              <div className="divide-y divide-steel-200">
                {cart.items.map((item) => (
                  <div key={item.id} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    {/* Image and Details */}
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-20 h-20 bg-brand-light rounded-xl p-2 border border-steel-100 flex-shrink-0 flex items-center justify-center">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>

                      <div>
                        <Link
                          to={`/product/${item.product.slug}`}
                          className="text-base font-bold text-brand-navy hover:text-brand-accent transition-colors"
                        >
                          {item.product.name}
                        </Link>
                        <p className="text-xs font-mono text-steel-500 mt-0.5">
                          Model: {item.product.model} • SKU: {item.product.sku}
                        </p>
                        {item.selected_variant && (
                          <p className="text-xs text-brand-royal font-medium mt-0.5">
                            {item.selected_variant.variant_name}: {item.selected_variant.option_label}
                          </p>
                        )}
                        <p className="text-xs font-bold text-brand-navy sm:hidden mt-2">
                          ₹{item.unit_price.toLocaleString('en-IN')} each
                        </p>
                      </div>
                    </div>

                    {/* Quantity & Line Total */}
                    <div className="flex items-center justify-between w-full sm:w-auto gap-6 pt-2 sm:pt-0 border-t sm:border-0 border-steel-100">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-steel-300 rounded-xl overflow-hidden bg-white">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-2 text-steel-600 hover:bg-steel-100"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 py-1 text-xs font-bold text-brand-navy">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-2 text-steel-600 hover:bg-steel-100"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Total */}
                      <div className="text-right min-w-[90px]">
                        <span className="text-base font-bold text-brand-navy block">
                          ₹{item.line_total.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-steel-400 font-mono hidden sm:block">
                          ₹{item.unit_price.toLocaleString('en-IN')} ea
                        </span>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 text-steel-400 hover:text-red-500 transition-colors"
                        title="Remove product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-steel-600 pt-2">
              <Link to="/shop" className="hover:text-brand-navy underline font-semibold">
                ← Continue Browsing Equipment
              </Link>
              <span>Heavy equipment palletized delivery</span>
            </div>
          </div>

          {/* Order Summary Card (4 cols) */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-2xl border border-steel-200 p-6 shadow-sm space-y-5 sticky top-24">
              <h3 className="text-base font-bold uppercase tracking-wider text-brand-navy border-b border-steel-100 pb-3">
                Order Summary
              </h3>

              <div className="space-y-2.5 text-xs text-steel-600 font-medium">
                <div className="flex justify-between">
                  <span>Subtotal ({cart.total_items} items)</span>
                  <span className="font-semibold text-brand-navy">₹{cart.subtotal.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between">
                  <span>Standard Heavy Freight Delivery</span>
                  <span className="font-semibold text-brand-navy">
                    {cart.shipping === 0 ? (
                      <span className="text-emerald-600 font-bold">FREE</span>
                    ) : (
                      `₹${cart.shipping.toLocaleString('en-IN')}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Estimated GST ({settings.ecommerce.tax_rate_percentage}%)</span>
                  <span className="font-semibold text-brand-navy">
                    ₹{cart.tax.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="border-t border-steel-200 pt-3 flex justify-between text-lg font-bold text-brand-navy">
                  <span>Estimated Total</span>
                  <span className="text-brand-accent">
                    ₹{cart.total.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Demo Mode Notice */}
              <div className="p-3 bg-brand-light rounded-xl border border-steel-200 text-[11px] text-steel-600 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-brand-royal flex-shrink-0 mt-0.5" />
                <span>
                  Demo Mode is active. Orders placed simulate the factory checkout workflow without capturing real money.
                </span>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full py-4 bg-brand-navy hover:bg-brand-royal text-white font-bold rounded-xl text-sm uppercase tracking-wider transition-all shadow-lg shadow-brand-navy/20 flex items-center justify-center gap-2"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
