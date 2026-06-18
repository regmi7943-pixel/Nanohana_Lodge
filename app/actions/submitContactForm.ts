'use server';

import { sendContactEmail } from '@/lib/email';

function sanitizeString(str: string): string {
  if (typeof str !== 'string') return '';
  let sanitized = str.replace(/<\/?(?:script|iframe|object|embed|applet|form|math|svg)[^>]*>/gi, '');
  sanitized = sanitized.replace(/on[a-z]+=["'][^"']*["']/gi, '');
  sanitized = sanitized.replace(/on[a-z]+=[^>\s]+/gi, '');
  sanitized = sanitized.replace(/javascript:/gi, 'blocked:');
  return sanitized.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export async function submitContactForm(data: {
  name: string;
  email: string;
  checkin?: string;
  checkout?: string;
  rooms: string;
  message: string;
  discovery: string;
}) {
  if (!data.name || !data.email || !data.message) {
    return { error: 'Required fields are missing' };
  }

  const sanitizedData = {
    name: sanitizeString(data.name),
    email: sanitizeString(data.email),
    checkin: data.checkin ? sanitizeString(data.checkin) : undefined,
    checkout: data.checkout ? sanitizeString(data.checkout) : undefined,
    rooms: sanitizeString(data.rooms),
    message: sanitizeString(data.message),
    discovery: sanitizeString(data.discovery),
  };

  try {
    const res = await sendContactEmail(sanitizedData);
    if (res.error) {
      console.error('Resend contact dispatch error:', res.error);
      return { error: res.error.message || 'Failed to dispatch email notification' };
    }
    return { success: true };
  } catch (err: any) {
    console.error('Resend contact dispatch exception:', err);
    return { error: err.message || 'An unexpected error occurred' };
  }
}
