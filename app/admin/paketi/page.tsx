import { getAllPackages } from '@/lib/queries';
import Link from 'next/link';
import { Plus, Edit3, Eye, EyeOff } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function PackagesPage() {
  const packages = await getAllPackages();

  return (
    <div>
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Paketi</h1>
          <p className="text-ink-soft">
            Urejaj cene, opise in vsebino paketov. Spremembe so takoj vidne na spletni strani.
          </p>
        </div>
        <Link
          href="/admin/paketi/new"
          className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-full bg-ink text-bg text-sm font-semibold hover:opacity-90"
        >
          <Plus size={16} /> Nov paket
        </Link>
      </div>

      <div className="bg-surface border border-line rounded-lg divide-y divide-line">
        {packages.map((pkg) => (
          <div key={pkg.id} className="p-5 flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-lg font-semibold">{pkg.name}</h2>
                {pkg.published ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-wider text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                    <Eye size={10} /> OBJAVLJEN
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-wider text-gray-700 bg-gray-100 px-2 py-0.5 rounded-full">
                    <EyeOff size={10} /> OSNUTEK
                  </span>
                )}
                {pkg.featured && (
                  <span className="text-[10px] font-bold tracking-wider text-accent-dark bg-accent/10 px-2 py-0.5 rounded-full">
                    PRIPOROČEN
                  </span>
                )}
              </div>
              <div className="text-sm text-ink-soft mb-1">
                {pkg.duration_label} · <strong className="text-ink">{pkg.price}€</strong>
                {pkg.old_price && (
                  <span className="text-muted line-through ml-2">{pkg.old_price}€</span>
                )}
                {pkg.sale_badge && (
                  <span className="ml-2 text-red-600 font-medium">{pkg.sale_badge}</span>
                )}
              </div>
              <div className="text-xs text-muted">
                {pkg.features.length} funkcij · slug: <code className="bg-bg px-1.5 py-0.5 rounded">{pkg.slug}</code>
              </div>
            </div>
            <Link
              href={`/admin/paketi/${pkg.id}`}
              className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm border border-line hover:border-accent transition-colors"
            >
              <Edit3 size={14} /> Uredi
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
