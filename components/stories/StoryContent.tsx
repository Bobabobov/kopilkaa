// components/stories/StoryContent.tsx
"use client";

interface StoryContentProps {
  content: string;
  isAd?: boolean;
}

export default function StoryContent({ content, isAd = false }: StoryContentProps) {
  const paragraphs = content.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);

  const renderParagraph = (text: string, index: number) => {
    if (!isAd) {
      return (
        <p key={index} className="mb-4 last:mb-0 leading-relaxed text-lg" style={{ color: "#001e1d" }}>
          {text}
        </p>
      );
    }

    // Специальное оформление для рекламной истории
    if (text.startsWith("Проект сейчас на старте")) {
      return (
        <p
          key={index}
          className="mb-4 last:mb-0 leading-relaxed text-lg font-medium"
          style={{ color: "#001e1d" }}
        >
          {text}
        </p>
      );
    }

    if (text.startsWith("Здесь можно простым человеческим языком")) {
      return (
        <p
          key={index}
          className="mb-4 last:mb-0 leading-relaxed text-lg rounded-2xl px-4 py-3 bg-[#004643]/5 border border-[#abd1c6]/40"
          style={{ color: "#001e1d" }}
        >
          {text}
        </p>
      );
    }

    if (text.startsWith("Мы не обещаем чудес")) {
      return (
        <p
          key={index}
          className="mb-4 last:mb-0 leading-relaxed text-lg border-l-4 pl-4 rounded-r-2xl bg-[#f9bc60]/10 border-[#f9bc60]"
          style={{ color: "#001e1d" }}
        >
          {text}
        </p>
      );
    }

    if (text.startsWith("Когда проект наберёт статистику")) {
      return (
        <p
          key={index}
          className="mb-0 leading-relaxed text-lg text-[#004643]"
        >
          {text}
        </p>
      );
    }

    return (
      <p key={index} className="mb-4 last:mb-0 leading-relaxed text-lg" style={{ color: "#001e1d" }}>
        {text}
      </p>
    );
  };

  return (
    <div
      className="relative bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-xl mb-8 overflow-hidden"
      style={{ borderColor: "#abd1c6/30" }}
    >
      {/* Декоративные элементы */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-400/10 to-yellow-600/10 rounded-full blur-2xl"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-yellow-400/5 to-yellow-600/5 rounded-full blur-xl"></div>

      <div className="relative z-10">
        <div className="prose prose-lg max-w-none">
          <div
            className="break-words overflow-wrap-anywhere text-lg"
          >
            {paragraphs.map(renderParagraph)}
          </div>
        </div>
      </div>
    </div>
  );
}
