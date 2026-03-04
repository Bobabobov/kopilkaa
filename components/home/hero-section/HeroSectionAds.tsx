"use client";

import AdSection from "../AdSection";

export function HeroSectionAds() {
  return (
    <>
      <div className="mb-4 md:hidden">
        <AdSection variant="feed" />
      </div>

      <div className="mb-4 hidden md:flex justify-center">
        <div className="w-full" style={{ maxWidth: "900px" }}>
          <AdSection variant="sidebar" />
        </div>
      </div>
    </>
  );
}
