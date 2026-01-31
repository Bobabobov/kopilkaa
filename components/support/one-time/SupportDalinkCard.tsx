import Image from "next/image";
import { LucideIcons } from "@/components/ui/LucideIcons";

interface SupportDalinkCardProps {
  dalinkUrl: string;
  hasAmount: boolean;
  amountNumber: number;
  onOpenPreSupport: () => void;
}

export function SupportDalinkCard({
  dalinkUrl,
  hasAmount,
  amountNumber,
  onOpenPreSupport,
}: SupportDalinkCardProps) {
  return (
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
                onOpenPreSupport();
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
  );
}
