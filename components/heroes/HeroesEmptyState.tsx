// components/heroes/HeroesEmptyState.tsx
"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export default function HeroesEmptyState() {
  return (
    <div className="py-12 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="p-12 rounded-3xl backdrop-blur-sm border"
          style={{
            backgroundColor: "rgba(0, 70, 67, 0.6)",
            borderColor: "rgba(171, 209, 198, 0.3)",
          }}
        >
          <div className="text-6xl mb-6">🌟</div>
          
          <h3 className="text-3xl font-bold mb-4" style={{ color: "#fffffe" }}>
            Пока здесь пусто
          </h3>
          
          <p className="text-lg mb-8 leading-relaxed" style={{ color: "#abd1c6" }}>
            В этом разделе отображаются пользователи, которые добровольно поддержали развитие проекта.
            Здесь мы публично говорим “спасибо” за вклад и участие.
          </p>

          <div className="space-y-4">
            <Link
              href="/support"
              className="inline-block px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-200 hover:scale-105"
              style={{
                backgroundColor: "#f9bc60",
                color: "#001e1d",
              }}
            >
              💛 Поддержать проект
            </Link>
            
            <div>
              <Link
                href="/"
                className="text-sm transition-colors duration-200 hover:underline"
                style={{ color: "#abd1c6" }}
              >
                ← Вернуться на главную
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
