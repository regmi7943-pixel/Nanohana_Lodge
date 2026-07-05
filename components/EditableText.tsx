'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { updateContent } from '@/app/actions/updateContent';
import { Bold, Underline, Palette, Type } from 'lucide-react';

interface EditableTextProps {
  page: string;
  contentKey: string;
  defaultText: string;
  currentText: string | undefined;
  editMode: boolean;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
}

const FONT_OPTIONS = [
  { label: 'Default', value: '' },
  { label: 'Serif', value: 'Georgia, serif' },
  { label: 'Sans', value: 'Inter, Arial, sans-serif' },
  { label: 'Mono', value: 'monospace' },
  { label: 'Cursive', value: 'cursive' },
];

// Utility to save and restore text selection across focus changes
function saveSelection(): Range | null {
  const sel = window.getSelection();
  if (sel && sel.rangeCount > 0) {
    return sel.getRangeAt(0).cloneRange();
  }
  return null;
}

function restoreSelection(range: Range | null) {
  if (!range) return;
  const sel = window.getSelection();
  if (sel) {
    sel.removeAllRanges();
    sel.addRange(range);
  }
}

const EditableText = ({
  page,
  contentKey,
  defaultText,
  currentText,
  editMode,
  className = '',
  as: Component = 'p'
}: EditableTextProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [initialValue, setInitialValue] = useState(currentText || defaultText);
  const [showFontMenu, setShowFontMenu] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isUnderlined, setIsUnderlined] = useState(false);
  const [activeColor, setActiveColor] = useState('#000000');
  const contentRef = useRef<HTMLElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const colorInputRef = useRef<HTMLInputElement>(null);
  const savedRangeRef = useRef<Range | null>(null);

  const displayValue = currentText || defaultText;

  // Auto-focus when editing starts
  useEffect(() => {
    if (isEditing && contentRef.current) {
      contentRef.current.focus();
      const range = document.createRange();
      const sel = window.getSelection();
      if (sel) {
        range.selectNodeContents(contentRef.current);
        range.collapse(false);
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }
  }, [isEditing]);

  // Poll format state while editing so buttons reflect current selection
  useEffect(() => {
    if (!isEditing) return;
    const checkFormats = () => {
      try {
        setIsBold(document.queryCommandState('bold'));
        setIsUnderlined(document.queryCommandState('underline'));
      } catch {}
    };
    // Check on selection changes
    document.addEventListener('selectionchange', checkFormats);
    return () => document.removeEventListener('selectionchange', checkFormats);
  }, [isEditing]);

  // Close font menu on outside click
  useEffect(() => {
    if (!showFontMenu) return;
    const handler = (e: MouseEvent) => {
      if (toolbarRef.current && !toolbarRef.current.contains(e.target as Node)) {
        setShowFontMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showFontMenu]);

  const handleSave = useCallback(async () => {
    if (!contentRef.current) return;
    const newValue = contentRef.current.innerHTML || '';
    const oldValue = displayValue;

    if (newValue.trim() === displayValue.trim()) {
      setIsEditing(false);
      setShowFontMenu(false);
      return;
    }

    setIsSaving(true);
    const result = await updateContent(page, contentKey, newValue);
    setIsSaving(false);

    if (result && 'success' in result && result.success) {
      if (typeof window !== 'undefined') {
        window.parent.postMessage({
          type: 'CONTENT_UPDATED',
          page,
          key: contentKey,
          oldValue,
          newValue
        }, window.location.origin);
      }
    }

    setIsEditing(false);
    setShowFontMenu(false);
  }, [displayValue, page, contentKey]);

  // Click outside to save
  useEffect(() => {
    if (!isEditing) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (contentRef.current && contentRef.current.contains(e.target as Node)) {
        return;
      }
      if (toolbarRef.current && toolbarRef.current.contains(e.target as Node)) {
        return;
      }
      if (colorInputRef.current && colorInputRef.current === e.target) {
        return;
      }

      handleSave();
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isEditing, handleSave]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === 'Escape') {
      if (contentRef.current) {
        contentRef.current.innerHTML = displayValue;
      }
      setIsEditing(false);
      setShowFontMenu(false);
    }
  };

  const execFormat = useCallback((command: string, value?: string) => {
    // Restore saved selection first, then focus, then execute
    restoreSelection(savedRangeRef.current);
    contentRef.current?.focus();
    document.execCommand(command, false, value);
    // Save the new selection state after command
    savedRangeRef.current = saveSelection();
  }, []);

  const handleBold = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    execFormat('bold');
  }, [execFormat]);

  const handleUnderline = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    execFormat('underline');
  }, [execFormat]);

  const handleColorClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Save selection before color picker opens (it steals focus)
    savedRangeRef.current = saveSelection();
    // Programmatically open the color input
    if (colorInputRef.current) {
      colorInputRef.current.click();
    }
  }, []);

  const handleColorChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    setActiveColor(color);
    // Restore selection then apply color
    restoreSelection(savedRangeRef.current);
    contentRef.current?.focus();
    document.execCommand('foreColor', false, color);
    savedRangeRef.current = saveSelection();
  }, []);

  const handleFontToggle = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Save selection before opening the font menu
    savedRangeRef.current = saveSelection();
    setShowFontMenu(prev => !prev);
  }, []);

  const handleFontSelect = useCallback((fontValue: string) => {
    // Restore the saved selection, then apply font
    restoreSelection(savedRangeRef.current);
    contentRef.current?.focus();
    if (fontValue) {
      document.execCommand('fontName', false, fontValue);
    } else {
      document.execCommand('removeFormat');
    }
    savedRangeRef.current = saveSelection();
    setShowFontMenu(false);
  }, []);

  // Save selection whenever the user interacts with content (mouseup, keyup)
  const handleSelectionSave = useCallback(() => {
    savedRangeRef.current = saveSelection();
  }, []);

  // Normal visitor mode — render HTML so saved formatting displays
  if (!editMode) {
    return <Component className={className} dangerouslySetInnerHTML={{ __html: displayValue }} />;
  }

  // Edit Mode: contentEditable with formatting toolbar
  return (
    <div className="relative inline">
      <Component
        ref={contentRef as any}
        contentEditable={isEditing}
        suppressContentEditableWarning={true}
        onClick={(e: React.MouseEvent) => {
          if (!isEditing) {
            e.preventDefault();
            e.stopPropagation();
            setInitialValue(displayValue);
            setIsEditing(true);
          }
        }}
        onMouseUp={isEditing ? handleSelectionSave : undefined}
        onKeyUp={isEditing ? handleSelectionSave : undefined}
        onKeyDown={isEditing ? handleKeyDown : undefined}
        className={`${className} ${
          isEditing
            ? 'outline-none ring-[1.5px] ring-nanohana ring-offset-[3px] ring-offset-[#1a1a2e] rounded-[3px] cursor-text bg-white/5 relative z-10'
            : 'hover:outline-none hover:ring-[1.5px] hover:ring-nanohana/60 hover:ring-offset-[3px] hover:ring-offset-transparent hover:bg-white/5 hover:rounded-[3px] cursor-pointer transition-all duration-150'
        } ${isSaving ? 'opacity-50 pointer-events-none' : ''} relative`}
        dangerouslySetInnerHTML={{ __html: isEditing ? initialValue : displayValue }}
      >
      </Component>

      {/* Formatting Toolbar — appears when editing */}
      {isEditing && (
        <div
          ref={toolbarRef}
          className="absolute -top-10 right-0 z-50 flex items-center gap-1 px-1.5 py-1 bg-[#1a1a2e]/95 backdrop-blur-xl border border-nanohana/30 rounded-full shadow-xl"
          onMouseDown={(e) => {
            // Prevent blur on toolbar click, but NOT on the color input
            if (e.target !== colorInputRef.current) {
              e.preventDefault();
            }
          }}
        >
          {/* Bold — gold highlight when active */}
          <button
            type="button"
            onClick={handleBold}
            className={`w-7 h-7 flex items-center justify-center rounded-full transition-all ${
              isBold
                ? 'text-nanohana bg-nanohana/20 ring-1 ring-nanohana/50'
                : 'text-cream/70 hover:text-nanohana hover:bg-white/10'
            }`}
            title="Bold"
          >
            <Bold className="w-3.5 h-3.5" strokeWidth={2.5} />
          </button>

          {/* Underline — gold highlight when active */}
          <button
            type="button"
            onClick={handleUnderline}
            className={`w-7 h-7 flex items-center justify-center rounded-full transition-all ${
              isUnderlined
                ? 'text-nanohana bg-nanohana/20 ring-1 ring-nanohana/50'
                : 'text-cream/70 hover:text-nanohana hover:bg-white/10'
            }`}
            title="Underline"
          >
            <Underline className="w-3.5 h-3.5" strokeWidth={2.5} />
          </button>

          {/* Color Picker — show active color dot */}
          <div className="relative w-7 h-7 flex items-center justify-center">
            <button
              type="button"
              onClick={handleColorClick}
              className="w-7 h-7 flex items-center justify-center rounded-full text-cream/70 hover:text-nanohana hover:bg-white/10 transition-all"
              title="Text Color"
            >
              <Palette className="w-3.5 h-3.5" strokeWidth={2} />
              {/* Active color indicator dot */}
              <span
                className="absolute bottom-0.5 right-0.5 w-2 h-2 rounded-full border border-white/30"
                style={{ backgroundColor: activeColor }}
              />
            </button>
            {/* Hidden color input - positioned outside toolbar to avoid preventDefault issues */}
            <input
              ref={colorInputRef}
              type="color"
              value={activeColor}
              onChange={handleColorChange}
              className="absolute bottom-0 left-0 w-0 h-0 opacity-0 pointer-events-none"
              tabIndex={-1}
            />
          </div>

          {/* Font Picker */}
          <div className="relative">
            <button
              type="button"
              onClick={handleFontToggle}
              className={`w-7 h-7 flex items-center justify-center rounded-full transition-all ${
                showFontMenu
                  ? 'text-nanohana bg-nanohana/20 ring-1 ring-nanohana/50'
                  : 'text-cream/70 hover:text-nanohana hover:bg-white/10'
              }`}
              title="Font Family"
            >
              <Type className="w-3.5 h-3.5" strokeWidth={2.5} />
            </button>

            {/* Font Dropdown */}
            {showFontMenu && (
              <div className="absolute top-full right-0 mt-2 bg-[#1a1a2e]/95 backdrop-blur-xl border border-nanohana/30 rounded-lg shadow-2xl py-1 min-w-[140px] z-50">
                {FONT_OPTIONS.map((font) => (
                  <button
                    key={font.label}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handleFontSelect(font.value)}
                    className="w-full text-left px-3 py-1.5 text-xs text-cream/80 hover:bg-nanohana/20 hover:text-nanohana transition-colors"
                    style={{ fontFamily: font.value || 'inherit' }}
                  >
                    {font.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
export default React.memo(EditableText);
