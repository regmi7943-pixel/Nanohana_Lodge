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
  const [showColorPicker, setShowColorPicker] = useState(false);
  const contentRef = useRef<HTMLElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const colorInputRef = useRef<HTMLInputElement>(null);

  const displayValue = currentText || defaultText;

  // Auto-focus when editing starts
  useEffect(() => {
    if (isEditing && contentRef.current) {
      contentRef.current.focus();
      // Move cursor to the end
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

  const handleSave = async () => {
    if (!contentRef.current) return;

    // Use innerHTML to preserve HTML formatting and line breaks (<br>)
    const newValue = contentRef.current.innerHTML || '';

    if (newValue.trim() === displayValue.trim()) {
      setIsEditing(false);
      setShowFontMenu(false);
      setShowColorPicker(false);
      return;
    }

    setIsSaving(true);
    await updateContent(page, contentKey, newValue);
    setIsSaving(false);
    setIsEditing(false);
    setShowFontMenu(false);
    setShowColorPicker(false);
  };

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
      setShowColorPicker(false);
    }
  };

  const execFormat = useCallback((command: string, value?: string) => {
    // Restore focus to contentEditable before executing command
    contentRef.current?.focus();
    document.execCommand(command, false, value);
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
    colorInputRef.current?.click();
  }, []);

  const handleColorChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    execFormat('foreColor', e.target.value);
  }, [execFormat]);

  const handleFontToggle = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowFontMenu(prev => !prev);
  }, []);

  const handleFontSelect = useCallback((fontValue: string) => {
    if (fontValue) {
      execFormat('fontName', fontValue);
    } else {
      // Reset to default - remove font styling
      execFormat('removeFormat');
    }
    setShowFontMenu(false);
  }, [execFormat]);

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
        onBlur={(e: React.FocusEvent) => {
          // Don't save if clicking inside the toolbar
          if (toolbarRef.current?.contains(e.relatedTarget as Node)) {
            return;
          }
          if (isEditing) handleSave();
        }}
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
          onMouseDown={(e) => e.preventDefault()} // Prevent blur on toolbar click
        >
          {/* Bold */}
          <button
            type="button"
            onClick={handleBold}
            className="w-7 h-7 flex items-center justify-center rounded-full text-cream/70 hover:text-nanohana hover:bg-white/10 transition-all"
            title="Bold"
          >
            <Bold className="w-3.5 h-3.5" strokeWidth={2.5} />
          </button>

          {/* Underline */}
          <button
            type="button"
            onClick={handleUnderline}
            className="w-7 h-7 flex items-center justify-center rounded-full text-cream/70 hover:text-nanohana hover:bg-white/10 transition-all"
            title="Underline"
          >
            <Underline className="w-3.5 h-3.5" strokeWidth={2.5} />
          </button>

          {/* Color Picker */}
          <button
            type="button"
            onClick={handleColorClick}
            className="w-7 h-7 flex items-center justify-center rounded-full text-cream/70 hover:text-nanohana hover:bg-white/10 transition-all relative"
            title="Text Color"
          >
            <Palette className="w-3.5 h-3.5" strokeWidth={2} />
            <input
              ref={colorInputRef}
              type="color"
              defaultValue="#000000"
              onChange={handleColorChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              tabIndex={-1}
            />
          </button>

          {/* Font Picker */}
          <div className="relative">
            <button
              type="button"
              onClick={handleFontToggle}
              className="w-7 h-7 flex items-center justify-center rounded-full text-cream/70 hover:text-nanohana hover:bg-white/10 transition-all"
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
