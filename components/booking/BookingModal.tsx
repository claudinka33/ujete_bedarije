'use client';

import { useEffect, useState } from 'react';
import { X, Check, Loader2 } from 'lucide-react';
import type { Package, Extra } from '@/lib/queries';
import { trackReservationSubmit } from '@/lib/analytics';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  packages: Package[];
  extras: Extra[];
  initialPackageSlug?: string;
}

interface FormState {
  ime: string;
  telefon: string;
  email: string;
  datum: string;
  ura: string;
  lokacija: string;
  tipDogodka: string;
  namen: string;
  paketId: string;
  extras: string[];
  okvirNapis: string;
  opombe: string;
}

const EMPTY_FORM: FormState = {
  ime: '',
  telefon: '',
  email: '',
  datum: '',
  ura: '',
  lokacija: '',
  tipDogodka: 'Poroka',
  namen: '',
  paketId: '',
  extras: [],
  okvirNapis: '',
  opombe: '',
};

export default function BookingModal({
  isOpen,
  onClose,
  packages,
  extras,
  initialPackageSlug,
}: Props) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Preselect package when modal opens
  useEffect(() => {
    if (isOpen && initialPackageSlug) {
      const pkg = packages.find((p) => p.slug === initialPackageSlug);
      if (pkg) setForm((f) => ({ ...f, paketId: String(pkg.id) }));
    }
  }, [isOpen, initialPackageSlug, packages]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isOpen]);

  // ESC to close
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && !submitting && onClose();
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, submitting, onClose]);

  if (!isOpen) return null;

  const update = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const toggleExtra = (name: string) => {
    setForm((f) => ({
      ...f,
      extras: f.extras.includes(name)
        ? f.extras.filter((e) => e !== name)
        : [...f.extras, name],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const selectedPkg = packages.find((p) => String(p.id) === form.paketId);
    const selectedExtras = extras.filter((ex) => form.extras.includes(ex.name));

    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ime: form.ime,
          telefon: form.telefon,
          email: form.email,
          datum: form.datum,
          ura: form.ura,
          lokacija: form.lokacija,
          tipDogodka: form.tipDogodka,
          namen: form.namen,
          paket: selectedPkg
            ? `${selectedPkg.name} (${selectedPkg.price}€ · ${selectedPkg.duration_hours}h)`
            : 'Ni izbrano',
          paketId: selectedPkg?.id,
          paketCena: selectedPkg?.price,
          extras: form.extras,
          extrasFull: selectedExtras.map((ex) => ({ name: ex.name, price: ex.price })),
          okvirNapis: form.okvirNapis,
          opombe: form.opombe,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Napaka pri pošiljanju');
      }

      setSuccess(true);
      setForm(EMPTY_FORM);

      // Analytics: fire Lead / generate_lead conversion event
      trackReservationSubmit({
        packageName: selectedPkg?.name || 'Ni izbrano',
        packagePrice: selectedPkg?.price ?? null,
        eventType: form.tipDogodka,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Napaka pri pošiljanju');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm"
      onClick={() => !submitting && onClose()}
    >
      <div className="min-h-screen flex items-start md:items-center justify-center p-4 md:p-8">
        <div
          className="relative bg-surface rounded-lg max-w-2xl w-full my-8 shadow-lg"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between p-6 md:p-8 border-b border-line">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                {success ? 'Hvala za vašo rezervacijo!' : 'Rezervacija termina'}
              </h2>
              <p className="text-sm text-ink-soft mt-1">
                {success
                  ? 'Stane se vam oglasi v 24 urah s potrditvijo.'
                  : 'Izpolnite obrazec — Stane se vam oglasi v 24 urah s potrditvijo.'}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="p-2 hover:bg-bg rounded-full transition-colors disabled:opacity-50"
              aria-label="Zapri"
            >
              <X size={20} />
            </button>
          </div>

          {/* Success state */}
          {success ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-sage flex items-center justify-center">
                <Check size={32} className="text-white" strokeWidth={3} />
              </div>
              <p className="text-ink-soft mb-2">Vaše povpraševanje je poslano.</p>
              <p className="text-ink-soft mb-8">
                Stane se vam oglasi v <strong>24 urah</strong> s potrditvijo termina.
              </p>
              <button
                onClick={onClose}
                className="px-8 py-3 rounded-full border border-line text-ink font-semibold text-sm hover:border-accent transition-colors"
              >
                Zapri
              </button>
            </div>
          ) : (
            // Form
            <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
              {/* VAŠI PODATKI */}
              <section>
                <h3 className="eyebrow mb-4">Vaši podatki</h3>
                <div className="space-y-4">
                  <Field label="Ime in priimek" required>
                    <input
                      type="text"
                      required
                      value={form.ime}
                      onChange={(e) => update('ime', e.target.value)}
                      className={inputClass}
                    />
                  </Field>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Field label="Telefon" required>
                      <input
                        type="tel"
                        required
                        placeholder="031 234 567"
                        value={form.telefon}
                        onChange={(e) => update('telefon', e.target.value)}
                        className={inputClass}
                      />
                    </Field>
                    <Field label="Email" required>
                      <input
                        type="email"
                        required
                        placeholder="vasa@posta.si"
                        value={form.email}
                        onChange={(e) => update('email', e.target.value)}
                        className={inputClass}
                      />
                    </Field>
                  </div>
                </div>
              </section>

              {/* DOGODEK */}
              <section>
                <h3 className="eyebrow mb-4">Dogodek</h3>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <Field label="Datum dogodka" required>
                      <input
                        type="date"
                        required
                        min={new Date().toISOString().split('T')[0]}
                        value={form.datum}
                        onChange={(e) => update('datum', e.target.value)}
                        className={inputClass}
                      />
                    </Field>
                    <Field label="Predviden začetek" required>
                      <input
                        type="time"
                        required
                        value={form.ura}
                        onChange={(e) => update('ura', e.target.value)}
                        className={inputClass}
                      />
                    </Field>
                  </div>
                  <Field label="Lokacija (kraj)" required>
                    <input
                      type="text"
                      required
                      placeholder="Ljubljana, Grad Otočec, ..."
                      value={form.lokacija}
                      onChange={(e) => update('lokacija', e.target.value)}
                      className={inputClass}
                    />
                  </Field>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Field label="Tip dogodka" required>
                      <select
                        required
                        value={form.tipDogodka}
                        onChange={(e) => update('tipDogodka', e.target.value)}
                        className={inputClass}
                      >
                        <option value="Poroka">Poroka</option>
                        <option value="Rojstni dan">Rojstni dan</option>
                        <option value="Firmni dogodek">Firmni dogodek</option>
                        <option value="Valeta">Valeta</option>
                        <option value="Obletnica">Obletnica</option>
                        <option value="Dekliščina / Fantovščina">Dekliščina / Fantovščina</option>
                        <option value="Ostalo">Ostalo</option>
                      </select>
                    </Field>
                    <Field label="Namen (opcijsko)">
                      <input
                        type="text"
                        placeholder="npr. 30. rojstni dan"
                        value={form.namen}
                        onChange={(e) => update('namen', e.target.value)}
                        className={inputClass}
                      />
                    </Field>
                  </div>
                </div>
              </section>

              {/* PAKET */}
              <section>
                <h3 className="eyebrow mb-4">Paket</h3>
                <Field label="Izberite paket">
                  <select
                    value={form.paketId}
                    onChange={(e) => update('paketId', e.target.value)}
                    className={inputClass}
                  >
                    <option value="">Izberite paket...</option>
                    {packages.map((pkg) => (
                      <option key={pkg.id} value={pkg.id}>
                        {pkg.name} — {pkg.price}€ ({pkg.duration_hours}h){' '}
                        {pkg.sale_badge ? '· AKCIJA' : ''}
                      </option>
                    ))}
                  </select>
                </Field>

                {extras.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs text-muted mb-3">Dodatne možnosti:</p>
                    <div className="space-y-2">
                      {extras.map((ex) => (
                        <label
                          key={ex.id}
                          className="flex items-center gap-3 p-3 border border-line rounded cursor-pointer hover:border-accent transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={form.extras.includes(ex.name)}
                            onChange={() => toggleExtra(ex.name)}
                            className="w-4 h-4 accent-accent-dark"
                          />
                          <span className="text-sm flex-1">{ex.name}</span>
                          <span className="text-sm font-semibold text-accent-dark">
                            +{ex.price}€
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </section>

              {/* DODATNO */}
              <section>
                <h3 className="eyebrow mb-4">Dodatno</h3>
                <div className="space-y-4">
                  <Field label="Napis na okvirju (opcijsko)">
                    <input
                      type="text"
                      placeholder="npr. Nina & Matej · 15.7.2027"
                      value={form.okvirNapis}
                      onChange={(e) => update('okvirNapis', e.target.value)}
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Opombe (opcijsko)">
                    <textarea
                      rows={3}
                      placeholder="Karkoli bi še radi omenili..."
                      value={form.opombe}
                      onChange={(e) => update('opombe', e.target.value)}
                      className={inputClass}
                    />
                  </Field>
                </div>
              </section>

              {/* Error */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded text-sm text-red-800">
                  {error}
                </div>
              )}

              {/* Submit */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-line">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-ink text-bg font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Pošiljam...
                    </>
                  ) : (
                    'Pošlji rezervacijo →'
                  )}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  disabled={submitting}
                  className="px-6 py-4 rounded-full border border-line text-ink font-semibold text-sm hover:border-accent transition-colors disabled:opacity-50"
                >
                  Prekliči
                </button>
              </div>

              <p className="text-xs text-center text-muted">
                Polja označena z * so obvezna. Rezervacija ni dokončna, dokler je Stane
                ali Anita ne potrdita.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// =============================================================
// FORM HELPERS
// =============================================================
const inputClass =
  'w-full px-4 py-3 rounded border border-line bg-bg text-ink placeholder:text-muted focus:outline-none focus:border-accent transition-colors';

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-ink-soft mb-1.5">
        {label} {required && <span className="text-accent-dark">*</span>}
      </span>
      {children}
    </label>
  );
}
