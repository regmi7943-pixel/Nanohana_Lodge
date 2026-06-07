'use client';

import React, { useState } from 'react';
import { Inbox, Check, X, Loader2, Trash2, CalendarX } from 'lucide-react';

type RequestStatus = 'Pending' | 'Confirmed' | 'Rejected';

interface BookingRequest {
  id: string;
  guestName: string;
  email: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  guestsCount: number;
  roomsCount?: number;
  totalPrice: number;
  status: RequestStatus;
  dateRequested: string;
  phone?: string;
}

import { updateContent } from '@/app/actions/updateContent';

export default function BookingRequestsClient({ content = [] }: { content?: any[] }) {
  const rawRequests = content.find((c: any) => c.key === 'booking_requests')?.value;
  let initialRequests: BookingRequest[] = [];
  try {
    if (rawRequests) initialRequests = JSON.parse(rawRequests);
  } catch (e) {}

  initialRequests.sort((a, b) => new Date(b.dateRequested).getTime() - new Date(a.dateRequested).getTime());

  const [requests, setRequests] = useState<BookingRequest[]>(initialRequests);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleAction = async (id: string, newStatus: RequestStatus) => {
    setProcessingId(id);
    
    const updated = requests.map(req => 
      req.id === id ? { ...req, status: newStatus } : req
    );
    
    setRequests(updated);
    await updateContent('global', 'booking_requests', JSON.stringify(updated));
    setProcessingId(null);
  };

  const handleDelete = async (id: string) => {
    setProcessingId(id);
    
    const updated = requests.filter(req => req.id !== id);
    
    setRequests(updated);
    await updateContent('global', 'booking_requests', JSON.stringify(updated));
    setProcessingId(null);
  };

  const handleBulkDeleteRejected = async () => {
    setProcessingId('bulk-delete');
    const updated = requests.filter(req => req.status !== 'Rejected');
    setRequests(updated);
    await updateContent('global', 'booking_requests', JSON.stringify(updated));
    setProcessingId(null);
  };

  const hasRejected = requests.some(req => req.status === 'Rejected');

  return (
    <div className="max-w-6xl space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif text-white mb-1 flex items-center gap-2">
            <Inbox className="w-6 h-6" /> Booking Requests
          </h1>
          <p className="text-sm text-cream/60">Manage incoming booking requests and send email confirmations.</p>
        </div>
        {hasRejected && (
          <button
            onClick={handleBulkDeleteRejected}
            disabled={processingId === 'bulk-delete'}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 font-medium transition-all text-sm disabled:opacity-50"
          >
            {processingId === 'bulk-delete' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            Clear All Rejected
          </button>
        )}
      </div>

      <div className="bg-[#1a1a1a] border border-white/10 rounded-lg overflow-x-auto">
        <table className="w-full text-left text-sm text-cream">
          <thead className="bg-white/5 border-b border-white/10 text-cream/70 text-xs uppercase tracking-wider font-mono">
            <tr>
              <th className="p-4 font-normal">ID</th>
              <th className="p-4 font-normal">Guest</th>
              <th className="p-4 font-normal">Room Type</th>
              <th className="p-4 font-normal">Dates</th>
              <th className="p-4 font-normal">Total</th>
              <th className="p-4 font-normal">Status</th>
              <th className="p-4 font-normal text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {requests.map((req) => (
              <tr key={req.id} className="hover:bg-white/5 transition-colors">
                <td className="p-4 font-mono text-xs text-cream/50">{req.id}</td>
                <td className="p-4">
                  <div className="font-medium text-white">{req.guestName}</div>
                  <div className="text-xs text-cream/50 mt-0.5">{req.email}</div>
                  {req.phone && <div className="text-xs text-cream/50">{req.phone}</div>}
                </td>
                <td className="p-4 text-cream/80">{req.roomType}</td>
                <td className="p-4 text-cream/80 text-xs">
                  {req.checkIn} <span className="text-cream/40 px-1">→</span> {req.checkOut}
                  <div className="text-cream/50 mt-0.5">{req.guestsCount} Guest(s), {req.roomsCount || 1} Room(s)</div>
                </td>
                <td className="p-4 font-mono font-medium">${req.totalPrice}</td>
                <td className="p-4">
                  <span className="text-cream/70 text-xs border border-white/10 px-2 py-1 rounded bg-white/5">
                    {req.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  {req.status === 'Pending' ? (
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleAction(req.id, 'Confirmed')}
                        disabled={processingId === req.id}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-white/10 text-white text-xs hover:bg-white/20 transition-colors disabled:opacity-50"
                      >
                        {processingId === req.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                        Confirm
                      </button>
                      
                      <button
                        onClick={() => handleAction(req.id, 'Rejected')}
                        disabled={processingId === req.id}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded text-cream/60 hover:text-white hover:bg-white/10 transition-colors text-xs disabled:opacity-50"
                      >
                        {processingId === req.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <X className="w-3.5 h-3.5" />}
                        Reject
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-end gap-2">
                      <span className="text-xs text-cream/40 italic">Actioned</span>
                      {req.status === 'Rejected' && (
                        <button
                          onClick={() => handleDelete(req.id)}
                          disabled={processingId === req.id}
                          className="p-1.5 rounded text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                          title="Delete Request"
                        >
                          {processingId === req.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        </button>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {requests.length === 0 && (
              <tr>
                <td colSpan={7} className="p-16 text-center">
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center">
                      <CalendarX className="w-8 h-8 text-cream/30" />
                    </div>
                    <div>
                      <p className="text-cream/80 font-serif text-lg font-medium">No Booking Requests</p>
                      <p className="text-cream/40 text-sm mt-1">There are currently no new booking requests from the website.</p>
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
