'use client';

import { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { HeroMediaItem } from '@/lib/queries';

interface Props {
  items: HeroMediaItem[];
}

/**
 * Collage layout — all media visible at once in a smart bento grid.
 * Videos autoplay muted/looped/inline. Click any card to open fullscreen
 * lightbox with keyboard navigation. The grid shape adapts to item count.
 */
export default function HeroCarousel({ items }: Props) {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const activeItem = lightboxIdx !== null ? items[lightboxIdx] : null;

  const close = () => setLightboxIdx(null);
  const next = () =>
    setLightboxIdx((i) => (i === null ? null : (i + 1) % items.length));
  const prev = () =>
    setLightboxIdx((i) =>
      i === null ? null : (i - 1 + items.length) % items.length
    );

  useEffect(() => {
    if (lightboxIdx === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightboxIdx]);

  if (items.length === 0) return null;

  // Layout classes based on item count (bento-style)
  const gridClass = (() => {
    switch (items.length) {
      case 1:
        return 'grid-cols-1';
      case 2:
        return 'grid-cols-2';
      case 3:
        // Big + 2 stacked
        return 'grid-cols-2';
      case 4:
        return 'grid-cols-2';
      default:
        return 'grid-cols-2 md:grid-cols-3';
    }
  })();

  return (
    <>
      <div className={`grid ${gridClass} gap-2 md:gap-3 w-full max-w-xl mx-auto`}>
        {items.map((item, idx) => {
          // For 3-item layout, first card spans 2 rows
          const spanClass =
            items.length === 3 && idx === 0 ? 'row-span-2' : '';
          return (
            <HeroCard
              key={item.id}
              item={item}
              onClick={() => setLightboxIdx(idx)}
              className={spanClass}
              compact={items.length > 2}
            />
          );
        })}
      </div>

      {/* LIGHTBOX */}
      {activeItem && lightboxIdx !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={close}
        >
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); close(); }}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 text-white hover:bg-white/20"
            aria-label="Zapri"
          >
            <X size={20} />
          </button>

          {items.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); prev(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 md:p-3 rounded-full bg-white/10 text-white hover:bg-white/20"
                aria-label="Prejšnja"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); next(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 md:p-3 rounded-full bg-white/10 text-white hover:bg-white/20"
                aria-label="Naslednja"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          <div
            className="max-w-5xl max-h-[90vh] w-full flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {activeItem.media_type === 'image' ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={activeItem.media_url}
                alt={activeItem.caption || 'Ujete Bedarije'}
                className="max-h-[85vh] w-auto object-contain"
              />
            ) : (
              <video
                src={activeItem.media_url}
                controls
                autoPlay
                muted
                loop
                playsInline
                className="max-h-[85vh] w-auto"
              />
            )}
            {items.length > 1 && (
              <div className="mt-3 text-xs text-white/60">
                {lightboxIdx + 1} / {items.length}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

interface CardProps {
  item: HeroMediaItem;
  onClick: () => void;
  className?: string;
  compact?: boolean;
}

function HeroCard({ item, onClick, className, compact }: CardProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Pause video when it scrolls out of view, resume when back in
  useEffect(() => {
    if (!videoRef.current) return;
    const el = videoRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.play().catch(() => {});
          } else {
            el.pause();
          }
        });
      },
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative rounded-lg md:rounded-xl overflow-hidden bg-surface shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group ${
        compact ? 'aspect-[4/5]' : 'aspect-[4/5]'
      } ${className || ''}`}
    >
      {item.media_type === 'image' ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={item.media_url}
          alt={item.caption || 'Ujete Bedarije'}
          className="w-full h-full object-cover"
          loading="eager"
        />
      ) : (
        <video
          ref={videoRef}
          src={item.media_url}
          muted
          loop
          playsInline
          autoPlay
          preload="metadata"
          className="w-full h-full object-cover"
        />
      )}
      {/* Subtle overlay on hover */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
    </button>
  );
}
