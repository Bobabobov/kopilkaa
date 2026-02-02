export function StoryPageLoading() {
  return (
    <div className="min-h-screen">
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-[#abd1c6]/25 bg-[#001e1d]/40 p-8 shadow-xl text-center">
          <div
            className="mx-auto mb-5 h-14 w-14 animate-spin rounded-full border-2 border-[#abd1c6]/30 border-t-[#f9bc60]"
          />
          <p className="text-[#abd1c6] font-medium">Загрузка истории...</p>
          <p className="mt-2 text-sm text-[#abd1c6]/70">Секунду</p>
        </div>
      </div>
    </div>
  );
}
