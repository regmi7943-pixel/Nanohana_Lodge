import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import CurtainLoader from '@/components/CurtainLoader';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CurtainLoader />
      <Navigation />
      {children}
      <Footer />
    </>
  );
}
