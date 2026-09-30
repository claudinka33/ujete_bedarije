'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Loader2, Check } from 'lucide-react';

interface Setting {
  key: string;
  value: string | null;
  description: string | null;
}

interface Props {
  initial: Setting[];
}

// Group settings po prefixu za lepši prikaz
const GROUPS: Array<{ title: string; prefix: string; keys?: string[] }> = [
  { title: 'Podjetje & kontakt', prefix: '', keys: ['company_name', 'phone', 'phone_international', 'email', 'whatsapp_message'] },
  { title: 'Hero (glavna sekcija)', prefix: '', keys: ['hero_title', 'hero_subtitle', 'hero_cta_primary', 'hero_cta_secondary'] },
  { title: 'Bonus banner & cene', prefix: '', keys: ['bonus_banner', 'vat_note'] },
  { title: 'SEO', prefix: '', keys: ['seo_title', 'seo_description'] },
  { title: 'Poslovni podatki', prefix: '', keys: ['service_area', 'setup_time_min', 'setup_time_max', 'required_space', 'reservation_response_hours', 'reservation_deposit_percent'] },
];

export default function SettingsForm({ initial }: Props) {
  const router = useRouter();
  const [values, setValues] = useState<Record<string, string>>(() => {
    const obj: Record<string, string> = {};
    for (const s of initial) obj[s.key] = s.value || '';
    return obj;
  });
  const [dirty, setDirty] = useState<Set<string>>(new Set());
  const [saving, startTransition] = useTransition();
  const [savedKeys, setSavedKeys] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  const descriptions: Record<string, string> = {};
  for (const s of initial) if (s.description) descriptions[s.key] = s.description;

  const update = (key: string, value: string) => {
    setValues((v) => ({ ...v, [key]: value }));
    setDirty((d) => new Set(d).add(key));
  };

  const saveAll = () => {
    if (dirty.size === 0) return;
    setError(null);
    startTransition(async () => {
      try {
        const updates: Array<{ key: string; value: string }> = [];
        dirty.forEach((k) => updates.push({ key: k, value: values[k] || '' }));

        const res = await fetch('/api/admin/settings', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ settings: updates }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || 'Napaka pri shranjevanju');
        }

        const newSaved = new Set(dirty);
        setSavedKeys(newSaved);
        setDirty(new Set());
        setTimeout(() => setSavedKeys(new Set()), 2500);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Napaka');
      }
    });
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-800">
          {error}
        </div>
      )}

      {GROUPS.map((group) => {
        const groupKeys = (group.keys || []).filter((k) => k in values);
        if (groupKeys.length === 0) return null;
        return (
          <section key={group.title} className="bg-surface border border-line rounded-lg overflow-hidden">
            <div className="px-5 py-3 border-b border-line bg-bg/40">
              <h2 className="font-semibold text-sm uppercase tracking-wider text-ink-soft">
                {group.title}
              </h2>
            </div>
            <div className="p-5 space-y-4">
              {groupKeys.map((key) => {
                const val = values[key] || '';
                const isLong = val.length > 60 || key.includes('description') || key.includes('subtitle') || key.includes('banner');
                const saved = savedKeys.has(key);
                return (
                  <label key={key} className="block">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-medium text-ink-soft">
                        {descriptions[key] || key}
                      </span>
                      <span className="text-[10px] text-muted font-mono">{key}</span>
                    </div>
                    {isLong ? (
                      <textarea
                        rows={3}
                        value={val}
                        onChange={(e) => update(key, e.target.value)}
                        className={`${inputClass} ${saved ? 'border-green-300 bg-green-50' : ''}`}
                      />
                    ) : (
                      <input
                        type="text"
                        value={val}
                        onChange={(e) => update(key, e.target.value)}
                        className={`${inputClass} ${saved ? 'border-green-300 bg-green-50' : ''}`}
                      />
                    )}
                  </label>
                );
              })}
            </div>
          </section>
        );
      })}

      {/* Sticky save bar */}
      <div className="sticky bottom-4 bg-surface border border-line rounded-lg shadow-lg p-4 flex items-center justify-between gap-4">
        <div className="text-sm text-ink-soft">
          {dirty.size === 0 ? (
            savedKeys.size > 0 ? (
              <span className="text-green-700 flex items-center gap-2">
                <Check size={14} /> Shranjeno! Osveži stran da vidiš spremembo.
              </span>
            ) : (
              'Ni sprememb.'
            )
          ) : (
            <span>
              <strong>{dirty.size}</strong> nešranjenih sprememb
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={saveAll}
          disabled={saving || dirty.size === 0}
          className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-ink text-bg text-sm font-semibold hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          Shrani vse
        </button>
      </div>
    </div>
  );
}

const inputClass =
  'w-full px-3 py-2.5 rounded border border-line bg-bg text-ink text-sm focus:outline-none focus:border-accent transition-colors';
