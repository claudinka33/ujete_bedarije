import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getGalleryById } from '@/lib/queries';
import GalleryEditor from './GalleryEditor';

export const dynamic = 'force-dynamic';

export default async function GalleryEditPage({
  params,
}: {
  params: { id: string };
}) {
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

      <GalleryEditor gallery={gallery} blobConfigured={blobConfigured} />
    </div>
  );
}
