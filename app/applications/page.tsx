import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { buildAuthModalUrl } from "@/lib/authModalUrl";
import { APPLICATIONS_SUBMISSION_ENABLED } from "@/lib/applications/submissionControl";
import ApplicationsPageClient from "./_components/ApplicationsPageClient";

/**
 * Серверная страница: проверка сессии на сервере, редирект неавторизованных.
 * Если в URL уже есть ?modal=auth — не редиректим, рендерим страницу: модалка
 * авторизации откроется по URL (AuthModalRoot в layout), иначе в in-app браузере
 * возможен цикл редиректов и ошибка "Application error".
 */
export default async function ApplicationsPage({
  searchParams,
}: {
  searchParams?: { modal?: string };
}) {
  const session = await getSession();
  const modal = searchParams?.modal ?? "";

  if (!APPLICATIONS_SUBMISSION_ENABLED) {
    return <ApplicationsPageClient />;
  }

  if (!session) {
    if (modal.startsWith("auth")) {
      return <ApplicationsPageClient />;
    }
    redirect(
      buildAuthModalUrl({
        pathname: "/applications",
        search: "",
        modal: "auth/signup",
      }),
    );
  }

  return <ApplicationsPageClient />;
}
