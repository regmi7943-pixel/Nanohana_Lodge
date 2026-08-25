'use server';

import { requireAuth } from '@/lib/supabase-server';
import { sendBookingStatusEmail } from '@/lib/email';
import { revalidatePath } from 'next/cache';
import { defaultRooms } from '@/lib/defaultRooms';

// Helper: generate YYYY-MM-DD date strings for a range [checkIn, checkOut)
function generateDateRange(checkIn: string, checkOut: string): string[] {
  const dates: string[] = [];
  const start = new Date(checkIn + 'T00:00:00');
  const end = new Date(checkOut + 'T00:00:00');
  const curr = new Date(start);
  while (curr < end) {
    const y = curr.getFullYear();
    const m = String(curr.getMonth() + 1).padStart(2, '0');
    const d = String(curr.getDate()).padStart(2, '0');
    dates.push(`${y}-${m}-${d}`);
    curr.setDate(curr.getDate() + 1);
  }
  return dates;
}

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
    const previousStatus = targetRequest.status;

    // Update request status
    targetRequest.status = newStatus;

    // ─── AUTO-BLOCK ROOM ON CONFIRM ───────────────────────────────────
    if (newStatus === 'Confirmed') {
      // 1. Read bookings_data
      const { data: bookingsRow } = await supabase
        .from('site_content')
        .select('value')
        .eq('page', 'global')
        .eq('key', 'bookings_data')
        .single();

      let bookingsData: any = { inventory: {}, bookings: {} };
      try {
        if (bookingsRow?.value) bookingsData = JSON.parse(bookingsRow.value);
      } catch (e) {}

      // 2. Read rooms list to map roomType name → category ID
      const { data: roomsRow } = await supabase
        .from('site_content')
        .select('value')
        .eq('page', 'global')
        .eq('key', 'global_rooms_list')
        .single();

      let roomsList = defaultRooms;
      try {
        if (roomsRow?.value) roomsList = JSON.parse(roomsRow.value);
      } catch (e) {}

      // 3. Find category ID from room type name
      const category = roomsList.find((r: any) => r.name === targetRequest.roomType);
      if (!category) {
        return { error: `Room category "${targetRequest.roomType}" not found. Cannot auto-assign room.` };
      }

      const catId = category.id;
      const totalRooms = bookingsData.inventory[catId] || 1;

      // 4. Generate date strings for the booking range
      const dates = generateDateRange(targetRequest.checkIn, targetRequest.checkOut);

      if (dates.length === 0) {
        return { error: 'Invalid date range on the booking request.' };
      }

      // 5. Find first available physical room (no date conflicts)
      if (!bookingsData.bookings[catId]) bookingsData.bookings[catId] = {};

      const roomsToAssign = targetRequest.roomsCount || 1;
      const assignedRooms: number[] = [];

      for (let count = 0; count < roomsToAssign; count++) {
        let foundRoom = -1;
        for (let i = 0; i < totalRooms; i++) {
          // Skip rooms already assigned in this batch
          if (assignedRooms.includes(i)) continue;

          const roomDates: string[] = bookingsData.bookings[catId][i] || [];
          const hasConflict = dates.some((d: string) => roomDates.includes(d));
          if (!hasConflict) {
            foundRoom = i;
            break;
          }
        }

        if (foundRoom === -1) {
          return {
            error: `Not enough available rooms. Could only assign ${assignedRooms.length} out of ${roomsToAssign} requested room(s) for "${targetRequest.roomType}" on these dates.`
          };
        }

        // 6. Block the dates on this room
        const existingDates: string[] = bookingsData.bookings[catId][foundRoom] || [];
        bookingsData.bookings[catId][foundRoom] = [...existingDates, ...dates];
        assignedRooms.push(foundRoom);
      }

      // 7. Store assigned room info on the request so we can unblock later
      targetRequest.assignedRoomIndices = assignedRooms;
      targetRequest.assignedCategoryId = catId;

      // 8. Save bookings_data
      const { error: bookingsSaveError } = await supabase
        .from('site_content')
        .upsert(
          {
            page: 'global',
            key: 'bookings_data',
            value: JSON.stringify(bookingsData),
            updated_at: new Date().toISOString()
          },
          { onConflict: 'page,key' }
        );

      if (bookingsSaveError) {
        console.error('Failed to save bookings_data:', bookingsSaveError);
        return { error: 'Booking confirmed but failed to auto-block room calendar. Please block manually.' };
      }
    }

    // ─── AUTO-UNBLOCK ROOM ON REJECT (if previously confirmed) ────────
    if (newStatus === 'Rejected' && previousStatus === 'Confirmed' && targetRequest.assignedRoomIndices) {
      const { data: bookingsRow } = await supabase
        .from('site_content')
        .select('value')
        .eq('page', 'global')
        .eq('key', 'bookings_data')
        .single();

      let bookingsData: any = { inventory: {}, bookings: {} };
      try {
        if (bookingsRow?.value) bookingsData = JSON.parse(bookingsRow.value);
      } catch (e) {}

      const catId = targetRequest.assignedCategoryId;
      const dates = generateDateRange(targetRequest.checkIn, targetRequest.checkOut);

      if (catId && bookingsData.bookings[catId]) {
        const roomIndices: number[] = targetRequest.assignedRoomIndices;
        for (const roomIndex of roomIndices) {
          const roomDates: string[] = bookingsData.bookings[catId][roomIndex] || [];
          bookingsData.bookings[catId][roomIndex] = roomDates.filter(
            (d: string) => !dates.includes(d)
          );
        }

        // Save updated bookings_data
        await supabase
          .from('site_content')
          .upsert(
            {
              page: 'global',
              key: 'bookings_data',
              value: JSON.stringify(bookingsData),
              updated_at: new Date().toISOString()
            },
            { onConflict: 'page,key' }
          );
      }

      // Clear assignment info
      delete targetRequest.assignedRoomIndices;
      delete targetRequest.assignedCategoryId;
    }

    // ─── SAVE UPDATED REQUESTS LIST ───────────────────────────────────
    currentRequests[targetIndex] = targetRequest;

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
    revalidatePath('/admin/bookings');
    revalidatePath('/reservations');
    revalidatePath('/admin');

    return { success: true, requests: currentRequests };
  } catch (err: any) {
    console.error('updateBookingRequestStatus exception:', err);
    return { error: err.message || 'Unauthorized or unexpected error' };
  }
}
