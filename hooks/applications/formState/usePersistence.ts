"use client";

import { useEffect, useRef } from "react";
import {
  loadFormFromStorage,
  loadTrustAck,
  loadPolicyAck,
  loadIntroAck,
  loadFormStartTime,
  saveFormToStorage,
  saveTrustAck,
  savePolicyAck,
  saveIntroAck,
  saveFormStartTime,
} from "./storage";
import type { StoredFormData } from "./types";

interface RestoreParams {
  saveKey: string;
  trustAckKey: string;
  policyAckKey: string;
  introAckKey: string;
  formStartKey: string;
  loadingAuth: boolean;
  setTitle: (v: string) => void;
  setSummary: (v: string) => void;
  setStory: (v: string) => void;
  setAmount: (v: string) => void;
  setPayment: (v: string) => void;
  setBankName: (v: string) => void;
  setTrustAcknowledged: (v: boolean) => void;
  setPoliciesAccepted: (v: boolean) => void;
  setIntroOpen: (v: boolean) => void;
  setIntroChecked: (v: boolean) => void;
  formStartedAtRef: React.MutableRefObject<number | null>;
}

export function useRestoreForm(params: RestoreParams): void {
  const {
    saveKey,
    trustAckKey,
    policyAckKey,
    introAckKey,
    formStartKey,
    loadingAuth,
    setTitle,
    setSummary,
    setStory,
    setAmount,
    setPayment,
    setBankName,
    setTrustAcknowledged,
    setPoliciesAccepted,
    setIntroOpen,
    setIntroChecked,
    formStartedAtRef,
  } = params;

  useEffect(() => {
    if (loadingAuth) return;
    try {
      const saved = loadFormFromStorage(saveKey);
      if (saved) {
        setTitle(saved.title);
        setSummary(saved.summary);
        setStory(saved.story);
        setAmount(saved.amount);
        setPayment(saved.payment);
        setBankName(saved.bankName);
      } else {
        setTitle("");
        setSummary("");
        setStory("");
        setAmount("");
        setPayment("");
        setBankName("");
      }

      const savedStart = loadFormStartTime(formStartKey);
      if (savedStart != null) {
        formStartedAtRef.current = savedStart;
      } else {
        formStartedAtRef.current = Date.now();
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem(
              formStartKey,
              String(formStartedAtRef.current),
            );
          } catch {
            // ignore
          }
        }
      }

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
    saveKey,
    trustAckKey,
    policyAckKey,
    introAckKey,
    formStartKey,
    loadingAuth,
    setTitle,
    setSummary,
    setStory,
    setAmount,
    setPayment,
    setBankName,
    setTrustAcknowledged,
    setPoliciesAccepted,
    setIntroOpen,
    setIntroChecked,
    formStartedAtRef,
  ]);
}

interface PersistParams {
  saveKey: string;
  trustAckKey: string;
  policyAckKey: string;
  introAckKey: string;
  formStartKey: string;
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
    saveKey,
    trustAckKey,
    policyAckKey,
    introAckKey,
    formStartKey,
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
        saveFormToStorage(saveKey, {
          title,
          summary,
          story,
          amount,
          payment,
          bankName,
        });
        saveTrustAck(trustAckKey, trustAcknowledged);
        savePolicyAck(policyAckKey, policiesAccepted);
        if (introChecked) {
          saveIntroAck(introAckKey);
        }
        if (formStartedAtRef.current != null) {
          saveFormStartTime(formStartKey, formStartedAtRef.current);
        }
      } catch (error) {
        console.error("Ошибка при сохранении данных:", error);
      }
    }, 250);
    return () => window.clearTimeout(t);
  }, [
    saveKey,
    trustAckKey,
    policyAckKey,
    introAckKey,
    formStartKey,
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
