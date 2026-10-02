'use client';

import { useState, useTransition } from 'react';
import {
  Save, Eye, Send, Loader2, CheckCircle2, AlertCircle, RotateCcw,
} from 'lucide-react';
import type { MailTemplateKey } from '@/lib/mail';

type Templates = Record<MailTemplateKey, string>;

type TabKey = 'received' | 'new_reservation' | 'approved' | 'rejected';

interface Props {
  initialTemplates: Templates;
  defaultTestEmail: string;
  resendConfigured: boolean;
}

const TABS: Array<{
  key: TabKey;
  label: string;
  subtitle: string;
  recipient: string;
  color: string;
  previewKey: 'received' | 'new_reservation' | 'approved' | 'rejected';
  fields: Array<{
    key: MailTemplateKey;
    label: string;
    rows?: number;
    hint?: string;
  }>;
}> = [
  {
    key: 'received',
    label: 'Potrditev povpraševanja',
    subtitle: 'Prejme stranka takoj po oddaji povpraševanja (avtomatsko)',
    recipient: 'Stranki',
    color: 'bg-sky-50 text-sky-700 border-sky-200',
    previewKey: 'received',
    fields: [
      { key: 'mail_received_subject', label: 'Naslov (subject)', rows: 1 },
      { key: 'mail_received_body', label: 'Pozdravna uvod', rows: 3 },
      {
        key: 'mail_received_whatsnext',
        label: '"Kaj sledi?" vrstice (vsaka vrstica = ena bulletpoint točka)',
        rows: 4,
        hint: 'Vsaka vrstica postane ena točka. Prazna vrstica = preskok.',
      },
      { key: 'mail_received_closing', label: 'Zaključek', rows: 2 },
    ],
  },
  {
    key: 'new_reservation',
    label: 'Novo povpraševanje (interno)',
    subtitle: 'Prejme osebje, ko stranka odda rezervacijo',
    recipient: 'Osebje',
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    previewKey: 'new_reservation',
    fields: [
      { key: 'mail_new_reservation_subject', label: 'Naslov (subject)', rows: 1 },
      { key: 'mail_new_reservation_body', label: 'Besedilo', rows: 3 },
    ],
  },
  {
    key: 'approved',
    label: 'Potrditev',
    subtitle: 'Prejme stranka, ko klikneš "Potrdi" v CMS',
    recipient: 'Stranki',
    color: 'bg-green-50 text-green-700 border-green-200',
    previewKey: 'approved',
    fields: [
      { key: 'mail_approved_subject', label: 'Naslov (subject)', rows: 1 },
      { key: 'mail_approved_body', label: 'Pozdravna uvod', rows: 3 },
      {
        key: 'mail_approved_whatsnext',
        label: '"Kaj zdaj?" vrstice (vsaka vrstica = ena bulletpoint točka)',
        rows: 4,
        hint: 'Vsaka vrstica postane ena točka s pikico. Prazna vrstica = preskok.',
      },
      { key: 'mail_approved_closing', label: 'Zaključek', rows: 2 },
    ],
  },
  {
    key: 'rejected',
    label: 'Zavrnitev',
    subtitle: 'Prejme stranka, ko klikneš "Zavrni" v CMS',
    recipient: 'Stranki',
    color: 'bg-amber-50 text-amber-700 border-amber-200',
    previewKey: 'rejected',
    fields: [
      { key: 'mail_rejected_subject', label: 'Naslov (subject)', rows: 1 },
      { key: 'mail_rejected_body', label: 'Besedilo', rows: 3 },
      { key: 'mail_rejected_closing', label: 'Zaključek', rows: 2 },
    ],
  },
];

const VARS: Array<{ token: string; description: string }> = [
  { token: '{{ime}}', description: 'Kratko ime stranke (prva beseda)' },
  { token: '{{polno_ime}}', description: 'Polno ime stranke' },
  { token: '{{datum}}', description: 'Datum dogodka (20. december 2026)' },
  { token: '{{ura}}', description: 'Ura dogodka (18:00)' },
  { token: '{{lokacija}}', description: 'Kraj dogodka' },
  { token: '{{tip_dogodka}}', description: 'Poroka / Rojstni dan / ...' },
  { token: '{{paket}}', description: 'Izbrani paket' },
  { token: '{{razlog}}', description: 'Razlog zavrnitve (samo za Zavrnitev)' },
  { token: '{{email_kontakt}}', description: 'Reply-to naslov' },
];

