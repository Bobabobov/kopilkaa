"use client";

export type HeroStats = {
  collected: number;
  requests: number;
  approved: number;
  people: number;
};

export interface HeroSectionProps {
  stats: HeroStats;
  loading: boolean;
}
