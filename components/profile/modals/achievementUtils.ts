import { LucideIcons } from "@/components/ui/LucideIcons";

export const getAchievementIcon = (type: string, name: string) => {
  const nameLower = name.toLowerCase();

  if (nameLower.includes("первые шаги") || nameLower.includes("первая")) return LucideIcons.Star;
  if (nameLower.includes("помощник") || nameLower.includes("помощь")) return LucideIcons.Users;
  if (nameLower.includes("одобрен") || nameLower.includes("одобрение")) return LucideIcons.CheckCircle;
  if (nameLower.includes("активный") || nameLower.includes("активность")) return LucideIcons.Zap;
  if (nameLower.includes("эксперт") || nameLower.includes("мастер")) return LucideIcons.Star;
  if (nameLower.includes("друг") || nameLower.includes("дружба")) return LucideIcons.Users;
  if (nameLower.includes("игра") || nameLower.includes("игр")) return LucideIcons.Star;
  if (nameLower.includes("серия") || nameLower.includes("серий")) return LucideIcons.Zap;
  if (nameLower.includes("творч") || nameLower.includes("креатив")) return LucideIcons.Palette;
  if (nameLower.includes("сообществ") || nameLower.includes("коммун")) return LucideIcons.Heart;

  switch (type) {
    case "APPLICATIONS":
      return LucideIcons.FileText;
    case "GAMES":
      return LucideIcons.Star;
    case "SOCIAL":
      return LucideIcons.Users;
    case "STREAK":
      return LucideIcons.Zap;
    case "SPECIAL":
      return LucideIcons.Star;
    case "COMMUNITY":
      return LucideIcons.Heart;
    case "CREATIVITY":
      return LucideIcons.Palette;
    default:
      return LucideIcons.Trophy;
  }
};

export const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case "COMMON":
      return "#94a1b2";
    case "RARE":
      return "#abd1c6";
    case "EPIC":
      return "#e16162";
    case "LEGENDARY":
      return "#f9bc60";
    case "EXCLUSIVE":
      return "#ff6b6b";
    default:
      return "#abd1c6";
  }
};

export const getRarityName = (rarity: string) => {
  switch (rarity) {
    case "COMMON":
      return "Обычное";
    case "RARE":
      return "Редкое";
    case "EPIC":
      return "Эпическое";
    case "LEGENDARY":
      return "Легендарное";
    case "EXCLUSIVE":
      return "Эксклюзивное";
    default:
      return "Неизвестное";
  }
};
