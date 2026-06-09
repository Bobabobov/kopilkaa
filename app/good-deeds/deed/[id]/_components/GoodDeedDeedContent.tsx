"use client";

import { cn } from "@/lib/utils";

type Props = {
  content: string;
  taskDescription?: string | null;
};

export function GoodDeedDeedContent({ content, taskDescription }: Props) {
  return (
    <section aria-label="Рассказ о добром деле" className="mb-10 w-full max-w-3xl">
      <div
        className={cn(
          "overflow-hidden rounded-2xl",
          "border border-[#abd1c6]/20",
          "bg-[#fffffe]",
          "shadow-[0_8px_32px_-12px_rgba(0,30,29,0.14)]",
        )}
      >
        <div className="px-6 py-7 sm:px-8 sm:py-8">
          <p className="whitespace-pre-wrap break-words text-[1.0625rem] leading-[1.85] text-[#1a3330] sm:text-[1.125rem]">
            {content}
          </p>
          {taskDescription ? (
            <div className="mt-6 border-t border-[#abd1c6]/20 pt-6">
              <p className="text-sm font-semibold text-[#004643]">
                Описание задания
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[#2d5a4e]">
                {taskDescription}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
