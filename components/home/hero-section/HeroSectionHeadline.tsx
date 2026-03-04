"use client";

export function HeroSectionHeadline() {
  return (
    <>
      <p
        className="text-sm sm:text-base font-semibold uppercase tracking-wider mb-4 text-[#f9bc60]"
        style={{ letterSpacing: "0.15em" }}
      >
        Платформа финансовой помощи
      </p>

      <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight mb-9 text-[#fffffe]">
        Нужны деньги на жизнь?{" "}
        <span className="text-[#f9bc60]">Расскажите историю</span> — мы рассмотрим и, по возможности, поможем
      </h1>
    </>
  );
}
