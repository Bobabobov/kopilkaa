// components/layout/HeaderLogo.tsx
"use client";
import Link from "next/link";
import Image from "next/image";

export default function HeaderLogo() {
  return (
    <div className="flex-shrink-0">
      <Link
        href="/"
        className="flex items-center gap-3 font-bold text-lg transition-colors drop-shadow-lg"
        style={{ color: "#fffffe" }}
      >
        <Image
          src="/logo.png"
          alt="Копилка"
          width={100}
          height={100}
          className="rounded-lg"
          style={{ width: "auto", height: "auto" }}
        />
        <span className="hidden sm:inline">Копилка</span>
      </Link>
    </div>
  );
}
