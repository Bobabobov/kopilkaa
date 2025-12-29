export type NewsMedia = {
  id: string;
  url: string;
  type: "IMAGE" | "VIDEO";
  sort: number;
};

export type NewsAuthor = {
  id: string;
  name: string | null;
  avatar: string | null;
  role?: string | null;
};

export type NewsBadge = "UPDATE" | "PLANS" | "THOUGHTS" | "IMPORTANT";

export type NewsItem = {
  id: string;
  title: string | null;
  badge: NewsBadge | null;
  content: string;
  createdAt: string;
  updatedAt: string;
  likesCount: number;
  dislikesCount: number;
  author: NewsAuthor;
  media: NewsMedia[];
  myReaction: "LIKE" | "DISLIKE" | null;
};



