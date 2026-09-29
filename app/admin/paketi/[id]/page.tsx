import { getPackage } from '@/lib/queries';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import PackageForm from './PackageForm';

export const dynamic = 'force-dynamic';

export default async function PackageEditPage({
  params,
}: {
  params: { id: string };
}) {
  const isNew = params.id === 'new';

  let pkg = null;
  if (!isNew) {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) notFound();
    pkg = await getPackage(id);
    if (!pkg) notFound();
  }

  return (
    <div>
      <Link
        href="/admin/paketi"
        className="inline-flex items-center gap-2 text-sm text-ink-soft hover:text-ink mb-6 transition-colors"
      >
        <ArrowLeft size={14} /> Nazaj na pakete
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          {isNew ? 'Nov paket' : `Uredi: ${pkg?.name}`}
        </h1>
        <p className="text-ink-soft">
          {isNew
            ? 'Ustvari nov paket. Spremembe boš videla na strani takoj po shranitvi.'
            : 'Vsi podatki so takoj vidni na javni strani po shranitvi.'}
        </p>
      </div>

      <PackageForm initial={pkg} packageId={pkg?.id} />
    </div>
  );
}
