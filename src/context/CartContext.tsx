import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../types/product';
import { CartItem, CartState } from '../types/cart';
import { SiteSettings } from '../types/settings';
import { INITIAL_SETTINGS } from '../services/seedData';

interface CartContextType {
  cart: CartState;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (
    product: Product,
    quantity?: number,
    selected_variant?: { variant_name: string; option_label: string; price_adjustment: number }
  ) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  settings: SiteSettings;
}

const CART_STORAGE_KEY = 'ge_ind_cart_v1';

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [settings] = useState<SiteSettings>(INITIAL_SETTINGS);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [items]);

  // Calculations
  const subtotal = items.reduce((sum, item) => sum + item.line_total, 0);
  const total_items = items.reduce((sum, item) => sum + item.quantity, 0);
  
  // Free shipping above threshold if subtotal > 0
  const shipping = subtotal === 0 
    ? 0 
    : subtotal >= settings.ecommerce.free_shipping_threshold 
      ? 0 
      : settings.ecommerce.shipping_flat_rate;

  // 18% GST (Tax) calculation
  const tax = subtotal > 0 ? (subtotal * settings.ecommerce.tax_rate_percentage) / 100 : 0;
  const total = subtotal + shipping + tax;

  const cartState: CartState = {
    items,
    subtotal,
    shipping,
    tax,
    total,
    total_items,
  };

  const addToCart = (
    product: Product,
    quantity: number = 1,
    selected_variant?: { variant_name: string; option_label: string; price_adjustment: number }
  ) => {
    const variantKey = selected_variant ? `${selected_variant.variant_name}-${selected_variant.option_label}` : 'standard';
    const itemId = `${product.id}-${variantKey}`;
    const unitPrice = product.price + (selected_variant?.price_adjustment || 0);

    setItems((prevItems) => {
      const existingIdx = prevItems.findIndex((it) => it.id === itemId);
      if (existingIdx > -1) {
        const current = prevItems[existingIdx];
        const newQty = Math.min(current.quantity + quantity, product.stock_quantity || 99);
        const updated = [...prevItems];
        updated[existingIdx] = {
          ...current,
          quantity: newQty,
          line_total: newQty * unitPrice,
        };
        return updated;
      } else {
        const newItem: CartItem = {
          id: itemId,
          product_id: product.id,
          product,
          quantity: Math.min(quantity, product.stock_quantity || 99),
          selected_variant,
          unit_price: unitPrice,
          line_total: quantity * unitPrice,
        };
        return [...prevItems, newItem];
      }
    });

    setIsCartOpen(true);
  };

  const removeFromCart = (itemId: string) => {
    setItems((prev) => prev.filter((it) => it.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setItems((prev) =>
      prev.map((it) => {
        if (it.id === itemId) {
          const maxStock = it.product.stock_quantity || 99;
          const clampedQty = Math.min(quantity, maxStock);
          return {
            ...it,
            quantity: clampedQty,
            line_total: clampedQty * it.unit_price,
          };
        }
        return it;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cart: cartState,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        settings,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
