"use client";
import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
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

interface FriendsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'friends' | 'sent' | 'received' | 'search';
}

export default function FriendsModal({ isOpen, onClose, initialTab = 'friends' }: FriendsModalProps) {
  const [friends, setFriends] = useState<Friendship[]>([]);
  const [sentRequests, setSentRequests] = useState<Friendship[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<Friendship[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'friends' | 'sent' | 'received' | 'search'>(initialTab || 'friends');
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const { showToast, ToastComponent } = useBeautifulToast();
  
  // Поиск друзей
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [sendingRequests, setSendingRequests] = useState<Set<string>>(new Set());
  
  // Локальное уведомление в модальном окне
  const [localNotification, setLocalNotification] = useState<{
    show: boolean;
    type: 'success' | 'error';
    message: string;
  }>({ show: false, type: 'success', message: '' });

  // Функция для определения статуса пользователя
  const getUserStatus = (lastSeen: string | null) => {
    if (!lastSeen) return { status: "offline", text: "Никогда не был в сети" };
    
    const date = new Date(lastSeen);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    // Если пользователь был активен в последние 5 минут - считаем онлайн
    if (diffInMinutes <= 5) {
      return { status: "online", text: "Онлайн" };
    }
    
    // Иначе показываем время последнего входа
    const diffInHours = Math.floor(diffInMinutes / 60);
    
    if (diffInHours < 1) return { status: "offline", text: `${diffInMinutes}м назад` };
    if (diffInHours < 24) return { status: "offline", text: `${diffInHours}ч назад` };
    if (diffInHours < 48) return { status: "offline", text: "Вчера" };
    return { status: "offline", text: date.toLocaleDateString('ru-RU') };
  };


  // Горячие клавиши и блокировка прокрутки
  useEffect(() => {
    if (!isOpen) return;

    // Блокируем прокрутку фона более надежно
    const originalOverflow = document.body.style.overflow;
    const originalPosition = document.body.style.position;
    const originalTop = document.body.style.top;
    const originalWidth = document.body.style.width;
    
    // Сохраняем текущую позицию прокрутки
    const scrollY = window.scrollY;
    
    // Блокируем прокрутку
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
      // Навигация по вкладкам с помощью стрелок
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        const tabs: Array<'friends' | 'sent' | 'received' | 'search'> = ['friends', 'received', 'sent', 'search'];
        const currentIndex = tabs.indexOf(activeTab);
        let newIndex;
        
        if (event.key === 'ArrowLeft') {
          newIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
        } else {
          newIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
        }
        
        setActiveTab(tabs[newIndex]);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      
      // Восстанавливаем прокрутку
      document.body.style.overflow = originalOverflow;
      document.body.style.position = originalPosition;
      document.body.style.top = originalTop;
      document.body.style.width = originalWidth;
      
      // Плавно восстанавливаем позицию прокрутки
      requestAnimationFrame(() => {
        window.scrollTo({
          top: scrollY,
          behavior: 'instant'
        });
      });
    };
  }, [isOpen, activeTab, onClose]);

  useEffect(() => {
    if (isOpen) {
      const loadFriends = async () => {
        try {
          setLoading(true);
          
          // Загружаем ID текущего пользователя
          const meRes = await fetch("/api/profile/me");
          if (meRes.ok) {
            const meData = await meRes.json();
            setCurrentUserId(meData.user.id);
          }
          
          const [friendsRes, sentRes, receivedRes] = await Promise.all([
            fetch("/api/profile/friends?type=friends"),
            fetch("/api/profile/friends?type=sent"),
            fetch("/api/profile/friends?type=received")
          ]);

          if (friendsRes.ok) {
            const friendsData = await friendsRes.json();
            setFriends(friendsData.friendships || []);
          }

          if (sentRes.ok) {
            const sentData = await sentRes.json();
            setSentRequests(sentData.friendships || []);
          }

          if (receivedRes.ok) {
            const receivedData = await receivedRes.json();
            setReceivedRequests(receivedData.friendships || []);
          }
        } catch (error) {
          console.error("Load friends error:", error);
        } finally {
          setLoading(false);
        }
      };

      loadFriends();
    }
  }, [isOpen]);

  // Функция для показа локального уведомления
  const showLocalNotification = useCallback((type: 'success' | 'error', message: string) => {
    setLocalNotification({ show: true, type, message });
    setTimeout(() => {
      setLocalNotification(prev => ({ ...prev, show: false }));
    }, 3000);
  }, []);

  // Поиск пользователей
  const searchUsers = useCallback(async (query: string) => {
    setSearchLoading(true);
    try {
      const response = await fetch(`/api/users/search?q=${encodeURIComponent(query)}&limit=50`);
      
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.users || []);
      } else {
        const errorData = await response.json();
        showLocalNotification('error', `Ошибка поиска: ${errorData.message || 'Неизвестная ошибка'}`);
      }
    } catch (error) {
      showLocalNotification('error', 'Ошибка подключения к серверу');
    } finally {
      setSearchLoading(false);
    }
  }, [showLocalNotification]);

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

  // Загружаем всех пользователей при открытии вкладки поиска
  useEffect(() => {
    if (isOpen && activeTab === 'search') {
      searchUsers('');
    }
  }, [isOpen, activeTab, searchUsers]);

  // Отправка заявки в друзья
  const sendFriendRequest = async (userId: string) => {
    setSendingRequests(prev => new Set(prev).add(userId));
    
    try {
      const response = await fetch('/api/profile/friends', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiverId: userId })
      });
      
      if (response.ok) {
        const data = await response.json();
        // Обновляем результаты поиска с ID заявки
        setSearchResults(prev => 
          prev.map(user => 
            user.id === userId 
              ? { ...user, friendshipStatus: 'PENDING', friendshipId: data.friendship.id, isRequester: true }
              : user
          )
        );
        console.log('✅ Заявка отправлена, обновляем состояние:', { userId, friendshipId: data.friendship.id, isRequester: true });
        showLocalNotification('success', 'Заявка в друзья отправлена!');
      } else {
        const errorData = await response.json();
        showLocalNotification('error', errorData.message || 'Ошибка отправки заявки');
      }
    } catch (error) {
      console.error('Ошибка отправки заявки:', error);
      showLocalNotification('error', 'Ошибка отправки заявки');
    } finally {
      setSendingRequests(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  // Отмена заявки в друзья
  const cancelFriendRequest = async (friendshipId: string, userId: string) => {
    setSendingRequests(prev => new Set(prev).add(userId));
    
    try {
      const response = await fetch(`/api/profile/friends/${friendshipId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
      
             if (response.ok) {
               // Обновляем результаты поиска
               setSearchResults(prev => 
                 prev.map(user => 
                   user.id === userId 
                     ? { ...user, friendshipStatus: undefined, friendshipId: undefined, isRequester: undefined }
                     : user
                 )
               );
               console.log('✅ Заявка отменена, обновляем состояние:', { userId, friendshipId });
               showLocalNotification('success', 'Заявка отменена');
      } else {
        const errorData = await response.json();
        showLocalNotification('error', errorData.message || 'Ошибка отмены заявки');
      }
    } catch (error) {
      console.error('Ошибка отмены заявки:', error);
      showLocalNotification('error', 'Ошибка отмены заявки');
    } finally {
      setSendingRequests(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  const acceptFriendRequest = async (friendshipId: string) => {
    try {
      const response = await fetch(`/api/profile/friends/${friendshipId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "ACCEPTED" })
      });

      if (response.ok) {
        showToast("success", "Заявка принята!");
        // Обновляем данные
        const receivedRes = await fetch("/api/profile/friends?type=received");
        if (receivedRes.ok) {
          const receivedData = await receivedRes.json();
          setReceivedRequests(receivedData.friendships || []);
        }
        const friendsRes = await fetch("/api/profile/friends?type=friends");
        if (friendsRes.ok) {
          const friendsData = await friendsRes.json();
          setFriends(friendsData.friendships || []);
        }
      } else {
        showToast("error", "Ошибка принятия заявки");
      }
    } catch (error) {
      showToast("error", "Ошибка принятия заявки");
    }
  };

  const declineFriendRequest = async (friendshipId: string) => {
    try {
      const response = await fetch(`/api/profile/friends/${friendshipId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "DECLINED" })
      });

      if (response.ok) {
        showToast("success", "Заявка отклонена");
        // Обновляем данные
        const receivedRes = await fetch("/api/profile/friends?type=received");
        if (receivedRes.ok) {
          const receivedData = await receivedRes.json();
          setReceivedRequests(receivedData.friendships || []);
        }
      } else {
        showToast("error", "Ошибка отклонения заявки");
      }
    } catch (error) {
      showToast("error", "Ошибка отклонения заявки");
    }
  };

  const removeFriend = async (friendshipId: string) => {
    try {
      const response = await fetch(`/api/profile/friends/${friendshipId}`, {
        method: "DELETE"
      });

      if (response.ok) {
        showToast("success", "Дружба удалена");
        // Обновляем данные
        const friendsRes = await fetch("/api/profile/friends?type=friends");
        if (friendsRes.ok) {
          const friendsData = await friendsRes.json();
          setFriends(friendsData.friendships || []);
        }
      } else {
        showToast("error", "Ошибка удаления дружбы");
      }
    } catch (error) {
      showToast("error", "Ошибка удаления дружбы");
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="friends-modal"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          key="friends-modal-content"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="rounded-2xl shadow-xl max-w-2xl w-full max-h-[75vh] overflow-hidden backdrop-blur-xl"
          style={{ 
            backgroundColor: '#004643',
            border: '1px solid #abd1c6'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Заголовок модалки */}
          <div className="p-4" style={{ backgroundColor: '#f9bc60' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(0, 30, 29, 0.2)' }}>
                  <span className="text-xl" style={{ color: '#001e1d' }}>👥</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold" style={{ color: '#001e1d' }}>Мои друзья</h2>
                  <p className="text-sm" style={{ color: '#001e1d', opacity: 0.8 }}>
                    {friends.length} {friends.length === 1 ? 'друг' : friends.length < 5 ? 'друга' : 'друзей'}
                    {receivedRequests.length > 0 && (
                      <span className="ml-2 px-2 py-1 rounded-full text-xs" style={{ backgroundColor: 'rgba(0, 30, 29, 0.2)' }}>
                        {receivedRequests.length} заявок
                      </span>
                    )}
                    <span className="ml-2 text-xs opacity-75">• Esc для закрытия</span>
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:opacity-80"
                style={{ backgroundColor: 'rgba(0, 30, 29, 0.2)' }}
              >
                <span className="text-sm" style={{ color: '#001e1d' }}>✕</span>
              </button>
            </div>
          </div>

          {/* Локальное уведомление */}
          <AnimatePresence>
            {localNotification.show && (
              <motion.div
                key="local-notification"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`mx-4 mt-4 p-3 rounded-lg border text-sm`}
                style={{
                  backgroundColor: localNotification.type === 'success' ? 'rgba(249, 188, 96, 0.2)' : 'rgba(255, 100, 100, 0.2)',
                  borderColor: localNotification.type === 'success' ? '#f9bc60' : '#ff6464',
                  color: '#fffffe'
                }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {localNotification.type === 'success' ? '✅' : '❌'}
                  </span>
                  <span className="text-sm">{localNotification.message}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tabs */}
          <div className="p-3" style={{ borderBottom: '1px solid rgba(171, 209, 198, 0.2)' }}>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setActiveTab('friends')}
                className={`px-3 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                  activeTab === 'friends'
                    ? 'shadow-sm'
                    : 'hover:opacity-80'
                }`}
                style={{
                  backgroundColor: activeTab === 'friends' ? '#f9bc60' : 'rgba(171, 209, 198, 0.1)',
                  color: activeTab === 'friends' ? '#001e1d' : '#abd1c6'
                }}
              >
                <span>👥</span>
                <span>Друзья</span>
                <span className={`px-2 py-1 rounded-full text-xs font-bold`}
                      style={{
                        backgroundColor: activeTab === 'friends' ? 'rgba(0, 30, 29, 0.2)' : 'rgba(249, 188, 96, 0.3)',
                        color: activeTab === 'friends' ? '#001e1d' : '#f9bc60'
                      }}>
                  {friends.length}
                </span>
              </button>
              <button
                onClick={() => setActiveTab('received')}
                className={`px-3 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                  activeTab === 'received'
                    ? 'shadow-sm'
                    : 'hover:opacity-80'
                }`}
                style={{
                  backgroundColor: activeTab === 'received' ? '#f9bc60' : 'rgba(171, 209, 198, 0.1)',
                  color: activeTab === 'received' ? '#001e1d' : '#abd1c6'
                }}
              >
                <span>📨</span>
                <span>Входящие</span>
                <span className={`px-2 py-1 rounded-full text-xs font-bold`}
                      style={{
                        backgroundColor: activeTab === 'received' ? 'rgba(0, 30, 29, 0.2)' : 'rgba(249, 188, 96, 0.3)',
                        color: activeTab === 'received' ? '#001e1d' : '#f9bc60'
                      }}>
                  {receivedRequests.length}
                </span>
              </button>
              <button
                onClick={() => setActiveTab('sent')}
                className={`px-3 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                  activeTab === 'sent'
                    ? 'shadow-sm'
                    : 'hover:opacity-80'
                }`}
                style={{
                  backgroundColor: activeTab === 'sent' ? '#f9bc60' : 'rgba(171, 209, 198, 0.1)',
                  color: activeTab === 'sent' ? '#001e1d' : '#abd1c6'
                }}
              >
                <span>📤</span>
                <span>Исходящие</span>
                <span className={`px-2 py-1 rounded-full text-xs font-bold`}
                      style={{
                        backgroundColor: activeTab === 'sent' ? 'rgba(0, 30, 29, 0.2)' : 'rgba(249, 188, 96, 0.3)',
                        color: activeTab === 'sent' ? '#001e1d' : '#f9bc60'
                      }}>
                  {sentRequests.length}
                </span>
              </button>
              <button
                onClick={() => setActiveTab('search')}
                className={`px-3 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                  activeTab === 'search'
                    ? 'shadow-sm'
                    : 'hover:opacity-80'
                }`}
                style={{
                  backgroundColor: activeTab === 'search' ? '#f9bc60' : 'rgba(171, 209, 198, 0.1)',
                  color: activeTab === 'search' ? '#001e1d' : '#abd1c6'
                }}
              >
                <span>🔍</span>
                <span>Поиск</span>
              </button>
            </div>
          </div>

          {/* Контент */}
          <div className="p-4 max-h-[50vh] overflow-y-auto">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto mb-4" style={{ borderColor: '#f9bc60' }}></div>
                <p style={{ color: '#abd1c6' }}>Загрузка...</p>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab || 'default'}
                  initial={{ opacity: 0, x: 20, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -20, scale: 0.95 }}
                  transition={{ 
                    duration: 0.3, 
                    ease: "easeInOut",
                    type: "spring",
                    stiffness: 300,
                    damping: 30
                  }}
                  className="space-y-4"
                >
                {activeTab === 'friends' && (
                  <>
                    {friends.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="text-4xl mb-4" style={{ color: '#abd1c6' }}>👥</div>
                        <h3 className="text-xl font-bold mb-2" style={{ color: '#fffffe' }}>Пока нет друзей</h3>
                        <p style={{ color: '#abd1c6' }}>Найдите друзей и начните общение!</p>
                      </div>
                    ) : (
                      friends.map((friendship, index) => {
                        const friend = friendship.requesterId === currentUserId ? friendship.receiver : friendship.requester;
                        if (!friend || !friendship.id || !friendship.id.trim()) {
                          return null;
                        }
                        const key = friendship.id && friendship.id.trim() ? friendship.id : `friend-${index}`;
                        return (
                          <motion.div
                            key={key}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * index }}
                            whileHover={{ scale: 1.02, y: -2 }}
                            className="rounded-2xl p-4 hover:shadow-lg transition-all duration-300 cursor-pointer"
                            style={{
                              backgroundColor: 'rgba(171, 209, 198, 0.1)',
                              border: '1px solid rgba(171, 209, 198, 0.2)'
                            }}
                          >
                            <div className="flex items-center gap-4">
                              <div className="relative">
                                <div className="w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center text-white font-bold text-lg shadow-lg"
                                     style={{ backgroundColor: '#f9bc60' }}>
                                  {friend.avatar ? (
                                    <img
                                      src={friend.avatar}
                                      alt="Аватар"
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <span>
                                      {(friend.name || friend.email.split('@')[0])[0].toUpperCase()}
                                    </span>
                                  )}
                                </div>
                                {(() => {
                                  const status = getUserStatus(friend.lastSeen || null);
                                  return (
                                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-gray-800 ${
                                      status.status === "online" 
                                        ? "bg-green-400 animate-pulse" 
                                        : "bg-gray-400"
                                    }`} title={status.status === "online" ? "Онлайн" : `Последний вход: ${status.text}`}></div>
                                  );
                                })()}
                              </div>
                              <div className="flex-1">
                                <Link 
                                  href={`/profile/${friend.id}`}
                                  className="text-lg font-bold hover:opacity-80 transition-colors"
                                  style={{ color: '#fffffe' }}
                                >
                                  {friend.name || friend.email.split('@')[0]}
                                </Link>
                                <p className="text-sm" style={{ color: '#abd1c6' }}>
                                  Друг с {new Date(friendship.createdAt).toLocaleDateString('ru-RU')}
                                </p>
                              </div>
                              <button
                                onClick={() => removeFriend(friendship.id)}
                                className="px-4 py-2 rounded-lg transition-colors text-sm"
                                style={{ 
                                  backgroundColor: 'rgba(255, 100, 100, 0.2)',
                                  color: '#ff6464',
                                  border: '1px solid #ff6464'
                                }}
                              >
                                Удалить
                              </button>
                            </div>
                          </motion.div>
                        );
                      })
                    )}
                  </>
                )}

                {activeTab === 'received' && (
                  <>
                    {receivedRequests.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="text-gray-400 text-4xl mb-4">📨</div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Нет входящих заявок</h3>
                        <p className="text-gray-600 dark:text-gray-400">Когда кто-то отправит заявку, она появится здесь</p>
                      </div>
                    ) : (
                      receivedRequests.map((friendship, index) => {
                        if (!friendship.id || !friendship.id.trim()) {
                          return null;
                        }
                        const key = friendship.id && friendship.id.trim() ? friendship.id : `received-${index}`;
                        return (
                        <motion.div
                          key={key}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 * index }}
                          whileHover={{ scale: 1.02, y: -2 }}
                          className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 rounded-2xl p-4 border border-green-200 dark:border-green-700/30 hover:shadow-lg transition-all duration-300 cursor-pointer"
                        >
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              <div className="w-12 h-12 rounded-xl overflow-hidden bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                {friendship.requester.avatar ? (
                                  <img
                                    src={friendship.requester.avatar}
                                    alt="Аватар"
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <span>
                                    {(friendship.requester.name || friendship.requester.email.split('@')[0])[0].toUpperCase()}
                                  </span>
                                )}
                              </div>
                              {(() => {
                                const status = getUserStatus(friendship.requester.lastSeen || null);
                                return (
                                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-gray-800 ${
                                    status.status === "online" 
                                      ? "bg-green-400 animate-pulse" 
                                      : "bg-gray-400"
                                  }`} title={status.status === "online" ? "Онлайн" : `Последний вход: ${status.text}`}></div>
                                );
                              })()}
                            </div>
                            <div className="flex-1">
                              <Link 
                                href={`/profile/${friendship.requester.id}`}
                                className="text-lg font-bold text-gray-900 dark:text-white hover:text-green-600 dark:hover:text-green-400 transition-colors"
                              >
                                {friendship.requester.name || friendship.requester.email.split('@')[0]}
                              </Link>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Хочет стать вашим другом
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => acceptFriendRequest(friendship.id)}
                                className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-lg transition-all duration-200 text-sm font-medium border border-emerald-200 dark:border-emerald-700/30 hover:border-emerald-300 dark:hover:border-emerald-600/50"
                              >
                                <span className="flex items-center justify-center gap-1.5">
                                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                  Принять
                                </span>
                              </button>
                              <button
                                onClick={() => declineFriendRequest(friendship.id)}
                                className="px-3 py-2 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800/50 dark:hover:bg-gray-700/50 text-gray-600 dark:text-gray-400 rounded-lg transition-all duration-200 text-sm font-medium border border-gray-200 dark:border-gray-600/30 hover:border-gray-300 dark:hover:border-gray-500/50"
                              >
                                <span className="flex items-center justify-center gap-1.5">
                                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                  Отклонить
                                </span>
                              </button>
                            </div>
                          </div>
                        </motion.div>
                        );
                      })
                    )}
                  </>
                )}

                {activeTab === 'sent' && (
                  <>
                    {sentRequests.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="text-gray-400 text-4xl mb-4">📤</div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Нет исходящих заявок</h3>
                        <p className="text-gray-600 dark:text-gray-400">Отправленные заявки в друзья появятся здесь</p>
                      </div>
                    ) : (
                      sentRequests.map((friendship, index) => {
                        if (!friendship.id || !friendship.id.trim()) {
                          return null;
                        }
                        const key = friendship.id && friendship.id.trim() ? friendship.id : `sent-${index}`;
                        return (
                        <motion.div
                          key={key}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 * index }}
                          className="bg-gradient-to-r from-lime-50 to-green-50 dark:from-lime-900/10 dark:to-green-900/10 rounded-2xl p-4 border border-lime-200 dark:border-lime-700/30 hover:shadow-lg transition-shadow"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl overflow-hidden bg-gradient-to-br from-lime-500 to-green-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                              {friendship.receiver.avatar ? (
                                <img
                                  src={friendship.receiver.avatar}
                                  alt="Аватар"
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span>
                                  {(friendship.receiver.name || friendship.receiver.email.split('@')[0])[0].toUpperCase()}
                                </span>
                              )}
                            </div>
                            <div className="flex-1">
                              <Link 
                                href={`/profile/${friendship.receiver.id}`}
                                className="text-lg font-bold text-gray-900 dark:text-white hover:text-lime-600 dark:hover:text-lime-400 transition-colors"
                              >
                                {friendship.receiver.name || friendship.receiver.email.split('@')[0]}
                              </Link>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Ожидает подтверждения
                              </p>
                            </div>
                            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 rounded-lg text-sm font-medium">
                              Ожидает
                            </span>
                          </div>
                        </motion.div>
                        );
                      })
                    )}
                  </>
                )}

                {activeTab === 'search' && (
                  <>
                    {/* Поисковая строка */}
                    <div className="mb-4">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Поиск среди всех пользователей..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full px-4 py-3 pl-10 rounded-lg focus:outline-none transition-all"
                          style={{ 
                            backgroundColor: 'rgba(171, 209, 198, 0.1)',
                            border: '1px solid rgba(171, 209, 198, 0.3)',
                            color: '#fffffe'
                          }}
                        />
                        <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: '#abd1c6' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                    </div>

                    {/* Результаты поиска */}
                    {searchLoading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                        <p className="text-gray-600 dark:text-gray-400">Поиск...</p>
                      </div>
                    ) : searchResults.length > 0 ? (
                      <div className="space-y-3">
                        {searchResults.map((user, index) => {
                          if (!user.id || !user.id.trim()) {
                            return null;
                          }
                          const key = user.id && user.id.trim() ? user.id : `search-${index}`;
                          return (
                          <motion.div
                            key={key}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * index }}
                            whileHover={{ scale: 1.01, y: -1 }}
                            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-sm transition-all duration-300 cursor-pointer"
                          >
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                {user.avatar ? (
                                  <img 
                                    src={user.avatar} 
                                    alt={user.name || "Пользователь"} 
                                    className="w-10 h-10 rounded-lg object-cover"
                                  />
                                ) : (
                                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                                    {user.name ? user.name[0].toUpperCase() : (!user.hideEmail ? user.email[0].toUpperCase() : 'П')}
                                  </div>
                                )}
                                {(() => {
                                  const status = getUserStatus(user.lastSeen || null);
                                  return (
                                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white dark:border-gray-700 ${
                                      status.status === "online" 
                                        ? "bg-green-400 animate-pulse" 
                                        : "bg-gray-400"
                                    }`} title={status.status === "online" ? "Онлайн" : `Последний вход: ${status.text}`}></div>
                                  );
                                })()}
                              </div>
                              <div>
                                <Link 
                                  href={`/profile/${user.id}`}
                                  className="font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                >
                                  {user.name || (!user.hideEmail ? user.email.split('@')[0] : 'Пользователь')}
                                </Link>
                                {!user.hideEmail ? (
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {user.email}
                                  </p>
                                ) : (
                                  <p className="text-sm text-gray-400 dark:text-gray-500 italic">
                                    Email скрыт
                                  </p>
                                )}
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                console.log('🔘 Клик по кнопке:', { 
                                  userId: user.id, 
                                  userName: user.name || user.email,
                                  friendshipStatus: user.friendshipStatus, 
                                  friendshipId: user.friendshipId, 
                                  isRequester: user.isRequester 
                                });
                                
                                if (user.friendshipStatus === 'PENDING' && user.friendshipId) {
                                  // Проверяем, можем ли мы отменить заявку
                                  if (user.isRequester) {
                                    console.log('📤 Отменяем заявку (отправитель)');
                                    cancelFriendRequest(user.friendshipId, user.id);
                                  } else {
                                    // Если мы получатель, то можем отклонить заявку
                                    console.log('📥 Отклоняем заявку (получатель)');
                                    declineFriendRequest(user.friendshipId);
                                  }
                                } else if (user.friendshipStatus !== 'ACCEPTED') {
                                  console.log('📤 Отправляем заявку');
                                  sendFriendRequest(user.id);
                                }
                              }}
                              disabled={sendingRequests.has(user.id) || user.friendshipStatus === 'ACCEPTED'}
                              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                                sendingRequests.has(user.id)
                                  ? 'bg-gray-500/20 text-gray-600 dark:text-gray-400 cursor-not-allowed'
                                  : user.friendshipStatus === 'ACCEPTED'
                                  ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 cursor-not-allowed'
                                  : user.friendshipStatus === 'PENDING' && user.isRequester
                                  ? 'bg-red-500/20 hover:bg-red-500/30 text-red-600 dark:text-red-400'
                                  : user.friendshipStatus === 'PENDING'
                                  ? 'bg-lime-500/20 text-lime-600 dark:text-lime-400 cursor-not-allowed'
                                  : 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-600 dark:text-blue-400'
                              }`}
                            >
                              {sendingRequests.has(user.id) 
                                ? 'Отправка...' 
                                : user.friendshipStatus === 'ACCEPTED'
                                ? 'Уже в друзьях'
                                : user.friendshipStatus === 'PENDING' && user.isRequester
                                ? 'Отменить'
                                : user.friendshipStatus === 'PENDING'
                                ? 'Заявка отправлена'
                                : 'Добавить'
                              }
                            </button>
                          </motion.div>
                          );
                        })}
                      </div>
                    ) : searchQuery ? (
                      <div className="text-center py-8">
                        <div className="text-gray-400 text-4xl mb-4">🔍</div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Пользователи не найдены</h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          Попробуйте изменить поисковый запрос
                        </p>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="text-gray-400 text-3xl mb-3">👥</div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Все пользователи</h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          {searchResults.length} пользователей на сайте
                        </p>
                      </div>
                    )}
                  </>
                )}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </motion.div>
      </motion.div>
      
      {/* Toast уведомления */}
      <ToastComponent key="toast-component" />
    </AnimatePresence>
  );
}
