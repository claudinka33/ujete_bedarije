import Script from 'next/script';

interface Props {
  instagramUrl?: string;
  imageUrl?: string;
}

/**
 * Hero media panel: shows an Instagram Reel embed if an Instagram URL is set,
 * otherwise a plain image, otherwise nothing. Returning null lets the parent
 * fall back to a text-only centered layout.
 */
export default function HeroMedia({ instagramUrl, imageUrl }: Props) {
  // Prefer Instagram over image
  if (instagramUrl && instagramUrl.includes('instagram.com')) {
    // Instagram expects a trailing slash on the permalink
    const cleanUrl = instagramUrl.trim().replace(/\/?(\?.*)?$/, '/');
    return (
      <div className="w-full max-w-sm mx-auto">
        <div className="rounded-xl overflow-hidden shadow-xl bg-surface">
          {/* eslint-disable-next-line react/no-danger */}
          <blockquote
            className="instagram-media"
            data-instgrm-permalink={cleanUrl}
            data-instgrm-version="14"
            style={{
              background: '#FFF',
              border: 0,
              borderRadius: '12px',
              margin: 0,
              width: '100%',
              minHeight: '560px',
            }}
          >
            <a
              href={cleanUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#1c1a17', fontSize: '14px', padding: '20px', display: 'block' }}
            >
              Odpri Reel na Instagramu →
            </a>
          </blockquote>
        </div>
        {/* Instagram's embed script transforms the blockquote into an interactive Reel player */}
        <Script
          src="https://www.instagram.com/embed.js"
          strategy="afterInteractive"
          async
        />
      </div>
    );
  }

  if (imageUrl && imageUrl.trim()) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="relative aspect-[4/5] rounded-xl overflow-hidden shadow-xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt="Ujete Bedarije photo booth"
            className="w-full h-full object-cover"
            loading="eager"
          />
        </div>
      </div>
    );
  }

  return null;
}
