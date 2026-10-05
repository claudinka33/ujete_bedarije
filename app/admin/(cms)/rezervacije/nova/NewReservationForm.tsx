'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Check } from 'lucide-react';
import type { Package, Extra } from '@/lib/queries';

interface Props {
  packages: Package[];
  extras: Extra[];
}

interface FormState {
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  event_date: string;
  event_time: string;
  event_location: string;
  event_type: string;
  event_purpose: string;
  package_id: string;         // string in UI, number on submit
  selected_extras: string[];  // extra names
  frame_text: string;
  notes: string;
  internal_notes: string;
  initial_status: 'pending' | 'confirmed' | 'completed';
  send_email: boolean;
  add_to_calendar: boolean;
}

const EMPTY: FormState = {
  customer_name: '',
  customer_phone: '',
  customer_email: '',
  event_date: '',
  event_time: '',
  event_location: '',
  event_type: 'Poroka',
  event_purpose: '',
  package_id: '',
  selected_extras: [],
  frame_text: '',
  notes: '',
  internal_notes: '',
  initial_status: 'confirmed',
  send_email: true,
  add_to_calendar: true,
};

const inputClass =
  'w-full px-4 py-3 rounded border border-line bg-bg text-ink placeholder:text-muted focus:outline-none focus:border-accent transition-colors';

