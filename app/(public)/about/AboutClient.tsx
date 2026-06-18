'use client';

import React from 'react';
import EditableImage from '@/components/EditableImage';
import { motion } from 'framer-motion';
import {
  Quote,
  ShieldCheck,
  Heart,
  Sparkles,
  Users,
  Compass
} from 'lucide-react';
import EditableText from '@/components/EditableText';

export default function AboutClient({ content = [], editMode = false }: { content?: any[], editMode?: boolean }) {
  const getText = React.useCallback((key: string) => content.find(c => c.key === key)?.value, [content]);

  return (
    <div id="about-page" className="w-full">
      {/* SUB-HERO SECTION */}
      <section id="about-hero" className="relative h-[55vh] min-h-[380px] w-full flex items-center justify-center">
        <EditableImage
          page="about"
          contentKey="about_hero_bg"
          defaultSrc="/story_hero.jpg"
          currentSrc={getText('about_hero_bg')}
          editMode={editMode}
          alt="Lodge garden overview"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/60 mix-blend-multiply pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 text-center px-5 text-cream max-w-[800px] pt-16"
        >
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-nanohana block mb-2 font-bold">
            Our Story & Legacy
          </span>
          <EditableText
            as="h1"
            page="about"
            contentKey="about_hero_title"
            defaultText="From New Star Lodge to Nanohana."
            currentText={getText('about_hero_title')}
            editMode={editMode}
            className="font-serif text-4xl sm:text-5xl font-medium tracking-tight mb-4"
          />
          <EditableText
            as="p"
            page="about"
            contentKey="about_hero_desc"
            defaultText="Discover the legacy of the Acharya family — keeping Pokhara Lakeside warm, simple, and honest for well over three decades."
            currentText={getText('about_hero_desc')}
            editMode={editMode}
            className="text-cream/90 text-sm max-w-[500px] mx-auto leading-relaxed"
          />
        </motion.div>
      </section>

      {/* FOUNDING EDITORIAL TWO-COLUMN */}
      <section id="founding-story" className="bg-cream py-20 text-earth overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-[1240px] mx-auto px-5 md:px-10 lg:px-20 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center"
        >
          {/* Left Column Group: Large portrait photo */}
          <div className="lg:col-span-5 relative h-[500px] rounded-2xl overflow-hidden border border-earth/10 shadow-lg">
            <EditableImage
              page="about"
              contentKey="about_story_img"
              defaultSrc="/image3.jpg"
              currentSrc={getText('about_story_img')}
              editMode={editMode}
              alt="Railway tracks heading to the mountains"
              fill
              className="object-cover"
            />
          </div>

          {/* Right Column: Narrative */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-phewa" />
              <span className="text-[11px] font-mono uppercase tracking-[0.15em] text-phewa font-semibold">
                How It Began
              </span>
            </div>

            <EditableText
              as="h2"
              page="about"
              contentKey="about_founding_title"
              defaultText="A father's legacy, a son's green vision."
              currentText={getText('about_founding_title')}
              editMode={editMode}
              className="font-serif text-3xl sm:text-4xl text-earth font-medium leading-tight"
            />

            <div className="text-earth/80 text-sm leading-relaxed space-y-4 font-sans">
              <EditableText
                as="p"
                page="about"
                contentKey="about_founding_p1"
                defaultText={`Nanohana Lodge was founded by Kul Bahadur Acharya. His beloved father started the family's first ever guest house — New Star Lodge — in central Lakeside more than 34 years ago. It was a humble place that taught the family a fundamental truth: that hospitality done well is the most honorable gift you can offer a stranger.`}
                currentText={getText('about_founding_p1')}
                editMode={editMode}
              />
              <EditableText
                as="p"
                page="about"
                contentKey="about_founding_p2"
                defaultText="When Kul Bahadur took over the family tradition, he chose not to join the crowded, noisy commercial core of central Lakeside. Instead, he designed a quiet retreat on the peaceful southern edge of terms and constructed Nanohana Lodge directly opposite his own home. This layout ensures that caring for guests and caring for his own family remain the same single daily pursuit."
                currentText={getText('about_founding_p2')}
                editMode={editMode}
              />
              <EditableText
                as="p"
                page="about"
                contentKey="about_founding_p3"
                defaultText={`The name "Nanohana" (菜の花) designates the rapeseed canola flowers in Japanese — those incredibly bright, resilient golden blooms that blanket Nepal's farming hills in spectacular color each spring. It was chosen as our permanent wordmark representing organic simplicity, natural beauty, and ordinary tasks executed with great care.`}
                currentText={getText('about_founding_p3')}
                editMode={editMode}
              />
              <EditableText
                as="p"
                page="about"
                contentKey="about_founding_p4"
                defaultText="Today, the lodge operates with 17 beautiful rooms across three levels, each featuring shared or private platforms looking straight out at the snowy crowns of the Annapurna range."
                currentText={getText('about_founding_p4')}
                editMode={editMode}
              />
            </div>
          </div>
        </motion.div>
      </section>

      {/* THREE CORE VALUES (Forest Canopy bg) */}
      <section id="values" className="bg-forest text-cream py-20 overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="max-w-[1240px] mx-auto px-5 md:px-10 lg:px-20"
        >
          <div className="text-center max-w-[600px] mx-auto mb-16">
            <EditableText
              as="h2"
              page="about"
              contentKey="about_values_heading"
              defaultText="What we believe in."
              currentText={getText('about_values_heading')}
              editMode={editMode}
              className="font-serif text-3xl sm:text-4xl font-medium"
            />
            <p className="text-sage text-xs font-mono uppercase tracking-widest mt-2">Our guiding principles</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Value Card 1 */}
            <div
              id="value-card-val-1"
              className="p-6 bg-white/5 border border-white/10 rounded-xl space-y-3 md:space-y-4"
            >
              <div className="w-10 h-10 bg-nanohana/10 rounded-full flex items-center justify-center text-nanohana text-sm font-bold font-mono">
                ✓
              </div>
              <EditableText
                as="h3"
                page="about"
                contentKey="about_val1_title"
                defaultText="Quality over quantity"
                currentText={getText('about_val1_title')}
                editMode={editMode}
                className="font-serif text-xl font-medium text-cream"
              />
              <EditableText
                as="p"
                page="about"
                contentKey="about_val1_desc"
                defaultText="17 rooms is a deliberate choice. Small enough to know every guest by name and recommend genuine local guides; large enough to offer a comfortable variety of rates and mountain viewpoints."
                currentText={getText('about_val1_desc')}
                editMode={editMode}
                className="text-xs sm:text-sm text-cream/80 leading-relaxed"
              />
            </div>

            {/* Value Card 2 */}
            <div
              id="value-card-val-2"
              className="p-6 bg-white/5 border border-white/10 rounded-xl space-y-3 md:space-y-4"
            >
              <div className="w-10 h-10 bg-nanohana/10 rounded-full flex items-center justify-center text-nanohana text-sm font-bold font-mono">
                ✓
              </div>
              <EditableText
                as="h3"
                page="about"
                contentKey="about_val2_title"
                defaultText="Sustainability in practice"
                currentText={getText('about_val2_title')}
                editMode={editMode}
                className="font-serif text-xl font-medium text-cream"
              />
              <EditableText
                as="p"
                page="about"
                contentKey="about_val2_desc"
                defaultText="We save water with simple bottle-cistern systems. We source organic ingredients locally. We stay small on purpose. Good, memory-filled hospitality should cost the local Nepalese ecosystem as little as possible."
                currentText={getText('about_val2_desc')}
                editMode={editMode}
                className="text-xs sm:text-sm text-cream/80 leading-relaxed"
              />
            </div>

            {/* Value Card 3 */}
            <div
              id="value-card-val-3"
              className="p-6 bg-white/5 border border-white/10 rounded-xl space-y-3 md:space-y-4"
            >
              <div className="w-10 h-10 bg-nanohana/10 rounded-full flex items-center justify-center text-nanohana text-sm font-bold font-mono">
                ✓
              </div>
              <EditableText
                as="h3"
                page="about"
                contentKey="about_val3_title"
                defaultText="Authentic hospitality"
                currentText={getText('about_val3_title')}
                editMode={editMode}
                className="font-serif text-xl font-medium text-cream"
              />
              <EditableText
                as="p"
                page="about"
                contentKey="about_val3_desc"
                defaultText="Our desk team coordinates reliable laundry, DHL packages, Annapurna trekking guides, and transport bus tickets. Not because it is written in a corporate manual — but because you need it and we can help."
                currentText={getText('about_val3_desc')}
                editMode={editMode}
                className="text-xs sm:text-sm text-cream/80 leading-relaxed"
              />
            </div>
          </div>
        </motion.div>
      </section>

      {/* MEET THE TEAM (Warm Cream bg) */}
      <section id="team" className="bg-cream py-20 text-earth overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-[1240px] mx-auto px-5 md:px-10 lg:px-20"
        >
          <div className="text-center max-w-[600px] mx-auto mb-16">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-phewa" />
              <span className="text-[11px] font-mono uppercase tracking-[0.15em] text-phewa font-semibold">
                Lakeside Families
              </span>
            </div>
            <EditableText
              as="h2"
              page="about"
              contentKey="about_team_heading"
              defaultText="The people behind the lodge."
              currentText={getText('about_team_heading')}
              editMode={editMode}
              className="font-serif text-3xl sm:text-4xl font-medium"
            />
            <EditableText
              as="p"
              page="about"
              contentKey="about_team_desc"
              defaultText="Meet the family and dedicated team members who work daily to coordinate your pristine rooms and Pokhara route guidance."
              currentText={getText('about_team_desc')}
              editMode={editMode}
              className="text-earth/70 text-xs sm:text-sm max-w-[400px] mx-auto mt-2 leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {/* Team Card 1 — Kul Bahadur Acharya */}
            <div
              id="team-card-0"
              className="bg-cream border border-earth/10 rounded-2xl overflow-hidden hover:shadow-lg transition-all"
            >
              <div className="relative h-72 w-full">
                <EditableImage
                  page="about"
                  contentKey="about_team1_img"
                  defaultSrc="/founderr.png"
                  currentSrc={getText('about_team1_img')}
                  editMode={editMode}
                  alt="Kul Bahadur Acharya"
                  fill
                  className="object-cover"
                  style={{ objectPosition: 'center 20%' }}
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-6 space-y-3">
                <div>
                  <EditableText
                    as="h3"
                    page="about"
                    contentKey="about_team1_name"
                    defaultText="Kul Bahadur Acharya"
                    currentText={getText('about_team1_name')}
                    editMode={editMode}
                    className="font-serif text-lg font-bold text-earth"
                  />
                  <EditableText
                    as="span"
                    page="about"
                    contentKey="about_team1_role"
                    defaultText="Founder & Owner"
                    currentText={getText('about_team1_role')}
                    editMode={editMode}
                    className="text-[11px] font-mono uppercase tracking-widest text-phewa font-bold"
                  />
                </div>
                <EditableText
                  as="p"
                  page="about"
                  contentKey="about_team1_desc"
                  defaultText="Raised in the Pokhara hospitality trade. Deployed his family savings to build a greener, quieter, and highly personal guesthouse. His absolute motto: common sense solves almost all problems."
                  currentText={getText('about_team1_desc')}
                  editMode={editMode}
                  className="text-xs sm:text-sm text-earth/85 leading-relaxed"
                />
              </div>
            </div>

            {/* Team Card 2 — Kishor */}
            <div
              id="team-card-1"
              className="bg-cream border border-earth/10 rounded-2xl overflow-hidden hover:shadow-lg transition-all"
            >
              <div className="relative h-72 w-full">
                <EditableImage
                  page="about"
                  contentKey="about_team2_img"
                  defaultSrc="https://picsum.photos/seed/nepalihost2/500/500"
                  currentSrc={getText('about_team2_img')}
                  editMode={editMode}
                  alt="Kishor"
                  fill
                  className="object-cover"
                  style={{ objectPosition: 'center 20%' }}
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-6 space-y-3">
                <div>
                  <EditableText
                    as="h3"
                    page="about"
                    contentKey="about_team2_name"
                    defaultText="Kishor"
                    currentText={getText('about_team2_name')}
                    editMode={editMode}
                    className="font-serif text-lg font-bold text-earth"
                  />
                  <EditableText
                    as="span"
                    page="about"
                    contentKey="about_team2_role"
                    defaultText="Front Desk Lead"
                    currentText={getText('about_team2_role')}
                    editMode={editMode}
                    className="text-[11px] font-mono uppercase tracking-widest text-phewa font-bold"
                  />
                </div>
                <EditableText
                  as="p"
                  page="about"
                  contentKey="about_team2_desc"
                  defaultText="Praised by name in dozens of TripAdvisor reviews for his warm, radiant smiles and practical local trek guidance. Knows Pokhara routes better than Google Maps."
                  currentText={getText('about_team2_desc')}
                  editMode={editMode}
                  className="text-xs sm:text-sm text-earth/85 leading-relaxed"
                />
              </div>
            </div>

            {/* Team Card 3 — Rabin */}
            <div
              id="team-card-2"
              className="bg-cream border border-earth/10 rounded-2xl overflow-hidden hover:shadow-lg transition-all"
            >
              <div className="relative h-72 w-full">
                <EditableImage
                  page="about"
                  contentKey="about_team3_img"
                  defaultSrc="https://picsum.photos/seed/nepalihost3/500/500"
                  currentSrc={getText('about_team3_img')}
                  editMode={editMode}
                  alt="Rabin"
                  fill
                  className="object-cover"
                  style={{ objectPosition: 'center 20%' }}
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-6 space-y-3">
                <div>
                  <EditableText
                    as="h3"
                    page="about"
                    contentKey="about_team3_name"
                    defaultText="Rabin"
                    currentText={getText('about_team3_name')}
                    editMode={editMode}
                    className="font-serif text-lg font-bold text-earth"
                  />
                  <EditableText
                    as="span"
                    page="about"
                    contentKey="about_team3_role"
                    defaultText="Guest Services"
                    currentText={getText('about_team3_role')}
                    editMode={editMode}
                    className="text-[11px] font-mono uppercase tracking-widest text-phewa font-bold"
                  />
                </div>
                <EditableText
                  as="p"
                  page="about"
                  contentKey="about_team3_desc"
                  defaultText="Handles bookings, bus transit vouchers, and trekking layouts. Guests consistently thank him for authentic restaurant and tea house recommendations."
                  currentText={getText('about_team3_desc')}
                  editMode={editMode}
                  className="text-xs sm:text-sm text-earth/85 leading-relaxed"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* HISTORICAL REVIEWS SUMMARY (Warm Cream bg) */}
      <section id="reviews-history" className="bg-cream py-16 border-t border-earth/10 overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-[1240px] mx-auto px-5 md:px-10 lg:px-20"
        >
          <div className="p-8 sm:p-12 bg-white/50 border border-earth/10 rounded-2xl max-w-[900px] mx-auto flex flex-col items-center text-center space-y-6">
            <Quote className="w-12 h-12 text-nanohana" />
            <div className="space-y-4">
              <EditableText
                as="p"
                page="about"
                contentKey="about_review_quote"
                defaultText={`"The boss and his crew are exceptionally helpful and very friendly. The surrounding neighborhood is still raw and original, packed with family-run grocery shops, authentic local restaurants, and quiet lodges."`}
                currentText={getText('about_review_quote')}
                editMode={editMode}
                className="font-serif text-lg sm:text-xl italic text-earth leading-relaxed"
              />
              <span className="block text-xs uppercase font-mono tracking-widest text-earth/80">
                — Alfred S., Verified TripAdvisor Citation (Nov 2024)
              </span>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
