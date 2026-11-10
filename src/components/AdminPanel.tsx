import React, { useState, useEffect } from 'react';
import { 
  X, 
  BarChart3, 
  Package, 
  ShoppingCart, 
  Plus, 
  Send, 
  Database, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Truck, 
  Edit3, 
  Trash2, 
  RefreshCw,
  Search,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  PieChart,
  SlidersHorizontal,
  Eye,
  Zap,
  Save,
  Check
} from 'lucide-react';
import type { Order, Product, StoreMetrics, OrderStatus } from '../types';
import { formatEGP, formatDate } from '../utils/format';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onRefreshProducts: () => void;
  lang: 'ar' | 'en';
}

interface AnalyticsData {
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
  timeline: { day: string; date: string; revenue: number; orders: number }[];
  categorySales: { category: string; labelAr: string; productCount: number; revenue: number; unitsSold: number; stockTotal: number }[];
  statusBreakdown: { status: string; labelAr: string; count: number; percent: number; color: string }[];
  topProducts: { id: number; title: string; price: number; stock: number; category: string; brand: string; image: string; unitsSold: number; totalRevenue: number }[];
  stockHealth: { healthy: number; low: number; outOfStock: number; totalCatalogItems: number };
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  products,
  onRefreshProducts,
  lang
}) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'orders' | 'inventory' | 'supabase'>('analytics');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [orderSearch, setOrderSearch] = useState('');
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  // Analytics data
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);

  // Product Customization / Edit Modal
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [savingProduct, setSavingProduct] = useState(false);

  // Add Product Form Toggle
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProd, setNewProd] = useState({
    title: '',
    titleEn: '',
    category: 'phones' as Product['category'],
    price: '',
    oldPrice: '',
    brand: 'Samsung',
    stock: '15',
    express: true,
    isFlash: false,
    specs: '',
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&auto=format&fit=crop&q=80'
  });

  // Supabase Configuration State
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseKey, setSupabaseKey] = useState('');
  const [supabaseStatus, setSupabaseStatus] = useState<string>('جاري الفحص...');
  const [supabaseSaved, setSupabaseSaved] = useState(false);

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (data.success) setOrders(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const fetchAnalytics = async () => {
    setLoadingAnalytics(true);
    try {
      const res = await fetch('/api/admin/analytics');
      const data = await res.json();
      if (data.success) setAnalytics(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  const fetchSupabaseConfig = async () => {
    try {
      const res = await fetch('/api/config/supabase');
      const data = await res.json();
      if (data.success) {
        setSupabaseStatus(data.data.isConnected ? 'متصل بنجاح بالسحابة (Supabase Cloud Connected)' : 'وضع قاعدة البيانات المحلية (Local Postgres Engine)');
      }
    } catch {
      setSupabaseStatus('قيد التشغيل محلياً');
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchAnalytics();
      fetchOrders();
      fetchSupabaseConfig();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Order status update handler
  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingOrderId(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setOrders(orders.map(o => o.id === orderId ? data.data : o));
        fetchAnalytics();
      }
    } catch (err) {
      alert('فشل تحديث الحالة: ' + err);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // Product save edit handler
  const handleSaveProductEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    setSavingProduct(true);
    try {
      const res = await fetch(`/api/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingProduct)
      });
      const data = await res.json();
      if (data.success) {
        setEditingProduct(null);
        onRefreshProducts();
        fetchAnalytics();
        alert('تم حفظ وتخصيص المنتج بنجاح في المتجر!');
      } else {
        alert(data.message || 'فشل تحديث المنتج');
      }
    } catch (err) {
      alert('خطأ في الاتصال بالخادم');
    } finally {
      setSavingProduct(false);
    }
  };

  // Product add handler
  const handleAddProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProd.title || !newProd.price) return;

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newProd,
          price: Number(newProd.price),
          oldPrice: newProd.oldPrice ? Number(newProd.oldPrice) : undefined,
          stock: Number(newProd.stock)
        })
      });
      const data = await res.json();
      if (data.success) {
        setShowAddProduct(false);
        onRefreshProducts();
        fetchAnalytics();
        alert('تمت إضافة المنتج بنجاح إلى المتجر!');
      }
    } catch (err) {
      alert('فشل إضافة المنتج');
    }
  };

  // Product delete handler
  const handleDeleteProduct = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا المنتج؟')) return;
    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
      onRefreshProducts();
      fetchAnalytics();
    } catch (err) {
      alert('فشل حذف المنتج');
    }
  };

  // Supabase save handler
  const handleSaveSupabase = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/config/supabase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: supabaseUrl, anonKey: supabaseKey })
      });
      const data = await res.json();
      setSupabaseSaved(true);
      setTimeout(() => setSupabaseSaved(false), 4000);
      fetchSupabaseConfig();
      alert(data.message);
    } catch (err) {
      alert('فشل حفظ إعدادات Supabase');
    }
  };

  const filteredOrders = orders.filter(o => 
    o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
    o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
    o.customerPhone.includes(orderSearch)
  );

  // Maximum timeline value for scaling bar chart
  const maxRevenueInTimeline = analytics?.timeline.reduce((max, d) => Math.max(max, d.revenue), 1) || 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[94vh] flex flex-col z-10 overflow-hidden border border-gray-200">
        
        {/* Header */}
        <div className="p-4 bg-[#282828] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#F68B1E] text-white flex items-center justify-center font-bold shadow-md">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base">
                  {lang === 'ar' ? 'لوحة تحكم إدارة المتجر والمبيعات' : 'Store Admin & Analytics Console'}
                </h3>
                <span className="bg-orange-500/30 text-[#F68B1E] border border-orange-500/40 text-[10px] font-bold px-2 py-0.5 rounded">
                  Admin: mahmoud@admin.com
                </span>
              </div>
              <p className="text-[11px] text-gray-400">
                {lang === 'ar' ? 'تحليلات تفصيلية للمبيعات، تخصيص وتعديل أي منتج، وإدارة الشحنات وSupabase' : 'Sales analytics, product customization, and Supabase integration'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-gray-50 border-b border-gray-200 px-4 flex items-center gap-2 sm:gap-4 overflow-x-auto no-scrollbar text-xs font-bold">
          
          {/* Tab 1: Full Analytics */}
          <button
            onClick={() => setActiveTab('analytics')}
            className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'analytics' 
                ? 'border-[#F68B1E] text-[#F68B1E]' 
                : 'border-transparent text-gray-600 hover:text-[#F68B1E]'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>{lang === 'ar' ? 'التحليلات والمبيعات الشاملة (Charts)' : 'Sales & Charts Analytics'}</span>
          </button>

          {/* Tab 2: Orders */}
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'orders' 
                ? 'border-[#F68B1E] text-[#F68B1E]' 
                : 'border-transparent text-gray-600 hover:text-[#F68B1E]'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>{lang === 'ar' ? `الطلبات والشحنات (${orders.length})` : `Orders (${orders.length})`}</span>
          </button>

          {/* Tab 3: Inventory & Customization */}
          <button
            onClick={() => setActiveTab('inventory')}
            className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'inventory' 
                ? 'border-[#F68B1E] text-[#F68B1E]' 
                : 'border-transparent text-gray-600 hover:text-[#F68B1E]'
            }`}
          >
            <Edit3 className="w-4 h-4" />
            <span>{lang === 'ar' ? `تخصيص وتعديل المنتجات (${products.length})` : `Edit Products (${products.length})`}</span>
          </button>

          {/* Tab 4: Supabase Connection */}
          <button
            onClick={() => setActiveTab('supabase')}
            className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'supabase' 
                ? 'border-[#F68B1E] text-[#F68B1E]' 
                : 'border-transparent text-gray-600 hover:text-[#F68B1E]'
            }`}
          >
            <Database className="w-4 h-4 text-emerald-600" />
            <span>{lang === 'ar' ? 'ربط قاعدة بيانات Supabase' : 'Connect Supabase'}</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-[#F9FAFB]">
          
          {/* ========================================================= */}
          {/* TAB 1: FULL ANALYSIS & CHARTS */}
          {/* ========================================================= */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              
              {/* KPI Header Grid */}
              {analytics && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
                    <span className="text-[11px] text-gray-500 font-semibold block mb-1">
                      {lang === 'ar' ? 'إجمالي المبيعات (GMV)' : 'Total Revenue'}
                    </span>
                    <span className="text-xl font-black text-[#282828] font-mono block">
                      {formatEGP(analytics.totalSales, lang)}
                    </span>
                    <span className="text-[10px] text-green-600 font-bold mt-1 inline-block">
                      +18.4% {lang === 'ar' ? 'مقارنة بالأسبوع الماضي' : 'vs last week'}
                    </span>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
                    <span className="text-[11px] text-gray-500 font-semibold block mb-1">
                      {lang === 'ar' ? 'متوسط قيمة الطلب (AOV)' : 'Avg Order Value'}
                    </span>
                    <span className="text-xl font-black text-blue-700 font-mono block">
                      {formatEGP(analytics.averageOrderValue, lang)}
                    </span>
                    <span className="text-[10px] text-gray-400 mt-1 inline-block">
                      {lang === 'ar' ? 'معدل سلة الشراء لكل عميل' : 'Basket size'}
                    </span>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
                    <span className="text-[11px] text-gray-500 font-semibold block mb-1">
                      {lang === 'ar' ? 'إجمالي عدد الطلبات' : 'Total Orders'}
                    </span>
                    <span className="text-xl font-black text-amber-600 font-mono block">
                      {analytics.totalOrders} {lang === 'ar' ? 'طلب' : 'orders'}
                    </span>
                    <span className="text-[10px] text-gray-400 mt-1 inline-block">
                      {lang === 'ar' ? 'معدل تسليم 100%' : '100% fulfillment rate'}
                    </span>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
                    <span className="text-[11px] text-gray-500 font-semibold block mb-1">
                      {lang === 'ar' ? 'عدد المنتجات النشطة' : 'Active Catalog'}
                    </span>
                    <span className="text-xl font-black text-purple-700 font-mono block">
                      {products.length} {lang === 'ar' ? 'جهاز' : 'devices'}
                    </span>
                    <span className="text-[10px] text-red-500 font-semibold mt-1 inline-block">
                      {analytics.stockHealth.low} {lang === 'ar' ? 'أجهزة بمخزون منخفض' : 'low stock'}
                    </span>
                  </div>
                </div>
              )}

              {/* Chart 1: Revenue & Order Sales Velocity Over Time (Interactive Bar Chart) */}
              {analytics && (
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs space-y-4">
                  <div className="flex flex-wrap justify-between items-center gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-[#282828] flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-[#F68B1E]" />
                        <span>{lang === 'ar' ? 'مخطط سرعة وحجم المبيعات اليومية (Daily Sales Velocity)' : 'Daily Revenue & Volume Timeline'}</span>
                      </h4>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        {lang === 'ar' ? 'متابعة تدفق المبيعات اليومية وقيمة الطلبات بالجنيه المصري' : 'Daily sales volume tracking in EGP'}
                      </p>
                    </div>

                    <button 
                      onClick={fetchAnalytics}
                      className="text-xs text-gray-500 hover:text-[#F68B1E] flex items-center gap-1 font-semibold"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${loadingAnalytics ? 'animate-spin' : ''}`} />
                      <span>{lang === 'ar' ? 'تحديث المخطط' : 'Refresh'}</span>
                    </button>
                  </div>

                  {/* SVG Bar Chart with Tooltips */}
                  <div className="pt-4">
                    <div className="h-56 flex items-end gap-2 sm:gap-4 border-b border-gray-200 pb-2 px-2">
                      {analytics.timeline.map((item, idx) => {
                        const heightPercent = Math.max(12, Math.round((item.revenue / maxRevenueInTimeline) * 100));
                        return (
                          <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative">
                            {/* Hover Tooltip */}
                            <div className="absolute -top-12 bg-[#282828] text-white text-[10px] font-mono py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20 shadow-md">
                              {formatEGP(item.revenue, lang)} ({item.orders} {lang === 'ar' ? 'طلب' : 'ord'})
                            </div>

                            {/* Bar Column */}
                            <div 
                              className="w-full max-w-[42px] bg-gradient-to-t from-[#F68B1E] to-amber-400 rounded-t-md transition-all group-hover:brightness-110 shadow-xs cursor-pointer"
                              style={{ height: `${heightPercent}%` }}
                            />
                            
                            {/* Date Label */}
                            <div className="text-center">
                              <span className="text-[10px] font-bold text-gray-700 block">{item.day}</span>
                              <span className="text-[9px] text-gray-400 font-mono block">{item.date}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Grid: Category Breakdown + Order Status Funnel */}
              {analytics && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  
                  {/* Category Breakdown */}
                  <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs space-y-3">
                    <h4 className="text-sm font-bold text-[#282828] flex items-center gap-2">
                      <PieChart className="w-4 h-4 text-[#F68B1E]" />
                      <span>{lang === 'ar' ? 'توزيع المبيعات حسب أقسام الأجهزة' : 'Sales by Product Category'}</span>
                    </h4>
                    <p className="text-[11px] text-gray-500">
                      {lang === 'ar' ? 'نسبة مساهمة كل قسم في إجمالي إيرادات المتجر' : 'Category share of total revenue'}
                    </p>

                    <div className="space-y-2.5 pt-2">
                      {analytics.categorySales.map((cat, i) => {
                        const percentOfTotal = Math.round((cat.revenue / analytics.totalSales) * 100) || 5;
                        return (
                          <div key={i} className="space-y-1">
                            <div className="flex justify-between text-xs font-semibold">
                              <span className="text-[#282828]">{cat.labelAr}</span>
                              <span className="font-mono text-[#F68B1E]">{formatEGP(cat.revenue, lang)} ({percentOfTotal}%)</span>
                            </div>
                            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                              <div 
                                className="h-full rounded-full bg-[#F68B1E]"
                                style={{ width: `${percentOfTotal}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Order Status Funnel & Fulfillment */}
                  <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs space-y-3">
                    <h4 className="text-sm font-bold text-[#282828] flex items-center gap-2">
                      <Truck className="w-4 h-4 text-blue-600" />
                      <span>{lang === 'ar' ? 'مراحل تنفيذ وتوصيل الشحنات' : 'Fulfillment Status Distribution'}</span>
                    </h4>
                    <p className="text-[11px] text-gray-500">
                      {lang === 'ar' ? 'متابعة مسار الشحنات من التجهيز وحتى الاستلام النهائي' : 'Shipment progression breakdown'}
                    </p>

                    <div className="space-y-3 pt-2">
                      {analytics.statusBreakdown.map((st, i) => (
                        <div key={i} className="flex items-center justify-between p-2.5 rounded-lg border border-gray-100 bg-gray-50/70">
                          <div className="flex items-center gap-2.5">
                            <div 
                              className="w-3.5 h-3.5 rounded-full"
                              style={{ backgroundColor: st.color }}
                            />
                            <span className="text-xs font-bold text-[#282828]">{st.labelAr}</span>
                          </div>
                          <div className="text-xs font-mono font-bold text-gray-700">
                            <span>{st.count} {lang === 'ar' ? 'شحنات' : 'orders'}</span>
                            <span className="text-gray-400 mr-2">({st.percent}%)</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* Best Selling Products Leaderboard */}
              {analytics && (
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs space-y-3">
                  <h4 className="text-sm font-bold text-[#282828] flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-500" />
                    <span>{lang === 'ar' ? 'أكثر الأجهزة مبيعاً وإيراداً في المتجر' : 'Top Selling Products Leaderboard'}</span>
                  </h4>

                  <div className="divide-y divide-gray-100 border border-gray-200 rounded-xl overflow-hidden">
                    {analytics.topProducts.map((p, idx) => (
                      <div key={p.id} className="p-3 flex items-center justify-between text-xs hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-orange-100 text-[#F68B1E] font-black flex items-center justify-center font-mono">
                            #{idx + 1}
                          </span>
                          <img src={p.image} alt={p.title} className="w-10 h-10 object-contain rounded p-1 bg-white border border-gray-100" />
                          <div>
                            <h5 className="font-bold text-[#282828] line-clamp-1">{p.title}</h5>
                            <span className="text-[10px] text-gray-500">{p.brand} • متبقي {p.stock} قطعة</span>
                          </div>
                        </div>

                        <div className="text-left font-mono">
                          <span className="font-black text-sm text-[#282828] block">{formatEGP(p.totalRevenue, lang)}</span>
                          <span className="text-[11px] text-green-600 font-semibold">{p.unitsSold} {lang === 'ar' ? 'وحدة مباعة' : 'units sold'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: ORDERS MANAGEMENT */}
          {/* ========================================================= */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div className="relative w-full sm:w-72">
                  <input 
                    type="text"
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    placeholder={lang === 'ar' ? 'بحث برقم الطلب، العميل، أو الهاتف...' : 'Search by ID, name, or phone...'}
                    className="w-full text-xs p-2 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:border-[#F68B1E] bg-white"
                  />
                  <Search className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2" />
                </div>

                <button 
                  onClick={fetchOrders}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingOrders ? 'animate-spin' : ''}`} />
                  <span>{lang === 'ar' ? 'تحديث الطلبات' : 'Refresh Orders'}</span>
                </button>
              </div>

              {filteredOrders.length > 0 ? (
                <div className="space-y-3">
                  {filteredOrders.map((ord) => (
                    <div 
                      key={ord.id}
                      className="border border-gray-200 rounded-xl p-4 bg-white shadow-xs hover:border-[#F68B1E] transition-all space-y-3 text-xs"
                    >
                      <div className="flex flex-wrap justify-between items-center gap-2 border-b border-gray-100 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sm text-[#282828] bg-gray-100 px-2 py-0.5 rounded">
                            {ord.id}
                          </span>
                          <span className="text-gray-500 font-mono text-[11px]">
                            {ord.trackingCode}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            ord.status === 'delivered' ? 'bg-green-100 text-green-700' :
                            ord.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                            ord.status === 'processing' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {ord.status === 'delivered' ? 'تم التوصيل' : ord.status === 'shipped' ? 'خرج للتوصيل' : ord.status === 'processing' ? 'قيد التجهيز' : 'قيد المراجعة'}
                          </span>
                        </div>

                        <div className="font-bold text-[#F68B1E] font-mono text-sm">
                          {formatEGP(ord.totalAmount, lang)} ({ord.paymentMethod === 'cod' ? 'دفع عند الاستلام' : 'مدفوع إلكترونياً'})
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-gray-600">
                        <div>
                          <strong className="block text-[#282828]">{ord.customerName}</strong>
                          <span>📞 {ord.customerPhone}</span>
                        </div>
                        <div>
                          <span className="block text-[#282828]">📍 {ord.customerAddress}</span>
                          <span className="text-gray-400">{ord.city}</span>
                        </div>
                        <div className="text-[11px]">
                          <span>🛵 المندوب: {ord.courierName}</span>
                          <span className="block text-gray-400">تاريخ: {formatDate(ord.createdAt, lang)}</span>
                        </div>
                      </div>

                      {/* Items row */}
                      <div className="bg-gray-50 p-2 rounded-lg flex flex-wrap gap-2 items-center">
                        <span className="text-[11px] text-gray-500 font-bold">العناصر:</span>
                        {ord.items.map((it, i) => (
                          <span key={i} className="text-[11px] bg-white border border-gray-200 px-2 py-0.5 rounded font-medium">
                            {it.title.substring(0, 24)}... (×{it.quantity})
                          </span>
                        ))}
                      </div>

                      {/* Status changer buttons */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-gray-100">
                        <span className="text-[11px] font-bold text-gray-500">
                          {lang === 'ar' ? 'تحديث حالة الشحنة المباشرة (يرسل إشعار فوري للعميل):' : 'Update status:'}
                        </span>
                        
                        <div className="flex flex-wrap gap-1.5">
                          <button
                            onClick={() => handleUpdateOrderStatus(ord.id, 'processing')}
                            disabled={updatingOrderId === ord.id || ord.status === 'processing'}
                            className="bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 px-2.5 py-1 rounded text-[11px] font-bold cursor-pointer disabled:opacity-50"
                          >
                            📦 تجهيز بالمستودع
                          </button>
                          <button
                            onClick={() => handleUpdateOrderStatus(ord.id, 'shipped')}
                            disabled={updatingOrderId === ord.id || ord.status === 'shipped'}
                            className="bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 px-2.5 py-1 rounded text-[11px] font-bold cursor-pointer disabled:opacity-50"
                          >
                            🚚 تسليم للمندوب
                          </button>
                          <button
                            onClick={() => handleUpdateOrderStatus(ord.id, 'delivered')}
                            disabled={updatingOrderId === ord.id || ord.status === 'delivered'}
                            className="bg-green-50 hover:bg-green-100 text-green-800 border border-green-200 px-2.5 py-1 rounded text-[11px] font-bold cursor-pointer disabled:opacity-50"
                          >
                            ✅ تم الاستلام والتوصيل
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-gray-500 text-xs">
                  لم يتم العثور على طلبات مطابقة
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 3: INVENTORY & PRODUCT CUSTOMIZATION */}
          {/* ========================================================= */}
          {activeTab === 'inventory' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#282828]">
                    {lang === 'ar' ? `قائمة الأجهزة وإمكانية تعديل وتخصيص أي منتج (${products.length})` : `Edit Products & Inventory (${products.length})`}
                  </h4>
                  <p className="text-[11px] text-gray-500">
                    {lang === 'ar' ? 'اضغط على زر (تعديل وتخصيص) لأي منتج لتغيير السعر، الصور، والمواصفات فورياً' : 'Click Edit & Customize to modify any product details'}
                  </p>
                </div>

                <button
                  onClick={() => setShowAddProduct(!showAddProduct)}
                  className="bg-[#F68B1E] hover:bg-[#e07a14] text-white text-xs font-bold px-3.5 py-2 rounded-lg flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>{lang === 'ar' ? 'إضافة جهاز جديد' : 'Add New Product'}</span>
                </button>
              </div>

              {/* Add Product Form */}
              {showAddProduct && (
                <form onSubmit={handleAddProductSubmit} className="bg-orange-50/70 border border-orange-200 rounded-xl p-4 space-y-3 text-xs">
                  <h5 className="font-bold text-[#282828] text-sm">بيانات الجهاز الجديد</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block font-semibold mb-1">اسم المنتج بالعربية *</label>
                      <input 
                        type="text" 
                        required 
                        value={newProd.title} 
                        onChange={(e) => setNewProd({ ...newProd, title: e.target.value })}
                        placeholder="آبل آيفون 16 برو - 256 جيجابايت"
                        className="w-full p-2 border border-gray-300 rounded bg-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">القسم *</label>
                      <select 
                        value={newProd.category} 
                        onChange={(e) => setNewProd({ ...newProd, category: e.target.value as any })}
                        className="w-full p-2 border border-gray-300 rounded bg-white text-xs"
                      >
                        <option value="phones">موبايلات</option>
                        <option value="laptops">لابتوب وكمبيوتر</option>
                        <option value="tvs">شاشات</option>
                        <option value="audio">صوتيات</option>
                        <option value="watches">ساعات ذكية</option>
                        <option value="gaming">ألعاب</option>
                        <option value="accessories">إكسسوارات</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold mb-1">السعر (ج.م) *</label>
                      <input 
                        type="number" 
                        required 
                        value={newProd.price} 
                        onChange={(e) => setNewProd({ ...newProd, price: e.target.value })}
                        placeholder="45000"
                        className="w-full p-2 border border-gray-300 rounded bg-white text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">السعر القديم قبل الخصم (ج.م)</label>
                      <input 
                        type="number" 
                        value={newProd.oldPrice} 
                        onChange={(e) => setNewProd({ ...newProd, oldPrice: e.target.value })}
                        placeholder="52000"
                        className="w-full p-2 border border-gray-300 rounded bg-white text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">الكمية بالمخزن</label>
                      <input 
                        type="number" 
                        value={newProd.stock} 
                        onChange={(e) => setNewProd({ ...newProd, stock: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded bg-white text-xs font-mono"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block font-semibold mb-1">المواصفات والضمان</label>
                      <input 
                        type="text" 
                        value={newProd.specs} 
                        onChange={(e) => setNewProd({ ...newProd, specs: e.target.value })}
                        placeholder="معالج حديث، كاميرا متطورة، ضمان محلي معتمد سنتين"
                        className="w-full p-2 border border-gray-300 rounded bg-white text-xs"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end pt-2">
                    <button 
                      type="button" 
                      onClick={() => setShowAddProduct(false)}
                      className="px-3 py-1.5 border border-gray-300 rounded text-gray-600 hover:bg-gray-100"
                    >
                      إلغاء
                    </button>
                    <button 
                      type="submit" 
                      className="px-4 py-1.5 bg-[#F68B1E] text-white font-bold rounded hover:bg-[#e07a14]"
                    >
                      حفظ المنتج بالمخزن
                    </button>
                  </div>
                </form>
              )}

              {/* Products Table with Edit & Customize Button */}
              <div className="border border-gray-200 rounded-xl overflow-x-auto bg-white shadow-2xs">
                <table className="w-full text-xs text-right">
                  <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold">
                    <tr>
                      <th className="p-3">الجهاز</th>
                      <th className="p-3">القسم</th>
                      <th className="p-3">السعر الحالي</th>
                      <th className="p-3">الخصم</th>
                      <th className="p-3">المخزون</th>
                      <th className="p-3 text-center">تعديل وتخصيص</th>
                      <th className="p-3 text-center">حذف</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-gray-50">
                        <td className="p-3 flex items-center gap-2.5">
                          <img src={p.image} alt={p.title} className="w-10 h-10 object-contain bg-gray-50 rounded p-1 border border-gray-200" />
                          <div>
                            <span className="font-bold text-[#282828] line-clamp-1 max-w-xs">{p.title}</span>
                            <span className="text-[10px] text-gray-400 block font-sans">{p.brand}</span>
                          </div>
                        </td>
                        <td className="p-3 text-gray-600 font-semibold">{p.category}</td>
                        <td className="p-3 font-mono font-bold text-[#F68B1E]">{formatEGP(p.price, lang)}</td>
                        <td className="p-3 font-mono">
                          {p.discount ? <span className="bg-red-50 text-red-600 px-1.5 py-0.5 rounded font-bold">-{p.discount}%</span> : '-'}
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded font-mono font-bold ${p.stock <= 5 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                            {p.stock} قطعة
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => setEditingProduct(p)}
                            className="bg-orange-50 hover:bg-[#F68B1E] text-[#F68B1E] hover:text-white border border-orange-200 font-bold px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer inline-flex items-center gap-1"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>تعديل وتخصيص</span>
                          </button>
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="text-gray-400 hover:text-red-600 p-1.5 transition-colors cursor-pointer"
                            title="حذف"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 4: SUPABASE DATABASE CONNECTION */}
          {/* ========================================================= */}
          {activeTab === 'supabase' && (
            <div className="space-y-6 text-xs max-w-3xl">
              
              <div className="border border-emerald-200 bg-emerald-50/40 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                      <Database className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#282828] text-base">ربط وتكامل قاعدة بيانات Supabase (PostgreSQL)</h4>
                      <p className="text-gray-600 text-xs">الحالة الحالية: <strong className="text-emerald-700">{supabaseStatus}</strong></p>
                    </div>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">
                    Supabase PostgreSQL Ready
                  </span>
                </div>

                <p className="text-gray-600 leading-relaxed text-xs">
                  يمكنك إدخال رابط مشروع Supabase ومفتاح الـ Secret / Service Role Key أو Anon Key الخاص بك أدناه، وسيتم حفظ الإعدادات وربط المتجر فورياً مع قاعدة البيانات السحابية!
                </p>

                <form onSubmit={handleSaveSupabase} className="space-y-3.5 pt-2">
                  <div>
                    <label className="block font-bold mb-1 text-gray-700">Project URL (عنوان مشروع سوبابيز)</label>
                    <input 
                      type="url"
                      placeholder="https://your-project-ref.supabase.co"
                      value={supabaseUrl}
                      onChange={(e) => setSupabaseUrl(e.target.value)}
                      className="w-full p-2.5 border border-gray-300 rounded-lg bg-white text-xs font-mono focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1 text-gray-700">Supabase Anon Key / Secret Key (المفتاح السري)</label>
                    <input 
                      type="password"
                      placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                      value={supabaseKey}
                      onChange={(e) => setSupabaseKey(e.target.value)}
                      className="w-full p-2.5 border border-gray-300 rounded-lg bg-white text-xs font-mono focus:border-emerald-600 focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-wrap justify-between items-center gap-2 pt-2">
                    <span className="text-[11px] text-gray-500">
                      * في حال عدم إدخال مفاتيح بعد، يعمل النظام بكفاءة كاملة على المحرك المحلي المتوافق مع PostgreSQL.
                    </span>
                    <button
                      type="submit"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
                    >
                      <Save className="w-4 h-4" />
                      <span>حفظ وتفعيل الاتصال الفوري بـ Supabase</span>
                    </button>
                  </div>
                </form>

                {supabaseSaved && (
                  <div className="bg-emerald-100 text-emerald-800 p-2.5 rounded-lg text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>تم حفظ إعدادات Supabase وتفعيل الاتصال بنجاح!</span>
                  </div>
                )}
              </div>

            </div>
          )}

        </div>

      </div>

      {/* ========================================================= */}
      {/* PRODUCT CUSTOMIZER & EDITOR MODAL */}
      {/* ========================================================= */}
      {editingProduct && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setEditingProduct(null)}
          />

          <div className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col z-20 overflow-hidden border border-gray-300">
            {/* Modal Header */}
            <div className="p-4 bg-[#282828] text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-[#F68B1E]" />
                <h4 className="font-bold text-sm sm:text-base">تخصيص وتعديل بيانات المنتج</h4>
              </div>
              <button 
                onClick={() => setEditingProduct(null)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveProductEdit} className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Product Title AR */}
                <div className="sm:col-span-2">
                  <label className="block font-bold mb-1 text-gray-700">اسم المنتج بالعربية *</label>
                  <input 
                    type="text"
                    required
                    value={editingProduct.title}
                    onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })}
                    className="w-full p-2.5 border border-gray-300 rounded-lg text-xs"
                  />
                </div>

                {/* Product Title EN */}
                <div className="sm:col-span-2">
                  <label className="block font-bold mb-1 text-gray-700">اسم المنتج بالإنجليزية</label>
                  <input 
                    type="text"
                    value={editingProduct.titleEn || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, titleEn: e.target.value })}
                    className="w-full p-2.5 border border-gray-300 rounded-lg text-xs"
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block font-bold mb-1 text-gray-700">سعر البيع الحالي (ج.م) *</label>
                  <input 
                    type="number"
                    required
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full p-2.5 border border-gray-300 rounded-lg text-xs font-mono font-bold"
                  />
                </div>

                {/* Old Price */}
                <div>
                  <label className="block font-bold mb-1 text-gray-700">السعر القديم قبل الخصم (ج.م)</label>
                  <input 
                    type="number"
                    value={editingProduct.oldPrice || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, oldPrice: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-full p-2.5 border border-gray-300 rounded-lg text-xs font-mono"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block font-bold mb-1 text-gray-700">القسم / التصنيف *</label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value as any })}
                    className="w-full p-2.5 border border-gray-300 rounded-lg text-xs bg-white"
                  >
                    <option value="phones">هواتف ذكية</option>
                    <option value="laptops">لابتوب وكمبيوتر</option>
                    <option value="tvs">شاشات وتلفزيون</option>
                    <option value="audio">سماعات وصوتيات</option>
                    <option value="watches">ساعات ذكية</option>
                    <option value="gaming">أجهزة ألعاب</option>
                    <option value="accessories">إكسسوارات</option>
                    <option value="cameras">كاميرات</option>
                  </select>
                </div>

                {/* Brand */}
                <div>
                  <label className="block font-bold mb-1 text-gray-700">العلامة التجارية / الشركة المصنعة</label>
                  <input 
                    type="text"
                    value={editingProduct.brand}
                    onChange={(e) => setEditingProduct({ ...editingProduct, brand: e.target.value })}
                    className="w-full p-2.5 border border-gray-300 rounded-lg text-xs"
                  />
                </div>

                {/* Stock */}
                <div>
                  <label className="block font-bold mb-1 text-gray-700">الكمية المتوفرة بالمخزن</label>
                  <input 
                    type="number"
                    value={editingProduct.stock}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                    className="w-full p-2.5 border border-gray-300 rounded-lg text-xs font-mono"
                  />
                </div>

                {/* Image URL */}
                <div>
                  <label className="block font-bold mb-1 text-gray-700">رابط صورة المنتج (Image URL)</label>
                  <input 
                    type="text"
                    value={editingProduct.image}
                    onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                    className="w-full p-2.5 border border-gray-300 rounded-lg text-xs"
                  />
                </div>

                {/* Specs */}
                <div className="sm:col-span-2">
                  <label className="block font-bold mb-1 text-gray-700">المواصفات والضمان</label>
                  <textarea 
                    rows={2}
                    value={editingProduct.specs}
                    onChange={(e) => setEditingProduct({ ...editingProduct, specs: e.target.value })}
                    className="w-full p-2.5 border border-gray-300 rounded-lg text-xs"
                  />
                </div>

                {/* Toggles */}
                <div className="sm:col-span-2 flex flex-wrap gap-4 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer font-bold">
                    <input 
                      type="checkbox"
                      checked={editingProduct.express}
                      onChange={(e) => setEditingProduct({ ...editingProduct, express: e.target.checked })}
                      className="w-4 h-4 text-[#F68B1E] rounded"
                    />
                    <span>شحن فوري إكسبريس (Express Delivery)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-bold">
                    <input 
                      type="checkbox"
                      checked={editingProduct.isFlash}
                      onChange={(e) => setEditingProduct({ ...editingProduct, isFlash: e.target.checked })}
                      className="w-4 h-4 text-[#F68B1E] rounded"
                    />
                    <span>تضمين في عروض الفلاش اليومية (Flash Deals)</span>
                  </label>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 cursor-pointer font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={savingProduct}
                  className="px-5 py-2 bg-[#F68B1E] hover:bg-[#e07a14] text-white font-bold rounded-lg shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>{savingProduct ? 'جاري الحفظ...' : 'حفظ التعديلات في المتجر'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
