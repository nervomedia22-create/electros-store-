# ElectroTech Egypt - Vercel & Supabase Deployment Guide

This guide walks you through connecting your Supabase database and deploying the full-stack application to **Vercel** in 3 simple steps.

---

## 1. Setup Supabase Database

1. Go to [https://supabase.com](https://supabase.com) and create or open your project.
2. In your Supabase Dashboard, click on **SQL Editor** from the left sidebar.
3. Click **New Query**, open the file `supabase/schema.sql` from this project, paste the full SQL code, and click **Run**.
4. This will automatically:
   - Create all required tables (`products`, `orders`, `order_items`, `order_history`, `users`).
   - Enable Row Level Security (RLS) policies.
   - Seed the initial products catalog and the Admin user (`mahmoud@admin.com` with password `123456`).
5. Go to **Project Settings** -> **API** and copy:
   - **Project URL** (e.g., `https://xyzproject.supabase.co`)
   - **anon / public key** (e.g., `eyJhbGciOiJIUzI1NiIsIn...`)

---

## 2. Deploy to Vercel

1. Push this repository to your GitHub/GitLab account.
2. Open your [Vercel Dashboard](https://vercel.com) and click **Add New** -> **Project**.
3. Select this repository.
4. In the **Configure Project** screen:
   - **Framework Preset**: `Vite` (automatically detected)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Expand the **Environment Variables** section and add:
   - `VITE_SUPABASE_URL` = `https://your-project-id.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = `your-anon-key`
   - `SUPABASE_SERVICE_ROLE_KEY` = `your-service-role-key` (optional, for admin server functions)
   - `TELEGRAM_BOT_TOKEN` = `your-bot-token` (optional)
6. Click **Deploy**.

---

## 3. Verify Your Deployment

Once deployed:
1. Open your live Vercel URL.
2. The authentication page will appear.
3. Log in with your admin credentials:
   - **Email**: `mahmoud@admin.com`
   - **Password**: `123456`
4. Access the **Admin Operations Console** to monitor sales charts, customize products, or manage orders.
