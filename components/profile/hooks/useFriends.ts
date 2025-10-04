// components/profile/hooks/useFriends.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import { useBeautifulToast } from "@/components/ui/BeautifulToast";

interface User {
  id: string;
  name?: string | null;
  email: string;
  avatar?: string | null;
  createdAt: string;
  lastSeen?: string | null;
  hideEmail?: boolean;
  friendshipStatus?: 'PENDING' | 'ACCEPTED' | 'DECLINED';
  friendshipId?: string;
  isRequester?: boolean;
}

interface Friendship {
  id: string;
  status: "PENDING" | "ACCEPTED" | "DECLINED" | "BLOCKED";
  requesterId: string;
  receiverId: string;
  requester: User;
  receiver: User;
  createdAt: string;
}

interface UseFriendsReturn {
  // Состояние
  friends: Friendship[];
  sentRequests: Friendship[];
  receivedRequests: Friendship[];
  loading: boolean;
  currentUserId: string | null;
  
  // Поиск
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: User[];
  searchLoading: boolean;
  debouncedQuery: string;
  
  // Действия
  sendFriendRequest: (userId: string) => Promise<void>;
  cancelFriendRequest: (friendshipId: string, userId: string) => Promise<void>;
  acceptFriendRequest: (friendshipId: string) => Promise<void>;
  declineFriendRequest: (friendshipId: string) => Promise<void>;
  removeFriend: (friendshipId: string) => Promise<void>;
  loadFriends: () => Promise<void>;
  
  // Утилиты
  getUserStatus: (lastSeen: string | null) => { status: "online" | "offline"; text: string };
  sendingRequests: Set<string>;
}

