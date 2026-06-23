'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

const CurtainLoader = () => {
  const [showCurtain, setShowCurtain] = useState(true);
  const [isOpening, setIsOpening] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const searchParams = useSearchParams();
  const isEditMode = searchParams.get('editMode') === 'true';

  useEffect(() => {
    setIsClient(true);

    // Trigger the curtain open animation after a short delay
    const openTimer = setTimeout(() => {
      setIsOpening(true);
    }, 800); // Wait 800ms before opening

    // Completely remove the curtain from DOM after animation completes
    const removeTimer = setTimeout(() => {
      setShowCurtain(false);
    }, 2500); // 800ms delay + 1.5s animation + buffer

    return () => {
      clearTimeout(openTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  // Avoid rendering anything on the server to prevent hydration mismatch with sessionStorage
  if (!isClient) return null;

  if (isEditMode || !showCurtain) return null;

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none flex">
      {/* Left Curtain Panel */}
      <div
        style={{
          transform: isOpening ? 'translateX(-100%)' : 'translateX(0)',
          transition: 'transform 1.5s cubic-bezier(0.76, 0, 0.24, 1)',
        }}
        className="w-1/2 h-full relative overflow-hidden bg-black shadow-[10px_0_20px_rgba(0,0,0,0.5)] z-10"
      >
        <Image
          src="/curtain.png"
          alt="Curtain Left"
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: 'left center' }}
        />
      </div>

      {/* Right Curtain Panel */}
      <div
        style={{
          transform: isOpening ? 'translateX(100%)' : 'translateX(0)',
          transition: 'transform 1.5s cubic-bezier(0.76, 0, 0.24, 1)',
        }}
        className="w-1/2 h-full relative overflow-hidden bg-black shadow-[-10px_0_20px_rgba(0,0,0,0.5)] z-10"
      >
        <Image
          src="/curtain.png"
          alt="Curtain Right"
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: 'right center' }}
        />
      </div>
    </div>
  );
}
export default React.memo(CurtainLoader);

