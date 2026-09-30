import { getAllReviews } from '@/lib/queries';
import ReviewsTable from './ReviewsTable';

export const dynamic = 'force-dynamic';

export default async function ReviewsPage() {
  const reviews = await getAllReviews();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Mnenja strank</h1>
        <p className="text-ink-soft">
          Urejaj mnenja, ki se prikazujejo na javni strani. Dobra mnenja gradijo zaupanje.
        </p>
      </div>
      <ReviewsTable initial={reviews as (typeof reviews[number] & { published: boolean })[]} />
    </div>
  );
}
