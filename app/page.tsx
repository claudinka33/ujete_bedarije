import { getPackages, getExtras, getSettings } from '@/lib/queries';
import { Check, Phone, Mail } from 'lucide-react';

// Force dynamic rendering — vedno beri sveže podatke iz DB
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [packages, extras, settings] = await Promise.all([
    getPackages(),
    getExtras(),
    getSettings(),
  ]);

  return (
    <main className="min-h-screen">
      {/* =========================================================
          HERO
          ========================================================= */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-24 relative overflow-hidden">
        {/* Soft gradient orbs */}
        <div
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-40 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle, rgba(212, 165, 165, 0.4), transparent 70%)',
          }}
        />
        <div
          className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-30 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle, rgba(168, 181, 160, 0.4), transparent 70%)',
          }}
        />

        <div className="container-page relative z-10 text-center">
          <span className="eyebrow mb-6">Photo Booth Slovenija</span>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-none mt-6 mb-6">
            {settings.hero_title || 'Ujemite trenutke na svoj način'}
          </h1>
          <p className="text-lg md:text-xl text-ink-soft max-w-2xl mx-auto mb-10">
            {settings.hero_subtitle ||
              'Photo booth za poroke, zabave in firmne dogodke po Sloveniji.'}
          </p>

          <div className="flex flex-wrap gap-3 justify-center">
            <a href="#paketi" className="btn-primary">
              {settings.hero_cta_secondary || 'Poglej pakete'}
            </a>
            <a href="#kontakt" className="btn-ghost">
              <Phone size={16} /> {settings.phone || '030 654 002'}
            </a>
          </div>

          {settings.bonus_banner && (
            <div className="mt-12 inline-flex items-center gap-2 px-5 py-3 rounded-full bg-accent/10 text-accent-dark text-sm font-medium">
              🎁 {settings.bonus_banner}
            </div>
          )}
        </div>
      </section>

      {/* =========================================================
          PAKETI (iz baze)
          ========================================================= */}
      <section id="paketi" className="py-24 bg-surface">
        <div className="container-page">
          <div className="text-center mb-16">
            <span className="eyebrow">Paketi</span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mt-4 mb-4">
              Izberite paket, ki vam ustreza
            </h2>
            <p className="text-ink-soft max-w-xl mx-auto">
              Od preprostih spominov do VIP doživetja. Brez skritih stroškov.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <article
                key={pkg.id}
                className={`relative rounded-lg p-8 border ${
                  pkg.featured
                    ? 'bg-ink text-bg border-ink shadow-lg'
                    : 'bg-bg border-line'
                }`}
              >
                {pkg.sale_badge && (
                  <div
                    className={`absolute -top-3 left-6 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
                      pkg.featured
                        ? 'bg-red-500 text-white shadow-md'
                        : 'bg-accent text-ink shadow-sm'
                    }`}
                  >
                    {pkg.sale_badge}
                  </div>
                )}
                {pkg.ribbon && (
                  <div className="absolute top-5 right-5 px-3 py-1 rounded-full bg-accent text-ink text-[11px] font-semibold uppercase tracking-wider">
                    {pkg.ribbon}
                  </div>
                )}

                <h3 className="text-2xl font-semibold mb-2">{pkg.name}</h3>
                <p
                  className={`text-sm mb-6 ${
                    pkg.featured ? 'text-white/60' : 'text-muted'
                  }`}
                >
                  {pkg.duration_label}
                </p>

                {pkg.old_price && (
                  <p
                    className={`text-sm line-through mb-1 ${
                      pkg.featured ? 'text-white/50' : 'text-muted'
                    }`}
                  >
                    {pkg.old_price}€
                  </p>
                )}
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-5xl font-bold tracking-tighter leading-none">
                    {pkg.price}
                  </span>
                  <span
                    className={`text-xl font-medium ${
                      pkg.featured ? 'text-white/70' : 'text-ink-soft'
                    }`}
                  >
                    €
                  </span>
                </div>
                <p
                  className={`text-xs mb-7 ${
                    pkg.featured ? 'text-white/60' : 'text-muted'
                  }`}
                >
                  {pkg.price_note || 'vse vključeno'}
                </p>

                <ul className="space-y-2 mb-7">
                  {pkg.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check
                        size={16}
                        className={`flex-shrink-0 mt-1 ${
                          pkg.featured ? 'text-accent' : 'text-accent-dark'
                        }`}
                      />
                      <span className={pkg.featured ? 'text-white/90' : ''}>
                        {f.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <a
                  href="#kontakt"
                  className={`block w-full text-center py-3 rounded-full font-semibold text-sm transition-opacity ${
                    pkg.featured
                      ? 'bg-bg text-ink hover:opacity-90'
                      : 'bg-transparent border border-line hover:border-accent'
                  }`}
                >
                  Izberi {pkg.name}
                </a>
              </article>
            ))}
          </div>

          {/* EXTRAS */}
          {extras.length > 0 && (
            <div className="mt-16 max-w-4xl mx-auto">
              <p className="text-center eyebrow mb-6">Dodatne možnosti</p>
              <div className="grid md:grid-cols-3 gap-4">
                {extras.map((extra) => (
                  <div
                    key={extra.id}
                    className="flex justify-between items-center gap-4 p-5 bg-surface border border-line rounded"
                  >
                    <span className="text-sm font-medium">{extra.name}</span>
                    <span className="text-lg font-bold text-accent-dark flex-shrink-0">
                      {extra.price}€
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-center text-xs text-muted mt-8 opacity-75">
                {settings.vat_note || 'Vse navedene cene so brez DDV.'}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* =========================================================
          KONTAKT
          ========================================================= */}
      <section id="kontakt" className="py-24">
        <div className="container-page text-center">
          <span className="eyebrow">Kontakt</span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mt-4 mb-8">
            Rezerviraj termin
          </h2>
          <p className="text-ink-soft max-w-xl mx-auto mb-10">
            Za rezervacijo ali dodatna vprašanja nas kontaktirajte.
          </p>

          <div className="flex flex-wrap gap-3 justify-center">
            <a href={`tel:${settings.phone_international || '+38630654002'}`} className="btn-primary">
              <Phone size={16} /> {settings.phone || '030 654 002'}
            </a>
            <a href={`mailto:${settings.email || 'ujete.bedarije@gmail.com'}`} className="btn-ghost">
              <Mail size={16} /> Email
            </a>
          </div>

          <p className="mt-12 text-xs text-muted">
            🚧 Next.js migration in progress — {packages.length} paketov naloženih iz baze
          </p>
        </div>
      </section>
    </main>
  );
}
