"use client";

export interface SubmitApplicationPayload {
  title: string;
  summary: string;
  story: string;
  amount: string;
  payment: string;
  images: string[];
  hpCompany: string;
  acknowledgedRules: boolean;
  clientMeta: { filledMs: number | null };
}

export async function postApplication(
  payload: SubmitApplicationPayload,
): Promise<{ response: Response; data: Record<string, unknown> }> {
  const response = await fetch("/api/applications", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json().catch(() => ({}));
  return { response, data: data as Record<string, unknown> };
}
