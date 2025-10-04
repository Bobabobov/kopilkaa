"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  index: number;
}

export function ImageWithFallback({ src, alt, index }: ImageWithFallbackProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleLoad = () => {
    setImageLoading(false);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="relative group rounded-lg overflow-hidden border border-slate-200 dark:border-slate-600 bg-slate-100 dark:bg-slate-700"
    >
      {imageLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-slate-700">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full"
          />
        </div>
      )}
      
      {imageError ? (
        <div className="w-full h-20 flex items-center justify-center bg-slate-100 dark:bg-slate-700">
          <div className="text-center">
            <LucideIcons.Image size="md" className="text-slate-400 mx-auto mb-1" />
            <span className="text-xs text-slate-500 dark:text-slate-400">Фото {index + 1}</span>
          </div>
        </div>
      ) : (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            className="w-full h-20 object-cover group-hover:scale-105 transition-transform duration-300"
            onError={handleError}
            onLoad={handleLoad}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
        </>
      )}
    </motion.div>
  );
}

















