import React from 'react';
import { ShoppingCart, X, Trash2, ArrowLeft, ArrowRight, ShieldCheck, Plus, Minus } from 'lucide-react';
import type { OrderItem } from '../types';
import { formatEGP } from '../utils/format';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: OrderItem[];
  onUpdateQty: (productId: number, delta: number) => void;
  onRemoveItem: (productId: number) => void;
  onProceedCheckout: () => void;
  lang: 'ar' | 'en';
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQty,
  onRemoveItem,
  onProceedCheckout,
  lang
}) => {
  if (!isOpen) return null;

  const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const freeShippingThreshold = 1000;
  const isFreeShipping = subtotal >= freeShippingThreshold;
  const shippingPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const remainingForFree = Math.max(0, freeShippingThreshold - subtotal);

  const ArrowIcon = lang === 'ar' ? ArrowLeft : ArrowRight;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Drawer */}
      <div 
        className={`fixed top-0 bottom-0 ${lang === 'ar' ? 'left-0' : 'right-0'} w-full max-w-md bg-white shadow-2xl flex flex-col z-10 transition-transform duration-300`}
      >
        {/* Header */}
        <div className="p-4 bg-[#282828] text-white flex items-center justify-between border-b border-gray-700">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-[#F68B1E]" />
            <h3 className="font-bold text-sm sm:text-base">
              {lang === 'ar' ? `سلة مشترياتك (${totalItemsCount})` : `Shopping Cart (${totalItemsCount})`}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            aria-label="Close Cart"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Free Shipping Progress */}
        <div className="bg-orange-50 p-3 border-b border-orange-100 text-xs">
          <div className="flex justify-between items-center mb-1 font-bold">
            <span className="text-[#282828]">
              {isFreeShipping 
                ? (lang === 'ar' ? 'تهانينا! طلبيتك مؤهلة للشحن المجاني السريع 🎉' : 'Congratulations! Free express shipping applied 🎉')
                : (lang === 'ar' ? `أضف بـ ${formatEGP(remainingForFree, lang)} للحصول على شحن مجاني` : `Add ${formatEGP(remainingForFree, lang)} for free shipping`)}
            </span>
            <span className={isFreeShipping ? 'text-[#238636]' : 'text-[#F68B1E]'}>
              {isFreeShipping ? (lang === 'ar' ? 'مكتمل' : 'Unlocked') : `${shippingPercent}%`}
            </span>
          </div>
          <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ${isFreeShipping ? 'bg-[#238636]' : 'bg-[#F68B1E]'}`}
              style={{ width: `${shippingPercent}%` }}
            />
          </div>
        </div>

        {/* Items Container */}
        {items.length > 0 ? (
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {items.map((item) => (
              <div 
                key={item.productId}
                className="flex gap-3 bg-white border border-[#E6E6E6] p-2.5 rounded-lg shadow-2xs items-center"
              >
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-16 h-16 object-contain bg-gray-50 rounded p-1 border border-gray-100 shrink-0"
                  loading="lazy"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-[#282828] line-clamp-1 mb-1" title={item.title}>
                    {item.title}
                  </h4>
                  <div className="text-xs font-extrabold text-[#F68B1E] font-mono mb-2">
                    {formatEGP(item.price, lang)}
                  </div>

                  {/* Quantity Stepper & Delete */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center border border-[#E6E6E6] rounded bg-gray-50">
                      <button 
                        onClick={() => onUpdateQty(item.productId, -1)}
                        className="w-6 h-6 flex items-center justify-center hover:bg-gray-200 text-xs font-bold text-[#282828]"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-7 text-center text-xs font-bold font-mono">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => onUpdateQty(item.productId, 1)}
                        className="w-6 h-6 flex items-center justify-center hover:bg-gray-200 text-xs font-bold text-[#282828]"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button 
                      onClick={() => onRemoveItem(item.productId)}
                      className="text-gray-400 hover:text-[#D84343] p-1 transition-colors"
                      title={lang === 'ar' ? 'حذف' : 'Remove'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty Cart */
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 bg-orange-100 text-[#F68B1E] rounded-full flex items-center justify-center mb-3">
              <ShoppingCart className="w-8 h-8" />
            </div>
            <h4 className="font-bold text-base text-[#282828] mb-1">
              {lang === 'ar' ? 'عربة التسوق فارغة حالياً' : 'Your cart is empty'}
            </h4>
            <p className="text-xs text-gray-500 mb-4 max-w-xs">
              {lang === 'ar' 
                ? 'استكشف أقوى عروض الإلكترونيات والأجهزة وأضف منتجاتك المفضلة الآن!' 
                : 'Explore our latest electronics and add your favorite gear!'}
            </p>
            <button 
              onClick={onClose}
              className="bg-[#F68B1E] hover:bg-[#e07a14] text-white font-bold text-xs px-5 py-2.5 rounded-lg transition-colors"
            >
              {lang === 'ar' ? 'ابدأ التسوق الآن' : 'Start Shopping'}
            </button>
          </div>
        )}

        {/* Footer & Checkout Action */}
        {items.length > 0 && (
          <div className="p-4 border-t border-[#E6E6E6] bg-gray-50 space-y-3">
            <div className="space-y-1.5 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>{lang === 'ar' ? 'المجموع الفرعي:' : 'Subtotal:'}</span>
                <span className="font-bold text-[#282828] font-mono text-sm">
                  {formatEGP(subtotal, lang)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>{lang === 'ar' ? 'تكلفة التوصيل والشحن:' : 'Delivery & Shipping:'}</span>
                <span className="font-bold text-[#238636] font-mono">
                  {isFreeShipping ? (lang === 'ar' ? 'مجاناً' : 'FREE') : formatEGP(50, lang)}
                </span>
              </div>
              <div className="border-t border-[#E6E6E6] pt-2 flex justify-between text-base font-black text-[#282828]">
                <span>{lang === 'ar' ? 'الإجمالي النهائي:' : 'Total Amount:'}</span>
                <span className="text-[#F68B1E] font-mono">
                  {formatEGP(isFreeShipping ? subtotal : subtotal + 50, lang)}
                </span>
              </div>
            </div>

            <button 
              onClick={onProceedCheckout}
              className="w-full bg-[#F68B1E] hover:bg-[#e07a14] active:scale-95 text-white font-black py-3 rounded-lg text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{lang === 'ar' ? 'متابعة إتمام الطلب (الدفع الآمن)' : 'Proceed to Secure Checkout'}</span>
              <ArrowIcon className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-500">
              <ShieldCheck className="w-4 h-4 text-[#238636]" />
              <span>{lang === 'ar' ? 'دفع آمن ومحمي ومعتمد من البنك المركزي المصري' : 'Secured 256-bit payment encryption'}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
