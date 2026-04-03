import NotFoundView from "@/components/not-found/NotFoundView";

export default function NotFound() {
  const homeOrigin = (
    process.env.NEXT_PUBLIC_SITE_URL || "https://kopilka.ru"
  ).replace(/\/$/, "");

  return <NotFoundView homeOrigin={homeOrigin} />;
}
