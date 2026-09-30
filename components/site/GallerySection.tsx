'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Images } from 'lucide-react';
import type { Gallery, GalleryPhoto } from '@/lib/queries';

interface GalleryWithPhotos extends Gallery {
  photos: GalleryPhoto[];
}

interface Props {
  galleries: GalleryWithPhotos[];
}

export default function GallerySection({ galleries }: Props) {
  const [activeIdx, setActiveIdx] = useState<{ gid: number; pidx: number } | null>(null);

  const activeGallery = activeIdx
    ? galleries.find((g) => g.id === activeIdx.gid) || null
    : null;
  const activePhoto = activeGallery?.photos[activeIdx?.pidx ?? 0] || null;

  const close = useCallback(() => setActiveIdx(null), []);

  const next = useCallback(() => {
    if (!activeIdx || !activeGallery) return;
    setActiveIdx({
      gid: activeIdx.gid,
      pidx: (activeIdx.pidx + 1) % activeGallery.photos.length,
    });
  }, [activeIdx, activeGallery]);

  const prev = useCallback(() => {
    if (!activeIdx || !activeGallery) return;
    setActiveIdx({
      gid: activeIdx.gid,
      pidx: (activeIdx.pidx - 1 + activeGallery.photos.length) % activeGallery.photos.length,
    });
  }, [activeIdx, activeGallery]);

  useEffect(() => {
    if (!activeIdx) return;
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
  }, [activeIdx, close, next, prev]);

  if (galleries.length === 0) return null;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {galleries.map((g) => {
          const openLightbox = () => {
            if (g.photos.length > 0) setActiveIdx({ gid: g.id, pidx: 0 });
          };
          return (
            <div
              key={g.id}
              onClick={openLightbox}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  openLightbox();
                }
              }}
              role="button"
              tabIndex={0}
              className="bg-surface border border-line rounded-lg overflow-hidden cursor-pointer hover:border-accent hover:shadow-md transition-all group focus:outline-none focus:ring-2 focus:ring-accent"
            >
              {/* Cover */}
              <div className="block w-full aspect-video bg-bg overflow-hidden relative">
                {g.cover_photo_url ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={g.cover_photo_url}
                    alt={g.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted">
                    <Images size={32} />
                  </div>
                )}
                {g.photos.length > 1 && (
                  <div className="absolute bottom-2 right-2 px-2 py-1 rounded-full bg-black/60 text-white text-xs font-semibold backdrop-blur-sm">
                    +{g.photos.length - 1} slik
                  </div>
                )}
              </div>

              <div className="p-4">
                <div className="font-semibold text-ink truncate">{g.title}</div>
                <div className="flex items-center gap-3 mt-1 text-xs text-muted">
                  {g.event_type && <span>{g.event_type}</span>}
                  {g.event_date && (
                    <span>
                      {new Date(g.event_date).toLocaleDateString('sl-SI', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                  )}
                </div>

                {/* Thumbnail strip — separate click targets so they open specific photos */}
                {g.photos.length > 1 && (
                  <div className="mt-3 flex gap-1 overflow-x-auto pb-1">
                    {g.photos.slice(0, 6).map((p, idx) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveIdx({ gid: g.id, pidx: idx });
                        }}
                        className="flex-shrink-0 w-12 h-12 rounded overflow-hidden border border-line hover:border-accent transition-colors"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={p.photo_url}
                          alt=""
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </button>
                    ))}
                    {g.photos.length > 6 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveIdx({ gid: g.id, pidx: 6 });
                        }}
                        className="flex-shrink-0 w-12 h-12 rounded bg-bg border border-line flex items-center justify-center text-xs font-semibold text-muted hover:border-accent"
                      >
                        +{g.photos.length - 6}
                      </button>
                    )}
                  </div>
                )}

                <div className="mt-3 inline-flex items-center gap-1 text-xs text-accent-dark font-semibold opacity-70 group-hover:opacity-100 transition-opacity">
                  Odpri galerijo →
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* LIGHTBOX */}
      {activePhoto && activeGallery && (
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

          {activeGallery.photos.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); prev(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/10 text-white hover:bg-white/20"
                aria-label="Prejšnja"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); next(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/10 text-white hover:bg-white/20"
                aria-label="Naslednja"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          <div className="max-w-6xl max-h-[90vh] w-full flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activePhoto.photo_url}
              alt={activePhoto.alt_text || activeGallery.title}
              className="max-h-[80vh] w-auto object-contain"
            />
            <div className="mt-4 text-center text-white/80 text-sm">
              <div className="font-semibold">{activeGallery.title}</div>
              <div className="text-xs opacity-70">
                {(activeIdx!.pidx + 1)} / {activeGallery.photos.length}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
