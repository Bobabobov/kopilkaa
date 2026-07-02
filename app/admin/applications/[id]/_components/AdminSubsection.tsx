interface AdminSubsectionProps {
  title: string;
  children: React.ReactNode;
  /** Первый блок в секции — без верхней границы */
  first?: boolean;
}

/** Подраздел внутри крупной секции (без отдельной нумерации). */
export function AdminSubsection({
  title,
  children,
  first = false,
}: AdminSubsectionProps) {
  return (
    <div className={first ? "min-w-0" : "min-w-0 border-t border-white/10 pt-5 mt-5"}>
      <h3 className="mb-3 text-xs sm:text-sm font-bold uppercase tracking-wide text-[#abd1c6]/90">
        {title}
      </h3>
      {children}
    </div>
  );
}
