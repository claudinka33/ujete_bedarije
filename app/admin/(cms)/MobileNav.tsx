'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Menu, X, LogOut, type LucideIcon } from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

interface Props {
  nav: NavItem[];
  user: { name?: string | null; email?: string | null; role?: string };
  initial: string;
  signOutAction: () => Promise<void>;
}

export default function MobileNav({ nav, user, initial, signOutAction }: Props) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close drawer whenever the user navigates
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll while drawer open
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
            {/* Drawer header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-line">
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo-sm.png"
                  alt="Ujete Bedarije"
                  width={32}
                  height={32}
                  className="w-8 h-8 object-contain"
                />
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

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
              {nav.map((item) => {
                const Icon = item.icon;
                const active =
                  item.href === '/admin'
                    ? pathname === '/admin'
                    : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm transition-colors ${
                      active
                        ? 'bg-ink text-bg font-semibold'
                        : 'text-ink-soft hover:bg-bg hover:text-ink'
                    }`}
                  >
                    <Icon size={16} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* User + logout */}
            <div className="border-t border-line p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-accent text-ink flex items-center justify-center font-semibold text-sm flex-shrink-0">
                  {initial}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold truncate">
                    {user.name || user.email}
                  </div>
                  <div className="text-xs text-muted truncate">
                    {user.role || 'staff'}
                  </div>
                </div>
              </div>
              <form action={signOutAction}>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded text-sm text-ink-soft border border-line hover:border-accent transition-colors"
                >
                  <LogOut size={14} />
                  Odjava
                </button>
              </form>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
