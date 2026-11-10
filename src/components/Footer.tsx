import React, { useState } from 'react';
import { Truck, ShieldCheck, RotateCcw, Banknote, Mail, Phone, MapPin, CheckCircle2 } from 'lucide-react';

interface FooterProps {
  onSelectCategory: (cat: string) => void;
  onOpenTracker: () => void;
  lang: 'ar' | 'en';
}

export const Footer: React.FC<FooterProps> = ({ onSelectCategory, onOpenTracker, lang }) => {
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 5000);
      setEmailInput('');
    }
  };

  return (
    <footer className="mt-12 bg-[#282828] text-gray-300 text-xs pt-12 pb-24 md:pb-8 border-t border-gray-700">
      
      {/* 1. TRUST BAR (Above Footer Columns) */}
      <div className="max-w-7xl mx-auto px-4 mb-10">
        <div className="bg-white rounded-xl shadow-xs p-6 border border-[#E6E6E6] text-gray-700">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full bg-orange-100 text-[#F68B1E] flex items-center justify-center shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#282828]">
                  {lang === 'ar' ? 'شحن سريع ومجاني' : 'Fast & Free Delivery'}
                </h4>
                <p className="text-xs text-gray-500">
                  {lang === 'ar' ? 'لكافة المحافظات للطلبات فوق 1000 ج.م' : 'All governorates for orders over 1,000 EGP'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full bg-green-100 text-[#238636] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#282828]">
                  {lang === 'ar' ? 'ضمان محلي أصلي 100%' : '100% Genuine Warranty'}
                </h4>
                <p className="text-xs text-gray-500">
                  {lang === 'ar' ? 'وكلاء وموزعون رسميون معتمدون في مصر' : 'Authorized official Egyptian agents'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                <RotateCcw className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#282828]">
                  {lang === 'ar' ? 'إرجاع واستبدال مجاني' : 'Free 14-Day Returns'}
                </h4>
                <p className="text-xs text-gray-500">
                  {lang === 'ar' ? 'خلال 14 يوماً وفق حماية المستهلك' : 'Under Consumer Protection guidelines'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                <Banknote className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#282828]">
                  {lang === 'ar' ? 'دفع آمن عند الاستلام' : 'Safe Cash On Delivery'}
                </h4>
                <p className="text-xs text-gray-500">
                  {lang === 'ar' ? 'أو بالفيزا والتقسيط بدون فوائد' : 'Or via Visa and 0% installments'}
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 2. NEWSLETTER SUBSCRIPTION */}
      <div className="max-w-7xl mx-auto px-4 mb-10">
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-6 sm:p-8 text-white border border-gray-700">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="max-w-lg">
              <div className="flex items-center gap-2 text-[#F68B1E] text-xs font-bold uppercase mb-2">
                <Mail className="w-4 h-4" />
                <span>{lang === 'ar' ? 'النشرة البريدية الحصرية' : 'Exclusive Newsletter'}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black mb-2">
                {lang === 'ar' ? 'احصل على كوبون خصم بقيمة 200 ج.م' : 'Get a 200 EGP discount coupon'}
              </h3>
              <p className="text-xs text-gray-300">
                {lang === 'ar' 
                  ? 'اشترك في نشرتنا البريدية لتصلك أحدث العروض التقنية الحصرية وكوبونات الخصم أولاً بأول.'
                  : 'Subscribe to receive the latest tech discounts and coupon codes.'}
              </p>
            </div>

            <div className="w-full lg:w-auto flex-1 max-w-md">
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                <input 
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder={lang === 'ar' ? 'أدخل بريدك الإلكتروني هنا...' : 'Enter your email...'}
                  className="w-full px-4 py-2.5 rounded-lg text-xs sm:text-sm text-[#282828] bg-white focus:outline-none"
                />
                <button 
                  type="submit"
                  className="bg-[#F68B1E] hover:bg-[#e07a14] text-white px-5 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-colors whitespace-nowrap shadow-md cursor-pointer"
                >
                  {lang === 'ar' ? 'اشترك الآن' : 'Subscribe'}
                </button>
              </form>
              {subscribed && (
                <span className="text-[11px] text-green-400 mt-2 flex items-center gap-1 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {lang === 'ar' ? 'تم الاشتراك بنجاح! كود الخصم: WELCOME200' : 'Subscribed! Promo code: WELCOME200'}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. FOUR FOOTER COLUMNS */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-10 border-b border-gray-700">
          
          {/* Col 1: Customer Service */}
          <div>
            <h4 className="font-bold text-white text-sm mb-4 pb-1 border-b-2 border-[#F68B1E] inline-block">
              {lang === 'ar' ? 'خدمة العملاء' : 'Customer Service'}
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={onOpenTracker} className="hover:text-[#F68B1E] transition-colors text-right">
                  {lang === 'ar' ? 'تتبع الشحنات والطلبات' : 'Track Shipments & Orders'}
                </button>
              </li>
              <li>
                <span className="hover:text-[#F68B1E] transition-colors cursor-pointer">
                  {lang === 'ar' ? 'مركز المساعدة والأسئلة الشائعة' : 'Help Center & FAQs'}
                </span>
              </li>
              <li>
                <span className="hover:text-[#F68B1E] transition-colors cursor-pointer">
                  {lang === 'ar' ? 'سياسة الاستبدال والاسترجاع' : 'Return Policy'}
                </span>
              </li>
              <li>
                <span className="text-white font-bold block pt-1">
                  📞 {lang === 'ar' ? 'الخط الساخن: 19888' : 'Hotline: 19888'}
                </span>
              </li>
            </ul>
          </div>

          {/* Col 2: About Store */}
          <div>
            <h4 className="font-bold text-white text-sm mb-4 pb-1 border-b-2 border-[#F68B1E] inline-block">
              {lang === 'ar' ? 'عن إلكترو تيك' : 'About ElectroTech'}
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li><a href="#" className="hover:text-[#F68B1E] transition-colors">{lang === 'ar' ? 'من نحن وتاريخ المتجر' : 'About Us'}</a></li>
              <li><a href="#" className="hover:text-[#F68B1E] transition-colors">{lang === 'ar' ? 'الشراكة والتوريد التجاري' : 'Sell with Us'}</a></li>
              <li><a href="#" className="hover:text-[#F68B1E] transition-colors">{lang === 'ar' ? 'الشروط والأحكام العامة' : 'Terms & Conditions'}</a></li>
              <li><a href="#" className="hover:text-[#F68B1E] transition-colors">{lang === 'ar' ? 'مراكز الصيانة المعتمدة' : 'Service Centers'}</a></li>
            </ul>
          </div>

          {/* Col 3: Popular Categories */}
          <div>
            <h4 className="font-bold text-white text-sm mb-4 pb-1 border-b-2 border-[#F68B1E] inline-block">
              {lang === 'ar' ? 'أشهر التصنيفات' : 'Top Categories'}
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li><button onClick={() => onSelectCategory('phones')} className="hover:text-[#F68B1E]">{lang === 'ar' ? 'أحدث الموبايلات الذكية' : 'Smartphones'}</button></li>
              <li><button onClick={() => onSelectCategory('laptops')} className="hover:text-[#F68B1E]">{lang === 'ar' ? 'لابتوبات العمل والجيمنج' : 'Gaming Laptops'}</button></li>
              <li><button onClick={() => onSelectCategory('tvs')} className="hover:text-[#F68B1E]">{lang === 'ar' ? 'شاشات تلفزيون 4K سمارت' : '4K Smart TVs'}</button></li>
              <li><button onClick={() => onSelectCategory('audio')} className="hover:text-[#F68B1E]">{lang === 'ar' ? 'سماعات الرأس والأيربودز' : 'Headphones & AirPods'}</button></li>
              <li><button onClick={() => onSelectCategory('gaming')} className="hover:text-[#F68B1E]">{lang === 'ar' ? 'بلايستيشن 5 وإكسسواراتها' : 'PlayStation 5'}</button></li>
            </ul>
          </div>

          {/* Col 4: Payment Badges */}
          <div>
            <h4 className="font-bold text-white text-sm mb-4 pb-1 border-b-2 border-[#F68B1E] inline-block">
              {lang === 'ar' ? 'طرق الدفع المعتمدة' : 'Payment Methods'}
            </h4>
            <p className="text-gray-400 mb-3 text-[11px]">
              {lang === 'ar' ? 'طرق دفع مشفرة وآمنة 100%:' : 'Encrypted & secure payments:'}
            </p>
            
            <div className="flex flex-wrap gap-1.5 mb-4 font-mono font-bold text-[10px]">
              <span className="bg-white text-[#282828] px-2 py-1 rounded">VISA</span>
              <span className="bg-white text-[#282828] px-2 py-1 rounded">Mastercard</span>
              <span className="bg-[#F68B1E] text-white px-2 py-1 rounded font-sans">ميزة Meeza</span>
              <span className="bg-yellow-400 text-[#282828] px-2 py-1 rounded font-sans">فوري Fawry</span>
              <span className="bg-blue-600 text-white px-2 py-1 rounded font-sans">فاليو ValU</span>
              <span className="bg-gray-200 text-[#282828] px-2 py-1 rounded font-sans">الدفع عند الاستلام</span>
            </div>

            <p className="text-[11px] text-gray-400">
              {lang === 'ar' ? 'مقر الشركة: القاهرة، جمهورية مصر العربية' : 'HQ: Cairo, Egypt'}
            </p>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between text-gray-400 text-[11px] gap-2">
          <p>© 2026 إلكترو تيك مصر (ElectroTech Egypt). جميع الحقوق محفوظة ومسجلة.</p>
          <p>تصميم متوافق مع معايير متاجر التجارة الإلكترونية المصرية وتجربة مستخدم Jumia-inspired.</p>
        </div>
      </div>

    </footer>
  );
};
