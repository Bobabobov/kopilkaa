"use client";

import { StandardsHero } from './components/StandardsHero';
import { TelegramBotCard } from './components/TelegramBotCard';
import { AdFormatsSection } from './components/AdFormatsSection';
import { SizesTable } from './components/SizesTable';
import { ActionButtons } from './components/ActionButtons';

export default function StandardsPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#004643" }}>
      <StandardsHero />
      
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16 md:pb-20">
        <TelegramBotCard />
        <AdFormatsSection />
        <SizesTable />
        <ActionButtons />
      </div>
    </div>
  );
}
