import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { unstable_noStore as noStore } from 'next/cache';
import { getGalleryById } from '@/lib/queries';
import GalleryEditor from './GalleryEditor';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export default async function GalleryEditPage({
  params,
}: {
  params: { id: string };
}) {
  noStore();
  const id = parseInt(params.id, 10);
  if (isNaN(id)) return notFound();

  const gallery = await getGalleryById(id);
  if (!gallery) return notFound();

  const blobConfigured = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

  return (
    <div>
      <Link
        href="/admin/galerija"
        className="inline-flex items-center gap-1 text-sm text-muted hover:text-ink mb-6"
      >
        <ArrowLeft size={14} /> Nazaj na galerije
      </Link>

      {/* key on updated_at forces a full remount when the server returns
          a newer version of the gallery — so client state can't hold
          stale photos from a previous mount. */}
      <GalleryEditor
        key={`${gallery.id}-${gallery.updated_at}`}
        gallery={gallery}
        blobConfigured={blobConfigured}
      />
    </div>
  );
}
