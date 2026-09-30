import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';

const poppins = Poppins({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Photo Booth Slovenija | Ujete Bedarije',
  description:
    'Najem photo booth fotokabine za poroke, rojstne dneve in firmne dogodke po vsej Sloveniji. Neomejen tisk, rekviziti, album in prihod brezplačen. Paketi od 190 €.',
  metadataBase: new URL('https://www.ujetebedarije.si'),
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: '/icon.png',
  },
  openGraph: {
    title: 'Photo Booth Slovenija | Ujete Bedarije',
    description:
      'Najem photo booth fotokabine za poroke, zabave in firmne dogodke po Sloveniji.',
    url: 'https://www.ujetebedarije.si',
    siteName: 'Ujete Bedarije',
    locale: 'sl_SI',
    type: 'website',
    images: [
      {
        url: '/logo.png',
        width: 1600,
        height: 639,
        alt: 'Ujete Bedarije Photobooth',
      },
    ],
  },
  robots: {
    index: false, // TODO: nastavi na true, ko bo javna verzija pripravljena
    follow: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sl" className={poppins.variable}>
      <body>{children}</body>
    </html>
  );
}
