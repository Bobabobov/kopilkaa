// components/layout/HeaderLogo.tsx
"use client";
import Link from "next/link";

export default function HeaderLogo() {
  return (
    <div className="flex-shrink-0">
      <Link
        href="/"
        className="flex items-center font-bold text-lg transition-colors drop-shadow-lg"
        style={{ color: "#fffffe" }}
      >
        <span>Копилка</span>
      </Link>
    </div>
  );
}
