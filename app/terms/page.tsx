// app/terms/page.tsx
"use client";

import UniversalBackground from "@/components/ui/UniversalBackground";
import TermsHeader from "@/components/terms/TermsHeader";
import TermsContent from "@/components/terms/TermsContent";

export default function TermsPage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <UniversalBackground />
      
      <div className="pt-32 pb-16 relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <TermsHeader />
          <TermsContent />
        </div>
      </div>
    </div>
  );
}