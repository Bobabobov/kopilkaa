export function StoryPageLoading() {
  return (
    <div className="min-h-screen">
      <div className="relative z-10 flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div
            className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-2 border-t-transparent"
            style={{ borderColor: "#f9bc60" }}
          />
          <p style={{ color: "#abd1c6" }}>Загрузка истории...</p>
        </div>
      </div>
    </div>
  );
}
