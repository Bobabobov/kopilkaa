"use client";
import { motion } from "framer-motion";
import LikeCard from "./LikeCard";
import LikesEmptyState from "./LikesEmptyState";

interface LikeData {
  id: string;
  user: {
    id: string;
    name: string | null;
    email: string;
    avatar: string | null;
    avatarFrame: string | null;
  };
  application: {
    id: string;
    title: string;
    summary: string;
    createdAt: string;
  };
  createdAt: string;
}

interface LikesListProps {
  likes: LikeData[];
}

export default function LikesList({ likes }: LikesListProps) {
  if (likes.length === 0) {
    return <LikesEmptyState />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="space-y-6"
    >
      <div className="grid gap-6">
        {likes.map((like, index) => (
          <LikeCard
            key={like.id || `like-${index}`}
            like={like}
            index={index}
          />
        ))}
      </div>
    </motion.div>
  );
}
