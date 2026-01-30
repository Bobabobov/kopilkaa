"use client";
import EmptyStateBase from "@/components/ui/EmptyState";

interface EmptyStateProps {
  search: string;
  filter: "ALL" | "PENDING" | "APPROVED" | "REJECTED";
}

export function EmptyState({ search, filter }: EmptyStateProps) {
  return (
    <EmptyStateBase variant="applications" search={search} filter={filter} />
  );
}
