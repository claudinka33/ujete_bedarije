'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Save, Plus, Trash2, Check, Clock, Mail } from 'lucide-react';
import type { Review } from '@/lib/queries';

interface EditableReview extends Partial<Review> {
  published: boolean;
  dirty?: boolean;
  isNew?: boolean;
  reviewer_email?: string | null;
  submission_source?: 'admin' | 'public';
  created_at?: string;
}

interface Props {
  initial: (Review & { published: boolean })[];
}

const REGIONS = ['Štajerska', 'Dolenjska', 'Koroška', 'Prekmurje', 'Gorenjska', 'Primorska', 'Notranjska', 'Zasavje'];
const EVENT_TYPES = ['Poroka', 'Rojstni dan', 'Firmni dogodek', 'Valeta', 'Obletnica', '18. rojstni dan', 'Ostalo'];

export default function ReviewsTable({ initial }: Props) {
  const router = useRouter();
  const [items, setItems] = useState<EditableReview[]>(initial.map((r) => ({ ...r })));
  const [pending, startTransition] = useTransition();
  const [savedIds, setSavedIds] = useState<Set<number>>(new Set());
  const [error, setError] = useState<string | null>(null);

  const update = (idx: number, patch: Partial<EditableReview>) => {
    setItems((list) => list.map((it, i) => (i === idx ? { ...it, ...patch, dirty: true } : it)));
  };

  const addNew = () => {
    setItems((list) => [
      ...list,
      {
        reviewer_name: '',
        reviewer_initial: '',
        avatar_variant: 1,
        event_type: 'Poroka',
        location: '',
        region: 'Štajerska',
        rating: 5,
        text: '',
        sort_order: list.length + 1,
        published: true,
        dirty: true,
        isNew: true,
      },
    ]);
  };

  const saveItem = (idx: number) => {
    const it = items[idx];
    setError(null);
    startTransition(async () => {
      try {
        const body = {
          reviewer_name: (it.reviewer_name || '').trim(),
          reviewer_initial: it.reviewer_initial || (it.reviewer_name || '?')[0]?.toUpperCase() || '?',
          avatar_variant: Number(it.avatar_variant) || 1,
          event_type: it.event_type || 'Ostalo',
          location: (it.location || '').trim(),
          region: it.region || null,
          rating: Number(it.rating) || 5,
          text: (it.text || '').trim(),
          sort_order: Number(it.sort_order) || 0,
          published: it.published,
        };
        const url = it.isNew ? '/api/admin/reviews' : `/api/admin/reviews/${it.id}`;
        const method = it.isNew ? 'POST' : 'PATCH';

        const res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || 'Napaka pri shranjevanju');
        }

        const data = await res.json();
        setItems((list) =>
          list.map((x, i) =>
            i === idx ? { ...x, id: data.review.id, dirty: false, isNew: false } : x
          )
        );
        const key = data.review.id;
        setSavedIds((s) => new Set(s).add(key));
        setTimeout(() => {
          setSavedIds((s) => {
            const next = new Set(s);
            next.delete(key);
            return next;
          });
        }, 2000);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Napaka');
      }
    });
  };

  const deleteItem = (idx: number) => {
    const it = items[idx];
    if (it.isNew) {
      setItems((list) => list.filter((_, i) => i !== idx));
      return;
    }
    if (!confirm(`Ali res želiš izbrisati mnenje od "${it.reviewer_name}"?`)) return;

    startTransition(async () => {
      try {
        const res = await fetch(`/api/admin/reviews/${it.id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Napaka pri brisanju');
        setItems((list) => list.filter((_, i) => i !== idx));
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Napaka');
      }
    });
  };

  return (
    <div>
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-800">
          {error}
        </div>
      )}

      <div className="space-y-3">
        {items.map((it, idx) => {
          const isSaved = it.id ? savedIds.has(it.id) : false;
          const isPendingPublic = it.submission_source === 'public' && !it.published;
          return (
            <div
              key={idx}
              className={`border rounded-lg p-5 space-y-3 ${
                isPendingPublic
                  ? 'bg-amber-50 border-amber-300 ring-1 ring-amber-200'
                  : 'bg-surface border-line'
              }`}
            >
              {isPendingPublic && (
                <div className="flex flex-wrap items-center gap-2 pb-3 border-b border-amber-200">
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-amber-200 text-amber-900 text-xs font-semibold uppercase tracking-wide">
                    <Clock size={10} /> Čaka na pregled
                  </span>
                  {it.reviewer_email && (
                    <a
                      href={`mailto:${it.reviewer_email}`}
                      className="inline-flex items-center gap-1 text-xs text-amber-800 hover:underline"
                    >
                      <Mail size={10} /> {it.reviewer_email}
                    </a>
                  )}
                  {it.created_at && (
                    <span className="text-xs text-amber-700">
                      {new Date(it.created_at).toLocaleString('sl-SI', {
                        day: 'numeric',
                        month: 'long',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  )}
                  <span className="ml-auto text-xs text-amber-700">
                    Odkljukaj &laquo;Objavljen&raquo; in Shrani za objavo, ali Izbriši za zavrnitev.
                  </span>
                </div>
              )}
              <div className="grid md:grid-cols-[1fr_120px_140px_100px] gap-3">
                <input
                  type="text"
                  value={it.reviewer_name || ''}
                  onChange={(e) => update(idx, { reviewer_name: e.target.value })}
                  placeholder="Ime (npr. Nina B.)"
                  className={inputClass}
                />
                <select
                  value={it.event_type || 'Poroka'}
                  onChange={(e) => update(idx, { event_type: e.target.value })}
                  className={inputClass}
                >
                  {EVENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
                <input
                  type="text"
                  value={it.location || ''}
                  onChange={(e) => update(idx, { location: e.target.value })}
                  placeholder="Lokacija"
                  className={inputClass}
                />
                <select
                  value={it.region || ''}
                  onChange={(e) => update(idx, { region: e.target.value })}
                  className={inputClass}
                >
                  {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              <textarea
                rows={3}
                value={it.text || ''}
                onChange={(e) => update(idx, { text: e.target.value })}
                placeholder="Besedilo mnenja..."
                className={inputClass}
              />

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-4 text-xs text-muted">
                  <label className="flex items-center gap-1">
                    <span>Ocena:</span>
                    <select
                      value={it.rating || 5}
                      onChange={(e) => update(idx, { rating: Number(e.target.value) })}
                      className="px-2 py-1 rounded border border-line bg-bg"
                    >
                      {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} ★</option>)}
                    </select>
                  </label>
                  <label className="flex items-center gap-1">
                    <span>Barva:</span>
                    <select
                      value={it.avatar_variant || 1}
                      onChange={(e) => update(idx, { avatar_variant: Number(e.target.value) })}
                      className="px-2 py-1 rounded border border-line bg-bg"
                    >
                      <option value="1">1 (gold)</option>
                      <option value="2">2 (rose)</option>
                      <option value="3">3 (sage)</option>
                      <option value="4">4 (purple)</option>
                      <option value="5">5 (amber)</option>
                    </select>
                  </label>
                  <label className="flex items-center gap-1">
                    <span>Vrsti red:</span>
                    <input
                      type="number"
                      value={it.sort_order || 0}
                      onChange={(e) => update(idx, { sort_order: Number(e.target.value) })}
                      className="w-16 px-2 py-1 rounded border border-line bg-bg"
                    />
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={it.published}
                      onChange={(e) => update(idx, { published: e.target.checked })}
                      className="w-3 h-3 accent-accent-dark"
                    />
                    Objavljen
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => saveItem(idx)}
                    disabled={pending || (!it.dirty && !it.isNew)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
                      isSaved
                        ? 'bg-green-100 text-green-700'
                        : it.dirty || it.isNew
                        ? 'bg-ink text-bg hover:opacity-90'
                        : 'bg-bg text-muted cursor-not-allowed'
                    } disabled:opacity-50`}
                  >
                    {pending ? <Loader2 size={12} className="animate-spin" /> : isSaved ? <><Check size={12} /> OK</> : <><Save size={12} /> Shrani</>}
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteItem(idx)}
                    disabled={pending}
                    className="p-1.5 rounded text-red-600 hover:bg-red-50 disabled:opacity-50"
                    aria-label="Izbriši"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={addNew}
        className="mt-4 flex items-center gap-2 px-4 py-2 rounded-full text-sm border border-line hover:border-accent transition-colors"
      >
        <Plus size={14} /> Dodaj novo mnenje
      </button>
    </div>
  );
}

const inputClass =
  'w-full px-3 py-2 rounded border border-line bg-bg text-ink text-sm focus:outline-none focus:border-accent transition-colors';
