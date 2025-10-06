"use client";
import Image from "next/image";

export default function FooterBrand() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 group">
        <div className="relative">
          <Image
            src="/buldog.png"
            alt="Копилка"
            width={48}
            height={48}
            className="rounded-xl shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
          />
          <div className="absolute inset-0 rounded-xl bg-[#f9bc60] opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
        </div>
        <h3
          className="text-2xl font-bold transition-all duration-300 group-hover:text-[#f9bc60]"
          style={{ color: "#fffffe" }}
        >
          Копилка
        </h3>
      </div>

      <p className="text-base leading-relaxed" style={{ color: "#abd1c6" }}>
        Платформа для взаимопомощи и поддержки. Мы создаем сообщество, где
        каждый может получить помощь и помочь другим.
      </p>

      <div className="flex items-center gap-3">
        <div className="flex gap-2">
          <div
            className="w-3 h-3 rounded-full animate-pulse shadow-[0_0_8px_rgba(255,255,254,0.6)]"
            style={{
              backgroundColor: "#fffffe",
              animationDelay: "0s",
              animationDuration: "2s",
            }}
          ></div>
          <div
            className="w-3 h-3 rounded-full animate-pulse shadow-[0_0_8px_rgba(171,209,198,0.6)]"
            style={{
              backgroundColor: "#abd1c6",
              animationDelay: "0.7s",
              animationDuration: "2s",
            }}
          ></div>
          <div
            className="w-3 h-3 rounded-full animate-pulse shadow-[0_0_8px_rgba(249,188,96,0.6)]"
            style={{
              backgroundColor: "#f9bc60",
              animationDelay: "1.4s",
              animationDuration: "2s",
            }}
          ></div>
        </div>
        <span className="text-sm font-medium" style={{ color: "#abd1c6" }}>
          Доверие • Честность • Прозрачность
        </span>
      </div>
    </div>
  );
}
