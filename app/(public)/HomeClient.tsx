'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
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
  Leaf,
  Phone
} from 'lucide-react';
import EditableText from '@/components/EditableText';
import { defaultRooms } from '@/lib/defaultRooms';

export default function HomeClient({ content = [], editMode = false }: { content?: any[], editMode?: boolean }) {
  const getText = React.useCallback((key: string) => content.find((c: any) => c.key === key)?.value, [content]);

  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [activeCarouselIndex, setActiveCarouselIndex] = useState(0);

  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 1000], ['0%', '30%']);

  const rawRooms = content.find((c: any) => c.key === 'global_rooms_list')?.value;
  
  const DB_ROOMS = React.useMemo(() => {
    try {
      return rawRooms ? JSON.parse(rawRooms) : defaultRooms;
    } catch(e) {
      return defaultRooms;
    }
  }, [rawRooms]);

  const roomsData = React.useMemo(() => DB_ROOMS.map((r: any) => ({
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
  })), [DB_ROOMS]);

  const handleNextCarousel = React.useCallback(() => {
    setActiveCarouselIndex((prev) => (prev + 1) % roomsData.length);
  }, [roomsData.length]);

  const handlePrevCarousel = React.useCallback(() => {
    setActiveCarouselIndex((prev) => (prev - 1 + roomsData.length) % roomsData.length);
  }, [roomsData.length]);

  return (
    <div id="home-page" className="w-full font-sans bg-cream text-earth">
      {/* SECTION 1 — HERO SECTION */}
      <section id="hero-section" className="relative h-screen min-h-[600px] md:min-h-[800px] w-full overflow-hidden flex items-center justify-center">
        <motion.div className="absolute -inset-y-[15%] inset-x-0 z-0 w-full h-[130%]" style={{ y: heroY }}>
          <EditableImage 
            page="home"
            contentKey="home_hero_bg"
            defaultSrc="/hero-bg.png"
            currentSrc={getText('home_hero_bg')}
            editMode={editMode}
            alt="Nanohana Lodge Front View" 
            fill 
            priority 
            sizes="100vw"
            className="object-cover" 
          />
          <div className="absolute inset-0 bg-black/40 pointer-events-none" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
          className="relative z-10 text-center px-5 max-w-[850px] mx-auto text-cream mt-16"
        >
          <EditableText as="p" page="home" contentKey="hero_eyebrow" defaultText="Pokhara · Nepal · Est. 1990" currentText={getText('hero_eyebrow')} editMode={editMode} className="text-cream/80 text-[10px] sm:text-[11px] font-mono tracking-[0.3em] uppercase mb-6 block" />

          <EditableText as="h1" page="home" contentKey="hero_title" defaultText="Welcome to your quiet garden home by the mountains." currentText={getText('hero_title')} editMode={editMode} className="font-serif text-4xl sm:text-5xl md:text-7xl text-cream font-light leading-[1.15] mb-8 tracking-tight" />

          <EditableText as="p" page="home" contentKey="hero_desc" defaultText="We're a small, family-run lodge tucked away on a peaceful lane. Expect blooming balconies, warm Nepali smiles, and a front-row seat to the Annapurnas." currentText={getText('hero_desc')} editMode={editMode} className="text-cream/80 font-sans text-sm sm:text-base max-w-[500px] mx-auto leading-relaxed mb-12 font-light" />

          <div className="flex flex-row items-center justify-center gap-4 sm:gap-6">
            <Link id="hero-book-now" href="/reservations" className="px-8 py-4 bg-cream text-earth font-sans text-xs tracking-[0.1em] uppercase hover:bg-cream/90 transition-all text-center">
              Book your stay
            </Link>
          </div>
        </motion.div>

        {/* Bottom Banner Strip */}
        <div className="absolute bottom-0 left-0 right-0 bg-earth/90 backdrop-blur-md py-5 border-t border-white/5 z-20 hidden md:block">
          <div className="max-w-[1400px] mx-auto px-5 md:px-10 lg:px-20 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-sans text-cream/70 font-light">
            <div className="flex items-center gap-3">
              <span className="bg-white/10 px-3 py-1.5 rounded-sm text-[9px] font-mono tracking-widest uppercase">SINCE 1990</span>
              <EditableText as="span" page="home" contentKey="banner_years" defaultText="35 years of genuine hospitality" currentText={getText('banner_years')} editMode={editMode} />
            </div>
            <div className="flex items-center gap-8 text-cream/60">
              <span className="flex items-center gap-2 border-r border-cream/10 pr-8">
                <span className="font-serif text-cream text-sm">9.0</span> Booking.com
              </span>
              <span className="flex items-center gap-2 border-r border-cream/10 pr-8">
                <span className="font-serif text-cream text-sm">9.3</span> Kayak
              </span>
              <span className="flex items-center gap-2">
                <span className="font-serif text-cream text-sm">4.6</span> TripAdvisor
              </span>
            </div>
            <div className="text-cream/50 font-mono text-[10px] uppercase tracking-widest">
              ★ +6,000 Bookings
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 — FOUR TRUST PILLARS */}
      <section id="trust-pillars" className="bg-cream py-24 text-earth border-b border-earth/5 overflow-hidden">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.2 } }
          }}
          className="max-w-[1400px] mx-auto px-5 md:px-10 lg:px-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12"
        >
          {/* Pillar 1 */}
          <motion.div variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 1, ease: "easeOut" } } }} className="flex flex-col items-start md:items-center text-left md:text-center">
            <MapPin className="w-5 h-5 text-earth/40 mb-6" strokeWidth={1} />
            <EditableText as="h3" page="home" contentKey="pillar1_title" defaultText="A Peaceful Lakeside Hideaway" currentText={getText('pillar1_title')} editMode={editMode} className="font-serif text-lg font-light mb-4" />
            <EditableText as="p" page="home" contentKey="pillar1_desc" defaultText="We're nestled on a quiet lane just a short stroll from Phewa Lake. It's the perfect balance: close enough to easily explore the vibrant lakeside, yet peaceful enough for a deeply restful night's sleep." currentText={getText('pillar1_desc')} editMode={editMode} className="text-xs text-earth/60 leading-relaxed font-light" />
          </motion.div>

          {/* Pillar 2 */}
          <motion.div variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 1, ease: "easeOut" } } }} className="flex flex-col items-start md:items-center text-left md:text-center mt-8 md:mt-0">
            <Home className="w-5 h-5 text-earth/40 mb-6" strokeWidth={1} />
            <EditableText as="h3" page="home" contentKey="pillar2_title" defaultText="Spotless, Cozy Rooms" currentText={getText('pillar2_title')} editMode={editMode} className="font-serif text-lg font-light mb-4" />
            <EditableText as="p" page="home" contentKey="pillar2_desc" defaultText="You'll find marble floors, reliably hot showers, fast WiFi, and sweeping mountain views to wake up to. We obsess over cleanliness so you can simply relax." currentText={getText('pillar2_desc')} editMode={editMode} className="text-xs text-earth/60 leading-relaxed font-light" />
          </motion.div>

          {/* Pillar 3 */}
          <motion.div variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 1, ease: "easeOut" } } }} className="flex flex-col items-start md:items-center text-left md:text-center mt-8 lg:mt-0">
            <HeartHandshake className="w-5 h-5 text-earth/40 mb-6" strokeWidth={1} />
            <EditableText as="h3" page="home" contentKey="pillar3_title" defaultText="A Family Who Cares" currentText={getText('pillar3_title')} editMode={editMode} className="font-serif text-lg font-light mb-4" />
            <EditableText as="p" page="home" contentKey="pillar3_desc" defaultText="Kishor, Rabin, Robyn, and the rest of our family team are here for you. Whether you need help planning a trek or just want a good local coffee recommendation, we love helping our guests." currentText={getText('pillar3_desc')} editMode={editMode} className="text-xs text-earth/60 leading-relaxed font-light" />
          </motion.div>

          {/* Pillar 4 */}
          <motion.div variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 1, ease: "easeOut" } } }} className="flex flex-col items-start md:items-center text-left md:text-center mt-8 lg:mt-0">
            <Tag className="w-5 h-5 text-earth/40 mb-6" strokeWidth={1} />
            <EditableText as="h3" page="home" contentKey="pillar4_title" defaultText="Honest, Accessible Value" currentText={getText('pillar4_title')} editMode={editMode} className="font-serif text-lg font-light mb-4" />
            <EditableText as="p" page="home" contentKey="pillar4_desc" defaultText="We believe a beautiful, comfortable stay shouldn't break the bank. With cozy rooms starting from just $12 a night, we offer genuine Nepalese hospitality that travelers can afford." currentText={getText('pillar4_desc')} editMode={editMode} className="text-xs text-earth/60 leading-relaxed font-light" />
          </motion.div>
        </motion.div>
      </section>

      {/* SECTION 3 — WELCOME TO NANOHANA (STORY) */}
      <section id="welcome-nanohana" className="bg-cream text-earth py-24 md:py-32 overflow-hidden relative">
        <div className="max-w-[1400px] mx-auto px-5 md:px-10 lg:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            
            {/* Left Column - Text */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1 }}
              className="lg:col-span-5 relative z-10"
            >
              <div className="flex items-center gap-4 mb-10">
                <span className="w-12 h-[1px] bg-earth/30" />
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-earth/50">Our Story</span>
              </div>
              <EditableText as="h2" page="home" contentKey="founding_title" defaultText="Built on a lifelong love of hosting travelers." currentText={getText('founding_title')} editMode={editMode} className="font-serif text-3xl md:text-5xl text-earth font-light leading-[1.15] mb-8" />
              <div className="text-earth/60 text-sm md:text-base leading-relaxed space-y-6 font-light">
                <EditableText as="p" page="home" contentKey="founding_body" defaultText="Hospitality runs in our blood. Our founder, Kul Bahadur Acharya, comes from a family that opened Lakeside's very first guesthouse over 30 years ago. When he built Nanohana right across from his own family home, he wanted to create a place that felt like an extension of his living room—blending quietly into the natural garden and feeling instantly like home." currentText={getText('founding_body')} editMode={editMode} />
                <EditableText as="p" page="home" contentKey="founding_body2" defaultText="From the flowers we tend on our balconies to our simple eco-friendly touches, everything we do is rooted in the belief that a memorable stay shouldn't cost the earth." currentText={getText('founding_body2')} editMode={editMode} />
              </div>
              <div className="mt-12">
                <Link id="welcome-read-story" href="/about" className="inline-flex items-center gap-3 text-earth text-xs tracking-[0.2em] uppercase hover:opacity-70 transition-opacity border-b border-earth/30 pb-1">
                  Read our story <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </motion.div>

            {/* Right Column - Asymmetrical Images */}
            <div className="lg:col-span-7 relative h-[500px] sm:h-[700px] lg:h-[800px] mt-10 lg:mt-0 mb-16 md:mb-0">
              {/* Desktop Asymmetry */}
              <div className="hidden md:block w-full h-full relative">
                <motion.div 
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="absolute top-0 right-0 w-[65%] h-[70%] z-0"
                >
                  <EditableImage page="home" contentKey="home_story_1" defaultSrc="/story_home.jpg" currentSrc={getText('home_story_1')} editMode={editMode} alt="Nanohana Lodge Story" fill className="object-cover" />
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.4 }}
                  className="absolute bottom-10 left-0 w-[55%] h-[55%] z-20"
                >
                  <EditableImage page="home" contentKey="home_story_2" defaultSrc="/story_home2.jpg" currentSrc={getText('home_story_2')} editMode={editMode} alt="Nanohana Lodge Garden" fill className="object-cover" />
                  
                  {/* Overlapping Text Box */}
                  <div className="absolute -bottom-10 -right-10 bg-cream p-8 w-72 shadow-xl z-30 border border-earth/5">
                    <EditableText as="p" page="home" contentKey="founding_quote" defaultText={`"17 rooms. Three storeys. One peaceful rooftop with a view of the Annapurna range that guests say they will never forget."`} currentText={getText('founding_quote')} editMode={editMode} className="text-earth text-sm font-serif italic leading-relaxed" />
                  </div>
                </motion.div>
              </div>

              {/* Mobile Hero Image */}
              <div className="block md:hidden absolute inset-0 z-10">
                <EditableImage page="home" contentKey="home_story_hero" defaultSrc="/story_hero.jpg" currentSrc={getText('home_story_hero')} editMode={editMode} alt="Nanohana Lodge Hero" fill className="object-cover" />
                <div className="absolute -bottom-6 left-4 right-4 bg-cream p-6 shadow-xl z-30 border border-earth/5">
                  <EditableText as="p" page="home" contentKey="founding_quote" defaultText={`"17 rooms. Three storeys. One peaceful rooftop with a view of the Annapurna range that guests say they will never forget."`} currentText={getText('founding_quote')} editMode={editMode} className="text-earth text-sm font-serif italic" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 4 — RATING STRIP */}
      <section id="ratings-strip" className="bg-earth text-cream py-16 overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 1 }}
          className="max-w-[1400px] mx-auto px-5 md:px-10 lg:px-20 grid grid-cols-1 md:grid-cols-3 gap-12 text-center"
        >
          <div className="p-4 md:border-r border-cream/10">
            <span className="block text-xl font-serif text-cream/70 mb-2 font-light">Booking.com</span>
            <span className="text-4xl font-serif text-cream font-light mb-3 block">9.0/10</span>
            <EditableText as="p" page="home" contentKey="rating_booking" defaultText="Wonderful · +3.5K Reviews Verified" currentText={getText('rating_booking')} editMode={editMode} className="text-[10px] text-cream/40 font-mono uppercase tracking-widest" />
          </div>
          <div className="hidden md:block p-4 md:border-r border-cream/10">
            <span className="block text-xl font-serif text-cream/70 mb-2 font-light">Kayak</span>
            <span className="text-4xl font-serif text-cream font-light mb-3 block">9.3/10</span>
            <EditableText as="p" page="home" contentKey="rating_kayak" defaultText="Excellent · 271 direct guest posts" currentText={getText('rating_kayak')} editMode={editMode} className="text-[10px] text-cream/40 font-mono uppercase tracking-widest" />
          </div>
          <div className="p-4">
            <span className="block text-xl font-serif text-cream/70 mb-2 font-light">TripAdvisor</span>
            <span className="text-4xl font-serif text-cream font-light mb-3 block">4.6/5</span>
            <EditableText as="p" page="home" contentKey="rating_tripadvisor" defaultText="Travellers' Choice · #8 of 59 Lodges" currentText={getText('rating_tripadvisor')} editMode={editMode} className="text-[10px] text-cream/40 font-mono uppercase tracking-widest" />
          </div>
        </motion.div>
      </section>

      {/* SECTION 4.5 — RECEPTIONIST */}
      <section id="receptionist" className="bg-white py-24 md:py-32 overflow-hidden relative border-b border-earth/5">
        <div className="max-w-[1400px] mx-auto px-5 md:px-10 lg:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            
            {/* Left Column - Portrait (Asymmetrical) */}
            <div className="lg:col-span-5 relative h-[400px] sm:h-[600px] w-full mt-10 lg:mt-0 order-2 lg:order-1">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="absolute top-10 left-0 w-[85%] h-[90%] z-10 bg-cream"
              >
                <EditableImage 
                  page="home" 
                  contentKey="home_receptionist_img" 
                  defaultSrc="https://picsum.photos/seed/receptionist/600/800" 
                  currentSrc={getText('home_receptionist_img')} 
                  editMode={editMode} 
                  alt="Nanohana Lodge Receptionist" 
                  fill 
                  className="object-cover" 
                />
              </motion.div>
              
              {/* Decorative block behind image */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 1, delay: 0.2 }}
                className="absolute top-0 right-0 w-[70%] h-[95%] bg-earth/5 z-0"
              />
            </div>

            {/* Right Column - Text */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 1, delay: 0.3 }}
              className="lg:col-span-7 relative z-20 flex flex-col justify-center order-1 lg:order-2"
            >
              <div className="flex items-center gap-4 mb-8">
                <span className="w-12 h-[1px] bg-earth/30" />
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-earth/50">Your Host</span>
              </div>
              
              <EditableText as="h2" page="home" contentKey="home_receptionist_name" defaultText="Robyn" currentText={getText('home_receptionist_name')} editMode={editMode} className="font-serif text-3xl md:text-5xl text-earth font-light leading-[1.15] mb-2" />
              
              <EditableText as="p" page="home" contentKey="home_receptionist_title" defaultText="Head of Guest Relations" currentText={getText('home_receptionist_title')} editMode={editMode} className="text-[11px] font-mono tracking-widest uppercase text-earth/40 mb-10" />

              <div className="relative">
                <Quote className="absolute -top-4 -left-6 w-10 h-10 text-earth/10 rotate-180" strokeWidth={1} />
                <EditableText as="p" page="home" contentKey="home_receptionist_quote" defaultText={`"I love welcoming travelers from all corners of the world. Seeing their faces light up when they catch their first glimpse of the Annapurnas from our rooftop is a joy that never gets old. Welcome to our home."`} currentText={getText('home_receptionist_quote')} editMode={editMode} className="font-serif text-lg md:text-xl text-earth/80 italic leading-relaxed pl-6 border-l border-earth/20" />
              </div>

              <div className="mt-10">
                <a 
                  href={`tel:${getText('global_contact_phone') || '+977 61-462846'}`}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-earth text-cream font-sans text-xs tracking-[0.1em] uppercase hover:bg-earth/90 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  Call the reception
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 5 — ROOM & SUITE COLLECTION */}
      <section id="rooms-carousel" className="bg-cream py-24 md:py-32 text-earth overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="max-w-[1400px] mx-auto px-5 md:px-10 lg:px-20"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <span className="w-12 h-[1px] bg-earth/30" />
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-earth/50">Rooms & Suites</span>
              </div>
              <EditableText as="h2" page="home" contentKey="rooms_title" defaultText="Simple comfort, spectacular setting." currentText={getText('rooms_title')} editMode={editMode} className="font-serif text-3xl md:text-5xl font-light tracking-tight" />
            </div>
            {roomsData.length > 0 && (
              <div className="flex items-center gap-4">
                <button onClick={handlePrevCarousel} className="p-4 bg-earth/5 border border-earth/10 hover:bg-earth/10 rounded-full transition-colors" aria-label="Previous Room"><ChevronLeft className="w-5 h-5" strokeWidth={1} /></button>
                <button onClick={handleNextCarousel} className="p-4 bg-earth/5 border border-earth/10 hover:bg-earth/10 rounded-full transition-colors" aria-label="Next Room"><ChevronRight className="w-5 h-5" strokeWidth={1} /></button>
              </div>
            )}
          </div>

          {roomsData.length === 0 ? (
            <div className="py-32 text-center border border-earth/10 bg-white">
              <p className="text-earth/60 font-serif text-xl">We are currently updating our room collection. Please check back later.</p>
            </div>
          ) : (
          <div className="flex flex-col-reverse lg:grid lg:grid-cols-12 overflow-hidden border border-earth/10 bg-white">
            <div className="lg:col-span-5 p-8 sm:p-16 flex flex-col justify-between space-y-8">
              <div>
                <span className="text-[10px] uppercase tracking-widest font-mono text-earth/50">Rates From {roomsData[activeCarouselIndex].price} / night</span>
                <h3 className="font-serif text-3xl sm:text-4xl font-light mt-4 leading-tight text-earth">{roomsData[activeCarouselIndex].name}</h3>
                <p className="text-earth/60 text-sm leading-relaxed mt-6 font-light">{roomsData[activeCarouselIndex].desc}</p>
                
                <div className="grid grid-cols-2 gap-8 mt-12 pt-10 border-t border-earth/10 text-xs">
                  <div><span className="text-earth/40 font-mono text-[9px] uppercase tracking-widest block mb-1">Floor Space</span><span className="text-earth font-light text-sm">{roomsData[activeCarouselIndex].specs.size}</span></div>
                  <div><span className="text-earth/40 font-mono text-[9px] uppercase tracking-widest block mb-1">Bed Setup</span><span className="text-earth font-light text-sm">{roomsData[activeCarouselIndex].specs.bed}</span></div>
                  <div><span className="text-earth/40 font-mono text-[9px] uppercase tracking-widest block mb-1">Capacity</span><span className="text-earth font-light text-sm">{roomsData[activeCarouselIndex].specs.guests}</span></div>
                  <div><span className="text-earth/40 font-mono text-[9px] uppercase tracking-widest block mb-1">Cooling/Features</span><span className="text-earth font-light text-sm">{roomsData[activeCarouselIndex].specs.ac}</span></div>
                </div>
              </div>
              <div className="flex flex-row items-center gap-4 pt-8 border-t border-earth/10">
                <Link id={`book-room-${activeCarouselIndex}`} href="/reservations" className="flex-1 py-4 text-center bg-earth text-cream font-sans text-xs tracking-[0.1em] uppercase hover:bg-earth/90 transition-colors">Book now</Link>
                <Link id={`view-room-${activeCarouselIndex}`} href="/rooms" className="flex-1 py-4 text-center border border-earth/20 text-earth font-sans text-xs tracking-[0.1em] uppercase hover:bg-earth/5 transition-colors">View details</Link>
              </div>
            </div>
            <div className="lg:col-span-7 relative min-h-[300px] sm:min-h-[500px] lg:min-h-full w-full">
              <EditableImage page="home" contentKey={`home_room_carousel_${roomsData[activeCarouselIndex].id}`} defaultSrc={roomsData[activeCarouselIndex].image} currentSrc={getText(`home_room_carousel_${roomsData[activeCarouselIndex].id}`)} editMode={editMode} alt={roomsData[activeCarouselIndex].name} fill className="object-cover" referrerPolicy="no-referrer" />
            </div>
          </div>
          )}

          <div className="text-center mt-16">
            <Link id="view-all-rooms" href="/rooms" className="inline-flex items-center gap-3 text-earth text-xs tracking-[0.2em] uppercase hover:opacity-70 transition-opacity border-b border-earth/30 pb-1">
              See all rooms & rates <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* SECTION 6 & 7 COMBINED — ATMOSPHERE & AMENITIES BENTO BOX */}
      <section id="amenities-bento" className="bg-earth py-24 md:py-32 text-cream overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-5 md:px-10 lg:px-20">
          
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-8">
            <div className="max-w-[600px] space-y-6">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-cream/50 block">Atmosphere & Amenities</span>
              <EditableText as="h2" page="home" contentKey="amenities_title" defaultText="Everything you need for the perfect Nepalese escape." currentText={getText('amenities_title')} editMode={editMode} className="font-serif text-3xl md:text-5xl text-cream font-light leading-tight" />
            </div>
            <div className="max-w-[400px]">
              <EditableText as="p" page="home" contentKey="walkthrough_desc" defaultText="Take a 1-minute visual journey around our blooming hotel garden, clean cozy rooms, and quiet rooftop mountains." currentText={getText('walkthrough_desc')} editMode={editMode} className="text-cream/60 text-sm font-light leading-relaxed" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-3 gap-1 md:gap-4 h-auto md:h-[900px]">
            
            {/* Bento 1: Large Image / Atmosphere Walkthrough (spans 2 cols, 2 rows) */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="md:col-span-2 md:row-span-2 relative group overflow-hidden bg-forest h-[400px] md:h-auto"
            >
              <EditableImage page="home" contentKey="home_atmosphere_bg" defaultSrc="https://picsum.photos/seed/nepaltravel/1600/900" currentSrc={getText('home_atmosphere_bg')} editMode={editMode} alt="Atmosphere Pokhara landscape" fill className="object-cover transition-transform duration-[2s] group-hover:scale-105" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-black/20 transition-colors duration-500 group-hover:bg-black/40" />
              <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end">
                <EditableText as="h2" page="home" contentKey="walkthrough_title" defaultText="Explore Nanohana Lodge" currentText={getText('walkthrough_title')} editMode={editMode} className="font-serif text-3xl md:text-4xl font-light text-cream mb-6 drop-shadow-md" />
                <button onClick={() => setIsVideoOpen(true)} className="w-14 h-14 rounded-full border border-cream/50 flex items-center justify-center hover:bg-cream hover:text-earth transition-all backdrop-blur-sm" aria-label="Play Walkthrough">
                  <Play className="w-5 h-5 ml-1" />
                </button>
              </div>
            </motion.div>

            {/* Bento 2: WiFi (1 col, 1 row) */}
            <div className="md:col-span-1 md:row-span-1 bg-cream/5 p-8 flex flex-col justify-center border border-cream/5 hover:bg-cream/10 transition-colors h-[250px] md:h-auto">
              <Wifi className="w-6 h-6 text-cream/70 mb-6" strokeWidth={1} />
              <EditableText as="h3" page="home" contentKey="amenity1_title" defaultText="High-speed WiFi" currentText={getText('amenity1_title')} editMode={editMode} className="font-serif text-xl font-light mb-3 text-cream" />
              <EditableText as="p" page="home" contentKey="amenity1_desc" defaultText="Fast, reliable fiber WiFi everywhere. Perfect for planning your trek or catching up on work." currentText={getText('amenity1_desc')} editMode={editMode} className="text-xs text-cream/50 leading-relaxed font-light" />
            </div>

            {/* Bento 3: Rooftop (1 col, 2 rows) */}
            <div className="md:col-span-1 md:row-span-2 bg-cream/5 p-8 flex flex-col justify-between border border-cream/5 hover:bg-cream/10 transition-colors relative overflow-hidden h-[300px] md:h-auto">
              <Compass className="w-6 h-6 text-cream/70 mb-6 relative z-10" strokeWidth={1} />
              <div className="relative z-10 mt-auto">
                <EditableText as="h3" page="home" contentKey="amenity6_title" defaultText="Panoramic Rooftop" currentText={getText('amenity6_title')} editMode={editMode} className="font-serif text-xl font-light mb-3 text-cream" />
                <EditableText as="p" page="home" contentKey="amenity6_desc" defaultText="Watch the sunrise over the Annapurnas, read a book, or plan your next day in Pokhara." currentText={getText('amenity6_desc')} editMode={editMode} className="text-xs text-cream/50 leading-relaxed font-light" />
              </div>
            </div>

            {/* Bento 4: Coffee (1 col, 1 row) */}
            <div className="md:col-span-1 md:row-span-1 bg-cream/5 p-8 flex flex-col justify-center border border-cream/5 hover:bg-cream/10 transition-colors h-[250px] md:h-auto">
              <Coffee className="w-6 h-6 text-cream/70 mb-6" strokeWidth={1} />
              <EditableText as="h3" page="home" contentKey="amenity3_title" defaultText="Local Eateries" currentText={getText('amenity3_title')} editMode={editMode} className="font-serif text-xl font-light mb-3 text-cream" />
              <EditableText as="p" page="home" contentKey="amenity3_desc" defaultText="Enjoy great coffee or a hot meal just down the lane." currentText={getText('amenity3_desc')} editMode={editMode} className="text-xs text-cream/50 leading-relaxed font-light" />
            </div>

            {/* Bento 5: Parking (1 col, 1 row) */}
            <div className="md:col-span-1 md:row-span-1 bg-cream/5 p-8 flex flex-col justify-center border border-cream/5 hover:bg-cream/10 transition-colors h-[250px] md:h-auto">
              <SquareParking className="w-6 h-6 text-cream/70 mb-6" strokeWidth={1} />
              <EditableText as="h3" page="home" contentKey="amenity2_title" defaultText="Free Private Parking" currentText={getText('amenity2_title')} editMode={editMode} className="font-serif text-xl font-light mb-3 text-cream" />
              <EditableText as="p" page="home" contentKey="amenity2_desc" defaultText="Free, secure parking for your car or motorcycle right on the property." currentText={getText('amenity2_desc')} editMode={editMode} className="text-xs text-cream/50 leading-relaxed font-light" />
            </div>

            {/* Bento 6: Support (1 col, 1 row) */}
            <div className="md:col-span-1 md:row-span-1 bg-cream/5 p-8 flex flex-col justify-center border border-cream/5 hover:bg-cream/10 transition-colors h-[250px] md:h-auto">
              <Heart className="w-6 h-6 text-cream/70 mb-6" strokeWidth={1} />
              <EditableText as="h3" page="home" contentKey="amenity4_title" defaultText="Professional Support" currentText={getText('amenity4_title')} editMode={editMode} className="font-serif text-xl font-light mb-3 text-cream" />
              <EditableText as="p" page="home" contentKey="amenity4_desc" defaultText="Seeing Hands Massage is just down the street, or we can arrange an in-room foot massage for you." currentText={getText('amenity4_desc')} editMode={editMode} className="text-xs text-cream/50 leading-relaxed font-light" />
            </div>

            {/* Bento 7: Bicycles (2 cols, 1 row) */}
            <div className="md:col-span-2 md:row-span-1 bg-cream/5 p-8 flex flex-col justify-center border border-cream/5 hover:bg-cream/10 transition-colors h-[250px] md:h-auto">
              <Bike className="w-6 h-6 text-cream/70 mb-6" strokeWidth={1} />
              <EditableText as="h3" page="home" contentKey="amenity5_title" defaultText="Bicycle Rentals" currentText={getText('amenity5_title')} editMode={editMode} className="font-serif text-xl font-light mb-3 text-cream" />
              <EditableText as="p" page="home" contentKey="amenity5_desc" defaultText="Rent a bicycle from us to explore Lakeside, visit Phewa Lake, or ride to the Peace Pagoda." currentText={getText('amenity5_desc')} editMode={editMode} className="text-xs text-cream/50 leading-relaxed font-light max-w-md" />
            </div>

          </div>
        </div>
      </section>

      {/* Video Modal */}
      {isVideoOpen && (
        <div id="video-overlay" className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-2 sm:p-5 cursor-pointer" onClick={() => setIsVideoOpen(false)}>
          <div className="relative bg-black rounded-xl max-w-5xl w-full overflow-hidden shadow-2xl border border-white/10" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setIsVideoOpen(false)} className="absolute top-4 right-4 text-white hover:text-cream/70 p-2 z-10 transition-colors" aria-label="Close Video"><X className="w-6 h-6" strokeWidth={1} /></button>
            <div className="w-full aspect-video bg-black flex items-center justify-center relative">
              <video className="w-full h-full object-contain" controls autoPlay playsInline src="/nanohana-video.mp4">Your browser does not support the video tag.</video>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 8 — REVIEWS */}
      <section id="reviews" className="bg-cream py-24 md:py-32 text-earth overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 1 }}
          className="max-w-[1400px] mx-auto px-5 md:px-10 lg:px-20"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 border-b border-earth/10 pb-8 gap-6">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <span className="w-12 h-[1px] bg-earth/30" />
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-earth/50">What guests say</span>
              </div>
              <EditableText as="h2" page="home" contentKey="reviews_title" defaultText={'146 reviews. One word is constantly repeated: "clean".'} currentText={getText('reviews_title')} editMode={editMode} className="font-serif text-3xl md:text-5xl font-light tracking-tight max-w-[800px] leading-tight" />
            </div>
            <a id="view-tripadvisor-reviews" href="https://www.tripadvisor.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] font-mono text-earth/60 hover:text-earth transition-colors">
              Read all on TripAdvisor <ExternalLinkIcon className="w-3 h-3" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {/* Review 1 */}
            <div className="space-y-6 flex flex-col justify-between h-full">
              <div className="space-y-6">
                <div className="flex items-center gap-2">{[...Array(5)].map((_, i) => (<Star key={i} className="w-3 h-3 fill-earth/20 text-earth/20" />))}</div>
                <EditableText as="p" page="home" contentKey="review1_text" defaultText={'"We decided this was our favorite hotel in all of Nepal. Best hot showers, impeccably clean rooms, beautiful gardens and rooftop deck. Friendly and helpful staff. Highly recommend."'} currentText={getText('review1_text')} editMode={editMode} className="font-serif text-lg font-light text-earth/80 leading-relaxed" />
              </div>
              <div className="pt-6 flex items-center justify-between text-xs text-earth/50 font-mono tracking-widest uppercase">
                <div><span>Genia L.</span></div>
                <span id="badge-review-1">TripAdvisor</span>
              </div>
            </div>
            {/* Review 2 */}
            <div className="space-y-6 flex flex-col justify-between h-full">
              <div className="space-y-6">
                <div className="flex items-center gap-2">{[...Array(5)].map((_, i) => (<Star key={i} className="w-3 h-3 fill-earth/20 text-earth/20" />))}</div>
                <EditableText as="p" page="home" contentKey="review2_text" defaultText={'"Although a 10-story building is built nearby, one lives here in a small oasis. Modernized 3-story lodge, cozy rooms with renovated bathrooms, and lovingly arranged flowering plants on every terrace."'} currentText={getText('review2_text')} editMode={editMode} className="font-serif text-lg font-light text-earth/80 leading-relaxed" />
              </div>
              <div className="pt-6 flex items-center justify-between text-xs text-earth/50 font-mono tracking-widest uppercase">
                <div><span>Alfred S.</span></div>
                <span id="badge-review-2">Booking.com</span>
              </div>
            </div>
            {/* Review 3 */}
            <div className="space-y-6 flex flex-col justify-between h-full">
              <div className="space-y-6">
                <div className="flex items-center gap-2">{[...Array(5)].map((_, i) => (<Star key={i} className="w-3 h-3 fill-earth/20 text-earth/20" />))}</div>
                <EditableText as="p" page="home" contentKey="review3_text" defaultText={'"What a jewel. The whole place is immaculately clean. The shady balcony garden is an oasis of calm. As a solo female traveller I was completely comfortable. Would not hesitate to recommend."'} currentText={getText('review3_text')} editMode={editMode} className="font-serif text-lg font-light text-earth/80 leading-relaxed" />
              </div>
              <div className="pt-6 flex items-center justify-between text-xs text-earth/50 font-mono tracking-widest uppercase">
                <div><span>Lesley S.</span></div>
                <span id="badge-review-3">TripAdvisor</span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* SECTION 9 — SUSTAINABILITY PLEDGE */}
      <section id="sustainability" className="bg-white text-earth py-24 md:py-32 border-t border-earth/5 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 1 }}
          className="max-w-[1400px] mx-auto px-5 md:px-10 lg:px-20 grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24"
        >
          <div className="lg:col-span-5 space-y-8">
            <Quote className="w-8 h-8 text-earth/20" strokeWidth={1} />
            <EditableText as="h3" page="home" contentKey="sustainability_quote" defaultText={`"Caring for our environment shouldn't be complicated; it just takes a bit of common sense and a lot of heart."`} currentText={getText('sustainability_quote')} editMode={editMode} className="font-serif text-3xl md:text-4xl text-earth font-light leading-tight" />
            <p className="text-earth/40 text-[10px] font-mono tracking-widest uppercase">— Kul Bahadur Acharya, Founder</p>
            <EditableText as="p" page="home" contentKey="sustainability_desc" defaultText="We prefer to keep our eco-efforts simple and genuine, rather than making a big fuss. For instance, we place simple water bottles in our toilet tanks to save 2 liters per flush. We prioritize buying local, hiring neighbors, and keeping our footprint as gentle as the mountain breeze." currentText={getText('sustainability_desc')} editMode={editMode} className="text-earth/60 text-sm leading-relaxed font-light pt-4 border-t border-earth/10" />
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-12">
            <div className="space-y-4">
              <Droplet className="w-5 h-5 text-earth/40" strokeWidth={1} />
              <EditableText as="h4" page="home" contentKey="eco1_title" defaultText="Water Conservation" currentText={getText('eco1_title')} editMode={editMode} className="font-serif text-xl font-light text-earth" />
              <EditableText as="p" page="home" contentKey="eco1_desc" defaultText="Simple water-bottle restrictors in our toilets save 2 liters per flush." currentText={getText('eco1_desc')} editMode={editMode} className="text-sm text-earth/60 font-light leading-relaxed" />
            </div>
            <div className="space-y-4">
              <Users className="w-5 h-5 text-earth/40" strokeWidth={1} />
              <EditableText as="h4" page="home" contentKey="eco2_title" defaultText="Local Community Support" currentText={getText('eco2_title')} editMode={editMode} className="font-serif text-xl font-light text-earth" />
              <EditableText as="p" page="home" contentKey="eco2_desc" defaultText="We only work with certified, local guides, cooks, and drivers." currentText={getText('eco2_desc')} editMode={editMode} className="text-sm text-earth/60 font-light leading-relaxed" />
            </div>
            <div className="space-y-4">
              <Leaf className="w-5 h-5 text-earth/40" strokeWidth={1} />
              <EditableText as="h4" page="home" contentKey="eco3_title" defaultText="Minimalist Green Footprint" currentText={getText('eco3_title')} editMode={editMode} className="font-serif text-xl font-light text-earth" />
              <EditableText as="p" page="home" contentKey="eco3_desc" defaultText="Solar water heaters and plastic-free bathrooms." currentText={getText('eco3_desc')} editMode={editMode} className="text-sm text-earth/60 font-light leading-relaxed" />
            </div>
            <div className="space-y-4">
              <Flame className="w-5 h-5 text-earth/40" strokeWidth={1} />
              <EditableText as="h4" page="home" contentKey="eco4_title" defaultText="Real Organic Produce" currentText={getText('eco4_title')} editMode={editMode} className="font-serif text-xl font-light text-earth" />
              <EditableText as="p" page="home" contentKey="eco4_desc" defaultText="Fresh herbs come straight from our garden." currentText={getText('eco4_desc')} editMode={editMode} className="text-sm text-earth/60 font-light leading-relaxed" />
            </div>
          </div>
        </motion.div>
      </section>

      {/* SECTION 10 — CTA BANNER */}
      <section id="book-cta-banner" className="bg-earth text-cream py-32 text-center overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 1 }}
          className="max-w-[700px] mx-auto px-5 space-y-10"
        >
          <EditableText as="h2" page="home" contentKey="cta_title" defaultText="Ready to wake up to the Annapurnas?" currentText={getText('cta_title')} editMode={editMode} className="font-serif text-4xl md:text-5xl font-light leading-tight" />
          <EditableText as="p" page="home" contentKey="cta_desc" defaultText="The best rates, guaranteed. No hidden fees." currentText={getText('cta_desc')} editMode={editMode} className="text-cream/60 max-w-[480px] mx-auto text-sm leading-relaxed font-light" />
          <div className="pt-8">
            <Link id="cta-reserve-btn" href="/reservations" className="px-12 py-5 bg-cream text-earth font-sans text-xs tracking-[0.2em] uppercase hover:bg-cream/90 transition-all inline-block">
              Reserve your room
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
