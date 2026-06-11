import dns from "node:dns";

const FETCH_ATTEMPTS = 3;
const FETCH_TIMEOUT_MS = 12_000;

/** На части VPS IPv6 «висит» — Node пробует оба стека и падает с fetch failed. */
if (typeof dns.setDefaultResultOrder === "function") {
  dns.setDefaultResultOrder("ipv4first");
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isTransientFetchError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  if (error.name === "AbortError") return true;
  const msg = error.message.toLowerCase();
  return msg.includes("fetch failed") || msg.includes("network");
}

async function fetchTelegramBotJson<T>(
  url: string,
): Promise<T | null> {
  for (let attempt = 1; attempt <= FETCH_ATTEMPTS; attempt += 1) {
    try {
      const res = await fetch(url, {
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
        headers: { Accept: "application/json" },
      });
      if (!res.ok) return null;
      return (await res.json()) as T;
    } catch (error) {
      if (isTransientFetchError(error) && attempt < FETCH_ATTEMPTS) {
        await sleep(400 * attempt * attempt);
        continue;
      }
      throw error;
    }
  }
  return null;
}

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
    const photosData = await fetchTelegramBotJson<{
      ok?: boolean;
      result?: { photos?: Array<Array<{ file_id?: string }>> };
    }>(
      `${apiBase}/getUserProfilePhotos?user_id=${encodeURIComponent(telegramId)}&limit=1`,
    );
    const sizes = photosData?.result?.photos?.[0];
    if (!photosData?.ok || !sizes?.length) return null;

    const largest = sizes[sizes.length - 1];
    if (!largest?.file_id) return null;

    const fileData = await fetchTelegramBotJson<{
      ok?: boolean;
      result?: { file_path?: string };
    }>(
      `${apiBase}/getFile?file_id=${encodeURIComponent(largest.file_id)}`,
    );
    if (!fileData?.ok || !fileData.result?.file_path) return null;

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
