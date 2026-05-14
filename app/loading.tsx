/**
 * Общий индикатор при переходах между страницами (Suspense).
 * Лёгкий, без тяжёлых анимаций — подходит для телефонов.
 */
export default function Loading() {
  return (
    <div className="min-h-[40vh] flex flex-col items-center justify-center gap-4 px-4 py-16">
      <div
        className="h-10 w-10 rounded-full border-2 border-[#abd1c6]/35 border-t-[#f9bc60] animate-spin"
        aria-hidden
      />
      <p className="text-sm text-[#abd1c6]">Загрузка…</p>
    </div>
  );
}
