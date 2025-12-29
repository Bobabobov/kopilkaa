// components/stories/StoryContent.tsx
"use client";

interface StoryContentProps {
  content: string;
  isAd?: boolean;
}

export default function StoryContent({ content, isAd = false }: StoryContentProps) {
  // Для всех историй (обычных и рекламных) используем HTML рендеринг
  // Теперь рекламные истории тоже поддерживают форматирование через RichTextEditor
  return (
    <div
      className={`relative backdrop-blur-xl rounded-3xl p-8 sm:p-10 shadow-xl mb-8 overflow-hidden border-2 transition-all duration-500 ${
        isAd
          ? "bg-gradient-to-br from-white/95 via-white/90 to-[#f9bc60]/10 border-[#f9bc60]/40 hover:border-[#f9bc60]/60 hover:shadow-2xl"
          : "bg-white/90 border-[#abd1c6]/30"
      }`}
    >
      {/* Декоративные элементы */}
      {isAd ? (
        <>
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-[#f9bc60]/20 to-[#e8a545]/15 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-[#f9bc60]/15 to-[#e8a545]/10 rounded-full blur-2xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-[#f9bc60]/5 to-transparent rounded-full blur-3xl"></div>
        </>
      ) : (
        <>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-400/10 to-yellow-600/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-yellow-400/5 to-yellow-600/5 rounded-full blur-xl"></div>
        </>
      )}

      <div className="relative z-10">
        <div className={`prose prose-lg max-w-none ${isAd ? "prose-headings:text-[#001e1d] prose-p:text-[#2d5a4e] prose-strong:text-[#004643]" : ""}`}>
          <div
            className={`break-words overflow-wrap-anywhere ${
              isAd ? "text-lg sm:text-xl leading-relaxed" : "text-lg"
            }`}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
        <style jsx global>{`
          .prose a {
            color: #3b82f6;
            text-decoration: underline;
            text-underline-offset: 2px;
          }
          .prose a:hover {
            color: #60a5fa;
          }
        `}</style>
      </div>
    </div>
  );
}
