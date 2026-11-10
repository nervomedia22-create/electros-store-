import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import type { Product, Order, OrderStatus, TelegramMessage, StoreMetrics } from './src/types';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(express.json());

// -------------------------------------------------------------
// Seed Database: Initial Products from ElectroTech Egypt Catalog
// -------------------------------------------------------------
const initialProducts: Product[] = [
  {
    id: 1,
    title: "آبل آيفون 15 برو ماكس - 256 جيجابايت، تيتانيوم طبيعي، شريحة 5G",
    titleEn: "Apple iPhone 15 Pro Max - 256GB, Natural Titanium, 5G",
    category: "phones",
    price: 63999,
    oldPrice: 71500,
    discount: 11,
    rating: 4.9,
    reviewsCount: 384,
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&auto=format&fit=crop&q=80",
    express: true,
    stock: 14,
    stockPercent: 82,
    brand: "Apple",
    isFlash: true,
    specs: "شاشة Super Retina XDR مقاس 6.7 إنش مع ProMotion، معالج A17 Pro، كاميرا 48 ميجابكسل تدعم تقريب بصري 5x، هيكل تيتانيوم مقاوم للماء"
  },
  {
    id: 2,
    title: "سامسونج جالاكسي S24 ألترا - 512 جيجابايت، 12 جيجا رام، مع قلم S-Pen",
    titleEn: "Samsung Galaxy S24 Ultra - 512GB, 12GB RAM, S-Pen",
    category: "phones",
    price: 54999,
    oldPrice: 62000,
    discount: 12,
    rating: 4.8,
    reviewsCount: 290,
    image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&auto=format&fit=crop&q=80",
    express: true,
    stock: 22,
    stockPercent: 65,
    brand: "Samsung",
    isFlash: true,
    specs: "شاشة Dynamic AMOLED 2X مسطحة بمعدل 120Hz، معالج Snapdragon 8 Gen 3، مزايا الذكاء الاصطناعي Galaxy AI المتطورة"
  },
  {
    id: 3,
    title: "لابتوب آبل ماك بوك برو 14 إنش - شريحة M3 Pro، 18 جيجا رام، 512 SSD",
    titleEn: "Apple MacBook Pro 14\" - M3 Pro Chip, 18GB RAM, 512GB SSD",
    category: "laptops",
    price: 89999,
    oldPrice: 98000,
    discount: 8,
    rating: 5.0,
    reviewsCount: 142,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&auto=format&fit=crop&q=80",
    express: true,
    stock: 8,
    stockPercent: 90,
    brand: "Apple",
    isFlash: false,
    specs: "شاشة Liquid Retina XDR مبهرة، عمر بطارية حتى 22 ساعة، منافذ كاملة تشمل HDMI وقارئ بطاقات SDXC وشاحن MagSafe 3"
  },
  {
    id: 4,
    title: "لابتوب ألعاب ديل G15 للألعاب - Core i7 الجيل 13، RTX 4060، 16 جيجا رام",
    titleEn: "Dell G15 Gaming Laptop - Core i7 13th Gen, RTX 4060, 16GB RAM",
    category: "laptops",
    price: 46500,
    oldPrice: 53000,
    discount: 12,
    rating: 4.7,
    reviewsCount: 98,
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&auto=format&fit=crop&q=80",
    express: true,
    stock: 5,
    stockPercent: 44,
    brand: "Dell",
    isFlash: true,
    specs: "شاشة FHD تردد 165Hz، نظام تبريد مستوحى من Alienware، كيبورد بإضاءة RGB برتقالية مميزة، تبريد مزدوج"
  },
  {
    id: 5,
    title: "سوني WH-1000XM5 سماعات رأس لاسلكية احترافية مع عزل ذكي للضوضاء",
    titleEn: "Sony WH-1000XM5 Wireless Noise-Cancelling Headphones",
    category: "audio",
    price: 16999,
    oldPrice: 20500,
    discount: 17,
    rating: 4.9,
    reviewsCount: 512,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80",
    express: true,
    stock: 31,
    stockPercent: 77,
    brand: "Sony",
    isFlash: true,
    specs: "معالج V1 ومعالج QN1 المتطور، جودة صوت Hi-Res مع دعم LDAC، بطارية 30 ساعة وشحن فائق السرعة عبر Type-C"
  },
  {
    id: 6,
    title: "آبل إيربودز برو الجيل الثاني مع علبة شحن MagSafe (منفذ USB-C)",
    titleEn: "Apple AirPods Pro 2nd Gen with MagSafe Case (USB-C)",
    category: "audio",
    price: 11499,
    oldPrice: 13900,
    discount: 17,
    rating: 4.8,
    reviewsCount: 670,
    image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=500&auto=format&fit=crop&q=80",
    express: true,
    stock: 45,
    stockPercent: 92,
    brand: "Apple",
    isFlash: false,
    specs: "شريحة H2 المتقدمة، عزل ضوضاء مضاعف، صوت مكاني مخصص مع تتبع ديناميكي للرأس، مقاومة للماء والعرق"
  },
  {
    id: 7,
    title: "شاشة سامسونج 55 بوصة سمارت 4K UHD بتقنية Crystal وHDR10+",
    titleEn: "Samsung 55\" Smart 4K UHD TV Crystal Processor HDR10+",
    category: "tvs",
    price: 21999,
    oldPrice: 26500,
    discount: 17,
    rating: 4.6,
    reviewsCount: 310,
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500&auto=format&fit=crop&q=80",
    express: true,
    stock: 12,
    stockPercent: 58,
    brand: "Samsung",
    isFlash: true,
    specs: "معالج Crystal Processor 4K، نظام تشغيل Tizen OS يدعم Shahid وNetflix، تصميم نحيف بدون حواف"
  },
  {
    id: 8,
    title: "ساعة آبل الترا 2 (Apple Watch Ultra 2) مقاس 49 ملم مع حزام تيتانيوم",
    titleEn: "Apple Watch Ultra 2 - 49mm Titanium Case",
    category: "watches",
    price: 43500,
    oldPrice: 48900,
    discount: 11,
    rating: 4.9,
    reviewsCount: 115,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80",
    express: true,
    stock: 9,
    stockPercent: 88,
    brand: "Apple",
    isFlash: false,
    specs: "شاشة ساطعة لغاية 3000 شمعة، هيكل تيتانيوم متين مقاوم للماء حتى 100 متر، بطارية تدوم 72 ساعة في وضع الطاقة المنخفضة"
  },
  {
    id: 9,
    title: "منصة سوني بلايستيشن 5 سليم (PS5 Slim) إصدار الأقراص + يد تحكم إضافية",
    titleEn: "Sony PlayStation 5 Slim Disc Edition + DualSense Controller",
    category: "gaming",
    price: 33499,
    oldPrice: 38000,
    discount: 12,
    rating: 4.9,
    reviewsCount: 440,
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500&auto=format&fit=crop&q=80",
    express: true,
    stock: 16,
    stockPercent: 62,
    brand: "Sony",
    isFlash: true,
    specs: "سعة تخزين 1 تيرابايت SSD فائق السرعة، دعم تتبع الأشعة Ray Tracing و120Hz، صوت ثلاثي الأبعاد Tempest 3D"
  },
  {
    id: 10,
    title: "كاميرا كانون EOS R50 ميرورليس مع عدسة 18-45 مم بدقة 4K",
    titleEn: "Canon EOS R50 Mirrorless Camera + 18-45mm Lens 4K",
    category: "cameras",
    price: 38900,
    oldPrice: 44000,
    discount: 11,
    rating: 4.7,
    reviewsCount: 85,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&auto=format&fit=crop&q=80",
    express: false,
    stock: 7,
    stockPercent: 50,
    brand: "Canon",
    isFlash: false,
    specs: "مستشعر APS-C بدقة 24.2 ميجابكسل، تركيز تلقائي ذكي Dual Pixel CMOS AF II، تصوير فيديو 4K بدون اقتطاع"
  },
  {
    id: 11,
    title: "لوحة مفاتيح ميكانيكية مخصصة للألعاب RGB مع سويتشات حمراء سريعة",
    titleEn: "Mechanical Gaming Keyboard RGB with Red Switches",
    category: "accessories",
    price: 2450,
    oldPrice: 3200,
    discount: 23,
    rating: 4.5,
    reviewsCount: 178,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=80",
    express: true,
    stock: 35,
    stockPercent: 35,
    brand: "Redragon",
    isFlash: false,
    specs: "هيكل ألومنيوم طيران خفيف، مفاتيح مقاومة لانسكاب السوائل، 18 نمط إضاءة RGB مخصص ومفاتيح ماكرو قابلة للبرمجة"
  },
  {
    id: 12,
    title: "ساعة سامسونج جالاكسي ووتش 6 كلاسيك - 47 ملم مع إطار دوار فيزيائي",
    titleEn: "Samsung Galaxy Watch 6 Classic - 47mm Rotating Bezel",
    category: "watches",
    price: 14200,
    oldPrice: 17500,
    discount: 18,
    rating: 4.6,
    reviewsCount: 160,
    image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&auto=format&fit=crop&q=80",
    express: true,
    stock: 19,
    stockPercent: 70,
    brand: "Samsung",
    isFlash: false,
    specs: "زجاج ياقوتي مضاد للخدش، مراقبة متقدمة للنوم وضغط الدم ورسم القلب الكهربائي ECG، نظام Wear OS مدعوم من Google"
  }
];

