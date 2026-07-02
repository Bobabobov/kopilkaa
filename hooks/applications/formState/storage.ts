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

/** Возвращает [чекбокс1, чекбокс2, чекбокс3]. Старый формат "true"/"false" → все три одинаковы. */
export function loadRulesAck(rulesAckKey: string): [boolean, boolean, boolean] {
  if (typeof window === "undefined") return [false, false, false];
  try {
    const raw =
      sessionStorage.getItem(rulesAckKey) ??
      sessionStorage.getItem("application_trust_ack");
    if (!raw) return [false, false, false];
    if (raw === "true") return [true, true, true];
    if (raw === "false") return [false, false, false];
    const arr = JSON.parse(raw) as unknown;
    if (Array.isArray(arr) && arr.length >= 3) {
      return [
        Boolean(arr[0]),
        Boolean(arr[1]),
        Boolean(arr[2]),
      ];
    }
    return [false, false, false];
  } catch {
    return [false, false, false];
  }
}

export function loadPolicyAck(policyAckKey: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem(policyAckKey) === "true";
  } catch {
    return false;
  }
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

export function saveRulesAck(
  rulesAckKey: string,
  value: [boolean, boolean, boolean],
): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(rulesAckKey, JSON.stringify(value));
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
  rulesAckKey: string,
  policyAckKey: string,
  formStartKey: string,
): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(saveKey);
    sessionStorage.removeItem(rulesAckKey);
    sessionStorage.removeItem("application_trust_ack");
    sessionStorage.removeItem(policyAckKey);
    localStorage.removeItem(formStartKey);
  } catch {
    // ignore
  }
}
