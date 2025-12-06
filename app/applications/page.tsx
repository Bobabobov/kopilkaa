// app/applications/page.tsx
"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { msToHuman } from "@/lib/time";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { usePageTimeTracking } from "@/lib/usePageTimeTracking";
import ProgressBar from "@/components/applications/ProgressBar";
import FormField from "@/components/ui/FormField";
import UniversalBackground from "@/components/ui/UniversalBackground";
import MotivationalMessages from "@/components/applications/MotivationalMessages";

// Lazy load heavy components
const PhotoUpload = dynamic(() => import("@/components/applications/PhotoUpload"), {
  ssr: false,
  loading: () => <div className="h-32 bg-[#004643]/30 animate-pulse rounded-2xl" />
});

const SuccessScreen = dynamic(() => import("@/components/applications/SuccessScreen"), {
  ssr: false,
  loading: () => <div className="h-96 bg-[#004643]/30 animate-pulse rounded-3xl" />
});

const PageHeader = dynamic(() => import("@/components/applications/PageHeader"), {
  ssr: false,
  loading: () => <div className="h-24 bg-[#004643]/30 animate-pulse rounded-2xl" />
});

const SubmitSection = dynamic(() => import("@/components/applications/SubmitSection"), {
  ssr: false,
  loading: () => <div className="h-16 bg-[#004643]/30 animate-pulse rounded-2xl" />
});

const ApplicationPreview = dynamic(() => import("@/components/applications/ApplicationPreview"), {
  ssr: false,
  loading: () => <div className="h-96 bg-[#004643]/30 animate-pulse rounded-3xl" />
});

type LocalImage = { file: File; url: string };

// Ключ для сохранения в localStorage
const SAVE_KEY = 'application_form_data';

const LIMITS = {
  titleMax: 40,
  summaryMax: 140,
  storyMin: 10,
  storyMax: 3000,
  amountMin: 1,
  amountMax: 1000000,
  paymentMin: 10,
  paymentMax: 200,
  maxPhotos: 5,
};

