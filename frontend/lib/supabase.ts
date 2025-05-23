// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseURL = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseURL || !supabaseAnonKey) {
    console.warn("Missing Supabase environment variables.");
}

export const supabase = createClient(supabaseURL, supabaseAnonKey);

export async function getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
}

export async function logout() {
    await supabase.auth.signOut();
}
