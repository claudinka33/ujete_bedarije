'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Save, Plus, Trash2, Check } from 'lucide-react';
import type { FaqItem } from '@/lib/queries';

interface EditableFaq extends Partial<FaqItem> {
  published: boolean;
  dirty?: boolean;
  isNew?: boolean;
}

interface Props {
  initial: (FaqItem & { published: boolean })[];
}

export default function FaqTable({ initial }: Props) {
  const router = useRouter();
  const [items, setItems] = useState<EditableFaq[]>(initial.map((r) => ({ ...r })));
  const [pending, startTransition] = useTransition();
  const [savedIds, setSavedIds] = useState<Set<number>>(new Set());
  const [error, setError] = useState<string | null>(null);

  const update = (idx: number, patch: Partial<EditableFaq>) => {
    setItems((list) => list.map((it, i) => (i === idx ? { ...it, ...patch, dirty: true } : it)));
  };

  const addNew = () => {
    setItems((list) => [
      ...list,
      { question: '', answer: '', sort_order: list.length + 1, published: true, dirty: true, isNew: true },
    ]);
  };

  const saveItem = (idx: number) => {
    const it = items[idx];
    setError(null);
    startTransition(async () => {
      try {
        const body = {
          question: (it.question || '').trim(),
          answer: (it.answer || '').trim(),
          sort_order: Number(it.sort_order) || 0,
          published: it.published,
        };
        const url = it.isNew ? '/api/admin/faq' : `/api/admin/faq/${it.id}`;
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
            i === idx ? { ...x, id: data.faq.id, dirty: false, isNew: false } : x
          )
        );
        const key = data.faq.id;
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
    if (!confirm('Ali res želiš izbrisati to FAQ vprašanje?')) return;

    startTransition(async () => {
      try {
        const res = await fetch(`/api/admin/faq/${it.id}`, { method: 'DELETE' });
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
          return (
            <div key={idx} className="bg-surface border border-line rounded-lg p-5 space-y-3">
              <input
                type="text"
                value={it.question || ''}
                onChange={(e) => update(idx, { question: e.target.value })}
                placeholder="Vprašanje..."
                className={`${inputClass} font-semibold`}
              />

              <textarea
                rows={3}
                value={it.answer || ''}
                onChange={(e) => update(idx, { answer: e.target.value })}
                placeholder="Odgovor..."
                className={inputClass}
              />

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-4 text-xs text-muted">
                  <label className="flex items-center gap-1">
                    <span>Vrstni red:</span>
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
        <Plus size={14} /> Dodaj vprašanje
      </button>
    </div>
  );
}

const inputClass =
  'w-full px-3 py-2 rounded border border-line bg-bg text-ink text-sm focus:outline-none focus:border-accent transition-colors';
