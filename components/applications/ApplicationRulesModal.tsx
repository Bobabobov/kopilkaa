"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { cn } from "@/lib/utils";

type ApplicationRulesModalProps = {
  open: boolean;
  onClose: () => void;
};

type RulesTab = "how" | "allowed" | "forbidden" | "reports";

const TABS: {
  id: RulesTab;
  label: string;
  title: string;
  subtitle: string;
  Icon: typeof LucideIcons.Edit3;
}[] = [
  {
    id: "how",
    label: "Как",
    title: "Как подать заявку",
    subtitle: "Четыре шага от входа до отчёта",
    Icon: LucideIcons.ClipboardList,
  },
  {
    id: "allowed",
    label: "Можно",
    title: "Что можно",
    subtitle: "Ситуации, с которыми Копилка помогает",
    Icon: LucideIcons.CheckCircle2,
  },
  {
    id: "forbidden",
    label: "Нельзя",
    title: "Что нельзя",
    subtitle: "Заявки, которые не одобряются",
    Icon: LucideIcons.AlertTriangle,
  },
  {
    id: "reports",
    label: "Отчёты",
    title: "Отчёты",
    subtitle: "Правила после одобренной помощи",
    Icon: LucideIcons.Camera,
  },
];

const HOW_STEPS = [
  {
    title: "Войти",
    hint: "Нужен аккаунт на платформе",
    Icon: LucideIcons.User,
  },
  {
    title: "Форма",
    hint: "Ситуация, сумма и фото",
    Icon: LucideIcons.Edit3,
  },
  {
    title: "Отправка",
    hint: "Ждёте решения админа",
    Icon: LucideIcons.Send,
  },
  {
    title: "Отчёт",
    hint: "После одобрения — фото результата",
    Icon: LucideIcons.Image,
  },
] as const;

const ALLOWED = [
  {
    title: "Еда и напитки",
    hint: "Продукты, перекус, вода, чай",
    Icon: LucideIcons.Coins,
  },
  {
    title: "Бытовые мелочи",
    hint: "Базовые вещи первой необходимости",
    Icon: LucideIcons.Home,
  },
  {
    title: "Проезд и связь",
    hint: "Транспорт, интернет, мелкие траты",
    Icon: LucideIcons.Smartphone,
  },
  {
    title: "Небольшой подарок",
    hint: "Скромный подарок без крупных затрат",
    Icon: LucideIcons.Gift,
  },
  {
    title: "Обычная жизненная ситуация",
    hint: "Небольшая помощь без обязательств",
    Icon: LucideIcons.Heart,
  },
] as const;

const FORBIDDEN = [
  {
    title: "Кредиты, займы и МФО",
    hint: "Банки, рассрочки и «деньги до зарплаты»",
    Icon: LucideIcons.CreditCard,
    important: true,
  },
  {
    title: "Долги и коллекторы",
    hint: "Штрафы, пени и работа с коллекторами",
    Icon: LucideIcons.AlertCircle,
  },
  {
    title: "Лечение и лекарства",
    hint: "Медицина, анализы и препараты",
    Icon: LucideIcons.TestTube,
  },
  {
    title: "Дробление одной цели на много заявок",
    hint: "Одна цель — одна заявка",
    Icon: LucideIcons.Copy,
    important: true,
  },
] as const;

function RuleRow({
  icon,
  title,
  hint,
  accent = "gold",
  badge,
}: {
  icon: React.ReactNode;
  title: string;
  hint: string;
  accent?: "gold" | "green" | "red";
  badge?: string;
}) {
  const accentBar = {
    gold: "bg-[#f9bc60]",
    green: "bg-[#6ee7b7]",
    red: "bg-[#e16162]",
  }[accent];

  return (
    <li className="flex gap-3 rounded-xl border border-white/[0.1] bg-white/[0.03] px-3 py-3">
      <span
        className={cn("mt-1 w-1 shrink-0 self-stretch rounded-full", accentBar)}
        aria-hidden
      />
      <div className="flex min-w-0 flex-1 gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#001e1d]/50 text-[#abd1c6]">
          {icon}
        </span>
        <div className="min-w-0">
          <p className="flex flex-wrap items-center gap-1.5 text-sm font-semibold text-[#fffffe]">
            {badge && (
              <span className="rounded-md bg-[#e16162]/20 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#ffc9c2]">
                {badge}
              </span>
            )}
            {title}
          </p>
          <p className="mt-0.5 text-xs leading-relaxed text-[#abd1c6]/85">
            {hint}
          </p>
        </div>
      </div>
    </li>
  );
}

