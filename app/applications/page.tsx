// app/applications/page.tsx
"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { msToHuman } from "@/lib/time";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { usePageTimeTracking } from "@/lib/usePageTimeTracking";
import ProgressBar from "@/components/applications/ProgressBar";
import FormField from "@/components/applications/FormField";
import PhotoUpload from "@/components/applications/PhotoUpload";
import SuccessScreen from "@/components/applications/SuccessScreen";
import PageHeader from "@/components/applications/PageHeader";
import SubmitSection from "@/components/applications/SubmitSection";
import UniversalBackground from "@/components/ui/UniversalBackground";

type LocalImage = { file: File; url: string };

const LIMITS = {
  titleMax: 40,
  summaryMax: 140,
  storyMin: 200,
  storyMax: 3000,
  amountMin: 1,
  amountMax: 1000000,
  paymentMin: 10,
  paymentMax: 200,
  maxPhotos: 5,
};

const DRAFT_KEY = "application_draft_v1";

export default function ApplicationsPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  
  // Отслеживание времени на странице
  usePageTimeTracking({ 
    page: "/applications", 
    enabled: true,
    sendInterval: 30000 // отправляем каждые 30 секунд
  });
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [story, setStory] = useState("");
  const [amount, setAmount] = useState("");
  const [payment, setPayment] = useState("");
  const [photos, setPhotos] = useState<LocalImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [left, setLeft] = useState<number | null>(null); // для лимита 24ч
  const [submitted, setSubmitted] = useState(false); // для экрана успеха
  const [draftSaved, setDraftSaved] = useState(false); // для уведомления о сохранении
  const [showClearModal, setShowClearModal] = useState(false); // для модального окна очистки
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Функция для очистки черновика
  const clearDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
    setPhotos([]);
    setTitle("");
    setSummary("");
    setStory("");
    setAmount("");
    setPayment("");
    setShowClearModal(false);
  };

  // Загрузка черновика (сразу при загрузке страницы)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const d = JSON.parse(raw);
        setTitle(d.title || "");
        setSummary(d.summary || "");
        setStory(d.story || "");
        setAmount(d.amount || "");
        setPayment(d.payment || "");
        
        // Фотографии не восстанавливаем из localStorage (проблемы с File объектами)
        // Пользователю нужно будет загрузить их заново
        if (d.photos && d.photos.length > 0) {
          // Показываем уведомление о том, что фотографии нужно загрузить заново
          setMsg("Черновик восстановлен, но фотографии нужно загрузить заново");
        }
      }
    } catch (error) {
      console.error('Ошибка загрузки черновика:', error);
    }
  }, []);

  // Проверка авторизации
  useEffect(() => {
    fetch("/api/profile/me", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (!d.user) {
          router.push("/register");
          return;
        }
        setUser(d.user);
      })
      .catch(() => router.push("/register"))
      .finally(() => setLoadingAuth(false));
  }, [router]);

  // Сохранение черновика (без фото - только текст)
  useEffect(() => {
    // Не сохраняем, если все поля пустые
    if (!title && !summary && !story && !amount && !payment) {
      return;
    }
    
    const data = { 
      title, 
      summary, 
      story, 
      amount, 
      payment
    };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
    
    // Показываем уведомление о сохранении
    setDraftSaved(true);
    const timer = setTimeout(() => setDraftSaved(false), 2000);
    return () => clearTimeout(timer);
  }, [title, summary, story, amount, payment]);

  const onPickFiles = (files: FileList | null) => {
    if (!files) return;
    const arr = Array.from(files);
    const rest = Math.max(0, LIMITS.maxPhotos - photos.length);
    const toAdd = arr.slice(0, rest);
    const mapped = toAdd.map((f) => ({ file: f, url: URL.createObjectURL(f) }));
    setPhotos((p) => [...p, ...mapped]);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    onPickFiles(e.dataTransfer.files);
  };

  const removeAt = (i: number) => setPhotos((p) => p.filter((_, idx) => idx !== i));
  const move = (i: number, dir: -1 | 1) => {
    setPhotos((p) => {
      const arr = [...p];
      const j = i + dir;
      if (j < 0 || j >= arr.length) return arr;
      const tmp = arr[i];
      arr[i] = arr[j];
      arr[j] = tmp;
      return arr;
    });
  };

  const valid =
    title.length > 0 && title.length <= LIMITS.titleMax &&
    summary.length > 0 && summary.length <= LIMITS.summaryMax &&
    story.length >= LIMITS.storyMin && story.length <= LIMITS.storyMax &&
    amount.length > 0 && parseInt(amount) >= LIMITS.amountMin && parseInt(amount) <= LIMITS.amountMax &&
    payment.length >= LIMITS.paymentMin && payment.length <= LIMITS.paymentMax &&
    photos.length <= LIMITS.maxPhotos;

  const uploadAll = async (): Promise<string[]> => {
    if (!photos.length) return [];
    setUploading(true);
    try {
      const fd = new FormData();
      
      photos.forEach((item) => {
        let file: File;
        
        if (item instanceof File) {
          file = item;
        } else if (item && item.file instanceof File) {
          file = item.file;
        } else {
          return;
        }
        
        fd.append("files", file);
      });
      
      const r = await fetch("/api/uploads", { method: "POST", body: fd });
      const d = await r.json();
      if (!r.ok) throw new Error(d?.error || "Ошибка загрузки");
      return (d.files as { url: string }[]).map((f) => f.url);
    } finally {
      setUploading(false);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null); setErr(null);
    
    // Дополнительная проверка авторизации при отправке
    if (!user) {
      router.push("/register");
      return;
    }
    
    if (!valid) { setErr("Проверьте поля — есть ошибки/лимиты"); return; }

    try {
      setSubmitting(true);
      const urls = await uploadAll();
      const r = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, summary, story, amount, payment, images: urls }),
      });
      const d = await r.json();
      if (r.status === 401) {
        // Если сессия истекла во время заполнения формы
        router.push("/register");
        return;
      }
      if (r.status === 429 && d?.leftMs) {
        setLeft(d.leftMs);
        throw new Error("Лимит: 1 заявка в 24 часа");
      }
      if (!r.ok) throw new Error(d?.error || "Ошибка отправки");

      // Успех
      setSubmitted(true);
      clearDraft(); // Очищаем черновик только при успешной отправке
    } catch (e: any) {
      setErr(e.message || "Ошибка");
      // При ошибке НЕ очищаем черновик - данные остаются
    } finally {
      setSubmitting(false);
    }
  };

  // Показываем загрузку пока проверяем авторизацию
  if (loadingAuth) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mx-auto max-w-3xl card p-6 text-center"
      >
        <div>Проверка авторизации...</div>
      </motion.div>
    );
  }

  // Если пользователь не авторизован, ничего не показываем (уже перенаправили)
  if (!user) {
    return null;
  }

  // Экран успешной отправки
  if (submitted) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-0 top-1/4 w-64 h-64 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-full blur-3xl"></div>
          <div className="absolute right-0 top-1/3 w-80 h-80 bg-gradient-to-br from-emerald-500/10 to-lime-500/10 rounded-full blur-3xl"></div>
          <div className="absolute left-1/2 top-1/2 w-32 h-32 bg-gradient-to-br from-lime-500/10 to-green-500/10 rounded-full blur-2xl"></div>
        </div>

        <div className="container-p mx-auto pt-32 pb-8 relative z-10">
          <SuccessScreen onNewApplication={() => setSubmitted(false)} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Универсальный фон */}
      <UniversalBackground />

      <PageHeader />

      {/* Main Content */}
      <div className="container-p mx-auto max-w-7xl relative z-10 px-4">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Left Sidebar with Tips */}
          <div className="xl:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="sticky top-8 space-y-6"
            >
              {/* Tips Section */}
              <div className="backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/30">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  <span className="text-emerald-500">💡</span>
                  Советы
                </h3>
                <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-start gap-3">
                    <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                    <span>Будьте конкретными в описании ситуации</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                    <span>Приложите фотографии для подтверждения</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                    <span>Укажите точную сумму, которая нужна</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                    <span>Опишите, как планируете использовать средства</span>
                  </div>
                </div>
              </div>

            </motion.div>
          </div>

          {/* Main Form */}
          <div className="xl:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-8"
            >


          {/* Уведомление о сохранении черновика */}
          {draftSaved && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-2 text-green-700 dark:text-green-400"
            >
              <LucideIcons.CheckCircle size="sm" />
              <span className="text-sm font-medium">Черновик сохранен</span>
            </motion.div>
          )}

          {/* Кнопка очистки черновика */}
          {(title || summary || story || amount || payment) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-4"
            >
              <button
                type="button"
                onClick={() => setShowClearModal(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
              >
                <LucideIcons.Trash size="sm" />
                Очистить черновик
              </button>
            </motion.div>
          )}

          <form className="grid gap-6" onSubmit={submit}>
            <ProgressBar
              title={title}
              summary={summary}
              story={story}
              amount={amount}
              payment={payment}
              photos={photos}
            />
            
            <FormField
              type="input"
              label="Заголовок"
              icon="Home"
              value={title}
              onChange={setTitle}
              placeholder="Краткое описание вашей ситуации..."
              hint="Будьте конкретными и понятными"
              maxLength={LIMITS.titleMax}
              delay={0.1}
            />

            <FormField
              type="input"
              label="Краткое описание"
              icon="MessageCircle"
              value={summary}
              onChange={setSummary}
              placeholder="Основная суть вашей просьбы..."
              hint="Это будет видно в списке заявок"
              maxLength={LIMITS.summaryMax}
              delay={0.2}
            />

            <FormField
              type="textarea"
              label="Подробная история"
              icon="FileText"
              value={story}
              onChange={setStory}
              placeholder="Расскажите подробно о вашей ситуации, что привело к необходимости помощи, как планируете использовать средства..."
              hint="Чем подробнее, тем больше шансов на помощь"
              minLength={LIMITS.storyMin}
              maxLength={LIMITS.storyMax}
              delay={0.3}
            />

            <FormField
              type="input"
              label="Сумма запроса"
              icon="DollarSign"
              value={amount}
              onChange={setAmount}
              placeholder="Укажите сумму в рублях..."
              hint="Минимум 1 рубль, максимум 1 000 000 рублей"
              minLength={LIMITS.amountMin}
              maxLength={7}
              delay={0.4}
            />

            <FormField
              type="textarea"
              label="Реквизиты для получения помощи"
              icon="CreditCard"
              value={payment}
              onChange={setPayment}
              placeholder="Банковские реквизиты, номер карты или другие способы получения средств"
              hint="Будьте осторожны с личными данными"
              minLength={LIMITS.paymentMin}
              maxLength={LIMITS.paymentMax}
              compact={true}
              delay={0.5}
            />

            <PhotoUpload
              photos={photos}
              onPhotosChange={setPhotos}
              maxPhotos={LIMITS.maxPhotos}
              delay={0.5}
            />

            <SubmitSection
              submitting={submitting}
              uploading={uploading}
              left={left}
              msg={msg}
              err={err}
              onSubmit={submit}
            />
          </form>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Модальное окно очистки черновика */}
      {showClearModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowClearModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-md w-full shadow-2xl border border-gray-200 dark:border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              {/* Иконка предупреждения */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg"
              >
                <div className="text-white">
                  <LucideIcons.XCircle size="lg" />
                </div>
              </motion.div>

              {/* Заголовок */}
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Очистить черновик?
              </h3>

              {/* Описание */}
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                Вы уверены, что хотите очистить все заполненные данные?
              </p>
              <p className="text-red-600 dark:text-red-400 font-medium mb-8">
                ⚠️ Это действие нельзя отменить!
              </p>

              {/* Кнопки */}
              <div className="flex gap-4 justify-center">
                <button
                  className="px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl transition-all duration-300 hover:scale-105 font-medium"
                  onClick={() => setShowClearModal(false)}
                >
                  Отмена
                </button>
                <button
                  className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl transition-all duration-300 hover:scale-105 font-medium shadow-lg hover:shadow-xl"
                  onClick={clearDraft}
                >
                  Очистить
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
