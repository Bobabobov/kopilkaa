// hooks/reports/useReportDetail.ts
// Хук для загрузки деталей баг-репорта
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BugReport } from "@/app/reports/page";

interface UseReportDetailProps {
  reportId: string | null;
  userId: string | null;
}

interface UseReportDetailReturn {
  report: (BugReport & { userLike: boolean | null }) | null;
  loading: boolean;
  setReport: React.Dispatch<
    React.SetStateAction<(BugReport & { userLike: boolean | null }) | null>
  >;
}

export function useReportDetail({
  reportId,
  userId,
}: UseReportDetailProps): UseReportDetailReturn {
  const router = useRouter();
  const [report, setReport] = useState<
    (BugReport & { userLike: boolean | null }) | null
  >(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId || !reportId) return;

    setLoading(true);
    fetch(`/api/bug-reports/${reportId}`)
      .then((r) => {
        if (!r.ok) {
          if (r.status === 404) {
            router.push("/reports");
            return null;
          }
          throw new Error(`HTTP ${r.status}: ${r.statusText}`);
        }
        return r.json();
      })
      .then((d) => {
        if (d) {
          setReport(d.report);
        }
      })
      .catch((err) => {
        console.error("Load report error:", err);
        router.push("/reports");
      })
      .finally(() => setLoading(false));
  }, [userId, reportId, router]);

  return { report, loading, setReport };
}
