"use client";
import FooterBrand from "./FooterBrand";
import FooterContacts from "./FooterContacts";
import FooterLinks from "./FooterLinks";
import FooterCopyright from "./FooterCopyright";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#004643]/60 backdrop-blur-sm border-t border-[#abd1c6]/20 shadow-lg">
      {/* Две размытые подсветки в углах */}
      <div className="pointer-events-none absolute top-0 right-0 w-44 h-44 bg-gradient-to-br from-[#f9bc60]/15 to-transparent rounded-full blur-3xl"></div>
      <div className="pointer-events-none absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-[#e16162]/14 to-transparent rounded-full blur-3xl"></div>

      {/* Тонкая светящаяся линия сверху */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#f9bc60]/70 to-transparent shadow-[0_0_12px_rgba(249,188,96,0.55)]"></div>

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
