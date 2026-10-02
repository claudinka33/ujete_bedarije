import { auth } from '@/auth';
import Link from 'next/link';
import { LogOut, LayoutDashboard, Calendar, Package, Sliders, Images, MessageSquare, HelpCircle, Settings, Mail, Film } from 'lucide-react';
import { redirect } from 'next/navigation';
import MobileNav from './MobileNav';
import { signOutAction } from './actions';

export const dynamic = 'force-dynamic';

const NAV = [
  { href: '/admin', label: 'Nadzorna plošča', icon: LayoutDashboard },
  { href: '/admin/rezervacije', label: 'Rezervacije', icon: Calendar },
  { href: '/admin/paketi', label: 'Paketi', icon: Package },
  { href: '/admin/extras', label: 'Dodatne možnosti', icon: Sliders },
  { href: '/admin/hero', label: 'Hero kolaž', icon: Film },
  { href: '/admin/galerija', label: 'Galerija', icon: Images },
  { href: '/admin/mnenja', label: 'Mnenja', icon: MessageSquare },
  { href: '/admin/faq', label: 'FAQ', icon: HelpCircle },
  { href: '/admin/mail', label: 'Email', icon: Mail },
  { href: '/admin/nastavitve', label: 'Nastavitve', icon: Settings },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user?.email) {
    redirect('/admin/login');
  }

  const user = session.user;
  const initial = (user.name || user.email || '?')[0].toUpperCase();

  return (
    <div className="min-h-screen bg-bg">
      {/* MOBILE: top bar + hamburger drawer */}
      <MobileNav
        nav={NAV}
        user={{
          name: user.name,
          email: user.email,
          role: (user as { role?: string }).role,
        }}
        initial={initial}
      />

      <div className="flex flex-col md:flex-row">
        {/* DESKTOP sidebar — hidden on mobile */}
        <aside className="hidden md:flex md:w-64 md:min-h-screen bg-surface md:border-r border-line flex-col sticky top-0 md:self-start md:h-screen">
          <div className="p-6 flex-shrink-0">
            <Link href="/admin" className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo-sm.png"
                alt="Ujete Bedarije"
                width={40}
                height={40}
                className="w-10 h-10 object-contain"
              />
              <div>
                <div className="font-bold text-sm">Ujete Bedarije</div>
                <div className="text-xs text-muted">CMS</div>
              </div>
            </Link>
          </div>

          <nav className="flex-1 overflow-y-auto px-3 pb-6 space-y-1">
            {NAV.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-ink-soft hover:bg-bg hover:text-ink transition-colors"
                >
                  <Icon size={16} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* User + logout — pinned to bottom of sticky sidebar */}
          <div className="flex-shrink-0 border-t border-line p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-accent text-ink flex items-center justify-center font-semibold text-sm flex-shrink-0">
                {initial}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold truncate">
                  {user.name || user.email}
                </div>
                <div className="text-xs text-muted truncate">
                  {(user as { role?: string }).role || 'staff'}
                </div>
              </div>
            </div>
            <form action={signOutAction}>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded text-xs text-ink-soft border border-line hover:border-accent transition-colors"
              >
                <LogOut size={14} />
                Odjava
              </button>
            </form>
            {/* signOutAction is imported from ./actions — same server action
                used by MobileNav */}
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 min-w-0">
          <div className="p-4 md:p-10 max-w-6xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
