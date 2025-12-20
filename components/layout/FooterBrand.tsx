"use client";

export default function FooterBrand() {
  return (
    <div className="space-y-4">
      <h3
        className="text-xl font-bold transition-all duration-300"
        style={{ color: "#fffffe" }}
      >
        Копилка
      </h3>

      <p className="text-sm leading-relaxed" style={{ color: "#abd1c6" }}>
        Платформа для взаимопомощи и поддержки. Мы создаем сообщество, где
        каждый может получить помощь и помочь другим.
      </p>

      <div className="flex items-center gap-2">
        <div className="flex gap-1.5">
          <div
            className="w-2 h-2 rounded-full animate-pulse shadow-[0_0_6px_rgba(255,255,254,0.6)]"
            style={{
              backgroundColor: "#fffffe",
              animationDelay: "0s",
              animationDuration: "2s",
            }}
          ></div>
          <div
            className="w-2 h-2 rounded-full animate-pulse shadow-[0_0_6px_rgba(171,209,198,0.6)]"
            style={{
              backgroundColor: "#abd1c6",
              animationDelay: "0.7s",
              animationDuration: "2s",
            }}
          ></div>
          <div
            className="w-2 h-2 rounded-full animate-pulse shadow-[0_0_6px_rgba(249,188,96,0.6)]"
            style={{
              backgroundColor: "#f9bc60",
              animationDelay: "1.4s",
              animationDuration: "2s",
            }}
          ></div>
        </div>
        <span className="text-xs font-medium" style={{ color: "#abd1c6" }}>
          Доверие • Честность • Прозрачность
        </span>
      </div>
    </div>
  );
}
