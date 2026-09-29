'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { FaqItem } from '@/lib/queries';

interface Props {
  items: FaqItem[];
}

export default function FaqAccordion({ items }: Props) {
  const [openId, setOpenId] = useState<number | null>(null);

  return (
    <div className="max-w-3xl mx-auto space-y-3">
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div
            key={item.id}
            className="border border-line rounded-lg overflow-hidden bg-surface"
          >
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? null : item.id)}
              className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-bg transition-colors"
              aria-expanded={isOpen}
            >
              <span className="font-semibold text-ink pr-4">{item.question}</span>
              <ChevronDown
                size={20}
                className={`flex-shrink-0 text-muted transition-transform ${
                  isOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
            {isOpen && (
              <div className="px-5 pb-5 text-ink-soft leading-relaxed">
                <div className="border-t border-line pt-4">{item.answer}</div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
