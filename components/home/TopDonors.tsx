"use client";
import { LucideIcons } from "@/components/ui/LucideIcons";

export default function TopDonors() {
  const donors = [
    { name: "Анна К.", amount: "12,500", position: 1, isTop: true },
    { name: "Михаил П.", amount: "8,200", position: 2, isTop: false },
    { name: "Елена С.", amount: "6,700", position: 3, isTop: false },
  ];

  const getRankIcon = (position: number) => {
    switch (position) {
      case 1:
        return <LucideIcons.Star size="sm" className="text-yellow-400" />;
      case 2:
        return <LucideIcons.Award size="sm" className="text-gray-300" />;
      case 3:
        return <LucideIcons.Medal size="sm" className="text-amber-600" />;
      default:
        return (
          <span className="text-xs font-bold text-current">{position}</span>
        );
    }
  };

  const getRankBg = (position: number) => {
    switch (position) {
      case 1:
        return "bg-gradient-to-br from-yellow-400 via-yellow-500 to-amber-500 shadow-lg shadow-yellow-400/50";
      case 2:
        return "bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 shadow-md shadow-gray-400/30";
      case 3:
        return "bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 shadow-md shadow-amber-500/30";
      default:
        return "bg-gradient-to-br from-green-100 via-green-200 to-emerald-200 shadow-sm";
    }
  };

  return (
    <div className="xl:order-4 order-4">
      <div
        className="group relative"
        data-sal="slide-left"
        data-sal-delay="200"
      >
        <div className="absolute -inset-1 bg-gradient-to-br from-[#6B9071] via-[#AEC3B0] to-[#375534] rounded-xl blur-lg opacity-30 group-hover:opacity-50 transition duration-500"></div>
               <div className="relative w-80 bg-gradient-to-br from-[#004643] via-[#004643] to-[#001e1d] backdrop-blur-md rounded-xl p-6 border border-[#abd1c6]/30 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105">
          <div className="relative space-y-4 text-center">
            {/* Иконка */}
            <div className="w-12 h-12 mx-auto bg-gradient-to-br from-[#f9bc60] to-[#f9bc60] rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <LucideIcons.Star size="md" className="text-[#001e1d]" />
            </div>

            {/* Заголовок */}
            <h3 className="text-lg font-bold text-[#fffffe]">
              Топ-донатеры
            </h3>

            {/* Описание */}
            <p className="text-sm text-[#abd1c6] leading-relaxed">
              Наши самые щедрые помощники
            </p>

            {/* Список донатеров */}
            <div className="space-y-2">
              {donors.map((donor, index) => (
                <div
                  key={donor.name}
                  className={`group/item relative overflow-hidden rounded-lg transition-all duration-300 cursor-pointer ${
                    donor.isTop
                      ? "bg-gradient-to-r from-[#f9bc60]/20 via-[#f9bc60]/10 to-[#f9bc60]/20 backdrop-blur-md border border-[#f9bc60]/30 shadow-lg"
                      : "bg-gradient-to-r from-[#001e1d]/40 via-[#004643]/20 to-[#001e1d]/40 backdrop-blur-md border border-[#abd1c6]/20 shadow-sm"
                  }`}
                >
                  <div className="relative p-4 flex items-center gap-4">
                    <div className="flex-shrink-0 relative">
                      <div
                        className={`w-10 h-10 rounded-full ${getRankBg(donor.position)} flex items-center justify-center relative`}
                      >
                        {getRankIcon(donor.position)}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <div
                          className={`font-bold text-base ${
                            donor.isTop
                              ? "text-[#fffffe]"
                              : "text-[#abd1c6]"
                          }`}
                        >
                          {donor.name}
                        </div>
                        {donor.isTop && (
                          <LucideIcons.Star size="md" className="text-yellow-400" />
                        )}
                      </div>
                      <div
                        className={`text-base font-bold ${
                          donor.isTop
                            ? "text-[#f9bc60]"
                            : "text-[#abd1c6]"
                        }`}
                      >
                        ₽{donor.amount}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Благодарность */}
            <div className="p-3 bg-[#001e1d]/40 rounded-lg border border-[#abd1c6]/20">
              <div className="text-sm font-medium text-[#abd1c6] mb-1">
                Спасибо за поддержку!
              </div>
              <div className="text-sm text-[#abd1c6]/70">
                💝 Каждая копейка помогает 💝
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}