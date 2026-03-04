"use client";

import { GamesHero } from "./_components/GamesHero";
import { GamesTrustSection } from "./_components/GamesTrustSection";
import { GamesGrid } from "./_components/GamesGrid";
import { GamesLeaderboardsSection } from "./_components/GamesLeaderboardsSection";
import { GamesPromoSection } from "./_components/GamesPromoSection";

export default function GamesPage() {
  return (
    <div className="min-h-screen relative">
      {/* Фон: градиенты + лёгкая сетка */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 80% 50% at 50% -10%, rgba(249,188,96,0.12) 0%, transparent 55%),
            radial-gradient(ellipse 60% 40% at 85% 70%, rgba(249,188,96,0.06) 0%, transparent 45%),
            linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.02) 100%)
          `,
        }}
      />
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(249,188,96,0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(249,188,96,0.15) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />
      <div className="relative z-10">
        <GamesHero />
        <GamesTrustSection />
        <GamesGrid />
        <GamesLeaderboardsSection />
        <GamesPromoSection />
      </div>
    </div>
  );
}
