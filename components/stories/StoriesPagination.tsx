"use client";
import PaginationBase from "@/components/ui/Pagination";

interface StoriesPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function StoriesPagination({
  currentPage,
  totalPages,
  onPageChange,
}: StoriesPaginationProps) {
  return (
    <PaginationBase
      variant="stories"
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
    />
  );
}
