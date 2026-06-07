'use client';

import React, { useState, useEffect } from 'react';
import { Settings, X, Calendar, ChevronLeft, ChevronRight, Loader2, BedDouble, CheckCircle2 } from 'lucide-react';
import { updateContent } from '@/app/actions/updateContent';
import { defaultRooms } from '@/lib/defaultRooms';
import { motion, AnimatePresence } from 'framer-motion';

// --- Types ---
type BookingsData = {
  inventory: Record<string, number>;
  bookings: Record<string, Record<string, string[]>>; // categoryId -> roomIndex -> ['YYYY-MM-DD']
};

export default function BookingsClient({ content = [] }: { content?: any[] }) {
  // 1. Fetch Categories
  const rawRooms = content.find((c: any) => c.key === 'global_rooms_list')?.value;
  let categories: any[] = [];
  try {
    categories = rawRooms ? JSON.parse(rawRooms) : defaultRooms;
  } catch (e) {
    categories = defaultRooms;
  }

  // 2. Fetch Bookings Data
  const rawBookings = content.find((c: any) => c.key === 'bookings_data')?.value;
  let initialBookingsData: BookingsData = { inventory: {}, bookings: {} };
  try {
    if (rawBookings) initialBookingsData = JSON.parse(rawBookings);
  } catch (e) {}

  // Ensure default inventory if missing
  categories.forEach(cat => {
    if (initialBookingsData.inventory[cat.id] === undefined) {
      initialBookingsData.inventory[cat.id] = 1; // Default to 1 room per category
    }
    if (!initialBookingsData.bookings[cat.id]) {
      initialBookingsData.bookings[cat.id] = {};
    }
  });

  // State
  const [data, setData] = useState<BookingsData>(initialBookingsData);
  const [selectedCatId, setSelectedCatId] = useState<string>(categories[0]?.id || '');
  const [isSaving, setIsSaving] = useState(false);

  // Modals
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [tempInventory, setTempInventory] = useState<Record<string, number>>(initialBookingsData.inventory);

  const [selectedRoomIndex, setSelectedRoomIndex] = useState<number | null>(null);
  const [calendarDate, setCalendarDate] = useState<Date>(new Date());

  // --- Save Handler ---
  const saveToDb = async (newData: BookingsData) => {
    setIsSaving(true);
    await updateContent('global', 'bookings_data', JSON.stringify(newData));
    setData(newData);
    setIsSaving(false);
  };

  // --- Settings Logic ---
  const handleSaveSettings = () => {
    const newData = { ...data, inventory: tempInventory };
    saveToDb(newData);
    setIsSettingsOpen(false);
  };

  // --- Calendar Logic ---
  const currentYear = calendarDate.getFullYear();
  const currentMonth = calendarDate.getMonth(); // 0-11
  
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay(); // 0 (Sun) - 6 (Sat)

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const prevMonth = () => setCalendarDate(new Date(currentYear, currentMonth - 1, 1));
  const nextMonth = () => setCalendarDate(new Date(currentYear, currentMonth + 1, 1));

  const toggleDate = (day: number) => {
    if (selectedRoomIndex === null) return;
    
    // Format YYYY-MM-DD
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    const catBookings = data.bookings[selectedCatId] || {};
    const roomBookings = catBookings[selectedRoomIndex] || [];
    
    let newRoomBookings;
    if (roomBookings.includes(dateStr)) {
      newRoomBookings = roomBookings.filter(d => d !== dateStr); // Remove
    } else {
      newRoomBookings = [...roomBookings, dateStr]; // Add
    }

    const newData = {
      ...data,
      bookings: {
        ...data.bookings,
        [selectedCatId]: {
          ...catBookings,
          [selectedRoomIndex]: newRoomBookings
        }
      }
    };
    
    setData(newData); // Optimistic update
    saveToDb(newData);
  };

  const isDateBooked = (day: number) => {
    if (selectedRoomIndex === null) return false;
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const roomBookings = data.bookings[selectedCatId]?.[selectedRoomIndex] || [];
    return roomBookings.includes(dateStr);
  };

  const getTodayStr = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  // Render Helpers
  const selectedCat = categories.find(c => c.id === selectedCatId);
  const roomCount = data.inventory[selectedCatId] || 1;
  const physicalRooms = Array.from({ length: roomCount }, (_, i) => i);

  return (
    <div className="max-w-6xl space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-white mb-2">Booking Manager</h1>
          <p className="text-cream/60">Manage room inventory and block out booked dates.</p>
        </div>
        <button
          onClick={() => {
            setTempInventory(data.inventory);
            setIsSettingsOpen(true);
          }}
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white font-bold transition-all"
        >
          <Settings className="w-5 h-5" /> Inventory Settings
        </button>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        {/* Category Tabs */}
        <div className="flex overflow-x-auto no-scrollbar border-b border-white/10 bg-black/20 p-2 gap-2">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCatId(cat.id)}
              className={`px-6 py-3 rounded-xl font-bold whitespace-nowrap transition-all ${
                selectedCatId === cat.id 
                  ? 'bg-nanohana text-earth shadow-md' 
                  : 'text-cream/60 hover:text-white hover:bg-white/5'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Physical Rooms Grid */}
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-serif text-white">{selectedCat?.name}</h2>
              <p className="text-cream/50 text-sm mt-1">Select a specific room to manage its availability.</p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-bold text-nanohana">{roomCount}</span>
              <span className="text-cream/50 ml-2 uppercase text-xs tracking-widest font-mono">Total Rooms</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <AnimatePresence>
              {physicalRooms.map(roomIndex => {
                const bookedDatesCount = data.bookings[selectedCatId]?.[roomIndex]?.length || 0;
                
                return (
                  <motion.div
                    key={`${selectedCatId}-${roomIndex}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    onClick={() => {
                      setSelectedRoomIndex(roomIndex);
                      setCalendarDate(new Date()); // Reset to today
                    }}
                    className="bg-black/40 border border-white/10 rounded-2xl p-6 cursor-pointer hover:border-nanohana/50 hover:bg-white/5 transition-all group"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-white/5 rounded-full text-nanohana group-hover:scale-110 transition-transform">
                          <BedDouble className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-white font-bold text-lg">Room {roomIndex + 1}</p>
                          <p className="text-xs text-cream/40 uppercase font-mono tracking-widest">{selectedCat?.category}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <span className="text-sm text-cream/60 flex items-center gap-2">
                        <Calendar className="w-4 h-4" /> {bookedDatesCount} Dates Booked
                      </span>
                      <span className="text-nanohana font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                        Manage &rarr;
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#1a1a1a] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-white/10 bg-white/5">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-nanohana" /> Inventory Settings
              </h2>
              <button onClick={() => setIsSettingsOpen(false)} className="text-white/50 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
              <p className="text-sm text-cream/70 mb-4">Define how many physical rooms exist for each category. This determines how many separate calendars are available to manage.</p>
              
              {categories.map(cat => (
                <div key={cat.id} className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-white font-bold">{cat.name}</p>
                    <p className="text-xs text-cream/40">{cat.category}</p>
                  </div>
                  <div className="flex items-center gap-3 bg-black/40 border border-white/10 rounded-lg p-1">
                    <button 
                      onClick={() => setTempInventory(prev => ({ ...prev, [cat.id]: Math.max(1, (prev[cat.id] || 1) - 1) }))}
                      className="w-8 h-8 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 rounded"
                    >-</button>
                    <span className="w-6 text-center font-bold text-nanohana">{tempInventory[cat.id] || 1}</span>
                    <button 
                      onClick={() => setTempInventory(prev => ({ ...prev, [cat.id]: (prev[cat.id] || 1) + 1 }))}
                      className="w-8 h-8 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 rounded"
                    >+</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-6 border-t border-white/10 flex justify-end gap-3 bg-black/20">
              <button onClick={() => setIsSettingsOpen(false)} className="px-6 py-2 rounded-full text-white/70 hover:bg-white/5 transition-colors font-bold">Cancel</button>
              <button onClick={handleSaveSettings} disabled={isSaving} className="px-6 py-2 rounded-full bg-nanohana text-earth font-bold hover:bg-nanohana/90 transition-colors flex items-center gap-2">
                {isSaving && <Loader2 className="w-4 h-4 animate-spin" />} Save Inventory
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Calendar Modal */}
      {selectedRoomIndex !== null && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm">
          <div className="min-h-full flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative bg-[#1a1a1a] border border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl">
              
              {/* Absolute Close Button */}
              <button 
                onClick={() => setSelectedRoomIndex(null)} 
                className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/40 hover:bg-white/10 text-white/50 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Header */}
              <div className="p-8 pb-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-nanohana" />
                  {selectedCat?.name} — Room {selectedRoomIndex + 1}
                </h2>
                <p className="text-xs text-cream/50 mt-1">Click dates to toggle availability.</p>
              </div>

              {/* Calendar Controls */}
              <div className="p-8 pt-0">
                <div className="flex items-center justify-between mb-8 mt-4">
                  <button 
                    onClick={(e) => { e.preventDefault(); if (!(currentYear === new Date().getFullYear() && currentMonth === new Date().getMonth())) prevMonth() }} 
                    disabled={currentYear === new Date().getFullYear() && currentMonth === new Date().getMonth()}
                    className={`p-2 rounded-full transition-colors ${currentYear === new Date().getFullYear() && currentMonth === new Date().getMonth() ? 'text-white/20 cursor-not-allowed' : 'text-white/70 hover:text-white hover:bg-white/10'}`}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <h3 className="text-xl font-medium text-white tracking-wide">
                    {monthNames[currentMonth]} {currentYear}
                  </h3>
                  <button onClick={nextMonth} className="p-2 hover:bg-white/10 rounded-full text-white/70 hover:text-white transition-colors">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                {/* Days of Week Header */}
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                    <div key={d} className="text-center text-xs font-semibold text-cream/40">
                      {d}
                    </div>
                  ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-2">
                  {/* Empty cells before start of month */}
                  {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                    <div key={`empty-${i}`} className="aspect-square" />
                  ))}

                  {/* Days of Month */}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const booked = isDateBooked(day);
                    const isToday = getTodayStr() === `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    
                    const dateObj = new Date(currentYear, currentMonth, day);
                    const todayObj = new Date();
                    todayObj.setHours(0,0,0,0);
                    const isPast = dateObj < todayObj;
                    
                    return (
                      <button
                        key={day}
                        onClick={() => toggleDate(day)}
                        disabled={isSaving || isPast}
                        className={`relative aspect-square flex items-center justify-center text-sm rounded-full transition-all mx-auto w-10 h-10 ${
                          isPast
                            ? 'text-white/10 cursor-not-allowed'
                            : booked 
                              ? 'text-white/30 line-through hover:text-red-400 hover:bg-red-500/10' 
                              : 'text-white hover:bg-white/10 hover:text-nanohana'
                        } ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {day}
                        {isToday && !booked && (
                          <span className="absolute bottom-1 w-1 h-1 rounded-full bg-nanohana" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="flex items-center justify-center gap-8 mt-8 pt-6 border-t border-white/5">
                  <div className="flex items-center gap-2">
                    <div className="text-sm text-white font-medium">
                      {daysInMonth - Array.from({ length: daysInMonth }).filter((_, i) => isDateBooked(i + 1)).length}
                    </div>
                    <span className="text-xs text-cream/50">Available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-sm text-white/30 line-through font-medium">
                      {Array.from({ length: daysInMonth }).filter((_, i) => isDateBooked(i + 1)).length}
                    </div>
                    <span className="text-xs text-cream/50">Booked</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
}
