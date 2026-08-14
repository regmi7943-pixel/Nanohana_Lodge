'use client';

import React, { useState, useRef } from 'react';
import { Bed, Plus, Trash2, Save, UploadCloud, X, Edit, Loader2, Star, CheckCircle, ChevronDown, Settings, Sparkles } from 'lucide-react';
import { defaultRooms } from '@/lib/defaultRooms';
import { updateContent } from '@/app/actions/updateContent';
import { uploadImage } from '@/app/actions/uploadImage';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import toast from 'react-hot-toast';

function AdminDropdown({ label, value, onChange, options }: { label: string; value: string; onChange: (val: string) => void; options: { value: string; label: string }[] }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  const selectedLabel = options.find(o => o.value === value)?.label || value;

  React.useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <label className="block text-xs font-mono uppercase tracking-widest text-cream/50 mb-2">{label}</label>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full bg-black/40 border rounded-xl px-4 py-3 text-left text-white flex items-center justify-between gap-2 transition-all ${
          open ? 'border-nanohana ring-1 ring-nanohana/30' : 'border-white/10 hover:border-white/25'
        }`}
      >
        <span>{selectedLabel}</span>
        <ChevronDown className={`w-4 h-4 text-cream/40 transition-transform duration-200 ${open ? 'rotate-180 text-nanohana' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 mt-2 w-full bg-[#1a1f16] border border-white/10 rounded-xl shadow-2xl overflow-hidden"
          >
            {options.map((opt) => (
              <li key={opt.value}>
                <button
                  type="button"
                  onClick={() => { onChange(opt.value); setOpen(false); }}
                  className={`w-full text-left px-4 py-3 text-sm transition-all flex items-center justify-between ${
                    value === opt.value
                      ? 'bg-nanohana/15 text-nanohana font-semibold'
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span>{opt.label}</span>
                  {value === opt.value && <CheckCircle className="w-4 h-4 text-nanohana" />}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function RoomsManagerClient({ content = [] }: { content?: any[] }) {
  const [rooms, setRooms] = useState<any[]>(() => {
    const rawRooms = content.find((c: any) => c.key === 'global_rooms_list')?.value;
    try {
      return rawRooms ? JSON.parse(rawRooms) : defaultRooms;
    } catch(e) {
      return defaultRooms;
    }
  });
  const [editingRoom, setEditingRoom] = useState<any | null>(null);
  const [pricingRoom, setPricingRoom] = useState<any | null>(null);

  // Parse seasonal fares from global content to display in dynamic pricing modal
  const seasonalFares = React.useMemo(() => {
    try {
      const raw = content.find((c: any) => c.key === 'seasonal_fares')?.value;
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed.filter((s: any) => s.isActive);
      }
    } catch (e) {}
    return [];
  }, [content]);

  // Compute active seasons covering current room category
  const activeSeasonsForRoomCategory = React.useMemo(() => {
    if (!pricingRoom || seasonalFares.length === 0) return [];
    const cat = pricingRoom.category || 'Standard';
    return seasonalFares.filter((s: any) => {
      return s.categoryFares && s.categoryFares[cat] && Array.isArray(s.categoryFares[cat]) && s.categoryFares[cat].length > 0;
    });
  }, [pricingRoom, seasonalFares]);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const saveToDb = async (updatedRooms: any[]) => {
    setIsSaving(true);
    await updateContent('global', 'global_rooms_list', JSON.stringify(updatedRooms));
    setRooms(updatedRooms);
    setIsSaving(false);
  };

  const handleAddNewRoom = () => {
    const newRoom = {
      id: `room-${Date.now()}`,
      name: 'New Room',
      price: '$0',
      category: 'Standard',
      view: 'Garden',
      desc: 'Room description here...',
      image: '/story_home.jpg',
      features: ['15 m² Area', '1 Double Bed'],
      amenities: ['Free WiFi'],
      popular: false,
      gallery: []
    };
    const updated = [...rooms, newRoom];
    saveToDb(updated);
    setEditingRoom(newRoom);
  };

  const handleDeleteRoom = (id: string) => {
    if (confirm('Are you sure you want to delete this room? This action cannot be undone.')) {
      const updated = rooms.filter(r => r.id !== id);
      saveToDb(updated);
      if (editingRoom?.id === id) setEditingRoom(null);
      toast.success('Room deleted');
    }
  };

  const handleSaveRoomDetails = () => {
    if (!editingRoom) return;
    const updated = rooms.map(r => r.id === editingRoom.id ? editingRoom : r);
    saveToDb(updated);
    setEditingRoom(null);
    toast.success('Room saved successfully!');
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingRoom) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    const result = await uploadImage(formData);
    
    if (result.success && result.url) {
      setEditingRoom({ ...editingRoom, image: result.url });
    } else {
      alert(result.error || 'Failed to upload image');
    }
    setIsUploading(false);
  };

  const handleArrayChange = (field: 'features' | 'amenities', index: number, value: string) => {
    const newArray = [...editingRoom[field]];
    newArray[index] = value;
    setEditingRoom({ ...editingRoom, [field]: newArray });
  };

  const addArrayItem = (field: 'features' | 'amenities') => {
    setEditingRoom({ ...editingRoom, [field]: [...editingRoom[field], 'New Item'] });
  };

  const removeArrayItem = (field: 'features' | 'amenities', index: number) => {
    const newArray = editingRoom[field].filter((_: any, i: number) => i !== index);
    setEditingRoom({ ...editingRoom, [field]: newArray });
  };

  const handleOpenPricing = (room: any) => {
    if (!room.pricingConfig || room.pricingConfig.length === 0) {
      let defaultTiers = [];
      if (room.category === 'Economy') {
        defaultTiers = [
          { label: '1 Adult', guests: 1, price: room.price },
          { label: '2 Adults', guests: 2, price: room.price }
        ];
      } else {
        defaultTiers = [
          { label: '1 Adult', guests: 1, price: room.price },
          { label: '2 Adults', guests: 2, price: room.price },
          { label: '3 Adults / Family', guests: 3, price: room.price }
        ];
      }
      setPricingRoom({ ...room, pricingConfig: defaultTiers });
    } else {
      setPricingRoom(room);
    }
  };

  const handleAddPricingTier = () => {
    const currentConfig = pricingRoom.pricingConfig || [];
    let nextGuest = 1;
    let nextPrice = '$12';
    
    if (currentConfig.length > 0) {
      const lastTier = currentConfig[currentConfig.length - 1];
      nextGuest = (Number(lastTier.guests) || 0) + 1;
      nextPrice = lastTier.price;
    }

    const newTier = { guests: nextGuest, label: `${nextGuest} Adult${nextGuest > 1 ? 's' : ''}`, price: nextPrice };
    const newConfig = [...currentConfig, newTier];
    setPricingRoom({ ...pricingRoom, pricingConfig: newConfig });
  };

  const handleUpdatePricingTier = (index: number, field: string, value: any) => {
    const newConfig = [...(pricingRoom.pricingConfig || [])];
    newConfig[index] = { ...newConfig[index], [field]: value };
    setPricingRoom({ ...pricingRoom, pricingConfig: newConfig });
  };

  const handleRemovePricingTier = (index: number) => {
    const newConfig = pricingRoom.pricingConfig.filter((_: any, i: number) => i !== index);
    setPricingRoom({ ...pricingRoom, pricingConfig: newConfig });
  };

  const handleSavePricing = () => {
    const updated = rooms.map(r => r.id === pricingRoom.id ? pricingRoom : r);
    saveToDb(updated);
    setPricingRoom(null);
    toast.success('Pricing saved successfully!');
  };

  return (
    <div className="max-w-6xl space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-white mb-2">Room Manager</h1>
          <p className="text-cream/60">Add, edit, or delete the rooms displayed on your site.</p>
        </div>
        <button
          onClick={handleAddNewRoom}
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-nanohana text-earth font-bold hover:bg-nanohana/90 transition-all shadow-lg"
        >
          <Plus className="w-5 h-5" /> Add New Room
        </button>
      </div>

      {editingRoom ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/5 border border-white/10 rounded-2xl p-6 lg:p-10">
          <form onSubmit={(e) => { e.preventDefault(); handleSaveRoomDetails(); }} className="space-y-8">
          <div className="flex items-center justify-between border-b border-white/10 pb-6">
            <h2 className="text-2xl font-serif font-bold text-nanohana flex items-center gap-3">
              <Edit className="w-6 h-6 text-white/50" /> Edit Room Details
            </h2>
            <button onClick={() => setEditingRoom(null)} className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-white/60 hover:text-white transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Col - Main Info */}
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-cream/50 mb-2">Room Name</label>
                <input type="text" value={editingRoom.name} onChange={e => setEditingRoom({...editingRoom, name: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-nanohana transition-colors" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-widest text-cream/50 mb-2">Price per night</label>
                  <input type="text" value={editingRoom.price} onChange={e => setEditingRoom({...editingRoom, price: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-nanohana font-bold focus:outline-none focus:border-nanohana transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-widest text-cream/50 mb-2">Popular Badge</label>
                  <button
                    onClick={() => setEditingRoom({...editingRoom, popular: !editingRoom.popular})}
                    className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 border transition-all ${editingRoom.popular ? 'bg-forest text-cream border-forest' : 'bg-black/40 text-cream/40 border-white/10 hover:border-white/30'}`}
                  >
                    <Star className={`w-5 h-5 ${editingRoom.popular ? 'fill-nanohana text-nanohana' : ''}`} /> {editingRoom.popular ? 'Most Popular' : 'Normal'}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <AdminDropdown
                  label="Category Filter"
                  value={editingRoom.category}
                  onChange={(val) => setEditingRoom({...editingRoom, category: val})}
                  options={[
                    { value: 'Economy', label: 'Economy' },
                    { value: 'Standard', label: 'Standard' },
                    { value: 'Deluxe', label: 'Deluxe' },
                  ]}
                />
                <AdminDropdown
                  label="View Filter"
                  value={editingRoom.view}
                  onChange={(val) => setEditingRoom({...editingRoom, view: val})}
                  options={[
                    { value: 'Garden', label: 'Garden View' },
                    { value: 'Mountain View', label: 'Mountain View' },
                  ]}
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-cream/50 mb-2">Description</label>
                <textarea value={editingRoom.desc} onChange={e => setEditingRoom({...editingRoom, desc: e.target.value})} rows={4} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-nanohana transition-colors" />
              </div>
            </div>

            {/* Right Col - Image & Lists */}
            <div className="space-y-8">
              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-cream/50 mb-2">Main Cover Photo</label>
                <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10 bg-black/40 group">
                  <Image src={editingRoom.image} alt="Room cover" fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="px-6 py-3 bg-nanohana text-earth font-bold rounded-full flex items-center gap-2 shadow-xl hover:scale-105 transition-transform">
                      {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <UploadCloud className="w-5 h-5" />} Change Cover
                    </button>
                  </div>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center justify-between text-xs font-mono uppercase tracking-widest text-cream/50 mb-3">
                    Features <button type="button" onClick={() => addArrayItem('features')} className="text-nanohana hover:text-white flex items-center"><Plus className="w-4 h-4" /> Add</button>
                  </label>
                  <div className="space-y-2">
                    {editingRoom.features.map((feat: string, i: number) => (
                      <div key={`feat-${i}`} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-phewa flex-shrink-0" />
                        <input type="text" value={feat} onChange={e => handleArrayChange('features', i, e.target.value)} className="flex-1 bg-black/40 border border-transparent hover:border-white/10 focus:border-nanohana rounded px-2 py-1.5 text-sm text-white transition-colors outline-none" />
                        <button type="button" onClick={() => removeArrayItem('features', i)} className="text-red-400 hover:bg-red-400/20 p-1.5 rounded"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-mono uppercase tracking-widest text-cream/50 mb-3">
                    Amenities <button type="button" onClick={() => addArrayItem('amenities')} className="text-nanohana hover:text-white flex items-center"><Plus className="w-4 h-4" /> Add</button>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {editingRoom.amenities.map((amenity: string, i: number) => (
                      <div key={`amenity-${i}`} className="flex items-center gap-1 bg-sage/20 border border-sage/30 rounded-full pl-3 pr-1 py-1 text-xs text-white">
                        <input type="text" value={amenity} onChange={e => handleArrayChange('amenities', i, e.target.value)} className="bg-transparent border-none outline-none w-20 focus:w-32 transition-all placeholder-white/30" />
                        <button type="button" onClick={() => removeArrayItem('amenities', i)} className="text-red-400 hover:text-white p-1 rounded-full"><X className="w-3.5 h-3.5" /></button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex justify-end">
            <button type="submit" disabled={isSaving} className="px-8 py-4 rounded-full bg-nanohana text-earth font-bold text-lg hover:bg-nanohana/90 transition-all flex items-center gap-2 shadow-xl hover:scale-105 disabled:opacity-50">
              {isSaving ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />} {isSaving ? 'Saving...' : 'Save All Changes'}
            </button>
          </div>
          </form>
        </motion.div>
      ) : rooms.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white/5 border border-white/10 rounded-2xl">
          <Bed className="w-16 h-16 text-cream/20 mb-4" />
          <h3 className="text-xl font-serif text-white mb-2">No Rooms Found</h3>
          <p className="text-cream/50 mb-6">You haven't added any rooms yet.</p>
          <button onClick={handleAddNewRoom} className="flex items-center gap-2 px-6 py-3 rounded-full bg-nanohana text-earth font-bold hover:bg-nanohana/90 transition-all shadow-lg">
            <Plus className="w-5 h-5" /> Add Your First Room
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          <AnimatePresence>
            {rooms.map((room) => (
              <motion.div key={room.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-nanohana/50 transition-all group">
                <div className="relative h-48 w-full bg-black/40">
                  <Image src={room.image} alt={room.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  
                  {/* Settings Gear Icon in Top Right */}
                  <button 
                    onClick={() => handleOpenPricing(room)} 
                    className="absolute z-10 top-3 right-3 p-2 bg-black/60 backdrop-blur-md hover:bg-nanohana text-white hover:text-earth rounded-full transition-all shadow-lg"
                    title="Manage Dynamic Pricing"
                  >
                    <Settings className="w-4 h-4" />
                  </button>

                  {room.popular && (
                    <div className="absolute top-3 right-12 bg-forest text-cream text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg">
                      <Star className="w-3 h-3 fill-nanohana text-nanohana" /> Popular
                    </div>
                  )}
                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] uppercase font-mono px-3 py-1.5 rounded-full border border-white/10">
                    {room.category}
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="font-serif text-xl font-bold text-white leading-tight">{room.name}</h3>
                    <div className="text-right flex-shrink-0">
                      <span className="text-sm font-mono text-white/50 block">From</span>
                      <span className="font-bold text-nanohana">{(room.pricingConfig && room.pricingConfig.length > 0) ? `$${Math.min(...room.pricingConfig.map((t: any) => parseInt(t.price.replace(/[^0-9.]/g, '')) || 0))}` : room.price}</span>
                    </div>
                  </div>
                  <p className="text-xs text-white/60 line-clamp-2 mb-6">{room.desc}</p>
                  
                  <div className="flex items-center gap-2 pt-4 border-t border-white/10">
                    <button onClick={() => setEditingRoom(room)} className="flex-1 py-2.5 bg-white/10 hover:bg-nanohana hover:text-earth text-white text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-2">
                      <Edit className="w-4 h-4" /> Edit Room
                    </button>
                    <button onClick={() => handleDeleteRoom(room.id)} className="p-2.5 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-xl transition-colors" title="Delete Room">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Pricing Config Modal */}
      <AnimatePresence>
        {pricingRoom && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl bg-[#1a1f16] border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-serif font-bold text-white">Dynamic Pricing</h3>
                  <p className="text-cream/60 text-sm">Set prices based on traveller count for {pricingRoom.name}</p>
                </div>
                <button onClick={() => setPricingRoom(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/60">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {activeSeasonsForRoomCategory.length > 0 && (
                  <div className="bg-nanohana/15 border border-nanohana/30 rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-white">
                    <div className="flex items-center gap-2 font-medium">
                      <Sparkles className="w-4 h-4 text-nanohana flex-shrink-0" />
                      <span><strong>Seasonal Fare Applied:</strong> {activeSeasonsForRoomCategory.map((s: any) => s.name).join(', ')}</span>
                    </div>
                    <span className="font-mono text-nanohana font-semibold text-[11px] bg-black/40 px-2.5 py-1 rounded-lg border border-nanohana/20">
                      {activeSeasonsForRoomCategory.map((s: any) => `${s.startDate} → ${s.endDate}`).join(', ')}
                    </span>
                  </div>
                )}

                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-sm font-mono uppercase tracking-widest text-cream/70">Traveller Tiers</label>
                    <button onClick={handleAddPricingTier} className="text-xs flex items-center gap-1 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-full transition-colors">
                      <Plus className="w-3 h-3" /> Add Tier
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {(!pricingRoom.pricingConfig || pricingRoom.pricingConfig.length === 0) && (
                      <p className="text-sm text-cream/40 text-center py-4">No dynamic pricing tiers set. The room will use the default base price.</p>
                    )}
                    {(pricingRoom.pricingConfig || []).map((tier: any, i: number) => {
                      const seasonalOverridesForTier = activeSeasonsForRoomCategory.map((season: any) => {
                        const catTiers = season.categoryFares?.[pricingRoom.category] || [];
                        const match = catTiers.find((t: any) => Number(t.guests) === Number(tier.guests));
                        if (match && match.price) {
                          return {
                            seasonName: season.name,
                            price: match.price,
                            startDate: season.startDate,
                            endDate: season.endDate
                          };
                        }
                        return null;
                      }).filter(Boolean);

                      return (
                        <div key={i} className="flex flex-col bg-black/40 p-3.5 rounded-xl border border-white/5 space-y-2">
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                            <div className="flex-1 w-full">
                              <label className="text-[10px] uppercase text-cream/40 ml-1">Dropdown Label</label>
                              <input type="text" value={tier.label} onChange={e => handleUpdatePricingTier(i, 'label', e.target.value)} placeholder="e.g. 1 Adult" className="w-full bg-white/5 border border-transparent hover:border-white/10 focus:border-nanohana rounded-lg px-3 py-2 text-sm text-white outline-none" />
                            </div>
                            <div className="w-28 flex-shrink-0">
                              <label className="text-[10px] uppercase text-cream/40 ml-1" title="Used to calculate booking costs behind the scenes">Num Guests</label>
                              <input type="number" value={tier.guests || ''} onChange={e => handleUpdatePricingTier(i, 'guests', e.target.value ? parseInt(e.target.value) : '')} placeholder="1" className="w-full bg-white/5 border border-transparent hover:border-white/10 focus:border-nanohana rounded-lg px-3 py-2 text-sm text-white outline-none" title="Used to calculate booking costs behind the scenes" />
                            </div>
                            <div className="w-28 flex-shrink-0">
                              <label className="text-[10px] uppercase text-cream/40 ml-1">Base Price</label>
                              <input type="text" value={tier.price} onChange={e => handleUpdatePricingTier(i, 'price', e.target.value)} placeholder="$12" className="w-full bg-white/5 border border-transparent hover:border-white/10 focus:border-nanohana text-white font-bold rounded-lg px-3 py-2 text-sm outline-none" />
                            </div>
                            <button onClick={() => handleRemovePricingTier(i)} className="mt-4 sm:mt-5 p-2 text-red-400 hover:bg-red-400/20 rounded-lg transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          {seasonalOverridesForTier.length > 0 && (
                            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-white/5">
                              {seasonalOverridesForTier.map((sp: any, idx: number) => (
                                <span key={idx} className="text-xs font-sans bg-nanohana/15 text-nanohana border border-nanohana/30 px-3 py-1 rounded-lg flex items-center gap-1.5">
                                  <Sparkles className="w-3.5 h-3.5 text-nanohana" />
                                  <span>Active Season Rate: <strong>{sp.price}</strong> ({sp.seasonName})</span>
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-white/10 bg-black/20 flex justify-end gap-3">
                <button onClick={() => setPricingRoom(null)} className="px-6 py-2.5 rounded-xl font-bold text-white/70 hover:text-white hover:bg-white/5 transition-colors">
                  Cancel
                </button>
                <button onClick={handleSavePricing} disabled={isSaving} className="px-6 py-2.5 rounded-xl font-bold bg-nanohana text-earth hover:bg-nanohana/90 flex items-center gap-2 transition-all">
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Pricing
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
