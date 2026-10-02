import { Film, AlertCircle } from 'lucide-react';
import { unstable_noStore as noStore } from 'next/cache';
import { getAllHeroMedia } from '@/lib/queries';
import HeroMediaManager from './HeroMediaManager';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HeroMediaPage() {
  noStore();
  const items = await getAllHeroMedia();
  const blobConfigured = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-3">
          <Film size={28} /> Hero carousel
        </h1>
        <p className="text-ink-soft">
          Slike in videji, ki se vrtijo na vrhu strani (desno od naslova). Največ 5 medijev.
          Videji se predvajajo avtomatsko, brez zvoka.
        </p>
      </div>

      {!blobConfigured && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded text-sm text-amber-900 flex items-start gap-2">
          <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
          <div>
            Vercel Blob ni nastavljen. Upload medijev ne bo deloval, dokler Claudia doda
            BLOB_READ_WRITE_TOKEN v Vercel env vars.
          </div>
        </div>
      )}

      <HeroMediaManager initial={items} blobConfigured={blobConfigured} />
    </div>
  );
}
