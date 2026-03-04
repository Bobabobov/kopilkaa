"use client";

import { motion } from "framer-motion";
import { Ban, CreditCard, Trophy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";

export function GamesTrustSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ type: "spring", stiffness: 100 }}
      className="px-4 sm:px-6 lg:px-8 pb-8 sm:pb-10"
    >
      <div className="max-w-3xl mx-auto">
        <Card variant="darkGlass" padding="md" className="text-center">
          <CardContent>
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-3 text-sm font-medium" style={{ color: "#f9bc60" }}>
              <span className="inline-flex items-center gap-1.5">
                <Ban className="w-4 h-4 flex-shrink-0" aria-hidden /> Не азарт
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 flex-shrink-0" aria-hidden /> Без покупок
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Trophy className="w-4 h-4 flex-shrink-0" aria-hidden /> Топ = выплата
              </span>
            </div>
            <p className="text-[#abd1c6] text-sm sm:text-base leading-relaxed">
              Ничего закидывать не нужно — держишься в топе неделю, сайт тебе платит. Без доплат и прочей дряни.
            </p>
          </CardContent>
        </Card>
      </div>
    </motion.section>
  );
}
