// app/terms/page.tsx
"use client";

import TermsHeader from "@/components/terms/TermsHeader";
import TermsContent from "@/components/terms/TermsContent";

export default function TermsPage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="pt-10 sm:pt-12 pb-12 sm:pb-16 relative z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <TermsHeader />
          <TermsContent />
        </div>
      </div>
    </div>
  );
}