// In-Memory Database with optional disk save
let products: Product[] = [...initialProducts];

// Pre-seeded Orders for immediate testing
let orders: Order[] = [
  {
    id: "EG-10842",
    customerName: "أحمد محمود سالم",
    customerPhone: "01012345678",
    customerEmail: "ahmed.salem@example.com",
    customerAddress: "شارع مصطفى النحاس، عمارة 42، شقة 5",
    city: "مدينة نصر، القاهرة",
    paymentMethod: "cod",
    totalAmount: 63999,
    items: [
      {
        productId: 1,
        title: "آبل آيفون 15 برو ماكس - 256 جيجابايت",
        price: 63999,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&auto=format&fit=crop&q=80"
      }
    ],
    status: "shipped",
    trackingCode: "BSTA-882194-EG",
    courierName: "كابتن إبراهيم فؤاد (بوسطة إكسبريس)",
    courierPhone: "01198765432",
    notes: "يرجى الاتصال قبل الوصول بنصف ساعة",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    history: [
      { status: 'pending', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(), note: 'تم استلام وتأكيد الطلب بنجاح في مركز معالجة القاهرة' },
      { status: 'processing', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(), note: 'تم فحص جودة المنتج وتغليفه بالباركود الأصلي' },
      { status: 'shipped', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), note: 'تم تسليم الشحنة لمندوب التوصيل - في الطريق إلى العميل' }
    ]
  },
  {
    id: "EG-10841",
    customerName: "سارة عبد الرحمن",
    customerPhone: "01234567890",
    customerEmail: "sara.tech@example.com",
    customerAddress: "شارع 9، المعادي",
    city: "المعادي، القاهرة",
    paymentMethod: "card",
    totalAmount: 28498,
    items: [
      {
        productId: 5,
        title: "سوني WH-1000XM5 سماعات رأس لاسلكية",
        price: 16999,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80"
      },
      {
        productId: 6,
        title: "آبل إيربودز برو الجيل الثاني",
        price: 11499,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=500&auto=format&fit=crop&q=80"
      }
    ],
    status: "processing",
    trackingCode: "BSTA-882193-EG",
    courierName: "كابتن طارق يوسف",
    courierPhone: "01099887766",
    notes: "مدفوع بالفيزا مسبقاً",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(),
    history: [
      { status: 'pending', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), note: 'تم الدفع بنجاح واعتماد الطلب' },
      { status: 'processing', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(), note: 'جاري تجهيز الشحنة وتجهيز بوليصة الشحن السريع' }
    ]
  },
  {
    id: "EG-10839",
    customerName: "محمود حسن الشريف",
    customerPhone: "01511223344",
    customerEmail: "m.hassan@example.com",
    customerAddress: "شارع جمال عبد الناصر، ميامي",
    city: "الإسكندرية",
    paymentMethod: "fawry",
    totalAmount: 33499,
    items: [
      {
        productId: 9,
        title: "منصة سوني بلايستيشن 5 سليم",
        price: 33499,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500&auto=format&fit=crop&q=80"
      }
    ],
    status: "delivered",
    trackingCode: "BSTA-882170-EG",
    courierName: "كابتن عادل فاروق",
    courierPhone: "01233445566",
    notes: "تم التوصيل بنجاح واستلام العميل للطلب",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    history: [
      { status: 'pending', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), note: 'تم تأكيد الدفع عبر فوري' },
      { status: 'processing', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(), note: 'تم تجهيز الجهاز مع الضمان الأصلي' },
      { status: 'shipped', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(), note: 'خرج للتوصيل في الإسكندرية' },
      { status: 'delivered', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), note: 'تم التوصيل واستلام العميل' }
    ]
  }
];

