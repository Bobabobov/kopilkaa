"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";

const formats = [
  {
    id: "top-banner",
    name: "Горизонтальный баннер",
    description: "Верх страницы, 100% × 250px, видно всем посетителям",
    price: "от 3000 ₽",
    duration: "7 дней",
    icon: "Megaphone",
  },
  {
    id: "banner",
    name: "Баннер сбоку",
    description: "320×112 px, левый блок, видимость только на главной странице",
    price: "от 1500 ₽",
    duration: "7 дней",
    icon: "Image",
  },
  {
    id: "post",
    name: "Рекламный пост",
    description: "Публикация с вашим контентом в разделе историй",
    price: "от 2000 ₽",
    duration: "постоянно",
    icon: "FileText",
  },
  {
    id: "telegram",
    name: "Упоминание в Telegram",
    description: "Пост в нашем Telegram-канале с вашей рекламой",
    price: "от 1000 ₽",
    duration: "разовое",
    icon: "Send",
  },
];

const steps = [
  {
    number: "1",
    title: "Отправляете заявку",
    description: "Заполняете форму ниже с деталями вашей рекламы",
    icon: "Edit",
  },
  {
    number: "2",
    title: "Мы связываемся",
    description: "Наш менеджер свяжется с вами для уточнения деталей",
    icon: "MessageCircle",
  },
  {
    number: "3",
    title: "Реклама на сайте",
    description: "После оплаты ваша реклама появляется на платформе",
    icon: "CheckCircle",
  },
];

