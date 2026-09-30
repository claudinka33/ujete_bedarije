'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Loader2 } from 'lucide-react';

export default function NewGalleryButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [eventType, setEventType] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const submit = () => {
    setError(null);
    if (!title.trim()) {
      setError('Naslov je obvezen');
      return;
    }
    startTransition(async () => {
      try {
        const res = await fetch('/api/admin/galerija', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: title.trim(),
            event_type: eventType.trim() || null,
            event_date: eventDate || null,
            published: false,
            sort_order: 0,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Napaka');
        setOpen(false);
        setTitle(''); setEventType(''); setEventDate('');
        router.push(`/admin/galerija/${data.gallery.id}`);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Napaka');
      }
    });
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ink text-bg text-sm font-semibold hover:opacity-90 transition-opacity"
      >
        <Plus size={16} /> Nova galerija
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={() => !pending && setOpen(false)}
        >
          <div
            className="bg-surface rounded-lg w-full max-w-md p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">Nova galerija</h2>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-800">
                {error}
              </div>
            )}

            <div className="space-y-3">
              <label className="block">
                <span className="text-sm font-semibold text-ink">Naslov *</span>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Npr. Poroka Nina & Matej"
                  className="mt-1 w-full px-3 py-2 rounded border border-line bg-bg text-sm focus:outline-none focus:border-accent"
                  autoFocus
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-ink">Tip dogodka</span>
                <input
                  type="text"
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  placeholder="Poroka, Rojstni dan, Firmni dogodek..."
                  className="mt-1 w-full px-3 py-2 rounded border border-line bg-bg text-sm focus:outline-none focus:border-accent"
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-ink">Datum dogodka</span>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="mt-1 w-full px-3 py-2 rounded border border-line bg-bg text-sm focus:outline-none focus:border-accent"
                />
              </label>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                onClick={() => setOpen(false)}
                disabled={pending}
                className="px-4 py-2 rounded-full text-sm border border-line hover:border-accent transition-colors"
              >
                Prekliči
              </button>
              <button
                onClick={submit}
                disabled={pending}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ink text-bg text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {pending && <Loader2 size={14} className="animate-spin" />}
                Ustvari
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
