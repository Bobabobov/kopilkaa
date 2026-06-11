/**
 * Загрузка аватара Telegram через браузер пользователя после входа.
 * VPS часто не достучится до api.telegram.org / CDN, а у клиента фото уже есть.
 */
export async function tryUploadTelegramAvatarFromBrowser(
  photoUrl: string | undefined | null,
): Promise<boolean> {
  if (!photoUrl?.startsWith("http")) return false;

  try {
    const response = await fetch(photoUrl, {
      mode: "cors",
      credentials: "omit",
      referrerPolicy: "no-referrer",
    });
    if (!response.ok) return false;

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.startsWith("image/")) return false;

    const blob = await response.blob();
    if (blob.size < 64 || blob.size > 5 * 1024 * 1024) return false;

    const ext = contentType.includes("png")
      ? "png"
      : contentType.includes("webp")
        ? "webp"
        : "jpg";
    const formData = new FormData();
    formData.append("avatar", blob, `telegram-avatar.${ext}`);

    const upload = await fetch("/api/profile/avatar", {
      method: "POST",
      body: formData,
      credentials: "include",
    });
    return upload.ok;
  } catch {
    return false;
  }
}
