"use client";

export default function UniversalBackground() {
  return (
    <>
      <div
        className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
        aria-hidden="true"
      >
        {/* Фоновое изображение */}
        <img
          src="/fon5.png"
          alt=""
          draggable={false}
          decoding="async"
          className="universal-background-animated absolute inset-0 w-full h-full object-cover md:object-center object-[center_top] md:scale-100 scale-110"
        />

        {/* Затемняющий overlay */}
        <div
          className="absolute inset-0"
          style={{ backgroundColor: "rgba(0, 70, 67, 0.35)" }}
        />
      </div>
    </>
  );
}
