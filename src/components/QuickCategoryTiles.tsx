import React from 'react';
import { Layers } from 'lucide-react';

interface QuickCategoryTilesProps {
  onSelectCategory: (cat: string) => void;
  lang: 'ar' | 'en';
}

export const QuickCategoryTiles: React.FC<QuickCategoryTilesProps> = ({ onSelectCategory, lang }) => {
  const categories = [
    { id: 'phones', nameAr: 'هواتف ذكية', nameEn: 'Smartphones', img: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=150&auto=format&fit=crop&q=80' },
    { id: 'laptops', nameAr: 'لابتوب وكمبيوتر', nameEn: 'Laptops', img: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=150&auto=format&fit=crop&q=80' },
    { id: 'tvs', nameAr: 'شاشات وتلفزيون', nameEn: 'TVs & Screens', img: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=150&auto=format&fit=crop&q=80' },
    { id: 'audio', nameAr: 'سماعات وصوتيات', nameEn: 'Audio & Sound', img: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=150&auto=format&fit=crop&q=80' },
    { id: 'watches', nameAr: 'ساعات ذكية', nameEn: 'Smartwatches', img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150&auto=format&fit=crop&q=80' },
    { id: 'gaming', nameAr: 'أجهزة الألعاب', nameEn: 'Gaming Consoles', img: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=150&auto=format&fit=crop&q=80' },
    { id: 'accessories', nameAr: 'إكسسوارات', nameEn: 'Accessories', img: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=150&auto=format&fit=crop&q=80' },
    { id: 'cameras', nameAr: 'كاميرات وتصوير', nameEn: 'Cameras', img: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=150&auto=format&fit=crop&q=80' }
  ];

  return (
    <section className="bg-white rounded-xl p-4 shadow-sm mb-6 border border-[#E6E6E6]">
      <div className="flex items-center justify-between mb-3 border-b border-[#E6E6E6] pb-2">
        <h2 className="text-sm md:text-base font-bold text-[#282828] flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#F68B1E]" />
          <span>{lang === 'ar' ? 'الأقسام الأكثر طلباً في مصر' : 'Top Tech Categories'}</span>
        </h2>
        <span className="text-xs text-gray-500 font-medium">
          {lang === 'ar' ? 'تصفح بالضغط على الفئة' : 'Click to filter'}
        </span>
      </div>

      <div className="grid grid-cols-4 md:grid-cols-8 gap-3 sm:gap-4">
        {categories.map((c) => (
          <button 
            key={c.id}
            onClick={() => onSelectCategory(c.id)}
            className="group flex flex-col items-center text-center p-2 rounded-lg hover:bg-orange-50/70 transition-all cursor-pointer"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gray-50 border border-[#E6E6E6] flex items-center justify-center p-2 mb-2 group-hover:border-[#F68B1E] group-hover:scale-105 transition-all shadow-xs">
              <img 
                src={c.img} 
                alt={c.nameAr}
                className="w-full h-full object-contain rounded-full"
                loading="lazy"
              />
            </div>
            <span className="text-xs font-bold text-gray-700 group-hover:text-[#F68B1E] transition-colors line-clamp-1">
              {lang === 'ar' ? c.nameAr : c.nameEn}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
};
