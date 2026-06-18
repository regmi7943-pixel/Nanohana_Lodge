

import React from 'react';
import EditableImage from '@/components/EditableImage';
import {
  Wifi,
  Home,
  Bath,
  Trees,
  ConciergeBell,
  Bike,
  Heart,
  UtensilsCrossed,
  Droplet,
  Compass,
  Layers,
  HeartHandshake
} from 'lucide-react';
import EditableText from '@/components/EditableText';

export default function FacilitiesClient({ content = [], editMode = false }: { content?: any[], editMode?: boolean }) {
  const getText = React.useCallback((key: string) => content.find((c: any) => c.key === key)?.value, [content]);

  const facilityRows = [
    {
      id: 'connectivity',
      icon: Wifi,
      title: 'High-speed WiFi, everywhere.',
      desc: 'Free, fast, and entirely reliable in every guest room and all shared outdoor garden spaces. Whether you need to upload glorious trekking photos, check weather maps, coordinate travels, or host video calls home.',
      pills: ['In-room WiFi', 'Public Area WiFi', 'Fiber Optic Speeds', 'Unlimited Connections']
    },
    {
      id: 'essentials',
      icon: Home,
      title: 'Rooms designed strictly for comfort.',
      desc: 'Includes marble or custom tile floorings, a quiet work sitting desk, a ceiling fan to maintain cool air, an electrical kettle with tea/coffee setups, and in-room mini-fridges. Selected Deluxe rooms boast air conditioning.',
      pills: ['Ceiling fan', 'AC (Select Rooms)', 'Minibar', 'Electric Kettle', 'Work Desk', 'Premium Screen TV', 'Seating Area']
    },
    {
      id: 'bathroom',
      icon: Bath,
      title: 'Our rainfall hot showers (highly rated).',
      desc: 'Each double or triple room is installed with a clean attached private bathroom. The most frequently complimented feature in TripAdvisor comments: incredibly warm, reliable hot water with exceptional pressure. Deluxe layouts include full bathtubs.',
      pills: ['Rainfall Hot Shower', 'Deep Bathtub (Deluxe)', 'Complimentary Toiletries', 'Eco Bath Sheets', 'Slippers', 'Clean Towels']
    },
    {
      id: 'outdoor',
      icon: Trees,
      title: 'Quiet, flowering balconies & scenic rooftop.',
      desc: 'Our three-storey layout features shared plant-covered balconies for every floor, with chairs and coffee tables. Read books in our quiet organic flower garden, or walk up to our panoramic rooftop terrace to gaze at the peaks.',
      pills: ['Shared balconies', 'Rooftop Terrace', 'Flowering Garden', 'Annapurna Views', 'Lakeside Overlooks', 'Birdsong Morning']
    },
    {
      id: 'services',
      icon: ConciergeBell,
      title: 'A helpful front desk (actual service).',
      desc: 'Our 24-hour reception desk coordinates guide referrals, bus or flight tickets, currency exchanges, luggage storages, dry laundries, or international DHL courier shipping. Our family handles requests with genuine warmth.',
      pills: ['24-Hour Front Desk', 'Trek Tour Booking', 'Safe Luggage Storage', 'Currency Exchange', 'Reliable Laundry', 'Daily Housekeeping']
    },
    {
      id: 'transport',
      icon: Bike,
      title: 'Simplified transfers and transportation.',
      desc: 'Bicycle rentals are managed on-site so you can commute down Lakeside or Lakeside trails. In addition, we coordinate private car hires and paid airport shuttle pick-ups. Sahid Chok bus stop resides right beside our entrance street.',
      pills: ['Bicycle Rental', 'Car Rental Hires', 'Paid Airport Shuttle', 'Sahid Chok Bus Stop', 'Trek Transit Map']
    },
    {
      id: 'wellness',
      icon: Heart,
      title: 'Unwind your muscles after the trail.',
      desc: 'We are situated around the corner from “Seeing Hands Massage” — Pokhara’s famous blind massage therapists. We can also coordinate in-room foot massage therapists onto your balcony by request. A reading library is accessible in the lobby.',
      pills: ['Lobby Library', 'In-room Foot Massage', 'Seeing Hands Nearby', 'Quiet Relaxation Zones']
    },
    {
      id: 'dining',
      icon: UtensilsCrossed,
      title: 'Vibrant cafes & restaurants within 5 minutes.',
      desc: 'While we serve early hot breakfast sets at the lodge for a modest surcharge, our quiet Lakeside Street No. 4 sits a short 5-minute walk from peak Pokhara dining: am/pm Organic Cafe, Med5 Italian Woodfired Pizza, or Bamboo Garden.',
      pills: ['Organic Coffee nearby', 'Med5 Woodfire Pizza', 'Bamboo Garden Asian', 'In-lodge Breakfast sets']
    }
  ];

  return (
    <div id="facilities-page" className="w-full">
      {/* SUB-HERO SECTION */}
      <section id="facilities-hero" className="relative h-[55vh] min-h-[380px] w-full flex items-center justify-center">
        <EditableImage
          page="facilities"
          contentKey="facilities_hero_bg"
          defaultSrc="https://picsum.photos/seed/nanohanagarden/1600/900"
          currentSrc={getText('facilities_hero_bg')}
          editMode={editMode}
          alt="Rooftop garden view at Nanohana"
          fill
          priority
          sizes="100vw"
          className="object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-forest/50 mix-blend-multiply pointer-events-none" />

        <div className="relative z-10 text-center px-5 text-cream max-w-[800px] pt-16">
          <EditableText as="span" page="facilities" contentKey="facilities_hero_subtitle" defaultText="Amenities Catalogue" currentText={getText('facilities_hero_subtitle')} editMode={editMode} className="text-xs font-mono uppercase tracking-[0.2em] text-cream/70 block mb-2" />
          <EditableText as="h1" page="facilities" contentKey="facilities_hero_title" defaultText="Everything that makes a stay comfortable." currentText={getText('facilities_hero_title')} editMode={editMode} className="font-serif text-4xl sm:text-5xl font-medium tracking-tight mb-4" />
          <EditableText as="p" page="facilities" contentKey="facilities_hero_desc" defaultText="Free high-speed WiFi, piping hot showers, flower-lined balconies, on-site bicycle rentals, and a dedicated family team standing by to handle the rest." currentText={getText('facilities_hero_desc')} editMode={editMode} className="text-cream/90 text-sm sm:text-base max-w-[550px] mx-auto leading-relaxed" />
        </div>
      </section>

      {/* AMENITIES BY CATEGORY ROW LAYOUT */}
      <section id="facilities-rows" className="bg-cream py-20 text-earth">
        <div className="max-w-[1000px] mx-auto px-5 md:px-10 lg:px-20 space-y-16">
          {facilityRows.map((row, idx) => {
            const IconComponent = row.icon;
            return (
              <div
                key={row.id}
                id={`facility-row-${idx}`}
                className="flex flex-col md:flex-row gap-6 md:gap-10 pb-12 border-b border-earth/10 last:border-b-0 last:pb-0"
              >
                {/* Left side icon indicator */}
                <div className="flex-shrink-0">
                  <div className="p-4 bg-phewa/10 text-phewa rounded-2xl w-14 h-14 md:w-16 md:h-16 flex items-center justify-center">
                    <IconComponent className="w-8 h-8" />
                  </div>
                </div>

                {/* Right side explanation */}
                <div className="space-y-4 flex-grow">
                  <EditableText as="h3" page="facilities" contentKey={`facilities_row_${idx}_title`} defaultText={row.title} currentText={getText(`facilities_row_${idx}_title`)} editMode={editMode} className="font-serif text-2xl font-medium text-earth" />
                  <EditableText as="p" page="facilities" contentKey={`facilities_row_${idx}_desc`} defaultText={row.desc} currentText={getText(`facilities_row_${idx}_desc`)} editMode={editMode} className="text-sm text-earth/80 leading-relaxed max-w-[700px]" />

                  <div className="flex flex-wrap gap-2 pt-2">
                    {row.pills.map((pill, pIdx) => (
                      <EditableText
                        as="span"
                        key={pIdx}
                        page="facilities"
                        contentKey={`facilities_row_${idx}_pill_${pIdx}`}
                        defaultText={pill}
                        currentText={getText(`facilities_row_${idx}_pill_${pIdx}`)}
                        editMode={editMode}
                        className="px-3 py-1 bg-sage/10 rounded-full text-xs font-medium text-earth/95"
                      />
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SUSTAINABILITY SECTION with 4 STAT CARDS (Forest Canopy bg) */}
      <section id="facilities-sustainability" className="bg-forest text-cream py-20">
        <div className="max-w-[1240px] mx-auto px-5 md:px-10 lg:px-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <EditableText as="span" page="facilities" contentKey="facilities_sust_subtitle" defaultText="Eco-Conscious Travel" currentText={getText('facilities_sust_subtitle')} editMode={editMode} className="text-xs font-mono uppercase tracking-[0.15em] text-nanohana font-bold block" />
            <EditableText as="h2" page="facilities" contentKey="facilities_sust_title" defaultText="We take sustainability extremely personally." currentText={getText('facilities_sust_title')} editMode={editMode} className="font-serif text-3.5xl md:text-4xl text-cream font-medium leading-tight" />
            <EditableText as="p" page="facilities" contentKey="facilities_sust_desc1" defaultText="Nanohana Lodge’s founder Kul Bahadur believes true ecology is rooted in practical common sense. Since our construction, we do not deploy disposable plastic cups or excessive lighting systems. Instead, we rely on natural insulation, recycling flow structures, and deep green community integration." currentText={getText('facilities_sust_desc1')} editMode={editMode} className="text-cream/80 text-sm leading-relaxed" />
            <EditableText as="p" page="facilities" contentKey="facilities_sust_desc2" defaultText={"\"We aim to prove that budget-friendly Nepalese travels can cooperate fully with the local ecosystem.\""} currentText={getText('facilities_sust_desc2')} editMode={editMode} className="text-sage font-serif italic text-base" />
          </div>

          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="p-6 bg-white/5 border border-white/10 rounded-xl text-center space-y-2">
              <EditableText as="span" page="facilities" contentKey="facilities_stat_1_val" defaultText="2 L Saved" currentText={getText('facilities_stat_1_val')} editMode={editMode} className="block text-3xl font-serif text-nanohana font-bold" />
              <EditableText as="span" page="facilities" contentKey="facilities_stat_1_label" defaultText="Per Flush Cycle" currentText={getText('facilities_stat_1_label')} editMode={editMode} className="text-xs font-mono uppercase tracking-widest text-cream/70 block" />
              <EditableText as="p" page="facilities" contentKey="facilities_stat_1_desc" defaultText="Via custom water-bottle cistern restrictors deployed in all 17 bathrooms." currentText={getText('facilities_stat_1_desc')} editMode={editMode} className="text-[11px] text-cream/80 leading-normal" />
            </div>

            <div className="p-6 bg-white/5 border border-white/10 rounded-xl text-center space-y-2">
              <EditableText as="span" page="facilities" contentKey="facilities_stat_2_val" defaultText="34+ Years" currentText={getText('facilities_stat_2_val')} editMode={editMode} className="block text-3xl font-serif text-nanohana font-bold" />
              <EditableText as="span" page="facilities" contentKey="facilities_stat_2_label" defaultText="Family Hospitality" currentText={getText('facilities_stat_2_label')} editMode={editMode} className="text-xs font-mono uppercase tracking-widest text-cream/70 block" />
              <EditableText as="p" page="facilities" contentKey="facilities_stat_2_desc" defaultText="Refined across two generations of central Lakeside innkeeping." currentText={getText('facilities_stat_2_desc')} editMode={editMode} className="text-[11px] text-cream/80 leading-normal" />
            </div>

            <div className="p-6 bg-white/5 border border-white/10 rounded-xl text-center space-y-2">
              <EditableText as="span" page="facilities" contentKey="facilities_stat_3_val" defaultText="17 Rooms" currentText={getText('facilities_stat_3_val')} editMode={editMode} className="block text-3xl font-serif text-nanohana font-bold" />
              <EditableText as="span" page="facilities" contentKey="facilities_stat_3_label" defaultText="Low Footprint" currentText={getText('facilities_stat_3_label')} editMode={editMode} className="text-xs font-mono uppercase tracking-widest text-cream/70 block" />
              <EditableText as="p" page="facilities" contentKey="facilities_stat_3_desc" defaultText="Kept small on purpose to preserve the peaceful neighborhood soundscape." currentText={getText('facilities_stat_3_desc')} editMode={editMode} className="text-[11px] text-cream/80 leading-normal" />
            </div>

            <div className="p-6 bg-white/5 border border-white/10 rounded-xl text-center space-y-2">
              <EditableText as="span" page="facilities" contentKey="facilities_stat_4_val" defaultText="0 Promises" currentText={getText('facilities_stat_4_val')} editMode={editMode} className="block text-3xl font-serif text-nanohana font-bold" />
              <EditableText as="span" page="facilities" contentKey="facilities_stat_4_label" defaultText="We Cannot Keep" currentText={getText('facilities_stat_4_label')} editMode={editMode} className="text-xs font-mono uppercase tracking-widest text-cream/70 block" />
              <EditableText as="p" page="facilities" contentKey="facilities_stat_4_desc" defaultText="No corporate greenwashing. Just practical, direct ways of giving back." currentText={getText('facilities_stat_4_desc')} editMode={editMode} className="text-[11px] text-cream/80 leading-normal" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
