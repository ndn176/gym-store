import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Product, CartItem, Order, UserProfile } from '../types';
import { productsApi } from '../api/products';
import { authApi } from '../api/auth';
import { ordersApi } from '../api/orders';
import { ApiError } from '../api/client';

const CART_STORAGE_KEY = 'ia_cart';

function loadCartFromStorage(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

interface AppContextValue {
  // Toast
  toastMessage: string | null;
  triggerToast: (msg: string) => void;
  clearToast: () => void;

  // Cart (persisted client-side, tied to the browser rather than the account —
  // same pattern most storefronts use for guest carts)
  cart: CartItem[];
  cartCount: number;
  handleAddToCart: (product: Product, size: string, quantity: number) => void;
  handleUpdateQuantity: (productId: string, size: string, quantity: number) => void;
  handleRemoveItem: (productId: string, size: string) => void;
  clearCart: () => void;

  // Auth (backed by /api/auth/*, JWT stored in localStorage)
  currentUser: UserProfile | null;
  authLoading: boolean;
  authError: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, phone: string, password: string) => Promise<boolean>;
  handleUpdateUser: (profile: Partial<UserProfile>) => Promise<void>;
  handleLogout: () => void;
  authMode: 'login' | 'register';
  setAuthMode: (mode: 'login' | 'register') => void;

  // Customer's own orders
  orders: Order[];
  ordersLoading: boolean;
  currentOrder: Order | null;
  handlePlaceOrder: (order: Order) => Promise<boolean>;
  handleCancelOrder: (orderId: string) => Promise<void>;
  accountSubTab: 'profile' | 'orders';
  setAccountSubTab: (tab: 'profile' | 'orders') => void;

  // Shared product catalogue (read by storefront, written by admin)
  products: Product[];
  productsLoading: boolean;
  productsError: string | null;
  refetchProducts: () => Promise<void>;
  handleSaveProduct: (product: Product, isNew: boolean) => Promise<boolean>;
  handleDeleteProduct: (id: string) => Promise<void>;
  handleUpdateStock: (id: string, nextVal: number) => Promise<void>;

  // Search overlay
  searchOverlayOpen: boolean;
  setSearchOverlayOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const triggerToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 4500);
  }, []);
  const clearToast = useCallback(() => setToastMessage(null), []);

  // Search overlay
  const [searchOverlayOpen, setSearchOverlayOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // ---- Product catalogue (real backend) ----
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState<string | null>(null);

  const refetchProducts = useCallback(async () => {
    setProductsLoading(true);
    setProductsError(null);
    try {
      const { products: list } = await productsApi.list();
      setProducts(list);
    } catch (err) {
      setProductsError(err instanceof ApiError ? err.message : 'Không tải được danh sách sản phẩm.');
    } finally {
      setProductsLoading(false);
    }
  }, []);

  useEffect(() => {
    refetchProducts();
  }, [refetchProducts]);

  const handleSaveProduct = useCallback(async (product: Product, isNew: boolean) => {
    try {
      if (isNew) {
        const { product: created } = await productsApi.create(product);
        setProducts((prev) => [...prev, created]);
      } else {
        const { product: updated } = await productsApi.update(product.id, product);
        setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      }
      return true;
    } catch (err) {
      triggerToast(err instanceof ApiError ? err.message : 'Không lưu được sản phẩm.');
      return false;
    }
  }, [triggerToast]);

  const handleDeleteProduct = useCallback(async (id: string) => {
    try {
      await productsApi.remove(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      triggerToast(err instanceof ApiError ? err.message : 'Không xoá được sản phẩm.');
    }
  }, [triggerToast]);

  const handleUpdateStock = useCallback(async (id: string, nextVal: number) => {
    try {
      const { product: updated } = await productsApi.updateStock(id, nextVal);
      setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    } catch (err) {
      triggerToast(err instanceof ApiError ? err.message : 'Không cập nhật được tồn kho.');
    }
  }, [triggerToast]);

  // ---- Cart (local, persisted to localStorage) ----
  const [cart, setCart] = useState<CartItem[]>(() => loadCartFromStorage());

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  const handleAddToCart = useCallback((product: Product, size: string, quantity: number) => {
    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (item) => item.product.id === product.id && item.size === size
      );
      if (existingIdx > -1) {
        const nextCart = [...prev];
        nextCart[existingIdx].quantity += quantity;
        return nextCart;
      }
      return [...prev, { product, size, quantity }];
    });
  }, []);

  const handleUpdateQuantity = useCallback((productId: string, size: string, quantity: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId && item.size === size ? { ...item, quantity } : item
      )
    );
  }, []);

  const handleRemoveItem = useCallback((productId: string, size: string) => {
    setCart((prev) => prev.filter((item) => !(item.product.id === productId && item.size === size)));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  // ---- Customer auth (JWT) ----
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  useEffect(() => {
    authApi
      .me()
      .then(({ user }) => setCurrentUser(user))
      .catch(() => {
        /* not logged in — expected on first visit / after cookie expiry */
      })
      .finally(() => setAuthLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setAuthError(null);
    try {
      const { user } = await authApi.login({ email, password });
      setCurrentUser(user);
      return true;
    } catch (err) {
      setAuthError(err instanceof ApiError ? err.message : 'Đăng nhập thất bại.');
      return false;
    }
  }, []);

  const register = useCallback(async (name: string, email: string, phone: string, password: string) => {
    setAuthError(null);
    try {
      const { user } = await authApi.register({ name, email, phone, password });
      setCurrentUser(user);
      return true;
    } catch (err) {
      setAuthError(err instanceof ApiError ? err.message : 'Đăng ký thất bại.');
      return false;
    }
  }, []);

  const handleUpdateUser = useCallback(async (profile: Partial<UserProfile>) => {
    try {
      const { user } = await authApi.updateProfile(profile);
      setCurrentUser(user);
      triggerToast('HỒ SƠ ĐÃ ĐƯỢC CẬP NHẬT.');
    } catch (err) {
      triggerToast(err instanceof ApiError ? err.message : 'Không cập nhật được hồ sơ.');
    }
  }, [triggerToast]);

  const handleLogout = useCallback(() => {
    authApi.logout().catch(() => {});
    setCurrentUser(null);
  }, []);

  // ---- Customer's own orders ----
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [accountSubTab, setAccountSubTab] = useState<'profile' | 'orders'>('profile');

  useEffect(() => {
    if (!currentUser) {
      setOrders([]);
      return;
    }
    setOrdersLoading(true);
    ordersApi
      .listMine()
      .then(({ orders: list }) => setOrders(list))
      .catch(() => triggerToast('Không tải được lịch sử đơn hàng.'))
      .finally(() => setOrdersLoading(false));
  }, [currentUser, triggerToast]);

  const handlePlaceOrder = useCallback(async (newOrder: Order) => {
    try {
      const { order: created } = await ordersApi.place(newOrder);
      setOrders((prev) => [created, ...prev]);
      setCurrentOrder(created);
      setCart([]);
      // Reflect the stock the server just decremented
      refetchProducts();
      return true;
    } catch (err) {
      triggerToast(err instanceof ApiError ? err.message : 'Không đặt được đơn hàng.');
      return false;
    }
  }, [triggerToast, refetchProducts]);

  const handleCancelOrder = useCallback(async (orderId: string) => {
    try {
      const { order: updated } = await ordersApi.cancelMine(orderId);
      setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
    } catch (err) {
      triggerToast(err instanceof ApiError ? err.message : 'Không huỷ được đơn hàng.');
    }
  }, [triggerToast]);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const value: AppContextValue = {
    toastMessage,
    triggerToast,
    clearToast,
    cart,
    cartCount,
    handleAddToCart,
    handleUpdateQuantity,
    handleRemoveItem,
    clearCart,
    currentUser,
    authLoading,
    authError,
    login,
    register,
    handleUpdateUser,
    handleLogout,
    authMode,
    setAuthMode,
    orders,
    ordersLoading,
    currentOrder,
    handlePlaceOrder,
    handleCancelOrder,
    accountSubTab,
    setAccountSubTab,
    products,
    productsLoading,
    productsError,
    refetchProducts,
    handleSaveProduct,
    handleDeleteProduct,
    handleUpdateStock,
    searchOverlayOpen,
    setSearchOverlayOpen,
    searchQuery,
    setSearchQuery,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within an AppProvider');
  return ctx;
}
