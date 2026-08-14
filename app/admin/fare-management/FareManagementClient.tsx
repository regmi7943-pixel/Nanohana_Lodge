"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CalendarRange, 
  Plus, 
  Trash2, 
  Save, 
  X, 
  Edit, 
  Loader2, 
  ToggleLeft, 
  ToggleRight, 
  Sun,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Bed
} from 'lucide-react';
import toast from 'react-hot-toast';
import { updateContent } from '@/app/actions/updateContent';
import { defaultRooms } from '@/lib/defaultRooms';

export interface SeasonalTier {
  label: string;
  guests: number;
  price: string;
}

export interface SeasonalFare {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  categoryFares: Record<string, SeasonalTier[]>;
  minStay?: number;
  isActive: boolean;
  createdAt: string;
}

export default function FareManagementClient({ content = [] }: { content?: any[] }) {
  const [activeTab, setActiveTab] = useState<'seasons' | 'calendar'>('seasons');
  const [fares, setFares] = useState<SeasonalFare[]>([]);
  
  // Modal State
  const [isSeasonModalOpen, setIsSeasonModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [modalCategoryTab, setModalCategoryTab] = useState<string>('');

  // Extract rooms list dynamically from DB content or defaultRooms
  const roomsList = useMemo(() => {
    try {
      const raw = content.find((c: any) => c.key === 'global_rooms_list')?.value;
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return defaultRooms;
  }, [content]);

  // Extract unique categories list dynamically
  const categories = useMemo(() => {
    const unique = Array.from(new Set(roomsList.map((r: any) => r.category).filter(Boolean)));
    return unique.length > 0 ? unique : ['Economy', 'Standard', 'Deluxe'];
  }, [roomsList]);

  // Helper to extract default Traveller Tiers for a category from rooms
  const getCategoryTiersFromRooms = (categoryName: string): SeasonalTier[] => {
    const roomInCat = roomsList.find((r: any) => r.category === categoryName);
    if (roomInCat && roomInCat.pricingConfig && roomInCat.pricingConfig.length > 0) {
      return roomInCat.pricingConfig.map((t: any) => ({
        label: t.label || `${t.guests} Adult${t.guests > 1 ? 's' : ''}`,
        guests: Number(t.guests) || 1,
        price: t.price || roomInCat.price || '$15'
      }));
    }
    // Default tiers if room pricingConfig is empty
    if (categoryName === 'Economy') {
      return [
        { label: '1 Adult', guests: 1, price: '$12' },
        { label: '2 Adults', guests: 2, price: '$15' }
      ];
    }
    return [
      { label: '1 Adult', guests: 1, price: '$15' },
      { label: '2 Adults', guests: 2, price: '$18' },
      { label: '3 Adults / Family', guests: 3, price: '$22' }
    ];
  };

  const defaultSeason: SeasonalFare = {
    id: '',
    name: '',
    startDate: '',
    endDate: '',
    categoryFares: {},
    minStay: 1,
    isActive: true,
    createdAt: ''
  };

  const [editingSeason, setEditingSeason] = useState<SeasonalFare>(defaultSeason);

  // Rate Calendar State
  const [calendarMonth, setCalendarMonth] = useState<Date>(new Date());
  const [selectedCalendarCategory, setSelectedCalendarCategory] = useState<string>('');
  const [selectedCalendarGuests, setSelectedCalendarGuests] = useState<number>(2);

  // Today ISO string (YYYY-MM-DD) for date constraints
  const todayStr = useMemo(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  }, []);

  // Set default tabs when categories are loaded
  useEffect(() => {
    if (categories.length > 0) {
      if (!modalCategoryTab) setModalCategoryTab(categories[0]);
      if (!selectedCalendarCategory) setSelectedCalendarCategory(categories[0]);
    }
  }, [categories, modalCategoryTab, selectedCalendarCategory]);

  // Load Seasonal Fares from content
  useEffect(() => {
    try {
      const faresData = content.find((c: any) => c.key === 'seasonal_fares')?.value;
      if (faresData) {
        const parsed = JSON.parse(faresData);
        if (Array.isArray(parsed)) {
          setFares(parsed.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()));
        }
      }
    } catch (error) {
      console.error('Failed to parse seasonal fares:', error);
    }
  }, [content]);

  const saveSeasonsToDb = async (updatedFares: SeasonalFare[]) => {
    try {
      const result = await updateContent('global', 'seasonal_fares', JSON.stringify(updatedFares));
      if (result.success) {
        setFares(updatedFares);
        return true;
      }
      throw new Error('Failed to update content');
    } catch (error) {
      console.error('Error saving fares:', error);
      return false;
    }
  };

  // Open modal handler — initializes categoryFares for all current categories
  const openModal = (fare?: SeasonalFare) => {
    const base = fare ? { ...fare } : { ...defaultSeason };
    const initialCategoryFares: Record<string, SeasonalTier[]> = { ...base.categoryFares };

    // Ensure every category has tiers initialized
    categories.forEach(cat => {
      const defaultTiers = getCategoryTiersFromRooms(cat);
      if (!initialCategoryFares[cat] || !Array.isArray(initialCategoryFares[cat]) || initialCategoryFares[cat].length === 0) {
        initialCategoryFares[cat] = defaultTiers;
      } else {
        // Merge with room tiers structure in case room tiers were updated
        initialCategoryFares[cat] = defaultTiers.map(roomTier => {
          const existing = initialCategoryFares[cat].find(t => t.guests === roomTier.guests || t.label === roomTier.label);
          return {
            label: roomTier.label,
            guests: roomTier.guests,
            price: existing ? existing.price : roomTier.price
          };
        });
      }
    });

    setEditingSeason({
      ...base,
      categoryFares: initialCategoryFares
    });
    setModalCategoryTab(categories[0] || 'Standard');
    setIsSeasonModalOpen(true);
  };

  const handleSaveSeason = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSeason.name || !editingSeason.startDate || !editingSeason.endDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (editingSeason.startDate < todayStr) {
      toast.error('Start date cannot be in the past');
      return;
    }

    if (editingSeason.endDate < todayStr) {
      toast.error('End date cannot be in the past');
      return;
    }

    if (new Date(editingSeason.startDate) > new Date(editingSeason.endDate)) {
      toast.error('End date must be after or equal to start date');
      return;
    }

    // Strict validation: Block overlapping active seasonal date ranges
    if (editingSeason.isActive) {
      const overlapping = fares.find(f => {
        if (!f.isActive) return false;
        if (editingSeason.id && f.id === editingSeason.id) return false;
        return (editingSeason.startDate <= f.endDate) && (editingSeason.endDate >= f.startDate);
      });

      if (overlapping) {
        toast.error(`Date range overlaps with active season: "${overlapping.name}" (${overlapping.startDate} → ${overlapping.endDate})`);
        return;
      }
    }

    setIsSaving(true);
    let updated = [...fares];

    if (editingSeason.id) {
      updated = updated.map(f => f.id === editingSeason.id ? editingSeason : f);
    } else {
      const newSeason = {
        ...editingSeason,
        id: `season-${Date.now()}`,
        createdAt: new Date().toISOString()
      };
      updated = [newSeason, ...updated];
    }

    const success = await saveSeasonsToDb(updated);
    if (success) {
      toast.success(editingSeason.id ? 'Season updated successfully' : 'Season added successfully');
      setIsSeasonModalOpen(false);
      setEditingSeason(defaultSeason);
    } else {
      toast.error('Failed to save season');
    }
    setIsSaving(false);
  };

  const handleDeleteSeason = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this season?')) return;
    const updated = fares.filter(f => f.id !== id);
    const success = await saveSeasonsToDb(updated);
    if (success) toast.success('Season deleted');
    else toast.error('Failed to delete season');
  };

  const handleToggleSeasonActive = async (fare: SeasonalFare) => {
    const updated = fares.map(f => f.id === fare.id ? { ...f, isActive: !f.isActive } : f);
    const success = await saveSeasonsToDb(updated);
    if (success) toast.success(`Season ${!fare.isActive ? 'enabled' : 'disabled'}`);
    else toast.error('Failed to update status');
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getStatus = (item: { isActive: boolean; startDate: string; endDate: string }) => {
    if (!item.isActive) return { label: 'Disabled', color: 'bg-neutral-500/20 text-neutral-400 border-neutral-500/30' };
    const now = new Date();
    now.setHours(0,0,0,0);
    const start = new Date(item.startDate);
    const end = new Date(item.endDate);
    if (end < now) return { label: 'Expired', color: 'bg-red-500/20 text-red-400 border-red-500/30' };
    if (start > now) return { label: 'Upcoming', color: 'bg-nanohana/20 text-nanohana border-nanohana/30' };
    return { label: 'Active', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' };
  };

  // Update a single tier price in the season modal
  const handleUpdateTierPrice = (category: string, tierIndex: number, priceValue: string) => {
    const categoryTiers = [...(editingSeason.categoryFares[category] || [])];
    if (categoryTiers[tierIndex]) {
      categoryTiers[tierIndex] = { ...categoryTiers[tierIndex], price: priceValue };
      setEditingSeason({
        ...editingSeason,
        categoryFares: {
          ...editingSeason.categoryFares,
          [category]: categoryTiers
        }
      });
    }
  };

  // Rate Resolver for Calendar
  const resolveRateForDate = (dateStr: string, category: string, guestsCount: number) => {
    const matchingSeason = fares.find(f => f.isActive && dateStr >= f.startDate && dateStr <= f.endDate);
    if (matchingSeason && matchingSeason.categoryFares?.[category]) {
      const tiers = matchingSeason.categoryFares[category];
      if (Array.isArray(tiers) && tiers.length > 0) {
        const tier = tiers.find(t => t.guests === guestsCount) || tiers[0];
        return {
          price: tier.price,
          source: 'Seasonal Fare',
          sourceName: matchingSeason.name,
          minStay: matchingSeason.minStay || 1,
          type: 'seasonal'
        };
      }
    }

    // Fallback to room base tier
    const roomInCat = roomsList.find((r: any) => r.category === category);
    if (roomInCat) {
      if (roomInCat.pricingConfig && roomInCat.pricingConfig.length > 0) {
        const match = roomInCat.pricingConfig.find((t: any) => t.guests === guestsCount);
        if (match) return { price: match.price, source: 'Base Rate', sourceName: 'Room Base Tier', minStay: 1, type: 'base' };
      }
      return { price: roomInCat.price || '$15', source: 'Base Rate', sourceName: 'Standard Base Price', minStay: 1, type: 'base' };
    }

    return { price: '$15', source: 'Base Rate', sourceName: 'Standard Base Price', minStay: 1, type: 'base' };
  };

  // Calendar Grid Calculation
  const calendarYear = calendarMonth.getFullYear();
  const calendarMonthIndex = calendarMonth.getMonth();
  const daysInMonth = new Date(calendarYear, calendarMonthIndex + 1, 0).getDate();
  const firstDayOfMonth = new Date(calendarYear, calendarMonthIndex, 1).getDay();
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 pb-12">
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-white mb-2">Fare & Season Management</h1>
          <p className="text-cream/60">Configure seasonal pricing tiers per category and inspect effective daily rates.</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 bg-earth/60 p-1.5 rounded-full border border-white/10">
          <button
            onClick={() => setActiveTab('seasons')}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'seasons' ? 'bg-nanohana text-earth shadow-md' : 'text-cream/70 hover:text-white'
            }`}
          >
            <CalendarRange size={15} /> Seasonal Fares
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'calendar' ? 'bg-nanohana text-earth shadow-md' : 'text-cream/70 hover:text-white'
            }`}
          >
            <CalendarIcon size={15} /> Rate Calendar
          </button>
        </div>
      </div>

      {/* ================= TAB 1: SEASONAL FARES ================= */}
      {activeTab === 'seasons' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-serif font-bold text-white">Seasonal Pricing Ranges</h2>
              <p className="text-xs text-cream/50">Set seasonal rate overrides per room category and traveller tier.</p>
            </div>
            <button
              onClick={() => openModal()}
              className="px-6 py-3 rounded-full bg-nanohana text-earth font-bold hover:bg-nanohana/90 transition-all shadow-lg flex items-center gap-2"
            >
              <Plus size={18} /> Add Season
            </button>
          </div>

          {fares.length === 0 ? (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-12 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-nanohana/10 flex items-center justify-center text-nanohana mb-2">
                <Sun size={32} />
              </div>
              <h3 className="text-xl font-serif text-white">No Seasonal Fares Configured</h3>
              <p className="text-cream/60 max-w-md text-sm">
                Create seasonal date ranges to automatically adjust room category rates for high and low seasons.
              </p>
              <button
                onClick={() => openModal()}
                className="px-6 py-3 rounded-full bg-nanohana text-earth font-bold hover:bg-nanohana/90 transition-all mt-2"
              >
                Add Your First Season
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AnimatePresence>
                {fares.map((fare) => {
                  const status = getStatus(fare);
                  return (
                    <motion.div
                      key={fare.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className={`bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden ${!fare.isActive ? 'opacity-70' : ''}`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-2xl font-serif font-bold text-white mb-1">{fare.name}</h3>
                          <div className="flex items-center gap-2 text-cream/70 text-xs font-mono">
                            <CalendarRange size={14} className="text-nanohana" />
                            <span>{formatDate(fare.startDate)} → {formatDate(fare.endDate)}</span>
                            {fare.minStay && fare.minStay > 1 && (
                              <span className="ml-2 bg-nanohana/20 text-nanohana px-2 py-0.5 rounded font-sans font-bold text-[10px]">
                                Min {fare.minStay} nights
                              </span>
                            )}
                          </div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-bold border ${status.color}`}>
                          {status.label}
                        </div>
                      </div>

                      {/* Category Rates Summary Cards */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 mt-4">
                        {categories.map((cat) => {
                          const tiers = fare.categoryFares?.[cat] || [];
                          return (
                            <div key={cat} className="bg-[#1a1a1a] rounded-xl p-3 border border-white/5 space-y-1">
                              <div className="text-[10px] font-mono uppercase tracking-widest text-nanohana font-bold">{cat}</div>
                              {Array.isArray(tiers) && tiers.length > 0 ? (
                                tiers.map((t, idx) => (
                                  <div key={idx} className="flex justify-between items-baseline text-xs">
                                    <span className="text-cream/50 text-[10px] truncate max-w-[80px]">{t.label}:</span>
                                    <span className="font-bold text-white">{t.price}</span>
                                  </div>
                                ))
                              ) : (
                                <div className="text-xs text-cream/40 italic">No rates</div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      <div className="flex justify-between items-center pt-4 border-t border-white/10">
                        <button
                          onClick={() => handleToggleSeasonActive(fare)}
                          className="flex items-center gap-2 text-xs font-medium text-cream/80 hover:text-white transition-colors"
                        >
                          {fare.isActive ? (
                            <ToggleRight size={22} className="text-nanohana" />
                          ) : (
                            <ToggleLeft size={22} className="text-cream/40" />
                          )}
                          <span>{fare.isActive ? 'Active' : 'Disabled'}</span>
                        </button>
                        <div className="flex gap-2">
                          <button
                            onClick={() => openModal(fare)}
                            className="p-2 rounded-lg bg-white/5 text-white hover:bg-white/10 transition-colors"
                            title="Edit Season"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteSeason(fare.id)}
                            className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                            title="Delete Season"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 2: RATE CALENDAR VIEW ================= */}
      {activeTab === 'calendar' && (
        <div className="space-y-6 bg-earth/40 border border-white/10 rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <h2 className="text-xl font-serif font-bold text-white">Rate Inspection Matrix</h2>
              <p className="text-xs text-cream/50">View resolved effective rates per day for any category and traveller tier.</p>
            </div>

            {/* Category & Guests Selector */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase text-cream/50">Category:</span>
                <div className="flex gap-1 bg-black/40 p-1 rounded-xl border border-white/10">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCalendarCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        selectedCalendarCategory === cat ? 'bg-nanohana text-earth shadow' : 'text-cream/60 hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase text-cream/50">Guests:</span>
                <div className="flex gap-1 bg-black/40 p-1 rounded-xl border border-white/10">
                  {[1, 2, 3].map(g => (
                    <button
                      key={g}
                      onClick={() => setSelectedCalendarGuests(g)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        selectedCalendarGuests === g ? 'bg-nanohana text-earth shadow' : 'text-cream/60 hover:text-white'
                      }`}
                    >
                      {g} {g === 1 ? 'Guest' : 'Guests'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Month Navigation Bar */}
          <div className="flex items-center justify-between bg-black/40 p-4 rounded-xl border border-white/5">
            <button
              onClick={() => setCalendarMonth(new Date(calendarYear, calendarMonthIndex - 1, 1))}
              className="p-2 text-cream/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <h3 className="font-serif text-lg font-bold text-white">
              {monthNames[calendarMonthIndex]} {calendarYear}
            </h3>
            <button
              onClick={() => setCalendarMonth(new Date(calendarYear, calendarMonthIndex + 1, 1))}
              className="p-2 text-cream/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 text-xs text-cream/70 font-mono bg-white/5 p-3 rounded-xl border border-white/5">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-emerald-500/30 border border-emerald-400"></span> Seasonal Fare Rate
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-neutral-600/30 border border-neutral-500"></span> Base Room Rate (Default)
            </span>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2 text-center">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-xs font-mono uppercase tracking-widest text-cream/40 py-2">
                {day}
              </div>
            ))}

            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square bg-transparent rounded-xl" />
            ))}

            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateStr = `${calendarYear}-${String(calendarMonthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const resolved = resolveRateForDate(dateStr, selectedCalendarCategory, selectedCalendarGuests);

              let badgeStyle = 'bg-neutral-800/50 border-neutral-700 text-white';
              if (resolved.type === 'seasonal') badgeStyle = 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200';

              return (
                <div
                  key={day}
                  className={`aspect-square p-2 rounded-xl border flex flex-col justify-between items-start text-left transition-all ${badgeStyle} hover:scale-105`}
                  title={`${dateStr} — ${resolved.sourceName} (${resolved.source})`}
                >
                  <div className="flex justify-between items-center w-full">
                    <span className="text-xs font-bold opacity-80">{day}</span>
                    {resolved.minStay > 1 && (
                      <span className="text-[9px] font-mono px-1 rounded bg-black/40 text-nanohana" title={`Min Stay: ${resolved.minStay} nights`}>
                        {resolved.minStay}n
                      </span>
                    )}
                  </div>
                  <div className="w-full text-right mt-1">
                    <span className="text-sm font-bold tracking-tight text-nanohana">{resolved.price}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD / EDIT SEASON ================= */}
      <AnimatePresence>
        {isSeasonModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#1c221e] border border-white/10 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-[#1c221e]/90 backdrop-blur-md p-6 border-b border-white/10 flex justify-between items-center z-10">
                <h2 className="text-2xl font-serif font-bold text-white">
                  {editingSeason.id ? 'Edit Seasonal Fare' : 'Add New Seasonal Fare'}
                </h2>
                <button
                  onClick={() => setIsSeasonModalOpen(false)}
                  className="p-2 rounded-full hover:bg-white/10 text-cream/60 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveSeason} className="p-6 space-y-6">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-widest text-cream/50 mb-2">Season Name</label>
                  <input
                    type="text"
                    required
                    value={editingSeason.name}
                    onChange={e => setEditingSeason({ ...editingSeason, name: e.target.value })}
                    placeholder="e.g., Autumn High Season 2026"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-nanohana transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-widest text-cream/50 mb-2">Start Date</label>
                    <input
                      type="date"
                      required
                      min={todayStr}
                      value={editingSeason.startDate}
                      onChange={e => setEditingSeason({ ...editingSeason, startDate: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-nanohana transition-colors [color-scheme:dark]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-widest text-cream/50 mb-2">End Date</label>
                    <input
                      type="date"
                      required
                      min={editingSeason.startDate || todayStr}
                      value={editingSeason.endDate}
                      onChange={e => setEditingSeason({ ...editingSeason, endDate: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-nanohana transition-colors [color-scheme:dark]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-widest text-cream/50 mb-2">Min Stay (Nights)</label>
                    <input
                      type="number"
                      min={1}
                      value={editingSeason.minStay || 1}
                      onChange={e => setEditingSeason({ ...editingSeason, minStay: parseInt(e.target.value) || 1 })}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-nanohana transition-colors"
                    />
                  </div>
                </div>

                {/* Category Fare Matrix with Category Tabs & Read-Only Tier Structure */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-white/10 pb-4">
                    <label className="text-sm font-mono uppercase tracking-widest text-cream/70 flex items-center gap-2">
                      <Bed size={16} className="text-nanohana" /> Category Pricing Tiers
                    </label>

                    {/* Category Sub-Tabs */}
                    <div className="flex flex-wrap gap-1 bg-black/40 p-1 rounded-xl border border-white/10">
                      {categories.map(cat => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setModalCategoryTab(cat)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            modalCategoryTab === cat ? 'bg-nanohana text-earth shadow' : 'text-cream/60 hover:text-white'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Active Category Tiers Table */}
                  <div className="space-y-3 pt-2">
                    <div className="text-xs text-cream/50 font-mono mb-2">
                      TRAVELLER TIERS ({modalCategoryTab})
                    </div>

                    {(editingSeason.categoryFares[modalCategoryTab] || []).length === 0 ? (
                      <p className="text-sm text-cream/40 text-center py-4">No tiers defined for this category in Room Manager.</p>
                    ) : (
                      (editingSeason.categoryFares[modalCategoryTab] || []).map((tier, i) => (
                        <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-black/40 p-3 rounded-xl border border-white/5">
                          <div className="flex-1 w-full">
                            <label className="text-[10px] uppercase text-cream/40 ml-1">Dropdown Label</label>
                            <input
                              type="text"
                              disabled
                              value={tier.label}
                              className="w-full bg-white/5 border border-transparent rounded-lg px-3 py-2 text-sm text-cream/60 outline-none cursor-not-allowed opacity-80"
                            />
                          </div>
                          <div className="w-32 flex-shrink-0">
                            <label className="text-[10px] uppercase text-cream/40 ml-1">Num Guests</label>
                            <input
                              type="number"
                              disabled
                              value={tier.guests}
                              className="w-full bg-white/5 border border-transparent rounded-lg px-3 py-2 text-sm text-cream/60 outline-none cursor-not-allowed opacity-80"
                            />
                          </div>
                          <div className="w-36 flex-shrink-0">
                            <label className="text-[10px] uppercase text-nanohana font-bold ml-1">Seasonal Price</label>
                            <input
                              type="text"
                              value={tier.price}
                              onChange={e => handleUpdateTierPrice(modalCategoryTab, i, e.target.value)}
                              placeholder="$15"
                              className="w-full bg-white/5 border border-nanohana/30 focus:border-nanohana text-nanohana font-bold rounded-lg px-3 py-2 text-sm outline-none transition-colors"
                            />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsSeasonModalOpen(false)}
                    className="px-6 py-2.5 rounded-full bg-white/5 text-white font-medium hover:bg-white/10 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-2.5 rounded-full bg-nanohana text-earth font-bold hover:bg-nanohana/90 transition-all flex items-center gap-2"
                  >
                    {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} Save Season
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
