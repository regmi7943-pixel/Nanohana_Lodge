'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
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

export default function HomePage() {
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [activeCarouselIndex, setActiveCarouselIndex] = useState(0);

  const heroSlides = [
    {
      image: 'https://picsum.photos/seed/annapurna/1600/900',
      title: 'Welcome to your quiet garden home by the mountains.',
      desc: 'We\'re a small, family-run lodge tucked away on a peaceful lane. Expect blooming balconies, warm Nepali smiles, and a front-row seat to the Annapurnas.'
    },
    {
      image: 'https://picsum.photos/seed/phewautc/1600/900',
      title: 'Lakeside Pokhara’s quietest flower-filled corner.',
      desc: 'Wake up to the golden Annapurnas, enjoy a quiet organic coffee in our garden, and feel completely at home.'
    }
  ];

  const roomsData = [
    {
      price: '$12',
      name: 'Standard Room',
      desc: 'Cozy, fan-cooled, marble-floored. Your quiet base in Lakeside.',
      image: 'https://picsum.photos/seed/nanohanastandard/1000/667',
      link: '/rooms',
      specs: { size: '18m²', bed: 'Double or twin', guests: '2 Adults', ac: 'Fan-cooled' }
    },
    {
      price: '$20',
      name: 'Deluxe Room with Terrace',
      desc: 'Private balcony, mountain view, premium TV, and an attached bathtub.',
      image: 'https://picsum.photos/seed/nanohanadeluxe/1000/667',
      link: '/rooms',
      specs: { size: '24m²', bed: '1 King Bed', guests: '2 Adults, 1 Child', ac: 'AC & Bathtub' }
    },
    {
      price: '$15',
      name: 'Garden View Room',
      desc: 'Ground-floor access to the flowering terraces. Birdsong included.',
      image: 'https://picsum.photos/seed/nanohanaview/1000/667',
      link: '/rooms',
      specs: { size: '19m²', bed: 'Double or twin', guests: '2 Adults', ac: 'Garden entrance' }
    }
  ];

  const handleNextHero = () => {
    setActiveHeroSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const handlePrevHero = () => {
    setActiveHeroSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const handleNextCarousel = () => {
    setActiveCarouselIndex((prev) => (prev + 1) % roomsData.length);
  };

  const handlePrevCarousel = () => {
    setActiveCarouselIndex((prev) => (prev - 1 + roomsData.length) % roomsData.length);
  };

  return (
    <div id="home-page" className="w-full">
      {/* SECTION 1 — HERO SECTION (Full viewport height) */}
      <section id="hero-section" className="relative h-screen min-h-[550px] md:min-h-[700px] w-full overflow-hidden flex items-center justify-center pb-16 md:pb-24">
        {/* Carousel Slide Images */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-bg.png"
            alt="Nanohana Lodge Front View"
            fill
            priority
            className="object-cover"
          />
          {/* Darker overlay for better contrast */}
          <div className="absolute inset-0 bg-black/65 mix-blend-multiply" />
        </div>

        {/* Content Centered */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 text-center px-5 max-w-[850px] mx-auto text-cream pt-20"
        >
          {/* Star Icons */}
          <div className="flex justify-center items-center gap-1 mb-4 animate-fade-in">
            {[...Array(4)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-nanohana text-nanohana" />
            ))}
          </div>

          {/* Eyebrow */}
          <p className="text-stone text-[11px] font-mono tracking-[0.15em] uppercase mb-4">
            Pokhara · Nepal · Est. 1990
          </p>

          {/* Title */}
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl text-cream font-medium leading-[1.12] mb-6 tracking-tight">
            Welcome to your quiet garden home by the mountains.
          </h1>

          {/* Description */}
          <p className="text-cream/80 font-sans text-base sm:text-lg max-w-[600px] mx-auto leading-relaxed mb-8">
            We're a small, family-run lodge tucked away on a peaceful lane. Expect blooming balconies, warm Nepali smiles, and a front-row seat to the Annapurnas.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-row items-center justify-center gap-3 sm:gap-4">
            <Link
              id="hero-book-now"
              href="/reservations"
              className="w-1/2 sm:w-auto px-4 py-3 sm:px-8 sm:py-3.5 rounded-full bg-nanohana text-earth font-sans text-xs sm:text-sm font-medium tracking-wide hover:bg-nanohana/90 active:scale-95 transition-all shadow-md text-center"
            >
              Book your stay →
            </Link>
            <Link
              id="hero-explore"
              href="/rooms"
              className="w-1/2 sm:w-auto px-4 py-3 sm:px-8 sm:py-3.5 rounded-full border border-cream/50 text-cream font-sans text-xs sm:text-sm font-medium hover:bg-cream/10 active:scale-95 transition-all text-center"
            >
              Explore the lodge
            </Link>
          </div>
        </motion.div>

        {/* Carousel buttons removed per user request */}

        {/* Bottom Banner Strip */}
        <div className="absolute bottom-0 left-0 right-0 bg-earth/80 backdrop-blur-sm py-4 border-t border-white/10 z-20 hidden md:block">
          <div className="max-w-[1240px] mx-auto px-5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-sans text-cream/90">
            <div className="flex items-center gap-2">
              <span className="bg-forest px-2.5 py-1 rounded text-[10px] font-mono font-medium tracking-wide">
                SINCE 1990
              </span>
              <span>35 years of genuine hospitality</span>
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

      {/* SECTION 2 — FOUR TRUST PILLARS (Warm Cream background) */}
      <section id="trust-pillars" className="bg-cream py-16 text-earth border-b border-earth/5 overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-[1240px] mx-auto px-5 md:px-10 lg:px-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          <div className="flex flex-col items-start md:items-center text-left md:text-center p-0 md:p-4">
            <div className="p-2 md:p-3 bg-phewa/10 rounded-full text-phewa mb-2 md:mb-4">
              <MapPin className="w-6 h-6 md:w-8 md:h-8" />
            </div>
            <h3 className="font-serif text-lg font-semibold mb-2">A Peaceful Lakeside Hideaway</h3>
            <p className="text-sm text-earth/75 leading-relaxed">
              We're nestled on a quiet lane just a short stroll from Phewa Lake. It's the perfect balance: close enough to easily explore the vibrant lakeside, yet peaceful enough for a deeply restful night's sleep.
            </p>
          </div>

          <div className="flex flex-col items-start md:items-center text-left md:text-center p-0 md:p-4 mt-4 md:mt-0">
            <div className="p-2 md:p-3 bg-phewa/10 rounded-full text-phewa mb-2 md:mb-4">
              <Home className="w-6 h-6 md:w-8 md:h-8" />
            </div>
            <h3 className="font-serif text-lg font-semibold mb-2">Spotless, Cozy Rooms</h3>
            <p className="text-sm text-earth/75 leading-relaxed">
              You'll find marble floors, reliably hot showers, fast WiFi, and sweeping mountain views to wake up to. We obsess over cleanliness so you can simply relax.
            </p>
          </div>

          <div className="hidden md:flex flex-col items-center text-center p-4">
            <div className="p-3 bg-phewa/10 rounded-full text-phewa mb-4">
              <HeartHandshake className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-lg font-semibold mb-2">A Family Who Cares</h3>
            <p className="text-sm text-earth/75 leading-relaxed">
              Kishor, Rabin, Robyn, and the rest of our family team are here for you. Whether you need help planning a trek or just want a good local coffee recommendation, we love helping our guests.
            </p>
          </div>

          <div className="hidden md:flex flex-col items-center text-center p-4">
            <div className="p-3 bg-phewa/10 rounded-full text-phewa mb-4">
              <Tag className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-lg font-semibold mb-2">Honest, Accessible Value</h3>
            <p className="text-sm text-earth/75 leading-relaxed">
              We believe a beautiful, comfortable stay shouldn't break the bank. With cozy rooms starting from just $12 a night, we offer genuine Nepalese hospitality that travelers can afford.
            </p>
          </div>
        </motion.div>
      </section>

      {/* SECTION 3 — WELCOME TO NANOHANA (Forest Canopy bg, two-column) */}
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
            {/* Desktop Overlapping Images Layout */}
            <div className="hidden md:block absolute inset-0">
              <div className="absolute left-0 top-0 w-2/3 h-4/5 rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                <Image
                  src="/story_home.jpg"
                  alt="Nanohana Lodge Story"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute right-0 bottom-0 w-2/3 h-4/5 rounded-2xl overflow-hidden shadow-2xl border border-white/10 z-10">
                <Image
                  src="/story_home2.jpg"
                  alt="Nanohana Lodge Garden"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Mobile Single Image Layout */}
            <div className="block md:hidden absolute inset-0 rounded-2xl overflow-hidden shadow-2xl border border-white/10">
              <Image
                src="/story_hero.jpg"
                alt="Nanohana Lodge Hero"
                fill
                className="object-cover"
              />
            </div>

            {/* Badge in between */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 bg-nanohana text-earth px-4 py-2 md:px-5 md:py-3 rounded-xl shadow-lg border border-earth/10 flex flex-col items-center text-center">
              <span className="font-serif font-bold text-lg md:text-xl">17 Rooms</span>
              <span className="text-[10px] font-mono uppercase tracking-widest font-semibold text-earth/80">
                Pokhara’s top 10%
              </span>
            </div>
          </div>

          {/* Right Column - Text details */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-phewa" />
              <span className="text-[11px] font-mono uppercase tracking-[0.15em] text-phewa font-semibold">
                Welcome to Nanohana
              </span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl text-cream font-medium leading-tight">
              Built on a lifelong love of hosting travelers.
            </h2>
            <div className="text-cream/80 text-sm leading-relaxed space-y-4">
              <p>
                Hospitality runs in our blood. Our founder, Kul Bahadur Acharya, comes from a family that opened {"Lakeside's"} very first guesthouse over 30 years ago. When he built Nanohana right across from his own family home, he wanted to create a place that felt like an extension of his living room—blending quietly into the natural garden and feeling instantly like home.
              </p>
              <p>
                From the flowers we tend on our balconies to our simple eco-friendly touches, everything we do is rooted in the belief that a memorable stay shouldn't cost the earth.
              </p>
              <p className="text-sage text-base font-serif italic pt-2">
                {"\"17 rooms. Three storeys. One peaceful rooftop with a view of the Annapurna range that guests say they will never forget.\""}
              </p>
            </div>
            <div className="pt-4">
              <Link
                id="welcome-read-story"
                href="/about"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-cream/30 text-cream hover:border-nanohana hover:text-nanohana transition-colors text-sm font-medium"
              >
                Read our story <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* SECTION 4 — RATING STRIP (Warm Cream background) */}
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
            <p className="text-xs text-earth/70 mt-1 font-mono uppercase tracking-wider">Wonderful · +3.5K Reviews Verified</p>
          </div>
          <div className="hidden md:block p-4 md:border-r border-earth/10">
            <span className="block text-2xl font-serif text-forest mb-1 font-bold">Kayak</span>
            <span className="text-3xl font-serif text-nanohana font-bold">9.3/10</span>
            <p className="text-xs text-earth/70 mt-1 font-mono uppercase tracking-wider">Excellent · 271 direct guest posts</p>
          </div>
          <div className="p-4">
            <span className="block text-2xl font-serif text-forest mb-1 font-bold">TripAdvisor</span>
            <span className="text-3xl font-serif text-nanohana font-bold">4.6/5</span>
            <p className="text-xs text-earth/70 mt-1 font-mono uppercase tracking-wider">Travellers’ Choice · #8 of 59 Lodges</p>
          </div>
        </motion.div>
      </section>

      {/* SECTION 5 — ROOM & SUITE COLLECTION (Forest Canopy background) */}
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
                <span className="text-[11px] font-mono uppercase tracking-[0.15em] text-phewa font-semibold">
                  Rooms & Suites
                </span>
              </div>
              <h2 className="font-serif text-3xl md:text-4xl font-medium tracking-tight">
                Simple comfort, spectacular setting.
              </h2>
            </div>
            <div className="flex items-center gap-3 mt-4 md:mt-0">
              <button
                onClick={handlePrevCarousel}
                className="p-3 bg-white/5 border border-white/10 hover:border-nanohana hover:text-nanohana rounded-full transition-colors"
                aria-label="Previous Room"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNextCarousel}
                className="p-3 bg-white/5 border border-white/10 hover:border-nanohana hover:text-nanohana rounded-full transition-colors"
                aria-label="Next Room"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* S5 Split Panel Carousel Card */}
          <div className="flex flex-col-reverse lg:grid lg:grid-cols-12 rounded-2xl overflow-hidden border border-white/10 bg-earth/30">
            {/* Left Specs Side */}
            <div className="lg:col-span-5 p-6 sm:p-12 flex flex-col justify-between space-y-6 md:space-y-8">
              <div>
                <span className="text-xs uppercase tracking-widest font-mono text-nanohana font-semibold">
                  Rates From {roomsData[activeCarouselIndex].price} / night
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-medium mt-2 leading-relaxed text-cream">
                  {roomsData[activeCarouselIndex].name}
                </h3>
                <p className="text-cream/80 text-sm leading-relaxed mt-3">
                  {roomsData[activeCarouselIndex].desc}
                </p>

                {/* Spec Icon Grid */}
                <div className="hidden md:grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-white/10 text-xs">
                  <div>
                    <span className="text-sage font-mono block uppercase">Floor Space</span>
                    <span className="text-cream font-medium text-sm">{roomsData[activeCarouselIndex].specs.size}</span>
                  </div>
                  <div>
                    <span className="text-sage font-mono block uppercase">Bed Setup</span>
                    <span className="text-cream font-medium text-sm">{roomsData[activeCarouselIndex].specs.bed}</span>
                  </div>
                  <div>
                    <span className="text-sage font-mono block uppercase">Capacity</span>
                    <span className="text-cream font-medium text-sm">{roomsData[activeCarouselIndex].specs.guests}</span>
                  </div>
                  <div>
                    <span className="text-sage font-mono block uppercase">Cooling/Features</span>
                    <span className="text-cream font-medium text-sm">{roomsData[activeCarouselIndex].specs.ac}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-row items-center gap-2 sm:gap-3 md:gap-4 pt-2 md:pt-4 w-full">
                <Link
                  id={`book-room-${activeCarouselIndex}`}
                  href="/reservations"
                  className="flex-1 px-2 sm:px-6 py-3 md:py-2.5 text-center rounded-full bg-nanohana text-earth font-sans text-xs font-semibold hover:bg-nanohana/90 transition-colors whitespace-nowrap"
                >
                  Book now
                </Link>
                <Link
                  id={`view-room-${activeCarouselIndex}`}
                  href="/rooms"
                  className="flex-1 px-2 sm:px-6 py-3 md:py-2.5 text-center rounded-full border border-white/25 text-cream font-sans text-xs font-semibold hover:border-nanohana hover:text-nanohana transition-colors whitespace-nowrap"
                >
                  View details →
                </Link>
              </div>
            </div>

            {/* Right Photo Side */}
            <div className="lg:col-span-7 relative min-h-[250px] sm:min-h-[400px] w-full">
              <Image
                src={roomsData[activeCarouselIndex].image}
                alt={roomsData[activeCarouselIndex].name}
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              id="view-all-rooms"
              href="/rooms"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full border border-white/20 text-cream hover:border-nanohana hover:text-nanohana transition-colors text-sm font-medium"
            >
              See all rooms & rates <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* SECTION 6 — FACILITIES & AMENITIES HIGHLIGHTS (Warm Cream background) */}
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
              <span className="text-[11px] font-mono uppercase tracking-[0.15em] text-phewa font-semibold">
                Modern and Comfortable
              </span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl text-earth font-medium leading-tight">
              Everything you need for the perfect Nepalese escape.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 bg-cream border border-earth/10 rounded-xl space-y-3">
              <Wifi className="w-8 h-8 text-phewa" />
              <h3 className="font-serif text-lg font-semibold">High-speed WiFi</h3>
              <p className="text-sm text-earth/75 leading-relaxed">
                Fast, reliable fiber WiFi everywhere. Perfect for planning your trek or catching up on work.
              </p>
            </div>

            <div className="p-6 bg-cream border border-earth/10 rounded-xl space-y-3">
              <SquareParking className="w-8 h-8 text-phewa" />
              <h3 className="font-serif text-lg font-semibold">Free Private Parking</h3>
              <p className="text-sm text-earth/75 leading-relaxed">
                Free, secure parking for your car or motorcycle right on the property.
              </p>
            </div>

            <div className="p-6 bg-cream border border-earth/10 rounded-xl space-y-3">
              <Coffee className="w-8 h-8 text-phewa" />
              <h3 className="font-serif text-lg font-semibold">Local Eateries</h3>
              <p className="text-sm text-earth/75 leading-relaxed">
                Enjoy great coffee or a hot meal just down the lane. Med5 Italian and Bamboo Garden are a 5-minute walk away.
              </p>
            </div>

            <div className="hidden md:block p-6 bg-cream border border-earth/10 rounded-xl space-y-3">
              <Heart className="w-8 h-8 text-phewa" />
              <h3 className="font-serif text-lg font-semibold">Professional Support</h3>
              <p className="text-sm text-earth/75 leading-relaxed">
                Seeing Hands Massage is just down the street, or we can arrange an in-room foot massage for you.
              </p>
            </div>

            <div className="hidden md:block p-6 bg-cream border border-earth/10 rounded-xl space-y-3">
              <Bike className="w-8 h-8 text-phewa" />
              <h3 className="font-serif text-lg font-semibold">Bicycle Rentals</h3>
              <p className="text-sm text-earth/75 leading-relaxed">
                Rent a bicycle from us to explore Lakeside, visit Phewa Lake, or ride to the Peace Pagoda.
              </p>
            </div>

            <div className="hidden md:block p-6 bg-cream border border-earth/10 rounded-xl space-y-3">
              <Compass className="w-8 h-8 text-phewa" />
              <h3 className="font-serif text-lg font-semibold">Panoramic Rooftop</h3>
              <p className="text-sm text-earth/75 leading-relaxed">
                Watch the sunrise over the Annapurnas, read a book, or plan your next day in Pokhara.
              </p>
            </div>
          </div>

          {/* Secondary mini pill list */}
          <div className="hidden md:flex mt-12 py-6 border-t border-earth/10 flex-wrap justify-center items-center gap-2">
            {[
              'Free toiletries', 'Electric kettle', 'In-room minibar', 'Flat-screen TV',
              'Luggage storage', 'Currency exchange', 'Trek Tour desk', 'Airport shuttle (paid)',
              'Reliable Laundry', 'Daily housekeeping', '24-hour front desk', 'Quiet garden library'
            ].map((pill, idx) => (
              <span
                key={idx}
                className="px-3.5 py-1.5 rounded-full bg-sage/10 text-earth text-xs font-medium"
              >
                {pill}
              </span>
            ))}
          </div>
        </motion.div>
      </section>

      {/* SECTION 7 — ATMOSPHERE / WALKTHROUGH SECTION (Forest Canopy overlay) */}
      <section id="atmosphere-walkthrough" className="relative h-[480px] w-full flex items-center justify-center">
        <Image
          src="https://picsum.photos/seed/nepaltravel/1600/900"
          alt="Atmosphere Pokhara landscape"
          fill
          className="object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-forest/60 mix-blend-multiply" />

        <div className="relative z-10 text-center px-5 text-cream max-w-[600px] space-y-4">
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-cream/70">The Lodge</span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight leading-tight">Explore Nanohana <br className="hidden sm:block" />Lodge</h2>
          <p className="text-cream/80 text-sm max-w-[450px] mx-auto leading-relaxed">
            Take a 1-minute visual journey around our blooming hotel garden, clean cozy rooms, and quiet rooftop mountains.
          </p>
          <div className="pt-4 flex justify-center">
            <button
              onClick={() => setIsVideoOpen(true)}
              className="w-16 h-16 rounded-full bg-nanohana text-earth flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xl animate-bounce"
              aria-label="Play Walkthrough"
            >
              <Play className="w-6 h-6 fill-earth text-earth ml-1" />
            </button>
          </div>
        </div>
      </section>

      {/* Interactive Video Modal Overlay */}
      {isVideoOpen && (
        <div
          id="video-overlay"
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-2 sm:p-5 cursor-pointer"
          onClick={() => setIsVideoOpen(false)}
        >
          <div
            className="relative bg-black rounded-xl max-w-5xl w-full overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsVideoOpen(false)}
              className="absolute top-4 right-4 text-white hover:text-nanohana p-2 z-10 bg-black/50 rounded-full transition-colors"
              aria-label="Close Video"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="w-full aspect-video bg-black flex items-center justify-center relative">
              <video 
                className="w-full h-full object-contain"
                controls 
                autoPlay 
                playsInline
                src="/nanohana-video.mp4"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 8 — SOCIAL PROOF / REVIEWS (Warm Cream background) */}
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
                <span className="text-[11px] font-mono uppercase tracking-[0.15em] text-phewa font-semibold">
                  What guests say
                </span>
              </div>
              <h2 className="font-serif text-3xl md:text-4xl font-medium tracking-tight">
                {"146 reviews. One word is constantly repeated: \"clean\"."}
              </h2>
            </div>
            <a
              id="view-tripadvisor-reviews"
              href="https://www.tripadvisor.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 md:mt-0 text-sm font-semibold text-phewa hover:text-nanohana transition-colors"
            >
              Read all on TripAdvisor <ExternalLinkIcon className="w-4 h-4" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Review 1 */}
            <div className="p-6 bg-cream border border-earth/10 rounded-xl space-y-4 flex flex-col justify-between h-full">
              <div className="space-y-3">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-nanohana text-nanohana" />
                  ))}
                </div>
                <p className="font-serif italic text-earth/95 text-sm leading-relaxed">
                  {"\"We decided this was our favorite hotel in all of Nepal. Best hot showers, impeccably clean rooms, beautiful gardens and rooftop deck. Friendly and helpful staff. Highly recommend.\""}
                </p>
              </div>
              <div className="pt-4 border-t border-earth/10 flex items-center justify-between text-xs text-earth/70">
                <div>
                  <span className="font-semibold block text-earth font-sans">Genia L. 🇺🇸</span>
                  <span className="text-[10px]">Nov 2024</span>
                </div>
                <span id="badge-review-1" className="px-2 py-0.5 rounded bg-phewa/10 text-phewa font-mono font-bold">
                  TripAdvisor
                </span>
              </div>
            </div>

            {/* Review 2 */}
            <div className="p-6 bg-cream border border-earth/10 rounded-xl space-y-4 flex flex-col justify-between h-full">
              <div className="space-y-3">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-nanohana text-nanohana" />
                  ))}
                </div>
                <p className="font-serif italic text-earth/95 text-sm leading-relaxed">
                  {"\"Although a 10-story building is built nearby, one lives here in a small oasis. Modernized 3-story lodge, cozy rooms with renovated bathrooms, and lovingly arranged flowering plants on every terrace.\""}
                </p>
              </div>
              <div className="pt-4 border-t border-earth/10 flex items-center justify-between text-xs text-earth/70">
                <div>
                  <span className="font-semibold block text-earth font-sans">Alfred S. 🇩🇪</span>
                  <span className="text-[10px]">Nov 2024</span>
                </div>
                <span id="badge-review-2" className="px-2 py-0.5 rounded bg-phewa/10 text-phewa font-mono font-bold">
                  Booking.com
                </span>
              </div>
            </div>

            {/* Review 3 */}
            <div className="p-6 bg-cream border border-earth/10 rounded-xl space-y-4 flex flex-col justify-between h-full">
              <div className="space-y-3">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-nanohana text-nanohana" />
                  ))}
                </div>
                <p className="font-serif italic text-earth/95 text-sm leading-relaxed">
                  {"\"What a jewel. The whole place is immaculately clean. The shady balcony garden is an oasis of calm. As a solo female traveller I was completely comfortable. Would not hesitate to recommend.\""}
                </p>
              </div>
              <div className="pt-4 border-t border-earth/10 flex items-center justify-between text-xs text-earth/70">
                <div>
                  <span className="font-semibold block text-earth font-sans">Lesley S. 🇬🇧</span>
                  <span className="text-[10px]">Nov 2022</span>
                </div>
                <span id="badge-review-3" className="px-2 py-0.5 rounded bg-phewa/10 text-phewa font-mono font-bold">
                  TripAdvisor
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* SECTION 9 — SUSTAINABILITY PLEDGE (Forest Canopy bg) */}
      <section id="sustainability" className="bg-forest text-cream py-20 border-t border-white/5 overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="max-w-[1240px] mx-auto px-5 md:px-10 lg:px-20 grid grid-cols-1 lg:grid-cols-12 gap-12"
        >
          {/* Left Block */}
          <div className="lg:col-span-6 space-y-6">
            <Quote className="w-12 h-12 text-nanohana" />
            <h3 className="font-serif text-3xl sm:text-4xl text-cream font-medium leading-tight">
              {"\"Caring for our environment shouldn't be complicated; it just takes a bit of common sense and a lot of heart.\""}
            </h3>
            <p className="text-sage text-sm font-mono tracking-wider">— Kul Bahadur Acharya, Founder</p>
            <p className="text-cream/80 text-sm leading-relaxed">
              We prefer to keep our eco-efforts simple and genuine, rather than making a big fuss. For instance, we place simple water bottles in our toilet tanks to save 2 liters per flush. We prioritize buying local, hiring neighbors, and keeping our footprint as gentle as the mountain breeze.
            </p>
          </div>

          {/* Right Block */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 bg-white/5 border border-white/10 rounded-xl space-y-2">
              <Droplet className="w-6 h-6 text-nanohana" />
              <h4 className="font-serif text-md font-semibold text-cream">Water Conservation</h4>
              <p className="text-xs text-cream/75">Simple water-bottle restrictors in our toilets save 2 liters per flush.</p>
            </div>
            <div className="p-5 bg-white/5 border border-white/10 rounded-xl space-y-2">
              <Users className="w-6 h-6 text-nanohana" />
              <h4 className="font-serif text-md font-semibold text-cream">Local Community Support</h4>
              <p className="text-xs text-cream/75">We only work with certified, local guides, cooks, and drivers.</p>
            </div>
            <div className="hidden sm:block p-5 bg-white/5 border border-white/10 rounded-xl space-y-2">
              <Leaf className="w-6 h-6 text-nanohana" />
              <h4 className="font-serif text-md font-semibold text-cream">Minimalist Green Footprint</h4>
              <p className="text-xs text-cream/75">Solar water heaters and plastic-free bathrooms.</p>
            </div>
            <div className="hidden sm:block p-5 bg-white/5 border border-white/10 rounded-xl space-y-2">
              <Flame className="w-6 h-6 text-nanohana" />
              <h4 className="font-serif text-md font-semibold text-cream">Real Organic Produce</h4>
              <p className="text-xs text-cream/75">Fresh herbs come straight from our garden.</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* SECTION 10 — CTA BANNER (Nanohana Blossom gold bg) */}
      <section id="book-cta-banner" className="bg-nanohana text-earth py-20 text-center overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
          className="max-w-[700px] mx-auto px-5 space-y-6"
        >
          <h2 className="font-serif text-4xl font-medium leading-tight">
            Ready to wake up to the Annapurnas?
          </h2>
          <p className="text-earth/80 max-w-[480px] mx-auto text-sm leading-relaxed">
            The best rates, guaranteed. No hidden fees.
          </p>
          <div className="pt-4">
            <Link
              id="cta-reserve-btn"
              href="/reservations"
              className="px-8 py-4 bg-forest text-cream font-sans text-sm font-semibold tracking-wide rounded-full hover:bg-forest/90 active:scale-95 transition-all inline-block shadow-lg"
            >
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
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </svg>
  );
}
