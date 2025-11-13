// components/heroes/HeroesLoading.tsx
"use client";
import { motion } from "framer-motion";
import PixelBackground from "@/components/ui/PixelBackground";

export default function HeroesLoading() {
  return (
    <div className="min-h-screen">
      <PixelBackground />
      <div className="relative z-10">
        {/* Загрузка Hero секции */}
        <div className="min-h-screen flex items-center justify-center px-4 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="text-6xl mb-8"
            >
              ⭐
            </motion.div>
            
            <div className="animate-pulse space-y-6">
              <div
                className="h-16 rounded-2xl mx-auto"
                style={{ 
                  width: "400px", 
                  backgroundColor: "rgba(0, 70, 67, 0.6)" 
                }}
              />
              <div
                className="h-8 rounded-xl mx-auto"
                style={{ 
                  width: "600px", 
                  backgroundColor: "rgba(0, 70, 67, 0.4)" 
                }}
              />
              <div
                className="h-8 rounded-xl mx-auto"
                style={{ 
                  width: "500px", 
                  backgroundColor: "rgba(0, 70, 67, 0.4)" 
                }}
              />
              <div className="flex gap-4 justify-center mt-8">
                <div
                  className="h-12 w-32 rounded-xl"
                  style={{ backgroundColor: "rgba(249, 188, 96, 0.6)" }}
                />
                <div
                  className="h-12 w-32 rounded-xl"
                  style={{ backgroundColor: "rgba(0, 70, 67, 0.6)" }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Загрузка статистики */}
        <div className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div
                className="h-10 rounded-xl mx-auto mb-12"
                style={{ 
                  width: "300px", 
                  backgroundColor: "rgba(0, 70, 67, 0.6)" 
                }}
              />
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="p-6 rounded-2xl backdrop-blur-sm border"
                    style={{
                      backgroundColor: "rgba(0, 70, 67, 0.6)",
                      borderColor: "rgba(171, 209, 198, 0.3)",
                    }}
                  >
                    <div className="h-8 w-8 mx-auto mb-3 rounded" style={{ backgroundColor: "rgba(0, 70, 67, 0.8)" }} />
                    <div className="h-8 rounded mb-2" style={{ backgroundColor: "rgba(0, 70, 67, 0.8)" }} />
                    <div className="h-4 rounded w-20 mx-auto" style={{ backgroundColor: "rgba(0, 70, 67, 0.6)" }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
