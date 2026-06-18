'use client';

import React, { useState } from 'react';
import { Settings, X, ChevronLeft, ChevronRight, Loader2, CalendarX } from 'lucide-react';
import { updateContent } from '@/app/actions/updateContent';
import { defaultRooms } from '@/lib/defaultRooms';
import { motion } from 'framer-motion';

// --- Types ---
type BookingsData = {
  inventory: Record<string, number>;
  bookings: Record<string, Record<string, string[]>>; // categoryId -> roomIndex -> ['YYYY-MM-DD']
};

export default function BookingsClient({ content = [] }: { content?: any[] }) {
  // 1. Fetch Categories
  const rawRooms = content.find((c: any) => c.key === 'global_rooms_list')?.value;
  const categories = React.useMemo(() => {
    try {
      return rawRooms ? JSON.parse(rawRooms) : defaultRooms;
    } catch (e) {
      return defaultRooms;
    }
  }, [rawRooms]);

  // 2. Fetch Bookings Data
  const rawBookings = content.find((c: any) => c.key === 'bookings_data')?.value;
  const initialBookingsData = React.useMemo(() => {
    const data: BookingsData = { inventory: {}, bookings: {} };
    try {
      if (rawBookings) return JSON.parse(rawBookings) as BookingsData;
    } catch (e) {}
    return data;
  }, [rawBookings]);

  // Ensure default inventory if missing
  categories.forEach((cat: any) => {
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
  const [selectedRoomIndex, setSelectedRoomIndex] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Modals
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [tempInventory, setTempInventory] = useState<Record<string, number>>(initialBookingsData.inventory);

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

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const prevMonth = () => setCalendarDate(new Date(currentYear, currentMonth - 1, 1));
  const nextMonth = () => setCalendarDate(new Date(currentYear, currentMonth + 1, 1));

  const getTodayStr = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  // Render Helpers
  const selectedCat = categories.find((c: any) => c.id === selectedCatId);
  const roomCount = data.inventory[selectedCatId] || 0;
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
          {categories.map((cat: any) => (
            <button
              key={cat.id}
              onClick={() => { setSelectedCatId(cat.id); setSelectedRoomIndex(null); }}
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

        {/* View Area */}
        <div className="overflow-x-auto min-h-[500px]">
          {roomCount === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <CalendarX className="w-12 h-12 text-cream/20 mb-4" />
              <p className="text-cream/50 text-lg font-medium">No rooms exist in this category.</p>
              <button onClick={() => {
                setTempInventory(data.inventory);
                setIsSettingsOpen(true);
              }} className="mt-4 text-nanohana hover:underline text-sm font-bold">Manage Inventory</button>
            </div>
          ) : (
          <div className="p-8">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-serif text-white">{selectedCat?.name}</h2>
                <p className="text-cream/50 text-sm mt-1">Select a physical room to manage its bookings calendar.</p>
              </div>
              <div className="text-sm text-cream/40 font-mono uppercase tracking-widest">
                Total Rooms: {roomCount}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {physicalRooms.map(roomIndex => (
                <button
                  key={roomIndex}
                  onClick={() => setSelectedRoomIndex(roomIndex)}
                  className="flex items-center justify-between p-6 bg-black/40 border border-white/10 hover:border-nanohana/50 rounded-2xl transition-all group shadow-lg hover:bg-white/5"
                >
                  <div className="text-left">
                    <div className="text-xl font-bold text-white group-hover:text-nanohana transition-colors">
                      Room {roomIndex + 1}
                    </div>
                    <div className="text-xs text-cream/50 mt-2 font-mono uppercase tracking-widest bg-white/5 inline-block px-2 py-1 rounded">
                      {data.bookings[selectedCatId]?.[roomIndex]?.length || 0} Blocked Dates
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white/50 group-hover:bg-nanohana group-hover:text-earth transition-colors border border-white/5 group-hover:border-nanohana">
                    <ChevronRight className="w-6 h-6 ml-0.5" />
                  </div>
                </button>
              ))}
            </div>
          </div>
          )}
        </div>
      </div>

      {/* Calendar Modal */}
      {selectedRoomIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#1a1a1a] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-white/10 bg-white/5">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  Room {selectedRoomIndex + 1} Calendar
                </h2>
                <p className="text-xs text-cream/50 mt-1">{selectedCat?.name}</p>
              </div>
              <button onClick={() => setSelectedRoomIndex(null)} className="text-white/50 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex items-center justify-between mb-6 bg-black/40 p-2 rounded-xl border border-white/10">
                <button onClick={prevMonth} className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors" aria-label="Previous Month">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <h3 className="font-bold text-white text-center font-mono tracking-widest uppercase text-xs">
                  {monthNames[currentMonth]} <span className="text-nanohana">{currentYear}</span>
                </h3>
                <button onClick={nextMonth} className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors" aria-label="Next Month">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-7 gap-1">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                  <div key={day} className="text-center text-[10px] font-bold text-cream/40 uppercase tracking-widest py-2 mb-1">
                    {day}
                  </div>
                ))}
                {Array.from({ length: new Date(currentYear, currentMonth, 1).getDay() }).map((_, i) => (
                  <div key={`empty-${i}`} className="p-2" />
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                  const roomBookings = data.bookings[selectedCatId]?.[selectedRoomIndex] || [];
                  const booked = roomBookings.includes(dateStr);
                  const isToday = getTodayStr() === dateStr;
                  
                  const dateObj = new Date(currentYear, currentMonth, day);
                  const todayObj = new Date();
                  todayObj.setHours(0,0,0,0);
                  const isPast = dateObj < todayObj;

                  return (
                    <button
                      key={day}
                      onClick={() => {
                        if (isPast) return;
                        let newRoomBookings;
                        if (booked) {
                          newRoomBookings = roomBookings.filter((d: string) => d !== dateStr);
                        } else {
                          newRoomBookings = [...roomBookings, dateStr];
                        }
                        
                        const newData = {
                          ...data,
                          bookings: {
                            ...data.bookings,
                            [selectedCatId]: {
                              ...(data.bookings[selectedCatId] || {}),
                              [selectedRoomIndex]: newRoomBookings
                            }
                          }
                        };
                        setData(newData);
                        saveToDb(newData);
                      }}
                      disabled={isSaving || isPast}
                      className={`aspect-square flex flex-col items-center justify-center rounded-lg transition-all border ${
                        isPast
                          ? 'border-transparent text-white/10 cursor-not-allowed bg-black/20'
                          : booked 
                            ? 'border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20' 
                            : 'border-white/10 bg-black/40 text-white hover:bg-nanohana/20 hover:text-nanohana hover:border-nanohana/50'
                      } ${isSaving ? 'opacity-50 cursor-not-allowed' : ''} ${isToday && !booked ? 'ring-1 ring-nanohana/50 border-transparent' : ''}`}
                    >
                      <span className={`text-sm font-semibold ${isPast ? '' : ''} ${isToday && !booked ? 'text-nanohana' : ''}`}>{day}</span>
                      {!isPast && (
                        <div className={`w-1 h-1 rounded-full mt-0.5 ${booked ? 'bg-red-400' : 'bg-transparent'}`} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      )}

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
              
              {categories.map((cat: any) => (
                <div key={cat.id} className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-white font-bold">{cat.name}</p>
                    <p className="text-xs text-cream/40">{cat.category}</p>
                  </div>
                  <div className="flex items-center gap-3 bg-black/40 border border-white/10 rounded-lg p-1">
                    <button 
                      aria-label="Decrease inventory"
                      onClick={() => setTempInventory(prev => ({ ...prev, [cat.id]: Math.max(0, (prev[cat.id] || 0) - 1) }))}
                      className="w-8 h-8 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 rounded"
                    >-</button>
                    <span className="w-6 text-center font-bold text-nanohana">{tempInventory[cat.id] || 0}</span>
                    <button 
                      aria-label="Increase inventory"
                      onClick={() => setTempInventory(prev => ({ ...prev, [cat.id]: (prev[cat.id] || 0) + 1 }))}
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
    </div>
  );
}
