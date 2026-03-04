// components/heroes/HeroesErrorState.tsx
"use client";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/Card";
import { LucideIcons } from "@/components/ui/LucideIcons";

interface HeroesErrorStateProps {
  error: string;
  onRetry?: () => void;
}

export default function HeroesErrorState({ error, onRetry }: HeroesErrorStateProps) {
  return (
    <div className="py-12 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <Card variant="darkGlass" padding="lg" className="border-red-400/20">
            <CardContent>
              <div className="mb-6 flex justify-center">
                <LucideIcons.AlertTriangle className="w-14 h-14 sm:w-16 sm:h-16 text-amber-400" />
              </div>
              <h3 className="text-3xl font-bold mb-4 text-[#fffffe]">Что-то пошло не так</h3>
              <p className="text-lg mb-8 text-red-400">{error}</p>
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="px-8 py-4 text-lg font-semibold rounded-xl transition-all hover:opacity-90"
                  style={{
                    background: "linear-gradient(135deg, #e8a545 0%, #f9bc60 50%, #e8a545 100%)",
                    color: "#001e1d",
                    boxShadow: "0 8px 24px rgba(249, 188, 96, 0.25)",
                  }}
                >
                  Попробовать снова
                </button>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
