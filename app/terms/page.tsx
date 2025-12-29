// app/terms/page.tsx
"use client";

import TermsHeader from "@/components/terms/TermsHeader";
import TermsContent from "@/components/terms/TermsContent";

export default function TermsPage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="pt-10 sm:pt-12 pb-12 sm:pb-16 relative z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Реквизиты владельца сервиса */}
          <div className="mb-8 pb-6 border-b border-white/10">
            <div className="text-sm text-[#abd1c6] space-y-1">
              <p className="font-semibold text-[#fffffe] mb-2">Реквизиты владельца сервиса:</p>
              <p>ФИО: Стулов Федор Федорович</p>
              <p>ИНН: 245607255602</p>
              <p>Статус: Самозанятый (НПД)</p>
              <p>Email: support@kopilka-online.ru</p>
            </div>
          </div>
          <TermsHeader />
          <TermsContent />
        </div>
      </div>
    </div>
  );
}
