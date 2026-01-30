"use client";

import { useEffect, useState } from "react";
import { buildAuthModalUrl } from "@/lib/authModalUrl";
import type { UserShape } from "./types";

export function useApplicationFormAuth(): {
  user: UserShape | null;
  loadingAuth: boolean;
} {
  const [user, setUser] = useState<UserShape | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    const getLoc = () => {
      if (typeof window === "undefined") {
        return { pathname: "/applications", search: "" };
      }
      return {
        pathname: window.location.pathname,
        search: window.location.search,
      };
    };

    const maybeRedirectToAuth = () => {
      const { pathname, search } = getLoc();
      const params = new URLSearchParams(search);
      const modalParam = params.get("modal") || "";
      if (modalParam.startsWith("auth")) return;
      const href = buildAuthModalUrl({
        pathname,
        search,
        modal: "auth/signup",
      });
      window.location.href = href;
    };

    fetch("/api/profile/me", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (!d.user) {
          maybeRedirectToAuth();
          return;
        }
        setUser(d.user);
      })
      .catch(() => {
        maybeRedirectToAuth();
      })
      .finally(() => setLoadingAuth(false));
  }, []);

  return { user, loadingAuth };
}
