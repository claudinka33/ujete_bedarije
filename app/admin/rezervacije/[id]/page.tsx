import { getReservation } from '@/lib/queries';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, User, Phone, Mail, Calendar, MapPin, Package, Sparkles, MessageCircle } from 'lucide-react';
import { StatusPill } from '../../page';
import ReservationActions from './ReservationActions';

export const dynamic = 'force-dynamic';

export default async function ReservationDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const id = parseInt(params.id, 10);
  if (isNaN(id)) notFound();

  const r = await getReservation(id);
  if (!r) notFound();

  return (
    <div>
      <Link
        href="/admin/rezervacije"
        className="inline-flex items-center gap-2 text-sm text-ink-soft hover:text-ink mb-6 transition-colors"
      >
        <ArrowLeft size={14} /> Nazaj na rezervacije
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <h1 className="text-3xl font-bold tracking-tight">{r.customer_name}</h1>
          <StatusPill status={r.status} />
        </div>
        <p className="text-ink-soft">
          Rezervacija #{r.id} · Poslano{' '}
          {new Date(r.created_at).toLocaleString('sl-SI', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>

      {/* Actions (potrdi/zavrni) */}
      <div className="mb-10">
        <ReservationActions reservationId={r.id} status={r.status} />
      </div>

      {/* Details grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* KONTAKT */}
        <Section title="Kontakt stranke" icon={User}>
          <Row label="Ime in priimek" value={r.customer_name} />
          <Row
            label="Telefon"
            value={
              <a href={`tel:${r.customer_phone}`} className="text-accent-dark hover:underline">
                {r.customer_phone}
              </a>
            }
          />
          <Row
            label="Email"
            value={
              <a href={`mailto:${r.customer_email}`} className="text-accent-dark hover:underline">
                {r.customer_email}
              </a>
            }
          />
        </Section>

        {/* DOGODEK */}
        <Section title="Dogodek" icon={Calendar}>
          <Row
            label="Datum"
            value={new Date(r.event_date).toLocaleDateString('sl-SI', {
              weekday: 'long',
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })}
          />
          <Row label="Predviden začetek" value={r.event_time.slice(0, 5)} />
          <Row label="Lokacija" value={r.event_location} />
          <Row label="Tip dogodka" value={r.event_type} />
          {r.event_purpose && <Row label="Namen" value={r.event_purpose} />}
        </Section>

        {/* PAKET */}
        <Section title="Paket & doplačila" icon={Package} className="md:col-span-2">
          <Row
            label="Izbran paket"
            value={
              <>
                <strong>{r.package_name_snapshot}</strong>
                {r.package_price_snapshot ? ` · ${r.package_price_snapshot}€` : ''}
              </>
            }
          />
          {r.extras_snapshot && r.extras_snapshot.length > 0 && (
            <Row
              label="Dodatne možnosti"
              value={
                <div className="space-y-1">
                  {r.extras_snapshot.map((ex, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <span>+ {ex.name}</span>
                      <span className="text-accent-dark font-semibold ml-4">{ex.price}€</span>
                    </div>
                  ))}
                </div>
              }
            />
          )}
          {r.frame_text && <Row label="Napis na okvirju" value={r.frame_text} />}
        </Section>

        {/* OPOMBE */}
        {r.notes && (
          <Section title="Opombe stranke" icon={MessageCircle} className="md:col-span-2">
            <p className="text-ink-soft whitespace-pre-wrap">{r.notes}</p>
          </Section>
        )}

        {/* INTERNE OPOMBE */}
        {(r.internal_notes || r.rejection_reason) && (
          <Section title="Interne opombe" icon={Sparkles} className="md:col-span-2">
            {r.rejection_reason && (
              <Row label="Razlog zavrnitve" value={r.rejection_reason} />
            )}
            {r.internal_notes && (
              <Row label="Interne opombe" value={r.internal_notes} />
            )}
          </Section>
        )}
      </div>
    </div>
  );
}

function Section({
  title,
  icon: Icon,
  className,
  children,
}: {
  title: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={`bg-surface border border-line rounded-lg overflow-hidden ${className || ''}`}>
      <div className="p-5 border-b border-line flex items-center gap-3 bg-bg/40">
        <Icon size={16} className="text-accent-dark" />
        <h2 className="font-semibold">{title}</h2>
      </div>
      <div className="p-5 space-y-3">{children}</div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid sm:grid-cols-[160px_1fr] gap-1 sm:gap-3 py-1">
      <span className="text-xs uppercase tracking-wider text-muted font-medium pt-1">
        {label}
      </span>
      <div className="text-sm text-ink">{value}</div>
    </div>
  );
}