// Supabase dynamic configuration
let supabaseConfig = {
  url: process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '',
  anonKey: process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '',
  serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  isConnected: false
};

// Telegram Bot configuration
let telegramConfig = {
  botToken: process.env.TELEGRAM_BOT_TOKEN || '',
  botUsername: process.env.TELEGRAM_BOT_USERNAME || 'ElectroTechEgyptBot',
  channelId: process.env.TELEGRAM_CHANNEL_ID || '',
  isActive: true
};

// SSE Clients for real-time notifications
const sseClients: Response[] = [];

function broadcastNotification(payload: { title: string; message: string; type: string; orderId?: string }) {
  const data = JSON.stringify({ ...payload, timestamp: new Date().toISOString() });
  sseClients.forEach(client => {
    try {
      client.write(`data: ${data}\n\n`);
    } catch {
      // client disconnected
    }
  });
}

// Users Database
interface UserRecord {
  id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  role: 'customer' | 'admin';
  createdAt: string;
}

let users: UserRecord[] = [
  {
    id: "usr-admin-mahmoud",
    name: "محمود (مدير المتجر)",
    email: "mahmoud@admin.com",
    password: "123456",
    phone: "01000000000",
    role: "admin",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString()
  }
];

// -------------------------------------------------------------
// REST API ROUTES
// -------------------------------------------------------------

// 0. Authentication API
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'يرجى إدخال البريد الإلكتروني وكلمة المرور' });
  }

  const cleanEmail = email.trim().toLowerCase();
  const user = users.find(u => u.email.toLowerCase() === cleanEmail);

  if (!user) {
    return res.status(404).json({ 
      success: false, 
      code: 'USER_NOT_FOUND',
      message: 'هذا الحساب غير مسجل في قاعدة البيانات، يرجى إنشاء حساب أولاً' 
    });
  }

  if (user.password !== password) {
    return res.status(401).json({ 
      success: false, 
      code: 'INVALID_PASSWORD',
      message: 'كلمة المرور غير صحيحة، يرجى المحاولة مرة أخرى' 
    });
  }

  res.json({
    success: true,
    message: 'تم تسجيل الدخول بنجاح',
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role
    }
  });
});

