import { redirect } from "next/navigation";

export default function LoginPage() {
  // Старый маршрут больше не используется: перенаправляем на модальное окно авторизации
  redirect("/?modal=auth");
}
