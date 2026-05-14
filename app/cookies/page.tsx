import Link from "next/link";
import { ExternalLink, Info, ShieldCheck } from "lucide-react";
import { FaEdge } from "react-icons/fa6";
import {
  siGooglechrome,
  siFirefoxbrowser,
  siSafari,
  siOpera,
  type SimpleIcon,
} from "simple-icons";
import type { IconType } from "react-icons";

interface BrowserGuide {
  title: string;
  href: string;
  icon?: SimpleIcon;
  IconComponent?: IconType;
}

const BROWSER_GUIDES: BrowserGuide[] = [
  {
    title: "Microsoft Edge",
    IconComponent: FaEdge,
    href: "https://support.microsoft.com/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09",
  },
  {
    title: "Firefox",
    icon: siFirefoxbrowser,
    href: "https://support.mozilla.org/ru/kb/clear-cookies-and-site-data-firefox",
  },
  {
    title: "Chrome",
    icon: siGooglechrome,
    href: "https://support.google.com/chrome/answer/95647",
  },
  {
    title: "Safari",
    icon: siSafari,
    href: "https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac",
  },
  {
    title: "Opera",
    icon: siOpera,
    href: "https://help.opera.com/en/latest/web-preferences/#cookies",
  },
];

function BrowserIcon({
  icon,
  IconComponent,
}: {
  icon?: SimpleIcon;
  IconComponent?: IconType;
}) {
  return (
    <span className="inline-flex h-5 w-5 items-center justify-center overflow-hidden rounded-full bg-white">
      {icon ? (
        <svg
          viewBox="0 0 24 24"
          className="h-[14px] w-[14px]"
          aria-hidden="true"
          focusable="false"
        >
          <path d={icon.path} fill={`#${icon.hex}`} />
        </svg>
      ) : IconComponent ? (
        <IconComponent className="h-[14px] w-[14px] text-[#0a7bff]" />
      ) : (
        <span className="text-[10px] font-bold text-[#0a7bff]">E</span>
      )}
    </span>
  );
}

export default function CookiesPage() {
  return (
    <div className="min-h-screen py-8 sm:py-10">
      <div className="mx-auto w-full max-w-5xl px-3 sm:px-6">
        <div className="mb-5">
          <h1 className="text-2xl font-bold sm:text-3xl">
            <span className="bg-gradient-to-r from-[#fffffe] via-[#f9bc60] to-[#fffffe] bg-clip-text text-transparent">
              Использование файлов cookie
            </span>
          </h1>
          <p className="mt-2 text-sm text-[#abd1c6] sm:text-base">
            Прозрачно объясняем, зачем нужны cookie и как ими управлять.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[linear-gradient(165deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0.02)_100%)] shadow-[0_8px_32px_rgba(0,0,0,0.28)] backdrop-blur-xl">
          <div className="border-b border-[#abd1c6]/10 px-4 py-4 sm:px-6">
            <h2 className="text-xl font-semibold text-[#fffffe] sm:text-2xl">
              Как мы используем cookie
            </h2>
          </div>

          <div className="space-y-8 px-4 py-5 sm:px-6 sm:py-6">
            <div className="flex gap-3 rounded-xl border border-[#abd1c6]/20 bg-[#004643]/35 p-4">
              <Info className="mt-0.5 h-5 w-5 shrink-0 text-[#abd1c6]" />
              <p className="text-base leading-relaxed text-[#f0f0f0]">
                На этой странице объясняется, как файлы cookie используются на
                данном сайте. Если Вы продолжаете использовать этот сайт, Вы
                соглашаетесь на использование нами Ваших файлов cookie.
              </p>
            </div>

            <section className="space-y-3">
              <h3 className="text-2xl font-semibold text-[#fffffe]">
                Что такое файлы cookie?
              </h3>
              <p className="text-[1.15rem] leading-relaxed text-[#e9e9e9]">
                Файлы cookie представляют собой небольшие файлы, сохраняемые на
                Вашем устройстве браузером по требованию сайта. Они помогают
                запоминать важные детали: настройки интерфейса, язык и
                безопасные сессионные данные.
              </p>
              <p className="text-[1.15rem] leading-relaxed text-[#e9e9e9]">
                Cookie могут храниться короткое время (до закрытия вкладки) или
                дольше. Файлы cookie, установленные другими сайтами, не дают
                нашему сайту доступ к данным этих ресурсов.
              </p>
            </section>

            <section className="space-y-3 border-t border-[#abd1c6]/10 pt-6">
              <h3 className="text-2xl font-semibold text-[#fffffe]">
                Как мы используем cookie
              </h3>
              <ul className="space-y-2 text-[1.15rem] leading-relaxed text-[#e9e9e9]">
                <li>
                  — Технические cookie для стабильной работы сайта и сохранения
                  базовых настроек.
                </li>
                <li>
                  — Аналитические cookie, чтобы понимать поведение пользователей
                  и улучшать сервис.
                </li>
                <li>
                  — Функциональные cookie, чтобы не спрашивать одни и те же
                  действия повторно на каждой странице.
                </li>
              </ul>
            </section>

            <section className="space-y-4 border-t border-[#abd1c6]/10 pt-6">
              <div className="flex items-start gap-2">
                <ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-[#f9bc60]" />
                <h3 className="text-2xl font-semibold text-[#fffffe]">
                  Удаление или отключение cookie
                </h3>
              </div>
              <p className="text-[1.15rem] leading-relaxed text-[#e9e9e9]">
                Вы можете управлять cookie в настройках Вашего браузера. Ниже
                собраны официальные инструкции:
              </p>

              <div className="flex flex-wrap gap-2">
                {BROWSER_GUIDES.map((guide) => (
                  <a
                    key={guide.title}
                    href={guide.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group inline-flex items-center gap-2 rounded-xl border border-[#abd1c6]/20 bg-[#111315]/70 px-3 py-2 text-sm font-semibold text-[#fffffe] transition hover:-translate-y-0.5 hover:border-[#f9bc60]/60 hover:bg-[#1b2025]"
                  >
                    <BrowserIcon
                      icon={guide.icon}
                      IconComponent={guide.IconComponent}
                    />
                    {guide.title}
                    <ExternalLink className="h-3.5 w-3.5 text-[#abd1c6] transition group-hover:text-[#f9bc60]" />
                  </a>
                ))}
              </div>
            </section>
          </div>
        </div>

        <div className="mt-4">
          <Link
            href="/"
            className="text-sm text-[#abd1c6] underline underline-offset-4 transition hover:text-[#f9bc60]"
          >
            Вернуться на главную
          </Link>
        </div>
      </div>
    </div>
  );
}
