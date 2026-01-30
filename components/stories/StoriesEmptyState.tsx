"use client";
import EmptyStateBase from "@/components/ui/EmptyState";

interface StoriesEmptyStateProps {
  hasQuery: boolean;
}

export function StoriesEmptyState({ hasQuery }: StoriesEmptyStateProps) {
  return <EmptyStateBase variant="stories" hasQuery={hasQuery} />;
}
