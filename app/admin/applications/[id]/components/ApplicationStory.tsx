// app/admin/applications/[id]/components/ApplicationStory.tsx
"use client";
import { motion } from "framer-motion";

interface ApplicationStoryProps {
  story: string;
}

export default function ApplicationStory({ story }: ApplicationStoryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.7 }}
      className="mb-6"
    >
      <h3 className="flex items-center gap-2 text-lg sm:text-xl font-semibold mb-4" style={{ color: "#fffffe" }}>
        <svg
          className="w-5 h-5 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
        История
      </h3>
      <div 
        className="break-words text-[15px] sm:text-base lg:text-[17px] leading-8 sm:leading-8 lg:leading-9 rounded-xl sm:rounded-2xl p-5 sm:p-7 lg:p-9 border prose prose-sm sm:prose-base max-w-none shadow-[0_18px_48px_-30px_rgba(0,0,0,0.9)]"
        style={{ 
          backgroundColor: "#0e1f1d",
          borderColor: "rgba(171, 209, 198, 0.35)",
          color: "#f8fbfa"
        }}
        dangerouslySetInnerHTML={{ __html: story }}
      />
      <style jsx global>{`
        .prose {
          color: #f8fbfa !important;
        }
        .prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6 {
          color: #f8fbfa !important;
        }
        .prose strong {
          color: #f8fbfa !important;
        }
        .prose ul, .prose ol {
          color: #f8fbfa !important;
        }
        .prose a {
          color: #f9bc60 !important;
        }
        .prose [style*="text-align: left"] {
          text-align: left;
        }
        .prose [style*="text-align: center"] {
          text-align: center;
        }
        .prose [style*="text-align: right"] {
          text-align: right;
        }
      `}</style>
    </motion.div>
  );
}


