'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  CalendarDays,
  Users,
  Building,
  CheckCircle2,
  Calendar,
  Lock,
  Percent,
  Smile,
  ShieldAlert,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  BedDouble,
  AlertCircle
} from 'lucide-react';
import EditableText from '@/components/EditableText';
import EditableImage from '@/components/EditableImage';
import { defaultRooms } from '@/lib/defaultRooms';
import { submitBookingRequest } from '@/app/actions/submitBookingRequest';
import toast from 'react-hot-toast';

type BookingsData = {
  inventory: Record<string, number>;
  bookings: Record<string, Record<string, string[]>>;
};

export default function ReservationsClient({ content = [], editMode = false }: { content?: any[], editMode?: boolean }) {
  const getText = React.useCallback((key: string) => content.find((c: any) => c.key === key)?.value, [content]);

  // Load dynamic rooms from DB, falling back to hardcoded defaults
  const rawRooms = content.find((c: any) => c.key === 'global_rooms_list')?.value;
  const rooms = React.useMemo(() => {
    if (rawRooms) {
      try { return JSON.parse(rawRooms); } catch (e) {}
    }
    return defaultRooms;
  }, [rawRooms]);

  const rawBookings = content.find((c: any) => c.key === 'bookings_data')?.value;
  const bookingsData: BookingsData = React.useMemo(() => {
    if (rawBookings) {
      try { return JSON.parse(rawBookings); } catch (e) {}
    }
    return { inventory: {}, bookings: {} };
  }, [rawBookings]);

  const rawRequests = content.find((c: any) => c.key === 'booking_requests')?.value;
  const initialRequestsList = React.useMemo(() => {
    if (rawRequests) {
      try { return JSON.parse(rawRequests); } catch(e) {}
    }
    return [];
  }, [rawRequests]);

  const [bookingRequestsList, setBookingRequestsList] = useState<any[]>(initialRequestsList);

  React.useEffect(() => {
    try {
      const updatedRaw = content.find((c: any) => c.key === 'booking_requests')?.value;
      if (updatedRaw) setBookingRequestsList(JSON.parse(updatedRaw));
    } catch(e) {}
  }, [content]);

  const [selectedCatId, setSelectedCatId] = useState(rooms[0]?.id || defaultRooms[0].id);
  const [guestsCount, setGuestsCount] = useState(2);
  const [roomsCount, setRoomsCount] = useState(1);
  
  const [checkInDate, setCheckInDate] = useState<Date | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);
  const [calendarDate, setCalendarDate] = useState<Date>(new Date());
  
  // Booking Flow State
  const [bookingStep, setBookingStep] = useState<'calendar' | 'options' | 'details' | 'success'>('calendar');
  const [direction, setDirection] = useState(0);

  const goToStep = (step: 'calendar' | 'options' | 'details' | 'success', dir: number) => {
    setDirection(dir);
    setBookingStep(step);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? -50 : 50,
      opacity: 0
    })
  };
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { minAvailable, isFullyBooked } = React.useMemo(() => {
    if (!checkInDate || !checkOutDate) return { minAvailable: 0, isFullyBooked: false };
    
    const formatDateStr = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    
    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    let minAvail = Infinity;
    
    const curr = new Date(start);
    while (curr < end) {
      const dateStr = formatDateStr(curr);
      const totalRooms = bookingsData.inventory[selectedCatId] || 1;
      const roomBookings = bookingsData.bookings[selectedCatId] || {};
      
      // Count hard-blocked rooms from admin panel
      let bookedCount = 0;
      for (let i = 0; i < totalRooms; i++) {
        if (roomBookings[i] && roomBookings[i].includes(dateStr)) {
          bookedCount++;
        }
      }
      
      // Also count Pending and Confirmed requests
      const reqStartTimes = bookingRequestsList.map((r: any) => new Date(r.checkIn + 'T00:00:00').getTime());
      const reqEndTimes = bookingRequestsList.map((r: any) => new Date(r.checkOut + 'T00:00:00').getTime());
      const dTime = curr.getTime();

      let requestedRoomsCount = 0;
      bookingRequestsList.forEach((req, index) => {
        if (req.status !== 'Rejected' && req.roomType === (rooms.find((r: any) => r.id === selectedCatId)?.name)) {
          // Check if current date is between checkIn (inclusive) and checkOut (exclusive)
          if (dTime >= reqStartTimes[index] && dTime < reqEndTimes[index]) {
            requestedRoomsCount += (req.roomsCount || 1);
          }
        }
      });
      
      const avail = Math.max(0, totalRooms - bookedCount - requestedRoomsCount);
      if (avail < minAvail) minAvail = avail;
      curr.setDate(curr.getDate() + 1);
    }
    return { minAvailable: minAvail, isFullyBooked: minAvail === 0 };
  }, [checkInDate, checkOutDate, selectedCatId, bookingsData, bookingRequestsList]);

  const didCheck = checkInDate !== null && checkOutDate !== null;

  // S8 Comparison data table (for the static sections)
  const comparisons = [
    { name: 'Standard Room', price: 12, beds: 'Double / Twin', view: 'Garden', breakfast: 'Available', ac: 'No (Fan)' },
    { name: 'Standard Garden View', price: 15, beds: 'Double Double', view: 'Florals', breakfast: 'Available', ac: 'No (Fan)' },
    { name: 'Deluxe Terrace Room', price: 20, beds: '1 King Bed', view: 'Mountains', breakfast: 'Available', ac: 'AC & Tub' },
    { name: 'Family / Triple Room', price: 22, beds: 'Double + Twin', view: 'Mountains', breakfast: 'Available', ac: 'AC (Select)' }
  ];

  const formatDate = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const getAvailableRoomsOnDate = (date: Date, catId: string) => {
    const dateStr = formatDate(date);
    const totalRooms = bookingsData.inventory[catId] || 1;
    const roomBookings = bookingsData.bookings[catId] || {};
    
    let bookedCount = 0;
    for (let i = 0; i < totalRooms; i++) {
      if (roomBookings[i] && roomBookings[i].includes(dateStr)) {
        bookedCount++;
      }
    }
    
    // Also subtract requests
    let requestedRoomsCount = 0;
    const dTime = date.getTime();
    bookingRequestsList.forEach((req) => {
      if (req.status !== 'Rejected' && req.roomType === (rooms.find((r: any) => r.id === catId)?.name)) {
        const start = new Date(req.checkIn + 'T00:00:00').getTime();
        const end = new Date(req.checkOut + 'T00:00:00').getTime();
        if (dTime >= start && dTime < end) {
          requestedRoomsCount += (req.roomsCount || 1);
        }
      }
    });
    
    return Math.max(0, totalRooms - bookedCount - requestedRoomsCount);
  };

  const selectedRoomDetails = rooms.find((r: any) => r.id === selectedCatId);
  const basePrice = selectedRoomDetails ? parseInt(selectedRoomDetails.price.replace('$', '')) : 12;

  const getCalculatedPrice = () => {
    if (!checkInDate || !checkOutDate) return basePrice;
    const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
    return basePrice * diffDays * roomsCount;
  };

  const currentYear = calendarDate.getFullYear();
  const currentMonth = calendarDate.getMonth();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(currentYear, currentMonth, day);
    const today = new Date();
    today.setHours(0,0,0,0);
    
    if (clickedDate < today) return;

    if (!checkInDate || (checkInDate && checkOutDate)) {
      setCheckInDate(clickedDate);
      setCheckOutDate(null);
    } else {
      if (clickedDate <= checkInDate) {
        setCheckInDate(clickedDate);
        setCheckOutDate(null);
      } else {
        setCheckOutDate(clickedDate);
        setTimeout(() => goToStep('options', 1), 400);
      }
    }
    if (bookingStep !== 'calendar') goToStep('calendar', -1);
  };

  const isDateSelected = (day: number) => {
    const d = new Date(currentYear, currentMonth, day);
    if (checkInDate && d.getTime() === checkInDate.getTime()) return true;
    if (checkOutDate && d.getTime() === checkOutDate.getTime()) return true;
    return false;
  };

  const isDateInRange = (day: number) => {
    if (!checkInDate || !checkOutDate) return false;
    const d = new Date(currentYear, currentMonth, day);
    return d > checkInDate && d < checkOutDate;
  };

  
  const renderCalendar = (isMobile: boolean) => (
    <div className="bg-white border border-earth/10 p-4 lg:p-6 rounded-2xl shadow-sm h-full">
      <div className="flex items-center justify-between mb-6 px-1 lg:px-0">
        <button 
          onClick={(e) => { e.preventDefault(); setCalendarDate(new Date(currentYear, currentMonth - 1, 1)) }} 
          disabled={currentYear === new Date().getFullYear() && currentMonth === new Date().getMonth()}
          className={`p-3 lg:p-2 rounded-full transition-colors ${currentYear === new Date().getFullYear() && currentMonth === new Date().getMonth() ? 'text-earth/20 cursor-not-allowed' : 'text-earth/70 hover:text-earth hover:bg-earth/5'}`}
        >
          <ChevronLeft className="w-6 h-6 lg:w-5 lg:h-5" />
        </button>
        <h3 className="font-serif text-lg font-medium text-earth">
          {monthNames[currentMonth]} {currentYear}
        </h3>
        <button onClick={(e) => { e.preventDefault(); setCalendarDate(new Date(currentYear, currentMonth + 1, 1)) }} className="p-3 lg:p-2 hover:bg-earth/5 rounded-full transition-colors text-earth/70 hover:text-earth">
          <ChevronRight className="w-6 h-6 lg:w-5 lg:h-5" />
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-y-2 gap-x-0 mb-2">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
          <div key={d} className="text-center text-[10px] font-bold text-earth/40 uppercase tracking-wider py-2">
            {d}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-y-2 gap-x-0">
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const d = new Date(currentYear, currentMonth, day);
          const today = new Date();
          today.setHours(0,0,0,0);
          const isPast = d < today;
          
          const avail = getAvailableRoomsOnDate(d, selectedCatId);
          const isFullyBooked = avail === 0;
          
          let isCheckIn = false;
          let isCheckOut = false;
          if (checkInDate && d.getTime() === checkInDate.getTime()) isCheckIn = true;
          if (checkOutDate && d.getTime() === checkOutDate.getTime()) isCheckOut = true;
          const selected = isCheckIn || isCheckOut;
          const inRange = isDateInRange(day);
          
          return (
            <button
              key={day}
              onClick={(e) => { e.preventDefault(); handleDateClick(day); }}
              disabled={isPast || isFullyBooked}
              className={`relative aspect-square flex flex-col items-center justify-center text-sm transition-all w-full
                ${isPast ? 'text-earth/20 cursor-not-allowed rounded-full' : ''}
                ${!isPast && isFullyBooked ? 'bg-red-50 text-red-300 line-through cursor-not-allowed rounded-full mx-1 w-[calc(100%-8px)]' : ''}
                ${!isPast && !isFullyBooked && !selected && !inRange ? 'hover:bg-earth/5 text-earth/80 rounded-full mx-1 w-[calc(100%-8px)]' : ''}
                ${inRange ? 'bg-nanohana/20 text-earth rounded-none' : ''}
                ${isCheckIn && checkOutDate ? 'bg-nanohana text-earth font-bold shadow-md rounded-l-full rounded-r-none' : ''}
                ${isCheckOut ? 'bg-nanohana text-earth font-bold shadow-md rounded-r-full rounded-l-none' : ''}
                ${selected && !checkOutDate ? 'bg-nanohana text-earth font-bold shadow-md rounded-full mx-1 w-[calc(100%-8px)]' : ''}
              `}
            >
              <span>{day}</span>
            </button>
          );
        })}
      </div>
      <div className="mt-4 pt-4 border-t border-earth/10 flex items-center justify-between text-xs text-earth/60 font-mono">
        <span><span className="inline-block w-3 h-3 bg-nanohana rounded-sm mr-1"></span> Selected</span>
        <span><span className="inline-block w-3 h-3 bg-nanohana/20 rounded-sm mr-1"></span> In Range</span>
        <span><span className="inline-block w-3 h-3 bg-red-50 border border-red-100 rounded-sm mr-1"></span> Booked</span>
      </div>
      {isMobile && checkInDate && !checkOutDate && (
        <div className="mt-6 text-center animate-pulse text-nanohana font-medium text-sm">
          Select your check-out date
        </div>
      )}
      {isMobile && checkInDate && checkOutDate && (
        <button onClick={() => goToStep('options', 1)} className="mt-6 w-full py-3 bg-nanohana text-earth font-bold rounded-lg shadow hover:bg-nanohana/90 transition-all flex justify-center items-center gap-2">
          Continue <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );

  const renderOptions = (isMobile: boolean) => (
    <div className={`space-y-5 ${isMobile ? 'bg-white border border-earth/10 rounded-2xl p-4 shadow-sm' : 'h-full flex flex-col justify-between'}`}>
      {isMobile && (
        <button onClick={() => goToStep('calendar', -1)} className="text-xs text-earth/60 hover:text-earth mb-2 flex items-center gap-1 transition-colors">
          <ChevronLeft className="w-3 h-3" /> Back to dates
        </button>
      )}
      <div className="space-y-5 flex-grow">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label htmlFor="selectedCatId" className="text-[10px] font-mono uppercase tracking-wider text-earth/80 block mb-1">Choose Your Room</label>
            <select id="selectedCatId" value={selectedCatId} onChange={(e) => setSelectedCatId(e.target.value)} className="w-full bg-white rounded-lg border border-earth/15 px-3 py-3 text-sm focus:outline-none focus:border-phewa text-earth shadow-sm">
              {rooms.map((r: any) => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="roomsCount" className="text-[10px] font-mono uppercase tracking-wider text-earth/80 block mb-1">Rooms Requested</label>
            <select id="roomsCount" value={roomsCount} onChange={(e) => setRoomsCount(parseInt(e.target.value))} className="w-full bg-white rounded-lg border border-earth/15 px-3 py-3 text-sm focus:outline-none focus:border-phewa text-earth shadow-sm">
              <option value={1}>1 Room</option>
              <option value={2}>2 Rooms</option>
              <option value={3}>3 Rooms</option>
              <option value={4}>4 Rooms</option>
            </select>
          </div>
          <div>
            <label htmlFor="guestsCount" className="text-[10px] font-mono uppercase tracking-wider text-earth/80 block mb-1">Travelers</label>
            <select id="guestsCount" value={guestsCount} onChange={(e) => setGuestsCount(parseInt(e.target.value))} className="w-full bg-white rounded-lg border border-earth/15 px-3 py-3 text-sm focus:outline-none focus:border-phewa text-earth shadow-sm">
              <option value={1}>1 Adult</option>
              <option value={2}>2 Adults</option>
              <option value={3}>3 Adults / Family</option>
            </select>
          </div>
        </div>
        
        <div className="flex gap-2 text-xs text-earth/60 bg-white p-3 border border-earth/10 rounded-lg">
          <Calendar className="w-4 h-4 text-nanohana flex-shrink-0" />
          <span>
            {checkInDate ? formatDate(checkInDate) : 'Select Check-in'} {' '}→{' '} {checkOutDate ? formatDate(checkOutDate) : 'Select Check-out'}
          </span>
        </div>

        {didCheck && (
          <div className="animate-fade-in">
            {isFullyBooked ? (
              <div className="p-5 rounded-xl bg-red-50 border border-red-200 flex gap-3 text-red-800">
                <ShieldAlert className="w-6 h-6 flex-shrink-0 text-red-500" />
                <div>
                  <h4 className="font-bold text-sm">Fully Booked</h4>
                  <p className="text-xs opacity-80 mt-1">We're sorry, but the selected dates are completely booked for this room type.</p>
                </div>
              </div>
            ) : roomsCount > minAvailable ? (
              <div className="p-5 rounded-xl bg-amber-50 border border-amber-200 space-y-4 text-amber-900">
                <div className="flex gap-3">
                  <AlertCircle className="w-6 h-6 flex-shrink-0 text-amber-500" />
                  <div>
                    <h4 className="font-bold text-sm">Limited Availability</h4>
                    <p className="text-xs opacity-90 mt-1">You requested {roomsCount} room(s), but only <strong>{minAvailable} room(s)</strong> are available.</p>
                  </div>
                </div>
                <div className="bg-white/60 p-3 rounded-lg text-xs border border-amber-100 flex flex-col gap-2">
                  <div className="flex gap-2 mt-1">
                    <button onClick={() => setRoomsCount(minAvailable)} className="px-4 py-2 bg-amber-500 text-white font-bold rounded shadow-sm hover:bg-amber-600 transition-colors">Change to {minAvailable} Room(s)</button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-5 rounded-xl bg-forest/5 border border-forest/20 space-y-4">
                <div className="flex items-center gap-3 border-b border-earth/10 pb-3">
                  <CheckCircle2 className="w-6 h-6 text-forest flex-shrink-0" />
                  <div>
                    <h3 className="font-serif text-base font-bold text-earth">Available for Booking!</h3>
                    <p className="text-xs text-earth/70">Your requested {roomsCount} room(s) are available.</p>
                  </div>
                </div>
                <div className={`${!isMobile ? 'flex justify-between items-center' : 'flex justify-between items-center bg-white p-3 rounded-lg border border-earth/5'}`}>
                  <div>
                    <span className="text-[10px] text-earth/50 uppercase tracking-widest font-mono block">Total Rate</span>
                    <div className="font-serif text-xl font-bold text-nanohana">${getCalculatedPrice()}</div>
                  </div>
                  <button onClick={() => goToStep('details', 1)} className="px-6 py-3 lg:px-5 lg:py-2.5 rounded-lg bg-nanohana text-earth font-sans text-sm lg:text-xs font-bold hover:bg-nanohana/90 transition-colors shadow-sm">
                    Continue to Guest Details
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const renderDetails = (isMobile: boolean) => (
    <div className={`bg-white border border-earth/10 rounded-2xl ${isMobile ? 'p-4' : 'p-6'} shadow-sm flex flex-col h-full animate-fade-in`}>
      <div className="mb-6 pb-6 border-b border-earth/10">
        <button onClick={() => goToStep(isMobile ? 'options' : 'calendar', -1)} className="text-xs text-earth/60 hover:text-earth mb-4 flex items-center gap-1 transition-colors">
          <ChevronLeft className="w-3 h-3" /> Back to {isMobile ? 'options' : 'dates'}
        </button>
        <h3 className="font-serif text-xl font-bold text-earth">Guest Details</h3>
        <p className="text-xs text-earth/60 mt-1">Please provide your contact information to send the booking request.</p>
      </div>

      <form 
        onSubmit={async (e) => {
          e.preventDefault();
          setIsSubmitting(true);
          const newReq = {
            id: 'REQ-' + Date.now().toString().slice(-6), guestName, email: guestEmail, phone: guestPhone,
            roomType: selectedRoomDetails?.name || 'Unknown Room',
            checkIn: checkInDate ? formatDate(checkInDate) : '', checkOut: checkOutDate ? formatDate(checkOutDate) : '',
            guestsCount, roomsCount, totalPrice: getCalculatedPrice(), status: 'Pending', dateRequested: new Date().toISOString()
          };
          const updatedList = [...bookingRequestsList, newReq];
          setBookingRequestsList(updatedList); // Optimistic UI update
          const result = await submitBookingRequest(newReq);
          setIsSubmitting(false);
          if (result.error) {
             toast.error('Failed to submit booking request.');
             return;
          }
          goToStep('success', 1);
          toast.success('Booking request sent successfully!');
        }}
        className="flex flex-col flex-grow justify-between space-y-6"
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="guestName" className="text-[10px] font-mono uppercase tracking-wider text-earth/80 block mb-1">Full Name</label>
            <input id="guestName" type="text" required value={guestName} onChange={e=>setGuestName(e.target.value)} className="w-full bg-cream/50 rounded-lg border border-earth/15 px-3 py-2.5 text-sm focus:outline-none focus:border-phewa" placeholder="John Doe" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="guestEmail" className="text-[10px] font-mono uppercase tracking-wider text-earth/80 block mb-1">Email</label>
              <input id="guestEmail" type="email" required value={guestEmail} onChange={e=>setGuestEmail(e.target.value)} className="w-full bg-cream/50 rounded-lg border border-earth/15 px-3 py-2.5 text-sm focus:outline-none focus:border-phewa" placeholder="john@example.com" />
            </div>
            <div>
              <label htmlFor="guestPhone" className="text-[10px] font-mono uppercase tracking-wider text-earth/80 block mb-1">Phone</label>
              <input id="guestPhone" type="tel" required value={guestPhone} onChange={e=>setGuestPhone(e.target.value)} className="w-full bg-cream/50 rounded-lg border border-earth/15 px-3 py-2.5 text-sm focus:outline-none focus:border-phewa" placeholder="+1 234 567 890" />
            </div>
          </div>
          <div className="bg-cream/30 p-4 rounded-lg border border-earth/5 mt-4">
            <h4 className="text-[10px] font-mono uppercase tracking-wider text-earth/80 mb-2">Booking Summary</h4>
            <div className="text-sm space-y-1 text-earth">
              <p><strong>Room:</strong> {selectedRoomDetails?.name}</p>
              <p><strong>Dates:</strong> {checkInDate && formatDate(checkInDate)} to {checkOutDate && formatDate(checkOutDate)}</p>
              <p><strong>Configuration:</strong> {roomsCount} Room(s), {guestsCount} Traveler(s)</p>
              <div className="mt-2 pt-2 border-t border-earth/10 flex justify-between items-center">
                <span className="font-bold">Estimated Total:</span>
                <span className="font-serif font-bold text-lg text-nanohana">${getCalculatedPrice()}</span>
              </div>
            </div>
          </div>
        </div>
        <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-forest text-cream font-sans text-xs tracking-wider uppercase font-semibold rounded-xl hover:bg-forest/90 transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50">
          {isSubmitting ? 'Sending Request...' : 'Send Booking Request'}
        </button>
      </form>
    </div>
  );

  const renderSuccess = (isMobile: boolean) => (
    <div className="bg-forest/5 border border-forest/20 rounded-2xl p-8 flex flex-col items-center justify-center text-center h-full animate-fade-in">
      <div className="w-16 h-16 bg-forest rounded-full flex items-center justify-center text-cream mb-6">
        <CheckCircle2 className="w-8 h-8" />
      </div>
      <h3 className="font-serif text-2xl font-bold text-earth mb-2">Booking Request Sent!</h3>
      <p className="text-sm text-earth/70 max-w-[300px] mx-auto leading-relaxed">Thank you, {guestName}. Your reservation request has been securely transmitted.</p>
      <button onClick={() => { setCheckInDate(null); setCheckOutDate(null); goToStep('calendar', -1); }} className="mt-8 px-6 py-2.5 border border-earth/20 rounded-lg text-xs font-semibold text-earth hover:bg-earth/5 transition-colors">
        Book Another Room
      </button>
    </div>
  );

  return (
    <div id="reservations-page" className="w-full">
      {/* SUB-HERO SECTION */}
      <section id="reservations-hero" className="relative bg-forest py-24 text-center border-b border-white/5 overflow-hidden">
        <EditableImage page="reservations" contentKey="reservations_hero_bg" defaultSrc="https://picsum.photos/seed/reservationhero/1600/900" currentSrc={getText('reservations_hero_bg')} editMode={editMode} alt="Lodge exterior" fill priority sizes="100vw" className="object-cover opacity-20" referrerPolicy="no-referrer" />
        <div className="relative z-10 max-w-[800px] mx-auto px-5 space-y-4 pt-12 text-cream">
          <EditableText as="span" page="reservations" contentKey="reservations_hero_subtitle" defaultText={`Official Booking Portal`} currentText={getText('reservations_hero_subtitle')} editMode={editMode} className="text-xs font-mono uppercase tracking-[0.2em] text-nanohana font-bold block" />
          <EditableText as="h1" page="reservations" contentKey="reservations_hero_title" defaultText={`Book direct. Best rate guaranteed.`} currentText={getText('reservations_hero_title')} editMode={editMode} className="font-serif text-4xl sm:text-5xl font-medium tracking-tight" />
          <EditableText as="p" page="reservations" contentKey="reservations_hero_desc" defaultText={`No undisclosed platform surcharges. No hidden commission markups. Pay securely on arrival at our Lakeside counter.`} currentText={getText('reservations_hero_desc')} editMode={editMode} className="text-cream/80 text-sm sm:text-base max-w-[500px] mx-auto leading-relaxed" />
        </div>
      </section>

      {/* AVAILABILITY CHECK WIDGET */}
      <section id="booking-widget-section" className="bg-cream py-16 text-earth">
        <div className="max-w-[1240px] mx-auto px-5 md:px-10 lg:px-20">
          <div className="bg-cream lg:border border-earth/10 p-4 lg:p-10 rounded-2xl lg:shadow-sm max-w-[1000px] mx-auto space-y-6 lg:space-y-8">
            <EditableText as="h2" page="reservations" contentKey="reservations_form_title" defaultText={`Select your travel dates`} currentText={getText('reservations_form_title')} editMode={editMode} className="font-serif text-2xl font-semibold text-center text-earth" />

            
            
            {/* MOBILE VIEW: Wizard UI */}
            <div className="lg:hidden max-w-lg mx-auto relative overflow-hidden" style={{ minHeight: '500px' }}>
              <AnimatePresence custom={direction} mode="wait">
                {bookingStep === 'calendar' && (
                  <motion.div key="calendar" custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3, ease: "easeInOut" }} className="w-full">
                    {renderCalendar(true)}
                  </motion.div>
                )}
                {bookingStep === 'options' && (
                  <motion.div key="options" custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3, ease: "easeInOut" }} className="w-full">
                    {renderOptions(true)}
                  </motion.div>
                )}
                {bookingStep === 'details' && (
                  <motion.div key="details" custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3, ease: "easeInOut" }} className="w-full">
                    {renderDetails(true)}
                  </motion.div>
                )}
                {bookingStep === 'success' && (
                  <motion.div key="success" custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3, ease: "easeInOut" }} className="w-full">
                    {renderSuccess(true)}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* DESKTOP VIEW: Side-by-side Layout */}
            <div className="hidden lg:grid grid-cols-2 gap-10">
              <div className="h-full">
                {renderCalendar(false)}
              </div>
              <div className="h-full">
                {bookingStep === 'calendar' && (
                  <div className="transition-opacity duration-300 opacity-100">
                    {renderOptions(false)}
                  </div>
                )}
                {bookingStep === 'options' && renderOptions(false)}
                {bookingStep === 'details' && renderDetails(false)}
                {bookingStep === 'success' && renderSuccess(false)}
              </div>
            </div>
            
            <div className="text-center pt-2 border-t border-earth/10">
              <EditableText as="span" page="reservations" contentKey="reservations_aggregator_text" defaultText={`Or book directly via our trusted aggregators:`} currentText={getText('reservations_aggregator_text')} editMode={editMode} className="text-xs text-earth/65" />
              <div className="flex flex-wrap justify-center items-center gap-4 text-[10px] font-mono text-earth/50 mt-3">
                <span className="hover:text-earth transition-colors">Booking.com</span>
                <span className="hover:text-earth transition-colors">Agoda</span>
                <span className="hover:text-earth transition-colors">Expedia</span>
                <span className="hover:text-earth transition-colors font-bold text-phewa">TripAdvisor (Rating 4.6)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* S8 ROOM COMPARISON TABLE */}
      <section id="comparative-table-section" className="bg-cream py-16 text-earth border-t border-earth/5">
        <div className="max-w-[1240px] mx-auto px-5 md:px-10 lg:px-20">
          <div className="text-center max-w-[650px] mx-auto mb-12">
            <EditableText as="h2" page="reservations" contentKey="reservations_comp_title" defaultText={`Lakeside Room Comparisons`} currentText={getText('reservations_comp_title')} editMode={editMode} className="font-serif text-3xl font-medium" />
            <EditableText as="p" page="reservations" contentKey="reservations_comp_desc" defaultText={`A transparent room metrics summary`} currentText={getText('reservations_comp_desc')} editMode={editMode} className="text-xs text-earth/70 mt-1 uppercase font-mono tracking-wider" />
          </div>

          <div className="hidden md:block overflow-x-auto rounded-xl border border-earth/10">
            <table className="min-w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-forest text-cream font-serif text-sm">
                  <th className="p-4"><EditableText as="span" page="reservations" contentKey="res_table_h1" defaultText={`Room Category`} currentText={getText('res_table_h1')} editMode={editMode} /></th>
                  <th className="p-4 text-nanohana font-sans font-semibold"><EditableText as="span" page="reservations" contentKey="res_table_h2" defaultText={`From Rate (USD)`} currentText={getText('res_table_h2')} editMode={editMode} /></th>
                  <th className="p-4"><EditableText as="span" page="reservations" contentKey="res_table_h3" defaultText={`Beds config`} currentText={getText('res_table_h3')} editMode={editMode} /></th>
                  <th className="p-4"><EditableText as="span" page="reservations" contentKey="res_table_h4" defaultText={`Primary View`} currentText={getText('res_table_h4')} editMode={editMode} /></th>
                  <th className="p-4"><EditableText as="span" page="reservations" contentKey="res_table_h5" defaultText={`Breakfast`} currentText={getText('res_table_h5')} editMode={editMode} /></th>
                  <th className="p-4"><EditableText as="span" page="reservations" contentKey="res_table_h6" defaultText={`Air Cooling`} currentText={getText('res_table_h6')} editMode={editMode} /></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-earth/10">
                {comparisons.map((c, i) => (
                  <tr key={i} className={i % 2 === 1 ? 'bg-earth/5' : 'bg-cream'}>
                    <td className="p-4 font-serif font-bold text-sm tracking-wide text-earth"><EditableText as="span" page="reservations" contentKey={`res_row_${i}_name`} defaultText={c.name} currentText={getText(`res_row_${i}_name`)} editMode={editMode} /></td>
                    <td className="p-4 font-bold text-nanohana text-base font-mono">${c.price}/night</td>
                    <td className="p-4 font-medium text-earth/80"><EditableText as="span" page="reservations" contentKey={`res_row_${i}_beds`} defaultText={c.beds} currentText={getText(`res_row_${i}_beds`)} editMode={editMode} /></td>
                    <td className="p-4 font-mono uppercase text-teal-800 font-bold"><EditableText as="span" page="reservations" contentKey={`res_row_${i}_view`} defaultText={c.view} currentText={getText(`res_row_${i}_view`)} editMode={editMode} /></td>
                    <td className="p-4 text-earth/70"><EditableText as="span" page="reservations" contentKey={`res_row_${i}_breakfast`} defaultText={c.breakfast} currentText={getText(`res_row_${i}_breakfast`)} editMode={editMode} /></td>
                    <td className="p-4 text-earth/70"><EditableText as="span" page="reservations" contentKey={`res_row_${i}_ac`} defaultText={c.ac} currentText={getText(`res_row_${i}_ac`)} editMode={editMode} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* S8 POLICY MATRIX CARDS GRID */}
      <section id="policy-matrix-section" className="bg-cream py-16 border-t border-earth/15">
        <div className="max-w-[1240px] mx-auto px-5 md:px-10 lg:px-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs text-earth/80">
            {/* Card 1 */}
            <div className="p-5 bg-cream border border-earth/10 rounded-xl space-y-2">
              <EditableText as="span" page="reservations" contentKey="res_policy_1_title" defaultText={`01. Room Check-In`} currentText={getText('res_policy_1_title')} editMode={editMode} className="font-bold underline block font-serif text-sm text-earth" />
              <EditableText as="p" page="reservations" contentKey="res_policy_1_desc" defaultText={`Covered from 6:00 AM onwards because of our structured morning desk hours. Please email your anticipated landing hour in advance.`} currentText={getText('res_policy_1_desc')} editMode={editMode} className="leading-relaxed text-earth/75" />
            </div>

            {/* Card 2 */}
            <div className="p-5 bg-cream border border-earth/10 rounded-xl space-y-2">
              <EditableText as="span" page="reservations" contentKey="res_policy_2_title" defaultText={`02. Check-Out hour`} currentText={getText('res_policy_2_title')} editMode={editMode} className="font-bold underline block font-serif text-sm text-earth" />
              <EditableText as="p" page="reservations" contentKey="res_policy_2_desc" defaultText={`Please return your keys before 12:00 noon. Late check-outs are subject to availability.`} currentText={getText('res_policy_2_desc')} editMode={editMode} className="leading-relaxed text-earth/75" />
            </div>

            {/* Card 3 */}
            <div className="p-5 bg-cream border border-earth/10 rounded-xl space-y-2">
              <EditableText as="span" page="reservations" contentKey="res_policy_3_title" defaultText={`03. Children & Cot policies`} currentText={getText('res_policy_3_title')} editMode={editMode} className="font-bold underline block font-serif text-sm text-earth" />
              <EditableText as="p" page="reservations" contentKey="res_policy_3_desc" defaultText={`Ages 0-8 stay free using existing beds.`} currentText={getText('res_policy_3_desc')} editMode={editMode} className="leading-relaxed text-earth/75" />
            </div>

            {/* Card 4 */}
            <div className="p-5 bg-cream border border-earth/10 rounded-xl space-y-2">
              <EditableText as="span" page="reservations" contentKey="res_policy_4_title" defaultText={`04. Flexible cancellations`} currentText={getText('res_policy_4_title')} editMode={editMode} className="font-bold underline block font-serif text-sm text-earth" />
              <EditableText as="p" page="reservations" contentKey="res_policy_4_desc" defaultText={`Cancellations policies depend heavily on booking avenues. Direct reserving secures the utmost flexibility and swift refunds.`} currentText={getText('res_policy_4_desc')} editMode={editMode} className="leading-relaxed text-earth/75" />
            </div>
          </div>
        </div>
      </section>

      {/* WHY BOOK DIRECT SECTION */}
      <section id="why-book-direct" className="bg-cream py-20 border-t border-earth/10 text-earth">
        <div className="max-w-[1240px] mx-auto px-5 md:px-10 lg:px-20 text-center space-y-12">
          <EditableText as="h2" page="reservations" contentKey="res_why_book_title" defaultText={`Why book directly with our family?`} currentText={getText('res_why_book_title')} editMode={editMode} className="font-serif text-3xl font-medium" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="w-12 h-12 bg-phewa/10 text-phewa rounded-full flex items-center justify-center mx-auto">
                <Percent className="w-5 h-5" />
              </div>
              <EditableText as="h3" page="reservations" contentKey="res_why_1_title" defaultText={`Cheapest Rate Guarantee`} currentText={getText('res_why_1_title')} editMode={editMode} className="font-serif text-xl font-bold" />
              <EditableText as="p" page="reservations" contentKey="res_why_1_desc" defaultText={`By bypassing major hotel commissions, we pass 10% direct savings back to travelers.`} currentText={getText('res_why_1_desc')} editMode={editMode} className="text-xs sm:text-sm text-earth/75 leading-relaxed max-w-[300px] mx-auto" />
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 bg-phewa/10 text-phewa rounded-full flex items-center justify-center mx-auto">
                <Calendar className="w-5 h-5" />
              </div>
              <EditableText as="h3" page="reservations" contentKey="res_why_2_title" defaultText={`Flexible Modifications`} currentText={getText('res_why_2_title')} editMode={editMode} className="font-serif text-xl font-bold" />
              <EditableText as="p" page="reservations" contentKey="res_why_2_desc" defaultText={`Modify dates, check-in schedules, or specific view selections without paying booking engine cancellation fees.`} currentText={getText('res_why_2_desc')} editMode={editMode} className="text-xs sm:text-sm text-earth/75 leading-relaxed max-w-[300px] mx-auto" />
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 bg-phewa/10 text-phewa rounded-full flex items-center justify-center mx-auto">
                <Smile className="w-5 h-5" />
              </div>
              <EditableText as="h3" page="reservations" contentKey="res_why_3_title" defaultText={`Personal Preparation`} currentText={getText('res_why_3_title')} editMode={editMode} className="font-serif text-xl font-bold" />
              <EditableText as="p" page="reservations" contentKey="res_why_3_desc" defaultText={`Booking directly alerts Rabin and Kul Bahadur immediately. Your room is prepared according to your precise timeline.`} currentText={getText('res_why_3_desc')} editMode={editMode} className="text-xs sm:text-sm text-earth/75 leading-relaxed max-w-[300px] mx-auto" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
