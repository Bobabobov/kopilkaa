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
  storyMin: 200,
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
  const [showPreview, setShowPreview] = useState(false); // для предпросмотра заявки
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

    // Показываем предпросмотр перед отправкой
    if (!showPreview) {
      setShowPreview(true);
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
      setShowPreview(false);
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
      setShowPreview(false);
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
        
        
        <div className="container-p mx-auto pt-32 pb-8 relative z-10">
          <SuccessScreen onNewApplication={() => setSubmitted(false)} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Фон */}
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
                    <span className="text-green-500 mt-0.5 flex-shrink-0">
                      ✓
                    </span>
                    <span>Будьте конкретными в описании ситуации</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-green-500 mt-0.5 flex-shrink-0">
                      ✓
                    </span>
                    <span>Приложите фотографии для подтверждения</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-green-500 mt-0.5 flex-shrink-0">
                      ✓
                    </span>
                    <span>Укажите точную сумму, которая нужна</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-green-500 mt-0.5 flex-shrink-0">
                      ✓
                    </span>
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

              <form className="grid gap-6" onSubmit={submit}>
                <ProgressBar
                  title={title}
                  summary={summary}
                  story={story}
                  amount={amount}
                  payment={payment}
                  photos={photos}
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
                    hint="Подробное описание ситуации (минимум 200, максимум 3000 символов)"
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

      {/* Модальное окно предпросмотра заявки */}
      {showPreview && (
        <ApplicationPreview
          title={title}
          summary={summary}
          story={story}
          amount={amount}
          payment={payment}
          photos={photos}
          onClose={() => setShowPreview(false)}
          onConfirm={async () => {
            setShowPreview(false);
            await submit(); // Отправляем заявку
          }}
        />
      )}
    </div>
  );
}
