export interface Story {
  id: string;
  title: string;
  summary: string;
  amount?: number | null;
  createdAt?: string;
  isContestWinner?: boolean;
  images?: Array<{ url: string; sort: number }>;
  user?: {
    id: string;
    name: string | null;
    email: string | null;
    avatar: string | null;
    hideEmail?: boolean;
  };
  _count?: {
    likes: number;
  };
  userLiked?: boolean;
}
