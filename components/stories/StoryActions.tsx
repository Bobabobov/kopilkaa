// components/stories/StoryActions.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";

export default function StoryActions() {
  return (
    <div className="mt-12 flex flex-col sm:flex-row gap-6 justify-center">
      <div>
        <Link
          href="/stories"
          className="inline-flex items-center px-8 py-4 bg-white/90 backdrop-blur-xl hover:bg-gray-50 font-semibold rounded-2xl transition-all duration-300 border shadow-lg hover:shadow-xl group"
          style={{ 
            borderColor: '#abd1c6/30',
            color: '#2d5a4e'
          }}
        >
          <LucideIcons.BookOpen size="md" className="mr-3 group-hover:rotate-12 transition-transform duration-300" />
          Все истории
        </Link>
      </div>
      
      <div>
        <Link
          href="/applications"
          className="inline-flex items-center px-8 py-4 text-white font-semibold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 group"
          style={{ background: 'linear-gradient(135deg, #f9bc60 0%, #e8a94a 100%)' }}
        >
          <LucideIcons.Plus size="md" className="mr-3 group-hover:rotate-90 transition-transform duration-300" />
          Подать заявку
        </Link>
      </div>
    </div>
  );
}