// hooks/reports/useReportLike.ts
// Хук для управления лайками баг-репорта
import { useState, useCallback } from "react";
import { BugReport } from "@/app/reports/page";

interface UseReportLikeProps {
  report: (BugReport & { userLike: boolean | null }) | null;
  setReport: React.Dispatch<
    React.SetStateAction<(BugReport & { userLike: boolean | null }) | null>
  >;
}

interface UseReportLikeReturn {
  liking: boolean;
  handleLike: (isLike: boolean) => Promise<void>;
}

export function useReportLike({
  report,
  setReport,
}: UseReportLikeProps): UseReportLikeReturn {
  const [liking, setLiking] = useState(false);

  const handleLike = useCallback(
    async (isLike: boolean) => {
      if (liking || !report) return;

      setLiking(true);
      try {
        const response = await fetch(`/api/bug-reports/${report.id}/like`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isLike }),
        });

        if (response.ok) {
          const data = await response.json();
          setReport((prev) => {
            if (!prev) return null;
            const newUserLike = prev.userLike === isLike ? null : isLike;
            return {
              ...prev,
              likesCount: data.likes,
              dislikesCount: data.dislikes,
              userLike: newUserLike,
            };
          });
        }
      } catch (error) {
        console.error("Like error:", error);
      } finally {
        setLiking(false);
      }
    },
    [liking, report, setReport],
  );

  return { liking, handleLike };
}
