// components/auth/BanCheck.tsx
"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

interface BanCheckProps {
  children: React.ReactNode;
}

export default function BanCheck({ children }: BanCheckProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);
  const [isBanned, setIsBanned] = useState(false);

  useEffect(() => {
    // Не проверяем блокировку на странице /banned
    if (pathname === "/banned") {
      setIsChecking(false);
      return;
    }

    // Не проверяем блокировку для публичных страниц
    const publicPaths = [
      "/",
      "/login",
      "/signup",
      "/support",
      "/heroes",
      "/stories",
      "/games",
      "/advertising",
      "/standards",
      "/reports",
      "/banned",
      "/api",
      "/_next",
    ];

    // Проверяем, является ли путь публичным
    const isPublicPath = publicPaths.some((path) => {
      if (path === "/") {
        return pathname === "/";
      }
      return pathname === path || pathname.startsWith(path + "/");
    });

    if (isPublicPath) {
      setIsChecking(false);
      return;
    }

    const checkBan = async () => {
      try {
        const response = await fetch("/api/auth/check", { cache: "no-store" });
        const data = await response.json();

        if (data.banned) {
          setIsBanned(true);
          router.push("/banned");
          return;
        }
      } catch (error) {
        console.error("Error checking ban status:", error);
      } finally {
        setIsChecking(false);
      }
    };

    checkBan();
  }, [pathname, router]);

  // Показываем загрузку только если проверяем блокировку
  if (isChecking && pathname !== "/banned") {
    return null; // Или можно показать спиннер, но обычно лучше не показывать ничего
  }

  if (isBanned) {
    return null; // Редирект уже произошел
  }

  return <>{children}</>;
}
