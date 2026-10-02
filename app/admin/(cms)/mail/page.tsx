import { Mail, FileText, CheckCircle2, XCircle } from 'lucide-react';
import { unstable_noStore as noStore } from 'next/cache';
import { getMailTemplates } from '@/lib/mail';
import TemplateEditor from './TemplateEditor';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function MailPage() {
  noStore();

  const config = {
    resendConfigured: Boolean(process.env.RESEND_API_KEY),
    mailFrom: process.env.MAIL_FROM || 'Ujete Bedarije <rezervacije@ujetebedarije.si>',
    mailReplyTo: process.env.MAIL_REPLY_TO || 'ujete.bedarije@gmail.com',
    staffEmails: (process.env.STAFF_NOTIFY_EMAILS ||
      'szekar14@gmail.com,stanislavzekar@gmail.com')
      .split(',').map((e) => e.trim()).filter(Boolean),
  };

  const templates = await getMailTemplates();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-3">
          <Mail size={28} /> Email obvestila
        </h1>
        <p className="text-ink-soft">
          Uredi besedila mailov, ki jih sistem avtomatsko pošlje stranki in osebju.
        </p>
      </div>

      {/* CONFIG STATUS */}
      <div className="bg-surface border border-line rounded-lg p-5">
        <h2 className="font-semibold text-lg mb-4">Konfiguracija</h2>
        <div className="space-y-3 text-sm">
          <ConfigRow
            label="RESEND_API_KEY"
            value={config.resendConfigured ? '✓ nastavljen' : '✗ manjka'}
            ok={config.resendConfigured}
            hint={
              config.resendConfigured
                ? 'Resend povezava deluje.'
                : 'Dodaj RESEND_API_KEY v Vercel env vars, potem Redeploy.'
            }
          />
          <ConfigRow label="Pošiljatelj" value={config.mailFrom} ok={true}
            hint="S katerega naslova se pošljejo maili." />
          <ConfigRow label="Odgovori na" value={config.mailReplyTo} ok={true}
            hint="Kam gredo odgovori strank." />
          <ConfigRow
            label="Osebje obvestil"
            value={config.staffEmails.join(', ')}
            ok={config.staffEmails.length > 0}
            hint="Kdo prejme obvestilo o novi rezervaciji."
          />
        </div>
      </div>

      {/* TEMPLATE EDITORS */}
      <div className="bg-surface border border-line rounded-lg p-5">
        <h2 className="font-semibold text-lg flex items-center gap-2 mb-1">
          <FileText size={16} /> Besedila mailov
        </h2>
        <p className="text-sm text-ink-soft mb-4">
          Spremeni naslov in besedilo za vsakega od treh avtomatskih mailov.
          Uporabi oznake kot <code className="bg-bg px-1 rounded border border-line text-xs">{'{{ime}}'}</code>,{' '}
          <code className="bg-bg px-1 rounded border border-line text-xs">{'{{datum}}'}</code>, itd. —
          sistem jih bo pri pošiljanju zamenjal s pravimi podatki stranke.
        </p>

        <TemplateEditor initialTemplates={templates} defaultTestEmail={config.mailReplyTo} resendConfigured={config.resendConfigured} />
      </div>
    </div>
  );
}

function ConfigRow({
  label, value, ok, hint,
}: {
  label: string; value: string; ok: boolean; hint: string;
}) {
  return (
    <div className="flex flex-wrap items-start gap-3 pb-3 border-b border-line last:border-b-0 last:pb-0">
      <div className="flex-shrink-0 mt-0.5">
        {ok ? (
          <CheckCircle2 size={16} className="text-green-600" />
        ) : (
          <XCircle size={16} className="text-red-600" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-3 flex-wrap">
          <span className="text-sm font-semibold text-ink">{label}</span>
          <span className={`text-sm ${ok ? 'text-ink-soft' : 'text-red-700'}`}>{value}</span>
        </div>
        <p className="text-xs text-muted mt-1">{hint}</p>
      </div>
    </div>
  );
}
