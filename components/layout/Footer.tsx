"use client";
import FooterBrand from "./FooterBrand";
import FooterContacts from "./FooterContacts";
import FooterLinks from "./FooterLinks";
import FooterCopyright from "./FooterCopyright";

export default function Footer() {
  return (
    <footer className="relative overflow-visible bg-gradient-to-br from-[#004643] via-[#003c3a] to-[#001e1d]">
      {/* Эффект свечения линии */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#f9bc60] to-transparent shadow-[0_0_15px_rgba(249,188,96,0.6)] animate-pulse"></div>

      {/* Декоративные элементы */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-[#f9bc60] rounded-full opacity-5 blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#abd1c6] rounded-full opacity-5 blur-3xl"></div>

      {/* Основной контент */}
      <div className="relative z-10">
        <div className="container-p mx-auto py-8 md:py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
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
