'use client';

import { useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  Upload, Loader2, Trash2, Image as ImageIcon, Film, AlertCircle, Check,
} from 'lucide-react';
import { upload } from '@vercel/blob/client';
import type { HeroMediaItem } from '@/lib/queries';

interface Props {
  initial: HeroMediaItem[];
  blobConfigured: boolean;
}

const MAX_ITEMS = 8;

export default function HeroMediaManager({ initial, blobConfigured }: Props) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<HeroMediaItem[]>(initial);
  const [uploading, setUploading] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [justUploaded, setJustUploaded] = useState<number | null>(null);

  const [progress, setProgress] = useState<number | null>(null);

  const uploadFile = async (file: File) => {
    setError(null);
    if (items.length >= MAX_ITEMS) {
      setError(`Max ${MAX_ITEMS} medijev. Odstrani enega preden dodaš novega.`);
      return;
    }
    setUploading(true);
    setProgress(0);

    try {
      // 1. Direct-to-Blob upload (bypasses Vercel's 4.5 MB serverless body limit)
      const pathname = `hero/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-]/g, '_')}`;
      const blob = await upload(pathname, file, {
        access: 'public',
        handleUploadUrl: '/api/admin/hero-media/upload',
        onUploadProgress: (p) => {
          setProgress(Math.round(p.percentage));
        },
      });

      // 2. Save DB row with the resulting Blob URL
      const saveRes = await fetch('/api/admin/hero-media/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: blob.url,
          pathname: blob.pathname,
          contentType: file.type,
        }),
      });
      const saveData = await saveRes.json();
      if (!saveRes.ok) throw new Error(saveData.error || 'Napaka pri shranjevanju');

      setItems((prev) => [...prev, saveData.item]);
      setJustUploaded(saveData.item.id);
      setTimeout(() => setJustUploaded(null), 2500);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Napaka pri nalaganju');
    } finally {
      setUploading(false);
      setProgress(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const deleteItem = (id: number) => {
    if (!confirm('Res želiš izbrisati ta medij iz hero carousela?')) return;
    startTransition(async () => {
      try {
        setError(null);
        const res = await fetch(`/api/admin/hero-media/${id}`, { method: 'DELETE' });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || 'Napaka pri brisanju');
        }
        setItems((prev) => prev.filter((it) => it.id !== id));
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Napaka');
      }
    });
  };

  return (
    <div className="space-y-5">
      {/* Upload */}
      <div className="bg-surface border border-line rounded-lg p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="font-semibold">Dodaj medij</h2>
            <p className="text-xs text-muted mt-1">
              {items.length} / {MAX_ITEMS} medijev · Slike: JPG/PNG/WebP, max 10 MB · Videji: MP4/WebM/MOV, max 25 MB
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,video/mp4,video/webm,video/quicktime"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) uploadFile(f);
            }}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading || items.length >= MAX_ITEMS || !blobConfigured}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ink text-bg text-sm font-semibold hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <><Loader2 size={14} className="animate-spin" /> Nalagam{progress !== null ? ` ${progress}%` : '…'}</>
            ) : (
              <><Upload size={14} /> Dodaj</>
            )}
          </button>
        </div>

        {uploading && progress !== null && (
          <div className="mt-3 w-full h-1 bg-bg rounded-full overflow-hidden">
            <div
              className="h-full bg-ink transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {error && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-800 flex items-start gap-2">
            <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
            <div>{error}</div>
          </div>
        )}
      </div>

      {/* Items grid */}
      {items.length === 0 ? (
        <div className="bg-surface border border-dashed border-line rounded-lg p-12 text-center">
          <Film size={32} className="mx-auto mb-3 text-muted" />
          <p className="text-sm text-muted">Še ni medijev v hero sekciji.</p>
          <p className="text-xs text-muted mt-1">
            Dodaj prvo sliko ali video — stran bo preklopila na kolaz layout z rotacijo.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {items.map((item, idx) => {
            const isJustUploaded = justUploaded === item.id;
            return (
              <div
                key={item.id}
                className={`relative aspect-[4/5] rounded-lg overflow-hidden border bg-bg group ${
                  isJustUploaded ? 'border-green-400 ring-2 ring-green-200' : 'border-line'
                }`}
              >
                {item.media_type === 'image' ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={item.media_url}
                    alt={item.caption || `Hero slika ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <video
                    src={item.media_url}
                    muted
                    loop
                    playsInline
                    autoPlay
                    className="w-full h-full object-cover"
                  />
                )}

                {/* Type badge */}
                <div className="absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-black/60 text-white text-xs font-semibold backdrop-blur-sm">
                  {item.media_type === 'image' ? (
                    <><ImageIcon size={10} /> Slika</>
                  ) : (
                    <><Film size={10} /> Video</>
                  )}
                </div>

                {isJustUploaded && (
                  <div className="absolute top-2 right-2 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-500 text-white text-xs font-semibold">
                    <Check size={10} /> Dodano
                  </div>
                )}

                {/* Hover controls */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <button
                    onClick={() => deleteItem(item.id)}
                    disabled={pending}
                    className="p-2 rounded-full bg-white text-red-600 hover:bg-red-600 hover:text-white"
                    title="Izbriši"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                {/* Order number */}
                <div className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-ink text-bg flex items-center justify-center text-xs font-bold">
                  {idx + 1}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {items.length > 0 && (
        <p className="text-xs text-muted">
          Mediji se v hero sekciji prikažejo kot kolaž (vsi hkrati). Videji se avtomatsko
          predvajajo brez zvoka. Vrstni red (številke) določa postavitev — prvi je največji.
        </p>
      )}
    </div>
  );
}
