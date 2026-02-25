'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import type { GalleryItem } from '@/types';

const PLACEHOLDER_IMAGES: Record<string, string> = {
  Workshop: 'https://res.cloudinary.com/dcxm3ccir/image/upload/v1741613286/h1.jpg',
  Data: 'https://res.cloudinary.com/dcxm3ccir/image/upload/v1741613286/h2.jpg',
  Usecase: 'https://res.cloudinary.com/dcxm3ccir/image/upload/v1741613286/h4.jpg',
  Trend: 'https://res.cloudinary.com/dcxm3ccir/image/upload/v1741613286/h2.jpg',
  Prompt: 'https://res.cloudinary.com/dcxm3ccir/image/upload/v1741613286/h1.jpg',
  HAI: 'https://res.cloudinary.com/dcxm3ccir/image/upload/v1741613286/h4.jpg',
  Teams: 'https://res.cloudinary.com/dcxm3ccir/image/upload/v1741613286/h2.jpg',
  Safety: 'https://res.cloudinary.com/dcxm3ccir/image/upload/v1741613286/h1.jpg',
  Planning: 'https://res.cloudinary.com/dcxm3ccir/image/upload/v1741613286/h4.jpg',
  'AI System': 'https://res.cloudinary.com/dcxm3ccir/image/upload/v1741613286/h4.jpg',
  Design: 'https://res.cloudinary.com/dcxm3ccir/image/upload/v1741613286/h1.jpg',
};

interface PreviewCarouselProps {
  isOpen: boolean;
  onClose: () => void;
  items: GalleryItem[];
  currentIndex: number;
  onNavigate: (index: number) => void;
  onDetailClick: (index: number) => void;
}

export default function PreviewCarousel({
  isOpen,
  onClose,
  items,
  currentIndex,
  onNavigate,
  onDetailClick,
}: PreviewCarouselProps) {
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const currentItem = items[currentIndex];

  const goNext = useCallback(() => {
    onNavigate(currentIndex >= items.length - 1 ? 0 : currentIndex + 1);
  }, [currentIndex, items.length, onNavigate]);

  const goPrev = useCallback(() => {
    onNavigate(currentIndex <= 0 ? items.length - 1 : currentIndex - 1);
  }, [currentIndex, items.length, onNavigate]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose, goNext, goPrev]);

  if (!isOpen || !currentItem) return null;

  const imageSrc =
    currentItem.thumbnail ||
    PLACEHOLDER_IMAGES[currentItem.category] ||
    PLACEHOLDER_IMAGES.Workshop;

  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.touches[0].clientX);
  const handleTouchMove = (e: React.TouchEvent) => setTouchEnd(e.touches[0].clientX);
  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) goNext();
    if (touchEnd - touchStart > 50) goPrev();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-50 text-white/70 hover:text-white transition-colors"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Page indicator */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 text-white/70 text-sm font-normal tracking-tight">
        {currentIndex + 1} / {items.length}
      </div>

      {/* Left arrow */}
      {items.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); goPrev(); }}
          className="absolute left-4 md:left-8 z-50 p-3 text-white/60 hover:text-white transition-colors"
        >
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Right arrow */}
      {items.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); goNext(); }}
          className="absolute right-4 md:right-8 z-50 p-3 text-white/60 hover:text-white transition-colors"
        >
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Preview Card */}
      <div
        className="relative w-[90%] max-w-3xl cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          onDetailClick(currentIndex);
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="bg-white rounded-none overflow-hidden shadow-2xl">
          {/* Image */}
          <div className="relative aspect-[16/10] w-full overflow-hidden">
            <Image
              alt={currentItem.title}
              className="object-cover"
              fill
              sizes="(max-width: 768px) 90vw, 768px"
              src={imageSrc}
              priority
            />
            <span className="absolute top-4 left-4 bg-white/90 px-3 py-1 text-xs font-medium uppercase tracking-wider text-black backdrop-blur-sm">
              #{currentItem.category}
            </span>
          </div>

          {/* Info */}
          <div className="px-6 py-5">
            <h2 className="text-xl md:text-2xl font-normal tracking-tight text-gray-900 mb-2">
              {currentItem.title}
            </h2>
            <p className="text-sm text-gray-500 mb-3">
              {currentItem.description.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim() || '내용 없음'}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">
                {currentItem.author} · {currentItem.date}
              </span>
              <span className="text-xs text-gray-400 flex items-center gap-1">
                클릭하여 상세보기
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
