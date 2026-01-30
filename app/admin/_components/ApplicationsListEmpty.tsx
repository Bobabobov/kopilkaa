// app/admin/components/ApplicationsListEmpty.tsx
"use client";
import EmptyStateBase from "@/components/ui/EmptyState";

interface ApplicationsListEmptyProps {
  hasFilters: boolean;
}

export default function ApplicationsListEmpty({
  hasFilters,
}: ApplicationsListEmptyProps) {
  return (
    <EmptyStateBase variant="admin-applications" hasFilters={hasFilters} />
  );
}
