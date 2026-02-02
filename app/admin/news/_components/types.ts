export type MediaDraft = {
  file: File;
  previewUrl: string;
  kind: "IMAGE" | "VIDEO";
};

export type AdminNewsItem = {
  id: string;
  title: string | null;
  content: string;
  createdAt: string;
  likesCount: number;
  dislikesCount: number;
  media: { id: string; url: string; type: "IMAGE" | "VIDEO"; sort: number }[];
};
