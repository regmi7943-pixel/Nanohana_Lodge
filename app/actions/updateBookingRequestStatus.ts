'use server';

import { requireAuth } from '@/lib/supabase-server';
import { sendBookingStatusEmail } from '@/lib/email';
import { revalidatePath } from 'next/cache';

export async function updateBookingRequestStatus(id: string, newStatus: 'Confirmed' | 'Rejected') {
  try {
    const { supabase } = await requireAuth();

    if (!id || !newStatus) {
      return { error: 'Invalid parameters provided' };
    }

    // Fetch the current requests list
    const { data, error: fetchError } = await supabase
      .from('site_content')
      .select('value')
      .eq('page', 'global')
      .eq('key', 'booking_requests')
      .single();

    if (fetchError) {
      console.error('Failed to fetch requests in update status:', fetchError);
      return { error: 'Failed to fetch current booking requests' };
    }

    let currentRequests = [];
    try {
      if (data?.value) {
        currentRequests = JSON.parse(data.value);
      }
    } catch (e) {
      return { error: 'Corrupted database record for booking requests' };
    }

    // Find the specific request to update
    const targetIndex = currentRequests.findIndex((r: any) => r.id === id);
    if (targetIndex === -1) {
      return { error: 'Booking request not found' };
    }

    const targetRequest = currentRequests[targetIndex];
    
    // Update request status
    targetRequest.status = newStatus;
    currentRequests[targetIndex] = targetRequest;

    // Save updated list
    const { error: updateError } = await supabase
      .from('site_content')
      .upsert(
        {
          page: 'global',
          key: 'booking_requests',
          value: JSON.stringify(currentRequests),
          updated_at: new Date().toISOString()
        },
        { onConflict: 'page,key' }
      );

    if (updateError) {
      console.error('Failed to update request list status:', updateError);
      return { error: 'Failed to save updated status' };
    }

    // Send the email notification
    try {
      await sendBookingStatusEmail(targetRequest, newStatus);
    } catch (emailErr) {
      console.error('Failed to send booking status email:', emailErr);
    }

    revalidatePath('/admin/booking-requests');
    revalidatePath('/reservations');

    return { success: true, requests: currentRequests };
  } catch (err: any) {
    console.error('updateBookingRequestStatus exception:', err);
    return { error: err.message || 'Unauthorized or unexpected error' };
  }
}
