"use client";

import type { StoredFormData } from "./types";

export function loadFormFromStorage(saveKey: string): StoredFormData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(saveKey);
    if (!raw) return null;
    const data = JSON.parse(raw) as Partial<StoredFormData>;
    return {
      title: data.title ?? "",
      summary: data.summary ?? "",
      story: data.story ?? "",
      amount: data.amount ?? "",
      payment: data.payment ?? "",
      bankName: data.bankName ?? "",
    };
  } catch {
    return null;
  }
}

export function saveFormToStorage(saveKey: string, data: StoredFormData): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(saveKey, JSON.stringify(data));
  } catch (e) {
    console.error("Ошибка при сохранении данных:", e);
  }
}

export function loadTrustAck(trustAckKey: string): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(trustAckKey) === "true";
}

export function loadPolicyAck(policyAckKey: string): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(policyAckKey) === "true";
}

export function loadIntroAck(introAckKey: string): boolean {
  if (typeof window === "undefined") return false;
  return (
    sessionStorage.getItem(introAckKey) === "true" ||
    localStorage.getItem(introAckKey) === "true"
  );
}

export function loadFormStartTime(formStartKey: string): number | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(formStartKey);
    if (!raw) return null;
    const n = Number(raw);
    return Number.isNaN(n) ? null : n;
  } catch {
    return null;
  }
}

export function saveTrustAck(trustAckKey: string, value: boolean): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(trustAckKey, value ? "true" : "false");
  } catch (e) {
    console.error("Ошибка при сохранении данных:", e);
  }
}

export function savePolicyAck(policyAckKey: string, value: boolean): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(policyAckKey, value ? "true" : "false");
  } catch (e) {
    console.error("Ошибка при сохранении данных:", e);
  }
}

export function saveIntroAck(introAckKey: string): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(introAckKey, "true");
    localStorage.setItem(introAckKey, "true");
  } catch (e) {
    console.error("Ошибка при сохранении данных:", e);
  }
}

export function saveFormStartTime(formStartKey: string, time: number): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(formStartKey, String(time));
  } catch (e) {
    console.error("Ошибка при сохранении данных:", e);
  }
}

export function clearFormStorage(
  saveKey: string,
  trustAckKey: string,
  policyAckKey: string,
  formStartKey: string,
): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(saveKey);
    sessionStorage.removeItem(trustAckKey);
    sessionStorage.removeItem(policyAckKey);
    localStorage.removeItem(formStartKey);
  } catch {
    // ignore
  }
}
