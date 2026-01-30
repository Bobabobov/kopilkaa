"use client";

import { postApplication } from "@/hooks/applications/formState/submitApi";

export type PendingApplicationPayload = {
  title: string;
  summary: string;
  story: string;
  amount: string;
  payment: string;
  images: string[];
  hpCompany: string;
  acknowledgedRules: boolean;
  clientMeta: { filledMs: number | null };
};

const PENDING_KEY = "pending-application-payload";
const SUBMITTED_KEY = "pending-application-submitted";
const INFLIGHT_KEY = "pending-application-inflight";

export function savePendingApplication(payload: PendingApplicationPayload): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PENDING_KEY, JSON.stringify(payload));
  } catch {
    // ignore
  }
}

export function loadPendingApplication(): PendingApplicationPayload | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(PENDING_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<PendingApplicationPayload>;
    if (!parsed || typeof parsed !== "object") return null;
    if (!parsed.title || !parsed.summary || !parsed.story) return null;
    if (!Array.isArray(parsed.images)) return null;
    return parsed as PendingApplicationPayload;
  } catch {
    return null;
  }
}

export function clearPendingApplication(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(PENDING_KEY);
  } catch {
    // ignore
  }
}

export function markPendingSubmissionSuccess(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(SUBMITTED_KEY, "true");
  } catch {
    // ignore
  }
}

export function consumePendingSubmissionSuccess(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const value = sessionStorage.getItem(SUBMITTED_KEY) === "true";
    if (value) sessionStorage.removeItem(SUBMITTED_KEY);
    return value;
  } catch {
    return false;
  }
}

export async function submitPendingApplicationIfNeeded(): Promise<boolean> {
  if (typeof window === "undefined") return false;
  if (sessionStorage.getItem(INFLIGHT_KEY) === "true") return false;

  const payload = loadPendingApplication();
  if (!payload) return false;

  sessionStorage.setItem(INFLIGHT_KEY, "true");
  try {
    const { response, data } = await postApplication(payload);
    if (response.ok) {
      markPendingSubmissionSuccess();
      clearPendingApplication();
      return true;
    }
    console.error("[pendingSubmission] Submit failed:", data);
    return false;
  } catch (error) {
    console.error("[pendingSubmission] Submit error:", error);
    return false;
  } finally {
    sessionStorage.removeItem(INFLIGHT_KEY);
  }
}
