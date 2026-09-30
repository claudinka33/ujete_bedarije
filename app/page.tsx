import {
  getPackages,
  getExtras,
  getReviews,
  getFaqItems,
  getSettings,
} from '@/lib/queries';
import { Check, Phone, Mail, Star } from 'lucide-react';
import BookingProvider from '@/components/booking/BookingProvider';
import BookingButton from '@/components/booking/BookingButton';
import FaqAccordion from '@/components/site/FaqAccordion';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [packages, extras, reviews, faq, settings] = await Promise.all([
    getPackages(),
    getExtras(),
    getReviews(),
    getFaqItems(),
    getSettings(),
  ]);

  return (
    <BookingProvider packages={packages} extras={extras}>
      <main className="min-h-screen">
        {/* NAV */}
        <nav className="sticky top-0 z-40 bg-bg/80 backdrop-blur-md border-b border-line">
          <div className="container-page flex items-center justify-between py-4">
            <a href="/" className="flex items-center" aria-label="Ujete Bedarije Photobooth">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.png"
                alt="Ujete Bedarije Photobooth"
                width={180}
                height={72}
                className="h-10 md:h-12 w-auto"
              />
            </a>
            <div className="hidden md:flex items-center gap-8 text-sm">
              <a href="#paketi" className="hover:text-accent-dark transition-colors">
                Paketi
              </a>
              <a href="#mnenja" className="hover:text-accent-dark transition-colors">
                Mnenja
              </a>
              <a href="#faq" className="hover:text-accent-dark transition-colors">
                FAQ
              </a>
              <a href="#kontakt" className="hover:text-accent-dark transition-colors">
                Kontakt
              </a>
            </div>
            <BookingButton className="btn-primary text-xs md:text-sm">
              Rezerviraj →
            </BookingButton>
          </div>
        </nav>

        {/* HERO */}
        <section className="pt-20 pb-16 md:pt-32 md:pb-24 relative overflow-hidden">
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
              <BookingButton className="btn-primary">Rezerviraj termin</BookingButton>
              <a href="#paketi" className="btn-ghost">
                Poglej pakete
              </a>
            </div>

            {settings.bonus_banner && (
              <div className="mt-12 inline-flex items-center gap-2 px-5 py-3 rounded-full bg-accent/10 text-accent-dark text-sm font-medium">
                🎁 {settings.bonus_banner}
              </div>
            )}
          </div>
        </section>

        {/* PAKETI */}
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

                  <BookingButton
                    packageSlug={pkg.slug}
                    className={`block w-full text-center py-3 rounded-full font-semibold text-sm transition-opacity ${
                      pkg.featured
                        ? 'bg-bg text-ink hover:opacity-90'
                        : 'bg-transparent border border-line hover:border-accent'
                    }`}
                  >
                    Izberi {pkg.name}
                  </BookingButton>
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

        {/* MNENJA STRANK */}
        {reviews.length > 0 && (
          <section id="mnenja" className="py-24">
            <div className="container-page">
              <div className="text-center mb-16">
                <span className="eyebrow">Mnenja strank</span>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight mt-4 mb-4">
                  Kaj pravijo naše stranke
                </h2>
                <div className="flex items-center justify-center gap-1 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className="fill-accent text-accent"
                    />
                  ))}
                  <span className="ml-2 text-sm text-muted">
                    povprečna ocena · {reviews.length} mnenj
                  </span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {reviews.map((rev) => (
                  <article
                    key={rev.id}
                    className="bg-surface border border-line rounded-lg p-6"
                  >
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          className="fill-accent text-accent"
                        />
                      ))}
                    </div>
                    <p className="text-sm text-ink-soft leading-relaxed mb-6">
                      {rev.text}
                    </p>
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm ${
                          rev.avatar_variant === 1
                            ? 'bg-accent'
                            : rev.avatar_variant === 2
                            ? 'bg-rose'
                            : rev.avatar_variant === 3
                            ? 'bg-sage'
                            : rev.avatar_variant === 4
                            ? 'bg-purple-400'
                            : 'bg-amber-400'
                        }`}
                      >
                        {rev.reviewer_initial || rev.reviewer_name[0]}
                      </div>
                      <div>
                        <div className="font-semibold text-sm">
                          {rev.reviewer_name}
                        </div>
                        <div className="text-xs text-muted">
                          {rev.event_type} · {rev.location}
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* FAQ */}
        {faq.length > 0 && (
          <section id="faq" className="py-24 bg-surface">
            <div className="container-page">
              <div className="text-center mb-16">
                <span className="eyebrow">Vprašanja</span>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight mt-4 mb-4">
                  Pogosta vprašanja
                </h2>
                <p className="text-ink-soft max-w-xl mx-auto">
                  Vse, kar morate vedeti pred rezervacijo.
                </p>
              </div>
              <FaqAccordion items={faq} />
            </div>
          </section>
        )}

        {/* KONTAKT */}
        <section id="kontakt" className="py-24">
          <div className="container-page text-center">
            <span className="eyebrow">Kontakt</span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mt-4 mb-8">
              Rezerviraj termin
            </h2>
            <p className="text-ink-soft max-w-xl mx-auto mb-10">
              Za rezervacijo ali dodatna vprašanja nas kontaktirajte.
            </p>

            <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-12">
              {/* Phone */}
              <a
                href={`tel:${settings.phone_international || '+38630654002'}`}
                className="flex flex-col items-center gap-3 p-6 bg-surface border border-line rounded-lg hover:border-accent transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent-dark">
                  <Phone size={20} />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted mb-1">
                    Telefon
                  </div>
                  <div className="font-semibold">
                    {settings.phone || '030 654 002'}
                  </div>
                </div>
              </a>

              {/* WhatsApp */}
              <a
                href={`https://wa.me/${(settings.phone_international || '+38630654002').replace('+', '')}?text=${encodeURIComponent(settings.whatsapp_message || 'Pozdravljeni, zanima me photo booth za dogodek.')}`}
                target="_blank"
                rel="noopener"
                className="flex flex-col items-center gap-3 p-6 bg-surface border border-line rounded-lg hover:border-accent transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-sage/20 flex items-center justify-center text-sage">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted mb-1">
                    WhatsApp
                  </div>
                  <div className="font-semibold">Pošlji sporočilo</div>
                </div>
              </a>

              {/* Email */}
              <a
                href={`mailto:${settings.email || 'ujete.bedarije@gmail.com'}`}
                className="flex flex-col items-center gap-3 p-6 bg-surface border border-line rounded-lg hover:border-accent transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-rose/20 flex items-center justify-center text-rose">
                  <Mail size={20} />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted mb-1">
                    Email
                  </div>
                  <div className="font-semibold text-xs md:text-sm">
                    {settings.email || 'ujete.bedarije@gmail.com'}
                  </div>
                </div>
              </a>
            </div>

            <BookingButton className="btn-primary text-base px-8 py-4">
              Rezerviraj termin →
            </BookingButton>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-line py-12 bg-surface">
          <div className="container-page text-center text-sm text-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="Ujete Bedarije Photobooth"
              width={220}
              height={88}
              className="h-14 w-auto mx-auto mb-4 opacity-90"
            />
            <p>Photo Booth Slovenija · {settings.service_area || 'Slovenija'}</p>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-6 text-xs">
              <a href="/pravila-zasebnosti" className="hover:text-ink-soft transition-colors">
                Pravila zasebnosti
              </a>
              <a href="/pogoji-uporabe" className="hover:text-ink-soft transition-colors">
                Pogoji uporabe
              </a>
              <a href={`mailto:${settings.email || 'ujete.bedarije@gmail.com'}`} className="hover:text-ink-soft transition-colors">
                Kontakt
              </a>
              <a href="/admin" className="hover:text-ink-soft transition-colors opacity-60">
                Za zaposlene
              </a>
            </div>
            <p className="mt-6 text-xs">
              &copy; {new Date().getFullYear()} Ujete Bedarije. Vse pravice pridržane.
            </p>
          </div>
        </footer>
      </main>
    </BookingProvider>
  );
}
