import React, { useState, useEffect } from 'react';
import { Flame, Clock } from 'lucide-react';
import type { Product } from '../types';
import { ProductCard } from './ProductCard';

interface FlashDealsProps {
  products: Product[];
  wishlist: number[];
  onToggleWishlist: (id: number) => void;
  onAddToCart: (p: Product) => void;
  onQuickView: (p: Product) => void;
  lang: 'ar' | 'en';
}

export const FlashDeals: React.FC<FlashDealsProps> = ({
  products,
  wishlist,
  onToggleWishlist,
  onAddToCart,
  onQuickView,
  lang
}) => {
  const [timeLeft, setTimeLeft] = useState({ hours: 7, minutes: 42, seconds: 18 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const flashItems = products.filter((p) => p.isFlash).slice(0, 6);

  if (flashItems.length === 0) return null;

  return (
    <section id="deals" className="bg-white rounded-xl shadow-sm overflow-hidden mb-8 border border-red-100">
      {/* Flash Deals Header Bar */}
      <div className="bg-gradient-to-r from-red-600 via-orange-600 to-[#F68B1E] px-4 py-3 text-white flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/20 flex items-center justify-center text-lg animate-bounce">
            🔥
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black tracking-tight">
              {lang === 'ar' ? 'عروض فلاش الإلكترونية اليومية' : 'Daily Tech Flash Deals'}
            </h2>
            <p className="text-[10px] sm:text-[11px] text-orange-100 hidden sm:block">
              {lang === 'ar' ? 'خصومات حصرية لفترة محدودة أو حتى نفاد الكمية' : 'Exclusive discounts for a limited time or until stock lasts'}
            </p>
          </div>
        </div>

        {/* Live Countdown Timer */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-xs font-semibold text-white/95">
            <Clock className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'ينتهي خلال:' : 'Ends in:'}</span>
          </div>
          <div className="flex items-center gap-1 font-mono font-bold text-xs sm:text-sm">
            <span className="bg-[#282828] text-white px-2 py-0.5 rounded shadow-xs">
              {String(timeLeft.hours).padStart(2, '0')}
            </span>
            <span>:</span>
            <span className="bg-[#282828] text-white px-2 py-0.5 rounded shadow-xs">
              {String(timeLeft.minutes).padStart(2, '0')}
            </span>
            <span>:</span>
            <span className="bg-[#282828] text-white px-2 py-0.5 rounded shadow-xs">
              {String(timeLeft.seconds).padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="p-3 sm:p-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {flashItems.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            isWishlisted={wishlist.includes(p.id)}
            onToggleWishlist={onToggleWishlist}
            onAddToCart={onAddToCart}
            onQuickView={onQuickView}
            lang={lang}
            isFlash={true}
          />
        ))}
      </div>
    </section>
  );
};
