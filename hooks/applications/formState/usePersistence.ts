"use client";

import { useEffect } from "react";
import {
  loadTrustAck,
  loadPolicyAck,
  loadIntroAck,
  saveTrustAck,
  savePolicyAck,
  saveIntroAck,
} from "./storage";

/** Черновики убраны — сохраняем/восстанавливаем только acknowledgments (trust, policy, intro). */

interface RestoreParams {
  trustAckKey: string;
  policyAckKey: string;
  introAckKey: string;
  loadingAuth: boolean;
  setTrustAcknowledged: (v: boolean) => void;
  setPoliciesAccepted: (v: boolean) => void;
  setIntroOpen: (v: boolean) => void;
  setIntroChecked: (v: boolean) => void;
}

export function useRestoreForm(params: RestoreParams): void {
  const {
    trustAckKey,
    policyAckKey,
    introAckKey,
    loadingAuth,
    setTrustAcknowledged,
    setPoliciesAccepted,
    setIntroOpen,
    setIntroChecked,
  } = params;

  useEffect(() => {
    if (loadingAuth) return;
    try {
      setTrustAcknowledged(loadTrustAck(trustAckKey));
      setPoliciesAccepted(loadPolicyAck(policyAckKey));
      const introAck = loadIntroAck(introAckKey);
      if (introAck) {
        setIntroOpen(false);
        setIntroChecked(true);
      } else {
        setIntroOpen(true);
        setIntroChecked(false);
      }
    } catch (error) {
      console.error("Ошибка при восстановлении данных:", error);
    }
  }, [
    trustAckKey,
    policyAckKey,
    introAckKey,
    loadingAuth,
    setTrustAcknowledged,
    setPoliciesAccepted,
    setIntroOpen,
    setIntroChecked,
  ]);
}

interface PersistParams {
  trustAckKey: string;
  policyAckKey: string;
  introAckKey: string;
  title: string;
  summary: string;
  story: string;
  amount: string;
  payment: string;
  bankName: string;
  trustAcknowledged: boolean;
  policiesAccepted: boolean;
  introChecked: boolean;
  formStartedAtRef: React.MutableRefObject<number | null>;
}

export function usePersistForm(params: PersistParams): void {
  const {
    trustAckKey,
    policyAckKey,
    introAckKey,
    title,
    summary,
    story,
    amount,
    payment,
    bankName,
    trustAcknowledged,
    policiesAccepted,
    introChecked,
    formStartedAtRef,
  } = params;

  useEffect(() => {
    const t = window.setTimeout(() => {
      try {
        const hasInput =
          title ||
          summary ||
          story ||
          amount ||
          payment ||
          bankName;
        if (hasInput && formStartedAtRef.current == null) {
          formStartedAtRef.current = Date.now();
        }
        saveTrustAck(trustAckKey, trustAcknowledged);
        savePolicyAck(policyAckKey, policiesAccepted);
        if (introChecked) {
          saveIntroAck(introAckKey);
        }
      } catch (error) {
        console.error("Ошибка при сохранении данных:", error);
      }
    }, 250);
    return () => window.clearTimeout(t);
  }, [
    trustAckKey,
    policyAckKey,
    introAckKey,
    title,
    summary,
    story,
    amount,
    payment,
    bankName,
    trustAcknowledged,
    policiesAccepted,
    introChecked,
    formStartedAtRef,
  ]);
}