export default function TemplateEditor({ initialTemplates, defaultTestEmail, resendConfigured }: Props) {
  const [tab, setTab] = useState<TabKey>('received');
  const [templates, setTemplates] = useState<Templates>(initialTemplates);
  const [testEmail, setTestEmail] = useState(defaultTestEmail);
  const [pending, startTransition] = useTransition();
  const [sendingTest, setSendingTest] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  const activeTabDef = TABS.find((t) => t.key === tab)!;
  const dirty = (keys: MailTemplateKey[]): boolean =>
    keys.some((k) => templates[k] !== initialTemplates[k]);
  const tabDirty = dirty(activeTabDef.fields.map((f) => f.key));

  const update = (key: MailTemplateKey, value: string) => {
    setTemplates((t) => ({ ...t, [key]: value }));
  };

  const reset = () => {
    const resetFields = activeTabDef.fields.map((f) => f.key);
    setTemplates((t) => {
      const next = { ...t };
      for (const k of resetFields) next[k] = initialTemplates[k];
      return next;
    });
  };

  const save = () => {
    setResult(null);
    startTransition(async () => {
      try {
        const payload = activeTabDef.fields.reduce<Partial<Templates>>((acc, f) => {
          acc[f.key] = templates[f.key];
          return acc;
        }, {});
        const res = await fetch('/api/admin/mail/templates', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ templates: payload }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Napaka pri shranjevanju');
        setResult({ ok: true, message: 'Shranjeno.' });
        // Also update the "initial" baseline so dirty-check clears
        Object.assign(initialTemplates, payload);
        setTimeout(() => setResult(null), 2500);
      } catch (err) {
        setResult({ ok: false, message: err instanceof Error ? err.message : 'Napaka' });
      }
    });
  };

  const openPreview = () => {
    const params = new URLSearchParams({ template: activeTabDef.previewKey });
    for (const f of activeTabDef.fields) {
      params.set(`override_${f.key}`, templates[f.key]);
    }
    window.open(`/api/admin/mail/preview?${params.toString()}`, '_blank', 'noopener');
  };

  const sendTest = () => {
    if (!testEmail) {
      setResult({ ok: false, message: 'Vnesi email naslov za test.' });
      return;
    }
    if (!resendConfigured) {
      setResult({ ok: false, message: 'Resend ni nastavljen — mail se ne bo poslal.' });
      return;
    }
    setSendingTest(true);
    setResult(null);
    const overrides = activeTabDef.fields.reduce<Partial<Templates>>((acc, f) => {
      acc[f.key] = templates[f.key];
      return acc;
    }, {});
    (async () => {
      try {
        const res = await fetch('/api/admin/mail/preview', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            template: activeTabDef.previewKey,
            to: testEmail,
            overrides,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Napaka pri pošiljanju');
        setResult({ ok: true, message: `Test poslan na ${testEmail}` });
      } catch (err) {
        setResult({ ok: false, message: err instanceof Error ? err.message : 'Napaka' });
      } finally {
        setSendingTest(false);
      }
    })();
  };

  return (
    <div className="space-y-4">
      {/* TABS */}
      <div className="flex gap-1 border-b border-line overflow-x-auto">
        {TABS.map((t) => {
          const isActive = tab === t.key;
          const isDirty = dirty(t.fields.map((f) => f.key));
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`relative px-4 py-2 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
                isActive
                  ? 'border-ink text-ink'
                  : 'border-transparent text-muted hover:text-ink'
              }`}
            >
              <span className={`inline-block mr-2 px-2 py-0.5 rounded-full text-xs font-semibold border ${t.color}`}>
                → {t.recipient}
              </span>
              {t.label}
              {isDirty && (
                <span
                  className="absolute top-2 right-1 w-2 h-2 rounded-full bg-amber-500"
                  title="Neshranjene spremembe"
                />
              )}
            </button>
          );
        })}
      </div>

      <p className="text-xs text-ink-soft -mt-2">{activeTabDef.subtitle}</p>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr,220px] gap-6">
        {/* EDITOR */}
        <div className="space-y-4">
          {activeTabDef.fields.map((f) => (
            <label key={f.key} className="block">
              <span className="text-sm font-semibold text-ink">{f.label}</span>
              {f.rows && f.rows > 1 ? (
                <textarea
                  rows={f.rows}
                  value={templates[f.key] || ''}
                  onChange={(e) => update(f.key, e.target.value)}
                  className="mt-1 w-full px-3 py-2 rounded border border-line bg-bg text-ink text-sm font-mono focus:outline-none focus:border-accent"
                />
              ) : (
                <input
                  type="text"
                  value={templates[f.key] || ''}
                  onChange={(e) => update(f.key, e.target.value)}
                  className="mt-1 w-full px-3 py-2 rounded border border-line bg-bg text-ink text-sm focus:outline-none focus:border-accent"
                />
              )}
              {f.hint && <p className="text-xs text-muted mt-1">{f.hint}</p>}
            </label>
          ))}

          {/* ACTION BAR */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <button
              onClick={save}
              disabled={pending || !tabDirty}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ink text-bg text-sm font-semibold hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {pending ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              Shrani spremembe
            </button>

            <button
              onClick={reset}
              disabled={pending || !tabDirty}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-full border border-line text-sm hover:border-accent disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <RotateCcw size={12} /> Razveljavi
            </button>

            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={openPreview}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-full border border-line text-sm hover:border-accent"
              >
                <Eye size={12} /> Oglej
              </button>

              <div className="flex items-center gap-1">
                <input
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  placeholder="tvoj@email.si"
                  className="px-2 py-1.5 rounded border border-line bg-bg text-xs w-40 focus:outline-none focus:border-accent"
                />
                <button
                  onClick={sendTest}
                  disabled={sendingTest || !testEmail}
                  className="inline-flex items-center gap-1 px-3 py-2 rounded-full bg-accent-dark text-white text-sm font-semibold hover:opacity-90 disabled:opacity-40"
                >
                  {sendingTest ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />}
                  Pošlji test
                </button>
              </div>
            </div>
          </div>

          {result && (
            <div
              className={`p-3 rounded border text-sm flex items-start gap-2 ${
                result.ok
                  ? 'bg-green-50 border-green-200 text-green-800'
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}
            >
              {result.ok ? (
                <CheckCircle2 size={16} className="flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
              )}
              <div>{result.message}</div>
            </div>
          )}
        </div>

        {/* VARIABLES SIDEBAR */}
        <aside className="bg-bg border border-line rounded-lg p-4 h-fit sticky top-4">
          <h3 className="text-sm font-semibold text-ink mb-3">Oznake</h3>
          <p className="text-xs text-muted mb-3">
            Vstavi te oznake kjerkoli — sistem jih pri pošiljanju zamenja s pravimi
            podatki stranke.
          </p>
          <ul className="space-y-2 text-xs">
            {VARS.map((v) => (
              <li key={v.token}>
                <code className="block bg-white border border-line rounded px-2 py-1 font-mono text-ink">
                  {v.token}
                </code>
                <span className="text-muted">{v.description}</span>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}