export default function ApplicationsPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);

  // Отслеживание времени на странице
  usePageTimeTracking({
    page: "/applications",
    enabled: true,
    sendInterval: 30000, // отправляем каждые 30 секунд
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
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Восстановление данных при загрузке страницы
  useEffect(() => {
    try {
      const saved = localStorage.getItem(SAVE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        if (data.title) setTitle(data.title);
        if (data.summary) setSummary(data.summary);
        if (data.story) setStory(data.story);
        if (data.amount) setAmount(data.amount);
        if (data.payment) setPayment(data.payment);
      }
    } catch (error) {
      console.log('Ошибка при восстановлении данных:', error);
    }
  }, []);

  // Сохранение данных при изменении
  useEffect(() => {
    const data = { title, summary, story, amount, payment };
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(data));
    } catch (error) {
      console.log('Ошибка при сохранении данных:', error);
    }
  }, [title, summary, story, amount, payment]);

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

  const removeAt = (i: number) =>
    setPhotos((p) => p.filter((_, idx) => idx !== i));
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
    title.length > 0 &&
    title.length <= LIMITS.titleMax &&
    summary.length > 0 &&
    summary.length <= LIMITS.summaryMax &&
    story.length >= LIMITS.storyMin &&
    story.length <= LIMITS.storyMax &&
    amount.length > 0 &&
    parseInt(amount) >= LIMITS.amountMin &&
    parseInt(amount) <= LIMITS.amountMax &&
    payment.length >= LIMITS.paymentMin &&
    payment.length <= LIMITS.paymentMax &&
    photos.length <= LIMITS.maxPhotos;

  // Подсчет заполненных полей для мотивационных сообщений
  const getCharCount = (text: string) => text.replace(/\s/g, "").length;
  const filledFields = [
    getCharCount(title) > 0,
    getCharCount(summary) > 0,
    getCharCount(story) >= LIMITS.storyMin,
    amount.length > 0 && parseInt(amount) >= LIMITS.amountMin,
    getCharCount(payment) >= LIMITS.paymentMin,
    photos.length > 0,
  ].filter(Boolean).length;
  const totalFields = 6;
  const progressPercentage = Math.round((filledFields / totalFields) * 100);

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

  const submit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setMsg(null);
    setErr(null);

    // Дополнительная проверка авторизации при отправке
    if (!user) {
      router.push("/register");
      return;
    }

    if (!valid) {
      setErr("Проверьте поля — есть ошибки/лимиты");
      return;
    }

    try {
      setSubmitting(true);
      const urls = await uploadAll();
      const r = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          summary,
          story,
          amount,
          payment,
          images: urls,
        }),
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
      // Очищаем форму при успешной отправке
      setPhotos([]);
      setTitle("");
      setSummary("");
      setStory("");
      setAmount("");
      setPayment("");
      // Очищаем сохраненные данные
      localStorage.removeItem(SAVE_KEY);
    } catch (e: any) {
      setErr(e.message || "Ошибка");
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
        <UniversalBackground />
        
        <div className="container-p mx-auto pt-0 sm:pt-1 pb-8 relative z-10">
          <SuccessScreen onNewApplication={() => setSubmitted(false)} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Фон */}
      <UniversalBackground />

      {/* Дополнительные декоративные элементы */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#f9bc60]/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#e16162]/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#abd1c6]/3 rounded-full blur-3xl"></div>
      </div>

      <PageHeader />

      {/* Main Content */}
      <div className="container-p mx-auto max-w-7xl relative z-10 px-3 sm:px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {/* Left Sidebar with Tips */}
          <div className="xl:col-span-1 order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="lg:sticky lg:top-8 space-y-6"
            >
              {/* Улучшенная секция с советами */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="relative overflow-hidden backdrop-blur-sm rounded-2xl p-6 border border-[#abd1c6]/30 bg-gradient-to-br from-[#004643]/60 to-[#001e1d]/40 shadow-xl"
              >
                {/* Декоративные элементы */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#f9bc60]/10 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-[#e16162]/10 rounded-full blur-xl"></div>
                
                <div className="relative z-10">
                  <motion.h3 
                    className="flex items-center gap-3 text-xl font-bold mb-6"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <motion.div
                      className="w-10 h-10 bg-gradient-to-br from-[#f9bc60] to-[#e8a545] rounded-xl flex items-center justify-center shadow-lg shadow-[#f9bc60]/30"
                      animate={{ 
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ 
                        duration: 3,
                        repeat: Infinity,
                        repeatDelay: 2
                      }}
                    >
                      <LucideIcons.Lightbulb className="text-[#001e1d]" size="sm" />
                    </motion.div>
                    <span className="bg-gradient-to-r from-[#fffffe] to-[#abd1c6] bg-clip-text text-transparent">
                      Советы
                    </span>
                  </motion.h3>
                  
                  <div className="space-y-4">
                    {[
                      { icon: LucideIcons.Target, text: "Будьте конкретными в описании ситуации", color: "#10B981" },
                      { icon: LucideIcons.Image, text: "Приложите фотографии для подтверждения", color: "#3B82F6" },
                      { icon: LucideIcons.DollarSign, text: "Укажите точную сумму, которая нужна", color: "#F59E0B" },
                      { icon: LucideIcons.FileText, text: "Опишите, как планируете использовать средства", color: "#8B5CF6" },
                    ].map((tip, index) => {
                      const IconComponent = tip.icon;
                      return (
                        <motion.div
                          key={index}
                          className="flex items-start gap-3 p-3 rounded-xl bg-[#001e1d]/30 border border-[#abd1c6]/20 hover:border-[#f9bc60]/40 transition-all hover:shadow-lg hover:shadow-[#f9bc60]/20"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.6 + index * 0.1 }}
                          whileHover={{ scale: 1.02, x: 5 }}
                        >
                          <motion.div
                            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md"
                            style={{ backgroundColor: `${tip.color}20`, color: tip.color }}
                            whileHover={{ rotate: 15, scale: 1.1 }}
                          >
                            <IconComponent size="xs" />
                          </motion.div>
                          <span className="text-sm text-[#abd1c6] font-medium pt-1">
                            {tip.text}
                          </span>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Main Form */}
          <div className="xl:col-span-3 order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6 sm:space-y-8"
            >

              <form className="grid gap-6" onSubmit={submit}>
                <ProgressBar
                  title={title}
                  summary={summary}
                  story={story}
                  amount={amount}
                  payment={payment}
                  photos={photos}
                />

                {/* Мотивационные сообщения */}
                <MotivationalMessages
                  progress={progressPercentage}
                  filledFields={filledFields}
                  totalFields={totalFields}
                />

                <div>
                  <FormField
                    type="input"
                    label="Заголовок"
                    icon="Home"
                    value={title}
                    onChange={setTitle}
                    placeholder="Краткое описание вашей ситуации..."
                    hint="Краткий заголовок, который привлечет внимание (макс. 40 символов)"
                    maxLength={LIMITS.titleMax}
                    delay={0.1}
                    required={true}
                  />
                </div>

                <div>
                  <FormField
                    type="input"
                    label="Краткое описание"
                    icon="MessageCircle"
                    value={summary}
                    onChange={setSummary}
                    placeholder="Основная суть вашей просьбы..."
                    hint="Краткое описание, которое будет видно в списке заявок (макс. 140 символов)"
                    maxLength={LIMITS.summaryMax}
                    delay={0.2}
                    required={true}
                  />
                </div>

                <div>
                  <FormField
                    type="textarea"
                    label="Подробная история"
                    icon="FileText"
                    value={story}
                    onChange={setStory}
                    placeholder="Расскажите подробно о вашей ситуации, что привело к необходимости помощи, как планируете использовать средства..."
                  hint="Подробное описание ситуации (минимум 10, максимум 3000 символов)"
                    minLength={LIMITS.storyMin}
                    maxLength={LIMITS.storyMax}
                    delay={0.3}
                    required={true}
                  />
                </div>

                <div>
                  <FormField
                    type="input"
                    label="Сумма запроса"
                    icon="DollarSign"
                    value={amount}
                    onChange={setAmount}
                    placeholder="Укажите сумму в рублях..."
                    hint="Сумма в рублях (от 1 до 1 000 000 рублей)"
                    minLength={LIMITS.amountMin}
                    maxLength={7}
                    delay={0.4}
                    required={true}
                  />
                </div>

                <div>
                  <FormField
                    type="textarea"
                    label="Реквизиты для получения помощи"
                    icon="CreditCard"
                    value={payment}
                    onChange={setPayment}
                    placeholder="Банковские реквизиты, номер карты или другие способы получения средств"
                    hint="Реквизиты для перевода средств (минимум 10, максимум 200 символов)"
                    minLength={LIMITS.paymentMin}
                    maxLength={LIMITS.paymentMax}
                    compact={true}
                    delay={0.5}
                    required={true}
                  />
                </div>

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

    </div>
  );
}
