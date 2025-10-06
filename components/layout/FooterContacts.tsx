"use client";

export default function FooterContacts() {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold" style={{ color: "#fffffe" }}>
        Свяжитесь с нами
      </h3>

      <div className="space-y-4">
        <div
          className="flex items-center gap-4 p-4 rounded-xl backdrop-blur-sm border transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(249,188,96,0.3)]"
          style={{
            backgroundColor: "rgba(171, 209, 198, 0.1)",
            borderColor: "rgba(171, 209, 198, 0.2)",
          }}
        >
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: "#f9bc60" }}
          >
            <svg
              className="w-5 h-5"
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
          <div>
            <div className="text-sm font-medium" style={{ color: "#fffffe" }}>
              Email
            </div>
            <div className="text-sm" style={{ color: "#abd1c6" }}>
              support@kopilka.ru
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