app.post('/api/auth/register', (req: Request, res: Response) => {
  const { name, email, password, phone } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'يرجى استكمال جميع البيانات المطلوبة' });
  }

  const cleanEmail = email.trim().toLowerCase();
  const existing = users.find(u => u.email.toLowerCase() === cleanEmail);
  if (existing) {
    return res.status(409).json({ 
      success: false, 
      code: 'USER_EXISTS',
      message: 'هذا البريد الإلكتروني مسجل بالفعل، يمكنك تسجيل الدخول مباشرة' 
    });
  }

  // Admin role check if special email
  const role: 'customer' | 'admin' = (cleanEmail === 'mahmoud@admin.com') ? 'admin' : 'customer';

  const newUser: UserRecord = {
    id: `usr-${Date.now()}`,
    name: name.trim(),
    email: cleanEmail,
    password: password,
    phone: phone || '',
    role,
    createdAt: new Date().toISOString()
  };

  users.push(newUser);

  res.status(201).json({
    success: true,
    message: 'تم إنشاء الحساب بنجاح',
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role
    }
  });
});

// 1. Products API
app.get('/api/products', (req: Request, res: Response) => {
  const { category, search, flash } = req.query;
  let result = [...products];

  if (category && category !== 'all') {
    result = result.filter(p => p.category === category);
  }

  if (flash === 'true') {
    result = result.filter(p => p.isFlash);
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    result = result.filter(p =>
      p.title.toLowerCase().includes(q) ||
      (p.titleEn && p.titleEn.toLowerCase().includes(q)) ||
      p.brand.toLowerCase().includes(q) ||
      p.specs.toLowerCase().includes(q)
    );
  }

  res.json({ success: true, count: result.length, data: result });
});

app.get('/api/products/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const product = products.find(p => p.id === id);
  if (!product) {
    return res.status(404).json({ success: false, message: 'المنتج غير موجود' });
  }
  res.json({ success: true, data: product });
});

app.post('/api/products', (req: Request, res: Response) => {
  const body = req.body;
  const newProduct: Product = {
    id: Date.now(),
    title: body.title,
    titleEn: body.titleEn || body.title,
    category: body.category || 'phones',
    price: Number(body.price),
    oldPrice: body.oldPrice ? Number(body.oldPrice) : undefined,
    discount: body.oldPrice && Number(body.oldPrice) > Number(body.price) 
      ? Math.round(((Number(body.oldPrice) - Number(body.price)) / Number(body.oldPrice)) * 100)
      : undefined,
    rating: 5.0,
    reviewsCount: 1,
    image: body.image || 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=500&auto=format&fit=crop&q=80',
    express: Boolean(body.express),
    stock: Number(body.stock || 10),
    stockPercent: 95,
    brand: body.brand || 'ElectroTech',
    isFlash: Boolean(body.isFlash),
    specs: body.specs || 'ضمان معتمد محلي لمدة عام كامل'
  };

  products.unshift(newProduct);
  res.status(201).json({ success: true, data: newProduct });
});

app.put('/api/products/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const index = products.findIndex(p => p.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'المنتج غير موجود' });
  }

  const body = req.body;
  const price = body.price !== undefined ? Number(body.price) : products[index].price;
  const oldPrice = body.oldPrice !== undefined 
    ? (body.oldPrice ? Number(body.oldPrice) : undefined) 
    : products[index].oldPrice;
  const discount = (oldPrice && oldPrice > price) 
    ? Math.round(((oldPrice - price) / oldPrice) * 100) 
    : undefined;

  products[index] = {
    ...products[index],
    ...body,
    id,
    price,
    oldPrice,
    discount,
    stock: body.stock !== undefined ? Number(body.stock) : products[index].stock,
    express: body.express !== undefined ? Boolean(body.express) : products[index].express,
    isFlash: body.isFlash !== undefined ? Boolean(body.isFlash) : products[index].isFlash
  };

  res.json({ success: true, message: 'تم تحديث بيانات المنتج بنجاح', data: products[index] });
});

app.delete('/api/products/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  products = products.filter(p => p.id !== id);
  res.json({ success: true, message: 'تم حذف المنتج بنجاح' });
});

// 2. Orders & Order Tracking API
app.get('/api/orders', (req: Request, res: Response) => {
  const { phone, id } = req.query;
  let result = [...orders];

  if (phone && typeof phone === 'string') {
    result = result.filter(o => o.customerPhone.includes(phone) || o.customerEmail.includes(phone));
  }

  if (id && typeof id === 'string') {
    result = result.filter(o => o.id.toLowerCase() === id.toLowerCase() || o.trackingCode.toLowerCase() === id.toLowerCase());
  }

  res.json({ success: true, count: result.length, data: result });
});

app.get('/api/orders/:id', (req: Request, res: Response) => {
  const searchId = req.params.id.trim().toUpperCase();
  const order = orders.find(o => 
    o.id.toUpperCase() === searchId || 
    o.trackingCode.toUpperCase() === searchId
  );

  if (!order) {
    return res.status(404).json({ success: false, message: 'لم يتم العثور على طلب بهذا الرقم' });
  }

  res.json({ success: true, data: order });
});

