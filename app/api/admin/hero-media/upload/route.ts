import { NextRequest, NextResponse } from 'next/server';
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { auth } from '@/auth';
import { countHeroMedia } from '@/lib/queries';

export const runtime = 'nodejs';

const MAX_ITEMS = 5;

/**
 * Mints a signed upload token so the browser can upload directly to Vercel
 * Blob (bypassing the 4.5 MB serverless body limit on the Hobby plan).
 * The DB row is created by the client AFTER the blob upload completes,
 * via POST /api/admin/hero-media/save — simpler than the webhook-based
 * onUploadCompleted pattern.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        const session = await auth();
        if (!session?.user?.email) {
          throw new Error('Not authenticated');
        }
        if (!process.env.BLOB_READ_WRITE_TOKEN) {
          throw new Error('BLOB_READ_WRITE_TOKEN ni nastavljen v Vercelu.');
        }
        const existing = await countHeroMedia();
        if (existing >= MAX_ITEMS) {
          throw new Error(
            `Največ ${MAX_ITEMS} medijev — odstrani enega preden dodaš novega.`
          );
        }
        return {
          allowedContentTypes: [
            'image/jpeg', 'image/png', 'image/webp',
            'video/mp4', 'video/webm', 'video/quicktime',
          ],
          maximumSizeInBytes: 100 * 1024 * 1024, // 100 MB
          tokenPayload: JSON.stringify({ email: session.user.email, pathname }),
          addRandomSuffix: true,
        };
      },
      onUploadCompleted: async ({ blob }) => {
        // Noop — DB row is written by the client via /save after upload.
        // We log for debugging.
        console.log('[hero-media/upload] Blob uploaded:', blob.url);
      },
    });
    return NextResponse.json(jsonResponse);
  } catch (error) {
    console.error('[hero-media/upload] handleUpload error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Upload failed' },
      { status: 400 }
    );
  }
}
