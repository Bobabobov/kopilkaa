import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";

export function StoryAdInfoBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="mt-8 rounded-3xl border-2 border-[#f9bc60]/30 bg-gradient-to-br from-[#f9bc60]/10 via-[#f9bc60]/5 to-transparent p-6 shadow-xl backdrop-blur-sm sm:p-8"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#f9bc60] to-[#e8a545] shadow-lg">
          <LucideIcons.Megaphone size="lg" className="text-white" />
        </div>
        <div className="flex-1">
          <h3 className="mb-2 text-xl font-bold text-[#fffffe]">
            Рекламная история
          </h3>
          <p className="mb-4 leading-relaxed text-[#abd1c6]">
            Это рекламная история в разделе историй. Рекламодатель может
            разместить здесь информацию о себе, своих услугах или продуктах.
            История отображается в первой позиции списка и доступна всем
            посетителям сайта.
          </p>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 text-sm text-[#abd1c6]">
              <LucideIcons.Star size="sm" className="text-[#f9bc60]" />
              <span>Первая позиция в списке</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[#abd1c6]">
              <LucideIcons.Users size="sm" className="text-[#f9bc60]" />
              <span>Доступна всем посетителям</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[#abd1c6]">
              <LucideIcons.Calendar size="sm" className="text-[#f9bc60]" />
              <span>От 2000₽/неделя</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
