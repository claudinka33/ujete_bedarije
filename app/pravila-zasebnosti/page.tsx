import type { Metadata } from 'next';
import Link from 'next/link';
import { getSettings } from '@/lib/queries';
import { ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Pravila zasebnosti | Ujete Bedarije',
  description:
    'Politika zasebnosti podjetja Ujete Bedarije — kako obdelujemo vaše osebne podatke, ki jih pošljete preko rezervacijskega obrazca.',
  robots: { index: true, follow: true },
};

export default async function PrivacyPage() {
  const s = await getSettings();
  const company = s.company_name || 'Ujete Bedarije';
  const email = s.email || 'ujete.bedarije@gmail.com';
  const phone = s.phone || '030 654 002';

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
          Pravila zasebnosti
        </h1>
        <p className="text-sm text-muted mb-10">
          Zadnja posodobitev: {new Date().toLocaleDateString('sl-SI', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>

        <div className="prose prose-sm max-w-none space-y-6 text-ink-soft leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold text-ink mt-8 mb-3">1. Upravljavec podatkov</h2>
            <p>
              Upravljavec osebnih podatkov je <strong>{company}</strong>. Kontakt: {email}, telefon {phone}.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-ink mt-8 mb-3">2. Kateri podatki se zbirajo</h2>
            <p>
              Ko izpolnite obrazec za rezervacijo, zbiramo naslednje osebne podatke:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Ime in priimek</li>
              <li>Telefonska številka</li>
              <li>Elektronski naslov</li>
              <li>Podatki o dogodku (datum, lokacija, tip dogodka)</li>
              <li>Izbran paket in dodatne možnosti</li>
              <li>Morebitne opombe, ki jih vpišete v obrazec</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-ink mt-8 mb-3">3. Namen obdelave podatkov</h2>
            <p>
              Vaše osebne podatke uporabljamo izključno za:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Obdelavo vaše rezervacije photo booth storitve</li>
              <li>Kontaktiranje glede potrditve, sprememb ali odpovedi termina</li>
              <li>Izdajo računa in izpolnitev pogodbenih obveznosti</li>
              <li>Odgovor na vaše povpraševanje</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-ink mt-8 mb-3">4. Pravna podlaga</h2>
            <p>
              Obdelava temelji na vaši privolitvi (izpolnitev obrazca) in na izpolnitvi pogodbe o
              storitvi photo booth (17. člen GDPR, točka (a) in (b)).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-ink mt-8 mb-3">5. Deljenje podatkov</h2>
            <p>
              Vaših osebnih podatkov ne prodajamo, oddajamo ali delimo s tretjimi osebami — razen v
              nujnih primerih:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Neon (baza podatkov, EU regija Frankfurt) — hramba podatkov</li>
              <li>Vercel (gostovanje spletne strani, EU regija) — dostava strani</li>
              <li>Google (v primeru sinhronizacije koledarja z vašim soglasjem)</li>
            </ul>
            <p className="mt-3">Vsi obdelovalci imajo veljavne GDPR pogodbe (DPA).</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-ink mt-8 mb-3">6. Čas hrambe</h2>
            <p>
              Osebne podatke hranimo največ <strong>5 let</strong> po zaključku dogodka (za morebitne
              reklamacije in davčne obveznosti). Po izteku tega časa podatke izbrišemo.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-ink mt-8 mb-3">7. Vaše pravice</h2>
            <p>
              V skladu z GDPR imate naslednje pravice:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Pravica do dostopa do svojih osebnih podatkov</li>
              <li>Pravica do popravka netočnih ali nepopolnih podatkov</li>
              <li>Pravica do izbrisa (»pravica biti pozabljen«)</li>
              <li>Pravica do omejitve obdelave</li>
              <li>Pravica do prenosljivosti podatkov</li>
              <li>Pravica do ugovora obdelavi</li>
              <li>Pravica do preklica soglasja kadarkoli</li>
              <li>Pravica do pritožbe pri nadzornem organu (Informacijski pooblaščenec RS)</li>
            </ul>
            <p className="mt-3">
              Za uveljavljanje pravic nam pišite na <a href={`mailto:${email}`} className="text-accent-dark underline">{email}</a>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-ink mt-8 mb-3">8. Piškotki</h2>
            <p>
              Spletna stran uporablja samo tehnične piškotke, ki so nujno potrebni za delovanje strani
              (npr. spomin izbir v obrazcu). Ne uporabljamo tretjih tržnih piškotkov.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-ink mt-8 mb-3">9. Varnost</h2>
            <p>
              Osebne podatke ščitimo s tehničnimi in organizacijskimi ukrepi:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>SSL/TLS šifriranje pri prenosu podatkov</li>
              <li>Šifriranje podatkov v mirovanju v bazi</li>
              <li>Omejen dostop samo za pooblaščene osebe</li>
              <li>Redne varnostne kopije</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-ink mt-8 mb-3">10. Spremembe pravil</h2>
            <p>
              Pridržujemo si pravico do posodabljanja teh pravil. Vse spremembe bomo objavili na tej
              strani z datumom posodobitve.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-ink mt-8 mb-3">11. Kontakt</h2>
            <p>
              Za vsa vprašanja glede zasebnosti nam pišite:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>E-pošta: <a href={`mailto:${email}`} className="text-accent-dark underline">{email}</a></li>
              <li>Telefon: <a href={`tel:${s.phone_international || '+38630654002'}`} className="text-accent-dark underline">{phone}</a></li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
