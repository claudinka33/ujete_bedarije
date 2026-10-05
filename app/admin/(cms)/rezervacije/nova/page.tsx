import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getAllPackages, getAllExtras } from '@/lib/queries';
import NewReservationForm from './NewReservationForm';

export const dynamic = 'force-dynamic';

export default async function NewReservationPage() {
  // Admin sees ALL packages/extras (including unpublished), so they can
  // record a reservation against a legacy or custom package too.
  const [packages, extras] = await Promise.all([getAllPackages(), getAllExtras()]);

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/rezervacije"
          className="inline-flex items-center gap-1 text-sm text-ink-soft hover:text-ink mb-3"
        >
          <ArrowLeft size={14} /> Nazaj na rezervacije
        </Link>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Nova rezervacija</h1>
        <p className="text-ink-soft">
          Vnesi rezervacijo, ki je prišla po telefonu ali sporočilu.
        </p>
      </div>

      <NewReservationForm packages={packages} extras={extras} />
    </div>
  );
}
