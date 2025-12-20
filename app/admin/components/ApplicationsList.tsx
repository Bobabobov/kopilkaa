// app/admin/components/ApplicationsList.tsx
"use client";
import { useState } from "react";
import type { ApplicationItem } from "../types";
import ApplicationsListLoading from "./ApplicationsListLoading";
import ApplicationsListError from "./ApplicationsListError";
import ApplicationsListEmpty from "./ApplicationsListEmpty";
import ApplicationsListItem from "./ApplicationsListItem";

interface ApplicationsListProps {
  items: ApplicationItem[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  status: "ALL" | "PENDING" | "APPROVED" | "REJECTED";
  onStatusChange: (
    id: string,
    status: ApplicationItem["status"],
    comment?: string,
  ) => void;
  onQuickUpdate: (
    id: string,
    status: ApplicationItem["status"],
    comment?: string,
  ) => void;
  onImageClick: (images: string[], index: number) => void;
  onDelete: (id: string) => void;
}

export default function ApplicationsList({
  items,
  loading,
  error,
  searchQuery,
  status,
  onStatusChange,
  onQuickUpdate,
  onImageClick,
  onDelete,
}: ApplicationsListProps) {
  // показанные email'ы
  const [shownEmails, setShownEmails] = useState<Set<string>>(new Set());

  // переключение показа email'а
  const toggleEmail = (id: string) => {
    setShownEmails((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  if (loading) {
    return <ApplicationsListLoading />;
  }

  if (error) {
    return <ApplicationsListError error={error} />;
  }

  if (items.length === 0) {
    return (
      <ApplicationsListEmpty
        hasFilters={!!searchQuery || status !== "ALL"}
      />
    );
  }

  return (
    <div className="grid gap-6">
      {items.map((item, index) => (
        <ApplicationsListItem
          key={item.id}
          item={item}
          index={index}
          isEmailVisible={shownEmails.has(item.id)}
          onToggleEmail={() => toggleEmail(item.id)}
          onStatusChange={onStatusChange}
          onQuickUpdate={onQuickUpdate}
          onImageClick={onImageClick}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
