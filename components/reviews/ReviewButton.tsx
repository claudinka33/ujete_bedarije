'use client';

import { useState } from 'react';
import { MessageSquarePlus } from 'lucide-react';
import ReviewForm from './ReviewForm';

interface Props {
  className?: string;
  children?: React.ReactNode;
}

export default function ReviewButton({ className, children }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={className || 'inline-flex items-center gap-2 px-5 py-3 rounded-full border border-line bg-surface text-sm font-semibold hover:border-accent transition-colors'}
      >
        {children || (
          <>
            <MessageSquarePlus size={16} />
            Oddaj mnenje
          </>
        )}
      </button>
      <ReviewForm isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
}
