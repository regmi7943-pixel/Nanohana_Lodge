'use server';

import { createClient } from '@supabase/supabase-js';

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

  // Call the SECURITY DEFINER Postgres function to safely bypass RLS
  const { error: rpcError } = await supabase.rpc('append_booking_request', { new_req: sanitizedReq });

  if (rpcError) {
    return { error: rpcError.message };
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
