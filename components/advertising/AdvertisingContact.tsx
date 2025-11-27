"use client";

import { useState } from "react";
import { LucideIcons } from "@/components/ui/LucideIcons";

export function AdvertisingContact() {
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    format: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Если в контакте есть @ — это email, иначе считаем, что это телефон
      const isEmail = formData.contact.includes("@");
      const contact = formData.contact.trim();

      const email = isEmail ? contact : "ads@kopilka.local";

      const commentPrefix = isEmail
        ? `Контакт: ${contact}\n\n`
        : `Телефон: ${contact}\n\n`;

      const body = {
        companyName: formData.name.trim(),
        email,
        website: null,
        format: formData.format || "other",
        duration: 7, // по умолчанию 7 дней
        bannerUrl: null,
        comment: `${commentPrefix}${formData.message}`.trim() || null,
      };

      const response = await fetch("/api/ad-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        console.error("Failed to send ad request", await response.text());
        alert("Не удалось отправить заявку. Попробуйте ещё раз позже.");
        setIsSubmitting(false);
        return;
      }

      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({
        name: "",
        contact: "",
        format: "",
        message: "",
      });
    } catch (error) {
      console.error("Error sending ad request:", error);
      alert("Произошла ошибка при отправке заявки.");
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (isSubmitted) {
    return (
      <section id="contact" className="py-24 px-4 bg-[#001e1d] border-t border-[#abd1c6]/10">
        <div className="container mx-auto max-w-3xl text-center">
          {/* Анимированная галочка */}
          <div className="relative mb-8">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-[#abd1c6] to-[#f9bc60] rounded-full flex items-center justify-center shadow-2xl shadow-[#abd1c6]/30">
              <div className="text-4xl text-[#001e1d] font-bold">✓</div>
            </div>
            {/* Кольца вокруг */}
            <div className="absolute inset-0 w-24 h-24 mx-auto border-4 border-[#abd1c6]/20 rounded-full animate-ping"></div>
            <div className="absolute inset-2 w-20 h-20 mx-auto border-2 border-[#f9bc60]/30 rounded-full animate-pulse"></div>
          </div>

          {/* Заголовок */}
          <h2 className="text-4xl md:text-5xl font-bold text-[#fffffe] mb-6 flex items-center justify-center gap-3">
            <LucideIcons.CheckCircle className="text-[#abd1c6]" size="xl" />
            Отлично! Заявка отправлена
          </h2>
          
          {/* Основное сообщение */}
          <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 mb-8">
            <p className="text-xl md:text-2xl text-[#abd1c6] mb-4">
              Мы уже изучаем вашу заявку и готовим персональное предложение!
            </p>
            <p className="text-lg text-[#94a1b2] flex items-center justify-center gap-2">
              Свяжемся с вами в течение <span className="text-[#f9bc60] font-semibold">15-30 минут</span>. 
              Обычно быстрее! 
              <LucideIcons.Smartphone className="text-[#f9bc60]" size="sm" />
            </p>
          </div>

          {/* Что будет дальше */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="mb-3 flex justify-center">
                <LucideIcons.Phone className="text-[#abd1c6]" size="xl" />
              </div>
              <h3 className="text-lg font-semibold text-[#fffffe] mb-2">Свяжемся</h3>
              <p className="text-sm text-[#abd1c6]">Позвоним или напишем для уточнения деталей</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="mb-3 flex justify-center">
                <LucideIcons.Zap className="text-[#f9bc60]" size="xl" />
              </div>
              <h3 className="text-lg font-semibold text-[#fffffe] mb-2">Предложим</h3>
              <p className="text-sm text-[#abd1c6]">Подберём оптимальный формат и тариф</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="mb-3 flex justify-center">
                <LucideIcons.Rocket className="text-[#e16162]" size="xl" />
              </div>
              <h3 className="text-lg font-semibold text-[#fffffe] mb-2">Запустим</h3>
              <p className="text-sm text-[#abd1c6]">Начнём рекламу уже сегодня</p>
            </div>
          </div>

          {/* Контакты для срочности */}
          <div className="bg-gradient-to-r from-[#f9bc60]/10 to-[#abd1c6]/10 backdrop-blur-sm rounded-2xl p-6 border border-[#f9bc60]/20 mb-8">
            <p className="text-[#fffffe] font-medium mb-2 flex items-center justify-center gap-2">
              <LucideIcons.Alert className="text-[#e16162]" size="sm" />
              Нужно срочно? Напишите в Telegram:
            </p>
            <a 
              href="https://t.me/bobabobovv" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[#f9bc60] hover:text-[#e8a545] font-semibold transition-colors"
            >
              <LucideIcons.Smartphone className="text-[#f9bc60]" size="sm" />
              <span>@bobabobovv</span>
            </a>
          </div>

          {/* Кнопка возврата */}
          <button
            onClick={() => setIsSubmitted(false)}
            className="inline-flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-2xl border border-white/20 transition-all duration-300 hover:scale-105 text-[#fffffe] font-medium"
          >
            <LucideIcons.ArrowLeft className="text-[#abd1c6]" size="sm" />
            <span>Отправить ещё одну заявку</span>
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="py-24 px-4 bg-[#001e1d] border-t border-[#abd1c6]/10">
      <div className="container mx-auto max-w-3xl">
        <div className="mb-12">
          <h2 className="text-5xl font-bold text-[#fffffe] mb-4">Оставьте заявку</h2>
          <p className="text-xl text-[#abd1c6]">
            Расскажите о себе. Остальное обсудим лично.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Простые поля без лишнего */}
          <div>
            <label className="block text-[#fffffe] text-lg mb-3">
              Как вас зовут?
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-6 py-4 bg-[#004643] border-2 border-[#abd1c6]/20 text-[#fffffe] text-lg focus:border-[#f9bc60] focus:outline-none placeholder-[#abd1c6]/40"
              placeholder="Иван"
            />
          </div>

          <div>
            <label className="block text-[#fffffe] text-lg mb-3">
              Телефон или email (как удобнее)
            </label>
            <input
              type="text"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              required
              className="w-full px-6 py-4 bg-[#004643] border-2 border-[#abd1c6]/20 text-[#fffffe] text-lg focus:border-[#f9bc60] focus:outline-none placeholder-[#abd1c6]/40"
              placeholder="+7 999 123-45-67 или your@email.com"
            />
          </div>

          <div>
            <label className="block text-[#fffffe] text-lg mb-3">
              Что хотите рекламировать?
            </label>
            <select
              name="format"
              value={formData.format}
              onChange={handleChange}
              required
              className="w-full px-6 py-4 bg-[#004643] border-2 border-[#abd1c6]/20 text-[#fffffe] text-lg focus:border-[#f9bc60] focus:outline-none"
            >
              <option value="">Выберите или напишите в сообщении</option>
              <option value="banner">Большой баннер наверху (3000₽)</option>
              <option value="side">Блок сбоку (1500₽)</option>
              <option value="story">Рекламная история (2000₽)</option>
              <option value="tg">Telegram пост (1000₽)</option>
              <option value="other">Не знаю, помогите выбрать</option>
            </select>
          </div>

          <div>
            <label className="block text-[#fffffe] text-lg mb-3">
              Что-то ещё? (не обязательно)
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={5}
              className="w-full px-6 py-4 bg-[#004643] border-2 border-[#abd1c6]/20 text-[#fffffe] text-lg focus:border-[#f9bc60] focus:outline-none placeholder-[#abd1c6]/40 resize-none"
              placeholder="Например: у меня интернет-магазин цветов, хочу больше заказов"
            ></textarea>
          </div>

          {/* Большая кнопка */}
          <button
            type="submit"
            className="w-full bg-[#f9bc60] text-[#001e1d] py-6 text-xl font-bold hover:bg-[#e8a545] transition-colors disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Отправляем..." : "Отправить заявку"}
          </button>

          {/* Маленькая заметка */}
          <p className="text-[#abd1c6] text-center">
            Отвечаем обычно за 15-30 минут. Если долго — напишите в Telegram.
          </p>
        </form>
      </div>
    </section>
  );
}
