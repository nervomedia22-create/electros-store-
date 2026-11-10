import React, { useState, useEffect } from 'react';
import { 
  X, 
  Search, 
  PackageCheck, 
  Truck, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Phone, 
  MapPin, 
  RefreshCw,
  FileText
} from 'lucide-react';
import type { Order, OrderStatus } from '../types';
import { formatEGP, formatDate } from '../utils/format';

interface OrderTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'ar' | 'en';
}

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({
  isOpen,
  onClose,
  lang
}) => {
  const [searchId, setSearchId] = useState('EG-10842');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = async (idToSearch: string) => {
    if (!idToSearch.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(idToSearch.trim())}`);
      const data = await res.json();
      if (data.success) {
        setOrder(data.data);
      } else {
        setError(data.message || 'لم يتم العثور على شحنة بهذا الرقم');
        setOrder(null);
      }
    } catch (err: any) {
      setError('خطأ في الاتصال بالخادم: ' + err.message);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchOrder(searchId);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrder(searchId);
  };

  const getStepStatus = (step: OrderStatus, current: OrderStatus) => {
    const sequence: OrderStatus[] = ['pending', 'processing', 'shipped', 'delivered'];
    const currentIndex = sequence.indexOf(current);
    const stepIndex = sequence.indexOf(step);

    if (current === 'cancelled') return 'cancelled';
    if (currentIndex >= stepIndex) return 'completed';
    return 'upcoming';
  };

  const steps: { key: OrderStatus; labelAr: string; labelEn: string; icon: any }[] = [
    { key: 'pending', labelAr: 'تم تأكيد الطلب', labelEn: 'Confirmed', icon: FileText },
    { key: 'processing', labelAr: 'جاري التجهيز', labelEn: 'Processing', icon: Clock },
    { key: 'shipped', labelAr: 'خرج للتوصيل', labelEn: 'On the Way', icon: Truck },
    { key: 'delivered', labelAr: 'تم الاستلام', labelEn: 'Delivered', icon: CheckCircle2 }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col z-10 overflow-hidden">
        
        {/* Header */}
        <div className="p-4 bg-[#282828] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PackageCheck className="w-5 h-5 text-[#F68B1E]" />
            <h3 className="font-bold text-sm sm:text-base">
              {lang === 'ar' ? 'تتبع الشحنات والطلبات المباشر' : 'Live Order & Shipment Tracker'}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Bar & Quick Tags */}
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <input 
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder={lang === 'ar' ? 'أدخل رقم الطلب (مثال: EG-10842 أو بوليصة الشحن)' : 'Enter Order ID (e.g. EG-10842)'}
                className="w-full text-xs sm:text-sm p-2.5 border border-gray-300 rounded-lg focus:border-[#F68B1E] focus:outline-none uppercase font-mono bg-white"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#F68B1E] hover:bg-[#e07a14] text-white px-5 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>{lang === 'ar' ? 'تتبع' : 'Track'}</span>
            </button>
          </form>

          {/* Quick Demo Orders */}
          <div className="flex items-center gap-2 mt-2.5 text-[11px] text-gray-500 overflow-x-auto no-scrollbar">
            <span>{lang === 'ar' ? 'شحنات تجريبية للمعاينة:' : 'Demo test orders:'}</span>
            {['EG-10842', 'EG-10841', 'EG-10839'].map((demoId) => (
              <button
                key={demoId}
                type="button"
                onClick={() => {
                  setSearchId(demoId);
                  fetchOrder(demoId);
                }}
                className={`font-mono px-2 py-0.5 rounded border transition-colors ${
                  searchId === demoId 
                    ? 'bg-[#F68B1E] text-white border-[#F68B1E]' 
                    : 'bg-white hover:bg-gray-100 text-gray-700 border-gray-300'
                }`}
              >
                {demoId}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {order && (
            <div className="space-y-6">
              
              {/* Order High-level Status Card */}
              <div className="bg-orange-50/60 border border-orange-200 rounded-xl p-4 flex flex-wrap justify-between items-center gap-3">
                <div>
                  <span className="text-[10px] text-gray-500 font-bold block mb-0.5">
                    {lang === 'ar' ? 'رقم الشحنة' : 'Shipment Order'}
                  </span>
                  <div className="text-lg font-black font-mono text-[#282828] flex items-center gap-2">
                    <span>{order.id}</span>
                    <span className="text-xs bg-white text-[#F68B1E] border border-orange-300 px-2 py-0.5 rounded font-normal font-sans">
                      {order.status === 'shipped' ? (lang === 'ar' ? 'في الطريق' : 'In Transit') : 
                       order.status === 'delivered' ? (lang === 'ar' ? 'تم التوصيل' : 'Delivered') : 
                       order.status === 'processing' ? (lang === 'ar' ? 'جاري التجهيز' : 'Processing') : (lang === 'ar' ? 'قيد المراجعة' : 'Pending')}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 block mt-1">
                    {lang === 'ar' ? 'تاريخ الإنشاء:' : 'Date:'} {formatDate(order.createdAt, lang)}
                  </span>
                </div>

                <div className="text-left">
                  <span className="text-[10px] text-gray-500 font-bold block mb-0.5">
                    {lang === 'ar' ? 'بوليصة الشحن (بوسطة إكسبريس)' : 'Waybill Tracking Code'}
                  </span>
                  <span className="font-mono font-bold text-xs sm:text-sm text-[#282828] bg-white px-2 py-1 rounded border border-gray-200 inline-block">
                    {order.trackingCode}
                  </span>
                </div>
              </div>

              {/* 4-Step Timeline Bar */}
              <div>
                <h4 className="text-xs font-bold text-[#282828] mb-4">
                  {lang === 'ar' ? 'مراحل ومسار التوصيل' : 'Delivery Progress Milestones'}
                </h4>

                <div className="relative flex justify-between items-center">
                  {/* Connecting Line */}
                  <div className="absolute top-1/2 left-4 right-4 h-1 bg-gray-200 -translate-y-1/2 z-0" />
                  
                  {steps.map((st, idx) => {
                    const statusState = getStepStatus(st.key, order.status);
                    const isDone = statusState === 'completed';
                    const Icon = st.icon;

                    return (
                      <div key={idx} className="relative z-10 flex flex-col items-center text-center">
                        <div 
                          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all ${
                            isDone 
                              ? 'bg-[#238636] text-white shadow-sm ring-4 ring-green-100' 
                              : 'bg-white border-2 border-gray-300 text-gray-400'
                          }`}
                        >
                          <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                        <span className={`text-[10px] sm:text-xs font-bold mt-2 ${isDone ? 'text-[#282828]' : 'text-gray-400'}`}>
                          {lang === 'ar' ? st.labelAr : st.labelEn}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Courier & Destination Info Card */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Courier info */}
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-gray-700 mb-1">
                    <Truck className="w-4 h-4 text-[#F68B1E]" />
                    <span>{lang === 'ar' ? 'مندوب الشحن والتسليم:' : 'Assigned Courier:'}</span>
                  </div>
                  <p className="font-bold text-[#282828]">{order.courierName}</p>
                  <p className="text-gray-500 flex items-center gap-1 font-mono">
                    <Phone className="w-3 h-3 text-[#238636]" />
                    <span>{order.courierPhone}</span>
                  </p>
                </div>

                {/* Delivery address */}
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-gray-700 mb-1">
                    <MapPin className="w-4 h-4 text-[#F68B1E]" />
                    <span>{lang === 'ar' ? 'عنوان وجهة التوصيل:' : 'Delivery Destination:'}</span>
                  </div>
                  <p className="font-bold text-[#282828]">{order.customerName}</p>
                  <p className="text-gray-600 line-clamp-1">{order.customerAddress} - {order.city}</p>
                </div>
              </div>

              {/* Items in this order */}
              <div>
                <h4 className="text-xs font-bold text-[#282828] mb-2">
                  {lang === 'ar' ? 'محتويات الشحنة' : 'Package Contents'}
                </h4>
                <div className="divide-y divide-gray-100 border border-gray-200 rounded-lg overflow-hidden bg-white">
                  {order.items.map((item, i) => (
                    <div key={i} className="p-2.5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5">
                        <img 
                          src={item.image} 
                          alt={item.title}
                          className="w-10 h-10 object-contain rounded bg-gray-50 p-1 border border-gray-100"
                        />
                        <div>
                          <p className="font-bold text-[#282828] line-clamp-1">{item.title}</p>
                          <span className="text-[11px] text-gray-500 font-mono">
                            {formatEGP(item.price, lang)} × {item.quantity}
                          </span>
                        </div>
                      </div>
                      <span className="font-bold font-mono text-[#282828]">
                        {formatEGP(item.price * item.quantity, lang)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Event Logs Timeline */}
              <div>
                <h4 className="text-xs font-bold text-[#282828] mb-2">
                  {lang === 'ar' ? 'سجل تحديثات الشحنة المباشر' : 'Live Tracking Audit Log'}
                </h4>
                <div className="border border-gray-200 rounded-lg p-3 bg-gray-50 space-y-3">
                  {order.history.map((hist, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs">
                      <div className="w-2 h-2 rounded-full bg-[#F68B1E] mt-1.5 shrink-0" />
                      <div className="flex-1">
                        <p className="text-gray-800 font-semibold">{hist.note}</p>
                        <span className="text-[10px] text-gray-400 font-mono">{formatDate(hist.timestamp, lang)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
};
