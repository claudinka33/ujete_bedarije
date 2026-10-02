'use client';

import { useState } from 'react';
import { X, Star, Loader2, Check, AlertCircle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const EVENT_TYPES = ['Poroka', 'Rojstni dan', 'Firmni dogodek', 'Obletnica', 'Krst', 'Druga priložnost'];

export default function ReviewForm({ isOpen, onClose }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [eventType, setEventType] = useState('');
  const [customEventType, setCustomEventType] = useState('');
  const [location, setLocation] = useState('');
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const resetAndClose = () => {
    setName(''); setEmail(''); setEventType(''); setCustomEventType('');
    setLocation(''); setRating(5); setText('');
    setError(null); setSuccess(false);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const finalEventType = eventType === 'Druga priložnost'
      ? (customEventType.trim() || 'Druga priložnost')
      : eventType;

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reviewer_name: name.trim(),
          reviewer_email: email.trim() || undefined,
          event_type: finalEventType,
          location: location.trim(),
          rating,
          text: text.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Napaka pri pošiljanju');
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Napaka');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm"
      onClick={() => !submitting && resetAndClose()}
    >
      <div className="min-h-screen flex items-start md:items-center justify-center p-4 md:p-8">
        <div
          className="bg-surface rounded-xl w-full max-w-xl relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={resetAndClose}
            disabled={submitting}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-bg disabled:opacity-50"
            aria-label="Zapri"
          >
            <X size={20} />
          </button>

          {success ? (
            <div className="p-8 text-center">
              <div className="inline-flex w-16 h-16 items-center justify-center rounded-full bg-green-100 mb-4">
                <Check size={28} className="text-green-700" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Hvala za vaše mnenje!</h2>
              <p className="text-ink-soft mb-6">
                Po kratkem pregledu bomo vaše mnenje objavili na spletni strani. Hvala, da ste si vzeli čas.
              </p>
              <button
                type="button"
                onClick={resetAndClose}
                className="px-6 py-3 rounded-full bg-ink text-bg font-semibold text-sm hover:opacity-90"
              >
                Zapri
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-4">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Oddaj mnenje</h2>
                <p className="text-sm text-ink-soft mt-1">
                  Delite vaše izkušnje — po pregledu bomo mnenje objavili na spletni strani.
                </p>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-800 flex items-start gap-2">
                  <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                  <div>{error}</div>
                </div>
              )}

              {/* Rating */}
              <div>
                <label className="block text-sm font-semibold text-ink mb-2">Ocena</label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setRating(n)}
                      className="p-1 transition-transform hover:scale-110"
                      aria-label={`${n} zvezdic`}
                    >
                      <Star
                        size={32}
                        className={n <= rating ? 'fill-amber-400 text-amber-400' : 'fill-none text-gray-300'}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-sm font-semibold text-ink">Ime *</span>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nina B."
                    className={inputClass}
                    maxLength={60}
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-ink">
                    Email <span className="text-muted font-normal">(interno, ni vidno)</span>
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nina@email.si"
                    className={inputClass}
                  />
                </label>
              </div>

              {/* Event type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-sm font-semibold text-ink">Tip dogodka *</span>
                  <select
                    required
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    className={inputClass}
                  >
                    <option value="">Izberi...</option>
                    {EVENT_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-ink">Kraj *</span>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Celje"
                    className={inputClass}
                  />
                </label>
              </div>

              {eventType === 'Druga priložnost' && (
                <label className="block">
                  <span className="text-sm font-semibold text-ink">Napiši dogodek</span>
                  <input
                    type="text"
                    value={customEventType}
                    onChange={(e) => setCustomEventType(e.target.value)}
                    placeholder="Npr. Valeta, Zaključek sezone..."
                    className={inputClass}
                  />
                </label>
              )}

              {/* Text */}
              <label className="block">
                <span className="text-sm font-semibold text-ink">Vaše mnenje *</span>
                <textarea
                  required
                  rows={5}
                  minLength={10}
                  maxLength={1000}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Napišite nekaj besed o vaši izkušnji s photo booth-om..."
                  className={inputClass}
                />
                <div className="text-xs text-muted mt-1 text-right">
                  {text.length} / 1000
                </div>
              </label>

              <p className="text-xs text-muted">
                Z oddajo soglašate, da bomo vaše ime, mnenje in kraj dogodka objavili na spletni
                strani (po pregledu). Email ni javen in se uporablja samo za morebiten
                kontakt. <a href="/pravila-zasebnosti" target="_blank" className="underline">Pravila zasebnosti</a>.
              </p>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={resetAndClose}
                  disabled={submitting}
                  className="px-4 py-2 rounded-full text-sm border border-line hover:border-accent disabled:opacity-50"
                >
                  Prekliči
                </button>
                <button
                  type="submit"
                  disabled={submitting || !name || !eventType || !location || text.length < 10}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-ink text-bg text-sm font-semibold hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {submitting && <Loader2 size={14} className="animate-spin" />}
                  Oddaj mnenje
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

const inputClass =
  'mt-1 w-full px-3 py-2 rounded border border-line bg-bg text-ink text-sm focus:outline-none focus:border-accent transition-colors';
