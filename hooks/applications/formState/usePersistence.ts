"use client";

import { useEffect, useRef } from "react";
import {
  loadRulesAck,
  loadPolicyAck,
  saveRulesAck,
  savePolicyAck,
} from "./storage";

/** Черновики убраны — сохраняем/восстанавливаем только acknowledgments (правила, policy). */

interface RestoreParams {
  rulesAckKey: string;
  policyAckKey: string;
  loadingAuth: boolean;
  setRulesAck1: (v: boolean) => void;
  setRulesAck2: (v: boolean) => void;
  setRulesAck3: (v: boolean) => void;
  setPoliciesAccepted: (v: boolean) => void;
}

export function useRestoreForm(params: RestoreParams): void {
  const {
    rulesAckKey,
    policyAckKey,
    loadingAuth,
    setRulesAck1,
    setRulesAck2,
    setRulesAck3,
    setPoliciesAccepted,
  } = params;

  useEffect(() => {
    if (loadingAuth) return;
    try {
      const [t1, t2, t3] = loadRulesAck(rulesAckKey);
      setRulesAck1(t1);
      setRulesAck2(t2);
      setRulesAck3(t3);
      setPoliciesAccepted(loadPolicyAck(policyAckKey));
    } catch (error) {
      console.error("Ошибка при восстановлении данных:", error);
    }
  }, [
    rulesAckKey,
    policyAckKey,
    loadingAuth,
    setRulesAck1,
    setRulesAck2,
    setRulesAck3,
    setPoliciesAccepted,
  ]);
}

interface PersistParams {
  rulesAckKey: string;
  policyAckKey: string;
  title: string;
  summary: string;
  story: string;
  amount: string;
  payment: string;
  bankName: string;
  rulesAck1: boolean;
  rulesAck2: boolean;
  rulesAck3: boolean;
  policiesAccepted: boolean;
  formStartedAtRef: React.MutableRefObject<number | null>;
  /** Вызывается после debounce, если в форме есть введённые данные (как сигнал «черновик на месте»). */
  onDebouncedPersist?: () => void;
}

export function usePersistForm(params: PersistParams): void {
  const {
    rulesAckKey,
    policyAckKey,
    title,
    summary,
    story,
    amount,
    payment,
    bankName,
    rulesAck1,
    rulesAck2,
    rulesAck3,
    policiesAccepted,
    formStartedAtRef,
    onDebouncedPersist,
  } = params;

  const onDebouncedPersistRef = useRef(onDebouncedPersist);
  onDebouncedPersistRef.current = onDebouncedPersist;

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
        saveRulesAck(rulesAckKey, [rulesAck1, rulesAck2, rulesAck3]);
        savePolicyAck(policyAckKey, policiesAccepted);
        if (hasInput) {
          onDebouncedPersistRef.current?.();
        }
      } catch (error) {
        console.error("Ошибка при сохранении данных:", error);
      }
    }, 250);
    return () => window.clearTimeout(t);
  }, [
    rulesAckKey,
    policyAckKey,
    title,
    summary,
    story,
    amount,
    payment,
    bankName,
    rulesAck1,
    rulesAck2,
    rulesAck3,
    policiesAccepted,
    formStartedAtRef,
  ]);
}
