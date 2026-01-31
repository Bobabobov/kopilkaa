/**
 * Переиспользуемый компонент карточки.
 * Заменяет дублирующийся паттерн bg-[#004643]/60 backdrop-blur-sm rounded-xl border...
 */
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Вариант стиля карточки */
  variant?: "default" | "glass" | "solid" | "outline";
  /** Отступы внутри карточки */
  padding?: "none" | "sm" | "md" | "lg";
  /** Анимация при наведении */
  hoverable?: boolean;
}

const paddingStyles = {
  none: "",
  sm: "p-3 sm:p-4",
  md: "p-4 sm:p-5 md:p-6",
  lg: "p-5 sm:p-6 md:p-8",
};

const variantStyles = {
  default: "bg-[#004643]/60 backdrop-blur-sm border-[#abd1c6]/20",
  glass: "bg-[#004643]/40 backdrop-blur-md border-[#abd1c6]/15",
  solid: "bg-[#004643] border-[#abd1c6]/25",
  outline: "bg-transparent border-[#abd1c6]/30",
};

/**
 * Базовый компонент карточки с единым стилем проекта.
 * 
 * @example
 * <Card>Контент</Card>
 * <Card variant="glass" padding="lg">Стеклянная карточка</Card>
 * <Card hoverable>Карточка с hover эффектом</Card>
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant = "default",
      padding = "md",
      hoverable = false,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl border",
          variantStyles[variant],
          paddingStyles[padding],
          hoverable && "transition-all duration-200 hover:border-[#abd1c6]/40 hover:shadow-lg",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

/**
 * Заголовок карточки.
 */
export function CardHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex items-center justify-between gap-3 mb-4", className)}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * Заголовок с иконкой.
 */
export function CardTitle({
  icon,
  children,
  className,
}: {
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-2 sm:gap-3", className)}>
      {icon && (
        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#f9bc60]/20 rounded-lg flex items-center justify-center text-[#f9bc60]">
          {icon}
        </div>
      )}
      <h3 className="text-base sm:text-lg font-bold text-[#fffffe]">
        {children}
      </h3>
    </div>
  );
}

/**
 * Контент карточки.
 */
export function CardContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("", className)} {...props}>
      {children}
    </div>
  );
}

/**
 * Футер карточки.
 */
export function CardFooter({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("mt-4 pt-4 border-t border-[#abd1c6]/10", className)}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * Скелетон для загрузки карточки.
 */
export function CardSkeleton({
  className,
  lines = 3,
}: {
  className?: string;
  lines?: number;
}) {
  return (
    <Card className={cn("animate-pulse", className)}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 bg-[#abd1c6]/20 rounded-lg" />
        <div className="h-6 bg-[#abd1c6]/20 rounded w-32" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className="h-4 bg-[#abd1c6]/10 rounded"
            style={{ width: `${100 - i * 15}%` }}
          />
        ))}
      </div>
    </Card>
  );
}
