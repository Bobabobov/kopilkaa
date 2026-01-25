"use client";

import { useState } from "react";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { useBeautifulToast } from "@/components/ui/BeautifulToast";
import { buildAuthModalUrl } from "@/lib/authModalUrl";

type Reaction = "LIKE" | "DISLIKE" | null;

export function NewsReactions({
  postId,
  initialLikes,
  initialDislikes,
  initialMyReaction,
  onChange,
}: {
  postId: string;
  initialLikes: number;
  initialDislikes: number;
  initialMyReaction: Reaction;
  onChange?: (v: {
    likesCount: number;
    dislikesCount: number;
    myReaction: Reaction;
  }) => void;
}) {
  const [likes, setLikes] = useState(initialLikes);
  const [dislikes, setDislikes] = useState(initialDislikes);
  const [myReaction, setMyReaction] = useState<Reaction>(initialMyReaction);
  const [busy, setBusy] = useState(false);
  const { showToast, ToastComponent } = useBeautifulToast();

  const send = async (next: "like" | "dislike" | "none") => {
    if (busy) return;
    setBusy(true);
    try {
      const r = await fetch(`/api/news/${postId}/reaction`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reaction: next }),
      });
      const d = await r.json().catch(() => null);
      if (r.status === 401) {
        window.location.href = buildAuthModalUrl({
          pathname: window.location.pathname,
          search: window.location.search,
          modal: "auth",
        });
        return;
      }
      if (!r.ok) {
        showToast(
          "error",
          "Ошибка",
          d?.error || "Не удалось поставить реакцию",
        );
        return;
      }
      setLikes(d.likesCount);
      setDislikes(d.dislikesCount);
      setMyReaction(d.myReaction ?? null);
      onChange?.({
        likesCount: d.likesCount,
        dislikesCount: d.dislikesCount,
        myReaction: d.myReaction ?? null,
      });
    } finally {
      setBusy(false);
    }
  };

  const btnBase =
    "inline-flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-semibold transition-all";

  const likeActive = myReaction === "LIKE";
  const dislikeActive = myReaction === "DISLIKE";

  return (
    <div className="mt-4 flex items-center gap-2">
      <ToastComponent />
      <button
        type="button"
        disabled={busy}
        onClick={() => send(likeActive ? "none" : "like")}
        className={`${btnBase} ${
          likeActive
            ? "bg-[#10B981]/20 text-[#10B981] border-[#10B981]/40"
            : "bg-white/5 text-white/85 border-white/10 hover:bg-white/10"
        } ${busy ? "opacity-70 cursor-wait" : ""}`}
        aria-label="Лайк"
        title="Лайк"
      >
        <LucideIcons.ThumbsUp size="sm" />
        <span>{likes}</span>
      </button>

      <button
        type="button"
        disabled={busy}
        onClick={() => send(dislikeActive ? "none" : "dislike")}
        className={`${btnBase} ${
          dislikeActive
            ? "bg-red-500/15 text-red-300 border-red-400/30"
            : "bg-white/5 text-white/85 border-white/10 hover:bg-white/10"
        } ${busy ? "opacity-70 cursor-wait" : ""}`}
        aria-label="Дизлайк"
        title="Дизлайк"
      >
        <LucideIcons.ThumbsDown size="sm" />
        <span>{dislikes}</span>
      </button>
    </div>
  );
}
