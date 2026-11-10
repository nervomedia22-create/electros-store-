import { createClient } from '@supabase/supabase-js';

// Environment credentials for Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// Supabase client instance (initialized if credentials exist)
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Helper to fetch products from Supabase (or fallback)
 */
export async function getSupabaseProducts() {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('id', { ascending: true });
  if (error) {
    console.error('Supabase getProducts error:', error);
    return null;
  }
  return data;
}

/**
 * Helper to create an order in Supabase
 */
export async function createSupabaseOrder(orderData: any) {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('orders')
    .insert([orderData])
    .select()
    .single();
  if (error) {
    console.error('Supabase createOrder error:', error);
    return null;
  }
  return data;
}
