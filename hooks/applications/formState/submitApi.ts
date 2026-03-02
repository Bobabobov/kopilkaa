"use client";

const POST_APPLICATION_TIMEOUT_MS = 45_000; // 45 секунд

export interface SubmitApplicationPayload {
  title: string;
  summary: string;
  story: string;
  amount: string;
  payment: string;
  images: string[];
  hpCompany: string;
  acknowledgedRules: boolean;
  clientMeta: {
    filledMs: number | null;
    storyEditMs?: number | null;
  };
}

export async function postApplication(
  payload: SubmitApplicationPayload,
): Promise<{ response: Response; data: Record<string, unknown> }> {
  const controller = new AbortController();
  const timeoutId = setTimeout(
    () => controller.abort(),
    POST_APPLICATION_TIMEOUT_MS,
  );
  let response: Response;
  try {
    response = await fetch("/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
  } catch (e) {
    clearTimeout(timeoutId);
    if (e instanceof Error && e.name === "AbortError") {
      throw new Error(
        "Отправка заняла слишком много времени. Проверьте интернет и попробуйте снова.",
      );
    }
    throw e;
  }
  clearTimeout(timeoutId);

  const data = await response.json().catch(() => ({}));
  return { response, data: data as Record<string, unknown> };
}
