'use client';

import { useState, useTransition } from 'react';
import { Check, X, Loader2, Trash2, AlertCircle } from 'lucide-react';
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
  const isConfirmed = status === 'confirmed';
  const isRejected = status === 'rejected';

  async function callApi(action: 'confirm' | 'reject' | 'cancel', body?: object) {
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
    if (!confirm('Ali res želiš potrditi rezervacijo? Stranka bo prejela potrditveni mail, dogodek pa se bo (če je Google Calendar povezan) avtomatsko dodal v tvoj koledar.')) {
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

  const handleCancel = () => {
    if (!confirm('Prekliči potrjeno rezervacijo? Dogodek bo izbrisan iz Google Calendarja. Stranka ne bo avtomatsko obveščena — po želji ji napiši sam/-a.')) {
      return;
    }
    startTransition(async () => {
      try {
        await callApi('cancel');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Napaka');
      }
    });
  };

  const [deleting, setDeleting] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  const handleDelete = async () => {
    if (!confirm('⚠ Trajno izbrišeš rezervacijo? Ta akcija se ne da razveljaviti. Zapisi gredo iz baze, Google Calendar event pa se izbriše iz koledarja.')) {
      return;
    }
    setError(null);
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/reservations/${reservationId}`, {
        method: 'DELETE',
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || `HTTP ${res.status}: Napaka pri brisanju`);
      }
      setDeleteSuccess(true);
      // Hard navigation — bypass client router cache for list
      window.location.href = '/admin/rezervacije';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Napaka');
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-800 flex items-start gap-2">
          <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
          <div>{error}</div>
        </div>
      )}

      {/* PENDING — show Confirm + Reject */}
      {isPending && !rejecting && (
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
      )}

      {/* PENDING — reject form */}
      {isPending && rejecting && (
        <div className="p-5 bg-red-50 border border-red-200 rounded-lg space-y-3">
          <label className="block">
            <span className="block text-sm font-medium text-red-800 mb-2">
              Razlog zavrnitve (poslan stranki v mailu)
            </span>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 rounded border border-red-200 bg-white text-sm focus:outline-none focus:border-red-400"
              placeholder="npr. Žal smo ta termin že rezervirani za drugo poroko. Lahko preverite kakšen drug datum?"
            />
            <p className="text-xs text-red-700 mt-1">
              Ta tekst se pojavi v mailu stranke. Pusti prazno če ne želiš razloga.
            </p>
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

      {/* CONFIRMED — status badge + Cancel option */}
      {isConfirmed && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-sm space-y-3">
          <div className="font-semibold text-green-800">
            ✓ Rezervacija POTRJENA. Stranka je prejela potrditveni mail.
          </div>
          <button
            type="button"
            onClick={handleCancel}
            disabled={pending}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-amber-700 text-sm font-semibold border border-amber-200 hover:bg-amber-50 disabled:opacity-50"
          >
            {pending ? <Loader2 size={14} className="animate-spin" /> : <X size={14} />}
            Prekliči potrditev
          </button>
        </div>
      )}

      {/* REJECTED — status badge */}
      {isRejected && (
        <div className="p-4 bg-gray-100 border border-line rounded-lg text-sm">
          <div className="font-semibold text-ink-soft">
            Rezervacija ZAVRNJENA. Stranka je prejela mail z razlogom.
          </div>
        </div>
      )}

      {/* Other statuses (completed, cancelled) */}
      {!isPending && !isConfirmed && !isRejected && (
        <div className="p-4 bg-gray-100 border border-line rounded-lg text-sm text-ink-soft">
          Status: <strong className="uppercase">{status}</strong>
        </div>
      )}

      {/* DELETE — vedno na voljo (razen med reject flow) */}
      {!rejecting && (
        <div className="pt-4 border-t border-line">
          <button
            type="button"
            onClick={handleDelete}
            disabled={pending || deleting || deleteSuccess}
            className="inline-flex items-center gap-2 px-4 py-2 rounded text-sm text-red-700 hover:bg-red-50 border border-red-200 disabled:opacity-50"
          >
            {deleting ? (
              <><Loader2 size={14} className="animate-spin" /> Brišem...</>
            ) : deleteSuccess ? (
              <><Check size={14} /> Izbrisano, preusmerjam...</>
            ) : (
              <><Trash2 size={14} /> Trajno izbriši rezervacijo</>
            )}
          </button>
          <p className="text-xs text-muted mt-2">
            Izbriše iz baze in iz Google Calendarja (če je bil dogodek že ustvarjen). Ta akcija je nepovratna.
          </p>
        </div>
      )}
    </div>
  );
}
