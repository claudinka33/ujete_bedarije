import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const body = (await request.json()) as { to: string; subject: string; body: string };
    if (!body.to || !body.subject) {
      return NextResponse.json({ error: 'Manjka prejemnik ali zadeva' }, { status: 400 });
    }

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: 'RESEND_API_KEY ni nastavljen v Vercelu. Mail ni poslan.' },
        { status: 503 }
      );
    }

    const { Resend } = await import('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);
    const html = `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:560px;margin:0 auto;padding:20px;color:#1c1a17;">
        <h2>Testni mail iz CMS</h2>
        <p>${body.body.replace(/\n/g, '<br>')}</p>
        <hr style="border:none;border-top:1px solid #ece6dc;margin:20px 0;">
        <p style="font-size:12px;color:#8a7f70;">
          Poslal: ${session.user.email}<br>
          Preko: ujetebedarije.si/admin/mail<br>
          ${new Date().toLocaleString('sl-SI', { timeZone: 'Europe/Ljubljana' })}
        </p>
      </div>
    `;

    const { data, error } = await resend.emails.send({
      from: process.env.MAIL_FROM || 'Ujete Bedarije <rezervacije@ujetebedarije.si>',
      to: body.to,
      subject: body.subject,
      html,
      replyTo: process.env.MAIL_REPLY_TO || session.user.email,
    });

    if (error) {
      console.error('[mail-test] Resend error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, id: data?.id });
  } catch (err) {
    console.error('[mail-test] Exception:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Server error' },
      { status: 500 }
    );
  }
}
