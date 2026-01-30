"use client";

import { StandardsHero } from "./_components/StandardsHero";
import { StandardsQuickNav } from "./_components/StandardsQuickNav";
import { TelegramBotCard } from "./_components/TelegramBotCard";
import { AdFormatsSection } from "./_components/AdFormatsSection";
import { SizesTable } from "./_components/SizesTable";
import { ActionButtons } from "./_components/ActionButtons";

export default function StandardsPage() {
  return (
    <div className="min-h-screen relative">
      <div className="relative z-10">
        <StandardsHero />

        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16 md:pb-20">
          <StandardsQuickNav />
          <TelegramBotCard />
          <AdFormatsSection />
          <SizesTable />
          <ActionButtons />
        </div>
      </div>
    </div>
  );
}
