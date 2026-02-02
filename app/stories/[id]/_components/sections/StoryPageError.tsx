import Link from "next/link";
import { LucideIcons } from "@/components/ui/LucideIcons";

interface StoryPageErrorProps {
  error: string;
}

export function StoryPageError({ error }: StoryPageErrorProps) {
  return (
    <div className="min-h-screen">
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-[#abd1c6]/25 bg-[#001e1d]/40 p-8 shadow-xl text-center">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e16162]/20 text-[#e16162] mb-5">
            <LucideIcons.AlertCircle size="xl" />
          </span>
          <h1 className="mb-2 text-2xl font-bold text-[#fffffe]">
            Ошибка
          </h1>
          <p className="mb-6 text-[#abd1c6]">
            {error}
          </p>
          <Link
            href="/stories"
            className="inline-flex items-center gap-2 rounded-xl bg-[#f9bc60] px-6 py-3 font-semibold text-[#001e1d] transition-all duration-300 hover:bg-[#e8a545] hover:shadow-[0_8px_24px_rgba(249,188,96,0.3)]"
          >
            <LucideIcons.ArrowLeft size="sm" />
            Вернуться к историям
          </Link>
        </div>
      </div>
    </div>
  );
}
