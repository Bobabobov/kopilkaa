"use client";

interface HeaderPreviewProps {
  selectedThemeConfig: {
    background: string;
    color?: string;
    image?: string;
    gradient?: string;
    textColor: string;
    accentColor: string;
  };
  themeName: string;
  selectedColor: string | null;
}

export function HeaderPreview({
  selectedThemeConfig,
  themeName,
  selectedColor,
}: HeaderPreviewProps) {
  return (
    <div className="rounded-2xl border border-[#abd1c6]/20 bg-[#001e1d]/60 overflow-hidden shadow-lg">
      <div
        className="h-36 sm:h-40 w-full relative"
        style={
          selectedThemeConfig.background === "image"
            ? {
                backgroundImage: `url(${(selectedThemeConfig as any).image})`,
                backgroundSize: "cover",
                backgroundPosition: "center center",
                backgroundRepeat: "no-repeat",
              }
            : selectedThemeConfig.background === "gradient"
              ? { backgroundImage: (selectedThemeConfig as any).gradient }
              : selectedThemeConfig.background === "color"
                ? {
                    background:
                      (selectedThemeConfig as any).color || "#004643",
                  }
                : {
                    background: "linear-gradient(135deg,#1fe0ba,#0a4c43)",
                  }
        }
      >
        <div className="absolute inset-0 bg-black/12" />
        <div className="absolute inset-0 px-6 sm:px-8 py-5 flex items-center justify-between">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/25 text-xs font-semibold text-white">
              Предпросмотр
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white drop-shadow">
              Мой профиль
            </h3>
            <p className="text-sm text-white/90 drop-shadow">
              Добро пожаловать,{" "}
              <span className="font-semibold text-[#f9bc60]">Пользователь</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-semibold text-white">
              {selectedColor ? "Своя палитра" : themeName}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
