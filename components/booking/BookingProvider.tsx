'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import BookingModal from './BookingModal';
import type { Package, Extra } from '@/lib/queries';
import { trackBeginBooking, trackViewPackage } from '@/lib/analytics';

interface BookingContextValue {
  openBooking: (packageSlug?: string) => void;
  closeBooking: () => void;
}

const BookingContext = createContext<BookingContextValue | null>(null);

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBooking must be used within BookingProvider');
  return ctx;
}

interface Props {
  children: ReactNode;
  packages: Package[];
  extras: Extra[];
}

export default function BookingProvider({ children, packages, extras }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [initialPackageSlug, setInitialPackageSlug] = useState<string | undefined>();

  const openBooking = (slug?: string) => {
    setInitialPackageSlug(slug);
    setIsOpen(true);
    const pkg = slug ? packages.find((p) => p.slug === slug) : undefined;
    if (pkg) {
      trackViewPackage({ name: pkg.name, price: pkg.price });
    }
    trackBeginBooking(pkg ? { name: pkg.name, price: pkg.price } : undefined);
  };
  const closeBooking = () => setIsOpen(false);

  return (
    <BookingContext.Provider value={{ openBooking, closeBooking }}>
      {children}
      <BookingModal
        isOpen={isOpen}
        onClose={closeBooking}
        packages={packages}
        extras={extras}
        initialPackageSlug={initialPackageSlug}
      />
    </BookingContext.Provider>
  );
}
