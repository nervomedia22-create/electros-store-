import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  ShoppingCart, 
  Heart, 
  User as UserIcon, 
  Menu, 
  PhoneCall, 
  Truck, 
  Flame, 
  Cpu, 
  Send, 
  MapPin, 
  ShieldCheck, 
  SlidersHorizontal,
  Globe,
  PackageCheck
} from 'lucide-react';
import type { Product, User } from '../types';
import { formatEGP } from '../utils/format';

interface HeaderProps {
  cartCount: number;
  cartTotal: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenAuth: () => void;
  onOpenAdmin: () => void;
  onOpenTracker: () => void;
  onOpenTelegram: () => void;
  currentUser: User | null;
  onLogout: () => void;
  onSearch: (query: string) => void;
  onSelectCategory: (cat: string) => void;
  currentCategory: string;
  lang: 'ar' | 'en';
  onToggleLang: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  cartTotal,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenAuth,
  onOpenAdmin,
  onOpenTracker,
  onOpenTelegram,
  currentUser,
  onLogout,
  onSearch,
  onSelectCategory,
  currentCategory,
  lang,
  onToggleLang
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const quickSearches = [
    { label: lang === 'ar' ? 'آيفون 15 برو ماكس' : 'iPhone 15 Pro Max', cat: 'phones' },
    { label: lang === 'ar' ? 'سامسونج جالاكسي S24 ألترا' : 'Samsung S24 Ultra', cat: 'phones' },
    { label: lang === 'ar' ? 'لابتوب ألعاب RTX 4060' : 'Gaming Laptop RTX 4060', cat: 'laptops' },
    { label: lang === 'ar' ? 'شاشة سامسونج 55 بوصة سمارت' : 'Samsung 55 Smart TV', cat: 'tvs' },
    { label: lang === 'ar' ? 'سوني WH-1000XM5' : 'Sony Headphones XM5', cat: 'audio' },
    { label: lang === 'ar' ? 'بلايستيشن 5 سليم' : 'PlayStation 5 Slim', cat: 'gaming' }
  ];

