'use server';

import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export async function updateContent(page: string, key: string, value: string) {
  const { error } = await supabase
    .from('site_content')
    .upsert({ page, key, value, updated_at: new Date().toISOString() }, { onConflict: 'page,key' });

  if (error) {
    return { error: error.message };
  }

  // Revalidate the affected page so it refreshes
  revalidatePath(page === 'home' ? '/' : `/${page}`);
  return { success: true };
}
