"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import FooterBrand from "./FooterBrand";
import FooterContacts from "./FooterContacts";
import FooterLinks from "./FooterLinks";
import FooterCopyright from "./FooterCopyright";

export default function Footer() {
  const router = useRouter();

  const handleBulldogClick = async () => {
    try {
      const res = await fetch("/api/profile/me", { cache: "no-store" });
      const data = await res.json();
      if (data?.user) {
        router.push("/");
      } else {
        router.push("/?modal=auth");
      }
    } catch {
      router.push("/?modal=auth");
    }
  };

  return (
    <footer className="relative overflow-visible bg-gradient-to-br from-[#004643] via-[#003c3a] to-[#001e1d]">
      {/* Эффект свечения линии */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#f9bc60] to-transparent shadow-[0_0_15px_rgba(249,188,96,0.6)] animate-pulse"></div>

      {/* Бульдог на линии разделителя */}
      <div
        className="absolute z-20 cursor-pointer select-none"
        style={{
          right: "24px",
          top: "0",
          transform: "translateY(calc(-100% + 40px))",
        }}
        onClick={handleBulldogClick}
        role="button"
        aria-label="Перейти на главную"
      >
        <Image
          src="/buldog.png"
          alt="Копилка"
          width={120}
          height={120}
          className="object-contain h-auto w-24 sm:w-32 md:w-40 lg:w-48"
          style={{
            filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))",
            lineHeight: "0",
            padding: "0",
          }}
        />
      </div>

      {/* Декоративные элементы */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-[#f9bc60] rounded-full opacity-5 blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#abd1c6] rounded-full opacity-5 blur-3xl"></div>

      {/* Основной контент */}
      <div className="relative z-10">
        <div className="container-p mx-auto py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Левая часть - информация о проекте */}
            <FooterBrand />

            {/* Центральная часть - контакты */}
            <FooterContacts />

            {/* Правая часть - ссылки */}
            <FooterLinks />
          </div>

          {/* Нижняя часть - копирайт */}
          <FooterCopyright />
        </div>
      </div>
    </footer>
  );
}
