"use client";

export default function FooterCopyright() {
  return (
    <div className="mt-16 pt-8 border-t relative" style={{ borderColor: 'rgba(171, 209, 198, 0.2)' }}>
      {/* Декоративные точки на линии */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex gap-3">
        <div className="w-2 h-2 rounded-full bg-[#f9bc60] shadow-[0_0_10px_rgba(249,188,96,0.6)]"></div>
        <div className="w-2 h-2 rounded-full bg-[#abd1c6] shadow-[0_0_10px_rgba(171,209,198,0.6)]"></div>
        <div className="w-2 h-2 rounded-full bg-[#fffffe] shadow-[0_0_10px_rgba(255,255,254,0.6)]"></div>
      </div>
      
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="text-sm transition-colors duration-300 hover:text-[#f9bc60]" style={{ color: '#abd1c6' }}>
          © {new Date().getFullYear()} «Копилка». Все права защищены.
        </div>
        <div className="flex items-center gap-2 text-sm group" style={{ color: '#abd1c6' }}>
          <span className="transition-colors duration-300 group-hover:text-[#fffffe]">Сделано с</span>
          <span className="text-lg animate-pulse transition-transform duration-300 group-hover:scale-125" style={{ color: '#f9bc60', animationDuration: '1.5s' }}>❤️</span>
          <span className="transition-colors duration-300 group-hover:text-[#fffffe]">для помощи людям</span>
        </div>
      </div>
    </div>
  );
}