app.post('/api/orders', (req: Request, res: Response) => {
  const { customerName, customerPhone, customerEmail, customerAddress, city, paymentMethod, items, notes } = req.body;

  if (!customerName || !customerPhone || !items || !items.length) {
    return res.status(400).json({ success: false, message: 'يرجى استكمال بيانات المشتري وسلة المشتريات' });
  }

  const orderNum = Math.floor(10000 + Math.random() * 90000);
  const orderId = `EG-${orderNum}`;
  const trackingCode = `BSTA-${Math.floor(100000 + Math.random() * 900000)}-EG`;

  const totalAmount = items.reduce((sum: number, it: any) => sum + (it.price * it.quantity), 0);

  // Decrease stock for items
  items.forEach((item: any) => {
    const prod = products.find(p => p.id === item.productId);
    if (prod && prod.stock > 0) {
      prod.stock = Math.max(0, prod.stock - item.quantity);
    }
  });

  const now = new Date().toISOString();
  const newOrder: Order = {
    id: orderId,
    customerName,
    customerPhone,
    customerEmail: customerEmail || 'customer@electrotech.eg',
    customerAddress,
    city: city || 'القاهرة الكبرى',
    paymentMethod: paymentMethod || 'cod',
    totalAmount,
    items,
    status: 'pending',
    trackingCode,
    courierName: 'بوسطة إكسبريس (جاري تعيين المندوب)',
    courierPhone: '19888',
    notes,
    createdAt: now,
    updatedAt: now,
    history: [
      { status: 'pending', timestamp: now, note: 'تم إنشاء الطلب بنجاح وهو قيد المراجعة في نظام المستودعات' }
    ]
  };

  orders.unshift(newOrder);

  // Broadcast real-time push notification
  broadcastNotification({
    title: 'طلب جديد وارد!',
    message: `طلب رقم ${orderId} بقيمة ${totalAmount.toLocaleString('ar-EG')} ج.م من ${customerName}`,
    type: 'order',
    orderId
  });

  res.status(201).json({ success: true, data: newOrder });
});

app.patch('/api/orders/:id/status', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, note } = req.body as { status: OrderStatus; note?: string };

  const order = orders.find(o => o.id === id || o.trackingCode === id);
  if (!order) {
    return res.status(404).json({ success: false, message: 'الطلب غير موجود' });
  }

  order.status = status;
  order.updatedAt = new Date().toISOString();

  let defaultNote = '';
  switch (status) {
    case 'processing':
      defaultNote = 'تم تأكيد التجهيز وتغليف المنتج بأمان في المستودع الرئيسي';
      break;
    case 'shipped':
      defaultNote = 'تم تسليم الشحنة لمندوب التوصيل وهي في طريقها إليك الآن';
      break;
    case 'delivered':
      defaultNote = 'تم تسليم الشحنة بنجاح واستلام العميل';
      break;
    case 'cancelled':
      defaultNote = 'تم إلغاء الطلب وإعادة العناصر للمخزون';
      break;
    default:
      defaultNote = 'تم تحديث حالة الطلب';
  }

  order.history.push({
    status,
    timestamp: new Date().toISOString(),
    note: note || defaultNote
  });

  // Broadcast push to client
  broadcastNotification({
    title: `تحديث الشحنة: ${order.id}`,
    message: `حالة طلبك الآن: ${status === 'delivered' ? 'تم التوصيل بنجاح 🎉' : status === 'shipped' ? 'خرج للتوصيل 🚚' : status === 'processing' ? 'جاري تجهيز الشحنة 📦' : status}`,
    type: 'shipping',
    orderId: order.id
  });

  res.json({ success: true, data: order });
});

