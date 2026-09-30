'use client';

import { useState, useTransition, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Save, Trash2, Upload, Loader2, Check, Star,
  AlertCircle, Image as ImageIcon,
} from 'lucide-react';
import type { GalleryWithPhotos } from '@/lib/queries';

interface Props {
  gallery: GalleryWithPhotos;
  blobConfigured: boolean;
}

const MAX_PHOTOS = 10;

export default function GalleryEditor({ gallery: initial, blobConfigured }: Props) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pending, startTransition] = useTransition();
  const [uploading, setUploading] = useState(false);

  const [title, setTitle] = useState(initial.title);
  const [slug, setSlug] = useState(initial.slug);
  const [eventType, setEventType] = useState(initial.event_type || '');
  const [eventDate, setEventDate] = useState(initial.event_date?.slice(0, 10) || '');
  const [description, setDescription] = useState(initial.description || '');
  const [published, setPublished] = useState(initial.published);
  const [sortOrder, setSortOrder] = useState(initial.sort_order);
  const [photos, setPhotos] = useState(initial.photos);
  const [coverUrl, setCoverUrl] = useState(initial.cover_photo_url);

  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  const saveMeta = () => {
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch(`/api/admin/galerija/${initial.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            slug: slug.trim(),
            title: title.trim(),
            event_type: eventType.trim() || null,
            event_date: eventDate || null,
            description: description.trim() || null,
            cover_photo_url: coverUrl,
            published,
            sort_order: Number(sortOrder) || 0,
          }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || 'Napaka pri shranjevanju');
        }
        setSavedAt(Date.now());
        setTimeout(() => setSavedAt(null), 2000);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Napaka');
      }
    });
  };

  const deleteGallery = () => {
    if (!confirm(`Ali res želiš izbrisati galerijo "${initial.title}"? Vse fotografije bodo izbrisane.`)) return;
    startTransition(async () => {
      try {
        const res = await fetch(`/api/admin/galerija/${initial.id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Napaka pri brisanju');
        router.push('/admin/galerija');
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Napaka');
      }
    });
  };

  const uploadFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError(null);

    if (photos.length + files.length > MAX_PHOTOS) {
      setError(`Ta galerija ima že ${photos.length} fotografij. Max ${MAX_PHOTOS} skupaj.`);
      return;
    }

    setUploading(true);
    try {
      const fd = new FormData();
      for (let i = 0; i < files.length; i++) {
        fd.append('file', files[i]);
      }
      const res = await fetch(`/api/admin/galerija/${initial.id}/photos`, {
        method: 'POST',
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Napaka pri nalaganju');
      setPhotos((prev) => [...prev, ...data.photos]);
      if (!coverUrl && data.photos.length > 0) {
        setCoverUrl(data.photos[0].photo_url);
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Napaka pri nalaganju');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const deletePhoto = (photoId: number) => {
    if (!confirm('Izbriši to fotografijo?')) return;
    startTransition(async () => {
      try {
        const res = await fetch(`/api/admin/galerija/${initial.id}/photos/${photoId}`, {
          method: 'DELETE',
        });
        if (!res.ok) throw new Error('Napaka pri brisanju');
        setPhotos((prev) => prev.filter((p) => p.id !== photoId));
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Napaka');
      }
    });
  };

  const setCover = (photoId: number) => {
    startTransition(async () => {
      try {
        const res = await fetch(`/api/admin/galerija/${initial.id}/photos/${photoId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'set_cover' }),
        });
        if (!res.ok) throw new Error('Napaka');
        const photo = photos.find((p) => p.id === photoId);
        if (photo) setCoverUrl(photo.photo_url);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Napaka');
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">{title || 'Galerija'}</h1>
          <p className="text-ink-soft text-sm">
            {photos.length} / {MAX_PHOTOS} fotografij
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={deleteGallery}
            disabled={pending}
            className="inline-flex items-center gap-2 px-3 py-2 rounded text-sm text-red-600 hover:bg-red-50 border border-red-200 disabled:opacity-50"
          >
            <Trash2 size={14} /> Izbriši galerijo
          </button>
          <button
            onClick={saveMeta}
            disabled={pending}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
              savedAt
                ? 'bg-green-100 text-green-700'
                : 'bg-ink text-bg hover:opacity-90'
            } disabled:opacity-50`}
          >
            {pending ? (
              <Loader2 size={14} className="animate-spin" />
            ) : savedAt ? (
              <><Check size={14} /> Shranjeno</>
            ) : (
              <><Save size={14} /> Shrani</>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-800 flex items-start gap-2">
          <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
          <div>{error}</div>
        </div>
      )}

      {!blobConfigured && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded text-sm text-amber-900">
          <div className="font-semibold mb-1 flex items-center gap-2">
            <AlertCircle size={16} /> Vercel Blob še ni nastavljen
          </div>
          <p className="mb-2">
            Za nalaganje fotografij potrebuješ Blob store. Nastaviš ga v Vercel dashboard:
          </p>
          <ol className="list-decimal ml-5 space-y-1">
            <li>Odpri projekt v <a href="https://vercel.com" target="_blank" rel="noopener" className="underline">vercel.com</a></li>
            <li>Zavihek <strong>Storage</strong> → <strong>Create Database</strong> → <strong>Blob</strong></li>
            <li>Ime: <code className="bg-white px-1 rounded">ujete-bedarije-galerija</code></li>
            <li>Klikni <strong>Create</strong> — token se sam doda med env vars</li>
            <li>Vercel bo avtomatsko naredil nov deploy in nalaganje bo delalo</li>
          </ol>
        </div>
      )}

      {/* METADATA */}
      <div className="bg-surface border border-line rounded-lg p-5 space-y-4">
        <h2 className="font-semibold text-lg">Podatki galerije</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm font-semibold text-ink">Naslov *</span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputClass}
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-ink">Slug (URL)</span>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className={inputClass}
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-ink">Tip dogodka</span>
            <input
              type="text"
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              placeholder="Poroka, Rojstni dan..."
              className={inputClass}
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-ink">Datum dogodka</span>
            <input
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className={inputClass}
            />
          </label>
        </div>

        <label className="block">
          <span className="text-sm font-semibold text-ink">Opis (neobvezno)</span>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Kratek opis dogodka, ki se prikaže pod naslovom galerije..."
            className={inputClass}
          />
        </label>

        <div className="flex flex-wrap items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer text-sm">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="w-4 h-4 accent-accent-dark"
            />
            <span className="font-semibold">Objavljen</span>
            <span className="text-muted">(prikaže se na javni strani)</span>
          </label>

          <label className="flex items-center gap-2 text-sm">
            <span className="font-semibold">Vrstni red:</span>
            <input
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(Number(e.target.value))}
              className="w-20 px-2 py-1 rounded border border-line bg-bg"
            />
          </label>
        </div>
      </div>

      {/* PHOTOS */}
      <div className="bg-surface border border-line rounded-lg p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-lg">Fotografije</h2>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={(e) => uploadFiles(e.target.files)}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading || photos.length >= MAX_PHOTOS || !blobConfigured}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ink text-bg text-sm font-semibold hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <><Loader2 size={14} className="animate-spin" /> Nalagam...</>
            ) : (
              <><Upload size={14} /> Dodaj fotografije</>
            )}
          </button>
        </div>

        {photos.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-line rounded-lg">
            <ImageIcon size={32} className="mx-auto mb-3 text-muted" />
            <p className="text-sm text-muted">Še ni fotografij. Klikni &laquo;Dodaj fotografije&raquo; zgoraj.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {photos.map((p) => {
              const isCover = p.photo_url === coverUrl;
              return (
                <div
                  key={p.id}
                  className={`relative group aspect-square rounded-lg overflow-hidden border-2 ${
                    isCover ? 'border-accent-dark' : 'border-transparent'
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.photo_url}
                    alt={p.alt_text || ''}
                    className="w-full h-full object-cover"
                  />
                  {isCover && (
                    <div className="absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-accent-dark text-white text-xs font-semibold">
                      <Star size={10} fill="white" /> Cover
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    {!isCover && (
                      <button
                        onClick={() => setCover(p.id)}
                        disabled={pending}
                        className="p-2 rounded-full bg-white text-ink hover:bg-accent hover:text-white"
                        title="Nastavi kot naslovnico"
                      >
                        <Star size={14} />
                      </button>
                    )}
                    <button
                      onClick={() => deletePhoto(p.id)}
                      disabled={pending}
                      className="p-2 rounded-full bg-white text-red-600 hover:bg-red-600 hover:text-white"
                      title="Izbriši"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <p className="mt-4 text-xs text-muted">
          Max 10 fotografij na galerijo. Formati: JPG, PNG, WebP, GIF. Max 10 MB na sliko.
          Klikni <Star size={10} className="inline" /> za nastavitev naslovne fotografije.
        </p>
      </div>
    </div>
  );
}

const inputClass =
  'mt-1 w-full px-3 py-2 rounded border border-line bg-bg text-ink text-sm focus:outline-none focus:border-accent transition-colors';
