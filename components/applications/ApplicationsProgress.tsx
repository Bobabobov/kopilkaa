"use client";

import ProgressBar from "@/components/applications/ProgressBar";
import MotivationalMessages from "@/components/applications/MotivationalMessages";
import { useEffect, useState } from "react";

type Props = {
  title: string;
  summary: string;
  story: string;
  amount: string;
  payment: string;
  photos: any[];
  progressPercentage: number;
  filledFields: number;
  totalFields: number;
};

export function ApplicationsProgress({
  title,
  summary,
  story,
  amount,
  payment,
  photos,
  progressPercentage,
  filledFields,
  totalFields,
}: Props) {
  const [isMobileViewport, setIsMobileViewport] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return;
    }
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobileViewport(mq.matches);
    update();
    if (mq.addEventListener) {
      mq.addEventListener("change", update);
      return () => mq.removeEventListener("change", update);
    }
    mq.addListener(update);
    return () => mq.removeListener(update);
  }, []);

  if (isMobileViewport) {
    return (
      <div className="space-y-3">
        <div className="rounded-2xl p-4 bg-gradient-to-br from-[#004643]/60 to-[#001e1d]/40 border border-[#abd1c6]/25">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#fffffe]">Прогресс заполнения</h3>
            <span className="text-sm font-bold text-[#f9bc60]">{progressPercentage}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-[#001e1d]/40 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#10B981] to-[#34D399]"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-[#abd1c6]">
            Заполнено полей: {filledFields} из {totalFields}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <ProgressBar
        title={title}
        summary={summary}
        story={story}
        amount={amount}
        payment={payment}
        photos={photos}
      />

      <MotivationalMessages
        progress={progressPercentage}
        filledFields={filledFields}
        totalFields={totalFields}
      />
    </div>
  );
}

export default ApplicationsProgress;
