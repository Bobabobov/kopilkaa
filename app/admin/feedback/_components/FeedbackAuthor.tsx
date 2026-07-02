'use client';

import Link from 'next/link';
import { ExternalLink, Mail, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { resolveAvatarUrl } from '@/lib/avatar';
import { buildUploadUrl } from '@/lib/uploads/url';
import { cn } from '@/lib/utils';

export interface FeedbackAuthorUser {
  id: string;
  name: string | null;
  username: string | null;
  email: string | null;
  avatar: string | null;
}

interface FeedbackAuthorProps {
  user: FeedbackAuthorUser | null;
  createdAt: string;
  className?: string;
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat('ru-RU', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function getDisplayName(user: FeedbackAuthorUser | null): string {
  if (!user) return 'Гость';
  return user.name || user.username || user.email || 'Пользователь';
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ''}${parts[1][0] ?? ''}`.toUpperCase();
}

export function FeedbackAuthor({
  user,
  createdAt,
  className,
}: FeedbackAuthorProps) {
  const displayName = getDisplayName(user);
  const profileHref = user?.id ? `/profile/${user.id}` : null;
  const avatarSrc = user?.avatar
    ? buildUploadUrl(resolveAvatarUrl(user.avatar), { variant: 'thumb' })
    : resolveAvatarUrl(null);

  return (
    <div
      className={cn(
        'flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between',
        className,
      )}
    >
      <div className='flex min-w-0 items-center gap-3'>
        {profileHref ? (
          <Link
            href={profileHref}
            target='_blank'
            rel='noopener noreferrer'
            className='group shrink-0'
            title='Открыть профиль'
          >
            <Avatar className='h-12 w-12 border-2 border-[#abd1c6]/30 ring-2 ring-[#001e1d] transition group-hover:border-[#f9bc60]/50 sm:h-14 sm:w-14'>
              <AvatarImage src={avatarSrc} alt={displayName} />
              <AvatarFallback className='bg-[#abd1c6]/12 text-sm font-semibold text-[#abd1c6]'>
                {getInitials(displayName)}
              </AvatarFallback>
            </Avatar>
          </Link>
        ) : (
          <Avatar className='h-12 w-12 shrink-0 border-2 border-[#abd1c6]/20 sm:h-14 sm:w-14'>
            <AvatarFallback className='bg-[#abd1c6]/10 text-[#abd1c6]'>
              <User className='h-5 w-5' aria-hidden />
            </AvatarFallback>
          </Avatar>
        )}

        <div className='min-w-0'>
          {profileHref ? (
            <Link
              href={profileHref}
              target='_blank'
              rel='noopener noreferrer'
              className='group inline-flex max-w-full items-center gap-1.5'
            >
              <span className='truncate text-base font-semibold text-[#fffffe] transition group-hover:text-[#f9bc60] sm:text-lg'>
                {displayName}
              </span>
              {user?.username ? (
                <span className='shrink-0 text-sm text-[#abd1c6]/75'>
                  @{user.username}
                </span>
              ) : null}
              <ExternalLink
                className='h-3.5 w-3.5 shrink-0 text-[#abd1c6]/50 opacity-0 transition group-hover:opacity-100'
                aria-hidden
              />
            </Link>
          ) : (
            <p className='text-base font-semibold text-[#fffffe] sm:text-lg'>
              {displayName}
            </p>
          )}

          {user?.email ? (
            <p className='mt-0.5 flex items-center gap-1.5 truncate text-xs text-[#abd1c6]/75 sm:text-sm'>
              <Mail className='h-3.5 w-3.5 shrink-0 opacity-70' aria-hidden />
              <span className='truncate'>{user.email}</span>
            </p>
          ) : null}

          <p className='mt-1 text-xs text-[#94a1b2]'>
            {formatDate(createdAt)}
          </p>
        </div>
      </div>

      {profileHref ? (
        <Button
          asChild
          variant='outline'
          size='sm'
          className='w-full shrink-0 rounded-xl border-[#abd1c6]/30 text-[#abd1c6] hover:border-[#f9bc60]/45 hover:bg-[#f9bc60]/10 hover:text-[#fffffe] sm:w-auto'
        >
          <Link
            href={profileHref}
            target='_blank'
            rel='noopener noreferrer'
            className='gap-1.5'
          >
            Профиль
            <ExternalLink className='h-3.5 w-3.5 opacity-80' aria-hidden />
          </Link>
        </Button>
      ) : null}
    </div>
  );
}
