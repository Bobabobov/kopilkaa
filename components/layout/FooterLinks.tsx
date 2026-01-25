"use client";
import Link from "next/link";

export default function FooterLinks() {
  const links = [
    {
      href: "/terms",
      label: "Правила и политика",
      icon: (
        <svg
          className="w-full h-full"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
    },
    {
      href: "/advertising",
      label: "Реклама на сайте",
      icon: (
        <svg
          className="w-full h-full"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold" style={{ color: "#fffffe" }}>
        Полезные ссылки
      </h3>

      <div className="space-y-2">
        {links.map((link, index) => (
          <Link
            key={index}
            href={link.href}
            className="flex items-center gap-3 p-2.5 rounded-lg backdrop-blur-sm border transition-all duration-300 hover:scale-[1.01] hover:translate-x-0.5 hover:shadow-[0_0_15px_rgba(249,188,96,0.15)] group"
            style={{
              backgroundColor: "rgba(171, 209, 198, 0.05)",
              borderColor: "rgba(171, 209, 198, 0.15)",
            }}
          >
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-105 flex-shrink-0"
              style={{
                backgroundColor: "rgba(249, 188, 96, 0.15)",
                color: "#f9bc60",
              }}
            >
              <div className="w-3.5 h-3.5">{link.icon}</div>
            </div>
            <span
              className="text-xs font-medium transition-colors duration-300 group-hover:text-[#fffffe] flex-1"
              style={{ color: "#abd1c6" }}
            >
              {link.label}
            </span>
            <svg
              className="w-3 h-3 transition-all duration-300 group-hover:translate-x-0.5 opacity-0 group-hover:opacity-100 flex-shrink-0"
              style={{ color: "#f9bc60" }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        ))}
      </div>
    </div>
  );
}
