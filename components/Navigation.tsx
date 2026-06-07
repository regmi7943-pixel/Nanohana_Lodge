'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Menu, X, Leaf } from 'lucide-react';

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isEditMode = searchParams.get('editMode') === 'true';

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 60) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Rooms & Suites', path: '/rooms' },
    { name: 'Facilities', path: '/facilities' },
    { name: 'Our Story', path: '/about' },
    { name: 'Explore Pokhara', path: '/explore' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact', path: '/contact' },
  ];

  if (isEditMode) return null;

  return (
    <>
      <nav
        id="navbar"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 md:px-20 px-5 py-4 flex items-center justify-between ${
          isScrolled
            ? 'bg-forest shadow-md border-b border-white/10'
            : 'bg-transparent'
        }`}
      >
        {/* Left - Brand Wordmark & Tiny Icon */}
        <Link id="nav-brand-link" href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 group">
          <Leaf className="w-5 h-5 text-nanohana animate-pulse" />
          <div className="flex flex-col">
            <span id="nav-brand-title" className="font-serif text-2xl tracking-wide text-cream group-hover:text-nanohana transition-colors">
              Nanohana Lodge
            </span>
            <span id="nav-brand-subtitle" className="text-[10px] uppercase tracking-widest text-sage -mt-1 font-sans">
              Pokhara · Nepal
            </span>
          </div>
        </Link>

        {/* Center - Links (Desktop) */}
        <div id="nav-desktop-links" className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.path;
            return (
              <Link
                key={link.path}
                href={link.path}
                className={`relative py-1 font-sans text-sm tracking-wide transition-colors ${
                  isActive ? 'text-nanohana font-medium' : 'text-cream/90 hover:text-nanohana'
                }`}
              >
                {link.name}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-nanohana rounded-full" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Right - Reservations CTA Button (Desktop) */}
        <div id="nav-desktop-cta" className="hidden lg:block">
          <Link
            id="nav-book-btn"
            href="/reservations"
            className="px-6 py-2.5 rounded-full bg-nanohana text-earth font-sans text-sm font-medium tracking-wide hover:bg-nanohana/90 active:scale-95 transition-all text-center block"
          >
            Book your stay
          </Link>
        </div>

        {/* Mobile Menu Trigger */}
        <button
          id="nav-mobile-hamburger"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden text-cream p-1 select-none hover:text-nanohana transition-colors"
          aria-label={isMobileMenuOpen ? 'Close Menu' : 'Open Menu'}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          id="mobile-menu-overlay"
          className="fixed inset-0 z-40 bg-forest flex flex-col justify-between px-6 pt-24 pb-12 transition-all duration-300 animate-fade-in"
        >
          <div className="flex flex-col gap-6 pt-5">
            {navLinks.map((link, index) => {
              const isActive = pathname === link.path;
              return (
                <Link
                  key={link.path}
                  id={`mobile-nav-link-${index}`}
                  href={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`font-serif text-3xl tracking-wide py-2 block transition-colors ${
                    isActive ? 'text-nanohana border-l-4 border-nanohana pl-3' : 'text-cream/90 hover:text-nanohana pl-1'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          <div className="flex flex-col gap-5 border-t border-cream/10 pt-6">
            <span className="text-xs uppercase tracking-widest text-sage">
              Ammat, Lakeside, Pokhara
            </span>
            <Link
              id="mobile-book-btn"
              href="/reservations"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full py-4 rounded-full bg-nanohana text-earth text-center font-sans font-medium hover:bg-nanohana/90 transition-colors"
            >
              Book your stay
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
