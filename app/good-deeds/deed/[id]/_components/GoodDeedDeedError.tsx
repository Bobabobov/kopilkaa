import Link from "next/link";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { StoriesPageBackground } from "@/app/stories/_components/stories-ui/StoriesPageBackground";
import { cn } from "@/lib/utils";
import {
  storiesGlassPanel,
  storiesGlassShine,
} from "@/app/stories/_components/stories-ui/glassStyles";

type Props = {
  error: string;
};

export function GoodDeedDeedError({ error }: Props) {
  return (
    <div data-good-deeds-page className="relative min-h-screen">
      <StoriesPageBackground />
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4">
        <div className={cn(storiesGlassPanel, "w-full max-w-md p-8 text-center")}>
          <div className={storiesGlassShine} />
          <span
            className="relative mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-[#e16162]/30 bg-[#e16162]/15 text-[#e16162]"
            aria-hidden
          >
            <LucideIcons.AlertCircle size="xl" />
          </span>
          <h1 className="mb-2 text-2xl font-bold text-[#fffffe]">
            Не удалось открыть отчёт
          </h1>
          <div role="alert">
            <p className="mb-6 text-[#abd1c6]">{error}</p>
          </div>
          <Link
            href="/good-deeds"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#f9bc60] to-[#e8a545] px-6 py-3 font-semibold text-[#001e1d] transition-all duration-300 hover:shadow-[0_8px_24px_rgba(249,188,96,0.3)]"
          >
            <LucideIcons.ArrowLeft size="sm" />
            К ленте добрых дел
          </Link>
        </div>
      </div>
    </div>
  );
}
