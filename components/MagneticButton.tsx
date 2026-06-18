'use client';

import React, { useRef, useEffect } from 'react';
import { motion, useSpring, HTMLMotionProps } from 'framer-motion';

interface MagneticButtonProps extends Omit<HTMLMotionProps<"button">, "ref"> {
  children: React.ReactNode;
}

const MagneticButton = ({
  children,
  className = '',
  ...props
}: MagneticButtonProps) => {
  const ref = useRef<HTMLButtonElement>(null);
  
  // Physics-based spring configuration for smooth movement
  const springConfig = { stiffness: 150, damping: 15, mass: 0.1 };
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { height, width, left, top } = node.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;
      
      x.set((clientX - centerX) * 0.3);
      y.set((clientY - centerY) * 0.3);
    };

    const handleMouseLeave = () => {
      x.set(0);
      y.set(0);
    };

    node.addEventListener('mousemove', handleMouseMove);
    node.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      node.removeEventListener('mousemove', handleMouseMove);
      node.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [x, y]);

  return (
    <motion.button
      ref={ref}
      style={{ x, y }}
      className={`relative inline-flex items-center justify-center transition-colors ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
export default React.memo(MagneticButton);
