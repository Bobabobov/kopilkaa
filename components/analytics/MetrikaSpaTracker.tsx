"use client";

import { useMetrika } from "@/hooks/analytics/useMetrika";

export default function MetrikaSpaTracker() {
  useMetrika();
  return null;
}
