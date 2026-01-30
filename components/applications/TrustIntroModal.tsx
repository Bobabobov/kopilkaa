"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LucideIcons } from "@/components/ui/LucideIcons";

type Props = {
  open: boolean;
  checked: boolean;
  onCheckedChange: (val: boolean) => void;
  onConfirm: () => void;
};

export function TrustIntroModal({
  open,
  checked,
  onCheckedChange,
  onConfirm,
}: Props) {
  if (!open) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="fixed inset-0 z-[60] flex items-center justify-center px-4"
    >
      <div className="absolute inset-0 bg-black/65" />
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.28, ease: "easeOut" }}
        className="relative w-full max-w-[760px] max-h-[82vh] overflow-y-auto rounded-3xl border border-[#2c4f45]/70 bg-gradient-to-br from-[#0f2622] via-[#0c231f] to-[#0b1f1b] shadow-2xl p-7 sm:p-8 lg:p-9 space-y-8 [&::-webkit-scrollbar]:w-0 [&::-webkit-scrollbar]:h-0"
        style={{ scrollbarWidth: "none" }}
      >
        <div className="absolute inset-x-6 top-4 h-1 rounded-full bg-gradient-to-r from-[#f9bc60] via-[#abd1c6] to-[#f9bc60] opacity-60" />
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut", delay: 0.02 }}
          className="space-y-3 max-w-[68ch]"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-[#f9bc60]/30 bg-[#f9bc60]/10 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-[#f9bc60]">
            <LucideIcons.AlertTriangle size="xs" />
            Важно перед подачей заявки
          </div>
          <h2 className="text-2xl sm:text-[28px] font-semibold text-[#f7fbf9] leading-tight drop-shadow-[0_0_14px_rgba(247,251,249,0.14)]">
            Копилка помогает не во всех ситуациях
          </h2>
          <p className="text-sm sm:text-base text-[#cfdcd6] leading-relaxed">
            Мы заранее обозначаем границы проекта, чтобы избежать недопонимания.
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#2c4f45]/60 bg-[#0b2a24]/70 px-3 py-1 text-xs text-[#e6f1ec]">
              <LucideIcons.Shield size="xs" className="text-[#abd1c6]" />
              Без долгов и кредитов
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#2c4f45]/60 bg-[#0b2a24]/70 px-3 py-1 text-xs text-[#e6f1ec]">
              <LucideIcons.Heart size="xs" className="text-[#e16162]" />
              Без медицины и лечения
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#2c4f45]/60 bg-[#0b2a24]/70 px-3 py-1 text-xs text-[#e6f1ec]">
              <LucideIcons.Home size="xs" className="text-[#f9bc60]" />
              Бытовая помощь
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut", delay: 0.08 }}
          className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-5 lg:gap-7 items-start"
        >
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, ease: "easeOut", delay: 0.1 }}
            className="space-y-3 rounded-2xl bg-[#0e2420] p-4 sm:p-5 relative overflow-hidden border border-[#1c4037]/60"
          >
            <div className="absolute left-0 top-3 bottom-3 w-[3px] bg-[#1c4037]/80 rounded-full" />
            <div className="absolute -top-10 -right-10 h-24 w-24 rounded-full bg-[#e16162]/10 blur-2xl" />
            <div className="flex items-center gap-2 text-sm sm:text-base font-semibold text-[#d9e6e0]">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#1c4037]/60 text-[#f9bc60]">
                <LucideIcons.XCircle size="xs" />
              </span>
              Мы не помогаем с:
            </div>
            <span className="inline-flex items-center w-fit rounded-full border border-[#e16162]/30 bg-[#e16162]/10 px-2.5 py-0.5 text-[11px] font-semibold text-[#e16162]">
              Нельзя
            </span>
            <ul className="space-y-4 text-sm text-[#c5d3cd] leading-[1.6]">
              <li className="space-y-1 pl-1">
                <div className="font-semibold text-[#e3f0ea]">• Кредиты и займы</div>
                <div className="text-xs text-[#9fb2ab]">
                  Банковские кредиты, рассрочки, потребительские займы и похожие
                  обязательства
                </div>
              </li>
              <li className="space-y-1 pl-1">
                <div className="font-semibold text-[#e3f0ea]">• МФО и займы «до зарплаты»</div>
                <div className="text-xs text-[#9fb2ab]">
                  Онлайн-займы, быстрые деньги и аналогичные сервисы
                </div>
              </li>
              <li className="space-y-1 pl-1">
                <div className="font-semibold text-[#e3f0ea]">
                  • Долги, просрочки, коллекторы
                </div>
                <div className="text-xs text-[#9fb2ab]">
                  Задолженности, штрафы, пени и требования коллекторских
                  агентств
                </div>
              </li>
              <li className="space-y-1 pl-1">
                <div className="font-semibold text-[#e3f0ea]">• Лечение и лекарства</div>
                <div className="text-xs text-[#9fb2ab]">
                  Медицинские услуги, обследования, препараты и расходы на
                  лечение
                </div>
              </li>
              <li className="space-y-1 pl-1">
                <div className="font-semibold text-[#e3f0ea]">• Медицинские сборы</div>
                <div className="text-xs text-[#9fb2ab]">
                  Реабилитация, курсы лечения, анализы, платные процедуры
                </div>
              </li>
              <li className="space-y-1 pl-1">
                <div className="font-semibold text-[#e3f0ea]">• Азартные игры и ставки</div>
                <div className="text-xs text-[#9fb2ab]">
                  Букмекеры, казино, лотереи и рискованные игровые активности
                </div>
              </li>
            </ul>
            <p className="text-xs text-[#9fb2ab]">
              И другие похожие по смыслу ситуации
            </p>
          </motion.div>

          <div className="hidden md:block w-px h-full bg-[#2c4f45]/60 mx-1" />

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.24, ease: "easeOut", delay: 0.12 }}
            className="space-y-4 rounded-2xl bg-[#173b33] p-5 sm:p-6 relative overflow-hidden transition-colors duration-200 border border-[#2f6f5a]/60"
          >
            <div className="absolute left-0 top-3 bottom-3 w-[3px] bg-[#2f6f5a]/90 rounded-full" />
            <div className="absolute -top-10 -left-10 h-24 w-24 rounded-full bg-[#f9bc60]/15 blur-2xl" />
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-white/0 via-white/0 to-white/[0.03]" />
            <div className="space-y-2 relative">
              <div className="flex items-center gap-2 text-lg sm:text-xl font-semibold text-[#f6fcf9] drop-shadow-[0_0_12px_rgba(246,252,249,0.12)]">
                <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#2f6f5a]/70 text-[#f9bc60]">
                  <LucideIcons.CheckCircle2 size="sm" />
                </span>
                Мы можем помочь с:
              </div>
              <div className="h-px w-16 bg-[#2c4f45]/40" />
            </div>
            <span className="inline-flex items-center w-fit rounded-full border border-[#f9bc60]/30 bg-[#f9bc60]/10 px-2.5 py-0.5 text-[11px] font-semibold text-[#f9bc60]">
              Можно
            </span>
            <ul className="space-y-4 text-sm text-[#e9f4ef] leading-[1.65] relative">
              <li className="space-y-1 pl-1">
                <div className="font-semibold text-[#f2faf6]">• Еда и напитки</div>
                <div className="text-xs text-[#c8d9d2]">
                  Покупка продуктов, перекус, вода, чай, кофе и другие
                  повседневные траты
                </div>
              </li>
              <li className="space-y-1 pl-1">
                <div className="font-semibold text-[#f2faf6]">• Небольшие бытовые расходы</div>
                <div className="text-xs text-[#c8d9d2]">
                  Предметы первой необходимости и повседневные нужды
                </div>
              </li>
              <li className="space-y-1 pl-1">
                <div className="font-semibold text-[#f2faf6]">
                  • Проезд, связь и мелкие расходы
                </div>
                <div className="text-xs text-[#c8d9d2]">
                  Транспорт, мобильная связь, интернет и аналогичные траты
                </div>
              </li>
              <li className="space-y-1 pl-1">
                <div className="font-semibold text-[#f2faf6]">• Небольшой подарок</div>
                <div className="text-xs text-[#c8d9d2]">
                  Простой подарок или знак внимания без крупных затрат
                </div>
              </li>
              <li className="space-y-1 pl-1">
                <div className="font-semibold text-[#f2faf6]">• Донат в игру или сервис</div>
                <div className="text-xs text-[#c8d9d2]">
                  Цифровые сервисы, игры, подписки и внутриигровые покупки
                </div>
              </li>
              <li className="space-y-1 pl-1">
                <div className="font-semibold text-[#f2faf6]">
                  • Поддержка в обычной жизненной ситуации
                </div>
                <div className="text-xs text-[#c8d9d2]">
                  Небольшая помощь здесь и сейчас без долгов и серьёзных
                  обязательств
                </div>
              </li>
            </ul>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut", delay: 0.16 }}
          className="space-y-3 border-t border-[#2c4f45]/60 pt-4"
        >
          <div
            className={cn(
              "rounded-xl p-3 sm:p-4 transition-colors",
              checked ? "bg-[#183e36]" : "bg-[#13322c]",
            )}
          >
            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                className="mt-0.5 h-4 w-4 rounded border-[#2c4f45] bg-transparent text-[#f9bc60] focus:ring-[#f9bc60] focus:ring-offset-0"
                checked={checked}
                onChange={(e) => onCheckedChange(e.target.checked)}
              />
              <span className="text-sm text-[#e6f1ec] leading-relaxed">
                Я понимаю условия и подаю подходящую заявку
              </span>
            </label>
          </div>

          <div className="sticky bottom-0 pt-2 pb-1 bg-[#0f2622]">
            <button
              type="button"
              disabled={!checked}
              onClick={() => {
                if (!checked) return;
                onConfirm();
              }}
              className={cn(
                "w-full rounded-xl px-4 py-3 text-sm font-semibold transition-colors",
                checked
                  ? "bg-[#f9bc60] text-[#0f1f1c] hover:bg-[#e8a545]"
                  : "bg-[#c5cfca]/40 text-[#8ea09a] cursor-not-allowed",
              )}
            >
              Понятно, продолжить
            </button>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default TrustIntroModal;
