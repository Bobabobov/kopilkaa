"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import HeaderLogo from "./HeaderLogo";
import NavAuth from "./NavAuth";
import NotificationBell from "./NotificationBell";
import DonateButton from "./DonateButton";
import { MobileDrawerUserCard } from "./MobileDrawerUserCard";
import { MobileDrawerNavigation } from "./MobileDrawerNavigation";
import { useAuth } from "@/hooks/useAuth";

interface HeaderMobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  showNotifications: boolean;
}

const panelTransition = {
  type: "spring" as const,
  damping: 34,
  stiffness: 320,
  mass: 0.85,
};

export default function HeaderMobileDrawer({
  isOpen,
  onClose,
  showNotifications,
}: HeaderMobileDrawerProps) {
  const { user: authUser } = useAuth();

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="mobile-menu-backdrop"
            className="fixed inset-0 z-[55] min-[1200px]:hidden bg-[#001e1d]/55 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={onClose}
            aria-hidden
          />

          <motion.aside
            key="mobile-menu-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Меню навигации"
            className="fixed inset-0 z-[60] min-[1200px]:hidden flex flex-col overflow-hidden bg-[#001e1d]/97 backdrop-blur-2xl shadow-[-12px_0_48px_rgba(0,0,0,0.45)]"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={panelTransition}
          >
            <div
              className="pointer-events-none absolute inset-0 overflow-hidden"
              aria-hidden
            >
              <div className="absolute -top-20 -right-16 h-72 w-72 rounded-full bg-[#f9bc60]/10 blur-3xl" />
              <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-[#abd1c6]/8 blur-3xl" />
              <div className="absolute top-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-[#f9bc60]/40 to-transparent" />
            </div>

            <div className="relative z-10 flex shrink-0 items-center justify-between gap-3 border-b border-white/10 px-4 pt-[max(0.875rem,env(safe-area-inset-top))] pb-3 sm:px-5">
              <HeaderLogo />
              <div className="flex items-center gap-2">
                {showNotifications && <NotificationBell />}
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Закрыть меню"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-[#fffffe] transition-colors hover:bg-white/10 active:scale-95"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="relative z-10 flex min-h-0 flex-1 flex-col">
              <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-5">
                <div className="flex w-full flex-col gap-4">
                  <MobileDrawerUserCard onNavigate={onClose} />

                  <DonateButton variant="mobileMenu" onLinkClick={onClose} />

                  <MobileDrawerNavigation onLinkClick={onClose} />
                </div>
              </div>

              <div className="shrink-0 border-t border-white/10 bg-[#001e1d]/80 px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-5">
                <NavAuth
                  isMobile
                  hideProfileLink={Boolean(authUser)}
                  onLinkClick={onClose}
                />
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
