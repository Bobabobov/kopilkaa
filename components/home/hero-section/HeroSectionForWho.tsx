"use client";

import Link from "next/link";
import { PenLine, HeartHandshake } from "lucide-react";
import DonateButton from "@/components/donate/DonateButton";

export function HeroSectionForWho() {
  return (
    <div className="mb-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
        <Link
          href="/applications"
          className="group flex items-center gap-4 p-4 sm:p-5 rounded-2xl border-2 border-[#f9bc60]/40 bg-[#f9bc60]/10 hover:bg-[#f9bc60]/20 hover:border-[#f9bc60] transition-all text-left"
        >
          <span className="flex-shrink-0 w-12 h-12 rounded-xl bg-[#f9bc60]/30 flex items-center justify-center text-[#f9bc60] md:group-hover:scale-110 transition-transform">
            <PenLine className="w-6 h-6" />
          </span>
          <div>
            <span className="font-bold text-[#fffffe] block">
              Поделиться историей
            </span>
            <span className="text-sm text-[#abd1c6]">Стать автором →</span>
          </div>
        </Link>
        <div className="flex items-center gap-4 p-4 sm:p-5 rounded-2xl border-2 border-white/20 bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/30 transition-all text-left">
          <span className="flex-shrink-0 w-12 h-12 rounded-xl bg-[#004643] flex items-center justify-center text-[#f9bc60]">
            <HeartHandshake className="w-6 h-6" />
          </span>
          <div className="min-w-0">
            <span className="font-bold text-[#fffffe] block">
              Поддержать авторов
            </span>
            <span className="text-sm text-[#abd1c6] block mb-2">
              Пополнить фонд грантов
            </span>
            <DonateButton variant="default" />
          </div>
        </div>
      </div>
    </div>
  );
}
