import { useMemo } from "react";
import { buildUploadUrl } from "@/lib/uploads/url";

interface CoverStyleParams {
  theme: { background: string };
  headerCover?: string | null;
  backgroundColor?: string | null;
}

/**
 * Возвращает inline-стиль для обложки профиля с учётом своей загрузки,
 * темы и запасного градиента.
 */
export function useCoverStyle({
  theme,
  headerCover,
  backgroundColor,
}: CoverStyleParams) {
  return useMemo(() => {
    const fallbackGradient =
      "radial-gradient(120% 100% at 15% 20%, rgba(255,255,255,0.12), transparent 45%), radial-gradient(90% 80% at 80% 10%, rgba(30,209,177,0.25), transparent 40%), linear-gradient(135deg, #1fe0ba 0%, #11aa92 45%, #0a4c43 100%)";

    if (headerCover) {
      const coverUrl = buildUploadUrl(headerCover);
      return {
        backgroundImage: `url(${coverUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      } as React.CSSProperties;
    }

    if (theme.background === "image" && (theme as { image?: string }).image) {
      return {
        backgroundImage: `url(${(theme as { image?: string }).image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      } as React.CSSProperties;
    }

    if (theme.background === "color" && backgroundColor) {
      return {
        backgroundColor,
      } as React.CSSProperties;
    }

    return {
      backgroundImage: fallbackGradient,
      backgroundSize: "cover",
      backgroundPosition: "center",
    } as React.CSSProperties;
  }, [
    headerCover,
    theme.background,
    (theme as { image?: string }).image,
    backgroundColor,
  ]);
}
