import { Images } from 'lucide-react';

export default function GalleryPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Galerija</h1>
        <p className="text-ink-soft">
          Nalaganje fotografij dogodkov (poroke, rojstni dnevi, firmni dogodki).
        </p>
      </div>

      <div className="bg-surface border border-line rounded-lg p-16 text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-accent/10 flex items-center justify-center text-accent-dark">
          <Images size={28} />
        </div>
        <h2 className="text-xl font-semibold mb-3">Galerija je v izdelavi</h2>
        <p className="text-ink-soft max-w-md mx-auto mb-6">
          Modul za nalaganje fotografij prihaja v naslednji nadgradnji.
          Vsak &laquo;projekt&raquo; bo lahko imel do 10 fotografij, ki
          se bodo prikazovale na javni strani.
        </p>
        <div className="inline-block px-4 py-2 rounded-full bg-accent/10 text-accent-dark text-xs font-semibold uppercase tracking-wider">
          Kmalu na voljo
        </div>
      </div>

      <div className="mt-8 p-6 bg-surface border border-line rounded-lg">
        <h3 className="font-semibold mb-3">Kaj bo v naslednji verziji</h3>
        <ul className="space-y-2 text-sm text-ink-soft">
          <li>&#8226; Ustvarjanje projektov (poroka, rojstni dan, ...)</li>
          <li>&#8226; Drag &amp; drop upload do 10 fotografij</li>
          <li>&#8226; Avtomatska kompresija in optimizacija (za hitrost strani)</li>
          <li>&#8226; Naslovna slika (cover)</li>
          <li>&#8226; Toggle &laquo;objavljen&raquo; — pripravi in objavi kasneje</li>
          <li>&#8226; Prikaz galerij na javni strani z lightbox</li>
        </ul>
      </div>
    </div>
  );
}
