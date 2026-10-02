'use client';

import { useState, useEffect, useRef } from 'react';
import type { HeroMediaItem } from '@/lib/queries';

interface Props {
  items: HeroMediaItem[];
}

const SLIDE_DURATION_MS = 5500;

export default function HeroCarousel({ items }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);

  // Auto-advance slides
  useEffect(() => {
    if (items.length <= 1) return;
    const timer = setInterval(() => {
      setActiveIndex((i) => (i + 1) % items.length);
    }, SLIDE_DURATION_MS);
    return () => clearInterval(timer);
  }, [items.length]);

  // Pause inactive videos (save CPU + bandwidth), play active
  useEffect(() => {
    videoRefs.current.forEach((video, idx) => {
      if (!video) return;
      if (idx === activeIndex) {
        video.currentTime = 0;
        video.play().catch(() => {
          // Autoplay can be blocked on some browsers; fallback is first-frame still
        });
      } else {
        video.pause();
      }
    });
  }, [activeIndex]);

  if (items.length === 0) return null;

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="relative aspect-[4/5] rounded-xl overflow-hidden shadow-xl bg-surface">
        {items.map((item, idx) => (
          <div
            key={item.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              idx === activeIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {item.media_type === 'image' ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={item.media_url}
                alt={item.caption || 'Ujete Bedarije'}
                className="w-full h-full object-cover"
                loading={idx === 0 ? 'eager' : 'lazy'}
              />
            ) : (
              <video
                ref={(el) => {
                  videoRefs.current[idx] = el;
                }}
                src={item.media_url}
                muted
                loop
                playsInline
                autoPlay={idx === 0}
                preload={idx === 0 ? 'auto' : 'metadata'}
                className="w-full h-full object-cover"
              />
            )}
          </div>
        ))}

        {/* Dots */}
        {items.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
            {items.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={`transition-all rounded-full ${
                  idx === activeIndex
                    ? 'w-6 h-1.5 bg-white'
                    : 'w-1.5 h-1.5 bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`Prikaži medij ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
