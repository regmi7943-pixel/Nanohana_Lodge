'use server';

import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';
import { sendBookingRequestEmail } from '@/lib/email';

function sanitizeString(str: string): string {
  if (typeof str !== 'string') return '';
  let sanitized = str.replace(/<\/?(?:script|iframe|object|embed|applet|form|math|svg)[^>]*>/gi, '');
  sanitized = sanitized.replace(/on[a-z]+=["'][^"']*["']/gi, '');
  sanitized = sanitized.replace(/on[a-z]+=[^>\s]+/gi, '');
  sanitized = sanitized.replace(/javascript:/gi, 'blocked:');
  return sanitized.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export async function submitBookingRequest(newReq: any) {
  // Sanitize the incoming request
  const sanitizedReq = {
    ...newReq,
    guestName: sanitizeString(newReq.guestName),
    email: sanitizeString(newReq.email),
    phone: sanitizeString(newReq.phone),
    message: sanitizeString(newReq.message || ''),
  };

  // Fetch the current requests
  const { data, error: fetchError } = await supabase
    .from('site_content')
    .select('value')
    .eq('page', 'global')
    .eq('key', 'booking_requests')
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') {
    return { error: 'Failed to fetch current requests' };
  }

  let currentRequests = [];
  try {
    if (data?.value) {
      currentRequests = JSON.parse(data.value);
    }
  } catch (e) {
    currentRequests = [];
  }

  currentRequests.push(sanitizedReq);

  // Upsert the updated list (bypassing auth since it's a server action submitting a user request)
  const { error: updateError } = await supabase
    .from('site_content')
    .upsert({ page: 'global', key: 'booking_requests', value: JSON.stringify(currentRequests), updated_at: new Date().toISOString() }, { onConflict: 'page,key' });

  if (updateError) {
    return { error: updateError.message };
  }

  try {
    await sendBookingRequestEmail(sanitizedReq);
  } catch (emailErr) {
    console.error('Failed to send booking request email notification:', emailErr);
  }

  revalidatePath('/reservations');
  revalidatePath('/admin');
  return { success: true };
}
