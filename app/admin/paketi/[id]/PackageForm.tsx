'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Trash2, Plus, X } from 'lucide-react';
import type { Package } from '@/lib/queries';

interface Props {
  initial: Partial<Package> | null; // null = new
  packageId?: number; // undefined = new
}

export default function PackageForm({ initial, packageId }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    slug: initial?.slug || '',
    name: initial?.name || '',
    duration_hours: initial?.duration_hours || 1,
    duration_label: initial?.duration_label || '1 ura fotografiranja',
    price: initial?.price || 0,
    old_price: initial?.old_price || '',
    sale_badge: initial?.sale_badge || '',
    price_note: initial?.price_note || '',
    featured: initial?.featured || false,
    ribbon: initial?.ribbon || '',
    features: initial?.features?.map((f) => f.text).join('\n') || '',
    sort_order: initial?.sort_order || 0,
    published: initial?.published ?? true,
  });

  const isNew = !packageId;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      try {
        const body = {
          slug: form.slug.trim(),
          name: form.name.trim(),
          duration_hours: Number(form.duration_hours),
          duration_label: form.duration_label.trim(),
          price: Number(form.price),
          old_price: form.old_price === '' ? null : Number(form.old_price),
          sale_badge: form.sale_badge.trim() || null,
          price_note: form.price_note.trim() || null,
          featured: form.featured,
          ribbon: form.ribbon.trim() || null,
          features: form.features
            .split('\n')
            .map((s) => s.trim())
            .filter((s) => s.length > 0)
            .map((text) => ({ text })),
          sort_order: Number(form.sort_order),
          published: form.published,
        };

        const url = isNew ? '/api/admin/packages' : `/api/admin/packages/${packageId}`;
        const method = isNew ? 'POST' : 'PATCH';

        const res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || 'Napaka pri shranjevanju');
        }

        router.push('/admin/paketi');
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Napaka');
      }
    });
  };

  const handleDelete = () => {
    if (!packageId) return;
    if (!confirm('Ali res želiš IZBRISATI ta paket? Rezervacije, ki so že bile narejene, ostanejo.')) {
      return;
    }
    startTransition(async () => {
      try {
        const res = await fetch(`/api/admin/packages/${packageId}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Napaka pri brisanju');
        router.push('/admin/paketi');
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Napaka');
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded text-sm text-red-800">
          {error}
        </div>
      )}

      {/* OSNOVE */}
      <Card title="Osnovni podatki">
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Ime paketa" required>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="BASIC / PARTY / VIP"
              className={inputClass}
            />
          </Field>
          <Field label="Slug (URL identifikator)" required>
            <input
              type="text"
              required
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              placeholder="basic / party / vip"
              className={inputClass}
            />
          </Field>
          <Field label="Trajanje (ure)" required>
            <input
              type="number"
              required
              min={1}
              value={form.duration_hours}
              onChange={(e) => setForm((f) => ({ ...f, duration_hours: Number(e.target.value) }))}
              className={inputClass}
            />
          </Field>
          <Field label="Opis trajanja">
            <input
              type="text"
              value={form.duration_label}
              onChange={(e) => setForm((f) => ({ ...f, duration_label: e.target.value }))}
              placeholder="npr. 2 uri fotografiranja"
              className={inputClass}
            />
          </Field>
        </div>
      </Card>

      {/* CENE */}
      <Card title="Cene">
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Cena (€)" required>
            <input
              type="number"
              required
              min={0}
              value={form.price}
              onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))}
              className={inputClass}
            />
          </Field>
          <Field label="Prečrtana cena (€) — opcijsko">
            <input
              type="number"
              min={0}
              value={form.old_price}
              onChange={(e) => setForm((f) => ({ ...f, old_price: e.target.value as unknown as string }))}
              placeholder="npr. 320"
              className={inputClass}
            />
          </Field>
          <Field label="Akcijska značka — opcijsko">
            <input
              type="text"
              value={form.sale_badge}
              onChange={(e) => setForm((f) => ({ ...f, sale_badge: e.target.value }))}
              placeholder="npr. Akcija −10%"
              className={inputClass}
            />
          </Field>
          <Field label="Opomba pri ceni — opcijsko">
            <input
              type="text"
              value={form.price_note}
              onChange={(e) => setForm((f) => ({ ...f, price_note: e.target.value }))}
              placeholder="npr. akcijska cena"
              className={inputClass}
            />
          </Field>
        </div>
      </Card>

      {/* FUNKCIJE */}
      <Card title="Kaj vključuje">
        <Field label="Funkcije (ena vrstica = ena funkcija)">
          <textarea
            rows={8}
            value={form.features}
            onChange={(e) => setForm((f) => ({ ...f, features: e.target.value }))}
            placeholder={`Do 70 tiskanih fotografij\nDigitalni album na email\nFizični album\nRekviziti za fotografiranje`}
            className={inputClass + ' font-mono text-sm'}
          />
        </Field>
      </Card>

      {/* PRIKAZ */}
      <Card title="Prikaz na strani">
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Vrstni red (nižje = bolj levo)">
            <input
              type="number"
              value={form.sort_order}
              onChange={(e) => setForm((f) => ({ ...f, sort_order: Number(e.target.value) }))}
              className={inputClass}
            />
          </Field>
          <Field label="Trak (npr. Priporočamo) — opcijsko">
            <input
              type="text"
              value={form.ribbon}
              onChange={(e) => setForm((f) => ({ ...f, ribbon: e.target.value }))}
              placeholder="npr. Priporočamo"
              className={inputClass}
            />
          </Field>
        </div>
        <div className="mt-4 space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
              className="w-4 h-4 accent-accent-dark"
            />
            <span className="text-sm">
              <strong>Featured</strong> — dark card (kot PARTY paket)
            </span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
              className="w-4 h-4 accent-accent-dark"
            />
            <span className="text-sm">
              <strong>Objavljen</strong> — prikaži na javni strani
            </span>
          </label>
        </div>
      </Card>

      {/* SUBMIT */}
      <div className="flex items-center gap-3 pt-4 border-t border-line">
        <button
          type="submit"
          disabled={pending}
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-ink text-bg text-sm font-semibold hover:opacity-90 disabled:opacity-50"
        >
          {pending && <Loader2 size={14} className="animate-spin" />}
          {isNew ? 'Ustvari paket' : 'Shrani spremembe'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          disabled={pending}
          className="px-6 py-3 rounded-full text-sm border border-line hover:border-accent transition-colors disabled:opacity-50"
        >
          Prekliči
        </button>
        {!isNew && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={pending}
            className="ml-auto flex items-center gap-2 px-4 py-3 rounded-full text-sm text-red-600 border border-red-200 hover:bg-red-50 disabled:opacity-50"
          >
            <Trash2 size={14} /> Izbriši
          </button>
        )}
      </div>
    </form>
  );
}

// FORM HELPERS
const inputClass =
  'w-full px-3 py-2.5 rounded border border-line bg-bg text-ink placeholder:text-muted focus:outline-none focus:border-accent transition-colors text-sm';

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-ink-soft mb-1.5">
        {label} {required && <span className="text-accent-dark">*</span>}
      </span>
      {children}
    </label>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-surface border border-line rounded-lg overflow-hidden">
      <div className="px-5 py-3 border-b border-line bg-bg/40">
        <h2 className="font-semibold text-sm uppercase tracking-wider text-ink-soft">
          {title}
        </h2>
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}
