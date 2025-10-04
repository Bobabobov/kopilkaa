// lib/useStories.ts
import { useState, useEffect } from "react";

export interface Story {
  id: string;
  title: string;
  summary: string;
  createdAt: string;
  images: { url: string; sort: number }[];
  user: { 
    id: string; 
    name: string | null; 
    email: string; 
    avatar: string | null; 
    avatarFrame: string | null; 
    headerTheme: string | null 
  };
  _count: {
    likes: number;
  };
}

export interface StoriesData {
  items: Story[];
  page: number;
  pages: number;
  total: number;
}

export function useStories() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [stories, setStories] = useState<Story[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Дебаунс для поиска
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Загрузка историй
  const loadStories = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ 
        page: String(page), 
        limit: "12" 
      });
      
      if (debouncedQuery.trim()) {
        params.set("q", debouncedQuery.trim());
      }
      
      const response = await fetch(`/api/stories?${params}`, { 
        cache: "no-store" 
      });
      
      if (!response.ok) {
        console.error("API error:", response.status, response.statusText);
        setStories([]);
        setLoading(false);
        return;
      }
      
      const data: StoriesData = await response.json();
      
      if (data && Array.isArray(data.items)) {
        setStories(data.items); 
        setCurrentPage(data.page || 1); 
        setTotalPages(data.pages || 1);
      } else {
        setStories([]);
      }
    } catch (error) {
      console.error("Load error:", error);
      setStories([]);
    }
    setLoading(false);
  };

  // Загрузка при изменении поискового запроса
  useEffect(() => { 
    setCurrentPage(1); // Сбрасываем на первую страницу при новом поиске
    loadStories(1); 
  }, [debouncedQuery]);

  // Обработчик смены страницы
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    loadStories(page);
  };

  return {
    query,
    setQuery,
    stories,
    currentPage,
    totalPages,
    loading,
    loadStories,
    handlePageChange,
    hasQuery: !!query
  };
}
