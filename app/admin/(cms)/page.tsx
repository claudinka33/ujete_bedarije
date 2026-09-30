import { sql } from '@/lib/db';
import Link from 'next/link';
import { Calendar, CheckCircle2, XCircle, Clock, TrendingUp, type LucideIcon } from 'lucide-react';
import StatusPill from '@/components/admin/StatusPill';

export const dynamic = 'force-dynamic';

interface Stats {
  pending: number;
  confirmed: number;
  rejected: number;
  upcoming30: number;
}

async function getStats(): Promise<Stats> {
  const rows = (await sql`
    SELECT
      COUNT(*) FILTER (WHERE status = 'pending') as pending,
      COUNT(*) FILTER (WHERE status = 'confirmed') as confirmed,
      COUNT(*) FILTER (WHERE status = 'rejected') as rejected,
      COUNT(*) FILTER (
        WHERE status = 'confirmed'
        AND event_date >= CURRENT_DATE
        AND event_date <= CURRENT_DATE + INTERVAL '30 days'
      ) as upcoming30
    FROM reservations
  `) as Array<{ pending: number; confirmed: number; rejected: number; upcoming30: number }>;

  return {
    pending: Number(rows[0]?.pending || 0),
    confirmed: Number(rows[0]?.confirmed || 0),
    rejected: Number(rows[0]?.rejected || 0),
    upcoming30: Number(rows[0]?.upcoming30 || 0),
  };
}

async function getRecentReservations() {
  const rows = await sql`
    SELECT id, customer_name, event_date, event_type, event_location,
           package_name_snapshot, status, created_at
    FROM reservations
    ORDER BY created_at DESC
    LIMIT 5
  `;
  return rows as Array<{
    id: number;
    customer_name: string;
    event_date: string;
    event_type: string;
    event_location: string;
    package_name_snapshot: string;
    status: string;
    created_at: string;
  }>;
}

export default async function AdminDashboard() {
  const [stats, recent] = await Promise.all([getStats(), getRecentReservations()]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Nadzorna plošča</h1>
        <p className="text-ink-soft">Pregled stanja rezervacij in dogodkov.</p>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard
          label="Nove rezervacije"
          value={stats.pending}
          icon={Clock}
          color="amber"
          href="/admin/rezervacije?status=pending"
        />
        <StatCard
          label="Potrjene"
          value={stats.confirmed}
          icon={CheckCircle2}
          color="green"
          href="/admin/rezervacije?status=confirmed"
        />
        <StatCard
          label="Zavrnjene"
          value={stats.rejected}
          icon={XCircle}
          color="red"
          href="/admin/rezervacije?status=rejected"
        />
        <StatCard
          label="Prihodnjih 30 dni"
          value={stats.upcoming30}
          icon={TrendingUp}
          color="accent"
        />
      </div>

      {/* NEW RESERVATIONS ALERT */}
      {stats.pending > 0 && (
        <div className="mb-8 p-5 bg-accent/10 border border-accent/30 rounded-lg flex items-center justify-between gap-4">
          <div>
            <div className="font-semibold text-ink">
              Imaš {stats.pending} {stats.pending === 1 ? 'novo povpraševanje' : 'novih povpraševanj'} 🎉
            </div>
            <div className="text-sm text-ink-soft">Preglej in odgovori strankam.</div>
          </div>
          <Link
            href="/admin/rezervacije?status=pending"
            className="flex-shrink-0 px-5 py-2.5 rounded-full bg-ink text-bg text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Preglej →
          </Link>
        </div>
      )}

      {/* RECENT RESERVATIONS */}
      <div className="bg-surface border border-line rounded-lg">
        <div className="p-5 border-b border-line flex items-center justify-between">
          <h2 className="font-semibold text-lg">Zadnje rezervacije</h2>
          <Link
            href="/admin/rezervacije"
            className="text-sm text-accent-dark hover:underline"
          >
            Vse →
          </Link>
        </div>

        {recent.length === 0 ? (
          <div className="p-12 text-center text-muted">
            <Calendar size={32} className="mx-auto mb-3 opacity-40" />
            <p>Še ni rezervacij. Ko bodo, se bodo pojavile tukaj.</p>
          </div>
        ) : (
          <div className="divide-y divide-line">
            {recent.map((r) => (
              <Link
                key={r.id}
                href={`/admin/rezervacije/${r.id}`}
                className="block p-5 hover:bg-bg transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">{r.customer_name}</span>
                      <StatusPill status={r.status} />
                    </div>
                    <div className="text-sm text-ink-soft">
                      {r.event_type} · {r.event_location} ·{' '}
                      {new Date(r.event_date).toLocaleDateString('sl-SI')}
                    </div>
                    <div className="text-xs text-muted mt-1">
                      {r.package_name_snapshot}
                    </div>
                  </div>
                  <div className="text-xs text-muted flex-shrink-0">
                    {new Date(r.created_at).toLocaleDateString('sl-SI')}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  color,
  href,
}: {
  label: string;
  value: number;
  icon: LucideIcon;
  color: 'amber' | 'green' | 'red' | 'accent';
  href?: string;
}) {
  const bgColorMap = {
    amber: 'bg-amber-100 text-amber-700',
    green: 'bg-green-100 text-green-700',
    red: 'bg-red-100 text-red-700',
    accent: 'bg-accent/10 text-accent-dark',
  };

  const inner = (
    <div className="p-5 bg-surface border border-line rounded-lg hover:border-accent transition-colors h-full">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs text-muted uppercase tracking-wider mb-2">{label}</div>
          <div className="text-3xl font-bold tracking-tight">{value}</div>
        </div>
        <div className={`w-10 h-10 rounded-lg ${bgColorMap[color]} flex items-center justify-center flex-shrink-0`}>
          <Icon size={18} />
        </div>
      </div>
    </div>
  );

  return href ? <Link href={href}>{inner}</Link> : inner;
}

