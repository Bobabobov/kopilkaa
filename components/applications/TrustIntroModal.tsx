"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

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
        className="relative w-full max-w-[720px] max-h-[80vh] overflow-y-auto rounded-2xl border border-[#2c4f45]/70 bg-[#0f2622] shadow-xl p-7 sm:p-8 lg:p-9 space-y-8"
      >
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut", delay: 0.02 }}
          className="space-y-3 max-w-[68ch]"
        >
          <p className="text-xs uppercase tracking-[0.14em] text-[#9bb3ab]">
            Важно перед подачей заявки
          </p>
          <h2 className="text-2xl sm:text-[26px] font-semibold text-[#f7fbf9] leading-tight drop-shadow-[0_0_12px_rgba(247,251,249,0.12)]">
            Копилка помогает не во всех ситуациях
          </h2>
          <p className="text-sm text-[#cfdcd6] leading-relaxed">
            Мы заранее обозначаем границы проекта, чтобы избежать недопонимания.
          </p>
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
            className="space-y-3 rounded-xl bg-[#0e2420] p-4 sm:p-5 relative overflow-hidden"
          >
            <div className="absolute left-0 top-3 bottom-3 w-[3px] bg-[#1c4037]/70 opacity-60 rounded-full" />
            <h3 className="text-base sm:text-lg font-semibold text-[#d9e6e0]">
              Мы не помогаем с:
            </h3>
            <ul className="space-y-4 text-sm text-[#c5d3cd] leading-[1.6]">
              <li className="space-y-1 pl-1">
                <div className="font-semibold">• Кредиты и займы</div>
                <div className="text-xs text-[#9fb2ab]">
                  Банковские кредиты, рассрочки, потребительские займы и похожие
                  обязательства
                </div>
              </li>
              <li className="space-y-1 pl-1">
                <div className="font-semibold">• МФО и займы «до зарплаты»</div>
                <div className="text-xs text-[#9fb2ab]">
                  Онлайн-займы, быстрые деньги и аналогичные сервисы
                </div>
              </li>
              <li className="space-y-1 pl-1">
                <div className="font-semibold">
                  • Долги, просрочки, коллекторы
                </div>
                <div className="text-xs text-[#9fb2ab]">
                  Задолженности, штрафы, пени и требования коллекторских
                  агентств
                </div>
              </li>
              <li className="space-y-1 pl-1">
                <div className="font-semibold">• Лечение и лекарства</div>
                <div className="text-xs text-[#9fb2ab]">
                  Медицинские услуги, обследования, препараты и расходы на
                  лечение
                </div>
              </li>
              <li className="space-y-1 pl-1">
                <div className="font-semibold">• Медицинские сборы</div>
                <div className="text-xs text-[#9fb2ab]">
                  Реабилитация, курсы лечения, анализы, платные процедуры
                </div>
              </li>
              <li className="space-y-1 pl-1">
                <div className="font-semibold">• Азартные игры и ставки</div>
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
            className="space-y-4 rounded-2xl bg-[#173b33] p-5 sm:p-6 relative overflow-hidden transition-colors duration-200"
          >
            <div className="absolute left-0 top-3 bottom-3 w-[3px] bg-[#2f6f5a]/80 opacity-80 rounded-full" />
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-white/0 via-white/0 to-white/[0.03]" />
            <div className="space-y-2 relative">
              <h3 className="text-lg sm:text-xl font-semibold text-[#f6fcf9] drop-shadow-[0_0_12px_rgba(246,252,249,0.12)]">
                Мы можем помочь с:
              </h3>
              <div className="h-px w-16 bg-[#2c4f45]/40" />
            </div>
            <ul className="space-y-4 text-sm text-[#e9f4ef] leading-[1.65] relative">
              <li className="space-y-1 pl-1">
                <div className="font-semibold">• Еда и напитки</div>
                <div className="text-xs text-[#c8d9d2]">
                  Покупка продуктов, перекус, вода, чай, кофе и другие
                  повседневные траты
                </div>
              </li>
              <li className="space-y-1 pl-1">
                <div className="font-semibold">• Небольшие бытовые расходы</div>
                <div className="text-xs text-[#c8d9d2]">
                  Предметы первой необходимости и повседневные нужды
                </div>
              </li>
              <li className="space-y-1 pl-1">
                <div className="font-semibold">
                  • Проезд, связь и мелкие расходы
                </div>
                <div className="text-xs text-[#c8d9d2]">
                  Транспорт, мобильная связь, интернет и аналогичные траты
                </div>
              </li>
              <li className="space-y-1 pl-1">
                <div className="font-semibold">• Небольшой подарок</div>
                <div className="text-xs text-[#c8d9d2]">
                  Простой подарок или знак внимания без крупных затрат
                </div>
              </li>
              <li className="space-y-1 pl-1">
                <div className="font-semibold">• Донат в игру или сервис</div>
                <div className="text-xs text-[#c8d9d2]">
                  Цифровые сервисы, игры, подписки и внутриигровые покупки
                </div>
              </li>
              <li className="space-y-1 pl-1">
                <div className="font-semibold">
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
