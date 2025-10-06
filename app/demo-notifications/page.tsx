// app/demo-notifications/page.tsx
"use client";

import { useBeautifulNotifications } from "@/components/ui/BeautifulNotificationsProvider";

export default function DemoNotificationsPage() {
  const {
    showAlert,
    showModal,
    showDialog,
    showToast,
    alert,
    confirm,
    prompt,
  } = useBeautifulNotifications();

  const handleAlert = () => {
    showAlert(
      "error",
      "Ошибка",
      "Произошла ошибка при выполнении операции",
      0,
      true,
    );
  };

  const handleToast = () => {
    showToast("success", "Успешно!", "Операция выполнена успешно", 3000);
  };

  const handleModal = () => {
    showModal(
      "Демо модального окна",
      <div className="space-y-4">
        <p className="text-gray-600 dark:text-gray-300">
          Это пример красивого модального окна с анимациями и современным
          дизайном.
        </p>
        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">Особенности:</h4>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Плавные анимации появления и исчезновения</li>
            <li>Размытие фона (backdrop blur)</li>
            <li>Градиентное свечение</li>
            <li>Адаптивный дизайн</li>
            <li>Поддержка темной темы</li>
          </ul>
        </div>
      </div>,
      { size: "lg" },
    );
  };

  const handleDialog = () => {
    showDialog({
      type: "confirm",
      title: "Подтверждение действия",
      message:
        "Вы уверены, что хотите выполнить это действие? Это действие нельзя будет отменить.",
      onConfirm: () => {
        showToast("success", "Подтверждено", "Действие выполнено", 2000);
      },
      onCancel: () => {
        showToast("info", "Отменено", "Действие отменено", 2000);
      },
      confirmText: "Да, выполнить",
      cancelText: "Отмена",
    });
  };

  const handlePrompt = async () => {
    const result = await prompt("Введите ваше имя:", "Иван", "Ввод имени");
    if (result !== null) {
      showToast(
        "success",
        "Привет!",
        `Приятно познакомиться, ${result}!`,
        3000,
      );
    } else {
      showToast("info", "Отменено", "Ввод отменен", 2000);
    }
  };

  const handleStandardAlert = () => {
    alert("Это стандартный alert, но с красивым дизайном!", "Уведомление");
  };

  const handleStandardConfirm = async () => {
    const result = await confirm("Вы хотите продолжить?", "Подтверждение");
    showToast(
      result ? "success" : "info",
      result ? "Продолжаем!" : "Отменено",
      result
        ? "Пользователь подтвердил действие"
        : "Пользователь отменил действие",
      2000,
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Демо красивых уведомлений
        </h1>

        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Здесь вы можете протестировать различные типы красивых уведомлений,
          которые заменяют стандартные окна браузера.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Alert уведомления */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Alert уведомления
            </h2>

            <div className="space-y-3">
              <button onClick={handleAlert} className="w-full btn-primary">
                Показать Alert (Ошибка)
              </button>

              <button
                onClick={() =>
                  showAlert(
                    "warning",
                    "Предупреждение",
                    "Это предупреждение о важной информации",
                  )
                }
                className="w-full btn-primary"
              >
                Показать Alert (Предупреждение)
              </button>

              <button
                onClick={() =>
                  showAlert(
                    "info",
                    "Информация",
                    "Это информационное сообщение",
                  )
                }
                className="w-full btn-primary"
              >
                Показать Alert (Информация)
              </button>

              <button
                onClick={() =>
                  showAlert("success", "Успех", "Операция выполнена успешно!")
                }
                className="w-full btn-primary"
              >
                Показать Alert (Успех)
              </button>
            </div>
          </div>

          {/* Toast уведомления */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Toast уведомления
            </h2>

            <div className="space-y-3">
              <button onClick={handleToast} className="w-full btn-primary">
                Показать Toast (Успех)
              </button>

              <button
                onClick={() =>
                  showToast("error", "Ошибка", "Что-то пошло не так", 3000)
                }
                className="w-full btn-primary"
              >
                Показать Toast (Ошибка)
              </button>

              <button
                onClick={() =>
                  showToast(
                    "warning",
                    "Внимание",
                    "Проверьте введенные данные",
                    3000,
                  )
                }
                className="w-full btn-primary"
              >
                Показать Toast (Предупреждение)
              </button>

              <button
                onClick={() =>
                  showToast(
                    "info",
                    "Информация",
                    "Новая информация доступна",
                    3000,
                  )
                }
                className="w-full btn-primary"
              >
                Показать Toast (Информация)
              </button>
            </div>
          </div>

          {/* Модальные окна */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Модальные окна
            </h2>

            <div className="space-y-3">
              <button onClick={handleModal} className="w-full btn-primary">
                Показать модальное окно
              </button>

              <button
                onClick={() =>
                  showModal(
                    "Маленькое окно",
                    <p className="text-gray-600 dark:text-gray-300">
                      Это маленькое модальное окно.
                    </p>,
                    { size: "sm" },
                  )
                }
                className="w-full btn-primary"
              >
                Маленькое модальное окно
              </button>

              <button
                onClick={() =>
                  showModal(
                    "Большое окно",
                    <div className="space-y-4">
                      <p className="text-gray-600 dark:text-gray-300">
                        Это большое модальное окно с дополнительным контентом.
                      </p>
                      <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">
                          Дополнительная информация
                        </h4>
                        <p className="text-sm">
                          Здесь может быть любой контент: формы, изображения,
                          таблицы и т.д.
                        </p>
                      </div>
                    </div>,
                    { size: "xl" },
                  )
                }
                className="w-full btn-primary"
              >
                Большое модальное окно
              </button>
            </div>
          </div>

          {/* Диалоги */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Диалоги
            </h2>

            <div className="space-y-3">
              <button onClick={handleDialog} className="w-full btn-primary">
                Показать диалог подтверждения
              </button>

              <button onClick={handlePrompt} className="w-full btn-primary">
                Показать диалог ввода
              </button>

              <button
                onClick={() =>
                  showDialog({
                    type: "alert",
                    title: "Простое уведомление",
                    message: "Это простое уведомление в стиле диалога.",
                    confirmText: "Понятно",
                  })
                }
                className="w-full btn-primary"
              >
                Простое уведомление
              </button>
            </div>
          </div>

          {/* Замена стандартных окон */}
          <div className="space-y-4 md:col-span-2">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Замена стандартных окон браузера
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button onClick={handleStandardAlert} className="btn-primary">
                Заменить alert()
              </button>

              <button onClick={handleStandardConfirm} className="btn-primary">
                Заменить confirm()
              </button>

              <button onClick={handlePrompt} className="btn-primary">
                Заменить prompt()
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
