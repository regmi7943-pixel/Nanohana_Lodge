'use client';

import React, { useState, useEffect, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, Link2, Check, Loader2, X, Trash2, Images } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { uploadImage, getUploadedImages } from '@/app/actions/uploadImage';
import { updateContent } from '@/app/actions/updateContent';

interface CloudinaryImage {
  name: string;
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
  createdAt: string;
}

import { defaultRooms } from '@/lib/defaultRooms';

const MAIN_CATEGORIES = ['Rooms', 'Garden & Terrace', 'Views', 'Pokhara'];
const ROOM_CATEGORIES = ['Room', 'Washroom', 'View'];

export default function ImagesClient({ content = [] }: { content?: any[] }) {
  const rawRooms = content.find((c: any) => c.key === 'global_rooms_list')?.value;
  let DB_ROOMS = [];
  try {
    DB_ROOMS = rawRooms ? JSON.parse(rawRooms) : defaultRooms;
  } catch(e) {
    DB_ROOMS = defaultRooms;
  }

  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeManager, setActiveManager] = useState<'main' | 'rooms'>('main');

  // Main Gallery State
  const [selectedMainCategory, setSelectedMainCategory] = useState(MAIN_CATEGORIES[0]);

  // Room Gallery State
  const [selectedRoom, setSelectedRoom] = useState(DB_ROOMS[0]?.id || 'room-1');
  const [selectedRoomCategory, setSelectedRoomCategory] = useState(ROOM_CATEGORIES[0]);

  // --- MAIN GALLERY LOGIC ---
  const getPublicGallery = () => {
    const raw = content.find((c: any) => c.key === 'global_gallery_photos')?.value;
    if (raw) {
      try { return JSON.parse(raw); } catch (e) { return []; }
    }
    return [];
  };

  const handleMainGalleryUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);
    setUploadError('');

    const newGallery = [...getPublicGallery()];
    
    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append('file', file);
      const result = await uploadImage(formData);
      if (result.success && result.url) {
        newGallery.push({ 
          id: Date.now() + Math.floor(Math.random() * 1000),
          url: result.url, 
          category: selectedMainCategory,
          title: `New ${selectedMainCategory} Photo`,
          desc: `A beautiful photo of our ${selectedMainCategory.toLowerCase()}.`
        });
      } else {
        setUploadError(result.error || 'Upload failed');
      }
    }

    await updateContent('global', 'global_gallery_photos', JSON.stringify(newGallery));
    window.location.reload(); 
    setIsUploading(false);
  };

  const removeMainImage = async (imgId: number) => {
    setIsUploading(true);
    const current = getPublicGallery();
    const newGallery = current.filter((img: any) => img.id !== imgId);
    await updateContent('global', 'global_gallery_photos', JSON.stringify(newGallery));
    window.location.reload();
  };

  const currentMainGallery = getPublicGallery().filter((img: any) => img.category === selectedMainCategory);

  // --- ROOM GALLERY LOGIC ---
  const getRoomGallery = (roomId: string) => {
    const raw = content.find((c: any) => c.key === `gallery_${roomId}`)?.value;
    if (raw) {
      try { return JSON.parse(raw); } catch (e) { return []; }
    }
    return []; // Start empty if no custom DB gallery
  };

  const handleRoomGalleryUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);
    setUploadError('');

    const newGallery = [...getRoomGallery(selectedRoom)];
    
    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append('file', file);
      const result = await uploadImage(formData);
      if (result.success && result.url) {
        newGallery.push({ url: result.url, category: selectedRoomCategory });
      } else {
        setUploadError(result.error || 'Upload failed');
      }
    }

    await updateContent('rooms', `gallery_${selectedRoom}`, JSON.stringify(newGallery));
    window.location.reload(); 
    setIsUploading(false);
  };

  const removeRoomImage = async (imgUrl: string) => {
    setIsUploading(true);
    const current = getRoomGallery(selectedRoom);
    const newGallery = current.filter((img: any) => img.url !== imgUrl);
    await updateContent('rooms', `gallery_${selectedRoom}`, JSON.stringify(newGallery));
    window.location.reload();
  };

  const currentRoomGallery = getRoomGallery(selectedRoom).filter((img: any) => img.category === selectedRoomCategory);

  return (
    <div className="max-w-6xl space-y-8 pb-20">
      <div>
        <h1 className="text-3xl font-serif font-bold text-white mb-2">Image Manager</h1>
        <p className="text-cream/60">Upload and manage your galleries and room photos.</p>
      </div>

      <div className="animate-fade-in max-w-4xl mx-auto space-y-8">
        
        {/* Manager Selection Tabs */}
        <div className="flex bg-black/40 p-1.5 rounded-full border border-white/10 w-fit mx-auto">
          <button
            onClick={() => setActiveManager('main')}
            className={`px-8 py-3 rounded-full text-sm font-semibold transition-all ${
              activeManager === 'main' 
                ? 'bg-nanohana text-earth shadow-md' 
                : 'text-cream/60 hover:text-white hover:bg-white/5'
            }`}
          >
            Public Gallery Manager
          </button>
          <button
            onClick={() => setActiveManager('rooms')}
            className={`px-8 py-3 rounded-full text-sm font-semibold transition-all ${
              activeManager === 'rooms' 
                ? 'bg-nanohana text-earth shadow-md' 
                : 'text-cream/60 hover:text-white hover:bg-white/5'
            }`}
          >
            Room Photos Manager
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeManager === 'main' && (
            <motion.div key="main" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
              {/* Category Tabs */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                  <h2 className="text-sm font-mono uppercase tracking-widest text-cream/50">1. Select Public Category</h2>
                  <div className="flex flex-wrap bg-black/40 p-1 rounded-full border border-white/10 w-full sm:w-auto">
                    {MAIN_CATEGORIES.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setSelectedMainCategory(cat)}
                        className={`px-6 py-2 rounded-full text-sm font-semibold transition-all flex-grow sm:flex-grow-0 text-center ${
                          selectedMainCategory === cat 
                            ? 'bg-phewa text-cream shadow-sm' 
                            : 'text-cream/60 hover:text-white'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Upload & Grid */}
                <div className="space-y-6">
                  {/* Upload Zone */}
                  <div
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={(e) => { e.preventDefault(); setDragOver(false); handleMainGalleryUpload(e.dataTransfer.files); }}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-6 flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-4 cursor-pointer transition-all ${
                      dragOver ? 'border-phewa bg-phewa/10' : 'border-white/10 bg-black/20 hover:bg-black/40 hover:border-white/30'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => handleMainGalleryUpload(e.target.files)}
                    />
                    <div className={`w-12 h-12 flex-shrink-0 rounded-full flex items-center justify-center transition-all ${dragOver ? 'bg-phewa text-cream scale-110' : 'bg-white/10 text-cream'}`}>
                      {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <UploadCloud className="w-5 h-5" />}
                    </div>
                    <div className="text-center sm:text-left">
                      <h3 className="text-sm font-bold text-white">
                        {isUploading ? 'Uploading to ' + selectedMainCategory + '...' : `Add photos to ${selectedMainCategory}`}
                      </h3>
                      <p className="text-xs text-cream/50 mt-1">Drag & drop or click to browse</p>
                    </div>
                  </div>

                  {/* Photo Grid */}
                  {currentMainGallery.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {currentMainGallery.map((img: any) => (
                        <div key={img.id} className="relative group aspect-square rounded-xl overflow-hidden border border-white/10 bg-black/40">
                          <img src={img.url} alt="Gallery image" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center">
                            <button
                              onClick={(e) => { e.stopPropagation(); removeMainImage(img.id); }}
                              className="p-3 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-transform transform scale-90 group-hover:scale-100"
                              title="Remove image"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-12 text-center text-cream/40">
                      <Images className="w-12 h-12 mx-auto mb-3 opacity-20" />
                      <p>No photos uploaded for <span className="text-white font-semibold">{selectedMainCategory}</span> yet.</p>
                      <p className="text-xs mt-1">The live gallery will use default placeholders if empty.</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeManager === 'rooms' && (
            <motion.div key="rooms" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
              {/* Room Selection Dropdown/Cards */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h2 className="text-sm font-mono uppercase tracking-widest text-cream/50 mb-4">1. Select Room</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {DB_ROOMS.map((room: any) => (
                    <button
                      key={room.id}
                      onClick={() => setSelectedRoom(room.id)}
                      className={`px-4 py-3 text-sm rounded-xl font-medium transition-all text-center border ${
                        selectedRoom === room.id 
                          ? 'bg-nanohana text-earth border-nanohana shadow-md scale-105' 
                          : 'bg-black/20 text-cream/70 border-white/10 hover:border-white/30 hover:bg-black/40'
                      }`}
                    >
                      {room.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Tabs */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                  <h2 className="text-sm font-mono uppercase tracking-widest text-cream/50">2. Edit Gallery</h2>
                  <div className="flex bg-black/40 p-1 rounded-full border border-white/10">
                    {ROOM_CATEGORIES.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setSelectedRoomCategory(cat)}
                        className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
                          selectedRoomCategory === cat 
                            ? 'bg-phewa text-cream shadow-sm' 
                            : 'text-cream/60 hover:text-white'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Upload & Grid */}
                <div className="space-y-6">
                  {/* Upload Zone */}
                  <div
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={(e) => { e.preventDefault(); setDragOver(false); handleRoomGalleryUpload(e.dataTransfer.files); }}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-6 flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-4 cursor-pointer transition-all ${
                      dragOver ? 'border-phewa bg-phewa/10' : 'border-white/10 bg-black/20 hover:bg-black/40 hover:border-white/30'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => handleRoomGalleryUpload(e.target.files)}
                    />
                    <div className={`w-12 h-12 flex-shrink-0 rounded-full flex items-center justify-center transition-all ${dragOver ? 'bg-phewa text-earth scale-110' : 'bg-white/10 text-cream'}`}>
                      {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <UploadCloud className="w-5 h-5" />}
                    </div>
                    <div className="text-center sm:text-left">
                      <h3 className="text-sm font-bold text-white">
                        {isUploading ? 'Uploading to ' + selectedRoomCategory + '...' : `Add photos to ${selectedRoomCategory}`}
                      </h3>
                      <p className="text-xs text-cream/50 mt-1">Drag & drop or click to browse</p>
                    </div>
                  </div>

                  {/* Photo Grid */}
                  {currentRoomGallery.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {currentRoomGallery.map((img: any, idx: number) => (
                        <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden border border-white/10 bg-black/40">
                          <img src={img.url} alt="Gallery image" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center">
                            <button
                              onClick={(e) => { e.stopPropagation(); removeRoomImage(img.url); }}
                              className="p-3 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-transform transform scale-90 group-hover:scale-100"
                              title="Remove image"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-12 text-center text-cream/40">
                      <Images className="w-12 h-12 mx-auto mb-3 opacity-20" />
                      <p>No photos uploaded for <span className="text-white font-semibold">{selectedRoomCategory}</span> yet.</p>
                      <p className="text-xs mt-1">The live site will use default placeholders.</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
