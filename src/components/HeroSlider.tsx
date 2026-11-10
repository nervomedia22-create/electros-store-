import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowLeft, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

interface HeroSliderProps {
  onSelectCategory: (cat: string) => void;
  lang: 'ar' | 'en';
}

export const HeroSlider: React.FC<HeroSliderProps> = ({ onSelectCategory, lang }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      badge: lang === 'ar' ? 'مهرجان التكنولوجيا السنوي 2026' : 'Annual Tech Festival 2026',
      title: lang === 'ar' ? 'أحدث الإلكترونيات بأسعار لا تُنافس' : 'Latest Electronics at Unbeatable Prices',
      description: lang === 'ar' 
        ? 'احصل على خصومات حصرية تصل إلى 40% على أحدث الهواتف الذكية وأجهزة اللابتوب مع تقسيط بدون فوائد وضمان معتمد.'
        : 'Get exclusive discounts up to 40% on smart phones, laptops, and displays with 0% interest installments.',
      image: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=1400&auto=format&fit=crop&q=80",
      cta: lang === 'ar' ? 'تسوق العروض الآن' : 'Shop Deals Now',
      ctaCat: 'all'
    },
    {
      badge: lang === 'ar' ? 'عالم الألعاب والـ Gaming' : 'Gaming & Esports Zone',
      title: lang === 'ar' ? 'قوة تشغيل جبارة لمنصات PS5 وPC' : 'Ultimate Performance for PS5 & PC',
      description: lang === 'ar'
        ? 'ارتقِ بأدائك مع أحدث أجهزة سوني بلايستيشن 5 سليم، وشاشات 240Hz وسماعات الصوت المحيطي الاحترافية.'
        : 'Level up your setup with PS5 Slim consoles, high-refresh 240Hz screens, and pro surround headsets.',
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1400&auto=format&fit=crop&q=80",
      cta: lang === 'ar' ? 'استكشف عتاد الجيمرز' : 'Explore Gaming Gear',
      ctaCat: 'gaming'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const ArrowIcon = lang === 'ar' ? ArrowLeft : ArrowRight;

  return (
    <section className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
      {/* Main Promotional Slider (3 Columns) */}
      <div className="lg:col-span-3 relative rounded-xl overflow-hidden bg-[#282828] text-white shadow-sm min-h-[320px] sm:min-h-[380px] md:min-h-[420px] flex items-center">
        {slides.map((s, idx) => (
          <div 
            key={idx}
            className={`absolute inset-0 w-full h-full flex items-center transition-opacity duration-700 ${
              idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none z-0'
            }`}
          >
            <img 
              src={s.image} 
              alt={s.title}
              className="absolute inset-0 w-full h-full object-cover opacity-35"
              loading="lazy"
            />
            <div className="relative z-10 p-6 md:p-12 max-w-xl">
              <span className="inline-block bg-[#F68B1E] text-white text-xs md:text-sm font-bold px-3 py-1 rounded-md mb-3 animate-badge">
                {s.badge}
              </span>
              <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold mb-3 leading-tight tracking-tight">
                {s.title}
              </h1>
              <p className="text-gray-300 text-xs sm:text-sm md:text-base mb-6 leading-relaxed">
                {s.description}
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <button 
                  onClick={() => onSelectCategory(s.ctaCat)}
                  className="bg-[#F68B1E] hover:bg-[#e07a14] text-white font-bold px-6 py-3 rounded-lg text-xs sm:text-sm md:text-base shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
                >
                  <span>{s.cta}</span>
                  <ArrowIcon className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => onSelectCategory('phones')}
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-xs text-white font-semibold px-4 py-3 rounded-lg text-xs sm:text-sm transition-colors"
                >
                  {lang === 'ar' ? 'أحدث الموبايلات' : 'Latest Phones'}
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Controls */}
        <button 
          onClick={() => setCurrentSlide((currentSlide - 1 + slides.length) % slides.length)}
          className={`absolute ${lang === 'ar' ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition-colors z-20`}
          aria-label="Previous Slide"
        >
          {lang === 'ar' ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
        <button 
          onClick={() => setCurrentSlide((currentSlide + 1) % slides.length)}
          className={`absolute ${lang === 'ar' ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition-colors z-20`}
          aria-label="Next Slide"
        >
          {lang === 'ar' ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        </button>

        {/* Dots */}
        <div className="absolute bottom-3 right-1/2 translate-x-1/2 flex items-center gap-2 z-20">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`transition-all rounded-full ${
                idx === currentSlide ? 'w-6 h-2 bg-[#F68B1E]' : 'w-2 h-2 bg-white/60'
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Side Promotional Banners (1 Column) */}
      <div className="hidden lg:flex flex-col gap-4">
        {/* Card 1: Phones */}
        <div className="relative flex-1 rounded-xl overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 p-5 text-white flex flex-col justify-between shadow-sm group">
          <img 
            src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop&q=80"
            alt="Flagship Phones"
            className="absolute inset-0 w-full h-full object-cover opacity-25 group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="relative z-10">
            <span className="text-[#F68B1E] font-bold text-xs uppercase tracking-wider block mb-1">
              {lang === 'ar' ? 'عروض الأسبوع' : 'Deal of the Week'}
            </span>
            <h3 className="font-bold text-base leading-snug">
              {lang === 'ar' ? 'سلسلة هواتف الفلاجشيب الذكية' : 'Flagship Smartphone Series'}
            </h3>
            <p className="text-xs text-gray-300 mt-1">
              {lang === 'ar' ? 'خصم فوري 25% مع كود: TECH25' : 'Instant 25% off with code: TECH25'}
            </p>
          </div>
          <div className="relative z-10 pt-4">
            <button 
              onClick={() => onSelectCategory('phones')}
              className="text-xs font-bold text-[#F68B1E] flex items-center gap-1 group-hover:underline"
            >
              <span>{lang === 'ar' ? 'تسوق الهواتف' : 'Shop Phones'}</span>
              <ArrowIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card 2: Audio */}
        <div className="relative flex-1 rounded-xl overflow-hidden bg-gradient-to-br from-amber-950 to-stone-900 p-5 text-white flex flex-col justify-between shadow-sm group">
          <img 
            src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80"
            alt="Audio"
            className="absolute inset-0 w-full h-full object-cover opacity-25 group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="relative z-10">
            <span className="text-amber-400 font-bold text-xs uppercase tracking-wider block mb-1">
              {lang === 'ar' ? 'صوت نقي فائق' : 'Hi-Res Audio'}
            </span>
            <h3 className="font-bold text-base leading-snug">
              {lang === 'ar' ? 'سماعات الرأس اللاسلكية العازلة' : 'Wireless ANC Headphones'}
            </h3>
            <p className="text-xs text-gray-300 mt-1">
              {lang === 'ar' ? 'بطارية تدوم حتى 50 ساعة متواصلة' : 'Up to 50 hours battery life'}
            </p>
          </div>
          <div className="relative z-10 pt-4">
            <button 
              onClick={() => onSelectCategory('audio')}
              className="text-xs font-bold text-amber-400 flex items-center gap-1 group-hover:underline"
            >
              <span>{lang === 'ar' ? 'اكتشف الصوتيات' : 'Explore Audio'}</span>
              <ArrowIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
