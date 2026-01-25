import { useMemo } from "react";

interface CoverStyleParams {
  theme: { background: string };
  headerBackground?: string | null;
  backgroundColor?: string | null;
}

/**
 * Возвращает inline-стиль для обложки профиля с учётом темы, фоновой картинки
 * и запасного градиента.
 */
export function useCoverStyle({
  theme,
  headerBackground,
  backgroundColor,
}: CoverStyleParams) {
  return useMemo(() => {
    const fallbackGradient =
      "radial-gradient(120% 100% at 15% 20%, rgba(255,255,255,0.12), transparent 45%), radial-gradient(90% 80% at 80% 10%, rgba(30,209,177,0.25), transparent 40%), linear-gradient(135deg, #1fe0ba 0%, #11aa92 45%, #0a4c43 100%)";

    if (headerBackground) {
      return {
        backgroundImage: `url(${headerBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      } as React.CSSProperties;
    }

    if (theme.background === "image" && (theme as any).image) {
      return {
        backgroundImage: `url(${(theme as any).image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      } as React.CSSProperties;
    }

    if (theme.background === "color" && backgroundColor) {
      return {
        backgroundImage: `linear-gradient(135deg, ${backgroundColor}, #0b5f54)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      } as React.CSSProperties;
    }

    return {
      backgroundImage: fallbackGradient,
      backgroundSize: "cover",
      backgroundPosition: "center",
    } as React.CSSProperties;
  }, [
    headerBackground,
    theme.background,
    (theme as any).image,
    (theme as any).gradient,
    backgroundColor,
  ]);
}
