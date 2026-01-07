"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { buildAuthModalUrl } from "@/lib/authModalUrl";

const steps = [
  {
    icon: "User",
    title: "Зарегистрируйтесь",
    description: "Быстро и без лишних формальностей",
    details:
      "Создайте аккаунт, заполните базовую информацию и получите доступ к подаче истории.",
    color: "#22c55e",
  },
  {
    icon: "FileText",
    title: "Расскажите свою ситуацию",
    description: "Кратко и по делу",
    details:
      "Опишите, зачем вам нужна финансовая помощь. Это может быть любая жизненная ситуация, в которой вам сейчас неоткуда взять деньги.",
    color: "#22c55e",
  },
  {
    icon: "Clock",
    title: "Ожидайте решения",
    description: "Решение принимает платформа",
    details:
      "Каждая история рассматривается индивидуально. Сайт самостоятельно принимает решение о возможности финансовой поддержки.",
    color: "#22c55e",
  },
  {
    icon: "DollarSign",
    title: "Получите помощь",
    description: "Без возврата и обязательств",
    details:
      "Если история одобрена — вы получаете деньги. Возвращать средства не нужно.",
    color: "#22c55e",
  },
];

export default function HowItWorks() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Проверяем авторизацию
    fetch("/api/profile/me", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        setIsAuthenticated(!!d.user);
      })
      .catch(() => {
        setIsAuthenticated(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleStartClick = () => {
    if (loading) return;
    
    if (isAuthenticated) {
      // Если пользователь авторизован, ведем на создание заявки
      window.location.href = "/applications";
    } else {
      // Если не авторизован, открываем модалку входа/регистрации
      window.location.href = buildAuthModalUrl({
        pathname: window.location.pathname,
        search: window.location.search,
        modal: "auth/signup",
      });
    }
  };

  return (
    <section className="py-24 px-4" id="how-it-works">
      <div className="max-w-6xl mx-auto">
        {/* Заголовок секции */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: "#fffffe" }}>
            Как это работает
          </h2>
          <p className="text-xl md:text-2xl font-semibold mb-2" style={{ color: "#abd1c6" }}>
            4 шага — коротко и по делу.
          </p>
        </motion.div>

        {/* Шаги */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = LucideIcons[step.icon as keyof typeof LucideIcons];
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative"
              >
                {/* Линия соединения (не на последнем элементе) */}
                {index < steps.length - 1 && (
                  <div
                    className="hidden lg:block absolute top-12 left-full w-full h-0.5 -z-10"
                    style={{
                      background: `linear-gradient(to right, ${step.color}, ${steps[index + 1].color})`,
                      opacity: 0.3,
                    }}
                  />
                )}

                {/* Карточка шага */}
                <div className="relative bg-white/[0.04] backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300 hover:transform hover:scale-[1.02] h-full group overflow-hidden">
                  {/* Фоновая декорация */}
                  <div 
                    className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity"
                    style={{ backgroundColor: step.color }}
                  />

                  {/* Номер */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex flex-col items-start gap-2">
                      <span
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border"
                        style={{
                          backgroundColor: `${step.color}20`,
                          borderColor: `${step.color}55`,
                          color: step.color,
                        }}
                      >
                        Шаг {index + 1}
                      </span>
                      <div
                        className="text-5xl font-black leading-none"
                        style={{
                          color: step.color,
                          textShadow: `0 0 20px ${step.color}40`,
                        }}
                      >
                        {index + 1}
                      </div>
                    </div>
                    
                    {/* Иконка */}
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
                      style={{ 
                        backgroundColor: `${step.color}30`,
                        boxShadow: `0 4px 20px ${step.color}20`
                      }}
                    >
                      {Icon && (
                        <div style={{ color: step.color }}>
                          <Icon size="lg" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Заголовок */}
                  <h3 className="text-xl font-bold mb-2" style={{ color: "#fffffe" }}>
                    {step.title}
                  </h3>

                  {/* Описание */}
                  <p className="text-lg font-semibold mb-2" style={{ color: step.color }}>
                    {step.description}
                  </p>
                  
                  {/* Детали */}
                  <p className="text-sm leading-relaxed" style={{ color: "#abd1c6" }}>
                    {step.details}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Дисклеймер */}
        <div className="mt-10 text-center">
          <p className="text-xs md:text-sm max-w-3xl mx-auto" style={{ color: "#94a1b2" }}>
            «Копилка» — это платформа, которая самостоятельно оказывает финансовую поддержку пользователям.
            Средства предоставляются безвозмездно и не являются займом.
          </p>
        </div>

        {/* CTA кнопка */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-16"
        >
          <button
            onClick={handleStartClick}
            disabled={loading}
            className="inline-flex items-center gap-3 px-10 py-5 text-lg font-bold rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            style={{
              background: "linear-gradient(135deg, #f9bc60 0%, #e8a545 100%)",
              color: "#001e1d",
              boxShadow: "0 10px 40px rgba(249, 188, 96, 0.3)",
            }}
          >
            <span>
              {loading ? "Загрузка..." : "Рассказать историю"}
            </span>
            {!loading && (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>
        </motion.div>
      </div>
    </section>
  );
}