'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Images, Calendar } from 'lucide-react';
import type { Gallery, GalleryPhoto } from '@/lib/queries';

interface GalleryWithPhotos extends Gallery {
  photos: GalleryPhoto[];
}

interface Props {
  galleries: GalleryWithPhotos[];
}

export default function GallerySection({ galleries }: Props) {
  // Which gallery's grid overlay is open (null = none)
  const [gridGalleryId, setGridGalleryId] = useState<number | null>(null);
  // Which specific photo's lightbox is open, and its index within the gallery
  const [lightbox, setLightbox] = useState<{ gid: number; pidx: number } | null>(null);

  const gridGallery = gridGalleryId
    ? galleries.find((g) => g.id === gridGalleryId) || null
    : null;

  const lightboxGallery = lightbox
    ? galleries.find((g) => g.id === lightbox.gid) || null
    : null;
  const lightboxPhoto = lightboxGallery?.photos[lightbox?.pidx ?? 0] || null;

  const closeGrid = useCallback(() => setGridGalleryId(null), []);
  const closeLightbox = useCallback(() => setLightbox(null), []);

  const nextPhoto = useCallback(() => {
    if (!lightbox || !lightboxGallery) return;
    setLightbox({
      gid: lightbox.gid,
      pidx: (lightbox.pidx + 1) % lightboxGallery.photos.length,
    });
  }, [lightbox, lightboxGallery]);

  const prevPhoto = useCallback(() => {
    if (!lightbox || !lightboxGallery) return;
    setLightbox({
      gid: lightbox.gid,
      pidx: (lightbox.pidx - 1 + lightboxGallery.photos.length) % lightboxGallery.photos.length,
    });
  }, [lightbox, lightboxGallery]);

  // Keyboard controls + body scroll lock while any overlay is open
  useEffect(() => {
    const anyOpen = Boolean(gridGalleryId || lightbox);
    if (!anyOpen) return;

    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (lightbox) closeLightbox();
        else closeGrid();
      }
      if (lightbox) {
        if (e.key === 'ArrowRight') nextPhoto();
        if (e.key === 'ArrowLeft') prevPhoto();
      }
    };
    window.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [gridGalleryId, lightbox, closeGrid, closeLightbox, nextPhoto, prevPhoto]);

  if (galleries.length === 0) return null;

  return (
    <>
      {/* CARD GRID (default view) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {galleries.map((g) => {
          const openGrid = () => {
            if (g.photos.length > 0) setGridGalleryId(g.id);
          };
          return (
            <div
              key={g.id}
              onClick={openGrid}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  openGrid();
                }
              }}
              role="button"
              tabIndex={0}
              className="bg-surface border border-line rounded-lg overflow-hidden cursor-pointer hover:border-accent hover:shadow-md transition-all group focus:outline-none focus:ring-2 focus:ring-accent"
            >
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
                <div className="absolute bottom-2 right-2 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-black/60 text-white text-xs font-semibold backdrop-blur-sm">
                  <Images size={10} /> {g.photos.length}
                </div>
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
                <div className="mt-3 inline-flex items-center gap-1 text-xs text-accent-dark font-semibold opacity-70 group-hover:opacity-100 transition-opacity">
                  Odpri galerijo →
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* GRID OVERLAY — shows all photos in a chosen gallery */}
      {gridGallery && (
        <div
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm overflow-y-auto"
          onClick={closeGrid}
        >
          <div
            className="min-h-screen py-8 px-4 md:px-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="max-w-6xl mx-auto mb-6 flex items-start justify-between gap-4">
              <div className="text-white">
                <h3 className="text-2xl md:text-3xl font-bold">{gridGallery.title}</h3>
                <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-white/70">
                  {gridGallery.event_type && <span>{gridGallery.event_type}</span>}
                  {gridGallery.event_date && (
                    <span className="inline-flex items-center gap-1">
                      <Calendar size={12} />
                      {new Date(gridGallery.event_date).toLocaleDateString('sl-SI', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                  )}
                  <span>· {gridGallery.photos.length} fotografij</span>
                </div>
                {gridGallery.description && (
                  <p className="mt-3 text-white/80 max-w-2xl text-sm">
                    {gridGallery.description}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={closeGrid}
                className="flex-shrink-0 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                aria-label="Zapri galerijo"
              >
                <X size={20} />
              </button>
            </div>

            {/* Photo grid */}
            <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3">
              {gridGallery.photos.map((p, idx) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setLightbox({ gid: gridGallery.id, pidx: idx })}
                  className="group relative aspect-square rounded-lg overflow-hidden bg-white/5 focus:outline-none focus:ring-2 focus:ring-white"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.photo_url}
                    alt={p.alt_text || gridGallery.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                </button>
              ))}
            </div>

            {/* Footer hint */}
            <p className="max-w-6xl mx-auto mt-6 text-center text-xs text-white/50">
              Klikni na fotografijo za povečan pogled · Esc za zapreti
            </p>
          </div>
        </div>
      )}

      {/* LIGHTBOX — single-photo fullscreen view */}
      {lightboxPhoto && lightboxGallery && lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); closeLightbox(); }}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 text-white hover:bg-white/20"
            aria-label="Zapri"
          >
            <X size={20} />
          </button>

          {lightboxGallery.photos.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); prevPhoto(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 md:p-3 rounded-full bg-white/10 text-white hover:bg-white/20"
                aria-label="Prejšnja"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); nextPhoto(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 md:p-3 rounded-full bg-white/10 text-white hover:bg-white/20"
                aria-label="Naslednja"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          <div
            className="max-w-6xl max-h-[90vh] w-full flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={lightboxPhoto.photo_url}
              alt={lightboxPhoto.alt_text || lightboxGallery.title}
              className="max-h-[80vh] w-auto object-contain"
            />
            <div className="mt-4 text-center text-white/80 text-sm">
              <div className="font-semibold">{lightboxGallery.title}</div>
              <div className="text-xs opacity-70">
                {lightbox.pidx + 1} / {lightboxGallery.photos.length}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
