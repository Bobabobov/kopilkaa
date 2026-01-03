// lib/authModalUrl.ts

export type AuthModalValue =
  | "auth"
  | "auth/signup"
  | "auth/login/email"
  | "auth/signup/email";

function buildCleanNext(pathname: string, search: string): string {
  const clean = new URLSearchParams(search || "");
  clean.delete("modal");
  clean.delete("next");
  const qs = clean.toString();
  return qs ? `${pathname}?${qs}` : pathname;
}

/**
 * Builds a URL on the CURRENT pathname with `modal=...` and `next=...`.
 * - modal stays on the same page (no navigation to "/")
 * - next always points to the same page without modal params (safe internal return)
 */
export function buildAuthModalUrl(opts: {
  pathname: string;
  search?: string;
  modal: AuthModalValue;
}): string {
  const pathname = opts.pathname || "/";
  const search = opts.search || "";

  const params = new URLSearchParams(search);
  params.set("modal", opts.modal);
  params.set("next", buildCleanNext(pathname, search));

  const qs = params.toString();
  return qs ? `${pathname}?${qs}` : pathname;
}


