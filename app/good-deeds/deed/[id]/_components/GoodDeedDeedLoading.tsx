import { StoriesPageBackground } from "@/app/stories/_components/stories-ui/StoriesPageBackground";
import { cn } from "@/lib/utils";
import {
  storiesGlassPanel,
  storiesGlassShine,
} from "@/app/stories/_components/stories-ui/glassStyles";

export function GoodDeedDeedLoading() {
  return (
    <div data-good-deeds-page className="relative min-h-screen">
      <StoriesPageBackground />
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4">
        <div
          className={cn(storiesGlassPanel, "w-full max-w-md p-8 text-center")}
          role="status"
          aria-live="polite"
          aria-busy="true"
        >
          <div className={storiesGlassShine} />
          <span className="sr-only">Загрузка отчёта…</span>
          <div className="relative mx-auto mb-5 h-14 w-14 animate-spin rounded-full border-2 border-white/15 border-t-[#f9bc60]" />
          <p className="font-semibold text-[#fffffe]">Загрузка отчёта…</p>
          <p className="mt-2 text-sm text-[#abd1c6]/70">Секунду</p>
        </div>
      </div>
    </div>
  );
}
