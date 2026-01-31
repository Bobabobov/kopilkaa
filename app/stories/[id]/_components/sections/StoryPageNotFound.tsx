import Link from "next/link";

export function StoryPageNotFound() {
  return (
    <div className="min-h-screen">
      <div className="relative z-10 flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-6xl">📖</div>
          <h1
            className="mb-2 text-2xl font-bold"
            style={{ color: "#fffffe" }}
          >
            История не найдена
          </h1>
          <p className="mb-6" style={{ color: "#abd1c6" }}>
            Возможно, история была удалена или не существует
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
