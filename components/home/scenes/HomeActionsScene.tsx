"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import DonateButton from "@/components/donate/DonateButton";
import { Button } from "@/components/ui/button";
import { LucideIcons } from "@/components/ui/LucideIcons";
import GlareHover from "@/components/ui/glare-hover";
import HomeTopDonorsScene from "@/components/home/scenes/HomeTopDonorsScene";

export default function HomeActionsScene() {
  return (
    <section className="relative py-16 px-4 sm:py-20 md:py-24" id="actions">
      <div className="pointer-events-none absolute right-0 top-20 h-56 w-56 rounded-full bg-[#f9bc60]/10 blur-[120px]" />
      <div className="w-full lg:pl-8 xl:pl-16">
        <motion.div
          className="max-w-2xl text-left"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <p className="text-xs uppercase tracking-[0.3em] text-[#abd1c6]">
            Действия
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#fffffe] sm:text-4xl">
            Что вы хотите сделать?
          </h2>
          <p className="mt-3 text-base text-[#abd1c6] sm:text-lg">
            Подать историю или поддержать проект
          </p>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2 lg:pr-12">
          <GlareHover
            className="rounded-3xl border border-[#abd1c6]/20 bg-[#001e1d]/70 p-8 text-left shadow-lg backdrop-blur-sm lg:translate-y-6 transition-transform duration-300 hover:-translate-y-1"
            borderRadius="24px"
            borderColor="rgba(249, 188, 96, 0.3)"
            glareOpacity={0.25}
          >
            <h3 className="text-xl font-semibold text-[#fffffe]">
              Рассказать историю
            </h3>
            <p className="mt-2 text-sm text-[#abd1c6]">
              Опишите ситуацию — мы рассмотрим заявку вручную.
            </p>
            <Button
              asChild
              size="lg"
              className="mt-6 w-full rounded-2xl border-0 px-6 py-5 text-base font-bold shadow-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl sm:w-auto"
              style={{
                background:
                  "linear-gradient(135deg, #e8a545 0%, #f9bc60 50%, #e8a545 100%)",
                color: "#001e1d",
                boxShadow: "0 16px 48px rgba(249, 188, 96, 0.35)",
              }}
            >
              <Link href="/applications" className="inline-flex items-center gap-2">
                <LucideIcons.FileText size="md" />
                Подать историю
              </Link>
            </Button>
          </GlareHover>

          <GlareHover
            className="rounded-3xl border border-[#abd1c6]/20 bg-[#001e1d]/70 p-8 text-left shadow-lg backdrop-blur-sm lg:-translate-y-4 lg:ml-auto transition-transform duration-300 hover:-translate-y-2"
            borderRadius="24px"
            borderColor="rgba(171, 209, 198, 0.3)"
            glareOpacity={0.2}
          >
            <h3 className="text-xl font-semibold text-[#fffffe]">
              Поддержать проект
            </h3>
            <p className="mt-2 text-sm text-[#abd1c6]">
              Донаты идут в общий бюджет платформы и на помощь людям.
            </p>
            <DonateButton variant="large" className="mt-6 w-full sm:w-auto" />
          </GlareHover>
        </div>

        <div className="mt-16 lg:ml-auto lg:max-w-4xl">
          <HomeTopDonorsScene />
        </div>
      </div>
    </section>
  );
}
