import Link from 'next/link';
import { Images, CheckCircle2, EyeOff, Calendar } from 'lucide-react';
import { unstable_noStore as noStore } from 'next/cache';
import { getAllGalleries } from '@/lib/queries';
import NewGalleryButton from './NewGalleryButton';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export default async function GalleryListPage() {
  noStore();
  const galleries = await getAllGalleries();

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Galerija</h1>
          <p className="text-ink-soft">
            Fotografije preteklih dogodkov. Do 10 fotografij na projekt.
          </p>
        </div>
        <NewGalleryButton />
      </div>

      {galleries.length === 0 ? (
        <div className="bg-surface border border-line rounded-lg p-16 text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-accent/10 flex items-center justify-center text-accent-dark">
            <Images size={28} />
          </div>
          <h2 className="text-xl font-semibold mb-3">Še ni galerij</h2>
          <p className="text-ink-soft max-w-md mx-auto mb-6">
            Ustvari prvo galerijo (npr. &laquo;Poroka Nina &amp; Matej&raquo;) in dodaj
            fotografije. Ko jo označiš kot objavljeno, se prikaže na javni strani.
          </p>
          <NewGalleryButton />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {galleries.map((g) => (
            <Link
              key={g.id}
              href={`/admin/galerija/${g.id}`}
              className="group bg-surface border border-line rounded-lg overflow-hidden hover:border-accent transition-colors"
            >
              <div className="aspect-video bg-bg relative overflow-hidden">
                {g.cover_photo_url ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={g.cover_photo_url}
                    alt={g.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted">
                    <Images size={32} />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  {g.published ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs font-semibold">
                      <CheckCircle2 size={10} /> Objavljen
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold">
                      <EyeOff size={10} /> Osnutek
                    </span>
                  )}
                </div>
              </div>
              <div className="p-4">
                <div className="font-semibold text-ink truncate">{g.title}</div>
                <div className="flex items-center gap-3 mt-1 text-xs text-muted">
                  {g.event_type && <span>{g.event_type}</span>}
                  {g.event_date && (
                    <span className="inline-flex items-center gap-1">
                      <Calendar size={10} />
                      {new Date(g.event_date).toLocaleDateString('sl-SI')}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
