import React, { Suspense } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import CurtainLoader from '@/components/CurtainLoader';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense fallback={null}>
        <CurtainLoader />
        <Navigation />
      </Suspense>
      {children}
      <Footer />
    </>
  );
}
