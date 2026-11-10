# ElectroTech Egypt (إلكترو تيك) - Scalable Full-Stack E-Commerce Platform

A production-grade, responsive e-commerce web platform inspired by Egyptian electronics marketplace dynamics (ElectroTech Egypt), featuring robust multi-role user & admin dashboards, PostgreSQL & Supabase data management, live order lifecycle tracking, real-time delivery notifications, and an integrated Telegram Sales & Order Assistant bot.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The application is architected as a full-stack Node.js + Express + React + Tailwind v4 application, pre-configured with Supabase client bindings, real-time event dispatch, and an internal resilient PostgreSQL-compatible persistence layer with seamless Supabase cloud credentials sync.

- **Design & Language Direction**: The storefront faithfully adapts the Egyptian electronics marketplace design from the attached template (`electrotech_store_7aa3a46e.html`) using Cairo Arabic typography, Egyptian Pound (EGP) currency formatting, Jumia-inspired brand colors (Vibrant Orange `#F68B1E`, Charcoal `#282828`, and Clean Slate surfaces), with a quick English toggle option for global testing.
- **Database & Supabase Provider**: Full-stack Express backend with built-in persistent SQLite/PostgreSQL schema, coupled with direct Supabase client initialization. Users can configure their live Supabase URL and Anon/Service Key in the Admin Settings to sync or persist directly to Supabase cloud.
- **Telegram Bot Assistant**: An interactive in-app Telegram bot simulator modal plus a live Telegram Bot API webhook/polling service. Customers can enter order numbers, check real-time shipping milestones, and admins can view live sales velocity, revenue metrics, and inventory alerts directly via Telegram command flows (`/start`, `/status <order_id>`, `/sales`, `/stock`).
- **Push & Real-Time Alerts**: Web Notifications API integration with in-app notification toasts and sound indicators for instant status changes (e.g., Pending → Processing → Out for Delivery → Delivered).

---

## 1. Overview & Core Concept

### What It Does
ElectroTech Egypt is a comprehensive e-commerce platform tailored for electronics and smart tech appliances (smartphones, laptops, 4K TVs, audio gear, smartwatches, and gaming consoles). It integrates:
1. **Public Storefront**: Hero campaigns, lightning flash deals with live countdowns, categorical search with dynamic suggestions, filterable catalog, instant quick-view modal, synchronized cart drawer, and wishlist.
2. **Authentication & User Portal**: Secure sign up, login, order history, live order tracking with visual timeline progress bars, and personal profile management.
3. **Admin Operations Center**: Metrics dashboard (Gross Merchandise Value, order counts, pending fulfillment, low-stock warnings), inventory CRUD (add, edit, toggle flash sales, adjust stock), order status management with 1-click status updates, customer management, and Telegram bot configuration.
4. **Telegram Bot Assistant**: Dual-mode bot (interactive live chat emulator in UI + real Telegram Bot API bridge) allowing buyers to track orders and sellers to monitor sales progress anytime from their phone.

### Target Audience
- **Egyptian & Regional Consumers**: Shoppers seeking authentic electronics with local warranty, cash on delivery (COD), card payments, and transparent order tracking.
- **Store Managers & Admins**: Operations teams managing stock levels, dispatching orders, and tracking fulfillment velocity.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Discovery & Purchase**:
   - Shopper visits homepage, explores flash deals and category tabs (الهواتف, اللابتوبات, الشاشات, الصوتيات, الساعات, الألعاب).
   - Searches with instant typeahead suggestions or filters by category.
   - Clicks product for Quick View or adds directly to the slide-over Cart Drawer.
   - Proceeds to Checkout with Cash on Delivery or Card, generating an Order ID (`EG-XXXXXX`).
2. **Order Tracking & Notifications**:
   - Shopper receives on-screen confirmation and push notification permission request.
   - Can track package on the dedicated `/track` page or `/account/orders` with visual milestone stages (`تم تأكيد الطلب` → `جاري التجهيز` → `خرج للتوصيل` → `تم التوصيل`).
3. **Telegram Chatbot Experience**:
   - Shopper or Admin opens the Telegram Bot widget (or scans QR / clicks link to actual bot).
   - Sending `/track EG-1024` instantly replies with package location, courier name, and ETA.
   - Admin sending `/sales` or `/summary` receives instant analytics of daily orders and revenue.
4. **Admin Management**:
   - Admin switches to Admin Panel, reviews KPI counters, alters order status (triggering real-time client push notifications), and updates product catalog items.

### Visual Identity & Theme Tokens
- **Primary Accent**: `#F68B1E` (Brand Orange) & `#e07a14` (Hover Dark)
- **Neutral Canvas**: `#F5F5F5` (Soft background) and `#FFFFFF` (Pure white cards)
- **Charcoal Text & Headers**: `#282828` and `#333333`
- **Status & Alerts**: `#238636` (Success green), `#D84343` (Discount & urgent red), `#2563EB` (Information blue)
- **Typography**: Google Font **Cairo** (`weights: 400, 600, 700, 800, 900`) for high-legibility Arabic & English text, paired with `font-mono tabular-nums` for currency prices and order IDs.

