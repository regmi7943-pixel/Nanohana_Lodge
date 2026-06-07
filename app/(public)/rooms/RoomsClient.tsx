'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Sparkles,
  Maximize,
  Tv,
  Award,
  BookOpen,
  Bath,
  CheckCircle,
  Wind,
  Layers,
  ArrowRight,
  Camera,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import EditableText from '@/components/EditableText';
import EditableImage from '@/components/EditableImage';
import { motion, AnimatePresence } from 'framer-motion';
import { defaultRooms } from '@/lib/defaultRooms';

export default function RoomsClient({ content = [], editMode = false }: { content?: any[], editMode?: boolean }) {
  const getText = (key: string) => content.find((c: any) => c.key === key)?.value;

  const [activeFilter, setActiveFilter] = useState('All');
  
  // Gallery state
  const [activeGalleryRoom, setActiveGalleryRoom] = useState<any>(null);
  const [activeGalleryTab, setActiveGalleryTab] = useState('Room');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const categories = ['All', 'Economy', 'Standard', 'Deluxe'];

  const rawRooms = content.find((c: any) => c.key === 'global_rooms_list')?.value;
  let DB_ROOMS: any[] = [];
  try {
    DB_ROOMS = rawRooms ? JSON.parse(rawRooms) : defaultRooms;
  } catch(e) {
    DB_ROOMS = defaultRooms;
  }

  const getGallery = (roomId: string, defaultGallery: any[]) => {
    const raw = getText(`gallery_${roomId}`);
    if (raw) {
      try { return JSON.parse(raw); } catch (e) { return defaultGallery; }
    }
    return defaultGallery;
  };

  const filteredRooms = DB_ROOMS.map(r => ({
    ...r,
    gallery: getGallery(r.id, r.gallery)
  })).filter((room) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Economy') return room.category === 'Economy';
    if (activeFilter === 'Standard') return room.category === 'Standard';
    if (activeFilter === 'Deluxe') return room.category === 'Deluxe';
    if (activeFilter === 'Mountain View') return room.view === 'Mountain View' || room.view === 'Mountain view';
    return true;
  });

  const openGallery = (room: any) => {
    setActiveGalleryRoom(room);
    setActiveGalleryTab('Room');
    setCurrentImageIndex(0);
  };

  const closeGallery = () => {
    setActiveGalleryRoom(null);
  };

  const getFilteredGalleryImages = () => {
    if (!activeGalleryRoom) return [];
    return activeGalleryRoom.gallery.filter((img: any) => img.category === activeGalleryTab);
  };

  const handleNextImage = () => {
    const images = getFilteredGalleryImages();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = () => {
    const images = getFilteredGalleryImages();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div id="rooms-page" className="w-full">
      {/* GALLERY MODAL */}
      <AnimatePresence>
        {activeGalleryRoom && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex flex-col"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div>
                <h3 className="text-white font-serif text-2xl">{activeGalleryRoom.name}</h3>
                <p className="text-white/50 text-sm font-mono mt-1">Photo Gallery</p>
              </div>
              <button
                onClick={closeGallery}
                className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-white/80 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Gallery Tabs */}
            <div className="flex justify-center gap-4 py-4 border-b border-white/10">
              {['Room', 'Washroom', 'View'].map((tab) => {
                const count = activeGalleryRoom.gallery.filter((img: any) => img.category === tab).length;
                if (count === 0) return null;
                return (
                  <button
                    key={tab}
                    onClick={() => { setActiveGalleryTab(tab); setCurrentImageIndex(0); }}
                    className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
                      activeGalleryTab === tab
                        ? 'bg-nanohana text-earth'
                        : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {tab} ({count})
                  </button>
                );
              })}
            </div>

            {/* Main Image View */}
            <div className="flex-1 relative flex items-center justify-center p-4 sm:p-10">
              {getFilteredGalleryImages().length > 0 ? (
                <>
                  <button onClick={handlePrevImage} className="absolute left-4 sm:left-10 p-3 bg-black/50 text-white rounded-full hover:bg-nanohana hover:text-earth transition-all z-10">
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <div className="relative w-full max-w-5xl h-full max-h-[70vh] rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10">
                    <Image
                      src={getFilteredGalleryImages()[currentImageIndex]?.url}
                      alt={`${activeGalleryTab} view`}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <button onClick={handleNextImage} className="absolute right-4 sm:right-10 p-3 bg-black/50 text-white rounded-full hover:bg-nanohana hover:text-earth transition-all z-10">
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              ) : (
                <div className="text-white/50 font-mono">No images available for this section.</div>
              )}
            </div>

            {/* Thumbnail Strip */}
            <div className="h-24 sm:h-32 p-4 flex justify-center gap-3 overflow-x-auto border-t border-white/10">
              {getFilteredGalleryImages().map((img: any, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`relative h-full aspect-video rounded-md overflow-hidden ring-2 transition-all ${
                    currentImageIndex === idx ? 'ring-nanohana opacity-100' : 'ring-transparent opacity-50 hover:opacity-100'
                  }`}
                >
                  <Image src={img.url} alt="thumbnail" fill className="object-cover" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <section id="rooms-hero" className="relative h-[55vh] min-h-[380px] w-full flex items-center justify-center">
        <EditableImage page="rooms" contentKey="rooms_hero_bg" defaultSrc="https://picsum.photos/seed/nanohanadeluxe/1600/900" currentSrc={getText('rooms_hero_bg')} editMode={editMode} alt="Mountain view from terrace" fill priority className="object-cover" referrerPolicy="no-referrer" />
        <div className="absolute inset-0 bg-forest/50 mix-blend-multiply pointer-events-none" />
        <div className="relative z-10 text-center px-5 text-cream max-w-[800px] pt-16">
          <EditableText as="span" page="rooms" contentKey="rooms_hero_eyebrow" defaultText="Rooms & Suites" currentText={getText('rooms_hero_eyebrow')} editMode={editMode} className="text-xs font-mono uppercase tracking-[0.2em] text-cream/70 block mb-2" />
          <EditableText as="h1" page="rooms" contentKey="rooms_hero_title" defaultText="Your room. Your mountain view." currentText={getText('rooms_hero_title')} editMode={editMode} className="font-serif text-4xl sm:text-5xl font-medium tracking-tight mb-4" />
          <EditableText as="p" page="rooms" contentKey="rooms_hero_desc" defaultText="17 rooms spread across three floors. Every level features its own communal flower balcony and unobstructed Annapurna views, starting from just $12/night." currentText={getText('rooms_hero_desc')} editMode={editMode} className="text-cream/90 text-sm sm:text-base max-w-[550px] mx-auto leading-relaxed" />
        </div>
      </section>

      <section id="filter-bar" className="sticky top-[73px] z-30 bg-cream border-y border-earth/10 shadow-sm">
        <div className="max-w-[1240px] mx-auto px-5 md:px-10 lg:px-20 py-4 flex items-center justify-center sm:justify-start gap-2 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-5 py-2 rounded-full font-sans text-xs tracking-wide uppercase font-semibold transition-all ${
                activeFilter === cat ? 'bg-nanohana text-earth shadow' : 'text-earth/70 hover:text-earth hover:bg-earth/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      <section id="room-listings" className="bg-cream py-16 text-earth">
        <div className="max-w-[1240px] mx-auto px-5 md:px-10 lg:px-20 space-y-16">
          {filteredRooms.length === 0 ? (
            <div className="text-center py-12">
              <p className="font-serif text-lg text-earth/70">No rooms match this active filter. See our full collection by tapping another tab.</p>
            </div>
          ) : (
            filteredRooms.map((room, index) => (
              <div key={room.id} id={`room-card-${index}`} className="flex flex-col-reverse lg:grid lg:grid-cols-12 rounded-2xl overflow-hidden border border-earth/10 bg-cream/50 hover:shadow-lg transition-all">
                <div className={`lg:col-span-7 p-6 sm:p-12 flex flex-col justify-between space-y-6 ${index % 2 === 1 ? 'lg:order-last' : ''}`}>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-4">
                      <EditableText as="span" page="rooms" contentKey={`room_${room.id}_category`} defaultText={room.category} currentText={getText(`room_${room.id}_category`)} editMode={editMode} className="text-xs font-mono uppercase tracking-widest text-phewa font-bold" />
                      {room.popular && (
                        <span className="px-3 py-1 rounded bg-forest text-cream font-sans font-semibold text-[10px] uppercase tracking-wide flex items-center gap-1">
                          <Award className="w-3 h-3" /> Most Popular
                        </span>
                      )}
                    </div>
                    <EditableText as="h3" page="rooms" contentKey={`room_${room.id}_name`} defaultText={room.name} currentText={getText(`room_${room.id}_name`)} editMode={editMode} className="font-serif text-2xl sm:text-3xl text-earth font-medium leading-tight" />
                    <EditableText as="p" page="rooms" contentKey={`room_${room.id}_desc`} defaultText={room.desc} currentText={getText(`room_${room.id}_desc`)} editMode={editMode} className="text-earth/85 text-sm leading-relaxed" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 pt-4 border-t border-earth/10 text-xs text-earth/80">
                      {room.features.map((feat: string, i: number) => (
                        <div key={i} className={`flex items-center gap-2 ${i > 2 ? 'hidden sm:flex' : ''}`}>
                          <CheckCircle className="w-3.5 h-3.5 text-phewa flex-shrink-0" />
                          <EditableText as="span" page="rooms" contentKey={`room_${room.id}_feat_${i}`} defaultText={feat} currentText={getText(`room_${room.id}_feat_${i}`)} editMode={editMode} />
                        </div>
                      ))}
                    </div>
                    <div className="hidden sm:flex flex-wrap gap-1.5 pt-4">
                      {room.amenities.map((amenity: string, i: number) => (
                        <EditableText as="span" page="rooms" contentKey={`room_${room.id}_amenity_${i}`} defaultText={amenity} currentText={getText(`room_${room.id}_amenity_${i}`)} editMode={editMode} key={i} className="px-2.5 py-1 rounded-full bg-sage/10 text-[10px] font-mono font-medium text-earth/80" />
                      ))}
                    </div>
                  </div>
                  <div className="pt-6 border-t border-earth/10 flex items-center justify-between gap-4">
                    <div>
                      <EditableText as="span" page="rooms" contentKey="rooms_starting_rate_lbl" defaultText="Starting Rate" currentText={getText('rooms_starting_rate_lbl')} editMode={editMode} className="text-xs text-earth/60 font-mono block" />
                      <div className="text-2xl font-serif text-nanohana font-bold flex items-baseline gap-1">
                        <EditableText as="span" page="rooms" contentKey={`room_${room.id}_price`} defaultText={room.price} currentText={getText(`room_${room.id}_price`)} editMode={editMode} />
                        <EditableText as="span" page="rooms" contentKey="rooms_per_night" defaultText="/ night" currentText={getText('rooms_per_night')} editMode={editMode} className="text-xs text-earth/80 font-normal" />
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Link href="/reservations" className="px-6 py-2.5 rounded-full bg-nanohana text-earth font-sans text-xs font-semibold hover:bg-nanohana/90 transition-colors shadow-sm">Book now</Link>
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-5 relative min-h-[250px] lg:min-h-auto w-full group overflow-hidden">
                  <Image src={room.image} alt={room.name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 pointer-events-none" />
                  <button 
                    onClick={() => openGallery(room)} 
                    className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md text-earth px-4 py-2.5 rounded-full flex items-center gap-2 shadow-lg hover:bg-nanohana hover:text-earth transition-all transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 font-semibold text-xs"
                  >
                    <Camera className="w-4 h-4" /> See all images
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <section id="room-policies" className="bg-cream py-16 border-t border-earth/5">
        <div className="max-w-[1240px] mx-auto px-5 md:px-10 lg:px-20">
          <div className="p-8 sm:p-12 background rounded-2xl border border-earth/10 bg-earth/5 grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <EditableText as="h3" page="rooms" contentKey="rooms_policies_title" defaultText="Stay Rules & Details" currentText={getText('rooms_policies_title')} editMode={editMode} className="font-serif text-xl font-bold mb-6 text-earth border-b border-earth/10 pb-3 flex items-center gap-2" />
              <ul className="space-y-4 text-sm list-none my-0 pl-0 text-earth/80">
                <li className="flex justify-between border-b border-earth/5 pb-2">
                  <EditableText as="span" page="rooms" contentKey="policy1_k" defaultText="Check-in hour" currentText={getText('policy1_k')} editMode={editMode} className="font-medium" />
                  <EditableText as="span" page="rooms" contentKey="policy1_v" defaultText="From 6:00 AM (early front desk coverage)" currentText={getText('policy1_v')} editMode={editMode} />
                </li>
                <li className="flex justify-between border-b border-earth/5 pb-2">
                  <EditableText as="span" page="rooms" contentKey="policy2_k" defaultText="Check-out hour" currentText={getText('policy2_k')} editMode={editMode} className="font-medium" />
                  <EditableText as="span" page="rooms" contentKey="policy2_v" defaultText="Before 12:00 noon" currentText={getText('policy2_v')} editMode={editMode} />
                </li>
                <li className="flex justify-between border-b border-earth/5 pb-2">
                  <EditableText as="span" page="rooms" contentKey="policy3_k" defaultText="Minimum Age requirement" currentText={getText('policy3_k')} editMode={editMode} className="font-medium" />
                  <EditableText as="span" page="rooms" contentKey="policy3_v" defaultText="At least 16 years old to book separately" currentText={getText('policy3_v')} editMode={editMode} />
                </li>
                <li className="flex justify-between border-b border-earth/5 pb-2">
                  <EditableText as="span" page="rooms" contentKey="policy4_k" defaultText="Pet policy" currentText={getText('policy4_k')} editMode={editMode} className="font-medium" />
                  <EditableText as="span" page="rooms" contentKey="policy4_v" defaultText="Strictly not permitted (eco-garden protection)" currentText={getText('policy4_v')} editMode={editMode} />
                </li>
                <li className="flex justify-between border-b border-earth/5 pb-2">
                  <EditableText as="span" page="rooms" contentKey="policy5_k" defaultText="In-room Smoking" currentText={getText('policy5_k')} editMode={editMode} className="font-medium" />
                  <EditableText as="span" page="rooms" contentKey="policy5_v" defaultText="Non-smoking rooms (smoking permitted on communal balconies only)" currentText={getText('policy5_v')} editMode={editMode} />
                </li>
              </ul>
            </div>
            <div>
              <EditableText as="h3" page="rooms" contentKey="rooms_family_title" defaultText="Family & Additional Terms" currentText={getText('rooms_family_title')} editMode={editMode} className="font-serif text-xl font-bold mb-6 text-earth border-b border-earth/10 pb-3 flex items-center gap-2" />
              <ul className="space-y-4 text-sm list-none my-0 pl-0 text-earth/80">
                <li className="flex justify-between border-b border-earth/5 pb-2">
                  <EditableText as="span" page="rooms" contentKey="term1_k" defaultText="Children stay policy" currentText={getText('term1_k')} editMode={editMode} className="font-medium" />
                  <EditableText as="span" page="rooms" contentKey="term1_v" defaultText="All ages welcome; Children 0-8 stay free using existing beds" currentText={getText('term1_v')} editMode={editMode} />
                </li>
                <li className="flex justify-between border-b border-earth/5 pb-2">
                  <EditableText as="span" page="rooms" contentKey="term2_k" defaultText="Extra Rollaways" currentText={getText('term2_k')} editMode={editMode} className="font-medium" />
                  <EditableText as="span" page="rooms" contentKey="term2_v" defaultText="Maximum 1 extra bed permitted per room (by request)" currentText={getText('term2_v')} editMode={editMode} />
                </li>
                <li className="flex justify-between border-b border-earth/5 pb-2">
                  <EditableText as="span" page="rooms" contentKey="term3_k" defaultText="Cribs / Baby cots" currentText={getText('term3_k')} editMode={editMode} className="font-medium" />
                  <EditableText as="span" page="rooms" contentKey="term3_v" defaultText="Unfortunately not available at the lodge" currentText={getText('term3_v')} editMode={editMode} />
                </li>
                <li className="flex justify-between border-b border-earth/5 pb-2">
                  <EditableText as="span" page="rooms" contentKey="term4_k" defaultText="Languages Spoken at desk" currentText={getText('term4_k')} editMode={editMode} className="font-medium" />
                  <EditableText as="span" page="rooms" contentKey="term4_v" defaultText="English, Hindi, Nepali, Japanese" currentText={getText('term4_v')} editMode={editMode} />
                </li>
                <li className="flex justify-between border-b border-earth/5 pb-2">
                  <EditableText as="span" page="rooms" contentKey="term5_k" defaultText="Airport Transfer Shuttle" currentText={getText('term5_k')} editMode={editMode} className="font-medium" />
                  <EditableText as="span" page="rooms" contentKey="term5_v" defaultText="Paid shuttle available (highly recommended to notify in advance)" currentText={getText('term5_v')} editMode={editMode} />
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="reservations-partners" className="bg-forest text-cream py-16 text-center">
        <div className="max-w-[800px] mx-auto px-5 space-y-6">
          <EditableText as="h2" page="rooms" contentKey="rooms_cta_title" defaultText="Found your room? Lock in your rate." currentText={getText('rooms_cta_title')} editMode={editMode} className="font-serif text-3xl sm:text-4xl font-medium" />
          <EditableText as="p" page="rooms" contentKey="rooms_cta_desc" defaultText="We are proud partners on major booking engines. However, booking direct on this official site guarantees you the absolute cheapest rate, flexible support, and no third-party hidden fees." currentText={getText('rooms_cta_desc')} editMode={editMode} className="text-cream/80 max-w-[550px] mx-auto text-sm leading-relaxed" />
          <div className="flex flex-wrap justify-center items-center gap-4 py-6 border-y border-white/10 text-stone text-[10px] md:text-xs font-mono">
            <span>BOOKING.COM</span>
            <span>AGODA</span>
            <span className="hidden sm:inline">EXPEDIA</span>
            <span className="hidden sm:inline">KAYAK</span>
            <span className="hidden sm:inline">HOTELS.COM</span>
            <span>TRIPADVISOR</span>
          </div>
          <div className="pt-4">
            <Link href="/reservations" className="px-8 py-3.5 bg-nanohana text-earth font-sans text-sm font-semibold rounded-full hover:bg-nanohana/90 hover:scale-105 active:scale-95 transition-all inline-block shadow-md">Book Direct With Us Now</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
