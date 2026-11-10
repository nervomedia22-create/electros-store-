import React from 'react';
import { Heart, ShoppingBag, Eye, Star, Zap } from 'lucide-react';
import type { Product } from '../types';
import { formatEGP } from '../utils/format';

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onToggleWishlist: (id: number) => void;
  onAddToCart: (p: Product) => void;
  onQuickView: (p: Product) => void;
  lang: 'ar' | 'en';
  isFlash?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onQuickView,
  lang,
  isFlash = false
}) => {
  return (
    <article className="group relative bg-white border border-[#E6E6E6] rounded-lg overflow-hidden flex flex-col justify-between hover:shadow-md transition-all duration-200">
      
      {/* Top Media & Badges */}
      <div className="relative w-full aspect-square bg-gray-50 p-3 overflow-hidden flex items-center justify-center">
        {/* Discount Badge */}
        {product.discount && (
          <span className={`absolute top-2 ${lang === 'ar' ? 'right-2' : 'left-2'} bg-[#D84343] text-white font-black text-[10px] sm:text-[11px] px-1.5 sm:px-2 py-0.5 rounded shadow-xs z-10 font-mono`}>
            -{product.discount}%
          </span>
        )}

        {/* Wishlist Button */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product.id);
          }}
          className={`absolute top-2 ${lang === 'ar' ? 'left-2' : 'right-2'} w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-xs z-10 transition-colors ${
            isWishlisted ? 'text-[#D84343]' : 'text-gray-400 hover:text-[#D84343]'
          }`}
          aria-label="Toggle Wishlist"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[#D84343]' : ''}`} />
        </button>

        {/* Product Image */}
        <img 
          src={product.image} 
          alt={lang === 'ar' ? product.title : (product.titleEn || product.title)}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          referrerPolicy="no-referrer"
        />

        {/* Quick View Button on Desktop Hover */}
        <button 
          onClick={() => onQuickView(product)}
          className="absolute bottom-2 inset-x-2 bg-[#282828]/85 hover:bg-[#282828] text-white text-xs font-bold py-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs flex items-center justify-center gap-1.5 shadow-sm"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>{lang === 'ar' ? 'نظرة سريعة' : 'Quick View'}</span>
        </button>
      </div>

      {/* Card Body */}
      <div className="p-3 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Express Badge */}
          <div className="flex items-center justify-between text-[10px] mb-1">
            <span className="text-gray-500 font-bold uppercase tracking-wider">{product.brand}</span>
            {product.express && (
              <span className="text-[#F68B1E] bg-orange-50 font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                <Zap className="w-3 h-3 text-[#F68B1E]" />
                <span>{lang === 'ar' ? 'إكسبريس' : 'Express'}</span>
              </span>
            )}
          </div>

          {/* Product Title */}
          <h3 
            onClick={() => onQuickView(product)}
            className="text-xs sm:text-sm font-semibold text-[#282828] line-clamp-2 hover:text-[#F68B1E] cursor-pointer mb-2 leading-relaxed"
            title={product.title}
          >
            {lang === 'ar' ? product.title : (product.titleEn || product.title)}
          </h3>
        </div>

        {/* Pricing, Rating & CTA */}
        <div>
          {/* Rating */}
          <div className="flex items-center gap-1.5 text-xs mb-1.5">
            <div className="text-amber-400 flex items-center">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
            </div>
            <span className="font-bold text-xs text-[#282828]">{product.rating}</span>
            <span className="text-[10px] text-gray-400">({product.reviewsCount})</span>
          </div>

          {/* Price Box */}
          <div className="mb-2">
            <div className="text-sm sm:text-base font-black text-[#282828] font-mono leading-tight">
              {formatEGP(product.price, lang)}
            </div>
            {product.oldPrice && (
              <div className="text-[11px] text-gray-400 line-through font-mono">
                {formatEGP(product.oldPrice, lang)}
              </div>
            )}
          </div>

          {/* Flash Stock Progress Bar */}
          {isFlash && product.stockPercent && (
            <div className="mb-2.5">
              <div className="flex justify-between text-[10px] font-bold mb-1 text-gray-500">
                <span>{lang === 'ar' ? 'متبقي في المخزن' : 'In Stock'}</span>
                <span className="text-[#D84343]">{100 - product.stockPercent}%</span>
              </div>
              <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-[#F68B1E] to-[#D84343]"
                  style={{ width: `${product.stockPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* Add to Cart CTA */}
          <button 
            onClick={() => onAddToCart(product)}
            className="w-full bg-[#F68B1E] hover:bg-[#e07a14] active:scale-95 text-white font-bold text-xs py-2 rounded-md shadow-xs transition-all flex items-center justify-center gap-1.5"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'أضف إلى السلة' : 'Add to Cart'}</span>
          </button>
        </div>

      </div>

    </article>
  );
};
