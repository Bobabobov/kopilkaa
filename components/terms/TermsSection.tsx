// components/terms/TermsSection.tsx
"use client";

interface TermsSectionProps {
  number: string;
  title: string;
  children: React.ReactNode;
  delay?: number;
}

export default function TermsSection({ number, title, children, delay = 0 }: TermsSectionProps) {
  const getAnimationClass = () => {
    switch (delay) {
      case 0.3: return "animate-fade-in-up-delay-3";
      case 0.4: return "animate-fade-in-up-delay-4";
      case 0.5: return "animate-fade-in-up-delay-5";
      case 0.6: return "animate-fade-in-up-delay-1";
      case 0.7: return "animate-fade-in-up-delay-2";
      case 0.8: return "animate-fade-in-up-delay-3";
      case 0.9: return "animate-fade-in-up-delay-4";
      case 1.0: return "animate-fade-in-up-delay-5";
      case 1.1: return "animate-fade-in-up-delay-1";
      case 1.2: return "animate-fade-in-up-delay-2";
      case 1.3: return "animate-fade-in-up-delay-3";
      default: return "animate-fade-in-up";
    }
  };

  return (
    <section className={`mb-8 ${getAnimationClass()}`}>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <span className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
          {number}
        </span>
        {title}
      </h2>
      <div className="space-y-4 text-gray-700 dark:text-gray-300">
        {children}
      </div>
    </section>
  );
}
