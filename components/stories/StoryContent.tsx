// components/stories/StoryContent.tsx
"use client";

interface StoryContentProps {
  content: string;
  isAd?: boolean;
}

export default function StoryContent({
  content,
  isAd = false,
}: StoryContentProps) {
  return (
    <div
      className={`relative rounded-2xl p-6 sm:p-8 md:p-10 mb-8 overflow-hidden border ${
        isAd
          ? "border-[#f9bc60]/35 bg-gradient-to-br from-white/95 via-white/92 to-[#f6f8f7] shadow-[0_24px_55px_-24px_rgba(249,188,96,0.18)]"
          : "border-[#abd1c6]/25 bg-white/95 backdrop-blur-sm shadow-[0_20px_50px_-20px_rgba(0,30,29,0.1)]"
      }`}
    >
      {isAd && (
        <>
          <div className="pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full bg-[#f9bc60]/15 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-12 -left-12 h-24 w-24 rounded-full bg-[#f9bc60]/10 blur-xl" />
        </>
      )}
      {!isAd && (
        <>
          <div className="pointer-events-none absolute top-0 right-0 w-40 h-40 rounded-full bg-[#abd1c6]/10 blur-2xl" />
          <div className="pointer-events-none absolute bottom-0 left-0 w-32 h-32 rounded-full bg-[#f9bc60]/5 blur-xl" />
        </>
      )}

      <div className="relative z-10">
        <div
          className={`prose prose-lg max-w-none ${
            isAd
              ? "prose-ad prose-headings:text-[#001e1d] prose-p:text-[#1f2a2a] prose-strong:text-[#003c3a]"
              : "prose-headings:text-[#001e1d] prose-p:text-[#2d5a4e] prose-strong:text-[#004643]"
          }`}
        >
          <div
            className={`break-words overflow-wrap-anywhere ${
              isAd
                ? "text-[1.08rem] sm:text-[1.25rem] leading-[1.72]"
                : "text-lg leading-relaxed"
            }`}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
        <style jsx global>{`
          .prose a {
            color: #004643;
            text-decoration: underline;
            text-underline-offset: 3px;
            font-weight: 600;
          }
          .prose a:hover {
            color: #f9bc60;
          }
          .prose-ad a {
            display: inline-flex;
            align-items: center;
            gap: 0.35rem;
            color: #0b4d4a;
            text-decoration: none;
            border: 1px solid rgba(11, 77, 74, 0.24);
            background: linear-gradient(
              180deg,
              rgba(171, 209, 198, 0.3) 0%,
              rgba(171, 209, 198, 0.14) 100%
            );
            padding: 0.12rem 0.5rem;
            border-radius: 9999px;
            font-weight: 700;
            line-height: 1.25;
            transition: all 0.2s ease;
            word-break: break-word;
          }
          .prose-ad a::after {
            content: "↗";
            font-size: 0.78em;
            line-height: 1;
            opacity: 0.85;
            transform: translateY(-0.5px);
          }
          .prose-ad a:hover {
            color: #003c3a;
            border-color: rgba(0, 60, 58, 0.45);
            background: linear-gradient(
              180deg,
              rgba(171, 209, 198, 0.5) 0%,
              rgba(171, 209, 198, 0.2) 100%
            );
            transform: translateY(-1px);
          }
          .prose blockquote {
            border-left: 4px solid #f9bc60;
            padding-left: 1rem;
            margin: 1.5rem 0;
            font-style: italic;
            color: #2d5a4e;
            background: rgba(249, 188, 96, 0.06);
            border-radius: 0 0.5rem 0.5rem 0;
            padding: 1rem 1rem 1rem 1.25rem;
          }
          .prose ul,
          .prose ol {
            margin: 1rem 0;
            padding-left: 1.5rem;
          }
          .prose li {
            margin: 0.35rem 0;
          }
          .prose ul li::marker {
            color: #f9bc60;
          }
          .prose ol li::marker {
            color: #004643;
            font-weight: 600;
          }
          .prose h2,
          .prose h3 {
            margin-top: 1.75rem;
            margin-bottom: 0.75rem;
            padding-bottom: 0.25rem;
          }
          .prose p {
            margin-bottom: 1rem;
          }
          .prose-ad p {
            margin-bottom: 1.15rem;
          }
        `}</style>
      </div>
    </div>
  );
}
