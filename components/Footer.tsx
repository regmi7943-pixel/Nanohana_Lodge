import React from 'react';
import Link from 'next/link';
import { Compass, Facebook } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="footer" className="bg-earth text-cream/90 pt-16 pb-12 border-t border-forest/10">
      <div className="max-w-[1240px] mx-auto px-6 md:px-10 lg:px-20">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-8 border-b border-cream/10 pb-12 mb-8">
          
          {/* Brand & Concept */}
          <div className="space-y-3">
            <h3 className="font-serif text-2xl tracking-widest text-cream uppercase">
              Nanohana Lodge
            </h3>
            <p className="text-sm font-light text-cream/70 max-w-md leading-relaxed">
              Seventeen rooms. Garden, rooftop, mountains. Lakeside, Pokhara.<br />
              A lodge that knows what it is and does not try to be anything else.
            </p>
          </div>

          {/* Minimalist Horizontal Navigation */}
          <div className="flex flex-wrap gap-x-6 gap-y-3 text-xs uppercase tracking-widest text-cream/80 pt-2 font-mono">
            <Link href="/" className="hover:text-cream transition-colors">
              Home
            </Link>
            <span className="text-cream/20">|</span>
            <Link href="/rooms" className="hover:text-cream transition-colors">
              Rooms
            </Link>
            <span className="text-cream/20">|</span>
            <Link href="/facilities" className="hover:text-cream transition-colors">
              Facilities
            </Link>
            <span className="text-cream/20">|</span>
            <Link href="/about" className="hover:text-cream transition-colors">
              About
            </Link>
            <span className="text-cream/20">|</span>
            <Link href="/contact" className="hover:text-cream transition-colors">
              Contact
            </Link>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs tracking-wider text-cream/60">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6">
            <span>© 2026 Nanohana Lodge. All rights reserved.</span>
            <a 
              href="https://facebook.com/NanohanaLodge" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-1.5 text-cream/50 hover:text-cream transition-colors font-mono text-[10px] uppercase tracking-wider"
              id="footer-facebook-link"
            >
              <Facebook className="w-3.5 h-3.5" />
              <span>Facebook</span>
            </a>
          </div>
          <div className="flex items-center gap-2 italic text-cream/50">
            <Compass className="w-3.5 h-3.5" />
            <span>Sustainable travel & organic simplicity in Pokhara</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
