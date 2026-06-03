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
  ArrowRight
} from 'lucide-react';

export default function RoomsPage() {
  const [activeFilter, setActiveFilter] = useState('All');

  const categories = ['All', 'Standard', 'Deluxe & Terrace', 'Mountain view'];

  const rooms = [
    {
      id: 'room-1',
      price: '$12',
      category: 'Standard',
      view: 'Garden',
      name: 'Standard Room',
      image: 'https://picsum.photos/seed/nanohanastandard/1000/667',
      desc: 'A clean, fan-cooled room with marble flooring, an electric kettle, a minibar, and a sturdy work desk. Your modest but completely comfortable base for exploring Pokhara, the lake, and the local trekking trails.',
      features: ['18 m² Area', 'Double or twin beds', '2 Adults, 1 Child', 'Attached private bathroom', 'Free stable WiFi', 'Electric kettle & Minibar'],
      amenities: ['Work desk', 'Ceiling fan', 'Minibar', 'Electric kettle', 'Free toiletries', 'Flat-screen TV', 'Daily housekeeping'],
      popular: false
    },
    {
      id: 'room-2',
      price: '$15',
      category: 'Standard',
      view: 'Mountain view',
      name: 'Standard Garden View Room',
      image: 'https://picsum.photos/seed/nanohanaview/1000/667',
      desc: 'Ground-floor rooms offering direct physical views of our lodge’s flourishing, flower-filled garden terraces. Wake up to the clean chirping of local birds in Lakeside. Includes marble floors, warm showers, and direct outdoor chairs.',
      features: ['19 m² Area', 'Double bed setup', '2 Adults', 'Ground-floor entrance', 'Attached hot shower', 'Garden view window'],
      amenities: ['Work desk', 'Ceiling fan', 'Minibar', 'Electric kettle', 'Slippers', 'Bath sheets', 'Daily housekeeping'],
      popular: false
    },
    {
      id: 'room-3',
      price: '$20',
      category: 'Deluxe & Terrace',
      view: 'Mountain view',
      name: 'Deluxe Terrace Room with Mountain View',
      image: 'https://picsum.photos/seed/nanohanadeluxe/1000/667',
      desc: 'Our most sought-after room. Features a private or semi-private balcony facing the spectacular Annapurna peaks and Phewa Lake, a flat-screen TV with premium channels, and an attached spacious bathtub to soak in after a strenuous trek.',
      features: ['24 m² Area', '1 King Bed', '2 Adults, 1 Child', 'Private balcony', 'Lakeside & Mountain vista', 'In-room deep bathtub'],
      amenities: ['Air conditioning', 'Private Balcony', 'Deep Bathtub', 'Seating area', 'Slippers & Bath sheets', 'Rainfall shower', 'Flat-screen TV'],
      popular: true
    },
    {
      id: 'room-4',
      price: '$22',
      category: 'Deluxe & Terrace',
      view: 'Garden',
      name: 'Family / Triple Room',
      image: 'https://picsum.photos/seed/organicgardens/1000/667',
      desc: 'Spurious setup for families or small traveling groups. Enjoy extra luggage holding space, comfortable bedding layouts, and easy garden floor accessibility. Ideal for those who value space and calm nights in Nepal.',
      features: ['28 m² Area', '1 Double + 1 Single', '3 Adults', 'Extra luggage holds', 'Attached clean tile bathroom', 'Coffee garden access'],
      amenities: ['Ceiling fan', 'Coffee maker', 'Minibar', 'Work desk', 'Large bath sheets', 'Daily housekeeping', 'Room service'],
      popular: false
    }
  ];

  const filteredRooms = rooms.filter((room) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Standard') return room.category === 'Standard';
    if (activeFilter === 'Deluxe & Terrace') return room.category === 'Deluxe & Terrace';
    if (activeFilter === 'Mountain view') return room.view === 'Mountain view';
    return true;
  });

  return (
    <div id="rooms-page" className="w-full">
      {/* SUB-HERO SECTION (Partial height, ~50vh) */}
      <section id="rooms-hero" className="relative h-[55vh] min-h-[380px] w-full flex items-center justify-center">
        <Image
          src="https://picsum.photos/seed/nanohanadeluxe/1600/900"
          alt="Mountain view from terrace"
          fill
          priority
          className="object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-forest/50 mix-blend-multiply" />

        <div className="relative z-10 text-center px-5 text-cream max-w-[800px] pt-16">
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-cream/70 block mb-2">
            Rooms & Suites
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-medium tracking-tight mb-4">
            Your room. Your mountain view.
          </h1>
          <p className="text-cream/90 text-sm sm:text-base max-w-[550px] mx-auto leading-relaxed">
            17 rooms spread across three floors. Every level features its own communal flower balcony and unobstructed Annapurna views, starting from just $12/night.
          </p>
        </div>
      </section>

      {/* STICKY FILTER BAR */}
      <section id="filter-bar" className="sticky top-[73px] z-30 bg-cream border-y border-earth/10 shadow-sm">
        <div className="max-w-[1240px] mx-auto px-5 md:px-10 lg:px-20 py-4 flex items-center justify-center sm:justify-start gap-2 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-5 py-2 rounded-full font-sans text-xs tracking-wide uppercase font-semibold transition-all ${
                activeFilter === cat
                  ? 'bg-nanohana text-earth shadow'
                  : 'text-earth/70 hover:text-earth hover:bg-earth/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* FULL ROOM LISTINGS SECTION */}
      <section id="room-listings" className="bg-cream py-16 text-earth">
        <div className="max-w-[1240px] mx-auto px-5 md:px-10 lg:px-20 space-y-16">
          {filteredRooms.length === 0 ? (
            <div className="text-center py-12">
              <p className="font-serif text-lg text-earth/70">No rooms match this active filter. See our full collection by tapping another tab.</p>
            </div>
          ) : (
            filteredRooms.map((room, index) => (
              <div
                key={room.id}
                id={`room-card-${index}`}
                className="flex flex-col-reverse lg:grid lg:grid-cols-12 rounded-2xl overflow-hidden border border-earth/10 bg-cream/50 hover:shadow-lg transition-all"
              >
                {/* Content Column (Left on desktop/60% width) - Alternating layout mathematically */}
                <div className={`lg:col-span-7 p-6 sm:p-12 flex flex-col justify-between space-y-6 ${index % 2 === 1 ? 'lg:order-last' : ''}`}>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-xs font-mono uppercase tracking-widest text-phewa font-bold">
                        {room.category}
                      </span>
                      {room.popular && (
                        <span className="px-3 py-1 rounded bg-forest text-cream font-sans font-semibold text-[10px] uppercase tracking-wide flex items-center gap-1">
                          <Award className="w-3 h-3" /> Most Popular
                        </span>
                      )}
                    </div>

                    <h3 className="font-serif text-2xl sm:text-3xl text-earth font-medium leading-tight">
                      {room.name}
                    </h3>

                    <p className="text-earth/85 text-sm leading-relaxed">
                      {room.desc}
                    </p>

                    {/* Specifications List */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 pt-4 border-t border-earth/10 text-xs text-earth/80">
                      {room.features.map((feat, i) => (
                        <div key={i} className={`flex items-center gap-2 ${i > 2 ? 'hidden sm:flex' : ''}`}>
                          <CheckCircle className="w-3.5 h-3.5 text-phewa flex-shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>

                    {/* Included amenities pills */}
                    <div className="hidden sm:flex flex-wrap gap-1.5 pt-4">
                      {room.amenities.map((amenity, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-full bg-sage/10 text-[10px] font-mono font-medium text-earth/80"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-earth/10 flex items-center justify-between gap-4">
                    <div>
                      <span className="text-xs text-earth/60 font-mono block">Starting Rate</span>
                      <span className="text-2xl font-serif text-nanohana font-bold">{room.price} <span className="text-xs text-earth/80 font-normal">/ night</span></span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Link
                        id={`rooms-book-${room.id}`}
                        href="/reservations"
                        className="px-6 py-2.5 rounded-full bg-nanohana text-earth font-sans text-xs font-semibold hover:bg-nanohana/90 transition-colors shadow-sm"
                      >
                        Book now
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Photo Column */}
                <div className="lg:col-span-5 relative min-h-[250px] lg:min-h-auto w-full">
                  <Image
                    src={room.image}
                    alt={room.name}
                    fill
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* ROOM POLICIES SUMMARY */}
      <section id="room-policies" className="bg-cream py-16 border-t border-earth/5">
        <div className="max-w-[1240px] mx-auto px-5 md:px-10 lg:px-20">
          <div className="p-8 sm:p-12 background rounded-2xl border border-earth/10 bg-earth/5 grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="font-serif text-xl font-bold mb-6 text-earth border-b border-earth/10 pb-3 flex items-center gap-2">
                <Layers className="w-5 h-5 text-phewa" /> Stay Rules & Details
              </h3>
              <ul className="space-y-4 text-sm list-none my-0 pl-0 text-earth/80">
                <li className="flex justify-between border-b border-earth/5 pb-2">
                  <span className="font-medium">Check-in hour</span>
                  <span>From 6:00 AM (early front desk coverage)</span>
                </li>
                <li className="flex justify-between border-b border-earth/5 pb-2">
                  <span className="font-medium">Check-out hour</span>
                  <span>Before 12:00 noon</span>
                </li>
                <li className="flex justify-between border-b border-earth/5 pb-2">
                  <span className="font-medium">Minimum Age requirement</span>
                  <span>At least 16 years old to book separately</span>
                </li>
                <li className="flex justify-between border-b border-earth/5 pb-2">
                  <span className="font-medium">Pet policy</span>
                  <span>Strictly not permitted (eco-garden protection)</span>
                </li>
                <li className="flex justify-between border-b border-earth/5 pb-2">
                  <span className="font-medium">In-room Smoking</span>
                  <span>Non-smoking rooms (smoking permitted on communal balconies only)</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-serif text-xl font-bold mb-6 text-earth border-b border-earth/10 pb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-phewa" /> Family & Additional Terms
              </h3>
              <ul className="space-y-4 text-sm list-none my-0 pl-0 text-earth/80">
                <li className="flex justify-between border-b border-earth/5 pb-2">
                  <span className="font-medium">Children stay policy</span>
                  <span>All ages welcome; Children 0-8 stay free using existing beds</span>
                </li>
                <li className="flex justify-between border-b border-earth/5 pb-2">
                  <span className="font-medium">Extra Rollaways</span>
                  <span>Maximum 1 extra bed permitted per room (by request)</span>
                </li>
                <li className="flex justify-between border-b border-earth/5 pb-2">
                  <span className="font-medium">Cribs / Baby cots</span>
                  <span>Unfortunately not available at the lodge</span>
                </li>
                <li className="flex justify-between border-b border-earth/5 pb-2">
                  <span className="font-medium">Languages Spoken at desk</span>
                  <span>English, Hindi, Nepali, Japanese</span>
                </li>
                <li className="flex justify-between border-b border-earth/5 pb-2">
                  <span className="font-medium">Airport Transfer Shuttle</span>
                  <span>Paid shuttle available (highly recommended to notify in advance)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* BOOKING REFERRALS SECTION (Forest Canopy bg) */}
      <section id="reservations-partners" className="bg-forest text-cream py-16 text-center">
        <div className="max-w-[800px] mx-auto px-5 space-y-6">
          <h2 className="font-serif text-3xl sm:text-4xl font-medium">Found your room? Lock in your rate.</h2>
          <p className="text-cream/80 max-w-[550px] mx-auto text-sm leading-relaxed">
            We are proud partners on major booking engines. However, booking direct on this official site guarantees you the absolute cheapest rate, flexible support, and no third-party hidden fees.
          </p>

          <div className="flex flex-wrap justify-center items-center gap-4 py-6 border-y border-white/10 text-stone text-[10px] md:text-xs font-mono">
            <span>BOOKING.COM</span>
            <span>AGODA</span>
            <span className="hidden sm:inline">EXPEDIA</span>
            <span className="hidden sm:inline">KAYAK</span>
            <span className="hidden sm:inline">HOTELS.COM</span>
            <span>TRIPADVISOR</span>
          </div>

          <div className="pt-4">
            <Link
              id="referral-direct-cta"
              href="/reservations"
              className="px-8 py-3.5 bg-nanohana text-earth font-sans text-sm font-semibold rounded-full hover:bg-nanohana/90 hover:scale-105 active:scale-95 transition-all inline-block shadow-md"
            >
              Book Direct With Us Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
