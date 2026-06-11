/**
 * Получает URL аватара через Telegram Bot API, когда Login Widget
 * не отдаёт photo_url (приватность) или присылает заглушку userpic.
 */
export async function fetchTelegramProfilePhotoUrl(
  telegramId: string,
): Promise<string | null> {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  if (!token || !telegramId) return null;

  const apiBase = `https://api.telegram.org/bot${token}`;

  try {
    const photosRes = await fetch(
      `${apiBase}/getUserProfilePhotos?user_id=${encodeURIComponent(telegramId)}&limit=1`,
      { signal: AbortSignal.timeout(15_000) },
    );
    if (!photosRes.ok) return null;

    const photosData = (await photosRes.json()) as {
      ok?: boolean;
      result?: { photos?: Array<Array<{ file_id?: string }>> };
    };
    const sizes = photosData.result?.photos?.[0];
    if (!photosData.ok || !sizes?.length) return null;

    const largest = sizes[sizes.length - 1];
    if (!largest?.file_id) return null;

    const fileRes = await fetch(
      `${apiBase}/getFile?file_id=${encodeURIComponent(largest.file_id)}`,
      { signal: AbortSignal.timeout(15_000) },
    );
    if (!fileRes.ok) return null;

    const fileData = (await fileRes.json()) as {
      ok?: boolean;
      result?: { file_path?: string };
    };
    if (!fileData.ok || !fileData.result?.file_path) return null;

    return `${apiBase}/${fileData.result.file_path}`;
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    console.warn(
      `[telegram-avatar] Bot API: не удалось получить фото для ${telegramId}:`,
      reason,
    );
    return null;
  }
}
