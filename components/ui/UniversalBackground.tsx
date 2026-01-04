"use client";

import Image from "next/image";

export default function UniversalBackground() {
  return (
    <>
      <div
        className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
        aria-hidden="true"
      >
        {/* Фоновое изображение */}
        <Image
          src="/fon5.png"
          alt=""
          fill
          sizes="100vw"
          quality={45}
          // Не делаем priority: пусть LCP выбирается по контенту/баннеру, а фон догружается легче.
          className="universal-background-animated absolute inset-0 object-cover md:object-center object-[center_top] md:scale-100 scale-110"
          draggable={false}
        />

        {/* Затемняющий overlay */}
        <div
          className="absolute inset-0"
          style={{ backgroundColor: "rgba(0, 70, 67, 0.26)" }}
        />
      </div>
    </>
  );
}
