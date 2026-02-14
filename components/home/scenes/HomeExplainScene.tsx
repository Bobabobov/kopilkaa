"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { LucideIcons } from "@/components/ui/LucideIcons";
import GlareHover from "@/components/ui/glare-hover";
import { HOW_IT_WORKS_STEPS } from "@/components/home/how-it-works/config";
import { useHowItWorksAuth } from "@/components/home/how-it-works/useHowItWorksAuth";

export default function HomeExplainScene() {
  const { loading, handleStartClick } = useHowItWorksAuth();

  return (
    <section className="relative py-16 px-4 sm:py-20 md:py-24" id="how-it-works">
      <div className="pointer-events-none absolute -left-20 top-6 h-56 w-56 rounded-full bg-[#22c55e]/10 blur-[100px]" />
      <div className="w-full lg:pl-6 xl:pl-12">
        <motion.div
          className="max-w-2xl text-left"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <p className="text-xs uppercase tracking-[0.3em] text-[#abd1c6]">
            4 шага
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#fffffe] sm:text-4xl">
            Как это работает
          </h2>
          <p className="mt-3 text-base text-[#abd1c6] sm:text-lg">Коротко и по делу</p>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 lg:pr-16">
          {HOW_IT_WORKS_STEPS.map((step, index) => {
            const Icon = LucideIcons[step.icon as keyof typeof LucideIcons];
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{
                  duration: 0.45,
                  delay: index * 0.08,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
              >
                <GlareHover
                  className={`h-full rounded-3xl border border-[#abd1c6]/20 bg-[#001e1d]/70 p-6 text-left shadow-lg backdrop-blur-sm transition-transform duration-300 ${
                    index % 2 === 0 ? "lg:translate-y-6" : "lg:-translate-y-3"
                  }`}
                  borderRadius="24px"
                  borderColor="rgba(171, 209, 198, 0.2)"
                  glareOpacity={0.25}
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f9bc60]/15 text-[#f9bc60]">
                    {Icon && <Icon size="md" />}
                  </div>
                  <p className="mt-4 text-xs uppercase tracking-[0.25em] text-[#abd1c6]">
                    Шаг {index + 1}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-[#fffffe]">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm font-medium text-[#f9bc60]">
                    {step.description}
                  </p>
                  <p className="mt-3 text-sm text-[#abd1c6]">
                    {step.details}
                  </p>
                </GlareHover>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          className="mt-12 max-w-3xl rounded-2xl border border-[#abd1c6]/20 bg-[#001e1d]/60 px-6 py-5 text-left text-sm text-[#abd1c6] backdrop-blur-sm lg:ml-12"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.4, delay: 0.05 }}
        >
          «Копилка» — платформа, которая самостоятельно оказывает финансовую поддержку.
          Средства предоставляются{" "}
          <strong className="text-[#fffffe]">безвозмездно</strong> и не являются займом.
        </motion.div>

        <motion.div
          className="mt-10 flex justify-start lg:ml-auto lg:max-w-xs"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.45, delay: 0.1 }}
        >
          <Button
            size="lg"
            onClick={handleStartClick}
            disabled={loading}
            className="rounded-2xl px-10 py-7 text-lg font-bold gap-3 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl disabled:opacity-60 disabled:pointer-events-none border-0"
            style={{
              background: "linear-gradient(135deg, #f9bc60 0%, #e8a545 100%)",
              color: "#001e1d",
              boxShadow: "0 16px 48px rgba(249, 188, 96, 0.35)",
            }}
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#001e1d]/30 border-t-[#001e1d]" />
                Загрузка...
              </span>
            ) : (
              <>
                <span>Рассказать историю</span>
                <LucideIcons.ArrowRight size="md" />
              </>
            )}
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
