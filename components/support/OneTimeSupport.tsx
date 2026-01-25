"use client";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import Link from "next/link";
import { LucideIcons } from "@/components/ui/LucideIcons";
import Image from "next/image";
import { buildAuthModalUrl } from "@/lib/authModalUrl";

interface OneTimeSupportProps {
  customAmount: string;
  onAmountChange: (amount: string) => void;
  showSocialPrompt?: boolean;
}

const predefinedAmounts = [100, 300, 500, 1000, 2000, 5000];

type PreSupportProfile = { username: string | null; isAuthed: boolean };

export default function OneTimeSupport({
  customAmount,
  onAmountChange,
  showSocialPrompt,
}: OneTimeSupportProps) {
  const amountNumber = parseInt(customAmount || "0", 10);
  const hasAmount = !!amountNumber && amountNumber > 0;
  const [isPreSupportOpen, setIsPreSupportOpen] = useState(false);
  const [profile, setProfile] = useState<PreSupportProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [mounted, setMounted] = useState(false);

  const dalinkUrl = "https://dalink.to/kopilkaonline";
  const suggestedTag = useMemo(
    () => (profile?.username ? `@${profile.username}` : "@username"),
    [profile?.username],
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isPreSupportOpen) return;

    // soft scroll lock: lock background but allow scrolling inside modal
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

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsPreSupportOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = originalOverflow;
      document.body.style.position = originalPosition;
      document.body.style.top = originalTop;
      document.body.style.width = originalWidth;
      document.documentElement.style.overflow = originalHtmlOverflow;
      window.scrollTo(0, scrollY);
    };
  }, [isPreSupportOpen]);

  async function ensureProfileLoaded() {
    if (profile !== null || isLoadingProfile) return;
    try {
      setIsLoadingProfile(true);
      const res = await fetch("/api/profile/me", { cache: "no-store" });
      if (!res.ok) {
        setProfile({ username: null, isAuthed: false });
        return;
      }
      const data = await res.json().catch(() => null);
      const username =
        (data?.user?.username as string | null | undefined) ?? null;
      setProfile({ username, isAuthed: true });
    } finally {
      setIsLoadingProfile(false);
    }
  }

  async function copyText(text: string) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // ignore
    }
  }

  function closePreSupport() {
    setIsPreSupportOpen(false);
  }

  function renderPreSupportModal() {
    return (
      <div
        className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-md flex items-center justify-center p-4"
        role="presentation"
        onMouseDown={(e) => {
          // Закрываем по клику по фону (вне карточки)
          if (e.target === e.currentTarget) setIsPreSupportOpen(false);
        }}
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="pre-support-title"
          aria-describedby="pre-support-desc"
          className="w-full max-w-lg"
          onMouseDown={(e) => e.stopPropagation()}
        >
          {/* Gradient border + glow */}
          <div className="relative rounded-[28px] p-px bg-gradient-to-br from-[#f9bc60]/70 via-white/10 to-[#abd1c6]/50 shadow-[0_30px_90px_-30px_rgba(0,0,0,0.85)]">
            {/* Decorative glows */}
            <div className="pointer-events-none absolute -top-20 -right-20 h-52 w-52 rounded-full bg-[#f9bc60]/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-60 w-60 rounded-full bg-[#abd1c6]/18 blur-3xl" />

            <div className="relative overflow-hidden rounded-[27px] bg-gradient-to-br from-[#004643] via-[#003b38] to-[#001e1d]">
              <div className="absolute inset-0 pointer-events-none opacity-[0.35] [background:radial-gradient(circle_at_30%_20%,rgba(249,188,96,0.28),transparent_45%),radial-gradient(circle_at_80%_70%,rgba(171,209,198,0.18),transparent_55%)]" />

              <div className="p-5 sm:p-6 border-b border-white/10 flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-[#f9bc60] to-[#e8a545] text-[#001e1d] shadow-lg shadow-[#f9bc60]/25">
                      <LucideIcons.Heart size="sm" />
                    </span>
                    <span className="text-xs font-semibold tracking-wide text-[#fffffe]">
                      Поддержка проекта
                    </span>
                  </div>

                  <h3
                    id="pre-support-title"
                    className="mt-3 text-xl sm:text-2xl font-black text-[#fffffe] leading-tight"
                  >
                    💚 Поддержать «Копилку»
                  </h3>
                  <p
                    id="pre-support-desc"
                    className="mt-2 text-sm text-[#abd1c6] leading-relaxed"
                  >
                    Поддержка помогает «Копилке» развиваться и продолжать
                    работу.
                    <span className="block mt-2 rounded-2xl bg-white/5 border border-white/10 px-3 py-2">
                      Хотите, чтобы мы могли{" "}
                      <span className="text-[#f9bc60] font-semibold">
                        публично поблагодарить
                      </span>{" "}
                      вас в «Героях» — укажите свой логин в сообщении к
                      поддержке. Сейчас это{" "}
                      <span className="text-[#f9bc60] font-semibold">
                        вручную
                      </span>
                      , скоро{" "}
                      <span className="text-[#f9bc60] font-semibold">
                        автоматически
                      </span>
                      .
                    </span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPreSupportOpen(false)}
                  className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-2xl flex items-center justify-center transition-colors flex-shrink-0 border border-white/10"
                  aria-label="Закрыть"
                >
                  <LucideIcons.X size="sm" className="text-[#fffffe]" />
                </button>
              </div>

              <div className="p-5 sm:p-6 space-y-4">
                {/* Auth / Heroes logic */}
                {profile?.isAuthed === false ? (
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-5">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                        <LucideIcons.Info
                          size="sm"
                          className="text-[#abd1c6]"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-[#fffffe]">
                          Можно поддержать прямо сейчас
                        </div>
                        <p className="mt-2 text-sm text-[#abd1c6] leading-relaxed">
                          Регистрация не обязательна. Но если поддержать{" "}
                          <span className="text-[#f9bc60] font-semibold">
                            без аккаунта
                          </span>
                          , мы{" "}
                          <span className="text-[#f9bc60] font-semibold">
                            не сможем
                          </span>{" "}
                          добавить вас в «Герои» (нам не к чему привязать
                          поддержку).
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-col sm:flex-row gap-2 sm:items-stretch">
                      <a
                        href={dalinkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={closePreSupport}
                        className="group sm:flex-1 px-4 py-3 rounded-2xl bg-gradient-to-r from-[#f9bc60] to-[#e8a545] text-[#001e1d] text-sm font-black transition-all duration-200 inline-flex items-center justify-center gap-2 shadow-lg shadow-[#f9bc60]/20 hover:shadow-xl hover:shadow-[#f9bc60]/25 hover:-translate-y-0.5 active:translate-y-0"
                      >
                        <LucideIcons.Heart
                          size="sm"
                          className="group-hover:scale-110 transition-transform"
                        />
                        💚 Поддержать проект
                        <LucideIcons.ExternalLink size="sm" />
                      </a>

                      <a
                        href={buildAuthModalUrl({
                          pathname: "/support",
                          search:
                            typeof window !== "undefined"
                              ? window.location.search
                              : "",
                          modal: "auth/signup",
                        })}
                        className="sm:flex-1 px-4 py-3 rounded-2xl bg-transparent hover:bg-white/5 text-[#fffffe] text-sm font-semibold transition-colors inline-flex items-center justify-center gap-2 border border-white/15"
                      >
                        <LucideIcons.UserPlus size="sm" />
                        Войти (для «Героев»)
                      </a>
                    </div>
                  </div>
                ) : profile?.isAuthed === true && profile.username ? (
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-5">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                        <LucideIcons.Star
                          size="sm"
                          className="text-[#f9bc60]"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-[#fffffe]">
                          Опционально: логин для «Героев»
                        </div>
                        <p className="mt-2 text-xs sm:text-sm text-[#abd1c6] leading-relaxed">
                          Если вы хотите, чтобы мы могли поблагодарить вас
                          публично, укажите этот логин в сообщении к поддержке
                          (пока добавление в «Герои» — вручную).
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-2">
                      <div className="flex-1 px-4 py-3 bg-[#001e1d]/30 rounded-2xl text-[#fffffe] border border-[#abd1c6]/15 break-all">
                        {suggestedTag}
                      </div>
                      <button
                        type="button"
                        onClick={() => copyText(suggestedTag)}
                        className="px-4 py-3 bg-white/5 hover:bg-white/10 text-[#fffffe] text-sm font-semibold rounded-2xl transition-colors inline-flex items-center justify-center gap-2 border border-white/10"
                      >
                        <LucideIcons.Copy size="sm" />
                        Скопировать логин
                      </button>
                    </div>

                    <div className="mt-4 flex flex-col sm:flex-row gap-2 sm:items-stretch">
                      <a
                        href={dalinkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={closePreSupport}
                        className="group sm:flex-1 px-4 py-3 rounded-2xl bg-gradient-to-r from-[#f9bc60] to-[#e8a545] text-[#001e1d] text-sm font-black transition-all duration-200 inline-flex items-center justify-center gap-2 shadow-lg shadow-[#f9bc60]/20 hover:shadow-xl hover:shadow-[#f9bc60]/25 hover:-translate-y-0.5 active:translate-y-0"
                      >
                        <LucideIcons.Heart
                          size="sm"
                          className="group-hover:scale-110 transition-transform"
                        />
                        💚 Поддержать проект
                        <LucideIcons.ExternalLink size="sm" />
                      </a>
                      <a
                        href={dalinkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={closePreSupport}
                        className="sm:flex-1 px-4 py-3 rounded-2xl bg-transparent hover:bg-white/5 text-[#fffffe] text-sm font-semibold transition-colors inline-flex items-center justify-center gap-2 border border-white/15"
                      >
                        Поддержать без упоминания
                      </a>
                    </div>
                  </div>
                ) : profile?.isAuthed === true ? (
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-5">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                        <LucideIcons.Heart
                          size="sm"
                          className="text-[#abd1c6]"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-[#fffffe]">
                          Поддержать можно и без логина
                        </div>
                        <p className="mt-2 text-sm text-[#abd1c6] leading-relaxed">
                          Если хотите попасть в «Герои», задайте логин в профиле
                          (ссылка будет вида{" "}
                          <span className="text-[#f9bc60] font-semibold">
                            /profile/@логин
                          </span>
                          ). Это необязательно.
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-col sm:flex-row gap-2 sm:items-stretch">
                      <a
                        href={dalinkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={closePreSupport}
                        className="group sm:flex-1 px-4 py-3 rounded-2xl bg-gradient-to-r from-[#f9bc60] to-[#e8a545] text-[#001e1d] text-sm font-black transition-all duration-200 inline-flex items-center justify-center gap-2 shadow-lg shadow-[#f9bc60]/20 hover:shadow-xl hover:shadow-[#f9bc60]/25 hover:-translate-y-0.5 active:translate-y-0"
                      >
                        <LucideIcons.Heart
                          size="sm"
                          className="group-hover:scale-110 transition-transform"
                        />
                        💚 Поддержать проект
                        <LucideIcons.ExternalLink size="sm" />
                      </a>
                      <a
                        href="/profile?settings=username"
                        className="sm:flex-1 px-4 py-3 rounded-2xl bg-transparent hover:bg-white/5 text-[#fffffe] text-sm font-semibold transition-colors inline-flex items-center justify-center gap-2 border border-white/15"
                      >
                        <LucideIcons.Settings size="sm" />
                        Задать логин (для «Героев»)
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-5">
                    <div className="text-sm font-semibold text-[#fffffe]">
                      Проверяем статус аккаунта…
                    </div>
                    <p className="mt-2 text-sm text-[#abd1c6]">
                      Если вы не авторизованы, можно поддержать проект без
                      регистрации — но тогда мы не сможем добавить вас в
                      «Герои».
                    </p>
                    <div className="mt-4">
                      <a
                        href={dalinkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={closePreSupport}
                        className="group px-4 py-3 rounded-2xl bg-gradient-to-r from-[#f9bc60] to-[#e8a545] text-[#001e1d] text-sm font-black transition-all duration-200 inline-flex items-center justify-center gap-2 w-full shadow-lg shadow-[#f9bc60]/20 hover:shadow-xl hover:shadow-[#f9bc60]/25 hover:-translate-y-0.5 active:translate-y-0"
                      >
                        <LucideIcons.Heart
                          size="sm"
                          className="group-hover:scale-110 transition-transform"
                        />
                        💚 Поддержать проект
                        <LucideIcons.ExternalLink size="sm" />
                      </a>
                    </div>
                  </div>
                )}

                {/* actions are inside the blocks above */}
              </div>

              <div className="px-5 sm:px-6 pb-5 sm:pb-6">
                <div className="text-[11px] text-[#abd1c6]/80 leading-relaxed">
                  Поддержка добровольная и не является покупкой услуги,
                  инвестицией или подпиской.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="py-6 sm:py-8 px-3 sm:px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-6 sm:mb-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f9bc60]/10 border border-[#f9bc60]/30 mb-3">
            <LucideIcons.Trophy className="w-4 h-4 text-[#f9bc60]" />
            <span
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: "#e16162" }}
            >
              Добровольная поддержка
            </span>
          </div>
          <h2
            className="text-2xl sm:text-3xl font-semibold mb-2 sm:mb-3"
            style={{ color: "#fffffe" }}
          >
            Выберите сумму поддержки проекта
          </h2>
          <p
            className="text-sm sm:text-base max-w-xl mx-auto px-2 leading-relaxed"
            style={{ color: "#abd1c6" }}
          >
            Любая сумма — это вклад в развитие платформы и помощь тем, кому она
            действительно нужна.
          </p>
        </motion.div>

        <div className="bg-[#004643]/20 backdrop-blur-sm border border-[#abd1c6]/15 rounded-xl sm:rounded-2xl p-5 sm:p-6">
          <h3
            className="text-lg sm:text-xl font-semibold mb-5 sm:mb-6 text-center"
            style={{ color: "#abd1c6" }}
          >
            Выберите сумму поддержки
          </h3>

          {/* Dalink block */}
          <div className="mb-6 sm:mb-7">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5">
              <div className="grid grid-cols-1 md:grid-cols-[1fr_180px] gap-4 md:gap-5 items-center">
                <div className="min-w-0">
                  <div className="text-sm sm:text-base font-semibold text-[#fffffe]">
                    Поддержать проект
                  </div>
                  <div className="mt-1 text-xs sm:text-sm text-[#abd1c6] leading-relaxed">
                    Нажмите кнопку или отсканируйте QR‑код — откроется страница
                    поддержки.
                    {hasAmount ? (
                      <span className="block mt-1">
                        Вы выбрали:{" "}
                        <span className="text-[#f9bc60] font-semibold">
                          ₽{amountNumber.toLocaleString()}
                        </span>
                      </span>
                    ) : null}
                  </div>

                  <a
                    href={dalinkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsPreSupportOpen(true);
                      ensureProfileLoaded();
                    }}
                    className="inline-flex items-center justify-center gap-2 mt-4 px-6 py-3 rounded-full bg-[#f9bc60] text-[#001e1d] font-semibold hover:bg-[#e8a545] transition-all duration-200 hover:scale-[1.02] shadow-lg"
                  >
                    <LucideIcons.Heart className="w-5 h-5" />
                    <span>Поддержать</span>
                    <LucideIcons.ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                <div className="flex justify-center md:justify-end">
                  <div className="rounded-2xl border border-white/10 bg-[#001e1d]/30 p-3 overflow-hidden">
                    <Image
                      src="/dalink-qr-code.png"
                      alt="QR-код: поддержать проект"
                      width={160}
                      height={160}
                      className="w-40 h-40 object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pre-support modal */}
          {mounted && isPreSupportOpen
            ? createPortal(renderPreSupportModal(), document.body)
            : null}

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5 sm:mb-6">
            {predefinedAmounts.map((amount, index) => {
              const isSelected = customAmount === amount.toString();
              const isLarge = amount >= 1000;
              return (
                <motion.button
                  key={amount}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => onAmountChange(amount.toString())}
                  className={`py-3 sm:py-4 rounded-xl font-semibold text-sm sm:text-base transition-all duration-200 relative overflow-hidden ${
                    isSelected
                      ? "shadow-lg ring-2 ring-[#f9bc60]/50"
                      : "hover:border-[#abd1c6]/40"
                  } ${isLarge ? "md:col-span-1" : ""}`}
                  style={{
                    backgroundColor: isSelected ? "#f9bc60" : "transparent",
                    color: isSelected ? "#001e1d" : "#abd1c6",
                    border: isSelected ? "none" : "1px solid #abd1c6/20",
                  }}
                >
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 15,
                      }}
                      className="absolute top-2 right-2"
                    >
                      <LucideIcons.CheckCircle className="w-4 h-4 text-[#001e1d]" />
                    </motion.div>
                  )}
                  <div className="relative z-10">
                    <div className="text-lg sm:text-xl font-bold">
                      ₽{amount.toLocaleString()}
                    </div>
                    {isLarge && (
                      <div className="text-xs opacity-70 font-normal mt-1">
                        Вклад
                      </div>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>

          <div className="mb-5 sm:mb-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <label
                className="block text-sm sm:text-base font-medium mb-2.5"
                style={{ color: "#abd1c6" }}
              >
                Или введите свою сумму
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={customAmount}
                  onChange={(e) => onAmountChange(e.target.value)}
                  placeholder="1000"
                  className="w-full bg-[#004643]/40 border border-[#abd1c6]/25 rounded-xl px-4 sm:px-5 py-3 text-base font-medium placeholder-[#abd1c6]/40 focus:border-[#e16162] focus:outline-none focus:ring-2 focus:ring-[#e16162]/50 transition-all duration-200"
                  style={{ color: "#fffffe" }}
                />
                <span
                  className="absolute right-4 sm:right-5 top-1/2 transform -translate-y-1/2 text-sm font-medium opacity-70"
                  style={{ color: "#abd1c6" }}
                >
                  ₽
                </span>
              </div>
            </motion.div>
          </div>

          {showSocialPrompt && (
            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="mt-6 sm:mt-7 rounded-2xl sm:rounded-3xl border border-[#f9bc60]/40 bg-gradient-to-r from-[#f9bc60]/18 via-[#e16162]/10 to-transparent px-4 sm:px-5 md:px-6 py-4 sm:py-5 flex flex-col md:flex-row md:items-center gap-3 sm:gap-4 shadow-[0_18px_40px_rgba(0,0,0,0.45)]"
            >
              <div className="flex-shrink-0 flex flex-row md:flex-col items-center md:items-center gap-2 md:gap-2">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-[#f9bc60]/25 flex items-center justify-center">
                  <LucideIcons.Share className="text-[#f9bc60]" size="sm" />
                </div>
                <span className="md:hidden text-[10px] font-semibold tracking-[0.14em] uppercase text-[#f9bc60] bg-[#f9bc60]/10 px-2 py-0.5 rounded-full">
                  Рекомендуем
                </span>
                <span className="hidden md:inline-block text-[10px] font-semibold tracking-[0.14em] uppercase text-[#f9bc60] bg-[#f9bc60]/10 px-2 py-0.5 rounded-full">
                  Рекомендуем
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm sm:text-base font-semibold text-[#fffffe]">
                  Привяжите соцсети — они будут видны в «Героях проекта»
                </p>
                <p className="text-xs sm:text-sm text-[#ffd499] mt-1">
                  VK, Telegram или YouTube будут отображаться рядом с вашим
                  профилем в разделе «Герои проекта».
                </p>
              </div>
              <div className="flex-shrink-0">
                <Link
                  href="/profile?settings=socials"
                  className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-[#f9bc60] text-[#001e1d] text-xs sm:text-sm font-semibold hover:bg-[#e8a545] transition-colors w-full md:w-auto justify-center"
                >
                  <LucideIcons.User size="xs" />
                  Привязать соцсети
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
