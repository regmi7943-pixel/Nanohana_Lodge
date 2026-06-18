'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
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
      <motion.div
        initial={{ x: 0 }}
        animate={{ x: isOpening ? '-100%' : 0 }}
        transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1] }}
        className="w-1/2 h-full relative overflow-hidden bg-black shadow-[10px_0_20px_rgba(0,0,0,0.5)] z-10"
      >
        <img
          src="/curtain.png"
          alt="Curtain Left"
          className="absolute top-0 left-0 w-[100vw] h-full object-cover max-w-none"
        />
      </motion.div>

      {/* Right Curtain Panel */}
      <motion.div
        initial={{ x: 0 }}
        animate={{ x: isOpening ? '100%' : 0 }}
        transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1] }}
        className="w-1/2 h-full relative overflow-hidden bg-black shadow-[-10px_0_20px_rgba(0,0,0,0.5)] z-10"
      >
        <img
          src="/curtain.png"
          alt="Curtain Right"
          className="absolute top-0 right-0 w-[100vw] h-full object-cover max-w-none"
        />
      </motion.div>
    </div>
  );
}
export default React.memo(CurtainLoader);
