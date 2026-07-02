// app/admin/components/ApplicationCardFooter.tsx
"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { adminCtaButtonClass } from "@/app/admin/_components/admin-ui";

interface ApplicationCardFooterProps {
  applicationId: string;
  createdAt: string;
}

export default function ApplicationCardFooter({
  applicationId,
  createdAt,
}: ApplicationCardFooterProps) {
  return (
    <div className="flex flex-col items-start justify-between gap-4 border-t-2 border-[#abd1c6]/15 pt-4 sm:flex-row sm:items-center">
      <div className="flex flex-wrap items-center gap-2 text-xs text-[#abd1c6]/70 sm:text-sm">
        <span>
          Отправлено: {new Date(createdAt).toLocaleString("ru-RU")}
        </span>
      </div>

      <Link
        href={`/admin/applications/${applicationId}`}
        className={adminCtaButtonClass}
      >
        Проверить
        <ChevronRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
