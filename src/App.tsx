import React, { useState, useEffect } from 'react';
import type { Product, OrderItem, Order, User } from './types';
import { Header } from './components/Header';
import { HeroSlider } from './components/HeroSlider';
import { QuickCategoryTiles } from './components/QuickCategoryTiles';
import { FlashDeals } from './components/FlashDeals';
import { ProductCatalog } from './components/ProductCatalog';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { QuickViewModal } from './components/QuickViewModal';
import { AdminPanel } from './components/AdminPanel';
import { TelegramBotModal } from './components/TelegramBotModal';
import { AuthModal } from './components/AuthModal';
import { AuthPage } from './components/AuthPage';
import { NotificationToast } from './components/NotificationToast';
import { Footer } from './components/Footer';
import { Home, Layers, Heart, ShoppingCart, Send, PackageCheck, User as UserIcon, SlidersHorizontal, LogOut } from 'lucide-react';

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentCategory, setCurrentCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [lang, setLang] = useState<'ar' | 'en'>('ar');

  // Persistence State
  const [cart, setCart] = useState<OrderItem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('electrotech_cart') || '[]');
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<number[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('electrotech_wishlist') || '[]');
    } catch {
      return [];
    }
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('electrotech_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Modals
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [trackerOpen, setTrackerOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [telegramOpen, setTelegramOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Sync lang direction
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  // Sync LocalStorage
  useEffect(() => {
    localStorage.setItem('electrotech_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('electrotech_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('electrotech_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('electrotech_user');
    }
  }, [currentUser]);

  // Fetch initial products
  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (data.success && data.data) {
        setProducts(data.data);
      }
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Cart operations
  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const idx = prev.findIndex((item) => item.productId === product.id);
      if (idx > -1) {
        const copy = [...prev];
        copy[idx].quantity += 1;
        return copy;
      }
      return [
        ...prev,
        {
          productId: product.id,
          title: lang === 'ar' ? product.title : (product.titleEn || product.title),
          price: product.price,
          quantity: 1,
          image: product.image
        }
      ];
    });
    setCartOpen(true);
  };

  const handleUpdateQty = (productId: number, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.productId === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as OrderItem[];
    });
  };

  const handleRemoveFromCart = (productId: number) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  };

  // Wishlist operation
  const handleToggleWishlist = (id: number) => {
    setWishlist((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      return [...prev, id];
    });
  };

  const handleOrderSuccess = (newOrder: Order) => {
    setCart([]);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // If user is not authenticated, render dedicated Authentication Page first
  if (!currentUser) {
    return (
      <AuthPage
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          if (user.role === 'admin') {
            setAdminOpen(true);
          }
        }}
        lang={lang}
        onToggleLang={() => setLang(lang === 'ar' ? 'en' : 'ar')}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F5] text-[#333333]">
      
      {/* Admin Mode Quick Access Banner */}
      {currentUser.role === 'admin' && (
        <div className="bg-[#18202F] text-white px-4 py-2 border-b border-[#F68B1E]/40 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="bg-[#F68B1E] text-white text-[10px] font-bold px-2 py-0.5 rounded">
              {lang === 'ar' ? 'وضع إدارة المتجر (Admin)' : 'Admin Mode'}
            </span>
            <span className="font-semibold text-gray-200">
              {currentUser.name} ({currentUser.email})
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setAdminOpen(true)}
              className="bg-[#F68B1E] hover:bg-[#e07a14] text-white font-bold px-3 py-1 rounded text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'لوحة التحليلات وإدارة وتخصيص المنتجات' : 'Admin & Analytics Console'}</span>
            </button>
            <button
              onClick={() => setCurrentUser(null)}
              className="text-gray-400 hover:text-white flex items-center gap-1 cursor-pointer"
              title="تسجيل الخروج"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'خروج' : 'Logout'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Real-time Push Notification Hub */}
      <NotificationToast 
        onOpenOrder={(orderId) => setTrackerOpen(true)}
        lang={lang}
      />

      {/* Main Header */}
      <Header
        cartCount={cartCount}
        cartTotal={cartTotal}
        wishlistCount={wishlist.length}
        onOpenCart={() => setCartOpen(true)}
        onOpenWishlist={() => {
          setCurrentCategory('all');
          const catEl = document.getElementById('catalog');
          if (catEl) catEl.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenAuth={() => setAuthOpen(true)}
        onOpenAdmin={() => setAdminOpen(true)}
        onOpenTracker={() => setTrackerOpen(true)}
        onOpenTelegram={() => setTelegramOpen(true)}
        currentUser={currentUser}
        onLogout={() => setCurrentUser(null)}
        onSearch={(query) => {
          setSearchQuery(query);
          const catEl = document.getElementById('catalog');
          if (catEl) catEl.scrollIntoView({ behavior: 'smooth' });
        }}
        onSelectCategory={(cat) => {
          setCurrentCategory(cat);
          setSearchQuery('');
          const catEl = document.getElementById('catalog');
          if (catEl) catEl.scrollIntoView({ behavior: 'smooth' });
        }}
        currentCategory={currentCategory}
        lang={lang}
        onToggleLang={() => setLang(lang === 'ar' ? 'en' : 'ar')}
      />

      {/* Main Storefront Body */}
      <main className="flex-1 max-w-7xl mx-auto px-4 py-4 w-full">
        
        {/* 1. Hero Promotional Campaign Slider */}
        <HeroSlider 
          onSelectCategory={(cat) => {
            setCurrentCategory(cat);
            const catEl = document.getElementById('catalog');
            if (catEl) catEl.scrollIntoView({ behavior: 'smooth' });
          }}
          lang={lang}
        />

        {/* 2. Quick Category Circular Tiles */}
        <QuickCategoryTiles 
          onSelectCategory={(cat) => {
            setCurrentCategory(cat);
            const catEl = document.getElementById('catalog');
            if (catEl) catEl.scrollIntoView({ behavior: 'smooth' });
          }}
          lang={lang}
        />

        {/* 3. Promotional Flash Deals with live ticking countdown */}
        <FlashDeals
          products={products}
          wishlist={wishlist}
          onToggleWishlist={handleToggleWishlist}
          onAddToCart={handleAddToCart}
          onQuickView={(p) => setQuickViewProduct(p)}
          lang={lang}
        />

        {/* 4. Mid-page Apple Ecosystem Banner */}
        <section className="rounded-xl overflow-hidden shadow-xs mb-8 bg-gradient-to-l from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-gray-800">
          <div className="max-w-xl">
            <span className="bg-blue-600 text-white text-[11px] font-bold px-2.5 py-1 rounded mb-3 inline-block">
              {lang === 'ar' ? 'تجهيزات العمل والإنتاجية' : 'Apple Official Hub'}
            </span>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold mb-2">
              {lang === 'ar' ? 'منظومة أجهزة Apple مع الضمان المحلي المعتمد' : 'Official Apple Ecosystem in Egypt'}
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 mb-4 leading-relaxed">
              {lang === 'ar'
                ? 'أجهزة MacBook Pro بشريحة M3 Pro وشاشات Liquid Retina XDR، مع سماعات AirPods Max. ضمان سنتين وإمكانية التقسيط حتى 36 شهر بدون فوائد.'
                : 'MacBook Pro with M3 Pro chips and AirPods Max. 2-year warranty with 0% installment options.'}
            </p>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => {
                  setCurrentCategory('laptops');
                  const catEl = document.getElementById('catalog');
                  if (catEl) catEl.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-[#F68B1E] hover:bg-[#e07a14] text-white font-bold px-5 py-2.5 rounded-lg text-xs sm:text-sm transition-colors cursor-pointer"
              >
                {lang === 'ar' ? 'تصفح أجهزة ماك بوك' : 'Browse MacBooks'}
              </button>
              <button
                onClick={() => setTelegramOpen(true)}
                className="bg-white/10 hover:bg-white/20 text-white font-semibold px-4 py-2.5 rounded-lg text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 text-sky-400" />
                <span>{lang === 'ar' ? 'استفسر عبر تيليجرام' : 'Ask Telegram Bot'}</span>
              </button>
            </div>
          </div>
          <div className="w-full md:w-auto flex justify-center">
            <img 
              src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80" 
              alt="Apple ecosystem" 
              className="rounded-lg max-h-48 object-cover shadow-2xl border border-white/10"
              loading="lazy"
            />
          </div>
        </section>

        {/* 5. Main Filterable Catalog Section */}
        <ProductCatalog
          products={products}
          currentCategory={currentCategory}
          onSelectCategory={setCurrentCategory}
          searchQuery={searchQuery}
          onResetSearch={() => setSearchQuery('')}
          wishlist={wishlist}
          onToggleWishlist={handleToggleWishlist}
          onAddToCart={handleAddToCart}
          onQuickView={(p) => setQuickViewProduct(p)}
          lang={lang}
        />

      </main>

      {/* Footer */}
      <Footer 
        onSelectCategory={(cat) => {
          setCurrentCategory(cat);
          const catEl = document.getElementById('catalog');
          if (catEl) catEl.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenTracker={() => setTrackerOpen(true)}
        lang={lang}
      />

      {/* Floating Action Button for Telegram Assistant */}
      <button
        onClick={() => setTelegramOpen(true)}
        className="fixed bottom-16 md:bottom-6 left-4 z-40 bg-[#17212B] hover:bg-[#202E3C] text-white p-3 sm:px-4 sm:py-3 rounded-full shadow-2xl border border-sky-500/40 flex items-center gap-2 group cursor-pointer transition-all transform hover:scale-105"
        title="فتح بوت تيليجرام للمبيعات وتتبع الطلبات"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white shrink-0">
          <Send className="w-4 h-4 -rotate-45" />
        </div>
        <div className="hidden sm:block text-right leading-tight">
          <span className="text-[10px] text-sky-400 block font-bold">بوت مبيعات وتتبع تيليجرام</span>
          <span className="text-xs font-black">ElectroTech Bot</span>
        </div>
      </button>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#E6E6E6] z-40 px-3 py-2 flex items-center justify-around shadow-2xl">
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex flex-col items-center text-[#F68B1E] text-[10px] font-bold"
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span>{lang === 'ar' ? 'الرئيسية' : 'Home'}</span>
        </button>
        <button 
          onClick={() => {
            const catEl = document.getElementById('catalog');
            if (catEl) catEl.scrollIntoView({ behavior: 'smooth' });
          }}
          className="flex flex-col items-center text-gray-500 hover:text-[#F68B1E] text-[10px] font-bold"
        >
          <Layers className="w-5 h-5 mb-0.5" />
          <span>{lang === 'ar' ? 'الأقسام' : 'Categories'}</span>
        </button>
        <button 
          onClick={() => setTrackerOpen(true)}
          className="flex flex-col items-center text-gray-500 hover:text-[#F68B1E] text-[10px] font-bold"
        >
          <PackageCheck className="w-5 h-5 mb-0.5 text-[#F68B1E]" />
          <span>{lang === 'ar' ? 'تتبع طلبي' : 'Track'}</span>
        </button>
        <button 
          onClick={() => setCartOpen(true)}
          className="relative flex flex-col items-center text-gray-500 hover:text-[#F68B1E] text-[10px] font-bold"
        >
          <ShoppingCart className="w-5 h-5 mb-0.5" />
          {cartCount > 0 && (
            <span className="absolute -top-1 right-2 bg-[#F68B1E] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
              {cartCount}
            </span>
          )}
          <span>{lang === 'ar' ? 'السلة' : 'Cart'}</span>
        </button>
        <button 
          onClick={() => setTelegramOpen(true)}
          className="flex flex-col items-center text-sky-500 text-[10px] font-bold"
        >
          <Send className="w-5 h-5 mb-0.5" />
          <span>{lang === 'ar' ? 'تيليجرام' : 'Telegram'}</span>
        </button>
      </div>

      {/* MODALS */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cart}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveFromCart}
        onProceedCheckout={() => {
          setCartOpen(false);
          setCheckoutOpen(true);
        }}
        lang={lang}
      />

      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        items={cart}
        onOrderSuccess={handleOrderSuccess}
        lang={lang}
      />

      <OrderTrackerModal
        isOpen={trackerOpen}
        onClose={() => setTrackerOpen(false)}
        lang={lang}
      />

      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
        onToggleWishlist={handleToggleWishlist}
        isWishlisted={quickViewProduct ? wishlist.includes(quickViewProduct.id) : false}
        lang={lang}
      />

      <AdminPanel
        isOpen={adminOpen}
        onClose={() => setAdminOpen(false)}
        products={products}
        onRefreshProducts={fetchProducts}
        lang={lang}
      />

      <TelegramBotModal
        isOpen={telegramOpen}
        onClose={() => setTelegramOpen(false)}
        lang={lang}
      />

      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          if (user.role === 'admin') setAdminOpen(true);
        }}
        lang={lang}
      />

    </div>
  );
}
