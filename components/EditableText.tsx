'use client';

import React, { useState, useRef, useEffect } from 'react';
import { updateContent } from '@/app/actions/updateContent';
import { Loader2 } from 'lucide-react';

interface EditableTextProps {
  page: string;
  contentKey: string;
  defaultText: string;
  currentText: string | undefined;
  editMode: boolean;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
}

export default function EditableText({
  page,
  contentKey,
  defaultText,
  currentText,
  editMode,
  className = '',
  as: Component = 'p'
}: EditableTextProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const contentRef = useRef<HTMLElement>(null);
  
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

  const handleSave = async () => {
    if (!contentRef.current) return;
    
    // Use innerText to preserve line breaks
    const newValue = contentRef.current.innerText || contentRef.current.textContent || '';
    
    if (newValue.trim() === displayValue.trim()) {
      setIsEditing(false);
      return;
    }
    
    setIsSaving(true);
    await updateContent(page, contentKey, newValue);
    setIsSaving(false);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === 'Escape') {
      if (contentRef.current) {
        contentRef.current.innerText = displayValue;
      }
      setIsEditing(false);
    }
  };

  // Normal visitor mode
  if (!editMode) {
    return <Component className={className}>{displayValue}</Component>;
  }

  // Edit Mode: completely native, seamless contentEditable approach
  return (
    <Component
      ref={contentRef as any}
      contentEditable={isEditing}
      suppressContentEditableWarning={true}
      onClick={(e: React.MouseEvent) => {
        if (!isEditing) {
          e.preventDefault();
          e.stopPropagation();
          setIsEditing(true);
        }
      }}
      onBlur={isEditing ? handleSave : undefined}
      onKeyDown={isEditing ? handleKeyDown : undefined}
      className={`${className} ${
        isEditing 
          ? 'outline-none ring-[1.5px] ring-nanohana ring-offset-[3px] ring-offset-[#1a1a2e] rounded-[3px] cursor-text bg-white/5 relative z-10' 
          : 'hover:outline-none hover:ring-[1.5px] hover:ring-nanohana/60 hover:ring-offset-[3px] hover:ring-offset-transparent hover:bg-white/5 hover:rounded-[3px] cursor-pointer transition-all duration-150'
      } relative`}
    >
      {displayValue}
      {isSaving && (
        <span contentEditable={false} className="absolute -top-3 -right-3 w-5 h-5 bg-nanohana text-earth rounded-full flex items-center justify-center shadow-lg pointer-events-none z-20">
          <Loader2 className="w-3 h-3 animate-spin" />
        </span>
      )}
    </Component>
  );
}
