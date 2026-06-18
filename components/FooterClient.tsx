'use client';

import React from 'react';
import Link from 'next/link';
import { useSearchParams, usePathname } from 'next/navigation';
import { Compass, Facebook, Instagram } from 'lucide-react';
import Image from 'next/image';

interface FooterClientProps {
  content: Record<string, string>;
}

export default function FooterClient({ content }: FooterClientProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const isEditMode = searchParams.get('editMode') === 'true';

  if (isEditMode) return null;

  const footerLinks = [
    { name: 'Home', path: '/' },
    { name: 'Rooms', path: '/rooms' },
    { name: 'Facilities', path: '/facilities' },
    { name: 'About', path: '/about' },
    { name: 'Explore Pokhara', path: '/explore' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact', path: '/contact' },
  ];

  const companyLogo = content['global_company_logo'] || 'Nanohana Lodge';
  const phoneNumber = content['global_contact_phone'] || '';
  const address = content['global_location_address'] || 'Pokhara, Nepal';
  const facebookUrl = content['global_social_facebook'] || 'https://facebook.com/NanohanaLodge';
  const instagramUrl = content['global_social_instagram'] || '';

  return (
    <footer id="footer" className="bg-earth text-cream/90 pt-16 pb-12 border-t border-forest/10">
      <div className="max-w-[1240px] mx-auto px-6 md:px-10 lg:px-20">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-8 border-b border-cream/10 pb-12 mb-8">
          
          {/* Brand & Concept */}
          <div className="space-y-3">
            <h3 className="font-serif text-2xl tracking-widest text-cream uppercase">
              {companyLogo}
            </h3>
            <p className="text-sm font-light text-cream/70 max-w-md leading-relaxed">
              Seventeen rooms. Garden, rooftop, mountains. Lakeside, Pokhara.<br />
              A lodge that knows what it is and does not try to be anything else.
            </p>
            <div className="pt-2 text-sm text-cream/60 font-mono flex flex-col gap-1">
              {address && <span>{address}</span>}
              {phoneNumber && <span>{phoneNumber}</span>}
            </div>
          </div>

          {/* Minimalist Horizontal Navigation */}
          <nav aria-label="Footer Navigation" className="flex flex-wrap gap-x-6 gap-y-3 text-xs uppercase tracking-widest text-cream/80 pt-2 font-mono">
            {footerLinks.map((link, index) => {
              const isActive = link.path === '/' ? pathname === '/' : pathname.startsWith(link.path);
              return (
                <React.Fragment key={link.path}>
                  <Link 
                    href={link.path} 
                    className={`transition-colors ${isActive ? 'text-nanohana font-semibold' : 'hover:text-cream'}`}
                  >
                    {link.name}
                  </Link>
                  {index < footerLinks.length - 1 && (
                    <span className="text-cream/20" aria-hidden="true">|</span>
                  )}
                </React.Fragment>
              );
            })}
          </nav>
        </div>

        {/* Footer Bottom */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs tracking-wider text-cream/60">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6">
            <span>© {new Date().getFullYear()} {companyLogo}. All rights reserved.</span>
            <div className="flex items-center gap-4">
              {facebookUrl && (
                <a 
                  href={facebookUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-1.5 text-cream/50 hover:text-cream transition-colors font-mono text-[10px] uppercase tracking-wider"
                  id="footer-facebook-link"
                  aria-label="Visit our Facebook page"
                >
                  <Facebook className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Facebook</span>
                </a>
              )}
              {instagramUrl && (
                <a 
                  href={instagramUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-1.5 text-cream/50 hover:text-cream transition-colors font-mono text-[10px] uppercase tracking-wider"
                  aria-label="Visit our Instagram page"
                >
                  <Instagram className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Instagram</span>
                </a>
              )}
            </div>
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
