'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Image as ImageIcon, CalendarDays, Type, LogOut, Loader2, Bed, Inbox, Settings } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push(`/12312341?redirect=${encodeURIComponent(pathname)}`);
      } else {
        setIsAuthenticated(true);
        setUserEmail(session.user.email || '');
      }
    };
    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        router.push('/12312341');
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/12312341');
  };

  const navItems = [
    { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/admin/rooms', icon: Bed, label: 'Room Manager' },
    { href: '/admin/images', icon: ImageIcon, label: 'Image Manager' },
    { href: '/admin/bookings', icon: CalendarDays, label: 'Booking Manager' },
    { href: '/admin/booking-requests', icon: Inbox, label: 'Booking Requests Manager' },
    { href: '/admin/content', icon: Type, label: 'Text Editor' },
    { href: '/admin/settings', icon: Settings, label: 'Settings' },
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-earth flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-nanohana animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1c221e] flex text-cream font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-earth border-r border-white/5 flex-col hidden md:flex">
        <div className="p-6 border-b border-white/5">
          <h2 className="font-serif text-xl font-bold text-nanohana">Nanohana Admin</h2>
          <p className="text-[10px] text-cream/40 mt-1 font-mono truncate">{userEmail}</p>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${
                  isActive ? 'bg-nanohana/10 text-nanohana' : 'text-cream/70 hover:bg-white/5 hover:text-cream'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-nanohana' : 'text-cream/50'}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-400 hover:bg-red-400/10 transition-colors text-sm font-medium"
          >
            <LogOut className="w-5 h-5" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="md:hidden flex items-center justify-between p-4 bg-earth border-b border-white/5">
          <h2 className="font-serif text-lg font-bold text-nanohana">Nanohana Admin</h2>
          <button onClick={handleLogout} className="p-2 text-red-400 bg-red-400/10 rounded-lg">
            <LogOut className="w-5 h-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