export function useFriends(): UseFriendsReturn {
  const [friends, setFriends] = useState<Friendship[]>([]);
  const [sentRequests, setSentRequests] = useState<Friendship[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<Friendship[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  
  // Поиск
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [sendingRequests, setSendingRequests] = useState<Set<string>>(new Set());
  
  const { showToast } = useBeautifulToast();

  // Утилита для определения статуса пользователя
  const getUserStatus = useCallback((lastSeen: string | null) => {
    if (!lastSeen) {
      return { status: "offline" as const, text: "Никогда не был онлайн" };
    }
    
    const date = new Date(lastSeen);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 5) {
      return { status: "online" as const, text: "Онлайн" };
    } else if (diffInMinutes < 60) {
      return { status: "offline" as const, text: `${diffInMinutes} мин назад` };
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return { status: "offline" as const, text: `${diffInHours} ч назад` };
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return { status: "offline" as const, text: `${diffInDays} дн назад` };
    }
    
    return { status: "offline" as const, text: date.toLocaleDateString() };
  }, []);

  // Загрузка данных
  const loadFriends = useCallback(async () => {
    try {
      setLoading(true);
      
      // Получаем ID текущего пользователя
      const meRes = await fetch("/api/profile/me");
      if (meRes.ok) {
        const meData = await meRes.json();
        setCurrentUserId(meData.id);
      }
      
      // Загружаем данные параллельно
      const [friendsRes, sentRes, receivedRes] = await Promise.all([
        fetch("/api/profile/friends?type=friends"),
        fetch("/api/profile/friends?type=sent"),
        fetch("/api/profile/friends?type=received")
      ]);
      
      if (friendsRes.ok) {
        const friendsData = await friendsRes.json();
        setFriends(friendsData || []);
      }
      
      if (sentRes.ok) {
        const sentData = await sentRes.json();
        setSentRequests(sentData || []);
      }
      
      if (receivedRes.ok) {
        const receivedData = await receivedRes.json();
        setReceivedRequests(receivedData || []);
      }
    } catch (error) {
      console.error("Error loading friends:", error);
      showToast("error", "Ошибка загрузки друзей");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  // Поиск пользователей
  const searchUsers = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    
    try {
      setSearchLoading(true);
      const response = await fetch(`/api/users/search?q=${encodeURIComponent(query)}&limit=50`);
      
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.users || []);
      } else {
        const errorData = await response.json();
        console.error("Search error:", errorData);
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Error searching users:", error);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  }, []);

  // Debounce для поиска
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Поиск при изменении debouncedQuery
  useEffect(() => {
    searchUsers(debouncedQuery);
  }, [debouncedQuery, searchUsers]);

  // Отправка заявки в друзья
  const sendFriendRequest = async (userId: string) => {
    try {
      setSendingRequests(prev => new Set(prev).add(userId));
      
      const response = await fetch('/api/profile/friends', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ receiverId: userId }),
      });

      if (response.ok) {
        const data = await response.json();
        showToast("success", "Заявка отправлена");
        await loadFriends(); // Перезагружаем данные
      } else {
        const errorData = await response.json();
        showToast("error", errorData.message || "Ошибка отправки заявки");
      }
    } catch (error) {
      console.error("Error sending friend request:", error);
      showToast("error", "Ошибка отправки заявки");
    } finally {
      setSendingRequests(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  // Отмена заявки
  const cancelFriendRequest = async (friendshipId: string, userId: string) => {
    try {
      setSendingRequests(prev => new Set(prev).add(userId));
      
      const response = await fetch(`/api/profile/friends/${friendshipId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        showToast("success", "Заявка отменена");
        await loadFriends();
      } else {
        const errorData = await response.json();
        showToast("error", errorData.message || "Ошибка отмены заявки");
      }
    } catch (error) {
      console.error("Error canceling friend request:", error);
      showToast("error", "Ошибка отмены заявки");
    } finally {
      setSendingRequests(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  // Принятие заявки
  const acceptFriendRequest = async (friendshipId: string) => {
    try {
      const response = await fetch(`/api/profile/friends/${friendshipId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'ACCEPTED' }),
      });

      if (response.ok) {
        showToast("success", "Заявка принята");
        
        // Обновляем данные
        const receivedRes = await fetch("/api/profile/friends?type=received");
        if (receivedRes.ok) {
          const receivedData = await receivedRes.json();
          setReceivedRequests(receivedData || []);
        }
        
        const friendsRes = await fetch("/api/profile/friends?type=friends");
        if (friendsRes.ok) {
          const friendsData = await friendsRes.json();
          setFriends(friendsData || []);
        }
      } else {
        const errorData = await response.json();
        showToast("error", errorData.message || "Ошибка принятия заявки");
      }
    } catch (error) {
      console.error("Error accepting friend request:", error);
      showToast("error", "Ошибка принятия заявки");
    }
  };

  // Отклонение заявки
  const declineFriendRequest = async (friendshipId: string) => {
    try {
      const response = await fetch(`/api/profile/friends/${friendshipId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'DECLINED' }),
      });

      if (response.ok) {
        showToast("success", "Заявка отклонена");
        
        const receivedRes = await fetch("/api/profile/friends?type=received");
        if (receivedRes.ok) {
          const receivedData = await receivedRes.json();
          setReceivedRequests(receivedData || []);
        }
      } else {
        const errorData = await response.json();
        showToast("error", errorData.message || "Ошибка отклонения заявки");
      }
    } catch (error) {
      console.error("Error declining friend request:", error);
      showToast("error", "Ошибка отклонения заявки");
    }
  };

  // Удаление друга
  const removeFriend = async (friendshipId: string) => {
    try {
      const response = await fetch(`/api/profile/friends/${friendshipId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        showToast("success", "Друг удален");
        
        const friendsRes = await fetch("/api/profile/friends?type=friends");
        if (friendsRes.ok) {
          const friendsData = await friendsRes.json();
          setFriends(friendsData || []);
        }
      } else {
        const errorData = await response.json();
        showToast("error", errorData.message || "Ошибка удаления друга");
      }
    } catch (error) {
      console.error("Error removing friend:", error);
      showToast("error", "Ошибка удаления друга");
    }
  };

  // Загружаем данные при монтировании
  useEffect(() => {
    loadFriends();
  }, [loadFriends]);

  return {
    // Состояние
    friends,
    sentRequests,
    receivedRequests,
    loading,
    currentUserId,
    
    // Поиск
    searchQuery,
    setSearchQuery,
    searchResults,
    searchLoading,
    debouncedQuery,
    
    // Действия
    sendFriendRequest,
    cancelFriendRequest,
    acceptFriendRequest,
    declineFriendRequest,
    removeFriend,
    loadFriends,
    
    // Утилиты
    getUserStatus,
    sendingRequests,
  };
}
