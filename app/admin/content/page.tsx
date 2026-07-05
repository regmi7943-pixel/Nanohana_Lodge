'use client';

import React, { useState, useEffect } from 'react';
import { RefreshCw, Monitor, ArrowLeft, ExternalLink, Undo2 } from 'lucide-react';
import Link from 'next/link';
import { updateContent } from '@/app/actions/updateContent';

const PAGES = [
  { key: 'home', label: 'Home', path: '/' },
  { key: 'about', label: 'About', path: '/about' },
  { key: 'rooms', label: 'Rooms', path: '/rooms' },
  { key: 'facilities', label: 'Facilities', path: '/facilities' },
  { key: 'gallery', label: 'Gallery', path: '/gallery' },
  { key: 'explore', label: 'Explore', path: '/explore' },
  { key: 'contact', label: 'Contact', path: '/contact' },
  { key: 'reservations', label: 'Reservations', path: '/reservations' },
] as const;

export default function ContentEditor() {
  const [activePage, setActivePage] = useState<typeof PAGES[number]>(PAGES[0]);
  const [refreshCounters, setRefreshCounters] = useState<Record<string, number>>({});
  const [visitedPages, setVisitedPages] = useState<Set<string>>(new Set([PAGES[0].key]));
  const [undoStack, setUndoStack] = useState<Array<{ page: string, key: string, oldValue: string, newValue: string }>>([]);

  const handlePageChange = (page: typeof PAGES[number]) => {
    setActivePage(page);
    setVisitedPages(prev => new Set(prev).add(page.key));
  };

  const handleRefresh = () => {
    setRefreshCounters(prev => ({
      ...prev,
      [activePage.key]: (prev[activePage.key] || 0) + 1
    }));
  };

  // Listen to content updates from iframe to populate undo stack
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type === 'CONTENT_UPDATED') {
        const { page, key, oldValue, newValue } = event.data;
        setUndoStack(prev => [...prev, { page, key, oldValue, newValue }]);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleUndo = async () => {
    if (undoStack.length === 0) return;
    const lastChange = undoStack[undoStack.length - 1];

    // Revert DB content to oldValue
    await updateContent(lastChange.page, lastChange.key, lastChange.oldValue);

    // Remove from stack
    setUndoStack(prev => prev.slice(0, -1));

    // Automatically switch active tab to the page of the change
    const pageToSwitch = PAGES.find(p => p.key === lastChange.page);
    if (pageToSwitch) {
      setActivePage(pageToSwitch);
      setVisitedPages(prev => new Set(prev).add(pageToSwitch.key));
    }

    // Refresh the corresponding iframe to display reverted content
    setRefreshCounters(prev => ({
      ...prev,
      [lastChange.page]: (prev[lastChange.page] || 0) + 1
    }));
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-black">
      {/* Top Floating Control Bar */}
      <div className="h-14 flex-shrink-0 bg-[#0f0f23]/98 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-5 z-50">
        <div className="flex items-center gap-4">
          <Link
            href="/admin"
            className="flex items-center gap-1.5 text-white/50 hover:text-white transition-colors text-xs font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Dashboard
          </Link>
          <div className="h-5 w-px bg-white/10" />
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-nanohana/70 font-bold tracking-[0.15em] uppercase hidden sm:inline">Page:</span>
            <div className="flex gap-1">
              {PAGES.map(page => (
                <button
                  key={page.key}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                    activePage.key === page.key
                      ? 'bg-nanohana text-[#0f0f23]'
                      : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/80'
                  }`}
                >
                  {page.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleUndo}
            disabled={undoStack.length === 0}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              undoStack.length > 0
                ? 'bg-nanohana/10 hover:bg-nanohana/20 border border-nanohana/30 text-nanohana cursor-pointer'
                : 'bg-white/5 text-white/20 border border-transparent cursor-not-allowed'
            }`}
            title={undoStack.length > 0 ? `Undo last edit (${undoStack.length} changes)` : 'Nothing to undo'}
          >
            <Undo2 className="w-3.5 h-3.5" /> Undo {undoStack.length > 0 ? `(${undoStack.length})` : ''}
          </button>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-md text-xs transition-colors text-white/60 hover:text-white"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
          <a
            href={activePage.path}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-nanohana text-[#0f0f23] font-bold rounded-md hover:bg-nanohana/90 transition-colors text-xs"
          >
            Live <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Fullscreen iframe */}
      <div className="flex-1 relative w-full h-full">
        <div className="absolute top-3 left-3 flex items-center gap-2 z-10 pointer-events-none">
          <div className="bg-black/60 backdrop-blur-lg px-3 py-1.5 rounded-lg border border-white/5 flex items-center gap-2">
            <Monitor className="w-3.5 h-3.5 text-nanohana/70" />
            <span className="text-[10px] text-white/50 font-mono font-medium">Hover text to see edit indicator · Click to edit inline</span>
          </div>
        </div>
        {PAGES.map(page => {
          if (!visitedPages.has(page.key)) return null;
          
          const isActive = activePage.key === page.key;
          const refreshCount = refreshCounters[page.key] || 0;
          
          return (
            <iframe
              key={`${page.key}-${refreshCount}`}
              src={`${page.path}?editMode=true`}
              className={`absolute inset-0 w-full h-full border-0 bg-white transition-opacity duration-200 ${
                isActive ? 'opacity-100 z-0' : 'opacity-0 -z-10 pointer-events-none'
              }`}
              title={`Website Live Editor - ${page.label}`}
            />
          );
        })}
      </div>
    </div>
  );
}