  const categories = [
    { id: 'all', labelAr: 'الكل', labelEn: 'All' },
    { id: 'phones', labelAr: 'موبايلات', labelEn: 'Phones' },
    { id: 'laptops', labelAr: 'أجهزة كمبيوتر ولابتوب', labelEn: 'Laptops' },
    { id: 'tvs', labelAr: 'تلفزيونات وشاشات', labelEn: 'TVs & Screens' },
    { id: 'audio', labelAr: 'صوتيات وسماعات', labelEn: 'Audio' },
    { id: 'watches', labelAr: 'ساعات ذكية', labelEn: 'Smartwatches' },
    { id: 'gaming', labelAr: 'ألعاب إلكترونية', labelEn: 'Gaming' },
    { id: 'accessories', labelAr: 'إكسسوارات', labelEn: 'Accessories' }
  ];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchInput);
    setShowSuggestions(false);
  };

  const handleApplySuggestion = (term: string) => {
    setSearchInput(term);
    onSearch(term);
    setShowSuggestions(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#E6E6E6] shadow-sm">
      {/* 1. TOP UTILITY STRIP */}
      <div className="bg-[#282828] text-white text-xs py-1.5 px-4 border-b border-gray-700">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-3">
            <span className="bg-[#F68B1E] text-white text-[11px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
              <Flame className="w-3 h-3 inline" />
              {lang === 'ar' ? 'عروض التكنولوجيا' : 'Tech Deals'}
            </span>
            <span className="font-medium text-gray-200 text-[11px] sm:text-xs">
              {lang === 'ar' 
                ? 'خصومات تصل حتى 50% على الأجهزة الذكية + شحن مجاني للطلبات فوق 1000 ج.م'
                : 'Up to 50% off on Smart Electronics + Free Shipping over 1,000 EGP'}
            </span>
          </div>

          <div className="flex items-center gap-4 text-gray-300 text-xs">
            <button 
              onClick={onOpenTracker} 
              className="hover:text-[#F68B1E] transition-colors flex items-center gap-1 font-semibold"
            >
              <PackageCheck className="w-3.5 h-3.5 text-[#F68B1E]" />
              <span>{lang === 'ar' ? 'تتبع شحنتك' : 'Track Order'}</span>
            </button>

            <button 
              onClick={onOpenTelegram} 
              className="hover:text-sky-400 transition-colors flex items-center gap-1 font-semibold text-sky-400"
              title="Telegram Sales & Support Bot"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'بوت تيليجرام للمبيعات' : 'Telegram Bot'}</span>
            </button>

            <div className="hidden md:flex items-center gap-1 text-gray-400">
              <PhoneCall className="w-3 h-3 text-[#F68B1E]" />
              <span>19888</span>
            </div>

            <button 
              onClick={onToggleLang}
              className="flex items-center gap-1 hover:text-white transition-colors bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded text-[11px]"
            >
              <Globe className="w-3 h-3 text-[#F68B1E]" />
              <span className="font-bold">{lang === 'ar' ? 'English' : 'عربي'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER BAR */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-3 lg:gap-8">
          
          {/* Logo & Mobile Menu Trigger */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 text-[#282828] hover:bg-gray-100 rounded-lg"
              aria-label="القائمة الرئيسية"
            >
              <Menu className="w-6 h-6" />
            </button>

            <a href="#" className="flex items-center gap-2 group">
              <div className="bg-[#F68B1E] text-white w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center font-black text-xl shadow-md group-hover:scale-105 transition-transform">
                <Cpu className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="leading-none">
                <div className="flex items-center">
                  <span className="text-xl sm:text-2xl font-black text-[#282828] tracking-tight">إلكترو</span>
                  <span className="text-xl sm:text-2xl font-black text-[#F68B1E] tracking-tight">تيك</span>
                </div>
                <span className="text-[9px] sm:text-[10px] text-gray-500 tracking-wider block font-bold">ELECTROTECH EGYPT</span>
              </div>
            </a>
          </div>

          {/* Search Bar with Instant Dropdown */}
          <div ref={searchRef} className="flex-1 max-w-2xl relative hidden sm:block">
            <form onSubmit={handleSearchSubmit} className="flex items-center w-full">
              <div className="relative w-full flex items-center">
                <span className={`absolute ${lang === 'ar' ? 'right-3.5' : 'left-3.5'} text-gray-400`}>
                  <Search className="w-4 h-4" />
                </span>
                <input 
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder={lang === 'ar' ? 'ابحث عن أحدث الموبايلات، اللابتوبات، الشاشات، السماعات...' : 'Search phones, laptops, smart TVs, sound gear...'}
                  className={`w-full ${lang === 'ar' ? 'pr-10 pl-24' : 'pl-10 pr-24'} py-2.5 text-xs sm:text-sm border-2 border-[#E6E6E6] rounded-lg focus:border-[#F68B1E] focus:outline-none transition-all placeholder:text-gray-400 bg-white`}
                />
                <button 
                  type="submit"
                  className={`absolute ${lang === 'ar' ? 'left-1' : 'right-1'} bg-[#F68B1E] hover:bg-[#e07a14] text-white px-4 py-1.5 rounded-md text-xs sm:text-sm font-bold transition-colors shadow-sm`}
                >
                  {lang === 'ar' ? 'بحث' : 'Search'}
                </button>
              </div>
            </form>

            {/* Quick Suggestions Dropdown */}
            {showSuggestions && (
              <div className="absolute top-full right-0 left-0 mt-1 bg-white border border-[#E6E6E6] rounded-lg shadow-xl z-50 overflow-hidden text-sm">
                <div className="p-2 border-b border-gray-100 bg-gray-50 text-xs font-bold text-gray-500 flex justify-between">
                  <span>{lang === 'ar' ? 'الأكثر بحثاً في مصر:' : 'Trending Tech Searches:'}</span>
                  <button 
                    type="button" 
                    onClick={() => setShowSuggestions(false)}
                    className="text-[#F68B1E] hover:underline"
                  >
                    {lang === 'ar' ? 'إغلاق' : 'Close'}
                  </button>
                </div>
                <div className="divide-y divide-gray-100">
                  {quickSearches.map((item, idx) => (
                    <div 
                      key={idx}
                      onClick={() => handleApplySuggestion(item.label)}
                      className="p-2.5 hover:bg-orange-50 cursor-pointer flex items-center justify-between text-xs sm:text-sm transition-colors"
                    >
                      <span className="font-medium text-[#282828] flex items-center gap-2">
                        <Search className="w-3.5 h-3.5 text-[#F68B1E]" />
                        {item.label}
                      </span>
                      <span className="text-[11px] text-gray-400">
                        {lang === 'ar' ? 'في الإلكترونيات' : 'in Electronics'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons: Account, Wishlist, Cart, Admin */}
          <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
            
            {/* Account Menu */}
            <div className="relative">
              <button 
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 py-1 px-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-9 h-9 rounded-full bg-orange-100 text-[#F68B1E] flex items-center justify-center text-sm font-bold">
                  {currentUser ? currentUser.name.charAt(0) : <UserIcon className="w-5 h-5" />}
                </div>
                <div className="hidden xl:block leading-tight text-right">
                  <span className="text-[10px] text-gray-500 block">
                    {currentUser ? currentUser.name : (lang === 'ar' ? 'أهلاً بك' : 'Welcome')}
                  </span>
                  <span className="text-xs font-bold text-[#282828] flex items-center gap-1">
                    {currentUser ? (currentUser.role === 'admin' ? (lang === 'ar' ? 'مدير المتجر' : 'Admin') : (lang === 'ar' ? 'حسابي' : 'Account')) : (lang === 'ar' ? 'تسجيل الدخول' : 'Sign In')}
                  </span>
                </div>
              </button>

              {userDropdownOpen && (
                <div 
                  className={`absolute ${lang === 'ar' ? 'left-0' : 'right-0'} mt-2 w-56 bg-white border border-[#E6E6E6] rounded-lg shadow-xl z-50 p-2 text-xs sm:text-sm`}
                  onMouseLeave={() => setUserDropdownOpen(false)}
                >
                  {currentUser ? (
                    <div>
                      <div className="p-2 border-b border-gray-100 bg-orange-50 rounded mb-2">
                        <p className="font-bold text-[#282828]">{currentUser.name}</p>
                        <p className="text-[11px] text-gray-500">{currentUser.email}</p>
                        <span className="inline-block mt-1 text-[10px] font-bold bg-[#F68B1E] text-white px-2 py-0.5 rounded">
                          {currentUser.role === 'admin' ? (lang === 'ar' ? 'مدير النظام' : 'Store Admin') : (lang === 'ar' ? 'عميل مميز' : 'Customer')}
                        </span>
                      </div>

                      <button 
                        onClick={() => { onOpenTracker(); setUserDropdownOpen(false); }}
                        className="w-full text-right p-2 hover:bg-gray-50 rounded flex items-center gap-2"
                      >
                        <PackageCheck className="w-4 h-4 text-[#F68B1E]" />
                        <span>{lang === 'ar' ? 'تتبع طلباتي الشاحنة' : 'My Orders & Tracking'}</span>
                      </button>

                      {currentUser.role === 'admin' && (
                        <button 
                          onClick={() => { onOpenAdmin(); setUserDropdownOpen(false); }}
                          className="w-full text-right p-2 hover:bg-gray-50 rounded flex items-center gap-2 font-bold text-[#F68B1E]"
                        >
                          <SlidersHorizontal className="w-4 h-4" />
                          <span>{lang === 'ar' ? 'لوحة تحكم الإدارة' : 'Admin Operations Center'}</span>
                        </button>
                      )}

                      <button 
                        onClick={() => { onLogout(); setUserDropdownOpen(false); }}
                        className="w-full text-right p-2 text-red-600 hover:bg-red-50 rounded border-t border-gray-100 mt-1"
                      >
                        {lang === 'ar' ? 'تسجيل الخروج' : 'Sign Out'}
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <button 
                        onClick={() => { onOpenAuth(); setUserDropdownOpen(false); }}
                        className="w-full bg-[#F68B1E] hover:bg-[#e07a14] text-white font-bold py-2 rounded text-center text-xs shadow-sm cursor-pointer"
                      >
                        {lang === 'ar' ? 'تسجيل الدخول / إنشاء حساب' : 'Sign In / Register'}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Wishlist */}
            <button 
              onClick={onOpenWishlist}
              className="relative p-2 rounded-lg hover:bg-gray-100 text-[#282828] transition-colors"
              title={lang === 'ar' ? 'المفضلة' : 'Wishlist'}
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#D84343] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Shopping Cart Button */}
            <button 
              onClick={onOpenCart}
              className="flex items-center gap-2 bg-[#F68B1E] hover:bg-[#e07a14] active:scale-95 text-white px-3 sm:px-3.5 py-2 rounded-lg font-bold text-xs sm:text-sm shadow-sm transition-all"
            >
              <div className="relative">
                <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2.5 -right-2.5 bg-[#282828] text-white text-[9px] sm:text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-white">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden md:inline">{lang === 'ar' ? 'العربة' : 'Cart'}</span>
              <span className="hidden lg:inline text-xs bg-orange-700/40 px-1.5 py-0.5 rounded font-mono">
                {formatEGP(cartTotal, lang)}
              </span>
            </button>

          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="mt-2.5 sm:hidden">
          <form onSubmit={handleSearchSubmit} className="relative w-full flex items-center">
            <input 
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={lang === 'ar' ? 'ابحث عن أجهزة وإلكترونيات...' : 'Search devices & tech...'}
              className="w-full pr-9 pl-16 py-2 text-xs border border-[#E6E6E6] rounded-lg focus:border-[#F68B1E] focus:outline-none bg-white"
            />
            <Search className="w-3.5 h-3.5 absolute right-3 text-gray-400" />
            <button 
              type="submit"
              className="absolute left-1 bg-[#F68B1E] text-white px-3 py-1 rounded text-xs font-bold"
            >
              {lang === 'ar' ? 'بحث' : 'Search'}
            </button>
          </form>
        </div>
      </div>

      {/* 3. PRIMARY CATEGORY NAVIGATION BAR */}
      <nav className="bg-white border-t border-[#E6E6E6] hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between text-xs sm:text-sm">
          
          <div className="flex items-center gap-1 sm:gap-2">
            {categories.map((c) => (
              <button 
                key={c.id}
                onClick={() => onSelectCategory(c.id)}
                className={`py-2.5 px-3 font-semibold transition-colors border-b-2 ${
                  currentCategory === c.id 
                    ? 'border-[#F68B1E] text-[#F68B1E]' 
                    : 'border-transparent text-gray-700 hover:text-[#F68B1E]'
                }`}
              >
                {lang === 'ar' ? c.labelAr : c.labelEn}
              </button>
            ))}

            <a 
              href="#deals" 
              className="text-[#D84343] font-bold flex items-center gap-1 py-2.5 px-3 hover:opacity-85"
            >
              <Flame className="w-4 h-4 text-[#F68B1E]" />
              <span>{lang === 'ar' ? 'عروض فلاش' : 'Flash Deals'}</span>
            </a>
          </div>

          <div className="text-xs text-gray-500 flex items-center gap-1.5 font-medium">
            <Truck className="w-4 h-4 text-[#238636]" />
            <span>{lang === 'ar' ? 'شحن فوري سريع لكافة محافظات مصر' : 'Fast express delivery all over Egypt'}</span>
          </div>

        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-72 bg-white h-full shadow-2xl flex flex-col z-10 p-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-[#F68B1E]" />
                <span className="font-bold text-sm text-[#282828]">{lang === 'ar' ? 'أقسام المتجر' : 'Categories'}</span>
              </div>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-400 hover:text-black font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <div className="py-2 space-y-1 divide-y divide-gray-50 flex-1 overflow-y-auto text-sm">
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    onSelectCategory(c.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-right py-2.5 px-2 rounded-lg font-medium transition-colors ${
                    currentCategory === c.id ? 'bg-orange-50 text-[#F68B1E] font-bold' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {lang === 'ar' ? c.labelAr : c.labelEn}
                </button>
              ))}
            </div>

            <div className="pt-3 border-t border-gray-100 space-y-2">
              <button 
                onClick={() => { onOpenTracker(); setMobileMenuOpen(false); }}
                className="w-full bg-gray-100 hover:bg-gray-200 text-[#282828] py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <PackageCheck className="w-4 h-4 text-[#F68B1E]" />
                <span>{lang === 'ar' ? 'تتبع شحنتك' : 'Track Order'}</span>
              </button>

              <button 
                onClick={() => { onOpenTelegram(); setMobileMenuOpen(false); }}
                className="w-full bg-sky-50 text-sky-700 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <Send className="w-4 h-4" />
                <span>{lang === 'ar' ? 'بوت تيليجرام' : 'Telegram Bot'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
