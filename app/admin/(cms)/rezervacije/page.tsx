import { getReservationsWithDisplayNumber } from '@/lib/queries';
import Link from 'next/link';
import StatusPill from '@/components/admin/StatusPill';
import { Calendar, ArrowUpRight } from 'lucide-react';
import { unstable_noStore as noStore } from 'next/cache';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const STATUS_TABS = [
  { key: 'all', label: 'Vse' },
  { key: 'pending', label: 'V čakanju' },
  { key: 'confirmed', label: 'Potrjene' },
  { key: 'rejected', label: 'Zavrnjene' },
  { key: 'completed', label: 'Zaključene' },
];

export default async function ReservationsPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  noStore();
  const status = searchParams.status && searchParams.status !== 'all' ? searchParams.status : undefined;
  const reservations = await getReservationsWithDisplayNumber(status);

  return (
    <div>
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Rezervacije</h1>
          <p className="text-ink-soft">
            Vsa povpraševanja strank — pregled, potrditev, zavrnitev.
          </p>
        </div>
      </div>

      {/* Status tabs */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-line pb-3">
        {STATUS_TABS.map((tab) => {
          const active = (searchParams.status || 'all') === tab.key;
          return (
            <Link
              key={tab.key}
              href={tab.key === 'all' ? '/admin/rezervacije' : `/admin/rezervacije?status=${tab.key}`}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                active
                  ? 'bg-ink text-bg'
                  : 'bg-surface border border-line text-ink-soft hover:border-accent'
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      {/* List */}
      {reservations.length === 0 ? (
        <div className="p-16 bg-surface border border-line rounded-lg text-center text-muted">
          <Calendar size={40} className="mx-auto mb-4 opacity-40" />
          <p className="mb-1">Ni rezervacij v tej kategoriji.</p>
          <p className="text-xs">Ko stranka izpolni obrazec, se pojavi tu.</p>
        </div>
      ) : (
        <div className="bg-surface border border-line rounded-lg divide-y divide-line">
          {reservations.map((r) => (
            <Link
              key={r.id}
              href={`/admin/rezervacije/${r.id}`}
              className="block p-5 hover:bg-bg transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center justify-center min-w-[2rem] h-7 px-2 rounded-full bg-bg border border-line text-sm font-semibold text-ink-soft">
                      {Number(r.display_number)}
                    </span>
                    <span className="font-semibold text-lg">{r.customer_name}</span>
                    <StatusPill status={r.status} />
                  </div>
                  <div className="grid sm:grid-cols-3 gap-x-6 gap-y-1 text-sm text-ink-soft">
                    <div>
                      <span className="text-muted">📅 Dogodek:</span>{' '}
                      {new Date(r.event_date).toLocaleDateString('sl-SI')} · {r.event_time.slice(0, 5)}
                    </div>
                    <div>
                      <span className="text-muted">📍 Lokacija:</span> {r.event_location}
                    </div>
                    <div>
                      <span className="text-muted">🎉 Tip:</span> {r.event_type}
                    </div>
                    <div>
                      <span className="text-muted">📞</span> {r.customer_phone}
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-muted">✉️</span> {r.customer_email}
                    </div>
                  </div>
                  <div className="text-xs text-muted mt-2">
                    Paket: <strong>{r.package_name_snapshot}</strong>
                    {' · '}
                    Poslano: {new Date(r.created_at).toLocaleString('sl-SI')}
                  </div>
                </div>
                <ArrowUpRight size={20} className="flex-shrink-0 text-muted" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
