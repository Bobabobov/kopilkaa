"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useNotificationBell } from "@/components/notifications/hooks/useNotificationBell";
import NotificationBellButton from "@/components/notifications/NotificationBellButton";
import NotificationDropdownMenu from "@/components/notifications/NotificationDropdownMenu";

export default function NotificationBell() {
  const router = useRouter();
  const {
    notifications,
    unreadCount,
    isOpen,
    setIsOpen,
    loading,
    lastViewedTimestamp,
    mounted,
    menuPosition,
    buttonRef,
    handleNotificationClick,
  } = useNotificationBell();

  const handleShowAll = () => {
    router.push("/feed?section=notifications");
    setIsOpen(false);
  };

  // Блокируем скролл страницы при открытом меню на мобильных
  useEffect(() => {
    if (!isOpen) return;

    const isMobile = typeof window !== "undefined" && window.innerWidth < 640;

    if (isMobile) {
      const scrollY = window.scrollY;

      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.documentElement.style.overflow = "hidden";

      const preventScroll = (e: Event) => {
        const target = e.target as Element;
        if (target.closest("[data-notification-menu]")) {
          return;
        }
        e.preventDefault();
        e.stopPropagation();
      };

      document.addEventListener("touchmove", preventScroll, { passive: false });
      document.addEventListener("wheel", preventScroll, { passive: false });

      return () => {
        document.removeEventListener("touchmove", preventScroll);
        document.removeEventListener("wheel", preventScroll);

        document.body.style.overflow = "";
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        document.documentElement.style.overflow = "";

        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  // Закрытие по клику вне области и по Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (
        !target.closest(".notification-dropdown") &&
        !target.closest("[data-notification-menu]")
      ) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  return (
    <div className="relative notification-dropdown">
      {/* Кнопка колокольчика */}
      <NotificationBellButton
        isOpen={isOpen}
        unreadCount={unreadCount}
        onClick={() => setIsOpen(!isOpen)}
        buttonRef={buttonRef}
      />

      {/* Выпадающее меню уведомлений */}
      <NotificationDropdownMenu
        isOpen={isOpen}
        mounted={mounted}
        menuPosition={menuPosition}
        buttonRef={buttonRef}
        notifications={notifications}
        loading={loading}
        lastViewedTimestamp={lastViewedTimestamp}
        unreadCount={unreadCount}
        onNotificationClick={handleNotificationClick}
        onShowAll={handleShowAll}
      />
    </div>
  );
}