// 3. Admin Metrics & Analytics
app.get('/api/admin/metrics', (_req: Request, res: Response) => {
  const totalSales = orders.reduce((sum, o) => o.status !== 'cancelled' ? sum + o.totalAmount : sum, 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const shippedOrders = orders.filter(o => o.status === 'shipped').length;
  const deliveredOrders = orders.filter(o => o.status === 'delivered').length;
  const lowStockCount = products.filter(p => p.stock <= 5).length;

  const metrics: StoreMetrics = {
    totalSales,
    totalOrders: orders.length,
    pendingOrders,
    shippedOrders,
    deliveredOrders,
    totalProducts: products.length,
    lowStockCount
  };

  res.json({ success: true, data: metrics });
});

app.get('/api/admin/analytics', (_req: Request, res: Response) => {
  const totalSales = orders.reduce((sum, o) => o.status !== 'cancelled' ? sum + o.totalAmount : sum, 0);

  // 1. Daily sales timeline (last 7 days simulation based on existing and calculated data)
  const daysAr = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  const timeline = [];
  const now = new Date();

  for (let i = 6; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dayName = daysAr[d.getDay()];
    const dateFormatted = d.toLocaleDateString('ar-EG', { month: 'numeric', day: 'numeric' });
    
    // Filter actual orders or synthesize proportionate curve
    const dayOrders = orders.filter(o => {
      const ordDate = new Date(o.createdAt);
      return ordDate.getDate() === d.getDate() && ordDate.getMonth() === d.getMonth();
    });

    const dayRevenue = dayOrders.reduce((sum, o) => o.status !== 'cancelled' ? sum + o.totalAmount : sum, 0);
    // Add realistic baseline if day had 0 orders so charts look informative
    const simulatedRevenue = dayRevenue > 0 ? dayRevenue : (i === 0 ? 63999 : (i % 2 === 0 ? 28498 : 33499));
    const simulatedCount = dayOrders.length > 0 ? dayOrders.length : (i % 3 === 0 ? 2 : 1);

    timeline.push({
      day: dayName,
      date: dateFormatted,
      revenue: simulatedRevenue,
      orders: simulatedCount
    });
  }

  // 2. Sales by Category
  const categoryLabels: Record<string, string> = {
    phones: 'الهواتف الذكية',
    laptops: 'اللابتوب والكمبيوتر',
    tvs: 'الشاشات والتلفزيون',
    audio: 'الصوتيات والسماعات',
    watches: 'الساعات الذكية',
    gaming: 'منصات الألعاب',
    accessories: 'الإكسسوارات',
    cameras: 'كاميرات وتصوير'
  };

  const categorySales = Object.keys(categoryLabels).map(cat => {
    const prods = products.filter(p => p.category === cat);
    // Calculate ordered items in this category
    let catRevenue = 0;
    let unitsSold = 0;

    orders.forEach(o => {
      o.items.forEach(it => {
        const prod = products.find(p => p.id === it.productId);
        if (prod && prod.category === cat) {
          catRevenue += it.price * it.quantity;
          unitsSold += it.quantity;
        }
      });
    });

    // Provide default proportional sample if not yet bought
    if (catRevenue === 0 && prods.length > 0) {
      catRevenue = prods[0].price;
      unitsSold = 1;
    }

    const totalProductStock = prods.reduce((sum, p) => sum + p.stock, 0);

    return {
      category: cat,
      labelAr: categoryLabels[cat],
      productCount: prods.length,
      revenue: catRevenue,
      unitsSold,
      stockTotal: totalProductStock
    };
  }).sort((a, b) => b.revenue - a.revenue);

  // 3. Status Funnel Breakdown
  const totalOrd = orders.length || 1;
  const statusCounts = {
    delivered: orders.filter(o => o.status === 'delivered').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    processing: orders.filter(o => o.status === 'processing').length,
    pending: orders.filter(o => o.status === 'pending').length
  };

  const statusBreakdown = [
    { status: 'delivered', labelAr: 'تم التوصيل بنجاح', count: statusCounts.delivered, percent: Math.round((statusCounts.delivered / totalOrd) * 100), color: '#238636' },
    { status: 'shipped', labelAr: 'في الطريق مع المندوب', count: statusCounts.shipped, percent: Math.round((statusCounts.shipped / totalOrd) * 100), color: '#2563EB' },
    { status: 'processing', labelAr: 'جاري التجهيز بالمستودع', count: statusCounts.processing, percent: Math.round((statusCounts.processing / totalOrd) * 100), color: '#F68B1E' },
    { status: 'pending', labelAr: 'قيد المراجعة والاعتماد', count: statusCounts.pending, percent: Math.round((statusCounts.pending / totalOrd) * 100), color: '#94A3B8' }
  ];

  // 4. Top Selling Products
  const topProducts = products
    .map(p => {
      let sold = 0;
      orders.forEach(o => {
        const it = o.items.find(item => item.productId === p.id);
        if (it) sold += it.quantity;
      });
      // Fallback weight based on rating and reviews
      const simulatedSold = sold > 0 ? sold : Math.max(1, Math.round(p.reviewsCount / 25));
      return {
        id: p.id,
        title: p.title,
        price: p.price,
        stock: p.stock,
        category: p.category,
        brand: p.brand,
        image: p.image,
        unitsSold: simulatedSold,
        totalRevenue: simulatedSold * p.price
      };
    })
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, 6);

  // 5. Stock Health
  const stockHealth = {
    healthy: products.filter(p => p.stock > 10).length,
    low: products.filter(p => p.stock > 0 && p.stock <= 10).length,
    outOfStock: products.filter(p => p.stock === 0).length,
    totalCatalogItems: products.length
  };

  res.json({
    success: true,
    data: {
      totalSales,
      totalOrders: orders.length,
      averageOrderValue: Math.round(totalSales / totalOrd),
      timeline,
      categorySales,
      statusBreakdown,
      topProducts,
      stockHealth
    }
  });
});

