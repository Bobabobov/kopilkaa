"use client";

import { useState, useEffect } from "react";
import {
  StoriesHeader,
  StoryCard,
  StoriesLoading,
  StoriesEmptyState,
  StoriesPagination,
} from "@/components/stories";
import PixelBackground from "@/components/ui/PixelBackground";

interface Story {
  id: string;
  title: string;
  summary: string;
  createdAt: string;
  images: Array<{ url: string; sort: number }>;
  user: {
    id: string;
    name: string | null;
    email: string;
    avatar: string | null;
  };
  _count: {
    likes: number;
  };
}

export default function StoriesPage() {
  const [query, setQuery] = useState("");
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadStories();
  }, [currentPage, query]);

  const loadStories = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "12",
        ...(query && { q: query }),
      });

      const response = await fetch(`/api/stories?${params}`);
      if (response.ok) {
        const data = await response.json();
        setStories(data.items || []);
        setTotalPages(data.pages || 1);
      } else {
        console.error("Failed to load stories");
        setStories([]);
      }
    } catch (error) {
      console.error("Error loading stories:", error);
      setStories([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const hasQuery = query.trim().length > 0;

  return (
    <div className="min-h-screen">
      {/* Пиксельный фон */}
      <PixelBackground />

      {/* Header */}
      <StoriesHeader query={query} onQueryChange={setQuery} />

      {/* Content */}
      <div className="relative z-10">
        {loading ? (
          <StoriesLoading />
        ) : stories.length === 0 ? (
          <StoriesEmptyState hasQuery={hasQuery} />
        ) : (
          <>
            {/* Stories Grid */}
            <div className="container mx-auto px-4 py-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {stories.map((story, index) => (
                  <StoryCard key={story.id} story={story} index={index} />
                ))}
              </div>
            </div>

            {/* Pagination */}
            <div className="container mx-auto px-4 pb-8">
              <StoriesPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
