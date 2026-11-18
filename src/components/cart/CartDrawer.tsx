import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const CartDrawer: React.FC = () => {
  const { cart, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, settings } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  const handleContinueShopping = () => {
    setIsCartOpen(false);
  };

  const freeShippingThreshold = settings.ecommerce.free_shipping_threshold;
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - cart.subtotal);
  const freeShippingProgress = Math.min(100, (cart.subtotal / freeShippingThreshold) * 100);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-brand-dark/75 backdrop-blur-sm transition-opacity"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 240 }}
              className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-steel-200"
            >
              {/* Header */}
              <div className="p-5 border-b border-steel-200 flex items-center justify-between bg-brand-light">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-brand-navy flex items-center justify-center text-white">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-brand-navy tracking-tight">
                      Equipment Cart
                    </h3>
                    <p className="text-xs text-steel-500 font-medium">
                      {cart.total_items} {cart.total_items === 1 ? 'item' : 'items'} in your order
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 text-steel-400 hover:text-brand-navy rounded-lg hover:bg-steel-200/50 transition-colors"
                  aria-label="Close cart"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Free Shipping Progress Indicator */}
              <div className="bg-brand-navy/5 p-3.5 border-b border-steel-200">
                <div className="flex items-center justify-between text-xs font-semibold text-brand-navy mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-brand-accent" />
                    {amountNeededForFreeShipping > 0 ? (
                      <span>Add ₹{amountNeededForFreeShipping.toLocaleString('en-IN')} for Free Freight</span>
                    ) : (
                      <span className="text-emerald-700 font-bold">✓ Free Freight Delivery Unlocked!</span>
                    )}
                  </span>
                  <span>{Math.round(freeShippingProgress)}%</span>
                </div>
                <div className="w-full bg-steel-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-brand-accent h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>

              {/* Cart Items List */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {cart.items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                    <div className="w-20 h-20 rounded-full bg-brand-light flex items-center justify-center text-steel-400 border border-steel-200">
                      <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-brand-navy">Your Cart is Empty</h4>
                      <p className="text-sm text-steel-500 mt-1 max-w-xs">
                        Explore our manufactured power racks, benches, and strength training equipment.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setIsCartOpen(false);
                        navigate('/shop');
                      }}
                      className="px-6 py-2.5 bg-brand-navy text-white text-sm font-semibold rounded-lg hover:bg-brand-royal transition-colors shadow-md"
                    >
                      Browse Equipment
                    </button>
                  </div>
                ) : (
                  cart.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 p-3.5 rounded-xl border border-steel-200 hover:border-brand-royal/30 bg-white transition-all shadow-sm"
                    >
                      {/* Product Thumbnail */}
                      <div className="w-20 h-20 bg-brand-light rounded-lg p-1.5 flex-shrink-0 flex items-center justify-center border border-steel-100">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>

                      {/* Details & Controls */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start gap-2">
                            <h5 className="text-sm font-bold text-brand-navy leading-snug">
                              {item.product.name}
                            </h5>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-steel-400 hover:text-red-500 transition-colors p-1"
                              title="Remove item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          {item.selected_variant && (
                            <p className="text-xs text-steel-500 mt-0.5">
                              {item.selected_variant.variant_name}: <span className="font-medium text-brand-navy">{item.selected_variant.option_label}</span>
                            </p>
                          )}
                          <p className="text-xs font-mono text-steel-400">
                            Model: {item.product.model}
                          </p>
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          {/* Quantity stepper */}
                          <div className="flex items-center border border-steel-300 rounded-lg overflow-hidden bg-white">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="px-2 py-1 text-steel-600 hover:bg-steel-100 transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="px-3 py-0.5 text-xs font-semibold text-brand-navy">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="px-2 py-1 text-steel-600 hover:bg-steel-100 transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Line total */}
                          <div className="text-right">
                            <span className="text-sm font-bold text-brand-navy">
                              ₹{item.line_total.toLocaleString('en-IN')}
                            </span>
                            {item.quantity > 1 && (
                              <p className="text-[10px] text-steel-400">
                                ₹{item.unit_price.toLocaleString('en-IN')} each
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer Calculations & Actions */}
              {cart.items.length > 0 && (
                <div className="p-5 border-t border-steel-200 bg-brand-light space-y-3">
                  <div className="space-y-1.5 text-xs text-steel-600 font-medium">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-semibold text-brand-navy">₹{cart.subtotal.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Standard Heavy Freight Shipping</span>
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
                      <span className="font-semibold text-brand-navy">₹{cart.tax.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="border-t border-steel-200 pt-2 flex justify-between text-base font-bold text-brand-navy">
                      <span>Estimated Total</span>
                      <span className="text-brand-accent">₹{cart.total.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] text-steel-500">
                    <ShieldCheck className="w-3.5 h-3.5 text-brand-royal flex-shrink-0" />
                    <span>Demo mode enabled. Safe simulated checkout test.</span>
                  </div>

                  <div className="space-y-2 pt-1">
                    <button
                      onClick={handleCheckout}
                      className="w-full py-3 px-4 bg-brand-royal hover:bg-brand-navy text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-brand-royal/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
                    >
                      <span>Proceed to Checkout</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleContinueShopping}
                      className="w-full py-2.5 px-4 bg-white hover:bg-steel-100 text-steel-700 text-xs font-semibold rounded-xl border border-steel-300 transition-colors text-center"
                    >
                      Continue Browsing
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
