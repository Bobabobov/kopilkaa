'use client';

import { FooterFeedbackLink } from '@/components/feedback/FooterFeedbackLink';
import { FooterLinkItem } from '@/components/layout/FooterLinkItem';

export default function FooterLinks() {
  const links = [
    {
      href: '/terms',
      label: 'Правила и политика',
      accent: 'teal' as const,
      icon: (
        <svg
          className='h-full w-full'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
          />
        </svg>
      ),
    },
    {
      href: '/advertising',
      label: 'Реклама на сайте',
      accent: 'amber' as const,
      icon: (
        <svg
          className='h-full w-full'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z'
          />
        </svg>
      ),
    },
  ];

  return (
    <div className='space-y-4'>
      <h3 className='text-lg font-bold text-[#fffffe]'>Полезные ссылки</h3>

      <div className='flex flex-col gap-2.5'>
        <FooterFeedbackLink accent='emerald' />
        {links.map((link) => (
          <FooterLinkItem
            key={link.href}
            href={link.href}
            label={link.label}
            icon={link.icon}
            accent={link.accent}
          />
        ))}
      </div>
    </div>
  );
}
