"use client";

import Link from "next/link";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { TelegramIcon } from "@/components/ui/icons/TelegramIcon";
import { StoryAdInfoBanner } from "../sections/StoryAdInfoBanner";
import type { MainAction } from "./utils";

interface AdLandingCtaCardProps {
  mainAction: MainAction | null;
  websiteUrl: string | null;
  telegramUrl: string | null;
}

export default function AdLandingCtaCard({
  mainAction,
  websiteUrl,
  telegramUrl,
}: AdLandingCtaCardProps) {
  return (
    <aside className="lg:sticky lg:top-24">
      <div className="rounded-3xl border border-[#abd1c6]/28 bg-gradient-to-br from-[#001e1d]/84 via-[#003f3b]/46 to-[#002724]/42 p-5 shadow-[0_24px_62px_-42px_rgba(0,0,0,0.62)]">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-2xl bg-[#abd1c6]/12 border border-[#abd1c6]/28 flex items-center justify-center">
            <LucideIcons.Target size="sm" className="text-[#abd1c6]" />
          </div>
          <div className="min-w-0">
            <div className="text-sm sm:text-base font-extrabold text-[#fffffe] leading-tight line-clamp-2 break-words">
              {mainAction
                ? "Перейти к предложению"
                : "Открыть страницу размещения"}
            </div>
          </div>
        </div>

        <div className="grid gap-3">
          {mainAction ? (
            <a
              href={mainAction.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-full inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-4 font-extrabold transition-all duration-200 hover:-translate-y-0.5 ${
                mainAction.type === "telegram"
                  ? "bg-gradient-to-r from-[#2AABEE] to-[#229ED9] text-white shadow-[0_12px_36px_rgba(42,171,238,0.35)] hover:shadow-[0_16px_44px_rgba(42,171,238,0.45)]"
                  : "bg-gradient-to-r from-[#f9bc60] to-[#e8a545] text-[#001e1d] shadow-[0_12px_36px_rgba(249,188,96,0.35)] hover:shadow-[0_16px_44px_rgba(249,188,96,0.45)]"
              }`}
            >
              {mainAction.type === "telegram" ? (
                <TelegramIcon className="w-5 h-5" />
              ) : (
                <LucideIcons.ExternalLink size="md" />
              )}
              {mainAction.type === "telegram"
                ? "Открыть Telegram"
                : "Перейти на сайт"}
            </a>
          ) : (
            <Link
              href="/advertising"
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#f9bc60] to-[#e8a545] px-5 py-4 text-[#001e1d] font-extrabold shadow-[0_12px_36px_rgba(249,188,96,0.35)] transition-all duration-200 hover:shadow-[0_16px_44px_rgba(249,188,96,0.45)] hover:-translate-y-0.5"
            >
              <LucideIcons.Megaphone size="md" />
              Разместить рекламу
            </Link>
          )}

          <Link
            href="/advertising"
            className="w-full inline-flex items-center justify-center gap-2 rounded-2xl border border-[#abd1c6]/32 bg-[#001e1d]/40 px-5 py-4 text-[#d7eee6] font-semibold transition-all duration-200 hover:border-[#abd1c6]/55 hover:bg-[#0a3432] hover:text-[#fffffe]"
          >
            <LucideIcons.Plus size="md" />
            Разместить свою рекламу
          </Link>

          {(websiteUrl || telegramUrl) && (
            <div className="grid grid-cols-1 gap-2">
              {websiteUrl && mainAction?.type !== "website" && (
                <a
                  href={websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-[#abd1c6]/20 bg-[#001e1d]/30 px-4 py-3 text-sm font-semibold text-[#abd1c6] transition-all duration-200 hover:border-[#abd1c6]/45 hover:text-[#fffffe]"
                >
                  <LucideIcons.ExternalLink size="sm" />
                  Сайт
                </a>
              )}
              {telegramUrl && mainAction?.type !== "telegram" && (
                <a
                  href={telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-[#2AABEE]/35 bg-[#2AABEE]/15 px-4 py-3 text-sm font-semibold text-[#7fd4ff] transition-all duration-200 hover:border-[#2AABEE]/55 hover:bg-[#2AABEE]/20 hover:text-white"
                >
                  <TelegramIcon className="w-4 h-4" />
                  Telegram
                </a>
              )}
            </div>
          )}
        </div>
        {!mainAction && (
          <div className="mt-5">
            <StoryAdInfoBanner />
          </div>
        )}
      </div>
    </aside>
  );
}
