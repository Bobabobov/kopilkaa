"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Zap, Gamepad2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";

export function GamesPromoSection() {
  return (
    <section className="px-4 sm:px-6 lg:px-8 py-10 sm:py-14 border-t border-white/10">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ type: "spring", stiffness: 100 }}>
          <Card variant="darkGlass" padding="lg" className="text-center">
            <CardContent>
              <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-[#abd1c6] text-sm sm:text-base mb-6 flex flex-wrap items-center justify-center gap-2 max-w-lg mx-auto">
                <motion.span aria-hidden animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 3 }}>
                  <Zap className="w-5 h-5 inline-block" style={{ color: "#f9bc60" }} />
                </motion.span>
                Ограниченное число попыток в неделю, честные правила и общий топ — соревнуйтесь на равных.
              </motion.p>
              <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ type: "spring", stiffness: 120 }}>
                <Link
                  href="#games-grid"
                  className="inline-flex items-center gap-2 rounded-xl px-6 py-3 font-semibold transition-all hover:opacity-90"
                  style={{
                    background: "linear-gradient(135deg, #e8a545 0%, #f9bc60 50%, #e8a545 100%)",
                    color: "#001e1d",
                    boxShadow: "0 8px 24px rgba(249, 188, 96, 0.25)",
                  }}
                >
                  <Gamepad2 className="w-5 h-5" aria-hidden /> К списку игр
                </Link>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
