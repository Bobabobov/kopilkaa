"use client";
import { useState, useEffect } from "react";
import { ApplicationItem } from "@/components/applications/ApplicationCard";

export function useApplications() {
  const [items, setItems] = useState<ApplicationItem[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [filter, setFilter] = useState<"ALL" | "PENDING" | "APPROVED" | "REJECTED">("ALL");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");

  const load = async (p = 1) => {
    setLoading(true); 
    setErr(null);
    try {
      const r = await fetch(`/api/applications/mine?page=${p}&limit=10`, { cache: "no-store" });
      const d = await r.json();
      if (!r.ok) throw new Error(d?.error || "Ошибка загрузки");
      
      setItems(d.items);
      setPage(d.page);
      setPages(d.pages);
    } catch (e: any) {
      setErr(e.message || "Ошибка");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    load(1); 
  }, []);

  // Статистика заявок
  const stats = {
    total: items.length,
    pending: items.filter(item => item.status === "PENDING").length,
    approved: items.filter(item => item.status === "APPROVED").length,
    rejected: items.filter(item => item.status === "REJECTED").length,
  };

  // Фильтрация и поиск
  const filteredItems = items.filter(item => {
    const matchesFilter = filter === "ALL" || item.status === filter;
    const matchesSearch = search === "" || 
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.summary.toLowerCase().includes(search.toLowerCase()) ||
      item.story.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const toggleExpanded = (id: string) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return {
    // Data
    items: filteredItems,
    stats,
    page,
    pages,
    loading,
    err,
    expanded,
    
    // Filters
    filter,
    setFilter,
    search,
    setSearch,
    sortBy,
    setSortBy,
    
    // Actions
    load,
    toggleExpanded,
  };
}


















