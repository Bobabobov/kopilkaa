import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { buildAuthModalUrl } from "@/lib/authModalUrl";
import ApplicationsPageClient from "./_components/ApplicationsPageClient";

/**
 * Серверная страница: проверка сессии на сервере, редирект неавторизованных.
 * Клиентская часть формы — в ApplicationsPageClient.
 */
export default async function ApplicationsPage() {
  const session = await getSession();
  if (!session) {
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
