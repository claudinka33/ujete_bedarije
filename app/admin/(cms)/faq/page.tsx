import { getAllFaqItems } from '@/lib/queries';
import FaqTable from './FaqTable';

export const dynamic = 'force-dynamic';

export default async function FaqPage() {
  const items = await getAllFaqItems();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Pogosta vprašanja (FAQ)</h1>
        <p className="text-ink-soft">
          Urejaj vprašanja in odgovore, ki se prikazujejo na javni strani.
        </p>
      </div>
      <FaqTable initial={items as (typeof items[number] & { published: boolean })[]} />
    </div>
  );
}
