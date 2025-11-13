// components/heroes/HeroesErrorState.tsx
"use client";
import { motion } from "framer-motion";

interface HeroesErrorStateProps {
  error: string;
  onRetry?: () => void;
}

export default function HeroesErrorState({ error, onRetry }: HeroesErrorStateProps) {
  return (
    <div className="py-12 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="p-12 rounded-3xl backdrop-blur-sm border"
          style={{
            backgroundColor: "rgba(0, 70, 67, 0.6)",
            borderColor: "rgba(225, 97, 98, 0.3)",
          }}
        >
          <div className="text-6xl mb-6">⚠️</div>
          
          <h3 className="text-3xl font-bold mb-4" style={{ color: "#fffffe" }}>
            Что-то пошло не так
          </h3>
          
          <p className="text-lg mb-8" style={{ color: "#e16162" }}>
            {error}
          </p>

          {onRetry && (
            <button
              onClick={onRetry}
              className="px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-200 hover:scale-105"
              style={{
                backgroundColor: "#f9bc60",
                color: "#001e1d",
              }}
            >
              Попробовать снова
            </button>
          )}
        </motion.div>
      </div>
    </div>
  );
}
