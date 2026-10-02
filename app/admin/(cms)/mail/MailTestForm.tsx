'use client';

import { useState, useTransition } from 'react';
import { Send, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

interface Props {
  resendConfigured: boolean;
  defaultTo: string;
}

export default function MailTestForm({ resendConfigured, defaultTo }: Props) {
  const [to, setTo] = useState(defaultTo);
  const [subject, setSubject] = useState('Test iz CMS — Ujete Bedarije');
  const [body, setBody] = useState(
    'To je testni mail, poslan iz CMS-a. Če ga vidiš — Resend dela.\n\nLep pozdrav,\nAgency setup'
  );
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  const send = () => {
    setResult(null);
    startTransition(async () => {
      try {
        const res = await fetch('/api/admin/mail/test', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ to, subject, body }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Napaka pri pošiljanju');
        setResult({ ok: true, message: `Poslano! Resend ID: ${data.id || '(skipped)'}` });
      } catch (err) {
        setResult({ ok: false, message: err instanceof Error ? err.message : 'Napaka' });
      }
    });
  };

  return (
    <div className="space-y-3">
      <label className="block">
        <span className="text-sm font-semibold text-ink">Pošlji na</span>
        <input
          type="email"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          placeholder="tvoj@email.si"
          className={inputClass}
        />
      </label>

      <label className="block">
        <span className="text-sm font-semibold text-ink">Zadeva</span>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className={inputClass}
        />
      </label>

      <label className="block">
        <span className="text-sm font-semibold text-ink">Besedilo</span>
        <textarea
          rows={5}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className={inputClass}
        />
      </label>

      <div className="flex items-center gap-3">
        <button
          onClick={send}
          disabled={pending || !to || !subject}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ink text-bg text-sm font-semibold hover:opacity-90 disabled:opacity-50"
        >
          {pending ? (
            <><Loader2 size={14} className="animate-spin" /> Pošiljam...</>
          ) : (
            <><Send size={14} /> Pošlji test</>
          )}
        </button>
        {!resendConfigured && (
          <span className="text-xs text-amber-700">
            ⚠ Resend ni nastavljen — mail se bo samo zalogiral, ne poslal.
          </span>
        )}
      </div>

      {result && (
        <div
          className={`mt-3 p-3 rounded border text-sm flex items-start gap-2 ${
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
  );
}

const inputClass =
  'mt-1 w-full px-3 py-2 rounded border border-line bg-bg text-ink text-sm focus:outline-none focus:border-accent transition-colors';