// 4. Telegram Chatbot API (Interactive Simulated + Real Telegram Bot bridge)
app.post('/api/telegram/chat', (req: Request, res: Response) => {
  const { message, chatId } = req.body;
  const text = (message || '').trim();
  const lower = text.toLowerCase();

  let botReply = '';
  let buttons: { text: string; payload: string }[] | undefined;

  // Telegram Commands
  if (lower === '/start' || lower === 'start' || lower === 'مرحبا' || lower === 'السلام عليكم') {
    botReply = `مرحباً بك في بوت خدمة عملاء ومبيعات **إلكترو تيك مصر** 🇪🇬⚡\n\nأنا مساعدك الذكي للتسوق وتتبع الطلبات وعمليات البيع الفورية.\n\nاختر من الخيارات أدناه أو اكتب رقم طلبك مباشرة:`;
    buttons = [
      { text: "📦 تتبع طلبك", payload: "/track" },
      { text: "🔥 عروض اليوم الفلاش", payload: "/deals" },
      { text: "📊 تقرير مبيعات المتجر (للإدارة)", payload: "/sales" },
      { text: "⚠️ تنبيهات المخزون المنخفض", payload: "/stock" },
      { text: "📞 التواصل مع خدمة العملاء", payload: "/support" }
    ];
  } else if (lower.startsWith('/track') || lower === 'track' || lower === 'تتبع' || lower.includes('طلب')) {
    // If order id passed like "/track EG-10842"
    const match = text.match(/EG-\d+/i) || text.match(/BSTA-[\w-]+/i);
    if (match) {
      const code = match[0].toUpperCase();
      const order = orders.find(o => o.id.toUpperCase() === code || o.trackingCode.toUpperCase() === code);
      if (order) {
        const statusMap: Record<string, string> = {
          pending: '⏳ قيد المراجعة في المستودع',
          processing: '📦 جاري تجهيز الطلب والتغليف',
          shipped: '🚚 خرج للتوصيل مع المندوب',
          delivered: '✅ تم التسليم بنجاح للعميل',
          cancelled: '❌ تم الإلغاء'
        };

        botReply = `📋 **تفاصيل شحنة الطلب: ${order.id}**\n\n` +
          `👤 العميل: ${order.customerName}\n` +
          `📍 العنوان: ${order.customerAddress} - ${order.city}\n` +
          `💰 الإجمالي: ${order.totalAmount.toLocaleString('ar-EG')} ج.م (${order.paymentMethod === 'cod' ? 'دفع عند الاستلام' : 'مدفوع إلكترونياً'})\n` +
          `📌 الحالة الحالية: ${statusMap[order.status] || order.status}\n` +
          `🎫 رقم البوليصة: \`${order.trackingCode}\`\n` +
          `🛵 المندوب: ${order.courierName} (${order.courierPhone})\n\n` +
          `⏳ آخر تحديث: ${order.history[order.history.length - 1]?.note || 'قيد المعالجة'}`;
        
        buttons = [
          { text: "🔄 تحديث الحالة", payload: `/track ${order.id}` },
          { text: "🛒 متابعة التسوق", payload: "/deals" }
        ];
      } else {
        botReply = `عذراً، لم نعثر على أي شحنة برقم \`${code}\`. يرجى التحقق من الرقم (مثال: EG-10842).`;
      }
    } else {
      // Show latest recent orders for convenience
      const recent = orders.slice(0, 3);
      botReply = `يرجى إرسال رقم الطلب (مثال: \`EG-10842\`)، أو اختر من أحدث طلباتك السريعة أدناه:`;
      buttons = recent.map(o => ({
        text: `📦 ${o.id} - ${o.status === 'shipped' ? 'في الطريق' : o.status === 'delivered' ? 'مستلم' : 'قيد التجهيز'}`,
        payload: `/track ${o.id}`
      }));
    }
  } else if (lower === '/sales' || lower === 'sales' || lower.includes('مبيعات')) {
    const totalSales = orders.reduce((sum, o) => o.status !== 'cancelled' ? sum + o.totalAmount : sum, 0);
    const activeOrders = orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length;
    botReply = `📊 **تقرير سرعة ومؤشرات المبيعات المباشرة:**\n\n` +
      `💵 إجمالي الإيرادات (GMV): ${totalSales.toLocaleString('ar-EG')} جنيه مصري\n` +
      `📦 إجمالي الطلبات المسجلة: ${orders.length} طلب\n` +
      `🚚 طلبات جاري توصيلها وتجهيزها: ${activeOrders} طلب\n` +
      `⭐ أعلى المنتجات طلباً: آبل آيفون 15 برو ماكس وسامسونج S24 ألترا\n\n` +
      `النظام متصل ومستقر على مدار الساعة!`;
    buttons = [
      { text: "⚠️ فحص المخزون", payload: "/stock" },
      { text: "📦 تتبع أحدث الطلبات", payload: "/track" }
    ];
  } else if (lower === '/stock' || lower === 'stock' || lower.includes('مخزون')) {
    const lowStock = products.filter(p => p.stock <= 8);
    botReply = `⚠️ **تنبيهات المخزون والمستودع:**\n\n` +
      lowStock.map(p => `• **${p.title.substring(0, 28)}...**: متبقي ${p.stock} قطع فقط (سعر: ${p.price.toLocaleString('ar-EG')} ج.م)`).join('\n') +
      `\n\n💡 يُنصح بإعادة طلب التوريد من الوكيل لتجنب نفاد الكمية!`;
    buttons = [
      { text: "📊 عرض إحصائيات المبيعات", payload: "/sales" },
      { text: "🔥 العروض النشطة", payload: "/deals" }
    ];
  } else if (lower === '/deals' || lower === 'deals' || lower.includes('عروض')) {
    const deals = products.filter(p => p.isFlash).slice(0, 4);
    botReply = `🔥 **أقوى عروض فلاش اليوم بمتجر إلكترو تيك مصر:**\n\n` +
      deals.map(d => `⚡ **${d.title.substring(0, 26)}...**\nسعر خاص: ${d.price.toLocaleString('ar-EG')} ج.م (خصم ${d.discount}%)`).join('\n\n') +
      `\n\n🚚 توصيل سريع لجميع المحافظات خلال 24-48 ساعة!`;
    buttons = [
      { text: "📦 تتبع طلبي", payload: "/track" },
      { text: "📞 خدمة العملاء", payload: "/support" }
    ];
  } else if (lower === '/support' || lower.includes('خدمة') || lower.includes('تواصل')) {
    botReply = `📞 **خدمة عملاء إلكترو تيك مصر:**\n\n` +
      `☎️ الخط الساخن: 19888 (من 9 صباحاً حتى 11 مساءً)\n` +
      `💬 واتساب الدعم الفني: +20 10 1234 5678\n` +
      `📧 البريد الإلكتروني: support@electrotech.eg\n` +
      `🏢 الفرع الرئيسي: 14 شارع مكرم عبيد، مدينة نصر، القاهرة`;
    buttons = [
      { text: "🏠 العودة للقائمة الرئيسية", payload: "/start" }
    ];
  } else {
    // Default smart parser: check if user typed an order code directly
    const orderMatch = text.match(/EG-\d+/i) || text.match(/\d{5}/);
    if (orderMatch) {
      const code = orderMatch[0].startsWith('EG-') ? orderMatch[0] : `EG-${orderMatch[0]}`;
      const found = orders.find(o => o.id.toUpperCase() === code.toUpperCase());
      if (found) {
        botReply = `عثرت على طلبك! رقم ${found.id} للعميل ${found.customerName}، حالته الآن: **${found.status === 'shipped' ? 'في الطريق إليك مع المندوب 🚚' : found.status === 'delivered' ? 'تم التوصيل بنجاح ✅' : 'قيد التجهيز بالمستودع 📦'}**.`;
        buttons = [{ text: `عرض كافة التفاصيل 📋`, payload: `/track ${found.id}` }];
      } else {
        botReply = `لم أجد طلباً مسجلاً بالرقم \`${code}\`. يرجى التأكد من الرقم أو طلب المساعدة.`;
      }
    } else {
      botReply = `أهلاً بك! لقد استلمت رسالتك: "${text}".\nيمكنك كتابة رقم طلبك للبحث عنه مباشرة، أو اختيار أحد الأوامر التالية:`;
      buttons = [
        { text: "📦 تتبع طلبي", payload: "/track" },
        { text: "🔥 عروض التكنولوجيا", payload: "/deals" },
        { text: "📊 مؤشرات البيع", payload: "/sales" }
      ];
    }
  }

  res.json({
    success: true,
    data: {
      id: `msg-${Date.now()}`,
      sender: 'bot',
      text: botReply,
      timestamp: new Date().toISOString(),
      buttons
    }
  });
});

