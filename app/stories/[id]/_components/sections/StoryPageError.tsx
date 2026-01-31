import Link from "next/link";

interface StoryPageErrorProps {
  error: string;
}

export function StoryPageError({ error }: StoryPageErrorProps) {
  return (
    <div className="min-h-screen">
      <div className="relative z-10 flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-6xl">⚠️</div>
          <h1
            className="mb-2 text-2xl font-bold"
            style={{ color: "#fffffe" }}
          >
            Ошибка
          </h1>
          <p className="mb-6" style={{ color: "#abd1c6" }}>
            {error}
          </p>
          <Link
            href="/stories"
            className="inline-flex items-center gap-2 rounded-lg px-6 py-3 transition-colors"
            style={{ backgroundColor: "#f9bc60", color: "#001e1d" }}
          >
            ← Вернуться к историям
          </Link>
        </div>
      </div>
    </div>
  );
}
