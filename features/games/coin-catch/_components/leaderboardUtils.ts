"use client";

import type { LeaderboardEntry } from "../_types";

/** Место в рейтинге на клиенте: одинаковый score — одно место */
export function getDisplayPlaces(entries: LeaderboardEntry[]): number[] {
  const places: number[] = [];
  for (let i = 0; i < entries.length; i++) {
    if (i === 0 || entries[i].score < entries[i - 1].score) {
      places.push(i + 1);
    } else {
      places.push(places[i - 1]);
    }
  }
  return places;
}
