/**
 * Единый разбор тел ответов API для понятных сообщений пользователю.
 * Не раскрывает внутренние детали — только поля message / error из JSON.
 */

const DEFAULT_FALLBACK =
  'Не удалось выполнить действие. Попробуйте ещё раз через минуту.';

export function getMessageFromApiJson(
  data: unknown,
  fallback: string = DEFAULT_FALLBACK,
): string {
  if (!data || typeof data !== 'object') {
    return fallback;
  }

  const o = data as Record<string, unknown>;

  if (typeof o.message === 'string' && o.message.trim()) {
    return o.message.trim();
  }

  if (typeof o.error === 'string' && o.error.trim()) {
    return o.error.trim();
  }

  const errors = o.errors;
  if (Array.isArray(errors) && errors.length > 0) {
    const first = errors[0];
    if (typeof first === 'string' && first.trim()) {
      return first.trim();
    }
    if (first && typeof first === 'object') {
      const msg = (first as { message?: unknown }).message;
      if (typeof msg === 'string' && msg.trim()) {
        return msg.trim();
      }
    }
  }

  return fallback;
}

/**
 * Читает тело ответа один раз. После вызова повторно читать `res` нельзя.
 */
export async function getMessageFromApiResponse(
  res: Response,
  fallback: string = DEFAULT_FALLBACK,
): Promise<string> {
  const text = await res.text().catch(() => '');
  if (!text.trim()) {
    return fallback;
  }

  try {
    const data = JSON.parse(text) as unknown;
    return getMessageFromApiJson(data, fallback);
  } catch {
    return fallback;
  }
}

/** После `await res.json()`: если ответ не успешный — бросает Error с текстом для пользователя. */
export function throwIfApiFailed(
  res: Response,
  body: unknown,
  fallback: string = DEFAULT_FALLBACK,
): void {
  if (!res.ok) {
    throw new Error(getMessageFromApiJson(body, fallback));
  }
}
