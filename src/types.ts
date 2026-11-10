export interface Product {
  id: number;
  title: string;
  titleEn?: string;
  category: 'phones' | 'laptops' | 'tvs' | 'audio' | 'watches' | 'gaming' | 'accessories' | 'cameras';
  price: number;
  oldPrice?: number;
  discount?: number;
  rating: number;
  reviewsCount: number;
  image: string;
  express: boolean;
  stock: number;
  stockPercent?: number;
  brand: string;
  isFlash: boolean;
  specs: string;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  productId: number;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

export interface OrderStatusHistory {
  status: OrderStatus;
  timestamp: string;
  note: string;
}

export interface Order {
  id: string; // e.g. "EG-10842"
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  city: string;
  paymentMethod: 'cod' | 'card' | 'fawry' | 'valu';
  totalAmount: number;
  items: OrderItem[];
  status: OrderStatus;
  trackingCode: string;
  courierName: string;
  courierPhone: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  history: OrderStatusHistory[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin';
}

export interface TelegramMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  buttons?: { text: string; payload: string }[];
}

export interface StoreMetrics {
  totalSales: number;
  totalOrders: number;
  pendingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  totalProducts: number;
  lowStockCount: number;
}
