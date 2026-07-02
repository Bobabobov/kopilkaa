'use client';

import { ProfileImageIcon } from '@/components/profile/ProfileImageIcon';
import { LucideIcons } from '@/components/ui/LucideIcons';
import { cn } from '@/lib/utils';
import type { ComponentType } from 'react';

interface ProfileSectionTitleProps {
  icon?: keyof typeof LucideIcons;
  imageSrc?: string;
  imageAlt?: string;
  title: string;
  subtitle?: string;
  className?: string;
}

export function ProfileSectionTitle({
  icon: iconKey,
  imageSrc,
  imageAlt = '',
  title,
  subtitle,
  className,
}: ProfileSectionTitleProps) {
  const Icon = iconKey
    ? (LucideIcons[iconKey] as ComponentType<{ className?: string }> | undefined)
    : undefined;

  return (
    <div className={cn('mb-4 flex items-center gap-2.5 sm:gap-3', className)}>
      {imageSrc ? (
        <ProfileImageIcon src={imageSrc} alt={imageAlt} size="md" />
      ) : Icon ? (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
          <Icon className="h-4 w-4" />
        </div>
      ) : null}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wide text-emerald-400">
          {title}
        </h3>
        {subtitle ? (
          <p className="mt-0.5 text-xs leading-relaxed text-zinc-400">{subtitle}</p>
        ) : null}
      </div>
    </div>
  );
}
