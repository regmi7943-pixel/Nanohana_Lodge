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
    
    // Use innerHTML to preserve HTML formatting and line breaks (<br>)
    const newValue = contentRef.current.innerHTML || '';
    
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
          setInitialValue(displayValue);
          setIsEditing(true);
        }
      }}
      onBlur={isEditing ? handleSave : undefined}
      onKeyDown={isEditing ? handleKeyDown : undefined}
      className={`${className} ${
        isEditing 
          ? 'outline-none ring-[1.5px] ring-nanohana ring-offset-[3px] ring-offset-[#1a1a2e] rounded-[3px] cursor-text bg-white/5 relative z-10' 
          : 'hover:outline-none hover:ring-[1.5px] hover:ring-nanohana/60 hover:ring-offset-[3px] hover:ring-offset-transparent hover:bg-white/5 hover:rounded-[3px] cursor-pointer transition-all duration-150'
      } ${isSaving ? 'opacity-50 pointer-events-none' : ''} relative`}
      dangerouslySetInnerHTML={{ __html: isEditing ? initialValue : displayValue }}
    >
    </Component>
  );
}
export default React.memo(EditableText);
