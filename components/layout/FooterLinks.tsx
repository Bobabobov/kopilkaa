"use client";
import Link from "next/link";

export default function FooterLinks() {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold" style={{ color: '#fffffe' }}>
        Полезные ссылки
      </h3>
      
      <div className="space-y-3">
        <Link 
          href="/terms" 
          className="block text-sm transition-all duration-300 hover:translate-x-2 group" 
          style={{ color: '#abd1c6' }}
        >
          <span className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full transition-all duration-300 group-hover:w-2 group-hover:h-2" style={{ backgroundColor: '#f9bc60' }}></div>
            Правила использования
          </span>
        </Link>
        <Link 
          href="/terms" 
          className="block text-sm transition-all duration-300 hover:translate-x-2 group" 
          style={{ color: '#abd1c6' }}
        >
          <span className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full transition-all duration-300 group-hover:w-2 group-hover:h-2" style={{ backgroundColor: '#f9bc60' }}></div>
            Политика конфиденциальности
          </span>
        </Link>
        <Link 
          href="/terms" 
          className="block text-sm transition-all duration-300 hover:translate-x-2 group" 
          style={{ color: '#abd1c6' }}
        >
          <span className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full transition-all duration-300 group-hover:w-2 group-hover:h-2" style={{ backgroundColor: '#f9bc60' }}></div>
            Помощь и поддержка
          </span>
        </Link>
      </div>
    </div>
  );
}


