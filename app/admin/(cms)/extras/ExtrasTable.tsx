'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Save, Plus, Trash2, Check } from 'lucide-react';
import type { Extra } from '@/lib/queries';

interface Props {
  initial: Extra[];
}

interface EditableExtra {
  id?: number;
  slug: string;
  name: string;
  price: number;
  sort_order: number;
  published: boolean;
  dirty?: boolean;
  isNew?: boolean;
}

export default function ExtrasTable({ initial }: Props) {
  const router = useRouter();
  const [items, setItems] = useState<EditableExtra[]>(initial.map((e) => ({ ...e })));
  const [pending, startTransition] = useTransition();
  const [savedIds, setSavedIds] = useState<Set<number | string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  const updateItem = (idx: number, patch: Partial<EditableExtra>) => {
    setItems((list) => list.map((it, i) => (i === idx ? { ...it, ...patch, dirty: true } : it)));
  };

  const addNew = () => {
    setItems((list) => [
      ...list,
      {
        slug: '',
        name: '',
        price: 0,
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
          slug: it.slug.trim(),
          name: it.name.trim(),
          price: Number(it.price),
          sort_order: Number(it.sort_order),
          published: it.published,
        };
        const url = it.isNew ? '/api/admin/extras' : `/api/admin/extras/${it.id}`;
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
            i === idx ? { ...x, id: data.extra.id, dirty: false, isNew: false } : x
          )
        );
        const key = data.extra.id;
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
      // just remove from list
      setItems((list) => list.filter((_, i) => i !== idx));
      return;
    }
    if (!confirm(`Ali res želiš izbrisati "${it.name}"?`)) return;

    startTransition(async () => {
      try {
        const res = await fetch(`/api/admin/extras/${it.id}`, { method: 'DELETE' });
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

      <div className="bg-surface border border-line rounded-lg overflow-hidden">
        <div className="hidden md:grid md:grid-cols-[2fr_1fr_100px_100px_140px] gap-3 p-4 bg-bg/40 border-b border-line text-xs uppercase tracking-wider text-muted font-semibold">
          <div>Ime</div>
          <div>Slug</div>
          <div>Cena (€)</div>
          <div>Vrstni red</div>
          <div>Akcije</div>
        </div>

        <div className="divide-y divide-line">
          {items.map((it, idx) => {
            const savedKey = it.id ? it.id : idx;
            const isSaved = it.id ? savedIds.has(it.id) : false;
            return (
              <div
                key={idx}
                className="grid md:grid-cols-[2fr_1fr_100px_100px_140px] gap-3 p-4 items-center"
              >
                <div>
                  <input
                    type="text"
                    value={it.name}
                    onChange={(e) => updateItem(idx, { name: e.target.value })}
                    placeholder="Ime"
                    className={inputClass}
                  />
                  <label className="flex items-center gap-2 mt-2 text-xs text-muted cursor-pointer">
                    <input
                      type="checkbox"
                      checked={it.published}
                      onChange={(e) => updateItem(idx, { published: e.target.checked })}
                      className="w-3 h-3 accent-accent-dark"
                    />
                    Objavljen
                  </label>
                </div>
                <input
                  type="text"
                  value={it.slug}
                  onChange={(e) => updateItem(idx, { slug: e.target.value })}
                  placeholder="slug"
                  className={inputClass}
                />
                <input
                  type="number"
                  value={it.price}
                  onChange={(e) => updateItem(idx, { price: Number(e.target.value) })}
                  className={inputClass}
                />
                <input
                  type="number"
                  value={it.sort_order}
                  onChange={(e) => updateItem(idx, { sort_order: Number(e.target.value) })}
                  className={inputClass}
                />
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => saveItem(idx)}
                    disabled={pending || (!it.dirty && !it.isNew)}
                    className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded text-xs font-semibold transition-colors ${
                      isSaved
                        ? 'bg-green-100 text-green-700'
                        : it.dirty || it.isNew
                        ? 'bg-ink text-bg hover:opacity-90'
                        : 'bg-bg text-muted cursor-not-allowed'
                    } disabled:opacity-50`}
                  >
                    {pending ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : isSaved ? (
                      <>
                        <Check size={12} /> OK
                      </>
                    ) : (
                      <>
                        <Save size={12} /> Shrani
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteItem(idx)}
                    disabled={pending}
                    className="p-2 rounded text-red-600 hover:bg-red-50 disabled:opacity-50"
                    aria-label="Izbriši"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-4 border-t border-line">
          <button
            type="button"
            onClick={addNew}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm border border-line hover:border-accent transition-colors"
          >
            <Plus size={14} /> Dodaj dodatek
          </button>
        </div>
      </div>
    </div>
  );
}

const inputClass =
  'w-full px-3 py-2 rounded border border-line bg-bg text-ink text-sm focus:outline-none focus:border-accent transition-colors';
