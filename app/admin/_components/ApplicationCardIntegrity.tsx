"use client";

import Link from "next/link";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { DEFAULT_AVATAR, resolveAvatarUrl } from "@/lib/avatar";
import type {
  ApplicationIntegrity,
  ApplicationIntegrityAccount,
  ApplicationIntegrityReason,
} from "@/types/admin";

interface ApplicationCardIntegrityProps {
  applicationId: string;
  integrity: ApplicationIntegrity | undefined;
}

function IntegrityAccountChip({
  account,
}: {
  account: ApplicationIntegrityAccount;
}) {
  const avatarUrl = resolveAvatarUrl(account.userAvatar);

  return (
    <Link
      href={`/profile/${account.userId}`}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 rounded-lg border border-[#abd1c6]/25 bg-[#001e1d]/60 px-2 py-1 text-xs font-semibold text-[#fffffe] transition-colors hover:border-[#f9bc60]/45 hover:bg-[#f9bc60]/10 hover:text-[#f9bc60]"
    >
      <img
        src={avatarUrl}
        alt=""
        className="h-6 w-6 rounded-full object-cover ring-1 ring-white/15"
        loading="lazy"
        onError={(e) => {
          e.currentTarget.src = DEFAULT_AVATAR;
        }}
      />
      <span className="max-w-[140px] truncate">{account.userLabel}</span>
    </Link>
  );
}

function LinkRow({
  link,
}: {
  link: ApplicationIntegrity["links"]["sameIp"][number];
}) {
  const avatarUrl = resolveAvatarUrl(link.userAvatar);

  return (
    <li className="flex flex-wrap items-center gap-2 text-xs sm:text-sm min-w-0">
      <Link
        href={`/profile/${link.userId}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 rounded-lg border border-[#abd1c6]/20 bg-[#001e1d]/50 px-2 py-1 transition-colors hover:border-[#f9bc60]/40 hover:text-[#f9bc60]"
      >
        <img
          src={avatarUrl}
          alt=""
          className="h-6 w-6 rounded-full object-cover ring-1 ring-white/15"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = DEFAULT_AVATAR;
          }}
        />
        <span className="font-semibold text-[#fffffe]">{link.userLabel}</span>
      </Link>

      {link.kind === "withdrawal" ? (
        <span className="text-[#abd1c6]/80">— вывод бонусов</span>
      ) : (
        <Link
          href={`/admin/applications/${link.id}`}
          className="text-[#abd1c6] hover:text-[#f9bc60] underline underline-offset-2 break-words min-w-0"
        >
          {link.title ? link.title : "Заявка"}
        </Link>
      )}
    </li>
  );
}

function ReasonRow({ reason }: { reason: ApplicationIntegrityReason }) {
  return (
    <li className="text-xs sm:text-sm leading-relaxed text-[#e9f4ef]/90">
      <div className="flex gap-1.5">
        <span className="text-[#abd1c6]/50 shrink-0">•</span>
        <span>{reason.message}</span>
      </div>
      {reason.accounts && reason.accounts.length > 0 ? (
        <div className="mt-2 ml-4 flex flex-wrap gap-1.5">
          {reason.accounts.map((account) => (
            <IntegrityAccountChip key={account.userId} account={account} />
          ))}
        </div>
      ) : null}
    </li>
  );
}

export function ApplicationCardIntegrity({
  applicationId,
  integrity,
}: ApplicationCardIntegrityProps) {
  if (!integrity) return null;

  const isClean = integrity.isClean;
  const hasLinks =
    integrity.links.sameIp.length > 0 ||
    integrity.links.samePayment.length > 0 ||
    integrity.links.sameDevice.length > 0;

  return (
    <div
      className={`mb-4 sm:mb-5 rounded-xl border p-3 sm:p-4 ${
        isClean
          ? "border-[#10B981]/30 bg-[#10B981]/8"
          : "border-[#e16162]/35 bg-[#e16162]/8"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg ${
            isClean
              ? "bg-[#10B981]/15 text-[#10B981]"
              : "bg-[#e16162]/15 text-[#e16162]"
          }`}
        >
          {isClean ? (
            <LucideIcons.Shield className="h-5 w-5" />
          ) : (
            <LucideIcons.AlertTriangle className="h-5 w-5" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`text-sm font-bold ${
                isClean ? "text-[#10B981]" : "text-[#e16162]"
              }`}
            >
              {integrity.verdict}
            </span>
            {integrity.submitterIp ? (
              <span className="text-[11px] text-[#abd1c6]/70 font-mono">
                IP: {integrity.submitterIp}
              </span>
            ) : (
              <span className="text-[11px] text-[#abd1c6]/50">
                IP не записан
              </span>
            )}
          </div>

          <ul className="mt-2 space-y-2">
            {integrity.reasons.map((reason) => (
              <ReasonRow key={reason.key} reason={reason} />
            ))}
          </ul>

          {hasLinks ? (
            <details className="mt-3 group">
              <summary className="cursor-pointer text-xs font-semibold text-[#f9bc60] hover:text-[#fffffe] list-none flex items-center gap-1">
                <LucideIcons.ChevronDown className="h-3.5 w-3.5 transition-transform group-open:rotate-180" />
                Подробнее о совпадениях
              </summary>
              <div className="mt-2 space-y-2 pl-1">
                {integrity.links.sameIp.length > 0 ? (
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wide text-[#abd1c6]/70 mb-1">
                      По IP ({integrity.sameIpCount})
                    </p>
                    <ul className="space-y-2">
                      {integrity.links.sameIp.map((link) => (
                        <LinkRow key={`ip-${link.id}`} link={link} />
                      ))}
                    </ul>
                  </div>
                ) : null}
                {integrity.links.samePayment.length > 0 ? (
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wide text-[#abd1c6]/70 mb-1">
                      По реквизитам ({integrity.samePaymentCount})
                    </p>
                    <ul className="space-y-2">
                      {integrity.links.samePayment.map((link) => (
                        <LinkRow
                          key={`pay-${link.kind}-${link.id}`}
                          link={link}
                        />
                      ))}
                    </ul>
                  </div>
                ) : null}
                {integrity.links.sameDevice.length > 0 ? (
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wide text-[#abd1c6]/70 mb-1">
                      По устройству ({integrity.sameDeviceCount})
                    </p>
                    <ul className="space-y-2">
                      {integrity.links.sameDevice.map((link) => (
                        <LinkRow key={`dev-${link.id}`} link={link} />
                      ))}
                    </ul>
                  </div>
                ) : null}
                <Link
                  href={`/admin/applications/${applicationId}`}
                  className="inline-flex items-center gap-1 text-xs text-[#abd1c6] hover:text-[#f9bc60] mt-1"
                >
                  Полная проверка на странице заявки
                  <LucideIcons.ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </details>
          ) : null}
        </div>
      </div>
    </div>
  );
}
