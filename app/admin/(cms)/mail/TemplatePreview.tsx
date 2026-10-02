'use client';

import { useState, useTransition } from 'react';
import { Eye, Send, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

type TemplateKey = 'new_reservation' | 'approved' | 'rejected';

const TEMPLATES: Array<{
  key: TemplateKey;
  title: string;
  description: string;
  recipient: string;
  color: string;
}> = [
  {
    key: 'new_reservation',
    title: 'Nova rezervacija → osebju',
    description: 'Pošlje se Aniti in Stanetu, ko stranka odda rezervacijo preko spletne strani.',
    recipient: 'Anita + Stane',
    color: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  {
    key: 'approved',
    title: 'Potrditev → stranki',
    description: 'Pošlje se stranki, ko v CMS klikneš "Potrdi" na rezervaciji.',
    recipient: 'Stranka',
    color: 'bg-green-50 text-green-700 border-green-200',
  },
  {
    key: 'rejected',
    title: 'Zavrnitev → stranki',
    description: 'Pošlje se stranki, ko v CMS klikneš "Zavrni" na rezervaciji (opcijsko z razlogom).',
    recipient: 'Stranka',
    color: 'bg-amber-50 text-amber-700 border-amber-200',
  },
];

interface Props {
  resendConfigured: boolean;
  defaultTo: string;
}

export default function TemplatePreview({ resendConfigured, defaultTo }: Props) {
  const [pending, startTransition] = useTransition();
  const [testEmail, setTestEmail] = useState(defaultTo);
  const [activePreview, setActivePreview] = useState<TemplateKey | null>(null);
  const [sendingKey, setSendingKey] = useState<TemplateKey | null>(null);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  const sendTemplate = (key: TemplateKey) => {
    if (!testEmail) {
      setResult({ ok: false, message: 'Vnesi email naslov za test.' });
      return;
    }
    setResult(null);
    setSendingKey(key);
    startTransition(async () => {
      try {
        const res = await fetch('/api/admin/mail/preview', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ template: key, to: testEmail, action: 'send' }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Napaka');
        setResult({
          ok: true,
          message: `Poslano "${TEMPLATES.find((t) => t.key === key)?.title}" na ${testEmail}`,
        });
      } catch (err) {
        setResult({ ok: false, message: err instanceof Error ? err.message : 'Napaka' });
      } finally {
        setSendingKey(null);
      }
    });
  };

  const previewUrl = (key: TemplateKey) => `/api/admin/mail/preview?template=${key}`;

  return (
    <div className="space-y-4">
      <label className="block max-w-md">
        <span className="text-sm font-semibold text-ink">Pošlji predloge na</span>
        <input
          type="email"
          value={testEmail}
          onChange={(e) => setTestEmail(e.target.value)}
          placeholder="tvoj@email.si"
          className="mt-1 w-full px-3 py-2 rounded border border-line bg-bg text-ink text-sm focus:outline-none focus:border-accent"
        />
      </label>

      {!resendConfigured && (
        <div className="p-3 rounded border border-amber-200 bg-amber-50 text-sm text-amber-900 flex items-start gap-2">
          <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
          <div>
            Resend ni nastavljen. &laquo;Preview&raquo; dela (vidiš HTML v brskalniku), &laquo;Pošlji
            test&raquo; samo zabeleži v logu, ne pošlje maila. Dodaj <code>RESEND_API_KEY</code> v
            Vercel in redeployaj.
          </div>
        </div>
      )}

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {TEMPLATES.map((t) => (
          <div key={t.key} className="bg-bg border border-line rounded-lg p-4 flex flex-col">
            <span
              className={`inline-block self-start px-2 py-0.5 rounded-full text-xs font-semibold border ${t.color}`}
            >
              → {t.recipient}
            </span>
            <h3 className="font-semibold mt-2 text-ink">{t.title}</h3>
            <p className="text-xs text-ink-soft mt-1 flex-1">{t.description}</p>

            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-line">
              <a
                href={previewUrl(t.key)}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded text-xs font-semibold border border-line hover:border-accent transition-colors"
              >
                <Eye size={12} /> Oglej
              </a>
              <button
                onClick={() => sendTemplate(t.key)}
                disabled={pending || !testEmail}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded text-xs font-semibold bg-ink text-bg hover:opacity-90 disabled:opacity-50"
              >
                {sendingKey === t.key ? (
                  <><Loader2 size={12} className="animate-spin" /> Pošiljam</>
                ) : (
                  <><Send size={12} /> Pošlji</>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
