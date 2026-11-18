import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product, Category } from '../types/product';
import { Order, FulfilmentStatus, PaymentStatus } from '../types/order';
import { BulkEnquiry, EnquiryStatus } from '../types/enquiry';
import { SiteSettings } from '../types/settings';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_CATEGORIES, 
  INITIAL_SETTINGS, 
  INITIAL_ORDERS, 
  INITIAL_ENQUIRIES 
} from '../services/seedData';
import * as storage from '../services/storageService';

interface StoreContextType {
  products: Product[];
  categories: Category[];
  orders: Order[];
  enquiries: BulkEnquiry[];
  settings: SiteSettings;
  isLoading: boolean;
  refreshProducts: () => Promise<void>;
  refreshOrders: () => Promise<void>;
  refreshEnquiries: () => Promise<void>;
  refreshSettings: () => Promise<void>;
  saveProduct: (product: Product) => Promise<Product>;
  deleteProduct: (id: string) => Promise<boolean>;
  updateOrderStatus: (orderId: string, fulfilment: FulfilmentStatus, payment: PaymentStatus, notes?: string) => Promise<Order | null>;
  updateEnquiryStatus: (enquiryId: string, status: EnquiryStatus, internalNotes?: string) => Promise<BulkEnquiry | null>;
  createOrder: (order: Omit<Order, 'id' | 'order_number' | 'created_at' | 'updated_at'>) => Promise<Order>;
  createEnquiry: (enquiry: Omit<BulkEnquiry, 'id' | 'status' | 'created_at' | 'updated_at'>) => Promise<BulkEnquiry>;
  saveSettings: (settings: SiteSettings) => Promise<SiteSettings>;
  resetSeedData: () => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [orders, setOrders] = useState<Order[]>([]);
  const [enquiries, setEnquiries] = useState<BulkEnquiry[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(INITIAL_SETTINGS);
  const [isLoading, setIsLoading] = useState(false);

  const refreshProducts = useCallback(async () => {
    const list = await storage.getProducts();
    setProducts(list);
  }, []);

  const refreshCategories = useCallback(async () => {
    const cats = await storage.getCategories();
    setCategories(cats);
  }, []);

  const refreshOrders = useCallback(async () => {
    const ords = await storage.getOrders();
    setOrders(ords);
  }, []);

  const refreshEnquiries = useCallback(async () => {
    const enqs = await storage.getEnquiries();
    setEnquiries(enqs);
  }, []);

  const refreshSettings = useCallback(async () => {
    const s = await storage.getSettings();
    setSettings(s);
  }, []);

  const initStore = useCallback(async () => {
    setIsLoading(true);
    await Promise.all([
      refreshProducts(),
      refreshCategories(),
      refreshOrders(),
      refreshEnquiries(),
      refreshSettings(),
    ]);
    setIsLoading(false);
  }, [refreshProducts, refreshCategories, refreshOrders, refreshEnquiries, refreshSettings]);

  useEffect(() => {
    initStore();
  }, [initStore]);

  const handleSaveProduct = async (prod: Product) => {
    const res = await storage.saveProduct(prod);
    await refreshProducts();
    return res;
  };

  const handleDeleteProduct = async (id: string) => {
    const res = await storage.deleteProduct(id);
    await refreshProducts();
    return res;
  };

  const handleUpdateOrderStatus = async (
    orderId: string,
    fulfilment: FulfilmentStatus,
    payment: PaymentStatus,
    notes?: string
  ) => {
    const res = await storage.updateOrderStatus(orderId, fulfilment, payment, notes);
    await refreshOrders();
    return res;
  };

  const handleUpdateEnquiryStatus = async (
    enquiryId: string,
    status: EnquiryStatus,
    internalNotes?: string
  ) => {
    const res = await storage.updateEnquiryStatus(enquiryId, status, internalNotes);
    await refreshEnquiries();
    return res;
  };

  const handleCreateOrder = async (orderData: Omit<Order, 'id' | 'order_number' | 'created_at' | 'updated_at'>) => {
    const res = await storage.createOrder(orderData);
    await refreshOrders();
    return res;
  };

  const handleCreateEnquiry = async (enquiryData: Omit<BulkEnquiry, 'id' | 'status' | 'created_at' | 'updated_at'>) => {
    const res = await storage.createEnquiry(enquiryData);
    await refreshEnquiries();
    return res;
  };

  const handleSaveSettings = async (newSettings: SiteSettings) => {
    const res = await storage.saveSettings(newSettings);
    setSettings(res);
    return res;
  };

  const handleResetSeedData = async () => {
    storage.resetToDemoSeed();
    await initStore();
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        orders,
        enquiries,
        settings,
        isLoading,
        refreshProducts,
        refreshOrders,
        refreshEnquiries,
        refreshSettings,
        saveProduct: handleSaveProduct,
        deleteProduct: handleDeleteProduct,
        updateOrderStatus: handleUpdateOrderStatus,
        updateEnquiryStatus: handleUpdateEnquiryStatus,
        createOrder: handleCreateOrder,
        createEnquiry: handleCreateEnquiry,
        saveSettings: handleSaveSettings,
        resetSeedData: handleResetSeedData,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
