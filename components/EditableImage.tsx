'use client';

import React, { useState, useRef, useCallback } from 'react';
import Image, { ImageProps } from 'next/image';
import { Camera, Loader2, X, Check, Crop } from 'lucide-react';
import Cropper from 'react-easy-crop';
import { updateContent } from '@/app/actions/updateContent';
import { uploadImage } from '@/app/actions/uploadImage';
import getCroppedImg from '@/lib/cropImage';

interface EditableImageProps extends Omit<ImageProps, 'src'> {
  page: string;
  contentKey: string;
  defaultSrc: string;
  currentSrc: string | undefined;
  editMode: boolean;
  buttonClassName?: string;
}

import { createPortal } from 'react-dom';

const EditableImage = ({
  page,
  contentKey,
  defaultSrc,
  currentSrc,
  editMode,
  buttonClassName,
  className = '',
  alt,
  ...props
}: EditableImageProps) => {
  let defaultAspect: number | undefined = undefined;
  if (contentKey.includes('hero') || contentKey.includes('bg') || contentKey.includes('atmosphere') || contentKey.includes('carousel')) {
    defaultAspect = 16 / 9;
  } else if (contentKey.includes('story_1') || contentKey.includes('story_2')) {
    defaultAspect = 1; // squares
  }

  const [isUploading, setIsUploading] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [aspect, setAspect] = useState<number | undefined>(defaultAspect);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const displaySrc = currentSrc || defaultSrc;

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset cropper state for the new file
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setAspect(defaultAspect);

    const reader = new FileReader();
    reader.addEventListener('load', () => {
      setImageSrc(reader.result?.toString() || null);
    });
    reader.readAsDataURL(file);
    
    // Reset file input so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSaveCrop = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    try {
      setIsUploading(true);
      
      // Convert crop to File
      const croppedFile = await getCroppedImg(imageSrc, croppedAreaPixels);
      if (!croppedFile) throw new Error("Could not create cropped image");

      const formData = new FormData();
      formData.append('file', croppedFile);

      // 1. Upload to Cloudinary
      const uploadRes = await uploadImage(formData);
      
      if (!uploadRes.success || !uploadRes.url) {
        throw new Error(uploadRes.error || 'Upload failed');
      }

      // 2. Save the URL to Supabase via updateContent
      const res = await updateContent(page, contentKey, uploadRes.url);

      if (res && 'success' in res && res.success) {
        if (typeof window !== 'undefined') {
          window.parent.postMessage({
            type: 'CONTENT_UPDATED',
            page,
            key: contentKey,
            oldValue: displaySrc,
            newValue: uploadRes.url
          }, window.location.origin);
        }
      }

      // 3. Close modal
      setImageSrc(null);
    } catch (err: any) {
      alert(`Error uploading image: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  // View Mode
  if (!editMode) {
    return (
      <Image
        src={displaySrc}
        alt={alt}
        className={className}
        {...props}
      />
    );
  }

  const wrapperClass = props.fill ? 'absolute inset-0 w-full h-full' : 'relative inline-block';

  return (
    <>
      {/* CROP MODAL (Appears top level) */}
      {imageSrc && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black/90 p-4 backdrop-blur-sm">
          <div className="bg-[#1a1f16] border border-white/10 w-full max-w-3xl h-[80vh] flex flex-col rounded-2xl overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/5 bg-black/40">
              <div className="flex items-center gap-2 text-cream">
                <Crop className="w-5 h-5 text-nanohana" />
                <h3 className="font-sans font-semibold text-sm">Crop Image</h3>
              </div>
              <button 
                onClick={() => setImageSrc(null)}
                className="p-1.5 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                disabled={isUploading}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cropper Area */}
            <div className="relative flex-1 bg-black">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={aspect}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>

            {/* Controls */}
            <div className="p-4 sm:p-6 bg-black/40 border-t border-white/5 space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                
                {/* Aspect Ratio Selector */}
                <div className="flex items-center gap-2 text-xs font-semibold">
                  <span className="text-white/50 pr-2">Shape:</span>
                  <button onClick={() => setAspect(undefined)} className={`px-3 py-1.5 rounded-full border ${aspect === undefined ? 'border-nanohana text-nanohana bg-nanohana/10' : 'border-white/20 text-white/70 hover:bg-white/5'} transition-colors`}>Free</button>
                  <button onClick={() => setAspect(16/9)} className={`px-3 py-1.5 rounded-full border ${aspect === 16/9 ? 'border-nanohana text-nanohana bg-nanohana/10' : 'border-white/20 text-white/70 hover:bg-white/5'} transition-colors`}>16:9</button>
                  <button onClick={() => setAspect(4/3)} className={`px-3 py-1.5 rounded-full border ${aspect === 4/3 ? 'border-nanohana text-nanohana bg-nanohana/10' : 'border-white/20 text-white/70 hover:bg-white/5'} transition-colors`}>4:3</button>
                  <button onClick={() => setAspect(1)} className={`px-3 py-1.5 rounded-full border ${aspect === 1 ? 'border-nanohana text-nanohana bg-nanohana/10' : 'border-white/20 text-white/70 hover:bg-white/5'} transition-colors`}>1:1</button>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button 
                    onClick={() => setImageSrc(null)}
                    disabled={isUploading}
                    className="flex-1 sm:flex-none px-4 py-2 rounded-full border border-white/10 text-white/70 hover:bg-white/5 hover:text-white transition-colors text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSaveCrop}
                    disabled={isUploading}
                    className="flex-1 sm:flex-none px-6 py-2 rounded-full bg-nanohana text-earth hover:bg-nanohana/90 transition-colors shadow-lg flex items-center justify-center gap-2 text-xs font-bold disabled:opacity-70"
                  >
                    {isUploading ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                    ) : (
                      <><Check className="w-4 h-4" /> Save Crop</>
                    )}
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Edit Mode Inline Display */}
      <div className={`group ${wrapperClass} ${className}`}>
        <Image
          src={displaySrc}
          alt={alt}
          className={props.fill ? 'object-cover' : ''}
          {...props}
        />
        
        {/* Upload button moved to top-right to avoid blocking text */}
        <div className={`absolute z-[60] pointer-events-none ${buttonClassName || 'top-4 right-4'}`}>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
            className="opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all p-3 rounded-full bg-white text-earth hover:bg-nanohana shadow-2xl hover:scale-105 border border-black/10 flex items-center gap-2 pointer-events-auto"
            title="Change Image"
          >
            <Camera className="w-5 h-5" />
            <span className="text-xs font-bold pr-1">Change Image</span>
          </button>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/jpeg, image/png, image/webp"
          className="hidden"
        />
      </div>
    </>
  );
}
export default React.memo(EditableImage);
