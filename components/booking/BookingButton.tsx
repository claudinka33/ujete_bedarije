'use client';

import { useBooking } from './BookingProvider';

interface Props {
  packageSlug?: string;
  className?: string;
  children: React.ReactNode;
}

export default function BookingButton({ packageSlug, className, children }: Props) {
  const { openBooking } = useBooking();
  return (
    <button
      type="button"
      onClick={() => openBooking(packageSlug)}
      className={className}
    >
      {children}
    </button>
  );
}
