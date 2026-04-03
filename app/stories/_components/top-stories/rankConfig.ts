export const RANK_TOP3 = [
  {
    label: "#1",
    bg: "bg-[#f9bc60]",
    shadow: "shadow-[0_2px_14px_rgba(249,188,96,0.35)]",
    ring: "ring-[#f9bc60]/50",
    text: "text-[#001e1d]",
    accentBar: "bg-[#f9bc60] shadow-[0_0_14px_rgba(249,188,96,0.55)]",
  },
  {
    label: "#2",
    bg: "bg-[#abd1c6]",
    shadow: "shadow-[0_2px_12px_rgba(171,209,198,0.3)]",
    ring: "ring-[#abd1c6]/50",
    text: "text-[#001e1d]",
    accentBar: "bg-[#abd1c6] shadow-[0_0_12px_rgba(171,209,198,0.45)]",
  },
  {
    label: "#3",
    bg: "bg-[#e8a545]",
    shadow: "shadow-[0_2px_12px_rgba(232,165,69,0.3)]",
    ring: "ring-[#e8a545]/50",
    text: "text-[#001e1d]",
    accentBar: "bg-[#e8a545] shadow-[0_0_12px_rgba(232,165,69,0.45)]",
  },
] as const;

export type RankConfig =
  | (typeof RANK_TOP3)[number]
  | {
      label: string;
      bg: string;
      shadow: string;
      ring: string;
      text: string;
      accentBar: string;
    };

export function getRankConfig(index: number): RankConfig {
  if (index < 3) return RANK_TOP3[index];
  return {
    label: `#${index + 1}`,
    bg: "bg-[#004643]",
    shadow: "shadow-[0_2px_10px_rgba(0,70,67,0.35)]",
    ring: "ring-[#abd1c6]/35",
    text: "text-[#abd1c6]",
    accentBar: "bg-[#abd1c6]/45 shadow-[0_0_8px_rgba(171,209,198,0.25)]",
  };
}
