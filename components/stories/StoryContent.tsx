"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StoryContentProps {
  content: string;
  isAd?: boolean;
  footer?: ReactNode;
}

export default function StoryContent({
  content,
  isAd = false,
  footer,
}: StoryContentProps) {
  return (
    <section
      aria-label="Текст истории"
      className="mb-10 w-full max-w-3xl"
    >
      <div
        className={cn(
          "overflow-hidden rounded-2xl",
          "border border-[#abd1c6]/20",
          "bg-[#fffffe]",
          "shadow-[0_8px_32px_-12px_rgba(0,30,29,0.14)]",
          isAd && "border-[#f9bc60]/30",
        )}
      >
        <div className="px-6 py-7 sm:px-8 sm:py-8">
          <div
            className={cn(
              "story-prose prose prose-lg max-w-none",
              "prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-[#001e1d]",
              "prose-p:text-[#1a3330] prose-p:leading-[1.85] prose-p:text-[1.0625rem] sm:prose-p:text-[1.125rem]",
              "prose-strong:text-[#004643] prose-strong:font-semibold",
              "prose-a:text-[#004643] prose-a:font-semibold prose-a:underline prose-a:underline-offset-[3px] hover:prose-a:text-[#e8a545]",
              "prose-blockquote:border-l-[#f9bc60] prose-blockquote:bg-[#f9bc60]/[0.06] prose-blockquote:text-[#2d5a4e]",
              "prose-li:marker:text-[#f9bc60]",
            )}
          >
            <div
              className="break-words [overflow-wrap:anywhere]"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        </div>
      </div>

      {footer && (
        <div className="mt-5 flex flex-wrap items-center gap-3">{footer}</div>
      )}

      <style jsx global>{`
        .story-prose blockquote {
          border-left-width: 4px;
          padding: 1rem 1rem 1rem 1.25rem;
          margin: 1.5rem 0;
          font-style: italic;
          border-radius: 0 0.5rem 0.5rem 0;
        }
        .story-prose ul,
        .story-prose ol {
          margin: 1.25rem 0;
          padding-left: 1.5rem;
        }
        .story-prose li {
          margin: 0.4rem 0;
        }
        .story-prose h2,
        .story-prose h3 {
          margin-top: 2rem;
          margin-bottom: 0.75rem;
        }
        .story-prose p {
          margin-bottom: 1.15rem;
        }
        .story-prose p:last-child {
          margin-bottom: 0;
        }
      `}</style>
    </section>
  );
}