export default function NewReservationForm({ packages, extras }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const toggleExtra = (name: string) =>
    setForm((f) => ({
      ...f,
      selected_extras: f.selected_extras.includes(name)
        ? f.selected_extras.filter((e) => e !== name)
        : [...f.selected_extras, name],
    }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const selectedPkg = packages.find((p) => String(p.id) === form.package_id);
    const selectedExtras = extras.filter((ex) => form.selected_extras.includes(ex.name));

    try {
      const res = await fetch('/api/admin/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: form.customer_name,
          customer_phone: form.customer_phone,
          customer_email: form.customer_email,
          event_date: form.event_date,
          event_time: form.event_time,
          event_location: form.event_location,
          event_type: form.event_type,
          event_purpose: form.event_purpose || undefined,
          package_id: selectedPkg?.id,
          package_name_snapshot: selectedPkg
            ? `${selectedPkg.name} (${selectedPkg.price}€ · ${selectedPkg.duration_hours}h)`
            : 'Ni izbrano',
          package_price_snapshot: selectedPkg?.price,
          extras_snapshot: selectedExtras.map((ex) => ({ name: ex.name, price: ex.price })),
          frame_text: form.frame_text || undefined,
          notes: form.notes || undefined,
          internal_notes: form.internal_notes || undefined,
          initial_status: form.initial_status,
          send_email: form.send_email,
          add_to_calendar: form.add_to_calendar,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Napaka pri shranjevanju');
      }

      // Hard navigate so the fresh row shows up without caching surprises
      window.location.href = `/admin/rezervacije/${data.id}`;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Napaka pri shranjevanju');
      setSubmitting(false);
    }
  };

  const confirmed = form.initial_status === 'confirmed';

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* STRANKA */}
      <section className="bg-surface border border-line rounded-lg p-6">
        <h3 className="font-semibold mb-4">Podatki stranke</h3>
        <div className="space-y-4">
          <Field label="Ime in priimek" required>
            <input
              type="text"
              required
              value={form.customer_name}
              onChange={(e) => update('customer_name', e.target.value)}
              className={inputClass}
            />
          </Field>
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Telefon" required>
              <input
                type="tel"
                required
                placeholder="031 234 567"
                value={form.customer_phone}
                onChange={(e) => update('customer_phone', e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Email" required>
              <input
                type="email"
                required
                placeholder="stranka@email.si"
                value={form.customer_email}
                onChange={(e) => update('customer_email', e.target.value)}
                className={inputClass}
              />
            </Field>
          </div>
        </div>
      </section>

      {/* DOGODEK */}
      <section className="bg-surface border border-line rounded-lg p-6">
        <h3 className="font-semibold mb-4">Dogodek</h3>
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Datum" required>
              <input
                type="date"
                required
                value={form.event_date}
                onChange={(e) => update('event_date', e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Ura" required>
              <input
                type="time"
                required
                value={form.event_time}
                onChange={(e) => update('event_time', e.target.value)}
                className={inputClass}
              />
            </Field>
          </div>
          <Field label="Lokacija (kraj)" required>
            <input
              type="text"
              required
              placeholder="Ljubljana, Grad Otočec, ..."
              value={form.event_location}
              onChange={(e) => update('event_location', e.target.value)}
              className={inputClass}
            />
          </Field>
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Tip dogodka" required>
              <select
                required
                value={form.event_type}
                onChange={(e) => update('event_type', e.target.value)}
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
                value={form.event_purpose}
                onChange={(e) => update('event_purpose', e.target.value)}
                className={inputClass}
              />
            </Field>
          </div>
        </div>
      </section>

      {/* PAKET */}
      <section className="bg-surface border border-line rounded-lg p-6">
        <h3 className="font-semibold mb-4">Paket</h3>
        <Field label="Izberi paket">
          <select
            value={form.package_id}
            onChange={(e) => update('package_id', e.target.value)}
            className={inputClass}
          >
            <option value="">Ni izbrano / dogovor po telefonu</option>
            {packages.map((pkg) => (
              <option key={pkg.id} value={pkg.id}>
                {pkg.name} — {pkg.price}€ ({pkg.duration_hours}h)
                {pkg.sale_badge ? ' · AKCIJA' : ''}
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
                    checked={form.selected_extras.includes(ex.name)}
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
      <section className="bg-surface border border-line rounded-lg p-6">
        <h3 className="font-semibold mb-4">Dodatno</h3>
        <div className="space-y-4">
          <Field label="Napis na okvirju (opcijsko)">
            <input
              type="text"
              placeholder="npr. Nina & Matej · 15.7.2027"
              value={form.frame_text}
              onChange={(e) => update('frame_text', e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Opombe stranke (opcijsko)">
            <textarea
              rows={2}
              placeholder="Posebne želje, informacije o lokaciji..."
              value={form.notes}
              onChange={(e) => update('notes', e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Interne opombe — vidne samo tebi (opcijsko)">
            <textarea
              rows={2}
              placeholder="npr. 'Dogovor po telefonu 5.10., stranka plača z gotovino'"
              value={form.internal_notes}
              onChange={(e) => update('internal_notes', e.target.value)}
              className={inputClass}
            />
          </Field>
        </div>
      </section>

      {/* ADMIN NASTAVITVE */}
      <section className="bg-accent/5 border border-accent/30 rounded-lg p-6">
        <h3 className="font-semibold mb-4">Nastavitve rezervacije</h3>
        <div className="space-y-4">
          <Field label="Status">
            <select
              value={form.initial_status}
              onChange={(e) =>
                update('initial_status', e.target.value as FormState['initial_status'])
              }
              className={inputClass}
            >
              <option value="confirmed">Potrjeno (dogovor že sklenjen)</option>
              <option value="pending">V čakanju (bo še obdelano)</option>
              <option value="completed">Zaključeno (dogodek je bil)</option>
            </select>
          </Field>

          {confirmed && (
            <div className="space-y-2 pl-1">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.send_email}
                  onChange={(e) => update('send_email', e.target.checked)}
                  className="w-4 h-4 mt-1 accent-accent-dark flex-shrink-0"
                />
                <div className="text-sm">
                  <div className="font-medium">Pošlji potrditveni mail stranki</div>
                  <div className="text-xs text-muted">
                    Stranka dobi email s potrditvijo rezervacije.
                  </div>
                </div>
              </label>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.add_to_calendar}
                  onChange={(e) => update('add_to_calendar', e.target.checked)}
                  className="w-4 h-4 mt-1 accent-accent-dark flex-shrink-0"
                />
                <div className="text-sm">
                  <div className="font-medium">Dodaj v Google Koledar</div>
                  <div className="text-xs text-muted">
                    Dogodek se ustvari v tvojem in Stanetovem koledarju.
                  </div>
                </div>
              </label>
            </div>
          )}

          {!confirmed && (
            <p className="text-xs text-muted">
              Pri statusu <strong>{form.initial_status === 'pending' ? 'V čakanju' : 'Zaključeno'}</strong>{' '}
              se ne pošlje noben mail in se ne doda v koledar.
            </p>
          )}
        </div>
      </section>

      {/* ERROR */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded text-sm text-red-800">
          {error}
        </div>
      )}

      {/* SUBMIT */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-ink text-bg font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {submitting ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Shranjujem...
            </>
          ) : (
            <>
              <Check size={16} /> Shrani rezervacijo
            </>
          )}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/rezervacije')}
          disabled={submitting}
          className="px-6 py-4 rounded-full border border-line text-ink font-semibold text-sm hover:border-accent transition-colors disabled:opacity-50"
        >
          Prekliči
        </button>
      </div>
    </form>
  );
}

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
