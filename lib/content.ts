'use server';

import { supabase } from '@/lib/supabase';

export interface ContentItem {
  page: string;
  key: string;
  value: string;
}

export async function getContent(page: string): Promise<Record<string, string>> {
  const { data, error } = await supabase
    .from('site_content')
    .select('key, value')
    .eq('page', page);

  if (error || !data) return {};
  return Object.fromEntries(data.map((row) => [row.key, row.value]));
}

export async function getAllContent(): Promise<ContentItem[]> {
  const { data, error } = await supabase
    .from('site_content')
    .select('page, key, value')
    .order('page');
  if (error || !data) return [];
  return data;
}
