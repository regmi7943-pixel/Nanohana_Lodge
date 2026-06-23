'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import EditableImage from '@/components/EditableImage';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  ExternalLink,
  Leaf
} from 'lucide-react';
import EditableText from '@/components/EditableText';

export default function GalleryClient({ content = [], editMode = false }: { content?: any[], editMode?: boolean }) {
  const getText = React.useCallback((key: string) => content.find((c: any) => c.key === key)?.value, [content]);

  const [activeTab, setActiveTab] = useState('All');
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  const tabs = ['All', 'Rooms', 'Garden & Terrace', 'Views', 'Pokhara'];

  const rawGallery = content.find((c: any) => c.key === 'global_gallery_photos')?.value;
  let customGallery = [];
  try {
    if (rawGallery) customGallery = JSON.parse(rawGallery);
  } catch(e) {}

  const photos = customGallery;

  // Map customGallery urls to image property to match the photo grid expected structure
  const formattedPhotos = photos.map((p: any) => ({
    ...p,
    image: p.image || p.url // Use url from custom gallery if image isn't set
  }));

  const filteredPhotos = formattedPhotos.filter((photo: any) => {
    if (activeTab === 'All') return true;
    return photo.category === activeTab;
  });

  const openLightbox = (photoId: number) => {
    const origIndex = formattedPhotos.findIndex((p: any) => p.id === photoId);
    setSelectedPhotoIndex(origIndex);
  };

  const handleNextMedia = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedPhotoIndex === null) return;
    setSelectedPhotoIndex((prev) => (prev! + 1) % formattedPhotos.length);
  };

  const handlePrevMedia = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedPhotoIndex === null) return;
    setSelectedPhotoIndex((prev) => (prev! - 1 + formattedPhotos.length) % formattedPhotos.length);
  };

  return (
    <div id="gallery-page" className="w-full">
      {/* HERO SECTION WITH SINGLE IMAGE */}
      <section id="gallery-hero" className="relative w-full h-[60vh] min-h-[420px] bg-forest flex items-center justify-center">
        <div className="absolute inset-0 h-full w-full">
          <EditableImage
            page="gallery"
            contentKey="gallery_hero_bg"
            defaultSrc="/story_home2.jpg"
            currentSrc={getText('gallery_hero_bg')}
            editMode={editMode}
            alt="Nanohana Lodge Gallery"
            fill
            priority={true}
            className="object-cover"
          />
          <div className="absolute inset-0 bg-forest/45 mix-blend-multiply pointer-events-none" />
        </div>

        {/* Content Details (Sits neatly with proper overlay contrast) */}
        <div className="relative z-10 text-center px-5 text-cream max-w-[800px] pt-16">
          <EditableText as="span" page="gallery" contentKey="gallery_hero_subtitle" defaultText="Photo Gallery" currentText={getText('gallery_hero_subtitle')} editMode={editMode} className="text-xs font-mono uppercase tracking-[0.2em] text-nanohana block mb-2 font-bold animate-pulse" />
          <EditableText as="h1" page="gallery" contentKey="gallery_hero_title" defaultText="See the lodge for yourself." currentText={getText('gallery_hero_title')} editMode={editMode} className="font-serif text-4xl sm:text-5xl font-medium tracking-tight mb-4" />
          <EditableText as="p" page="gallery" contentKey="gallery_hero_desc" defaultText="Beautiful flower gardens, clean polished bathrooms, fresh linens, and the epic snowy Himalayas towering directly above your morning coffee cup." currentText={getText('gallery_hero_desc')} editMode={editMode} className="text-cream/90 text-sm max-w-[500px] mx-auto leading-relaxed" />
        </div>
      </section>

      {/* FILTERABLE TABS ROW */}
      <section id="gallery-tabs-section" className="bg-cream py-6 border-b border-earth/10">
        <div className="max-w-[1240px] mx-auto px-5 md:px-10 lg:px-20 flex items-center justify-center sm:justify-start gap-2 overflow-x-auto no-scrollbar">
          {tabs.map((tab, idx) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-full font-mono text-[11px] tracking-wider uppercase font-semibold transition-all ${
                activeTab === tab
                  ? 'bg-phewa text-cream shadow-sm'
                  : 'text-earth/70 hover:text-earth hover:bg-earth/5'
              }`}
            >
              <EditableText as="span" page="gallery" contentKey={`gallery_tab_${idx}`} defaultText={tab} currentText={getText(`gallery_tab_${idx}`)} editMode={editMode} />
            </button>
          ))}
        </div>
      </section>

      {/* MASONRY-STYLE PHOTO GRID SECTION */}
      <section id="gallery-grid" className="bg-cream py-16 text-earth">
        <div className="max-w-[1240px] mx-auto px-5 md:px-10 lg:px-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPhotos.map((photo: any) => (
              <div
                key={photo.id}
                id={`photo-tile-${photo.id}`}
                onClick={() => openLightbox(photo.id)}
                className="group relative cursor-pointer overflow-hidden rounded-2xl bg-earth border border-earth/15 hover:shadow-xl transition-all h-[320px]"
              >
                <Image
                  src={photo.image}
                  alt={photo.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-all duration-300 opacity-90 group-hover:opacity-100"
                />

                {/* Cover Hover Overlay (Forest Canopy Overlay fading in) */}
                <div className="absolute inset-0 bg-forest/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-6">
                  <div className="flex justify-end">
                    <div className="p-2.5 bg-nanohana text-earth rounded-full shadow-md">
                      <Maximize2 className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="space-y-1 text-cream text-left">
                    <EditableText as="span" page="gallery" contentKey={`gallery_item_${photo.id}_category`} defaultText={photo.category} currentText={getText(`gallery_item_${photo.id}_category`)} editMode={editMode} className="text-[10px] font-mono uppercase tracking-widest text-nanohana font-semibold" />
                    <EditableText as="h3" page="gallery" contentKey={`gallery_item_${photo.id}_title`} defaultText={photo.title} currentText={getText(`gallery_item_${photo.id}_title`)} editMode={editMode} className="font-serif text-lg font-bold text-cream" />
                    <EditableText as="p" page="gallery" contentKey={`gallery_item_${photo.id}_desc`} defaultText={photo.desc} currentText={getText(`gallery_item_${photo.id}_desc`)} editMode={editMode} className="text-[11px] text-cream/80 line-clamp-2 leading-relaxed" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRIPADVISOR PHOTO GALLERY DELEGATE (Forest Canopy bg) */}
      <section id="tripadvisor-gallery" className="bg-forest text-cream py-16 text-center">
        <div className="max-w-[650px] mx-auto px-5 space-y-4">
          <Leaf className="w-8 h-8 text-nanohana mx-auto animate-pulse" />
          <EditableText as="h2" page="gallery" contentKey="gallery_tripadvisor_title" defaultText="Over 85 guest photos on TripAdvisor" currentText={getText('gallery_tripadvisor_title')} editMode={editMode} className="font-serif text-2xl sm:text-3xl font-medium" />
          <EditableText as="p" page="gallery" contentKey="gallery_tripadvisor_desc" defaultText="See real, unedited photos posted straight from our hotel balconies, rooftop decks, and garden spaces by travelers like you." currentText={getText('gallery_tripadvisor_desc')} editMode={editMode} className="text-cream/80 text-sm leading-relaxed" />
          <div className="pt-2">
            <a
              id="tripadvisor-photo-btn"
              href="https://www.tripadvisor.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-white/35 text-cream hover:text-nanohana hover:border-nanohana transition-colors text-xs font-semibold"
            >
              <EditableText as="span" page="gallery" contentKey="gallery_tripadvisor_btn" defaultText="See guest photos on TripAdvisor" currentText={getText('gallery_tripadvisor_btn')} editMode={editMode} /> <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </section>

      {/* FULL RESPONSIVE LIGHTBOX MODAL */}
      {selectedPhotoIndex !== null && (
        <div
          id="lightbox-overlay"
          className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-between p-4 cursor-pointer"
          onClick={() => setSelectedPhotoIndex(null)}
        >
          {/* Lightbox Header Close */}
          <div className="w-full flex justify-between items-center text-cream px-4 py-2 z-10">
            <span className="text-xs font-mono tracking-widest uppercase">
              <EditableText as="span" page="gallery" contentKey="gallery_lightbox_photo" defaultText="Photo" currentText={getText('gallery_lightbox_photo')} editMode={editMode} /> {selectedPhotoIndex + 1} <EditableText as="span" page="gallery" contentKey="gallery_lightbox_of" defaultText="of" currentText={getText('gallery_lightbox_of')} editMode={editMode} /> {photos.length}
            </span>
            <button
              onClick={() => setSelectedPhotoIndex(null)}
              className="p-1 rounded-full text-cream hover:text-nanohana transition-colors"
              aria-label="Close Lightbox"
            >
              <X className="w-8 h-8" />
            </button>
          </div>

          {/* Central Slide Navigation */}
          <div className="relative w-full max-w-4xl h-[65vh] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            {/* Prev Trigger */}
            <button
              onClick={handlePrevMedia}
              className="absolute left-2 p-2.5 rounded-full bg-white/5 border border-white/10 text-white hover:text-nanohana transition-colors z-25"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Core Image inside frame */}
            <div className="relative w-full h-full max-h-full rounded-lg overflow-hidden border border-white/10">
              <Image
                src={photos[selectedPhotoIndex].image}
                alt={photos[selectedPhotoIndex].title}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>

            {/* Next Trigger */}
            <button
              onClick={handleNextMedia}
              className="absolute right-2 p-2.5 rounded-full bg-white/5 border border-white/10 text-white hover:text-nanohana transition-colors z-25"
              aria-label="Next photo"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Sinks Title & Explanation */}
          <div className="text-center text-cream px-4 py-4 max-w-xl z-10 space-y-1">
            <EditableText as="h3" page="gallery" contentKey={`gallery_item_${photos[selectedPhotoIndex].id}_title`} defaultText={photos[selectedPhotoIndex].title} currentText={getText(`gallery_item_${photos[selectedPhotoIndex].id}_title`)} editMode={editMode} className="font-serif text-xl font-bold text-cream" />
            <EditableText as="p" page="gallery" contentKey={`gallery_item_${photos[selectedPhotoIndex].id}_desc`} defaultText={photos[selectedPhotoIndex].desc} currentText={getText(`gallery_item_${photos[selectedPhotoIndex].id}_desc`)} editMode={editMode} className="text-xs text-cream/75 leading-relaxed" />
          </div>
        </div>
      )}
    </div>
  );
}
