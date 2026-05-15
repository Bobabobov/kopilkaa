"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { shouldShowMobileBottomNav } from "@/lib/navigation/mobileBottomNav";

export default function ScrollToTop() {
  const pathname = usePathname();
  const hasBottomNav = shouldShowMobileBottomNav(pathname);
  const [isVisible, setIsVisible] = useState(false);
  const [isNearFooter, setIsNearFooter] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    let rafId: number | null = null;
    let prevVisible = false;
    let prevNearFooter = false;

    const media = window.matchMedia("(max-width: 639px)");
    const updateMobile = () => setIsMobile(media.matches);
    updateMobile();
    if (media.addEventListener) {
      media.addEventListener("change", updateMobile);
    } else {
      media.addListener(updateMobile);
    }

    const toggleVisibility = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const distanceToBottom = documentHeight - (scrollTop + windowHeight);
      const mobileNow = window.matchMedia("(max-width: 639px)").matches;

      // На мобильных не двигаем кнопку к футеру — это и вызывало "дергание".
      const nearFooter = mobileNow ? false : distanceToBottom < 250;
      const visibleNow = scrollTop > 300;

      if (nearFooter !== prevNearFooter) {
        prevNearFooter = nearFooter;
        setIsNearFooter(nearFooter);
      }
      if (visibleNow !== prevVisible) {
        prevVisible = visibleNow;
        setIsVisible(visibleNow);
      }
    };

    const onScroll = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = null;
        toggleVisibility();
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    toggleVisibility();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId !== null) window.cancelAnimationFrame(rafId);
      if (media.removeEventListener) {
        media.removeEventListener("change", updateMobile);
      } else {
        media.removeListener(updateMobile);
      }
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          type="button"
          initial={{ opacity: 0, y: 12, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.9 }}
          whileHover={{ scale: isMobile ? 1 : 1.05 }}
          whileTap={{ scale: 0.98 }}
          onClick={scrollToTop}
          className={`fixed right-4 sm:right-6 md:right-8 z-40 flex items-center justify-center sm:justify-start gap-2 font-semibold transition-all duration-300 ${
            isMobile
              ? "h-11 w-11 rounded-full p-0"
              : "px-4 py-3 sm:px-5 sm:py-3.5 rounded-xl"
          } ${
            hasBottomNav
              ? "max-[1199px]:bottom-[calc(var(--bottom-nav-offset)+0.75rem)] min-[1200px]:bottom-8"
              : isMobile
                ? "bottom-20"
                : isNearFooter
                  ? "bottom-32 sm:bottom-36 md:bottom-40 lg:bottom-20"
                  : "bottom-24 sm:bottom-28 md:bottom-8 lg:bottom-8"
          }`}
          style={{
            background: "linear-gradient(135deg, #e8a545 0%, #f9bc60 50%, #e8a545 100%)",
            color: "#001e1d",
            border: "2px solid rgba(0, 30, 29, 0.5)",
            boxShadow:
              "0 4px 14px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255,255,255,0.15), 0 10px 30px rgba(249, 188, 96, 0.4)",
          }}
          aria-label="Прокрутить наверх"
          title="Наверх"
        >
          <ArrowUp className={`${isMobile ? "w-5 h-5" : "w-5 h-5"} flex-shrink-0`} strokeWidth={2.5} />
          <span className="hidden sm:inline text-sm sm:text-base whitespace-nowrap">
            Наверх
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
