'use server';

import { requireAuth } from '@/lib/supabase-server';
import { revalidatePath } from 'next/cache';

// Simple XSS sanitization that strips dangerous tags but allows safe formatting tags.
// Allowed: b, i, u, strong, em, span, font, br, sub, sup
// Blocked: script, iframe, object, embed, applet, form, math, svg, link, meta, style, base
function sanitizeString(str: string): string {
  if (typeof str !== 'string') return '';
  
  // Remove dangerous tags (keep their text content)
  let sanitized = str.replace(/<\/?(?:script|iframe|object|embed|applet|form|math|svg|link|meta|style|base|textarea|select|input|button)[^>]*>/gi, '');
  
  // Remove inline event handlers (e.g., onload, onerror, etc)
  sanitized = sanitized.replace(/\s+on[a-z]+\s*=\s*["'][^"']*["']/gi, '');
  sanitized = sanitized.replace(/\s+on[a-z]+\s*=\s*[^\s>]+/gi, '');
  
  // Remove javascript: URIs
  sanitized = sanitized.replace(/javascript:/gi, 'blocked:');
  
  return sanitized;
}

export async function updateContent(page: string, key: string, value: string) {
  try {
    const { supabase } = await requireAuth();

    if (typeof page !== 'string' || typeof key !== 'string' || typeof value !== 'string') {
      return { error: 'Invalid input' };
    }

    let sanitizedValue = value;

    try {
      // If it's JSON (like bookings_data or booking_requests), parse and deep sanitize
      const parsed = JSON.parse(value);
      const sanitizeObj = (obj: any): any => {
        if (typeof obj === 'string') {
          // Only allow basic text, completely escape angle brackets in JSON values to prevent any HTML
          return obj.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/javascript:/gi, 'blocked:');
        }
        if (Array.isArray(obj)) return obj.map(sanitizeObj);
        if (obj !== null && typeof obj === 'object') {
          const newObj: any = {};
          for (const k in obj) {
            const safeKey = k.replace(/</g, '&lt;').replace(/>/g, '&gt;');
            newObj[safeKey] = sanitizeObj(obj[k]);
          }
          return newObj;
        }
        return obj;
      };
      sanitizedValue = JSON.stringify(sanitizeObj(parsed));
    } catch (e) {
      // Plain text or URL
      if (value.trim().toLowerCase().startsWith('javascript:')) {
        sanitizedValue = '#blocked';
      } else {
        sanitizedValue = sanitizeString(value);
      }
    }

    const { error } = await supabase
      .from('site_content')
      .upsert({ page, key, value: sanitizedValue, updated_at: new Date().toISOString() }, { onConflict: 'page,key' });

    if (error) {
      return { error: error.message };
    }

    // Revalidate the affected page so it refreshes
    revalidatePath(page === 'home' ? '/' : `/${page}`);
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}
