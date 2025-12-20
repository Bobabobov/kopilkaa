// app/admin/components/ApplicationCardStory.tsx
"use client";
import { truncateHTML } from "./utils";

interface ApplicationCardStoryProps {
  story: string;
}

export default function ApplicationCardStory({
  story,
}: ApplicationCardStoryProps) {
  const truncatedStory = (() => {
    const textLength = story.replace(/<[^>]*>/g, '').length;
    return textLength > 260 ? truncateHTML(story, 260) : story;
  })();

  return (
    <div className="bg-[#001e1d]/40 rounded-xl sm:rounded-2xl p-3 sm:p-4 mb-4 sm:mb-6 border border-[#abd1c6]/10">
      <div 
        className="text-[#abd1c6] break-words max-w-full leading-relaxed prose prose-sm max-w-none prose-headings:text-[#fffffe] prose-p:text-[#abd1c6] prose-strong:text-[#fffffe] prose-a:text-[#f9bc60] prose-ul:text-[#abd1c6] prose-ol:text-[#abd1c6] prose-li:text-[#abd1c6]"
        dangerouslySetInnerHTML={{ __html: truncatedStory }}
      />
    </div>
  );
}

