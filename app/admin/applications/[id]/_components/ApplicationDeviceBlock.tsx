'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { statusRu } from '@/lib/status';
import { formatDeviceFingerprintShort } from '@/lib/deviceFingerprint/validate';
import { filterOtherUserApplicationRefs } from '@/lib/admin/filterOtherUserApplicationRefs';
import type { SameApplicationRef } from '../types';

interface ApplicationDeviceBlockProps {
  deviceFingerprint: string | null | undefined;
  clientDevice?: string | null;
  sameDeviceApplications?: SameApplicationRef[];
  currentUserId: string;
}

const CLIENT_DEVICE_LABELS: Record<string, string> = {
  desktop: 'Компьютер',
  android: 'Android',
  ios: 'iOS',
  other: 'Другое',
};

export default function ApplicationDeviceBlock({
  deviceFingerprint,
  clientDevice,
  sameDeviceApplications = [],
  currentUserId,
}: ApplicationDeviceBlockProps) {
  const hasFingerprint = Boolean(deviceFingerprint?.trim());
  const otherUserApps = filterOtherUserApplicationRefs(
    sameDeviceApplications,
    currentUserId,
  );
  const sameAuthorApps = sameDeviceApplications.filter(
    (app) => app.user.id === currentUserId,
  );
  const hasOtherUsers = otherUserApps.length > 0;
  const hasSameAuthor = sameAuthorApps.length > 0;

  if (!hasFingerprint && !hasOtherUsers && !hasSameAuthor) return null;

  const deviceLabel =
    clientDevice && CLIENT_DEVICE_LABELS[clientDevice]
      ? CLIENT_DEVICE_LABELS[clientDevice]
      : clientDevice || '—';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mb-0 min-w-0"
    >
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-3 sm:p-4 min-w-0 overflow-hidden">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-3">
          <div>
            <h3 className="text-sm font-semibold flex items-center gap-2 text-[#e5e7eb]">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#004643]/80 text-xs">
                📱
              </span>
              Отпечаток устройства
            </h3>
            <p className="font-mono text-sm break-all mt-1 text-[#e8f2ef]">
              {hasFingerprint
                ? formatDeviceFingerprintShort(deviceFingerprint)
                : 'Не передан (старая заявка)'}
            </p>
            <p className="text-xs mt-1 text-[#94a1b2]">
              Тип: {deviceLabel}
            </p>
          </div>

          <div className="inline-flex flex-wrap gap-2 mt-1 sm:mt-0">
            {hasOtherUsers ? (
              <span className="inline-flex items-center rounded-full border border-amber-400/40 bg-amber-500/15 px-3 py-1 text-xs font-semibold text-amber-200">
                Чужие аккаунты: {otherUserApps.length}
              </span>
            ) : hasFingerprint ? (
              <span className="inline-flex items-center rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                Чужих аккаунтов нет
              </span>
            ) : null}
          </div>
        </div>

        {hasOtherUsers ? (
          <div className="space-y-2">
            <p className="text-xs text-[#abd1c6]/80">
              С этого устройства подавали заявки другие аккаунты:
            </p>
            <ul className="space-y-2">
              {otherUserApps.map((app) => (
                <li
                  key={app.id}
                  className="flex flex-wrap items-center gap-2 text-xs sm:text-sm"
                >
                  <Link
                    href={`/profile/${app.user.id}`}
                    className="font-semibold text-[#f9bc60] hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {app.user.name || app.user.email || app.user.id}
                  </Link>
                  <Link
                    href={`/admin/applications/${app.id}`}
                    className="text-[#abd1c6] hover:text-[#fffffe] underline underline-offset-2"
                  >
                    {app.title || 'Заявка'}
                  </Link>
                  {app.status ? (
                    <span className="text-[#abd1c6]/70">
                      ({statusRu[app.status]})
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {hasSameAuthor ? (
          <p className="mt-3 text-xs text-[#94a1b2] border-t border-white/10 pt-3">
            У этого же автора ещё {sameAuthorApps.length}{' '}
            {sameAuthorApps.length === 1 ? 'заявка' : 'заявки'} с того же
            устройства — это не мультиаккаунт.
          </p>
        ) : null}
      </div>
    </motion.div>
  );
}
