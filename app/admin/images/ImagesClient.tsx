'use client';

import React, { useState, useEffect, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, Link2, Check, Loader2, X, Trash2, Images } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { uploadImage, getUploadedImages } from '@/app/actions/uploadImage';
import { updateContent } from '@/app/actions/updateContent';
import { Pencil } from 'lucide-react';

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

  // Editing State
  const [editingImage, setEditingImage] = useState<any>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');

  // Upload Dialog State
  const [pendingFiles, setPendingFiles] = useState<File[] | null>(null);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadDesc, setUploadDesc] = useState('');

  // --- MAIN GALLERY LOGIC ---
  const getPublicGallery = () => {
    const raw = content.find((c: any) => c.key === 'global_gallery_photos')?.value;
    if (raw) {
      try { return JSON.parse(raw); } catch (e) { return []; }
    }
    return [];
  };

  const handleMainGallerySelection = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploadTitle(`New ${selectedMainCategory} Photo`);
    setUploadDesc(`A beautiful photo of our ${selectedMainCategory.toLowerCase()}.`);
    setPendingFiles(Array.from(files));
  };

  const confirmMainGalleryUpload = async () => {
    if (!pendingFiles || pendingFiles.length === 0) return;
    setIsUploading(true);
    setUploadError('');

    const newGallery = [...getPublicGallery()];
    
    for (const file of pendingFiles) {
      const formData = new FormData();
      formData.append('file', file);
      const result = await uploadImage(formData);
      if (result.success && result.url) {
        newGallery.push({ 
          id: Date.now() + Math.floor(Math.random() * 1000),
          url: result.url, 
          category: selectedMainCategory,
          title: uploadTitle,
          desc: uploadDesc
        });
      } else {
        setUploadError(result.error || 'Upload failed');
      }
    }

    await updateContent('global', 'global_gallery_photos', JSON.stringify(newGallery));
    setPendingFiles(null);
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

  const saveMainImageDetails = async () => {
    setIsUploading(true);
    const current = getPublicGallery();
    const newGallery = current.map((img: any) => 
      img.id === editingImage.id 
        ? { ...img, title: editTitle, desc: editDesc } 
        : img
    );
    await updateContent('global', 'global_gallery_photos', JSON.stringify(newGallery));
    setEditingImage(null);
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
                    onDrop={(e) => { e.preventDefault(); setDragOver(false); handleMainGallerySelection(e.dataTransfer.files); }}
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
                      onChange={(e) => handleMainGallerySelection(e.target.files)}
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
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                            <button
                              onClick={(e) => { 
                                e.stopPropagation(); 
                                setEditingImage({ ...img, type: 'main' });
                                setEditTitle(img.title || '');
                                setEditDesc(img.desc || '');
                              }}
                              className="p-3 bg-nanohana hover:bg-nanohana/80 text-earth rounded-full shadow-lg transition-transform transform scale-90 group-hover:scale-100"
                              title="Edit details"
                            >
                              <Pencil className="w-5 h-5" />
                            </button>
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

      {/* Image Details Edit Modal */}
      <AnimatePresence>
        {editingImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-earth border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-serif text-white">Edit Image Details</h3>
                <button onClick={() => setEditingImage(null)} className="text-cream/50 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-widest text-cream/50 mb-2">Title</label>
                  <input 
                    type="text" 
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-cream focus:outline-none focus:border-nanohana transition-colors"
                    placeholder="E.g., Annapurna range from rooftop"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-widest text-cream/50 mb-2">Description</label>
                  <textarea 
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-cream focus:outline-none focus:border-nanohana transition-colors min-h-[100px] resize-none"
                    placeholder="E.g., The sweeping, unobstructed panorama visible from our communal deck at 6:15 AM."
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <button 
                  onClick={() => setEditingImage(null)}
                  className="px-5 py-2.5 rounded-full text-sm font-semibold text-cream/70 hover:text-white hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    if (editingImage.type === 'main') {
                      saveMainImageDetails();
                    }
                  }}
                  disabled={isUploading}
                  className="px-6 py-2.5 rounded-full text-sm font-semibold bg-nanohana text-earth hover:bg-nanohana/90 shadow-lg transition-all flex items-center gap-2"
                >
                  {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  Save Details
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Details Modal */}
      <AnimatePresence>
        {pendingFiles && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-earth border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-serif text-white">Set Details for Upload</h3>
                <button onClick={() => setPendingFiles(null)} className="text-cream/50 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="bg-black/20 border border-white/5 rounded-xl p-4 mb-6 flex items-center gap-4">
                <div className="bg-white/10 w-12 h-12 rounded-lg flex items-center justify-center text-white">
                  <Images className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-white font-medium">{pendingFiles.length} file{pendingFiles.length !== 1 && 's'} selected</p>
                  <p className="text-xs text-cream/50">Category: {selectedMainCategory}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-widest text-cream/50 mb-2">Title</label>
                  <input 
                    type="text" 
                    value={uploadTitle}
                    onChange={(e) => setUploadTitle(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-cream focus:outline-none focus:border-nanohana transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-widest text-cream/50 mb-2">Description</label>
                  <textarea 
                    value={uploadDesc}
                    onChange={(e) => setUploadDesc(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-cream focus:outline-none focus:border-nanohana transition-colors min-h-[100px] resize-none"
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <button 
                  onClick={() => setPendingFiles(null)}
                  className="px-5 py-2.5 rounded-full text-sm font-semibold text-cream/70 hover:text-white hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmMainGalleryUpload}
                  disabled={isUploading}
                  className="px-6 py-2.5 rounded-full text-sm font-semibold bg-nanohana text-earth hover:bg-nanohana/90 shadow-lg transition-all flex items-center gap-2"
                >
                  {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
                  Confirm Upload
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
