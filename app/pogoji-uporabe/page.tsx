import type { Metadata } from 'next';
import Link from 'next/link';
import { getSettings } from '@/lib/queries';
import { ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Pogoji uporabe | Ujete Bedarije',
  description:
    'Splošni pogoji uporabe storitev Ujete Bedarije — najem photo booth fotokabine, plačilne pogoje in odgovornosti.',
  robots: { index: true, follow: true },
};

export default async function TermsPage() {
  const s = await getSettings();
  const company = s.company_name || 'Ujete Bedarije';
  const email = s.email || 'ujete.bedarije@gmail.com';
  const phone = s.phone || '030 654 002';
  const deposit = s.reservation_deposit_percent || '30';
  const responseHours = s.reservation_response_hours || '24';

  return (
    <div className="min-h-screen bg-bg py-12">
      <div className="max-w-3xl mx-auto px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-ink-soft hover:text-ink mb-8 transition-colors"
        >
          <ArrowLeft size={14} /> Nazaj na domačo stran
        </Link>

        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Pogoji uporabe
        </h1>
        <p className="text-sm text-muted mb-10">
          Zadnja posodobitev:{' '}
          {new Date().toLocaleDateString('sl-SI', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </p>

        <div className="prose prose-sm max-w-none space-y-6 text-ink-soft leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold text-ink mt-8 mb-3">1. Splošno</h2>
            <p>
              Ti splošni pogoji uporabe (v nadaljevanju: SPU) urejajo razmerje med izvajalcem
              storitve <strong>{company}</strong> (v nadaljevanju: izvajalec) in naročnikom (fizično
              ali pravno osebo, ki naroči storitev).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-ink mt-8 mb-3">2. Rezervacija</h2>
            <p>
              Naročnik pošlje povpraševanje preko spletnega obrazca ali telefonsko. Izvajalec se v
              roku <strong>{responseHours} ur</strong> obveže odgovoriti s potrditvijo ali predlogom
              alternativnega termina.
            </p>
            <p>
              Rezervacija je potrjena šele s plačilom predplačila v višini <strong>{deposit}%</strong>{' '}
              cene paketa. Preostali znesek se plača ob zaključku dogodka ali po dogovoru.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-ink mt-8 mb-3">3. Cene</h2>
            <p>
              Vse cene na spletni strani so navedene <strong>brez DDV</strong>. DDV se prišteje
              končnemu računu v skladu z veljavno zakonodajo.
            </p>
            <p>
              Cene, ki so v akciji, veljajo za rezervacije, oddane v času trajanja akcije.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-ink mt-8 mb-3">4. Odpoved rezervacije</h2>
            <p>
              Naročnik lahko odpove rezervacijo pisno (email) pod naslednjimi pogoji:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Več kot 30 dni pred dogodkom: 100% predplačila se vrne</li>
              <li>15–30 dni pred dogodkom: 50% predplačila se vrne</li>
              <li>Manj kot 15 dni pred dogodkom: predplačilo se ne vrne</li>
            </ul>
            <p className="mt-3">
              V primeru višje sile (bolezen, elementarna nesreča) se z izvajalcem dogovorimo o
              prestavitvi termina brez dodatnih stroškov.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-ink mt-8 mb-3">5. Postavitev in prostor</h2>
            <p>
              Naročnik zagotovi ustrezen prostor (min. 2×3 m), električni priključek 230V in dovolj
              osvetljen prostor.
            </p>
            <p>
              Izvajalec prispe 45–90 minut pred začetkom dogodka. Postavitev in pospravljanje nista
              vključena v plačan čas.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-ink mt-8 mb-3">6. Vključeno v storitev</h2>
            <p>
              Cena paketa vključuje vse, kar je navedeno v opisu izbranega paketa. Dodatne
              možnosti se doplačajo po ceniku.
            </p>
            <p>
              <strong>Prihod na lokacijo je brezplačen</strong> za vse rezervacije do 31. 12. 2026,
              ne glede na oddaljenost.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-ink mt-8 mb-3">7. Odgovornost</h2>
            <p>
              Izvajalec ni odgovoren za škodo, ki bi jo povzročili gostje na opremi photo booth-a.
              V primeru večje škode ima izvajalec pravico do povračila škode.
            </p>
            <p>
              Izvajalec ne odgovarja za morebitne zamude, ki nastanejo zaradi razmer izven
              njegovega nadzora (prometni zastoj, izpad električne energije, elementarne nesreče).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-ink mt-8 mb-3">8. Fotografije in avtorske pravice</h2>
            <p>
              Vse fotografije, posnete med dogodkom, pripadajo naročniku. Izvajalec si pridržuje
              pravico do uporabe manjšega izbora fotografij za namene promocije (portfolio, spletna
              stran, družbena omrežja), razen če se z naročnikom drugače dogovori.
            </p>
            <p>
              Če naročnik izrecno prepove uporabo fotografij za promocijo, to sporoči izvajalcu pred
              dogodkom.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-ink mt-8 mb-3">9. Reševanje sporov</h2>
            <p>
              Morebitne spore skušamo rešiti sporazumno. V primeru nemožnosti sporazumne rešitve je
              pristojno stvarno pristojno sodišče v Republiki Sloveniji.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-ink mt-8 mb-3">10. Kontakt</h2>
            <p>
              Za vsa vprašanja o pogojih uporabe nam pišite:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>E-pošta: <a href={`mailto:${email}`} className="text-accent-dark underline">{email}</a></li>
              <li>Telefon: <a href={`tel:${s.phone_international || '+38630654002'}`} className="text-accent-dark underline">{phone}</a></li>
            </ul>
          </section>

          <section className="pt-6 border-t border-line">
            <p className="text-xs text-muted">
              Ti SPU stopijo v veljavo z objavo na spletni strani in veljajo za vse nove
              rezervacije od tega dne dalje.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
