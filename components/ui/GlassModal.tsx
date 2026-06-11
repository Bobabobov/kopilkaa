"use client";

import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { useGlassModalScrollLock } from "@/hooks/ui/useGlassModalScrollLock";
import { cn } from "@/lib/utils";

export type GlassModalSize =
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "4xl";

const sizeClasses: Record<GlassModalSize, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
};

export function GlassModalChrome() {
  return (
    <>
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.14] via-white/[0.03] to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-white/[0.16] via-white/[0.05] to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-10 top-8 h-32 w-32 rotate-[35deg] bg-gradient-to-br from-white/25 via-white/8 to-transparent blur-[1px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-[1px] rounded-[1.3rem] border border-white/[0.07]"
        aria-hidden
      />
    </>
  );
}

export function GlassModalCloseButton({
  onClose,
  className,
}: {
  onClose: () => void;
  className?: string;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClose}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "rounded-xl border border-white/15 bg-white/[0.06] p-2 text-[#abd1c6] shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] backdrop-blur-md transition-colors hover:border-white/25 hover:bg-white/[0.1] hover:text-white",
        className,
      )}
      aria-label="Закрыть"
    >
      <LucideIcons.X className="h-5 w-5" />
    </motion.button>
  );
}

export function GlassModalHeader({
  title,
  subtitle,
  icon,
  onClose,
  showCloseButton = true,
  className,
  titleId,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  icon?: ReactNode;
  onClose?: () => void;
  showCloseButton?: boolean;
  className?: string;
  titleId?: string;
}) {
  return (
    <div
      className={cn(
        "relative border-b border-white/[0.12] bg-white/[0.05] px-4 py-4 backdrop-blur-xl sm:px-5",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2
            id={titleId}
            className="flex items-center gap-2.5 text-lg font-semibold tracking-tight text-white drop-shadow-[0_1px_8px_rgba(0,0,0,0.35)]"
          >
            {icon && (
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_8px_24px_rgba(0,0,0,0.2)] backdrop-blur-md">
                {icon}
              </span>
            )}
            {title}
          </h2>
          {subtitle && (
            <div className="mt-2 text-sm text-[#abd1c6]/80">{subtitle}</div>
          )}
        </div>
        {showCloseButton && onClose && (
          <GlassModalCloseButton onClose={onClose} />
        )}
      </div>
    </div>
  );
}

export type GlassModalProps = {
  open?: boolean;
  show?: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: ReactNode;
  subtitle?: ReactNode;
  icon?: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  headerAfter?: ReactNode;
  size?: GlassModalSize;
  zIndex?: number;
  align?: "center" | "end";
  maxHeight?: string;
  showCloseButton?: boolean;
  closeOnBackdropClick?: boolean;
  hideHeader?: boolean;
  panelClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
  backdropClassName?: string;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
  titleId?: string;
  dialogRef?: RefObject<HTMLDivElement | null>;
  portal?: boolean;
};

export function GlassModal({
  open,
  show,
  onClose,
  children,
  title,
  subtitle,
  icon,
  header,
  footer,
  headerAfter,
  size = "lg",
  zIndex = 200,
  align = "center",
  maxHeight = "min(90dvh, 760px)",
  showCloseButton = true,
  closeOnBackdropClick = true,
  hideHeader = false,
  panelClassName,
  bodyClassName,
  footerClassName,
  backdropClassName,
  ariaLabelledBy,
  ariaDescribedBy,
  titleId,
  dialogRef: externalDialogRef,
  portal = true,
}: GlassModalProps) {
  const [mounted, setMounted] = useState(false);
  const internalDialogRef = useRef<HTMLDivElement>(null);
  const dialogRef = externalDialogRef ?? internalDialogRef;
  const isOpen = open ?? show ?? false;

  useEffect(() => {
    setMounted(true);
  }, []);

  useGlassModalScrollLock(isOpen, dialogRef, onClose);

  const hasDefaultHeader =
    !hideHeader && !header && (title !== undefined || icon !== undefined);

  const modalTree = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28 }}
          className={cn(
            "fixed inset-0 flex overflow-hidden bg-[#001e1d]/55 p-3 backdrop-blur-xl sm:p-4",
            align === "end"
              ? "items-end justify-center pb-[max(1rem,env(safe-area-inset-bottom))] sm:items-center"
              : "items-center justify-center",
            backdropClassName,
          )}
          style={{ zIndex }}
          onClick={closeOnBackdropClick ? onClose : undefined}
          role="presentation"
        >
          <motion.div
            className="pointer-events-none absolute left-1/4 top-[12%] h-64 w-64 -translate-x-1/2 rounded-full bg-[#abd1c6]/12 blur-3xl"
            animate={{ opacity: [0.3, 0.55, 0.3], scale: [1, 1.06, 1] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            aria-hidden
          />
          <motion.div
            className="pointer-events-none absolute bottom-[10%] right-[18%] h-56 w-56 rounded-full bg-[#f9bc60]/10 blur-3xl"
            animate={{ opacity: [0.2, 0.45, 0.2], scale: [1, 1.1, 1] }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.4,
            }}
            aria-hidden
          />

          <motion.div
            ref={dialogRef}
            initial={{ opacity: 0, scale: 0.92, y: align === "end" ? 40 : 32 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: align === "end" ? 24 : 20 }}
            transition={{
              type: "spring",
              stiffness: 320,
              damping: 30,
            }}
            className={cn(
              "relative flex w-full min-h-0 flex-col overflow-hidden rounded-[1.35rem] border border-white/20 bg-[#002826]/55 shadow-[0_32px_90px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.22),inset_0_-1px_0_rgba(255,255,255,0.04)] backdrop-blur-2xl backdrop-saturate-150",
              sizeClasses[size],
              panelClassName,
            )}
            style={{ maxHeight }}
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby={ariaLabelledBy}
            aria-describedby={ariaDescribedBy}
          >
            <GlassModalChrome />

            {header}

            {hasDefaultHeader && title !== undefined && (
              <GlassModalHeader
                title={title}
                subtitle={subtitle}
                icon={icon}
                onClose={onClose}
                showCloseButton={showCloseButton}
                titleId={titleId ?? ariaLabelledBy}
              />
            )}

            {headerAfter}

            <div
              className={cn(
                "custom-scrollbar scrollbar-hidden relative min-h-0 flex-1 overflow-y-auto overscroll-contain touch-pan-y bg-black/10 backdrop-blur-sm",
                hasDefaultHeader || header ? "px-4 py-4 sm:px-5" : "",
                bodyClassName,
              )}
            >
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-white/[0.06] to-transparent"
                aria-hidden
              />
              <div className="relative">{children}</div>
            </div>

            {footer && (
              <div
                className={cn(
                  "relative shrink-0 border-t border-white/[0.12] bg-white/[0.04] px-4 py-4 backdrop-blur-xl sm:px-5",
                  footerClassName,
                )}
              >
                {footer}
              </div>
            )}

            {!header && !hasDefaultHeader && showCloseButton && (
              <div className="absolute right-3 top-3 z-20 sm:right-4 sm:top-4">
                <GlassModalCloseButton onClose={onClose} />
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (!mounted) {
    return null;
  }

  if (portal) {
    return createPortal(modalTree, document.body);
  }

  return modalTree;
}
