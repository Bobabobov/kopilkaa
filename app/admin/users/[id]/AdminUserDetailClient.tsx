"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useBeautifulToast } from "@/components/ui/BeautifulToast";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { AdminUserHeaderStrip } from "./_components/AdminUserHeaderStrip";
import { AdminUserSectionNav } from "./_components/AdminUserSectionNav";
import { AdminUserApplicationsSection } from "./_components/AdminUserApplicationsSection";
import { AdminUserLinksSection } from "./_components/AdminUserLinksSection";
import { AdminUserDossier } from "./_components/AdminUserDossier";
import { AdminUserActionsPanel } from "./_components/AdminUserActionsPanel";
import type { AdminUserDetail } from "./types";

interface AdminUserDetailClientProps {
  userId: string;
}

export default function AdminUserDetailClient({
  userId,
}: AdminUserDetailClientProps) {
  const router = useRouter();
  const { showToast } = useBeautifulToast();
  const [user, setUser] = useState<AdminUserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUser = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/admin/users/${userId}`, {
        cache: "no-store",
      });
      if (response.status === 403) {
        router.push("/");
        return;
      }
      const data = await response.json();
      if (!response.ok || !data?.item) {
        throw new Error(data?.error || "Пользователь не найден");
      }
      setUser(data.item);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Не удалось загрузить пользователя",
      );
    } finally {
      setLoading(false);
    }
  }, [userId, router]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const handleCopy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast("success", "Скопировано", label);
    } catch {
      showToast("error", "Ошибка", "Не удалось скопировать");
    }
  };

  if (loading) {
    return (
      <div className="py-16">
        <LoadingSpinner label="Загрузка досье пользователя…" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="rounded-2xl border border-[#e16162]/30 bg-[#e16162]/10 p-6 text-center">
        <p className="text-[#fffffe]">{error || "Пользователь не найден"}</p>
        <button
          type="button"
          onClick={() => router.push("/admin/users")}
          className="mt-4 text-sm text-[#f9bc60] hover:underline"
        >
          ← К списку пользователей
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl min-w-0">
      <Link
        href="/admin/users"
        className="mb-4 inline-flex items-center gap-2 rounded-xl border-2 border-[#abd1c6]/25 bg-[#001e1d]/60 px-3 py-2 text-sm font-medium text-[#abd1c6] transition-colors hover:border-[#f9bc60]/45 hover:bg-[#f9bc60]/10 hover:text-[#f9bc60]"
      >
        <ArrowLeft className="h-4 w-4" />
        К списку пользователей
      </Link>

      <AdminUserHeaderStrip user={user} onCopy={handleCopy} />
      <AdminUserSectionNav />

      <div className="mt-4 grid gap-6 xl:grid-cols-[1fr_300px]">
        <div className="min-w-0 space-y-3">
          <AdminUserApplicationsSection
            applications={user.applications}
            stats={user.applicationStats}
          />
          <AdminUserLinksSection links={user.links} />
          <AdminUserDossier user={user} />
        </div>

        <div id="section-actions" className="min-w-0 scroll-mt-24 xl:sticky xl:top-24 xl:self-start">
          <AdminUserActionsPanel
            user={user}
            onUserUpdated={loadUser}
            showToast={showToast}
          />
        </div>
      </div>
    </div>
  );
}
