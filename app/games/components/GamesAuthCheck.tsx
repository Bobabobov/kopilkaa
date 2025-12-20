"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import GamesLoading from "./GamesLoading";

interface GamesAuthCheckProps {
  children: React.ReactNode;
}

export default function GamesAuthCheck({ children }: GamesAuthCheckProps) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/profile/me", { cache: "no-store" });
        if (response.ok) {
          const data = await response.json();
          if (data.user) {
            setIsAuthorized(true);
          } else {
            router.push("/login");
          }
        } else {
          router.push("/login");
        }
      } catch (error) {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return <GamesLoading />;
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}