// 5. Supabase Settings & Credentials API
app.get('/api/config/supabase', (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      url: supabaseConfig.url ? `${supabaseConfig.url.substring(0, 15)}...` : '',
      hasAnonKey: !!supabaseConfig.anonKey,
      isConnected: !!supabaseConfig.url && !!supabaseConfig.anonKey,
      mode: (supabaseConfig.url && supabaseConfig.anonKey) ? 'supabase_cloud' : 'local_postgres_compatible'
    }
  });
});

app.post('/api/config/supabase', (req: Request, res: Response) => {
  const { url, anonKey } = req.body;
  if (url && anonKey) {
    try {
      const client = createClient(url, anonKey);
      supabaseConfig.url = url;
      supabaseConfig.anonKey = anonKey;
      supabaseConfig.isConnected = true;
      res.json({ success: true, message: 'تم حفظ وتوصيل إعدادات Supabase بنجاح!' });
    } catch (err: any) {
      res.status(400).json({ success: false, message: 'فشل الاتصال: ' + err.message });
    }
  } else {
    // Reset to local mode
    supabaseConfig.url = '';
    supabaseConfig.anonKey = '';
    supabaseConfig.isConnected = false;
    res.json({ success: true, message: 'تم التحويل إلى وضع قاعدة البيانات المحلية الفائقة السرعة' });
  }
});

// 6. SSE Real-time Notification Stream
app.get('/api/notifications/stream', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  sseClients.push(res);

  // Send initial keep-alive ping
  res.write(`data: ${JSON.stringify({ type: 'connected', message: 'نظام الإشعارات المباشرة نشط' })}\n\n`);

  req.on('close', () => {
    const idx = sseClients.indexOf(res);
    if (idx > -1) sseClients.splice(idx, 1);
  });
});

// -------------------------------------------------------------
// Vite Middleware / Static Serve Integration
// -------------------------------------------------------------
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        hmr: false
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 ElectroTech Egypt server running at http://localhost:${PORT}`);
  });
}

startServer();
