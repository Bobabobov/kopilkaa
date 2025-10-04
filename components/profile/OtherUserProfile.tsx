// components/profile/OtherUserProfile.tsx
"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import OtherUserHeader from "@/components/profile/OtherUserHeader";
import OtherUserCard from "@/components/profile/OtherUserCard";
import OtherUserLoadingStates from "@/components/profile/OtherUserLoadingStates";
import OtherUserStats from "@/components/profile/OtherUserStats";
import OtherUserActivity from "@/components/profile/OtherUserActivity";
import { useBeautifulToast } from "@/components/ui/BeautifulToast";
import UniversalBackground from "@/components/ui/UniversalBackground";

// Lazy load heavy modal
const FriendsModal = dynamic(() => import("@/components/profile/FriendsModal"), {
  ssr: false,
  loading: () => <div className="hidden" />
});

type User = { 
  id: string; 
  email: string; 
  role: "USER" | "ADMIN"; 
  name?: string | null; 
  createdAt: string;
  avatar?: string | null;
  headerTheme?: string | null;
  avatarFrame?: string | null;
  hideEmail?: boolean;
  lastSeen?: string | null;
};

type Friendship = {
  id: string;
  status: "PENDING" | "ACCEPTED" | "DECLINED" | "BLOCKED";
  requesterId: string;
  receiverId: string;
};

interface OtherUserProfileProps {
  userId: string;
}

export default function OtherUserProfile({ userId }: OtherUserProfileProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [friendship, setFriendship] = useState<Friendship | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isFriendsModalOpen, setIsFriendsModalOpen] = useState(false);
  const [friendsModalTab, setFriendsModalTab] = useState<'friends' | 'sent' | 'received' | 'search'>('friends');
  const { showToast, ToastComponent } = useBeautifulToast();

  // Проверка авторизации
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/profile/me", { cache: "no-store" });
        if (response.ok) {
          const data = await response.json();
          setIsAuthenticated(true);
          setCurrentUserId(data.user.id);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  // Обработчик события для открытия модального окна друзей
  useEffect(() => {
    const handleOpenFriendsModal = (event: CustomEvent) => {
      setIsFriendsModalOpen(true);
      if (event.detail?.tab) {
        setFriendsModalTab(event.detail.tab);
      }
    };

    window.addEventListener('open-friends-modal', handleOpenFriendsModal as EventListener);
    return () => window.removeEventListener('open-friends-modal', handleOpenFriendsModal as EventListener);
  }, []);

  // Загрузка данных пользователя
  useEffect(() => {
    if (!isAuthenticated) return;

    const loadUserData = async () => {
      try {
        setLoading(true);
        
        // Загружаем данные пользователя
        const userResponse = await fetch(`/api/users/${userId}`);
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUser(userData.user);
        } else {
          console.error("User not found");
          return;
        }


        // Загружаем статус дружбы
        const friendshipResponse = await fetch(`/api/profile/friends?type=all`);
        if (friendshipResponse.ok) {
          const friendshipData = await friendshipResponse.json();
          const userFriendship = friendshipData.friendships.find((f: Friendship) => 
            f.requesterId === userId || f.receiverId === userId
          );
          setFriendship(userFriendship || null);
        }
      } catch (error) {
        console.error("Load user data error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [isAuthenticated, userId]);

  // Проверка, является ли пользователь владельцем профиля
  useEffect(() => {
    if (currentUserId && userId && currentUserId === userId) {
      // Перенаправляем на собственный профиль
      router.push('/profile');
    }
  }, [currentUserId, userId, router]);

  const sendFriendRequest = async () => {
    if (!user) return;
    
    if (!isAuthenticated) {
      showToast("warning", "Требуется авторизация", "Необходимо войти в аккаунт для добавления в друзья");
      return;
    }
    
    try {
      console.log("Sending friend request to:", user.id);
      const response = await fetch("/api/profile/friends", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiverId: user.id })
      });

      console.log("Friend request response:", response.status);
      const data = await response.json();
      console.log("Friend request data:", data);
      
      if (response.ok) {
        setFriendship(data.friendship);
        showToast("success", "Заявка отправлена!", "Заявка в друзья успешно отправлена");
      } else {
        showToast("error", "Ошибка отправки", data.message || "Не удалось отправить заявку в друзья");
      }
    } catch (error) {
      console.error("Friend request error:", error);
      showToast("error", "Ошибка отправки", "Не удалось отправить заявку в друзья");
    }
  };

  const acceptFriendRequest = async () => {
    if (!friendship) return;
    
    try {
      const response = await fetch(`/api/profile/friends/${friendship.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "ACCEPTED" })
      });

      if (response.ok) {
        setFriendship({ ...friendship, status: "ACCEPTED" });
        showToast("success", "Заявка принята!", "Пользователь добавлен в друзья");
      } else {
        showToast("error", "Ошибка принятия", "Не удалось принять заявку в друзья");
      }
    } catch (error) {
      showToast("error", "Ошибка принятия", "Не удалось принять заявку в друзья");
    }
  };

  const declineFriendRequest = async () => {
    if (!friendship) return;
    
    try {
      const response = await fetch(`/api/profile/friends/${friendship.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "DECLINED" })
      });

      if (response.ok) {
        setFriendship({ ...friendship, status: "DECLINED" });
        showToast("info", "Заявка отклонена", "Заявка в друзья отклонена");
      } else {
        showToast("error", "Ошибка отклонения", "Не удалось отклонить заявку в друзья");
      }
    } catch (error) {
      showToast("error", "Ошибка отклонения", "Не удалось отклонить заявку в друзья");
    }
  };

  // Загрузка проверки авторизации
  if (isAuthenticated === null) {
    return <OtherUserLoadingStates state="checking" />;
  }

  // Если не авторизован
  if (isAuthenticated === false) {
    return <OtherUserLoadingStates state="unauthorized" />;
  }

  if (loading) {
    return <OtherUserLoadingStates state="loading" />;
  }

  if (!user) {
    return <OtherUserLoadingStates state="not-found" />;
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Универсальный фон */}
      <UniversalBackground />

      {/* Header */}
      <div className="mt-20">
        <OtherUserHeader user={user} />
      </div>

      {/* Main Content */}
      <div className="w-full px-6 pt-32 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* User Info Card - 3 колонки */}
            <OtherUserCard 
              user={user}
              friendship={friendship}
              currentUserId={currentUserId}
              onSendFriendRequest={sendFriendRequest}
              onAcceptFriendRequest={acceptFriendRequest}
              onDeclineFriendRequest={declineFriendRequest}
            />

            {/* Right Sidebar - 9 колонок */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-9 space-y-6"
            >
              <OtherUserStats userId={userId} />
              <OtherUserActivity userId={userId} />
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Красивые уведомления */}
      <ToastComponent />

      {/* Модальное окно друзей */}
      <FriendsModal
        isOpen={isFriendsModalOpen}
        onClose={() => setIsFriendsModalOpen(false)}
        initialTab={friendsModalTab}
      />
    </div>
  );
}