export function ApplicationRulesModal({
  open,
  onClose,
}: ApplicationRulesModalProps) {
  const [tab, setTab] = useState<RulesTab>("how");
  const isBrowser = typeof window !== "undefined";
  const activeMeta = TABS.find((item) => item.id === tab) ?? TABS[0];

  useEffect(() => {
    if (open) setTab("how");
  }, [open]);

  useEffect(() => {
    if (!open || !isBrowser) return;

    const scrollY = window.scrollY;
    const originalOverflow = document.body.style.overflow;
    const originalPosition = document.body.style.position;
    const originalTop = document.body.style.top;
    const originalWidth = document.body.style.width;
    const originalHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    document.documentElement.style.overflow = "hidden";
    document.body.dataset.rulesModalOpen = "1";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = originalOverflow;
      document.body.style.position = originalPosition;
      document.body.style.top = originalTop;
      document.body.style.width = originalWidth;
      document.documentElement.style.overflow = originalHtmlOverflow;
      delete document.body.dataset.rulesModalOpen;
      window.scrollTo(0, scrollY);
    };
  }, [open, onClose, isBrowser]);

  if (!isBrowser) return null;

  const modal = (
    <AnimatePresence mode="wait">
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[110] flex items-end justify-center sm:items-center sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="application-rules-title"
        >
          <button
            type="button"
            className="absolute inset-0 bg-[#001e1d]/75 backdrop-blur-[2px] sm:backdrop-blur-sm"
            aria-label="Закрыть"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 28 }}
            transition={{ type: "spring", stiffness: 420, damping: 34 }}
            className={cn(
              "relative z-10 flex w-full max-w-lg flex-col overflow-hidden",
              "rounded-t-[24px] sm:rounded-2xl",
              "border border-white/[0.12] bg-[#004643]/96",
              "shadow-[0_-8px_40px_rgba(0,0,0,0.35)] sm:shadow-[0_24px_64px_rgba(0,0,0,0.45)]",
              "max-h-[min(90dvh,680px)]",
            )}
          >
            <div
              className="mx-auto mt-2.5 h-1 w-10 shrink-0 rounded-full bg-white/25 sm:hidden"
              aria-hidden
            />

            <div className="flex shrink-0 items-start justify-between gap-3 border-b border-white/[0.08] px-5 py-4 sm:px-6">
              <div>
                <h2
                  id="application-rules-title"
                  className="text-lg font-bold text-[#fffffe] sm:text-xl"
                >
                  Правила подачи заявки
                </h2>
                <p className="mt-1 text-sm text-[#abd1c6]/80">
                  Переключайте вкладки ниже
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl p-2 text-[#abd1c6] transition-colors hover:bg-white/10 hover:text-[#fffffe]"
                aria-label="Закрыть"
              >
                <LucideIcons.X size="sm" />
              </button>
            </div>

            <div className="shrink-0 px-5 pt-3 sm:px-6">
              <div
                className="relative grid grid-cols-4 gap-1 rounded-xl border border-white/[0.1] bg-[#001e1d]/40 p-1"
                role="tablist"
                aria-label="Разделы правил"
              >
                {TABS.map(({ id, label, Icon }) => {
                  const active = tab === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      aria-controls={`rules-panel-${id}`}
                      id={`rules-tab-${id}`}
                      onClick={() => setTab(id)}
                      className={cn(
                        "relative flex flex-col items-center justify-center gap-1 rounded-lg py-2.5 px-1",
                        "text-[11px] font-semibold transition-colors sm:text-xs",
                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f9bc60]/50",
                        active
                          ? "text-[#001e1d]"
                          : "text-[#abd1c6]/80 hover:text-[#fffffe]",
                      )}
                    >
                      {active && (
                        <motion.span
                          layoutId="rules-tab-pill"
                          className="absolute inset-0 rounded-lg bg-[#f9bc60] shadow-[0_2px_12px_rgba(249,188,96,0.35)]"
                          transition={{
                            type: "spring",
                            stiffness: 420,
                            damping: 32,
                          }}
                        />
                      )}
                      <Icon
                        size="xs"
                        className={cn(
                          "relative z-[1] stroke-[2.25]",
                          active ? "text-[#001e1d]" : "text-[#abd1c6]",
                        )}
                      />
                      <span className="relative z-[1] leading-none">
                        {label}
                      </span>
                    </button>
                  );
                })}
              </div>
              <p className="mt-2 flex items-center justify-center gap-1.5 text-[11px] text-[#abd1c6]/55">
                <LucideIcons.ChevronLeft size="xs" className="opacity-60" />
                нажмите вкладку, чтобы сменить раздел
                <LucideIcons.ChevronRight size="xs" className="opacity-60" />
              </p>
            </div>

            <div
              id={`rules-panel-${tab}`}
              role="tabpanel"
              aria-labelledby={`rules-tab-${tab}`}
              className="relative flex-1 overflow-y-auto overscroll-contain px-5 py-4 sm:px-6"
            >
              <div className="mb-3 rounded-xl border border-[#f9bc60]/20 bg-[#f9bc60]/[0.07] px-3.5 py-2.5">
                <p className="text-sm font-semibold text-[#f9bc60]">
                  {activeMeta.title}
                </p>
                <p className="mt-0.5 text-xs text-[#abd1c6]/85">
                  {activeMeta.subtitle}
                </p>
              </div>

              <AnimatePresence mode="wait">
                {tab === "how" && (
                  <motion.ul
                    key="how"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.16 }}
                    className="space-y-2"
                  >
                    {HOW_STEPS.map((step, index) => (
                      <RuleRow
                        key={step.title}
                        accent="gold"
                        title={`${index + 1}. ${step.title}`}
                        hint={step.hint}
                        icon={<step.Icon size="xs" />}
                      />
                    ))}
                  </motion.ul>
                )}

                {tab === "allowed" && (
                  <motion.ul
                    key="allowed"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.16 }}
                    className="space-y-2"
                  >
                    {ALLOWED.map((item) => (
                      <RuleRow
                        key={item.title}
                        accent="green"
                        title={item.title}
                        hint={item.hint}
                        icon={<item.Icon size="xs" />}
                      />
                    ))}
                  </motion.ul>
                )}

                {tab === "forbidden" && (
                  <motion.div
                    key="forbidden"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.16 }}
                    className="space-y-2"
                  >
                    <ul className="space-y-2">
                      {FORBIDDEN.map((item) => (
                        <RuleRow
                          key={item.title}
                          accent="red"
                          title={item.title}
                          hint={item.hint}
                          badge={
                            "important" in item && item.important
                              ? "Важно"
                              : undefined
                          }
                          icon={<item.Icon size="xs" />}
                        />
                      ))}
                    </ul>
                    <p className="px-1 text-[11px] text-[#abd1c6]/65">
                      Если сомневаетесь — уточните у поддержки до подачи.
                    </p>
                  </motion.div>
                )}

                {tab === "reports" && (
                  <motion.ul
                    key="reports"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.16 }}
                    className="space-y-2"
                  >
                    <RuleRow
                      accent="gold"
                      title="Первый отзыв с фото"
                      hint="После первой одобренной заявки — иначе следующую не подать"
                      icon={<LucideIcons.Camera size="xs" />}
                    />
                    <RuleRow
                      accent="gold"
                      title="Фото‑отчёт к новой заявке"
                      hint="К каждой новой заявке — короткий отчёт по прошлой одобренной помощи"
                      icon={<LucideIcons.Image size="xs" />}
                    />
                    <RuleRow
                      accent="gold"
                      title="Цикл участия"
                      hint="Заявка → решение → отчёт — обычный порядок работы с платформой"
                      icon={<LucideIcons.Clock size="xs" />}
                    />
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>

            <div className="shrink-0 border-t border-white/[0.08] px-5 py-4 sm:px-6 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <Link
                href="/applications"
                onClick={onClose}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#f9bc60] py-3.5 text-sm font-bold text-[#001e1d] transition-opacity hover:opacity-90"
              >
                Подать заявку
                <LucideIcons.ArrowRight size="sm" />
              </Link>
              <button
                type="button"
                onClick={onClose}
                className="mt-2 w-full py-2 text-sm font-medium text-[#abd1c6]/75 transition-colors hover:text-[#fffffe]"
              >
                Закрыть
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(modal, document.body);
}
