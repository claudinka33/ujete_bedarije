import { getAllExtras } from '@/lib/queries';
import ExtrasTable from './ExtrasTable';

export const dynamic = 'force-dynamic';

export default async function ExtrasPage() {
  const extras = await getAllExtras();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Dodatne možnosti</h1>
        <p className="text-ink-soft">
          Urejaj imena in cene dodatnih možnosti (Dodatna ura, Audio Guestbook, Neomejen tisk).
          Uredi kar v vrstici in klikni Shrani.
        </p>
      </div>
      <ExtrasTable initial={extras} />
    </div>
  );
}
