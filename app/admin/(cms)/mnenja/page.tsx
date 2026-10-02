import { Clock } from 'lucide-react';
import { unstable_noStore as noStore } from 'next/cache';
import { getAllReviews, countPendingPublicReviews } from '@/lib/queries';
import ReviewsTable from './ReviewsTable';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ReviewsPage() {
  noStore();
  const [reviews, pendingCount] = await Promise.all([
    getAllReviews(),
    countPendingPublicReviews(),
  ]);

  return (
    <div>
      <div className="mb-8">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Mnenja strank</h1>
            <p className="text-ink-soft">
              Urejaj mnenja, ki se prikazujejo na javni strani. Nova mnenja, oddana preko spletne
              strani, se prikažejo zgoraj z rumeno obrobo &mdash; odkljukaj &laquo;Objavljen&raquo;
              in Shrani za objavo.
            </p>
          </div>
          {pendingCount > 0 && (
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100 text-amber-800 text-sm font-semibold border border-amber-200">
              <Clock size={14} /> {pendingCount} za pregled
            </span>
          )}
        </div>
      </div>
      <ReviewsTable initial={reviews as (typeof reviews[number] & { published: boolean })[]} />
    </div>
  );
}
