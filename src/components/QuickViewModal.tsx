import React from 'react';
import { X, Star, ShoppingBag, Heart, ShieldCheck, Zap, Truck } from 'lucide-react';
import type { Product } from '../types';
import { formatEGP } from '../utils/format';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (p: Product) => void;
  onToggleWishlist: (id: number) => void;
  isWishlisted: boolean;
  lang: 'ar' | 'en';
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
  lang
}) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden z-10 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-3 bg-[#282828] text-white flex justify-between items-center">
          <span className="text-xs font-bold text-[#F68B1E] flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'نظرة سريعة على مواصفات الجهاز' : 'Product Quick Specs'}</span>
          </span>
          <button 
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Image Box */}
            <div className="bg-gray-50 border border-[#E6E6E6] rounded-xl p-4 flex items-center justify-center aspect-square md:aspect-auto">
              <img 
                src={product.image} 
                alt={product.title}
                className="max-h-64 object-contain"
                loading="lazy"
              />
            </div>

            {/* Specs & Buy Details */}
            <div className="flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-orange-100 text-[#F68B1E] font-bold text-xs px-2 py-0.5 rounded">
                    {product.brand}
                  </span>
                  {product.express && (
                    <span className="text-[#238636] bg-green-50 text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1">
                      <Truck className="w-3 h-3" />
                      <span>{lang === 'ar' ? 'متوفر للشحن الفوري' : 'Express Delivery'}</span>
                    </span>
                  )}
                </div>

                <h3 className="text-sm sm:text-base font-bold text-[#282828] leading-snug mb-3">
                  {lang === 'ar' ? product.title : (product.titleEn || product.title)}
                </h3>

                {/* Stars */}
                <div className="flex items-center gap-1.5 mb-3 text-xs">
                  <div className="text-amber-400 flex items-center">
                    <Star className="w-4 h-4 fill-amber-400" />
                  </div>
                  <span className="font-bold text-[#282828]">{product.rating}</span>
                  <span className="text-gray-400">
                    ({product.reviewsCount} {lang === 'ar' ? 'تقييم حقيقي' : 'reviews'})
                  </span>
                </div>

                {/* Price */}
                <div className="bg-gray-50 p-3 rounded-lg mb-4 border border-[#E6E6E6]">
                  <div className="text-xl sm:text-2xl font-black text-[#282828] font-mono">
                    {formatEGP(product.price, lang)}
                  </div>
                  {product.oldPrice && (
                    <div className="text-xs text-gray-500 line-through font-mono mt-0.5">
                      {formatEGP(product.oldPrice, lang)} ({lang === 'ar' ? `وفر ${product.discount}%` : `Save ${product.discount}%`})
                    </div>
                  )}
                </div>

                {/* Specs text */}
                <div className="text-xs text-gray-700 leading-relaxed mb-4">
                  <strong className="block text-[#282828] mb-1">
                    {lang === 'ar' ? 'أبرز المواصفات والضمان:' : 'Key Specifications & Warranty:'}
                  </strong>
                  <p className="text-gray-600 bg-gray-50 p-2.5 rounded border border-gray-100">
                    {product.specs}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => {
                    onAddToCart(product);
                    onClose();
                  }}
                  className="flex-1 bg-[#F68B1E] hover:bg-[#e07a14] active:scale-95 text-white font-bold py-2.5 rounded-lg text-xs sm:text-sm shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{lang === 'ar' ? 'إضافة إلى العربة' : 'Add to Cart'}</span>
                </button>

                <button
                  onClick={() => onToggleWishlist(product.id)}
                  className={`p-2.5 border rounded-lg transition-colors cursor-pointer ${
                    isWishlisted 
                      ? 'bg-red-50 border-red-200 text-[#D84343]' 
                      : 'border-[#E6E6E6] hover:bg-gray-100 text-gray-500'
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[#D84343]' : ''}`} />
                </button>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
