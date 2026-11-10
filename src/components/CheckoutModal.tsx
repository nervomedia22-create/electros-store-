import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, CreditCard, Banknote, Building2, Truck, Smartphone } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { OrderItem, Order } from '../types';
import { formatEGP } from '../utils/format';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: OrderItem[];
  onOrderSuccess: (order: Order) => void;
  lang: 'ar' | 'en';
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  onOrderSuccess,
  lang
}) => {
  const [formData, setFormData] = useState({
    name: 'أحمد كمال الدين',
    phone: '01012345678',
    email: 'ahmed.kamal@example.com',
    address: 'شارع عباس العقاد، عمارة 15، شقة 4',
    city: 'مدينة نصر، القاهرة',
    paymentMethod: 'cod' as 'cod' | 'card' | 'fawry' | 'valu',
    notes: ''
  });

  const [loading, setLoading] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const isFreeShipping = subtotal >= 1000;
  const shippingFee = isFreeShipping ? 0 : 50;
  const finalTotal = subtotal + shippingFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address) {
      alert(lang === 'ar' ? 'يرجى استكمال الاسم، الهاتف، والعنوان' : 'Please fill required fields');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: formData.name,
          customerPhone: formData.phone,
          customerEmail: formData.email,
          customerAddress: formData.address,
          city: formData.city,
          paymentMethod: formData.paymentMethod,
          items,
          notes: formData.notes
        })
      });

      const data = await res.json();
      if (data.success) {
        setPlacedOrder(data.data);
        onOrderSuccess(data.data);
        // Trigger celebratory confetti
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } else {
        alert(data.message || 'حدث خطأ أثناء حفظ الطلب');
      }
    } catch (err: any) {
      alert('خطأ في الاتصال بالخادم: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const paymentOptions = [
    { id: 'cod', titleAr: 'الدفع عند الاستلام (COD)', titleEn: 'Cash on Delivery', descAr: 'ادفع نقداً لمندوب الشحن عند استلام الشحنة وفحصها', icon: Banknote },
    { id: 'card', titleAr: 'بطاقة بنكية (فيزا / ماستركارد / ميزة)', titleEn: 'Credit / Debit Card', descAr: 'دفع فوري آمن ومحمي بنسبة 100%', icon: CreditCard },
    { id: 'fawry', titleAr: 'فوري (Fawry Pay)', titleEn: 'Fawry Code', descAr: 'ادفع عبر أقرب ماكينة أو محفظة فوري بكود مرجعي', icon: Building2 },
    { id: 'valu', titleAr: 'تقسيط فاليو (ValU)', titleEn: 'ValU Installments', descAr: 'قسط مشترياتك حتى 60 شهر بدون مقدم', icon: Smartphone }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => !loading && onClose()}
      />

      <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col z-10 overflow-hidden">
        
        {/* Header */}
        <div className="p-4 bg-[#282828] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#F68B1E]" />
            <h3 className="font-bold text-sm sm:text-base">
              {placedOrder 
                ? (lang === 'ar' ? 'تم تأكيد طلبك بنجاح 🎉' : 'Order Confirmed 🎉')
                : (lang === 'ar' ? 'إتمام الشراء والدفع الآمن' : 'Secure Checkout')}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {placedOrder ? (
            /* Success Order View */
            <div className="text-center py-4 space-y-4">
              <div className="w-20 h-20 bg-green-100 text-[#238636] rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <div>
                <h3 className="text-xl font-black text-[#282828] mb-1">
                  {lang === 'ar' ? 'شكراً لثقتك في إلكترو تيك!' : 'Thank you for shopping with ElectroTech!'}
                </h3>
                <p className="text-xs text-gray-500 max-w-md mx-auto">
                  {lang === 'ar'
                    ? 'تم تسجيل طلبك بنجاح في نظام إدارة المستودعات، وتم إرسال تفاصيل التوصيل إلى هاتفك وسنقوم بالتواصل معك لتسليم الشحنة.'
                    : 'Your order has been recorded and is being prepared for dispatch.'}
                </p>
              </div>

              {/* Order ID & Tracking Code Box */}
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-center max-w-md mx-auto space-y-2">
                <div className="flex justify-between items-center text-xs text-gray-600 border-b border-orange-100 pb-2">
                  <span>{lang === 'ar' ? 'رقم الطلب:' : 'Order ID:'}</span>
                  <span className="font-mono font-bold text-sm text-[#282828]">{placedOrder.id}</span>
                </div>
                <div className="flex justify-between items-center text-xs text-gray-600 border-b border-orange-100 pb-2">
                  <span>{lang === 'ar' ? 'كود بوليصة الشحن (بوسطة):' : 'Tracking Code:'}</span>
                  <span className="font-mono font-bold text-xs text-[#F68B1E]">{placedOrder.trackingCode}</span>
                </div>
                <div className="flex justify-between items-center text-xs text-gray-600">
                  <span>{lang === 'ar' ? 'الإجمالي المطلوب دفعه:' : 'Total Payable:'}</span>
                  <span className="font-mono font-bold text-base text-[#282828]">{formatEGP(placedOrder.totalAmount, lang)}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
                <button
                  onClick={onClose}
                  className="bg-[#F68B1E] hover:bg-[#e07a14] text-white font-bold px-6 py-2.5 rounded-lg text-xs sm:text-sm transition-colors shadow-sm"
                >
                  {lang === 'ar' ? 'العودة للمتجر' : 'Return to Store'}
                </button>
              </div>
            </div>
          ) : (
            /* Checkout Form */
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Customer Details */}
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-[#282828] mb-3 flex items-center gap-1.5 border-b border-gray-100 pb-1">
                  <Truck className="w-4 h-4 text-[#F68B1E]" />
                  <span>{lang === 'ar' ? '1. بيانات التوصيل والاستلام' : '1. Delivery Information'}</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      {lang === 'ar' ? 'الاسم بالكامل *' : 'Full Name *'}
                    </label>
                    <input 
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full text-xs p-2.5 border border-[#E6E6E6] rounded-lg focus:border-[#F68B1E] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      {lang === 'ar' ? 'رقم الهاتف المحمول (للتواصل مع المندوب) *' : 'Mobile Phone *'}
                    </label>
                    <input 
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="01012345678"
                      className="w-full text-xs p-2.5 border border-[#E6E6E6] rounded-lg focus:border-[#F68B1E] focus:outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      {lang === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
                    </label>
                    <input 
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full text-xs p-2.5 border border-[#E6E6E6] rounded-lg focus:border-[#F68B1E] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      {lang === 'ar' ? 'المحافظة / المدينة *' : 'Governorate / City *'}
                    </label>
                    <select
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full text-xs p-2.5 border border-[#E6E6E6] rounded-lg focus:border-[#F68B1E] focus:outline-none bg-white"
                    >
                      <option value="مدينة نصر، القاهرة">مدينة نصر، القاهرة</option>
                      <option value="المعادي، القاهرة">المعادي، القاهرة</option>
                      <option value="التجمع الخامس، القاهرة الجديدة">التجمع الخامس، القاهرة الجديدة</option>
                      <option value="الدقي والمهندسين، الجيزة">الدقي والمهندسين، الجيزة</option>
                      <option value="مدينة 6 أكتوبر والشيخ زايد">مدينة 6 أكتوبر والشيخ زايد</option>
                      <option value="سموحة وميامي، الإسكندرية">سموحة وميامي، الإسكندرية</option>
                      <option value="المنصورة، الدقهلية">المنصورة، الدقهلية</option>
                      <option value="طنطا، الغربية">طنطا، الغربية</option>
                      <option value="الزقازيق، الشرقية">الزقازيق، الشرقية</option>
                      <option value="محافظة أخرى">محافظة أخرى (شحن سريع)</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      {lang === 'ar' ? 'العنوان بالتفصيل (اسم الشارع، رقم العمارة، رقم الشقة أو علامة مميزة) *' : 'Street Address Details *'}
                    </label>
                    <input 
                      type="text"
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full text-xs p-2.5 border border-[#E6E6E6] rounded-lg focus:border-[#F68B1E] focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      {lang === 'ar' ? 'ملاحظات إضافية للتوصيل (اختياري)' : 'Delivery Notes (Optional)'}
                    </label>
                    <input 
                      type="text"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder={lang === 'ar' ? 'مثال: يرجى الاتصال قبل الوصول بنصف ساعة' : 'e.g. Call before arrival'}
                      className="w-full text-xs p-2.5 border border-[#E6E6E6] rounded-lg focus:border-[#F68B1E] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-[#282828] mb-3 flex items-center gap-1.5 border-b border-gray-100 pb-1">
                  <CreditCard className="w-4 h-4 text-[#F68B1E]" />
                  <span>{lang === 'ar' ? '2. اختيار وسيلة الدفع المعتمدة' : '2. Payment Method'}</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {paymentOptions.map((opt) => {
                    const Icon = opt.icon;
                    const isSelected = formData.paymentMethod === opt.id;
                    return (
                      <div
                        key={opt.id}
                        onClick={() => setFormData({ ...formData, paymentMethod: opt.id as any })}
                        className={`p-3 rounded-lg border-2 cursor-pointer transition-all flex items-start gap-2.5 ${
                          isSelected
                            ? 'border-[#F68B1E] bg-orange-50/50 shadow-xs'
                            : 'border-[#E6E6E6] hover:border-gray-300 bg-white'
                        }`}
                      >
                        <div className={`p-1.5 rounded-md ${isSelected ? 'bg-[#F68B1E] text-white' : 'bg-gray-100 text-gray-500'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-xs text-[#282828] mb-0.5">
                            {lang === 'ar' ? opt.titleAr : opt.titleEn}
                          </div>
                          <div className="text-[11px] text-gray-500 leading-tight">
                            {lang === 'ar' ? opt.descAr : opt.descAr}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Cost Summary */}
              <div className="bg-gray-50 border border-[#E6E6E6] rounded-lg p-3 text-xs space-y-1.5">
                <div className="flex justify-between text-gray-600">
                  <span>{lang === 'ar' ? `المنتجات (${items.length}):` : `Items (${items.length}):`}</span>
                  <span className="font-mono font-bold text-[#282828]">{formatEGP(subtotal, lang)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>{lang === 'ar' ? 'الشحن والتوصيل:' : 'Shipping:'}</span>
                  <span className="font-mono font-bold text-[#238636]">
                    {isFreeShipping ? (lang === 'ar' ? 'مجاناً (فوق 1000 ج.م)' : 'FREE') : formatEGP(50, lang)}
                  </span>
                </div>
                <div className="border-t border-[#E6E6E6] pt-1.5 flex justify-between text-sm font-black text-[#282828]">
                  <span>{lang === 'ar' ? 'المبلغ الإجمالي للدفع:' : 'Total Payable:'}</span>
                  <span className="font-mono text-[#F68B1E] text-base">{formatEGP(finalTotal, lang)}</span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#F68B1E] hover:bg-[#e07a14] active:scale-95 text-white font-black py-3 rounded-lg text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {loading ? (
                  <span>{lang === 'ar' ? 'جاري تأكيد وتسجيل الطلب...' : 'Processing Order...'}</span>
                ) : (
                  <span>{lang === 'ar' ? `تأكيد الطلب الآن (${formatEGP(finalTotal, lang)})` : `Confirm Order Now (${formatEGP(finalTotal, lang)})`}</span>
                )}
              </button>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};
