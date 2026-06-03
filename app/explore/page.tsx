'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  MapPin,
  Compass,
  Utensils,
  Navigation,
  Quote,
  Flame,
  ArrowRight,
  Map,
  Locate
} from 'lucide-react';

export default function ExplorePage() {
  const locations = [
    {
      name: 'Basundhara Park',
      distance: '100m · 2 min walk',
      desc: 'Right next door. A calm, verdant local garden park perfect for quiet morning steps or reading.',
      icon: MapPin
    },
    {
      name: 'Phewa Lake',
      distance: '300m · 5 min walk',
      desc: 'Iconic panoramic lake. Great for rowboat rental docks, trailing paths, and views of Fishtail mountain.',
      icon: MapPin
    },
    {
      name: 'Tal Barahi Temple',
      distance: '1.3 km · 15 min walk',
      desc: 'The unique island temple floating on Phewa Lake. Proudly accessed via a 10-minute traditional rowboat.',
      icon: MapPin
    },
    {
      name: 'Ratna Mandir',
      distance: '15 min walk',
      desc: 'A gorgeous royal retreat palace compound accessible right along the main Lakeside pathway strip.',
      icon: MapPin
    },
    {
      name: 'Pokhara Regional Museum',
      distance: '1.7 km · 20 min walk',
      desc: 'Immerse in the historic cultural, tribal, and geological chronicles of the Gandaki province.',
      icon: Navigation
    },
    {
      name: 'World Peace Pagoda (Shanti Stupa)',
      distance: '25 min hike / drive',
      desc: 'Striking white Buddhist monument crowning the ridge with panoramic vistas of Pokhara and Annapurnas.',
      icon: Navigation
    },
    {
      name: 'International Mountain Museum',
      distance: '10 min drive',
      desc: 'Highly prestigious mountaineering museum documenting Everest and Annapurna climbing history.',
      icon: Navigation
    },
    {
      name: 'Davis Falls (Patale Chhango)',
      distance: '10 min drive',
      desc: 'A powerful waterfall that flows into a mysterious subterranean tunnel gorge. A local marvel.',
      icon: Navigation
    },
    {
      name: 'Sarangkot',
      distance: '30 min drive',
      desc: 'The legendary paragliding takeoff hill. Best vantage point for sunrise or paragliding over Phewa.',
      icon: Locate
    },
    {
      name: 'Pokhara Airport (PKR)',
      distance: '1.4 – 2.8 km · 10 min drive',
      desc: 'We manage paid shuttle transfers directly to/from terminals. Inform our front desk crew early.',
      icon: Locate
    }
  ];

  const restaurants = [
    {
      name: 'am/pm organic cafe',
      category: 'Cafe & Early Breakfast',
      dist: '6 min walk',
      rating: '★ 4.4 (684 reviews)'
    },
    {
      name: 'Med5 Restaurant',
      category: 'Woodfired Pizza & Italian',
      dist: '5 min walk',
      rating: '★ 4.7 (325 reviews)'
    },
    {
      name: 'Fish Tail Lodge Restaurant',
      category: 'Fine International Dining',
      dist: '6 min rowboat/walk',
      rating: '★ 4.4 (Moderate)'
    },
    {
      name: 'Godfathers Pizzeria',
      category: 'Casual Italian Diner',
      dist: '5 min walk',
      rating: '★ 3.9 (938 reviews)'
    },
    {
      name: 'Bamboo Garden Restaurant',
      category: 'Nepali & Asian Organic Platter',
      dist: '5 min walk',
      rating: '★ 4.5 (Highly Recommended)'
    }
  ];

  return (
    <div id="explore-page" className="w-full">
      {/* SUB-HERO SECTION */}
      <section id="explore-hero" className="relative h-[55vh] min-h-[380px] w-full flex items-center justify-center">
        <Image
          src="https://picsum.photos/seed/phewautc/1600/900"
          alt="Phewa Lake reflection"
          fill
          priority
          className="object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-forest/50 mix-blend-multiply" />

        <div className="relative z-10 text-center px-5 text-cream max-w-[800px] pt-16">
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-cream/70 block mb-2">
            Local Sightseeing Guide
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-medium tracking-tight mb-4">
            Pokhara through our {"family's"} eyes.
          </h1>
          <p className="text-cream/90 text-sm max-w-[550px] mx-auto leading-relaxed">
            Our clean garden lodge is your base camp. Beautiful Phewa Lake resides 300m away, while the snowy peaks crown your balcony. Pokhara is waiting.
          </p>
        </div>
      </section>

      {/* THREE WAYS TO ADVENTURE / GUIDE SECTION */}
      <section id="sightseeing-distances" className="bg-cream py-20 text-earth">
        <div className="max-w-[1240px] mx-auto px-5 md:px-10 lg:px-20">
          <div className="text-center max-w-[650px] mx-auto mb-16">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-phewa" />
              <span className="text-[11px] font-mono uppercase tracking-[0.15em] text-phewa font-semibold">
                Lakeside Coordinates
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-earth font-medium leading-tight">
              Everything in Pokhara resides within reach.
            </h2>
            <p className="text-earth/70 text-xs sm:text-sm mt-2 leading-relaxed">
              We reside on Lakeside Street No. 4, representing Lakeside’s quietest perimeter — entirely isolated from bars decibels but highly close to trails.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[1000px] mx-auto">
            {locations.map((loc, idx) => {
              const IconComp = loc.icon;
              return (
                <div
                  key={idx}
                  id={`coord-location-${idx}`}
                  className="p-6 bg-cream border border-earth/10 rounded-xl space-y-2 hover:border-phewa/30 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-phewa">
                      <IconComp className="w-5 h-5 flex-shrink-0" />
                      <span className="font-serif font-bold text-lg text-earth">{loc.name}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-earth/80">
                      {loc.desc}
                    </p>
                  </div>
                  <div className="text-[11px] font-mono uppercase text-teal-700 font-bold pt-3 border-t border-earth/5 tracking-wider">
                    {loc.distance}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SURROUNDING FOOD & DINING RECOMMENDATIONS (Forest Canopy bg) */}
      <section id="surrounding-food" className="bg-forest text-cream py-20 border-t border-white/5">
        <div className="max-w-[1240px] mx-auto px-5 md:px-10 lg:px-20">
          <div className="text-center max-w-[600px] mx-auto mb-16">
            <span className="text-[11px] font-mono uppercase tracking-widest text-nanohana font-bold block">
              Curated by Rabin & Kishor
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-cream font-medium mt-1">
              Where we send our cousins for dinner.
            </h2>
            <p className="text-cream/80 text-xs sm:text-sm mt-2 leading-relaxed">
              Skip the noisy tourist traps. These neighborhood favorites serve outstanding coffee and wood-fired platters a short 5-minute garden walk from our door.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {restaurants.map((rest, idx) => (
              <div
                key={idx}
                id={`restaurant-card-${idx}`}
                className="p-5 bg-white/5 border border-white/10 rounded-xl flex flex-col justify-between h-full space-y-4"
              >
                <div>
                  <div className="p-2 bg-nanohana/10 rounded-full w-10 h-10 flex items-center justify-center text-nanohana">
                    <Utensils className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif text-lg font-bold mt-3 text-cream">{rest.name}</h3>
                  <p className="text-xs text-cream/70 mt-1">{rest.category}</p>
                </div>
                <div className="pt-3 border-t border-white/10 text-[10px] font-mono text-sage space-y-1">
                  <div className="flex justify-between">
                    <span>DISTANCE:</span>
                    <span>{rest.dist}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-nanohana">
                    <span>SCORE:</span>
                    <span>{rest.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEPALESE TREKKING ADVICE DIRECTIVE CALLOUT */}
      <section id="trekking-callout" className="bg-forest py-20 border-t border-white/10">
        <div className="max-w-[1240px] mx-auto px-5 md:px-10 lg:px-20">
          <div className="bg-earth/40 rounded-2xl p-8 sm:p-12 max-w-[950px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border border-white/10">
            <div className="lg:col-span-8 space-y-4">
              <Quote className="w-10 h-10 text-nanohana" />
              <p className="font-serif text-lg sm:text-xl italic text-cream leading-relaxed">
                {"\"Kishor and the Nanohana team helped coordinate my certified mountain guide, Raj, for our 10-day Annapurna Sanctuary trail. They stored our baggage safely and organized taxi pickups under short notice. Truly outstanding.\""}
              </p>
              <span className="text-xs font-mono uppercase tracking-widest block text-sage">
                {"— Verified Guest testimonial (Booking.com reviewer)"}
              </span>
            </div>

            <div className="lg:col-span-4 lg:border-l border-white/10 lg:pl-8 space-y-4">
              <h3 className="font-serif text-xl font-bold text-cream">Need trek support?</h3>
              <p className="text-xs text-cream/80 leading-relaxed">
                We maintain active partnerships with reliable, certified local Sherpas who know these mountains by heart. Luggage holding during trails is completely free.
              </p>
              <Link
                id="trek-contact-btn"
                href="/contact"
                className="px-5 py-2.5 bg-nanohana text-earth font-sans text-xs font-semibold rounded-full hover:bg-nanohana/90 hover:scale-105 active:scale-95 transition-all inline-block shadow-md text-center"
              >
                Inquire at front desk
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
