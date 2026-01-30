"use client";
import PaginationBase from "@/components/ui/Pagination";

interface PaginationProps {
  page: number;
  pages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, pages, onPageChange }: PaginationProps) {
  return (
    <PaginationBase
      variant="applications"
      currentPage={page}
      totalPages={pages}
      onPageChange={onPageChange}
    />
  );
}
