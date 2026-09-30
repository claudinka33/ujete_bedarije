'use client';

import { useState, useTransition } from 'react';
import { Check, X, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Props {
  reservationId: number;
  status: string;
}

export default function ReservationActions({ reservationId, status }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState('');
  const [error, setError] = useState<string | null>(null);

  const isPending = status === 'pending';

  async function callApi(action: 'confirm' | 'reject', body?: object) {
    setError(null);
    const res = await fetch(`/api/admin/reservations/${reservationId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, ...body }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || 'Napaka pri shranjevanju');
    }
    router.refresh();
  }

  const handleConfirm = () => {
    if (!confirm('Ali res želiš potrditi rezervacijo? Stranka bo obveščena (kasneje, ko dodamo emaile).')) {
      return;
    }
    startTransition(async () => {
      try {
        await callApi('confirm');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Napaka');
      }
    });
  };

  const handleReject = () => {
    startTransition(async () => {
      try {
        await callApi('reject', { rejection_reason: reason });
        setRejecting(false);
        setReason('');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Napaka');
      }
    });
  };

  if (!isPending) {
    return (
      <div className="p-4 bg-bg border border-line rounded text-sm text-muted">
        Rezervacija je že {status === 'confirmed' ? 'POTRJENA ✓' : status === 'rejected' ? 'ZAVRNJENA' : status.toUpperCase()}.
        Za spremembo statusa kontaktiraj Claudijo.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-800">
          {error}
        </div>
      )}

      {!rejecting ? (
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={handleConfirm}
            disabled={pending}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-green-600 text-white font-semibold text-sm hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {pending ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
            Potrdi rezervacijo
          </button>
          <button
            type="button"
            onClick={() => setRejecting(true)}
            disabled={pending}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-white text-red-600 font-semibold text-sm border border-red-200 hover:bg-red-50 transition-colors disabled:opacity-50"
          >
            <X size={16} />
            Zavrni
          </button>
        </div>
      ) : (
        <div className="p-5 bg-red-50 border border-red-200 rounded-lg space-y-3">
          <label className="block">
            <span className="block text-sm font-medium text-red-800 mb-2">
              Razlog zavrnitve (opcijsko, samo interno)
            </span>
            <textarea
              rows={2}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 rounded border border-red-200 bg-white text-sm focus:outline-none focus:border-red-400"
              placeholder="npr. Termin že zaseden"
            />
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleReject}
              disabled={pending}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-red-600 text-white text-sm font-semibold hover:bg-red-700 disabled:opacity-50"
            >
              {pending ? <Loader2 size={14} className="animate-spin" /> : null}
              Potrdi zavrnitev
            </button>
            <button
              type="button"
              onClick={() => {
                setRejecting(false);
                setReason('');
              }}
              disabled={pending}
              className="px-4 py-2.5 rounded-full bg-white text-ink-soft text-sm font-semibold border border-line hover:border-accent disabled:opacity-50"
            >
              Prekliči
            </button>
          </div>
        </div>
      )}

      <p className="text-xs text-muted text-center">
        📅 Po potrditvi bo dogodek dodan v tvoj Google Calendar (ko bomo integracijo aktivirali).
      </p>
    </div>
  );
}
