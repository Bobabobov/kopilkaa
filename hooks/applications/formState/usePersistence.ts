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
  setTrustAck1: (v: boolean) => void;
  setTrustAck2: (v: boolean) => void;
  setTrustAck3: (v: boolean) => void;
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
    setTrustAck1,
    setTrustAck2,
    setTrustAck3,
    setPoliciesAccepted,
    setIntroOpen,
    setIntroChecked,
  } = params;

  useEffect(() => {
    if (loadingAuth) return;
    try {
      const [t1, t2, t3] = loadTrustAck(trustAckKey);
      setTrustAck1(t1);
      setTrustAck2(t2);
      setTrustAck3(t3);
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
    setTrustAck1,
    setTrustAck2,
    setTrustAck3,
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
  trustAck1: boolean;
  trustAck2: boolean;
  trustAck3: boolean;
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
    trustAck1,
    trustAck2,
    trustAck3,
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
        saveTrustAck(trustAckKey, [trustAck1, trustAck2, trustAck3]);
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
    trustAck1,
    trustAck2,
    trustAck3,
    policiesAccepted,
    introChecked,
    formStartedAtRef,
  ]);
}
