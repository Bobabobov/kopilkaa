"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { LucideIcons } from "@/components/ui/LucideIcons";

type FAQItem = {
  id: string;
  question: string;
  answer: string;
  icon: string;
  colorClass: string;
  bgColorClass: string;
  borderColorClass: string;
  textColorClass: string;
  iconBgClass: string;
};

export default function FAQ() {
  const [openItem, setOpenItem] = useState<string | null>(null);

  const renderIcon = (iconName: string) => {
    const iconProps = { size: "lg" as const, className: "text-white" };

    switch (iconName) {
      case "document":
        return <LucideIcons.Document {...iconProps} />;
      case "list":
        return <LucideIcons.List {...iconProps} />;
      case "clock":
        return <LucideIcons.Clock {...iconProps} />;
      case "money":
        return <LucideIcons.Money {...iconProps} />;
      case "file":
        return <LucideIcons.File {...iconProps} />;
      case "x-circle":
        return <LucideIcons.XCircle {...iconProps} />;
      case "shield":
        return <LucideIcons.Shield {...iconProps} />;
      case "message-circle":
        return <LucideIcons.MessageCircle {...iconProps} />;
      default:
        return <LucideIcons.Help {...iconProps} />;
    }
  };

  const faqItems: FAQItem[] = [
    {
      id: "how-to-apply",
      question: "Как подать заявку на помощь?",
      answer:
        "Подача заявки очень проста! Сначала зарегистрируйтесь на платформе, затем заполните подробную форму заявки. В форме нужно описать вашу ситуацию, указать нужную сумму и приложить необходимые документы. После подачи заявка попадает на рассмотрение к нашей команде экспертов.",
      icon: "document",
      colorClass: "slate",
      bgColorClass:
        "from-[#E3EED4] to-[#AEC3B0] dark:from-[#0F2A1D] dark:to-[#375534]",
      borderColorClass: "border-[#AEC3B0] dark:border-[#6B9071]",
      textColorClass: "text-gray-900 dark:text-white",
      iconBgClass: "bg-[#6B9071]",
    },
    {
      id: "what-applications",
      question: "Какие заявки рассматривает копилка?",
      answer:
        "Мы рассматриваем самые разные заявки: образование и обучение, бизнес-проекты и стартапы, творческие инициативы, медицинские нужды, помощь в сложных жизненных ситуациях. Главное - чтобы заявка была обоснованной и соответствовала нашим принципам помощи. Каждая заявка рассматривается индивидуально.",
      icon: "list",
      colorClass: "emerald",
      bgColorClass:
        "from-[#AEC3B0] to-[#6B9071] dark:from-[#375534] dark:to-[#6B9071]",
      borderColorClass: "border-[#6B9071] dark:border-[#AEC3B0]",
      textColorClass: "text-gray-900 dark:text-white",
      iconBgClass: "bg-[#6B9071]",
    },
    {
      id: "review-time",
      question: "Сколько времени занимает рассмотрение?",
      answer:
        "Обычно рассмотрение заявки занимает 3-5 рабочих дней. В сложных случаях, когда требуется дополнительная проверка документов или консультация с экспертами, процесс может занять до 10 дней. Мы обязательно уведомим вас о решении по email и в личном кабинете.",
      icon: "clock",
      colorClass: "teal",
      bgColorClass:
        "from-[#6B9071] to-[#375534] dark:from-[#6B9071] dark:to-[#375534]",
      borderColorClass: "border-[#375534] dark:border-[#6B9071]",
      textColorClass: "text-gray-900 dark:text-white",
      iconBgClass: "bg-[#375534]",
    },
    {
      id: "return-money",
      question: "Нужно ли возвращать полученные средства?",
      answer:
        "Нет, возврат средств не требуется! Это безвозмездная помощь. Мы просим только поделиться результатами использования средств - это поможет вдохновить других людей и показать, как ваша идея воплотилась в жизнь. Это необязательно, но очень ценно для сообщества.",
      icon: "money",
      colorClass: "green",
      bgColorClass:
        "from-[#E3EED4] to-[#AEC3B0] dark:from-[#0F2A1D] dark:to-[#375534]",
      borderColorClass: "border-[#AEC3B0] dark:border-[#6B9071]",
      textColorClass: "text-gray-900 dark:text-white",
      iconBgClass: "bg-[#6B9071]",
    },
    {
      id: "documents",
      question: "Какие документы нужны для заявки?",
      answer:
        "Список документов зависит от типа заявки. Обычно нужны: паспорт, документы, подтверждающие вашу ситуацию (справки, договоры, медицинские заключения), план использования средств. Для бизнес-проектов - бизнес-план и финансовые расчеты. Мы поможем определить, какие именно документы нужны для вашего случая.",
      icon: "file",
      colorClass: "emerald",
      bgColorClass:
        "from-[#AEC3B0] to-[#6B9071] dark:from-[#375534] dark:to-[#6B9071]",
      borderColorClass: "border-[#6B9071] dark:border-[#AEC3B0]",
      textColorClass: "text-gray-900 dark:text-white",
      iconBgClass: "bg-[#6B9071]",
    },
    {
      id: "rejection",
      question: "Почему заявка может быть отклонена?",
      answer:
        "Заявка может быть отклонена по нескольким причинам: недостаточное обоснование необходимости помощи, отсутствие необходимых документов, несоответствие заявки нашим принципам, подозрение в мошенничестве. В случае отклонения мы обязательно объясним причину и дадим рекомендации по улучшению заявки.",
      icon: "x-circle",
      colorClass: "red",
      bgColorClass:
        "from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20",
      borderColorClass: "border-red-200 dark:border-red-700/50",
      textColorClass: "text-red-700 dark:text-red-300",
      iconBgClass: "bg-red-600",
    },
    {
      id: "privacy",
      question: "Безопасны ли мои личные данные?",
      answer:
        "Да, мы серьезно относимся к защите ваших данных. Вся информация шифруется и хранится в соответствии с требованиями безопасности. Мы не передаем ваши личные данные третьим лицам без вашего согласия. Документы доступны только нашей команде экспертов для рассмотрения заявки.",
      icon: "shield",
      colorClass: "lime",
      bgColorClass:
        "from-lime-50 to-lime-100 dark:from-lime-900/20 dark:to-lime-800/20",
      borderColorClass: "border-lime-200 dark:border-lime-700/50",
      textColorClass: "text-lime-700 dark:text-lime-300",
      iconBgClass: "bg-lime-600",
    },
    {
      id: "contact",
      question: "Как связаться с поддержкой?",
      answer:
        "Вы можете связаться с нами через форму обратной связи в личном кабинете, написать на email поддержки или использовать чат на сайте. Мы отвечаем в течение 24 часов в рабочие дни. Также вы можете оставить отзыв о работе платформы - ваше мнение очень важно для нас.",
      icon: "message-circle",
      colorClass: "green",
      bgColorClass:
        "from-[#E3EED4] to-[#AEC3B0] dark:from-[#0F2A1D] dark:to-[#375534]",
      borderColorClass: "border-[#AEC3B0] dark:border-[#6B9071]",
      textColorClass: "text-gray-900 dark:text-white",
      iconBgClass: "bg-[#6B9071]",
    },
  ];

  const toggleItem = (id: string) => {
    setOpenItem(openItem === id ? null : id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 1.3 }}
      className="max-w-6xl mx-auto mt-16 px-4"
    >
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Частые вопросы
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Ответы на самые популярные вопросы о работе платформы "Копилка"
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 items-start max-w-4xl mx-auto">
        {faqItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.4 + index * 0.1 }}
            className={`p-6 rounded-2xl bg-gradient-to-br ${item.bgColorClass} border transition-all duration-300 cursor-pointer ${
              openItem === item.id
                ? `shadow-xl border-2 ${item.borderColorClass.replace("border-", "border-2 ")}`
                : `${item.borderColorClass} hover:shadow-lg`
            }`}
            onClick={() => toggleItem(item.id)}
          >
            <div className="flex items-start gap-4">
              <div
                className={`w-12 h-12 rounded-full ${item.iconBgClass} flex items-center justify-center flex-shrink-0`}
              >
                {renderIcon(item.icon)}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center justify-between">
                  {item.question}
                  <motion.span
                    className={`text-xl ml-2 transition-colors duration-200 ${
                      openItem === item.id
                        ? "text-gray-600 dark:text-gray-300"
                        : "text-gray-400"
                    }`}
                    animate={{
                      rotate: openItem === item.id ? 180 : 0,
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    {openItem === item.id ? "−" : "+"}
                  </motion.span>
                </h3>

                <div
                  className={`transition-all duration-300 ease-in-out ${
                    openItem === item.id
                      ? "max-h-96 opacity-100 mt-4"
                      : "max-h-0 opacity-0 mt-0 overflow-hidden"
                  }`}
                >
                  <div className="space-y-4">
                    <p
                      className={`text-base ${item.textColorClass} leading-relaxed font-medium`}
                    >
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="text-center mt-12">
        <div className="p-8 rounded-2xl bg-gradient-to-br from-[#E3EED4] to-[#AEC3B0] dark:from-[#0F2A1D] dark:to-[#375534] border border-[#AEC3B0] dark:border-[#6B9071]">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Не нашли ответ на свой вопрос?
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Наша команда поддержки всегда готова помочь вам
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn-primary py-3 px-6 hover:scale-105 transition-all duration-300">
              Связаться с поддержкой
            </button>
            <button className="btn-ghost border border-gray-300 dark:border-gray-600 py-3 px-6 hover:scale-105 transition-all duration-300">
              Посмотреть все вопросы
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
