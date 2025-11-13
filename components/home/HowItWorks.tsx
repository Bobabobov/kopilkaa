"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { LucideIcons } from "@/components/ui/LucideIcons";

const steps = [
  {
    icon: "User",
    title: "Регистрируйтесь",
    description: "Простая регистрация за минуту",
    details: "Быстро, просто и без лишних формальностей. Заполняете базовую информацию и готово",
    color: "#f9bc60",
  },
  {
    icon: "FileText",
    title: "Расскажите историю",
    description: "Любая житейская ситуация",
    details: "Нужны деньги на пиво? Не хватает на проезд? Хочется пиццу? Рассказывайте любые истории из жизни",
    color: "#e16162",
  },
  {
    icon: "Clock",
    title: "Ждите решение",
    description: "Без сроков и гарантий",
    details: "Ваша история попадает в очередь. Решение принимается лично владельцем или на стриме. Может быть да, может быть нет",
    color: "#abd1c6",
  },
  {
    icon: "DollarSign",
    title: "Получите результат",
    description: "Деньги или опыт",
    details: "Если повезет — получите деньги в личном кабинете. Если нет — получите опыт участия в эксперименте",
    color: "#f9bc60",
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
      // Если не авторизован, ведем на регистрацию
      window.location.href = "/register";
    }
  };

  return (
    <section className="py-20 px-4" id="how-it-works">
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
            💡 Как это работает?
          </h2>
          <p className="text-xl md:text-2xl font-semibold mb-2" style={{ color: "#abd1c6" }}>
            Четыре простых шага.
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
                <div className="relative bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300 hover:transform hover:scale-105 h-full group overflow-hidden">
                  {/* Фоновая декорация */}
                  <div 
                    className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity"
                    style={{ backgroundColor: step.color }}
                  />

                  {/* Номер */}
                  <div className="flex items-center gap-4 mb-6">
                    <div
                      className="text-5xl font-black"
                      style={{ 
                        color: step.color,
                        textShadow: `0 0 20px ${step.color}40`
                      }}
                    >
                      {index + 1}
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
              {loading ? "Загрузка..." : isAuthenticated ? "Рассказать историю" : "Попробовать удачу"}
            </span>
            {!loading && (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>
          <p className="mt-6 text-base md:text-lg font-medium max-w-2xl mx-auto" style={{ color: "#abd1c6" }}>
            {isAuthenticated 
              ? "💫 Расскажите что угодно — от серьёзного до абсурдного" 
              : "🎲 Присоединяйтесь к социальному эксперименту без правил"
            }
          </p>
          <p className="mt-2 text-sm" style={{ color: "#94a1b2" }}>
            {isAuthenticated 
              ? "Никаких гарантий — только честная игра и персональные решения" 
              : "Играйте, донатьте, смотрите стримы и участвуйте в рейтингах"
            }
          </p>
        </motion.div>
      </div>
    </section>
  );
}