export default function AdvertisingPage() {
  const [formData, setFormData] = useState({
    companyName: "",
    email: "",
    website: "",
    format: "",
    duration: "7",
    comment: "",
    agreed: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.agreed) {
      setSubmitStatus({
        type: "error",
        message: "Пожалуйста, согласитесь с условиями размещения",
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      const response = await fetch("/api/ad-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: formData.companyName,
          email: formData.email,
          website: formData.website,
          format: formData.format,
          duration: parseInt(formData.duration),
          comment: formData.comment,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus({
          type: "success",
          message: data.message || "Спасибо! Мы свяжемся с вами в ближайшее время.",
        });
        // Сброс формы
        setFormData({
          companyName: "",
          email: "",
          website: "",
          format: "",
          duration: "7",
          comment: "",
          agreed: false,
        });
      } else {
        setSubmitStatus({
          type: "error",
          message: data.error || "Произошла ошибка при отправке заявки",
        });
      }
    } catch (error) {
      console.error("Error submitting ad request:", error);
      setSubmitStatus({
        type: "error",
        message: "Произошла ошибка при отправке заявки",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-6" style={{ backgroundColor: "#004643" }}>
      <div className="max-w-6xl mx-auto">
        {/* Блок 1: Заголовок */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold text-[#fffffe] mb-4">
            📢 Реклама на сайте Копилка
          </h1>
          <p className="text-xl text-[#abd1c6] max-w-3xl mx-auto leading-relaxed">
            Копилка — это платформа взаимопомощи, где люди помогают друг другу
            достичь целей. Более <span className="font-bold text-[#f9bc60]">1000+</span> активных
            пользователей ежедневно посещают наш сайт.
          </p>
        </motion.div>

        {/* Блок 2: Форматы размещения */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-[#fffffe] mb-8 text-center">
            🎯 Форматы размещения
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {formats.map((format, index) => (
              <motion.div
                key={format.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
                className="group relative"
              >
                <div className="absolute -inset-1 bg-gradient-to-br from-[#6B9071] via-[#AEC3B0] to-[#375534] rounded-xl blur-lg opacity-30 group-hover:opacity-50 transition duration-500"></div>
                <div className="relative p-6 bg-gradient-to-br from-[#004643] via-[#004643] to-[#001e1d] rounded-xl border border-[#abd1c6]/30 hover:border-[#abd1c6]/50 transition-all duration-300 hover:scale-105">
                  <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-[#f9bc60] to-[#f9bc60] rounded-lg flex items-center justify-center shadow-lg">
                    {format.icon === "Megaphone" && <LucideIcons.Megaphone size="md" className="text-[#001e1d]" />}
                    {format.icon === "Image" && <LucideIcons.Image size="md" className="text-[#001e1d]" />}
                    {format.icon === "FileText" && <LucideIcons.FileText size="md" className="text-[#001e1d]" />}
                    {format.icon === "Send" && <LucideIcons.Send size="md" className="text-[#001e1d]" />}
                  </div>
                  <h3 className="text-xl font-bold text-[#fffffe] mb-2 text-center">
                    {format.name}
                  </h3>
                  <p className="text-sm text-[#abd1c6] mb-4 text-center min-h-[40px]">
                    {format.description}
                  </p>
                  <div className="pt-4 border-t border-[#abd1c6]/20">
                    <div className="text-2xl font-bold text-[#f9bc60] mb-1 text-center">
                      {format.price}
                    </div>
                    <div className="text-xs text-[#abd1c6] text-center">
                      {format.duration}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Блок 3: Как это работает */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-[#fffffe] mb-8 text-center">
            ⚙️ Как это работает
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                className="relative"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 mb-4 bg-gradient-to-br from-[#f9bc60] to-[#f9bc60] rounded-full flex items-center justify-center text-2xl font-bold text-[#001e1d] shadow-lg">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-bold text-[#fffffe] mb-2">
                    {step.title}
                  </h3>
                  <p className="text-[#abd1c6]">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-[#f9bc60]/50 to-transparent"></div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Блок 4: Примеры рекламы */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-[#fffffe] mb-8 text-center">
            👀 Примеры рекламных блоков
          </h2>
          <p className="text-[#abd1c6] text-center mb-12 max-w-3xl mx-auto">
            Посмотрите, как выглядят рекламные блоки на нашем сайте. Все форматы полностью адаптивные и не мешают основному контенту.
          </p>

          {/* Горизонтальный баннер */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-[#fffffe] mb-6">
              1. Горизонтальный баннер (TopBanner)
            </h3>
            <div className="bg-gradient-to-r from-[#004643] to-[#001e1d] border border-[#abd1c6]/30 rounded-lg shadow-2xl overflow-hidden">
              <div className="p-4" style={{ minHeight: '250px' }}>
                <div className="flex items-center justify-between gap-4 h-full">
                  {/* Левая часть - контент */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {/* Иконка */}
                    <div className="flex-shrink-0 text-[#f9bc60]">
                      <LucideIcons.Megaphone size="md" />
                    </div>
                    
                    {/* Текст */}
                    <div className="text-[#abd1c6]">
                      <h4 className="text-xl font-bold text-[#fffffe] mb-2">
                        🔥 МЕГА СКИДКА 50% НА ВСЕ ТОВАРЫ!
                      </h4>
                      <p className="text-sm">
                        Только 3 дня! Скидка на весь ассортимент магазина. Не упустите возможность сэкономить!
                      </p>
                    </div>
                  </div>

                  {/* Правая часть - кнопки */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    {/* Ссылка на рекламу */}
                    <a
                      href="#"
                      className="px-4 py-2 text-sm font-semibold rounded-lg bg-[#f9bc60] text-[#001e1d] hover:bg-[#f9bc60]/90 transition-all duration-200"
                    >
                      Перейти к акции
                    </a>

                    {/* Кнопка закрытия */}
                    <button className="p-2 rounded-lg hover:bg-[#abd1c6]/20 transition-all duration-200">
                      <LucideIcons.X size="sm" className="text-[#abd1c6]" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-[#001e1d] rounded-lg">
              <h4 className="text-[#f9bc60] font-semibold mb-2">Технические характеристики:</h4>
              <ul className="text-[#abd1c6] text-sm space-y-1">
                <li>• <strong>Размер:</strong> 100% × 250px (полная ширина экрана)</li>
                <li>• <strong>Позиция:</strong> Верх страницы (под адресной строкой)</li>
                <li>• <strong>Изображение:</strong> 100% × 150px (соотношение 16:9)</li>
                <li>• <strong>Заголовок:</strong> 30-60 символов</li>
                <li>• <strong>Описание:</strong> 80-150 символов</li>
                <li>• <strong>Адаптивность:</strong> Полностью адаптивный дизайн</li>
              </ul>
            </div>
          </div>

          {/* Боковые блоки */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-[#fffffe] mb-6">
              2. Боковые рекламные блоки (AdSection)
            </h3>
            
            <div className="max-w-md mx-auto">
              {/* AdSection */}
              <div>
                <h4 className="text-lg font-semibold text-[#f9bc60] mb-4 text-center">AdSection (левый блок)</h4>
                <div className="w-80 mx-auto bg-gradient-to-b from-[#004643] to-[#001e1d] border border-[#abd1c6]/30 rounded-lg shadow-2xl p-6">
                  {/* Заголовок */}
                  <h5 className="text-base font-bold text-[#fffffe] mb-2">
                    Скидка 30% на все товары!
                  </h5>
                  
                  {/* Описание */}
                  <p className="text-xs text-[#abd1c6] leading-relaxed mb-4">
                    Только до конца месяца скидка на весь ассортимент магазина. Успейте купить!
                  </p>
                  
                  {/* Изображение */}
                  <div className="w-full h-28 bg-[#001e1d] rounded-lg mb-4 flex items-center justify-center border border-[#abd1c6]/20">
                    <span className="text-[#abd1c6]/50 text-xs">320×112px</span>
                  </div>
                  
                  {/* Ссылка */}
                  <a
                    href="#"
                    className="block text-center text-xs font-medium text-[#f9bc60] hover:text-[#f9bc60]/80 transition-colors"
                  >
                    Перейти к магазину →
                  </a>
                </div>
                
                <div className="mt-4 p-3 bg-[#001e1d] rounded-lg">
                  <h5 className="text-[#f9bc60] font-semibold mb-2 text-sm">AdSection:</h5>
                  <ul className="text-[#abd1c6] text-xs space-y-1">
                    <li>• <strong>Размер:</strong> 320px × 400-500px</li>
                    <li>• <strong>Изображение:</strong> 320×112px</li>
                    <li>• <strong>Позиция:</strong> Левый верхний угол</li>
                    <li>• <strong>Видимость:</strong> Только на главной странице и больших экранах (xl+)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Рекомендации */}
          <div className="bg-gradient-to-r from-[#004643] to-[#001e1d] border border-[#abd1c6]/30 rounded-lg p-6">
            <h3 className="text-xl font-bold text-[#fffffe] mb-4">
              💡 Рекомендации по использованию
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-[#f9bc60] font-semibold mb-3">Горизонтальный баннер</h4>
                <ul className="text-[#abd1c6] text-sm space-y-2">
                  <li>• Используйте для важных объявлений</li>
                  <li>• Подходит для акций и скидок</li>
                  <li>• Обращает внимание всех посетителей</li>
                  <li>• Можно закрыть пользователем</li>
                </ul>
              </div>
              <div>
                <h4 className="text-[#f9bc60] font-semibold mb-3">Боковые рекламные блоки</h4>
                <ul className="text-[#abd1c6] text-sm space-y-2">
                  <li>• Не мешают основному контенту</li>
                  <li>• Подходят для постоянной рекламы</li>
                  <li>• Видны только на главной странице и больших экранах (xl+)</li>
                  <li>• Левый блок - идеальное место для рекламы</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Блок 5: Форма заявки */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="max-w-3xl mx-auto"
        >
          <div className="p-8 bg-[#001e1d] rounded-xl border border-[#abd1c6]/30">
            <h2 className="text-3xl font-bold text-[#fffffe] mb-6 text-center">
              📝 Отправить заявку на рекламу
            </h2>

            {submitStatus.type && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`mb-6 p-4 rounded-lg ${
                  submitStatus.type === "success"
                    ? "bg-green-500/20 border border-green-500/50"
                    : "bg-red-500/20 border border-red-500/50"
                }`}
              >
                <p
                  className={`${
                    submitStatus.type === "success"
                      ? "text-green-300"
                      : "text-red-300"
                  }`}
                >
                  {submitStatus.message}
                </p>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[#abd1c6] mb-2">
                  Название компании / проекта <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) =>
                    setFormData({ ...formData, companyName: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-[#004643] border border-[#abd1c6]/30 rounded-lg text-[#fffffe] placeholder-[#abd1c6]/50 focus:border-[#f9bc60] focus:outline-none transition-colors"
                  placeholder="ООО «Ваша компания»"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#abd1c6] mb-2">
                  Контактный email <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-[#004643] border border-[#abd1c6]/30 rounded-lg text-[#fffffe] placeholder-[#abd1c6]/50 focus:border-[#f9bc60] focus:outline-none transition-colors"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#abd1c6] mb-2">
                  Ссылка на сайт / соцсеть
                </label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) =>
                    setFormData({ ...formData, website: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-[#004643] border border-[#abd1c6]/30 rounded-lg text-[#fffffe] placeholder-[#abd1c6]/50 focus:border-[#f9bc60] focus:outline-none transition-colors"
                  placeholder="https://example.com"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#abd1c6] mb-2">
                    Формат размещения <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={formData.format}
                    onChange={(e) =>
                      setFormData({ ...formData, format: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-[#004643] border border-[#abd1c6]/30 rounded-lg text-[#fffffe] focus:border-[#f9bc60] focus:outline-none transition-colors"
                    required
                  >
                    <option value="">Выберите формат</option>
                    {formats.map((format) => (
                      <option key={format.id} value={format.id}>
                        {format.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#abd1c6] mb-2">
                    Срок (в днях) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="365"
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData({ ...formData, duration: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-[#004643] border border-[#abd1c6]/30 rounded-lg text-[#fffffe] placeholder-[#abd1c6]/50 focus:border-[#f9bc60] focus:outline-none transition-colors"
                    placeholder="7"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#abd1c6] mb-2">
                  Комментарий
                </label>
                <textarea
                  value={formData.comment}
                  onChange={(e) =>
                    setFormData({ ...formData, comment: e.target.value })
                  }
                  rows={4}
                  className="w-full px-4 py-3 bg-[#004643] border border-[#abd1c6]/30 rounded-lg text-[#fffffe] placeholder-[#abd1c6]/50 focus:border-[#f9bc60] focus:outline-none transition-colors"
                  placeholder="Дополнительная информация о вашей рекламе"
                />
              </div>

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="agreed"
                  checked={formData.agreed}
                  onChange={(e) =>
                    setFormData({ ...formData, agreed: e.target.checked })
                  }
                  className="mt-1 w-5 h-5 text-[#f9bc60] bg-[#004643] border-[#abd1c6]/30 rounded focus:ring-[#f9bc60]"
                  required
                />
                <label htmlFor="agreed" className="text-sm text-[#abd1c6]">
                  Согласен с условиями размещения рекламы. Мы не размещаем рекламу,
                  нарушающую законодательство РФ, а также рекламу азартных игр,
                  сомнительных финансовых схем и запрещенных товаров.
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-4 bg-gradient-to-r from-[#f9bc60] to-[#f9bc60] text-[#001e1d] font-bold rounded-lg hover:from-[#f9bc60]/90 hover:to-[#f9bc60]/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Отправка...
                  </>
                ) : (
                  <>
                    <LucideIcons.Send size="sm" />
                    Отправить заявку
                  </>
                )}
              </button>
            </form>
          </div>
        </motion.div>

        {/* Контактная информация */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="text-[#abd1c6]">
            Остались вопросы? Напишите нам:{" "}
            <a
              href="mailto:ads@kopilka.ru"
              className="text-[#f9bc60] hover:underline font-medium"
            >
              ads@kopilka.ru
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

