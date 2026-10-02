import { Mail, Send, FileText, CheckCircle2, XCircle } from 'lucide-react';
import { unstable_noStore as noStore } from 'next/cache';
import MailTestForm from './MailTestForm';
import TemplatePreview from './TemplatePreview';

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-3">
          <Mail size={28} /> Email testiranje
        </h1>
        <p className="text-ink-soft">
          Preveri konfiguracijo, pošlji test mail, in si oglej predloge, ki jih bodo stranke prejele.
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
                ? 'Resend API ključ je dodan v Vercel env vars.'
                : 'Dodaj RESEND_API_KEY v Vercel → Settings → Environment Variables, potem Redeploy.'
            }
          />
          <ConfigRow label="MAIL_FROM" value={config.mailFrom} ok={true}
            hint="Pošiljateljev naslov (mora biti verificiran v Resendu)." />
          <ConfigRow label="MAIL_REPLY_TO" value={config.mailReplyTo} ok={true}
            hint="Kam se bodo odgovori strank preusmerili." />
          <ConfigRow
            label="STAFF_NOTIFY_EMAILS"
            value={config.staffEmails.join(', ')}
            ok={config.staffEmails.length > 0}
            hint="Komu se pošlje notifikacija ob novi rezervaciji."
          />
        </div>
      </div>

      {/* SEND TEST */}
      <div className="bg-surface border border-line rounded-lg p-5">
        <h2 className="font-semibold text-lg mb-1 flex items-center gap-2">
          <Send size={16} /> Pošlji testni mail
        </h2>
        <p className="text-sm text-ink-soft mb-4">
          Pošlje preprost testni mail — da potrdiš, da Resend + domena delata, preden odvisimo
          rezervacije od tega.
        </p>
        <MailTestForm resendConfigured={config.resendConfigured} defaultTo={config.mailReplyTo} />
      </div>

      {/* TEMPLATES */}
      <div className="bg-surface border border-line rounded-lg p-5">
        <h2 className="font-semibold text-lg mb-1 flex items-center gap-2">
          <FileText size={16} /> Predlogi mailov
        </h2>
        <p className="text-sm text-ink-soft mb-4">
          Trije maili, ki jih sistem avtomatsko pošlje. Preveri izgled, in po želji pošlji prave
          predloge na svoj email.
        </p>
        <TemplatePreview resendConfigured={config.resendConfigured} defaultTo={config.mailReplyTo} />
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
          <code className="text-xs bg-bg px-2 py-0.5 rounded border border-line">{label}</code>
          <span className={`text-sm ${ok ? 'text-ink' : 'text-red-700'}`}>{value}</span>
        </div>
        <p className="text-xs text-muted mt-1">{hint}</p>
      </div>
    </div>
  );
}
