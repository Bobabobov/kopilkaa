"use client";

import Link from "next/link";
import { DinoRunGame } from "./DinoRunGame";

export function DinoRunPage() {
  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-7">
          <Link href="/games" className="text-sm text-[#f9bc60] hover:opacity-80">
            ← К списку игр
          </Link>
          <h1 className="mt-3 text-2xl font-bold text-white sm:text-3xl">Dino Run</h1>
          <p className="mt-2 max-w-2xl text-sm text-white/75 sm:text-base">
            Прыгай через препятствия и набирай очки. Скорость со временем растет, поэтому
            удержаться в игре становится сложнее.
          </p>
        </div>

        <DinoRunGame />
      </div>
    </main>
  );
}
