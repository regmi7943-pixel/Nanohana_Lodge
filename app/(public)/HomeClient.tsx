'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import EditableImage from '@/components/EditableImage';
import {
  Star,
  MapPin,
  Home,
  HeartHandshake,
  Tag,
  Wifi,
  SquareParking,
  Coffee,
  Heart,
  Bike,
  Compass,
  ArrowRight,
  Play,
  X,
  ChevronLeft,
  ChevronRight,
  Quote,
  Flame,
  Droplet,
  Users,
  Leaf
} from 'lucide-react';
import EditableText from '@/components/EditableText';
import { defaultRooms } from '@/lib/defaultRooms';

export default function HomeClient({ content = [], editMode = false }: { content?: any[], editMode?: boolean }) {
  const getText = (key: string) => content.find((c: any) => c.key === key)?.value;

  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [activeCarouselIndex, setActiveCarouselIndex] = useState(0);

  const rawRooms = content.find((c: any) => c.key === 'global_rooms_list')?.value;
  let DB_ROOMS: any[] = [];
  try {
    DB_ROOMS = rawRooms ? JSON.parse(rawRooms) : defaultRooms;
  } catch(e) {
    DB_ROOMS = defaultRooms;
  }

  const roomsData = DB_ROOMS.map(r => ({
    id: r.id,
    price: r.price,
    name: r.name,
    desc: r.desc,
    image: r.image,
    specs: {
      size: r.features[0] || '',
      bed: r.features[1] || '',
      guests: r.features[2] || '',
      ac: r.features[3] || ''
    }
  }));

  const handleNextCarousel = () => {
    setActiveCarouselIndex((prev) => (prev + 1) % roomsData.length);
  };

  const handlePrevCarousel = () => {
    setActiveCarouselIndex((prev) => (prev - 1 + roomsData.length) % roomsData.length);
  };

  return (
    <div id="home-page" className="w-full">
      {/* SECTION 1 — HERO SECTION */}
      <section id="hero-section" className="relative h-screen min-h-[550px] md:min-h-[700px] w-full overflow-hidden flex items-center justify-center pb-16 md:pb-24">
        <div className="absolute inset-0 z-0">
          <EditableImage 
            page="home"
            contentKey="home_hero_bg"
            defaultSrc="/hero-bg.png"
            currentSrc={getText('home_hero_bg')}
            editMode={editMode}
            alt="Nanohana Lodge Front View" 
            fill 
            priority 
            className="object-cover" 
          />
          <div className="absolute inset-0 bg-black/65 mix-blend-multiply pointer-events-none" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 text-center px-5 max-w-[850px] mx-auto text-cream pt-20"
        >
          <div className="flex justify-center items-center gap-1 mb-4 animate-fade-in">
            {[...Array(4)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-nanohana text-nanohana" />
            ))}
          </div>

          <EditableText as="p" page="home" contentKey="hero_eyebrow" defaultText="Pokhara · Nepal · Est. 1990" currentText={getText('hero_eyebrow')} editMode={editMode} className="text-stone text-[11px] font-mono tracking-[0.15em] uppercase mb-4" />

          <EditableText as="h1" page="home" contentKey="hero_title" defaultText="Welcome to your quiet garden home by the mountains." currentText={getText('hero_title')} editMode={editMode} className="font-serif text-3xl sm:text-5xl md:text-6xl text-cream font-medium leading-[1.12] mb-6 tracking-tight" />

          <EditableText as="p" page="home" contentKey="hero_desc" defaultText="We're a small, family-run lodge tucked away on a peaceful lane. Expect blooming balconies, warm Nepali smiles, and a front-row seat to the Annapurnas." currentText={getText('hero_desc')} editMode={editMode} className="text-cream/80 font-sans text-base sm:text-lg max-w-[600px] mx-auto leading-relaxed mb-8" />

          <div className="flex flex-row items-center justify-center gap-3 sm:gap-4">
            <Link id="hero-book-now" href="/reservations" className="w-1/2 sm:w-auto px-4 py-3 sm:px-8 sm:py-3.5 rounded-full bg-nanohana text-earth font-sans text-xs sm:text-sm font-medium tracking-wide hover:bg-nanohana/90 active:scale-95 transition-all shadow-md text-center">
              Book your stay →
            </Link>
            <Link id="hero-explore" href="/rooms" className="w-1/2 sm:w-auto px-4 py-3 sm:px-8 sm:py-3.5 rounded-full border border-cream/50 text-cream font-sans text-xs sm:text-sm font-medium hover:bg-cream/10 active:scale-95 transition-all text-center">
              Explore the lodge
            </Link>
          </div>
        </motion.div>

        {/* Bottom Banner Strip */}
        <div className="absolute bottom-0 left-0 right-0 bg-earth/80 backdrop-blur-sm py-4 border-t border-white/10 z-20 hidden md:block">
          <div className="max-w-[1240px] mx-auto px-5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-sans text-cream/90">
            <div className="flex items-center gap-2">
              <span className="bg-forest px-2.5 py-1 rounded text-[10px] font-mono font-medium tracking-wide">SINCE 1990</span>
              <EditableText as="span" page="home" contentKey="banner_years" defaultText="35 years of genuine hospitality" currentText={getText('banner_years')} editMode={editMode} />
            </div>
            <div className="flex items-center gap-6 text-cream/80 my-2 md:my-0">
              <span className="flex items-center gap-1.5 border-r border-cream/20 pr-6">
                <span className="font-bold text-nanohana text-sm">9.0</span> Booking.com
              </span>
              <span className="flex items-center gap-1.5 border-r border-cream/20 pr-6">
                <span className="font-bold text-nanohana text-sm">9.3</span> Kayak
              </span>
              <span className="flex items-center gap-1.5">
                <span className="font-bold text-nanohana text-sm">4.6</span> TripAdvisor
              </span>
            </div>
            <div className="text-sage font-mono text-[11px] text-center md:text-right">
              ★ +6,000 Bookings Successfully Hosted
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 — FOUR TRUST PILLARS */}
      <section id="trust-pillars" className="bg-cream py-16 text-earth border-b border-earth/5 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-[1240px] mx-auto px-5 md:px-10 lg:px-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {/* Pillar 1 */}
          <div className="flex flex-col items-start md:items-center text-left md:text-center p-0 md:p-4">
            <div className="p-2 md:p-3 bg-phewa/10 rounded-full text-phewa mb-2 md:mb-4"><MapPin className="w-6 h-6 md:w-8 md:h-8" /></div>
            <EditableText as="h3" page="home" contentKey="pillar1_title" defaultText="A Peaceful Lakeside Hideaway" currentText={getText('pillar1_title')} editMode={editMode} className="font-serif text-lg font-semibold mb-2" />
            <EditableText as="p" page="home" contentKey="pillar1_desc" defaultText="We're nestled on a quiet lane just a short stroll from Phewa Lake. It's the perfect balance: close enough to easily explore the vibrant lakeside, yet peaceful enough for a deeply restful night's sleep." currentText={getText('pillar1_desc')} editMode={editMode} className="text-sm text-earth/75 leading-relaxed" />
          </div>

          {/* Pillar 2 */}
          <div className="flex flex-col items-start md:items-center text-left md:text-center p-0 md:p-4 mt-4 md:mt-0">
            <div className="p-2 md:p-3 bg-phewa/10 rounded-full text-phewa mb-2 md:mb-4"><Home className="w-6 h-6 md:w-8 md:h-8" /></div>
            <EditableText as="h3" page="home" contentKey="pillar2_title" defaultText="Spotless, Cozy Rooms" currentText={getText('pillar2_title')} editMode={editMode} className="font-serif text-lg font-semibold mb-2" />
            <EditableText as="p" page="home" contentKey="pillar2_desc" defaultText="You'll find marble floors, reliably hot showers, fast WiFi, and sweeping mountain views to wake up to. We obsess over cleanliness so you can simply relax." currentText={getText('pillar2_desc')} editMode={editMode} className="text-sm text-earth/75 leading-relaxed" />
          </div>

          {/* Pillar 3 */}
          <div className="hidden md:flex flex-col items-center text-center p-4">
            <div className="p-3 bg-phewa/10 rounded-full text-phewa mb-4"><HeartHandshake className="w-8 h-8" /></div>
            <EditableText as="h3" page="home" contentKey="pillar3_title" defaultText="A Family Who Cares" currentText={getText('pillar3_title')} editMode={editMode} className="font-serif text-lg font-semibold mb-2" />
            <EditableText as="p" page="home" contentKey="pillar3_desc" defaultText="Kishor, Rabin, Robyn, and the rest of our family team are here for you. Whether you need help planning a trek or just want a good local coffee recommendation, we love helping our guests." currentText={getText('pillar3_desc')} editMode={editMode} className="text-sm text-earth/75 leading-relaxed" />
          </div>

          {/* Pillar 4 */}
          <div className="hidden md:flex flex-col items-center text-center p-4">
            <div className="p-3 bg-phewa/10 rounded-full text-phewa mb-4"><Tag className="w-8 h-8" /></div>
            <EditableText as="h3" page="home" contentKey="pillar4_title" defaultText="Honest, Accessible Value" currentText={getText('pillar4_title')} editMode={editMode} className="font-serif text-lg font-semibold mb-2" />
            <EditableText as="p" page="home" contentKey="pillar4_desc" defaultText="We believe a beautiful, comfortable stay shouldn't break the bank. With cozy rooms starting from just $12 a night, we offer genuine Nepalese hospitality that travelers can afford." currentText={getText('pillar4_desc')} editMode={editMode} className="text-sm text-earth/75 leading-relaxed" />
          </div>
        </motion.div>
      </section>

      {/* SECTION 3 — WELCOME TO NANOHANA */}
      <section id="welcome-nanohana" className="bg-forest text-cream py-20 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-[1240px] mx-auto px-5 md:px-10 lg:px-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
        >
          {/* Left Column - Images */}
          <div className="lg:col-span-5 relative w-full h-[300px] sm:h-[480px]">
            <div className="hidden md:block absolute inset-0">
              <div className="absolute left-0 top-0 w-2/3 h-4/5 rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                <EditableImage page="home" contentKey="home_story_1" defaultSrc="/story_home.jpg" currentSrc={getText('home_story_1')} editMode={editMode} alt="Nanohana Lodge Story" fill className="object-cover" />
              </div>
              <div className="absolute right-0 bottom-0 w-2/3 h-4/5 rounded-2xl overflow-hidden shadow-2xl border border-white/10 z-10">
                <EditableImage page="home" contentKey="home_story_2" defaultSrc="/story_home2.jpg" currentSrc={getText('home_story_2')} editMode={editMode} alt="Nanohana Lodge Garden" fill className="object-cover" />
              </div>
            </div>
            <div className="block md:hidden absolute inset-0 rounded-2xl overflow-hidden shadow-2xl border border-white/10">
              <EditableImage page="home" contentKey="home_story_hero" defaultSrc="/story_hero.jpg" currentSrc={getText('home_story_hero')} editMode={editMode} alt="Nanohana Lodge Hero" fill className="object-cover" />
            </div>
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 bg-nanohana text-earth px-4 py-2 md:px-5 md:py-3 rounded-xl shadow-lg border border-earth/10 flex flex-col items-center text-center">
              <span className="font-serif font-bold text-lg md:text-xl">17 Rooms</span>
              <span className="text-[10px] font-mono uppercase tracking-widest font-semibold text-earth/80">Pokhara's top 10%</span>
            </div>
          </div>

          {/* Right Column - Text */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-phewa" />
              <span className="text-[11px] font-mono uppercase tracking-[0.15em] text-phewa font-semibold">Welcome to Nanohana</span>
            </div>
            <EditableText as="h2" page="home" contentKey="founding_title" defaultText="Built on a lifelong love of hosting travelers." currentText={getText('founding_title')} editMode={editMode} className="font-serif text-3xl md:text-4xl text-cream font-medium leading-tight" />
            <div className="text-cream/80 text-sm leading-relaxed space-y-4">
              <EditableText as="p" page="home" contentKey="founding_body" defaultText="Hospitality runs in our blood. Our founder, Kul Bahadur Acharya, comes from a family that opened Lakeside's very first guesthouse over 30 years ago. When he built Nanohana right across from his own family home, he wanted to create a place that felt like an extension of his living room—blending quietly into the natural garden and feeling instantly like home." currentText={getText('founding_body')} editMode={editMode} />
              <EditableText as="p" page="home" contentKey="founding_body2" defaultText="From the flowers we tend on our balconies to our simple eco-friendly touches, everything we do is rooted in the belief that a memorable stay shouldn't cost the earth." currentText={getText('founding_body2')} editMode={editMode} />
              <EditableText as="p" page="home" contentKey="founding_quote" defaultText={`"17 rooms. Three storeys. One peaceful rooftop with a view of the Annapurna range that guests say they will never forget."`} currentText={getText('founding_quote')} editMode={editMode} className="text-sage text-base font-serif italic pt-2" />
            </div>
            <div className="pt-4">
              <Link id="welcome-read-story" href="/about" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-cream/30 text-cream hover:border-nanohana hover:text-nanohana transition-colors text-sm font-medium">
                Read our story <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* SECTION 4 — RATING STRIP */}
      <section id="ratings-strip" className="bg-cream py-10 border-b border-earth/5 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="max-w-[1240px] mx-auto px-5 md:px-10 lg:px-20 grid grid-cols-1 md:grid-cols-3 gap-6 text-center"
        >
          <div className="p-4 md:border-r border-earth/10">
            <span className="block text-2xl font-serif text-forest mb-1 font-bold">Booking.com</span>
            <span className="text-3xl font-serif text-nanohana font-bold">9.0/10</span>
            <EditableText as="p" page="home" contentKey="rating_booking" defaultText="Wonderful · +3.5K Reviews Verified" currentText={getText('rating_booking')} editMode={editMode} className="text-xs text-earth/70 mt-1 font-mono uppercase tracking-wider" />
          </div>
          <div className="hidden md:block p-4 md:border-r border-earth/10">
            <span className="block text-2xl font-serif text-forest mb-1 font-bold">Kayak</span>
            <span className="text-3xl font-serif text-nanohana font-bold">9.3/10</span>
            <EditableText as="p" page="home" contentKey="rating_kayak" defaultText="Excellent · 271 direct guest posts" currentText={getText('rating_kayak')} editMode={editMode} className="text-xs text-earth/70 mt-1 font-mono uppercase tracking-wider" />
          </div>
          <div className="p-4">
            <span className="block text-2xl font-serif text-forest mb-1 font-bold">TripAdvisor</span>
            <span className="text-3xl font-serif text-nanohana font-bold">4.6/5</span>
            <EditableText as="p" page="home" contentKey="rating_tripadvisor" defaultText="Travellers' Choice · #8 of 59 Lodges" currentText={getText('rating_tripadvisor')} editMode={editMode} className="text-xs text-earth/70 mt-1 font-mono uppercase tracking-wider" />
          </div>
        </motion.div>
      </section>

      {/* SECTION 5 — ROOM & SUITE COLLECTION */}
      <section id="rooms-carousel" className="bg-forest py-20 text-cream overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
          className="max-w-[1240px] mx-auto px-5 md:px-10 lg:px-20"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-phewa" />
                <span className="text-[11px] font-mono uppercase tracking-[0.15em] text-phewa font-semibold">Rooms & Suites</span>
              </div>
              <EditableText as="h2" page="home" contentKey="rooms_title" defaultText="Simple comfort, spectacular setting." currentText={getText('rooms_title')} editMode={editMode} className="font-serif text-3xl md:text-4xl font-medium tracking-tight" />
            </div>
            <div className="flex items-center gap-3 mt-4 md:mt-0">
              <button onClick={handlePrevCarousel} className="p-3 bg-white/5 border border-white/10 hover:border-nanohana hover:text-nanohana rounded-full transition-colors" aria-label="Previous Room"><ChevronLeft className="w-5 h-5" /></button>
              <button onClick={handleNextCarousel} className="p-3 bg-white/5 border border-white/10 hover:border-nanohana hover:text-nanohana rounded-full transition-colors" aria-label="Next Room"><ChevronRight className="w-5 h-5" /></button>
            </div>
          </div>

          <div className="flex flex-col-reverse lg:grid lg:grid-cols-12 rounded-2xl overflow-hidden border border-white/10 bg-earth/30">
            <div className="lg:col-span-5 p-6 sm:p-12 flex flex-col justify-between space-y-6 md:space-y-8">
              <div>
                <span className="text-xs uppercase tracking-widest font-mono text-nanohana font-semibold">Rates From {roomsData[activeCarouselIndex].price} / night</span>
                <h3 className="font-serif text-2xl sm:text-3xl font-medium mt-2 leading-relaxed text-cream">{roomsData[activeCarouselIndex].name}</h3>
                <p className="text-cream/80 text-sm leading-relaxed mt-3">{roomsData[activeCarouselIndex].desc}</p>
                <div className="hidden md:grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-white/10 text-xs">
                  <div><span className="text-sage font-mono block uppercase">Floor Space</span><span className="text-cream font-medium text-sm">{roomsData[activeCarouselIndex].specs.size}</span></div>
                  <div><span className="text-sage font-mono block uppercase">Bed Setup</span><span className="text-cream font-medium text-sm">{roomsData[activeCarouselIndex].specs.bed}</span></div>
                  <div><span className="text-sage font-mono block uppercase">Capacity</span><span className="text-cream font-medium text-sm">{roomsData[activeCarouselIndex].specs.guests}</span></div>
                  <div><span className="text-sage font-mono block uppercase">Cooling/Features</span><span className="text-cream font-medium text-sm">{roomsData[activeCarouselIndex].specs.ac}</span></div>
                </div>
              </div>
              <div className="flex flex-row items-center gap-2 sm:gap-3 md:gap-4 pt-2 md:pt-4 w-full">
                <Link id={`book-room-${activeCarouselIndex}`} href="/reservations" className="flex-1 px-2 sm:px-6 py-3 md:py-2.5 text-center rounded-full bg-nanohana text-earth font-sans text-xs font-semibold hover:bg-nanohana/90 transition-colors whitespace-nowrap">Book now</Link>
                <Link id={`view-room-${activeCarouselIndex}`} href="/rooms" className="flex-1 px-2 sm:px-6 py-3 md:py-2.5 text-center rounded-full border border-white/25 text-cream font-sans text-xs font-semibold hover:border-nanohana hover:text-nanohana transition-colors whitespace-nowrap">View details →</Link>
              </div>
            </div>
            <div className="lg:col-span-7 relative min-h-[250px] sm:min-h-[400px] w-full">
              <EditableImage page="home" contentKey={`home_room_carousel_${roomsData[activeCarouselIndex].id}`} defaultSrc={roomsData[activeCarouselIndex].image} currentSrc={getText(`home_room_carousel_${roomsData[activeCarouselIndex].id}`)} editMode={editMode} alt={roomsData[activeCarouselIndex].name} fill className="object-cover" referrerPolicy="no-referrer" />
            </div>
          </div>

          <div className="text-center mt-12">
            <Link id="view-all-rooms" href="/rooms" className="inline-flex items-center gap-2 px-8 py-3 rounded-full border border-white/20 text-cream hover:border-nanohana hover:text-nanohana transition-colors text-sm font-medium">
              See all rooms & rates <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* SECTION 6 — FACILITIES & AMENITIES */}
      <section id="amenities" className="bg-cream py-20 text-earth overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="max-w-[1240px] mx-auto px-5 md:px-10 lg:px-20"
        >
          <div className="text-center max-w-[650px] mx-auto mb-16">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-phewa" />
              <span className="text-[11px] font-mono uppercase tracking-[0.15em] text-phewa font-semibold">Modern and Comfortable</span>
            </div>
            <EditableText as="h2" page="home" contentKey="amenities_title" defaultText="Everything you need for the perfect Nepalese escape." currentText={getText('amenities_title')} editMode={editMode} className="font-serif text-3xl md:text-4xl text-earth font-medium leading-tight" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 bg-cream border border-earth/10 rounded-xl space-y-3">
              <Wifi className="w-8 h-8 text-phewa" />
              <EditableText as="h3" page="home" contentKey="amenity1_title" defaultText="High-speed WiFi" currentText={getText('amenity1_title')} editMode={editMode} className="font-serif text-lg font-semibold" />
              <EditableText as="p" page="home" contentKey="amenity1_desc" defaultText="Fast, reliable fiber WiFi everywhere. Perfect for planning your trek or catching up on work." currentText={getText('amenity1_desc')} editMode={editMode} className="text-sm text-earth/75 leading-relaxed" />
            </div>
            <div className="p-6 bg-cream border border-earth/10 rounded-xl space-y-3">
              <SquareParking className="w-8 h-8 text-phewa" />
              <EditableText as="h3" page="home" contentKey="amenity2_title" defaultText="Free Private Parking" currentText={getText('amenity2_title')} editMode={editMode} className="font-serif text-lg font-semibold" />
              <EditableText as="p" page="home" contentKey="amenity2_desc" defaultText="Free, secure parking for your car or motorcycle right on the property." currentText={getText('amenity2_desc')} editMode={editMode} className="text-sm text-earth/75 leading-relaxed" />
            </div>
            <div className="p-6 bg-cream border border-earth/10 rounded-xl space-y-3">
              <Coffee className="w-8 h-8 text-phewa" />
              <EditableText as="h3" page="home" contentKey="amenity3_title" defaultText="Local Eateries" currentText={getText('amenity3_title')} editMode={editMode} className="font-serif text-lg font-semibold" />
              <EditableText as="p" page="home" contentKey="amenity3_desc" defaultText="Enjoy great coffee or a hot meal just down the lane. Med5 Italian and Bamboo Garden are a 5-minute walk away." currentText={getText('amenity3_desc')} editMode={editMode} className="text-sm text-earth/75 leading-relaxed" />
            </div>
            <div className="hidden md:block p-6 bg-cream border border-earth/10 rounded-xl space-y-3">
              <Heart className="w-8 h-8 text-phewa" />
              <EditableText as="h3" page="home" contentKey="amenity4_title" defaultText="Professional Support" currentText={getText('amenity4_title')} editMode={editMode} className="font-serif text-lg font-semibold" />
              <EditableText as="p" page="home" contentKey="amenity4_desc" defaultText="Seeing Hands Massage is just down the street, or we can arrange an in-room foot massage for you." currentText={getText('amenity4_desc')} editMode={editMode} className="text-sm text-earth/75 leading-relaxed" />
            </div>
            <div className="hidden md:block p-6 bg-cream border border-earth/10 rounded-xl space-y-3">
              <Bike className="w-8 h-8 text-phewa" />
              <EditableText as="h3" page="home" contentKey="amenity5_title" defaultText="Bicycle Rentals" currentText={getText('amenity5_title')} editMode={editMode} className="font-serif text-lg font-semibold" />
              <EditableText as="p" page="home" contentKey="amenity5_desc" defaultText="Rent a bicycle from us to explore Lakeside, visit Phewa Lake, or ride to the Peace Pagoda." currentText={getText('amenity5_desc')} editMode={editMode} className="text-sm text-earth/75 leading-relaxed" />
            </div>
            <div className="hidden md:block p-6 bg-cream border border-earth/10 rounded-xl space-y-3">
              <Compass className="w-8 h-8 text-phewa" />
              <EditableText as="h3" page="home" contentKey="amenity6_title" defaultText="Panoramic Rooftop" currentText={getText('amenity6_title')} editMode={editMode} className="font-serif text-lg font-semibold" />
              <EditableText as="p" page="home" contentKey="amenity6_desc" defaultText="Watch the sunrise over the Annapurnas, read a book, or plan your next day in Pokhara." currentText={getText('amenity6_desc')} editMode={editMode} className="text-sm text-earth/75 leading-relaxed" />
            </div>
          </div>

          <div className="hidden md:flex mt-12 py-6 border-t border-earth/10 flex-wrap justify-center items-center gap-2">
            {['Free toiletries', 'Electric kettle', 'In-room minibar', 'Flat-screen TV', 'Luggage storage', 'Currency exchange', 'Trek Tour desk', 'Airport shuttle (paid)', 'Reliable Laundry', 'Daily housekeeping', '24-hour front desk', 'Quiet garden library'].map((pill, idx) => (
              <span key={idx} className="px-3.5 py-1.5 rounded-full bg-sage/10 text-earth text-xs font-medium">{pill}</span>
            ))}
          </div>
        </motion.div>
      </section>

      {/* SECTION 7 — ATMOSPHERE / WALKTHROUGH */}
      <section id="atmosphere-walkthrough" className="relative h-[480px] w-full flex items-center justify-center">
        <EditableImage page="home" contentKey="home_atmosphere_bg" defaultSrc="https://picsum.photos/seed/nepaltravel/1600/900" currentSrc={getText('home_atmosphere_bg')} editMode={editMode} alt="Atmosphere Pokhara landscape" fill className="object-cover" referrerPolicy="no-referrer" />
        <div className="absolute inset-0 bg-forest/60 mix-blend-multiply pointer-events-none" />
        <div className="relative z-10 text-center px-5 text-cream max-w-[600px] space-y-4">
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-cream/70">The Lodge</span>
          <EditableText as="h2" page="home" contentKey="walkthrough_title" defaultText="Explore Nanohana Lodge" currentText={getText('walkthrough_title')} editMode={editMode} className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight leading-tight" />
          <EditableText as="p" page="home" contentKey="walkthrough_desc" defaultText="Take a 1-minute visual journey around our blooming hotel garden, clean cozy rooms, and quiet rooftop mountains." currentText={getText('walkthrough_desc')} editMode={editMode} className="text-cream/80 text-sm max-w-[450px] mx-auto leading-relaxed" />
          <div className="pt-4 flex justify-center">
            <button onClick={() => setIsVideoOpen(true)} className="w-16 h-16 rounded-full bg-nanohana text-earth flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xl animate-bounce" aria-label="Play Walkthrough">
              <Play className="w-6 h-6 fill-earth text-earth ml-1" />
            </button>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {isVideoOpen && (
        <div id="video-overlay" className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-2 sm:p-5 cursor-pointer" onClick={() => setIsVideoOpen(false)}>
          <div className="relative bg-black rounded-xl max-w-5xl w-full overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setIsVideoOpen(false)} className="absolute top-4 right-4 text-white hover:text-nanohana p-2 z-10 bg-black/50 rounded-full transition-colors" aria-label="Close Video"><X className="w-6 h-6" /></button>
            <div className="w-full aspect-video bg-black flex items-center justify-center relative">
              <video className="w-full h-full object-contain" controls autoPlay playsInline src="/nanohana-video.mp4">Your browser does not support the video tag.</video>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 8 — REVIEWS */}
      <section id="reviews" className="bg-cream py-20 text-earth overflow-hidden">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="max-w-[1240px] mx-auto px-5 md:px-10 lg:px-20"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-phewa" />
                <span className="text-[11px] font-mono uppercase tracking-[0.15em] text-phewa font-semibold">What guests say</span>
              </div>
              <EditableText as="h2" page="home" contentKey="reviews_title" defaultText={'146 reviews. One word is constantly repeated: "clean".'} currentText={getText('reviews_title')} editMode={editMode} className="font-serif text-3xl md:text-4xl font-medium tracking-tight" />
            </div>
            <a id="view-tripadvisor-reviews" href="https://www.tripadvisor.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-4 md:mt-0 text-sm font-semibold text-phewa hover:text-nanohana transition-colors">
              Read all on TripAdvisor <ExternalLinkIcon className="w-4 h-4" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Review 1 */}
            <div className="p-6 bg-cream border border-earth/10 rounded-xl space-y-4 flex flex-col justify-between h-full">
              <div className="space-y-3">
                <div className="flex items-center gap-1">{[...Array(5)].map((_, i) => (<Star key={i} className="w-4 h-4 fill-nanohana text-nanohana" />))}</div>
                <EditableText as="p" page="home" contentKey="review1_text" defaultText={'"We decided this was our favorite hotel in all of Nepal. Best hot showers, impeccably clean rooms, beautiful gardens and rooftop deck. Friendly and helpful staff. Highly recommend."'} currentText={getText('review1_text')} editMode={editMode} className="font-serif italic text-earth/95 text-sm leading-relaxed" />
              </div>
              <div className="pt-4 border-t border-earth/10 flex items-center justify-between text-xs text-earth/70">
                <div><span className="font-semibold block text-earth font-sans">Genia L. 🇺🇸</span><span className="text-[10px]">Nov 2024</span></div>
                <span id="badge-review-1" className="px-2 py-0.5 rounded bg-phewa/10 text-phewa font-mono font-bold">TripAdvisor</span>
              </div>
            </div>
            {/* Review 2 */}
            <div className="p-6 bg-cream border border-earth/10 rounded-xl space-y-4 flex flex-col justify-between h-full">
              <div className="space-y-3">
                <div className="flex items-center gap-1">{[...Array(5)].map((_, i) => (<Star key={i} className="w-4 h-4 fill-nanohana text-nanohana" />))}</div>
                <EditableText as="p" page="home" contentKey="review2_text" defaultText={'"Although a 10-story building is built nearby, one lives here in a small oasis. Modernized 3-story lodge, cozy rooms with renovated bathrooms, and lovingly arranged flowering plants on every terrace."'} currentText={getText('review2_text')} editMode={editMode} className="font-serif italic text-earth/95 text-sm leading-relaxed" />
              </div>
              <div className="pt-4 border-t border-earth/10 flex items-center justify-between text-xs text-earth/70">
                <div><span className="font-semibold block text-earth font-sans">Alfred S. 🇩🇪</span><span className="text-[10px]">Nov 2024</span></div>
                <span id="badge-review-2" className="px-2 py-0.5 rounded bg-phewa/10 text-phewa font-mono font-bold">Booking.com</span>
              </div>
            </div>
            {/* Review 3 */}
            <div className="p-6 bg-cream border border-earth/10 rounded-xl space-y-4 flex flex-col justify-between h-full">
              <div className="space-y-3">
                <div className="flex items-center gap-1">{[...Array(5)].map((_, i) => (<Star key={i} className="w-4 h-4 fill-nanohana text-nanohana" />))}</div>
                <EditableText as="p" page="home" contentKey="review3_text" defaultText={'"What a jewel. The whole place is immaculately clean. The shady balcony garden is an oasis of calm. As a solo female traveller I was completely comfortable. Would not hesitate to recommend."'} currentText={getText('review3_text')} editMode={editMode} className="font-serif italic text-earth/95 text-sm leading-relaxed" />
              </div>
              <div className="pt-4 border-t border-earth/10 flex items-center justify-between text-xs text-earth/70">
                <div><span className="font-semibold block text-earth font-sans">Lesley S. 🇬🇧</span><span className="text-[10px]">Nov 2022</span></div>
                <span id="badge-review-3" className="px-2 py-0.5 rounded bg-phewa/10 text-phewa font-mono font-bold">TripAdvisor</span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* SECTION 9 — SUSTAINABILITY PLEDGE */}
      <section id="sustainability" className="bg-forest text-cream py-20 border-t border-white/5 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="max-w-[1240px] mx-auto px-5 md:px-10 lg:px-20 grid grid-cols-1 lg:grid-cols-12 gap-12"
        >
          <div className="lg:col-span-6 space-y-6">
            <Quote className="w-12 h-12 text-nanohana" />
            <EditableText as="h3" page="home" contentKey="sustainability_quote" defaultText={`"Caring for our environment shouldn't be complicated; it just takes a bit of common sense and a lot of heart."`} currentText={getText('sustainability_quote')} editMode={editMode} className="font-serif text-3xl sm:text-4xl text-cream font-medium leading-tight" />
            <p className="text-sage text-sm font-mono tracking-wider">— Kul Bahadur Acharya, Founder</p>
            <EditableText as="p" page="home" contentKey="sustainability_desc" defaultText="We prefer to keep our eco-efforts simple and genuine, rather than making a big fuss. For instance, we place simple water bottles in our toilet tanks to save 2 liters per flush. We prioritize buying local, hiring neighbors, and keeping our footprint as gentle as the mountain breeze." currentText={getText('sustainability_desc')} editMode={editMode} className="text-cream/80 text-sm leading-relaxed" />
          </div>

          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 bg-white/5 border border-white/10 rounded-xl space-y-2">
              <Droplet className="w-6 h-6 text-nanohana" />
              <EditableText as="h4" page="home" contentKey="eco1_title" defaultText="Water Conservation" currentText={getText('eco1_title')} editMode={editMode} className="font-serif text-md font-semibold text-cream" />
              <EditableText as="p" page="home" contentKey="eco1_desc" defaultText="Simple water-bottle restrictors in our toilets save 2 liters per flush." currentText={getText('eco1_desc')} editMode={editMode} className="text-xs text-cream/75" />
            </div>
            <div className="p-5 bg-white/5 border border-white/10 rounded-xl space-y-2">
              <Users className="w-6 h-6 text-nanohana" />
              <EditableText as="h4" page="home" contentKey="eco2_title" defaultText="Local Community Support" currentText={getText('eco2_title')} editMode={editMode} className="font-serif text-md font-semibold text-cream" />
              <EditableText as="p" page="home" contentKey="eco2_desc" defaultText="We only work with certified, local guides, cooks, and drivers." currentText={getText('eco2_desc')} editMode={editMode} className="text-xs text-cream/75" />
            </div>
            <div className="hidden sm:block p-5 bg-white/5 border border-white/10 rounded-xl space-y-2">
              <Leaf className="w-6 h-6 text-nanohana" />
              <EditableText as="h4" page="home" contentKey="eco3_title" defaultText="Minimalist Green Footprint" currentText={getText('eco3_title')} editMode={editMode} className="font-serif text-md font-semibold text-cream" />
              <EditableText as="p" page="home" contentKey="eco3_desc" defaultText="Solar water heaters and plastic-free bathrooms." currentText={getText('eco3_desc')} editMode={editMode} className="text-xs text-cream/75" />
            </div>
            <div className="hidden sm:block p-5 bg-white/5 border border-white/10 rounded-xl space-y-2">
              <Flame className="w-6 h-6 text-nanohana" />
              <EditableText as="h4" page="home" contentKey="eco4_title" defaultText="Real Organic Produce" currentText={getText('eco4_title')} editMode={editMode} className="font-serif text-md font-semibold text-cream" />
              <EditableText as="p" page="home" contentKey="eco4_desc" defaultText="Fresh herbs come straight from our garden." currentText={getText('eco4_desc')} editMode={editMode} className="text-xs text-cream/75" />
            </div>
          </div>
        </motion.div>
      </section>

      {/* SECTION 10 — CTA BANNER */}
      <section id="book-cta-banner" className="bg-nanohana text-earth py-20 text-center overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
          className="max-w-[700px] mx-auto px-5 space-y-6"
        >
          <EditableText as="h2" page="home" contentKey="cta_title" defaultText="Ready to wake up to the Annapurnas?" currentText={getText('cta_title')} editMode={editMode} className="font-serif text-4xl font-medium leading-tight" />
          <EditableText as="p" page="home" contentKey="cta_desc" defaultText="The best rates, guaranteed. No hidden fees." currentText={getText('cta_desc')} editMode={editMode} className="text-earth/80 max-w-[480px] mx-auto text-sm leading-relaxed" />
          <div className="pt-4">
            <Link id="cta-reserve-btn" href="/reservations" className="px-8 py-4 bg-forest text-cream font-sans text-sm font-semibold tracking-wide rounded-full hover:bg-forest/90 active:scale-95 transition-all inline-block shadow-lg">
              Reserve your room →
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

function ExternalLinkIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </svg>
  );
}