---

## 3. Key Product Decisions & Trade-Offs

### Decision 1: Full-Stack Architecture with Node.js Express & Supabase Client
- **Chosen Approach**: Build a unified full-stack Node.js Express server (`server.ts`) hosting REST API endpoints under `/api/*` and serving the Vite React frontend. Provide native database storage with immediate Supabase Cloud integration (via `@supabase/supabase-js`).
- **Why**: Guarantees zero runtime dependency on external network setup for immediate out-of-the-box preview, while offering seamless connection to any live Supabase PostgreSQL project with a single click in Admin Settings.
- **Alternatives Considered**: Direct client-only Supabase calls without server proxy: Rejected because Telegram webhooks, secure admin analytics, and server-side push notifications require a backend Node.js process.

### Decision 2: Telegram Bot Integration Model
- **Chosen Approach**: Hybrid Telegram Engine:
  1. A backend service with `/api/telegram/webhook` and polling capability to interface with official Telegram Bot tokens (`https://api.telegram.org/bot<TOKEN>/...`).
  2. A polished in-app interactive Telegram Web client interface simulating the real Telegram messaging UI, allowing users to test bot dialogues (`/start`, `/track`, `/deals`, `/admin`, `/sales`) immediately without needing their own Telegram bot API key upfront.
- **Why**: Allows immediate interactive testing and proof-of-concept for evaluators, while remaining 100% production-ready for real Telegram bot keys.

---

## 4. Technical Architecture & Data Strategy

### Architecture & Component Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                        React SPA Client (Vite)                         │
│  ┌────────────────────┬────────────────────┬────────────────────────┐  │
│  │   Storefront &     │   Account & Track  │      Admin Center      │  │
│  │   Flash Deals      │   Order Timelines  │      & Analytics       │  │
│  └─────────┬──────────┴─────────┬──────────┴────────────┬───────────┘  │
│            │                    │                       │              │
│  ┌─────────┴────────────────────┴───────────────────────┴───────────┐  │
│  │     Interactive Telegram Bot Simulator & Web Notification Hub    │  │
│  └──────────────────────────────┬───────────────────────────────────┘  │
└─────────────────────────────────┼──────────────────────────────────────┘
                                  │ HTTP / SSE / REST
┌─────────────────────────────────▼──────────────────────────────────────┐
│                    Node.js & Express Server (server.ts)                │
│  ┌────────────────────┬────────────────────┬────────────────────────┐  │
│  │ /api/products      │ /api/orders        │ /api/telegram/webhook  │  │
│  │ Catalog CRUD       │ Tracking & Status  │ Bot Command Engine     │  │
│  ├────────────────────┼────────────────────┼────────────────────────┤  │
│  │ /api/auth          │ /api/notifications │ /api/admin/metrics     │  │
│  │ JWT / Supabase     │ Server Sent Events │ GMV & Sales Velocity   │  │
│  └────────────────────┴─────────┬──────────┴────────────────────────┘  │
│                                 │                                      │
│  ┌──────────────────────────────┴───────────────────────────────────┐  │
│  │             Supabase Client / PostgreSQL Persistence             │  │
│  │         (Products, Orders, OrderItems, Users, TelegramLogs)       │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

### Data Schema (PostgreSQL / Supabase compatible)
- **Users**: `id, email, password_hash, role (customer/admin), full_name, phone, address, created_at`
- **Products**: `id, title, title_en, category, price, old_price, discount, rating, reviews_count, image, express, stock, is_flash, specs, created_at`
- **Orders**: `id (EG-XXXXXX), user_id, customer_name, customer_phone, customer_address, city, payment_method, total_amount, status (pending, processing, shipping, delivered, cancelled), tracking_code, notes, created_at, updated_at`
- **OrderItems**: `id, order_id, product_id, title, price, quantity, image`
- **TelegramSubscriptions**: `chat_id, user_id, order_id, subscribed_at`

### Build & Verification Steps
1. Configure `package.json` dev script `"dev": "tsx server.ts"` and `"start": "node server.ts"`.
2. Install necessary libraries (e.g. `@supabase/supabase-js`, `better-sqlite3` or relational db driver, `canvas-confetti` for celebrations).
3. Implement `server.ts` with API endpoints for catalog, orders, status updates, SSE live notifications, and Telegram bot commands.
4. Port and enhance the attached HTML design components into modular React components (`Navbar`, `HeroSlider`, `CategoryTiles`, `FlashDeals`, `ProductCatalog`, `CartDrawer`, `QuickViewModal`, `OrderTracker`, `AdminDashboard`, `AuthModal`, `TelegramBotModal`).
5. Verify build via `compile_applet` and `lint_applet`.
