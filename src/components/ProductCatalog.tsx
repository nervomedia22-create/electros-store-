import React, { useState, useMemo } from 'react';
import { Package, Search, ArrowUpDown } from 'lucide-react';
import type { Product } from '../types';
import { ProductCard } from './ProductCard';

interface ProductCatalogProps {
  products: Product[];
  currentCategory: string;
  onSelectCategory: (cat: string) => void;
  searchQuery: string;
  onResetSearch: () => void;
  wishlist: number[];
  onToggleWishlist: (id: number) => void;
  onAddToCart: (p: Product) => void;
  onQuickView: (p: Product) => void;
  lang: 'ar' | 'en';
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  currentCategory,
  onSelectCategory,
  searchQuery,
  onResetSearch,
  wishlist,
  onToggleWishlist,
  onAddToCart,
  onQuickView,
  lang
}) => {
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'rating'>('default');

  const categories = [
    { id: 'all', labelAr: 'الكل', labelEn: 'All' },
    { id: 'phones', labelAr: 'هواتف ذكية', labelEn: 'Phones' },
    { id: 'laptops', labelAr: 'لابتوب وكمبيوتر', labelEn: 'Laptops' },
    { id: 'tvs', labelAr: 'تلفزيونات', labelEn: 'TVs' },
    { id: 'audio', labelAr: 'صوتيات', labelEn: 'Audio' },
    { id: 'gaming', labelAr: 'ألعاب', labelEn: 'Gaming' },
    { id: 'watches', labelAr: 'ساعات', labelEn: 'Watches' }
  ];

  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (currentCategory && currentCategory !== 'all') {
      list = list.filter((p) => p.category === currentCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          (p.titleEn && p.titleEn.toLowerCase().includes(q)) ||
          p.brand.toLowerCase().includes(q) ||
          p.specs.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  }, [products, currentCategory, searchQuery, sortBy]);

  return (
    <section id="catalog" className="mb-10">
      {/* Header Bar with Filter Tabs & Sort */}
      <div className="bg-white rounded-t-xl p-4 border-b border-[#E6E6E6] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-[#282828] flex items-center gap-2">
            <Package className="w-5 h-5 text-[#F68B1E]" />
            <span>{lang === 'ar' ? 'دليل الأجهزة والمنتجات الأصلية' : 'Verified Products Catalog'}</span>
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {lang === 'ar' 
              ? `عرض ${filteredProducts.length} جهاز ذكي بضمان معتمد وأسعار تنافسية` 
              : `Showing ${filteredProducts.length} certified devices with warranty`}
          </p>
        </div>

        {/* Filter Categories and Sort */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Category Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-1 md:pb-0">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => onSelectCategory(c.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  currentCategory === c.id
                    ? 'bg-[#F68B1E] text-white shadow-xs'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {lang === 'ar' ? c.labelAr : c.labelEn}
              </button>
            ))}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 bg-gray-50 border border-[#E6E6E6] rounded-lg px-2 py-1 text-xs text-gray-600">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#F68B1E]" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-xs font-medium focus:outline-none cursor-pointer"
            >
              <option value="default">{lang === 'ar' ? 'الترتيب الافتراضي' : 'Default'}</option>
              <option value="price-asc">{lang === 'ar' ? 'السعر: من الأقل للأعلى' : 'Price: Low to High'}</option>
              <option value="price-desc">{lang === 'ar' ? 'السعر: من الأعلى للأقل' : 'Price: High to Low'}</option>
              <option value="rating">{lang === 'ar' ? 'الأعلى تقييماً' : 'Highest Rated'}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Catalog Grid */}
      {filteredProducts.length > 0 ? (
        <div className="bg-white rounded-b-xl p-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-4 shadow-sm border border-t-0 border-[#E6E6E6]">
          {filteredProducts.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              isWishlisted={wishlist.includes(p.id)}
              onToggleWishlist={onToggleWishlist}
              onAddToCart={onAddToCart}
              onQuickView={onQuickView}
              lang={lang}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-b-xl p-12 text-center shadow-sm border border-t-0 border-[#E6E6E6]">
          <div className="w-16 h-16 bg-orange-100 text-[#F68B1E] text-2xl rounded-full flex items-center justify-center mx-auto mb-3">
            <Search className="w-8 h-8" />
          </div>
          <h4 className="text-base font-bold text-[#282828] mb-1">
            {lang === 'ar' ? 'لم نتمكن من العثور على أجهزة مطابقة للبحث' : 'No matching products found'}
          </h4>
          <p className="text-xs text-gray-500 mb-4 max-w-sm mx-auto">
            {lang === 'ar'
              ? 'جرب البحث بكلمات عامة مثل: آيفون، سامسونج، لابتوب أو شاشة، أو قم بإعادة ضبط الفلاتر'
              : 'Try searching with general keywords like iPhone, Samsung, or Laptop'}
          </p>
          <button
            onClick={() => {
              onSelectCategory('all');
              onResetSearch();
            }}
            className="bg-[#F68B1E] text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-[#e07a14] transition-colors"
          >
            {lang === 'ar' ? 'عرض كل المنتجات' : 'View All Products'}
          </button>
        </div>
      )}
    </section>
  );
};
