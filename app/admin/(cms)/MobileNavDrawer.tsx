'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

interface Props {
  navItems: Array<{ href: string; label: string }>;
  userLabel: string;
  role: string;
  initial: string;
}

/**
 * Mobile-only hamburger + drawer. Lives inside the admin layout.
 * Server actions aren't passed as props; sign-out happens via a plain
 * form POST to the Next.js auth endpoint by the client, since this
 * component can't call a server action without one in scope.
 */
export default function MobileNavDrawer({
  navItems, userLabel, role, initial,
}: Props) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    const esc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', esc);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', esc);
    };
  }, [open]);

  const signOut = async () => {
    // Hit the NextAuth sign-out endpoint directly
    await fetch('/api/auth/signout', { method: 'POST' });
    router.push('/');
    router.refresh();
  };

  return (
    <>
      {/* TOP BAR (mobile only) */}
      <header className="md:hidden sticky top-0 z-30 bg-surface border-b border-line">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/admin" className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-sm.png"
              alt="Ujete Bedarije"
              width={32}
              height={32}
              className="w-8 h-8 object-contain"
            />
            <div className="font-bold text-sm">CMS</div>
          </Link>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="p-2 rounded-lg hover:bg-bg -mr-2"
            aria-label="Odpri meni"
          >
            <Menu size={22} />
          </button>
        </div>
      </header>

      {/* DRAWER */}
      {open && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <aside
            className="absolute top-0 right-0 bottom-0 w-72 max-w-[85vw] bg-surface shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-line">
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo-sm.png" alt="" width={32} height={32} className="w-8 h-8 object-contain" />
                <div>
                  <div className="font-bold text-sm">Ujete Bedarije</div>
                  <div className="text-xs text-muted">CMS</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-2 rounded-lg hover:bg-bg -mr-2"
                aria-label="Zapri meni"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
              {navItems.map((item) => {
                const active =
                  item.href === '/admin'
                    ? pathname === '/admin'
                    : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block px-3 py-3 rounded-lg text-sm transition-colors ${
                      active
                        ? 'bg-ink text-bg font-semibold'
                        : 'text-ink-soft hover:bg-bg hover:text-ink'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="border-t border-line p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-accent text-ink flex items-center justify-center font-semibold text-sm flex-shrink-0">
                  {initial}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold truncate">{userLabel}</div>
                  <div className="text-xs text-muted truncate">{role}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={signOut}
                className="w-full px-3 py-2.5 rounded text-sm text-ink-soft border border-line hover:border-accent transition-colors"
              >
                Odjava
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
