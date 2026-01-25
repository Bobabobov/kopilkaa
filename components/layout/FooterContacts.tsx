"use client";

export default function FooterContacts() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold" style={{ color: "#fffffe" }}>
        Свяжитесь с нами
      </h3>

      <div className="space-y-2.5">
        <div
          className="flex items-center gap-3 p-3 rounded-lg backdrop-blur-sm border transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(249,188,96,0.25)]"
          style={{
            backgroundColor: "rgba(171, 209, 198, 0.1)",
            borderColor: "rgba(171, 209, 198, 0.2)",
          }}
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: "#f9bc60" }}
          >
            <svg
              className="w-4 h-4"
              style={{ color: "#001e1d" }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div className="min-w-0">
            <div className="text-xs font-medium" style={{ color: "#fffffe" }}>
              Email
            </div>
            <div className="text-xs truncate" style={{ color: "#abd1c6" }}>
              support@kopilka-online.ru
            </div>
          </div>
        </div>

        <a
          href="https://t.me/kkopilka"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 p-3 rounded-lg backdrop-blur-sm border transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(0,136,204,0.25)] block"
          style={{
            backgroundColor: "rgba(171, 209, 198, 0.1)",
            borderColor: "rgba(171, 209, 198, 0.2)",
          }}
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: "#0088cc" }}
          >
            <svg
              className="w-4 h-4"
              style={{ color: "#fffffe" }}
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z" />
            </svg>
          </div>
          <div className="min-w-0">
            <div className="text-xs font-medium" style={{ color: "#fffffe" }}>
              Telegram канал
            </div>
            <div className="text-xs" style={{ color: "#abd1c6" }}>
              @kkopilka
            </div>
          </div>
        </a>
      </div>
    </div>
  );
}
