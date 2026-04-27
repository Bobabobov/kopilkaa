export type ModerationItem = {
  id: string;
  taskTitle: string;
  taskDescription: string;
  storyText: string;
  reward: number;
  weekKey: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  adminComment?: string | null;
  reviewedAt?: string | null;
  createdAt: string;
  media: { url: string; type: "IMAGE" | "VIDEO" }[];
  user: {
    id: string;
    name: string;
    username?: string | null;
    avatar?: string | null;
    email?: string | null;
    vkLink?: string | null;
    telegramLink?: string | null;
    youtubeLink?: string | null;
  };
};

export type Notice = {
  type: "success" | "error";
  text: string;
};

export type StatusFilter = "ALL" | "PENDING" | "APPROVED" | "REJECTED";
export type SortBy = "created_desc" | "created_asc" | "reward_desc" | "story_desc";
