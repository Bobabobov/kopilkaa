// lib/achievements/service.ts
import { prisma } from '@/lib/db';
import {
  Achievement,
  UserAchievement,
  AchievementProgress,
  AchievementStats,
  AchievementRarity,
  AchievementType,
  AchievementKind,
} from './types';

export class AchievementService {
  // Получить все активные достижения
  static async getAllAchievements() {
    return await prisma.achievement.findMany({
      where: {
        isActive: true,
      },
      orderBy: [
        { rarity: 'desc' },
        { createdAt: 'desc' },
      ],
    });
  }

  // Получить достижения пользователя
  static async getUserAchievements(userId: string) {
    return await prisma.userAchievement.findMany({
      where: { userId },
      include: {
        achievement: true,
      },
      orderBy: {
        unlockedAt: 'desc',
      },
    });
  }

  // Собрать агрегированные userStats для движка прогресса
  static async getUserStats(userId: string) {
    // Безопасно собираем метрики, оборачивая отдельные запросы
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        createdAt: true,
      },
    });
    if (!user) return null;

    // applications
    const [applicationsCreated, applicationsApproved] = await Promise.all([
      prisma.application.count({ where: { userId } }).catch(() => 0),
      prisma.application
        .count({
          where: { userId, status: 'APPROVED' as any },
        })
        .catch(() => 0),
    ]);

    // friends accepted (bidirectional)
    const friendsCount = await prisma.friendship.count({
      where: {
        status: 'ACCEPTED',
        OR: [{ requesterId: userId }, { receiverId: userId }],
      },
    }).catch(() => 0);

    // likes given
    const likesGiven = await prisma.storyLike.count({ where: { userId } }).catch(() => 0);

    // likes received max on one story (если лайки привязаны к application)
    let likesReceivedMaxOnOneStory = 0;
    try {
      const grouped = await prisma.storyLike.groupBy({
        by: ['applicationId'],
        where: { application: { userId } },
        _count: { _all: true },
      });
      likesReceivedMaxOnOneStory = grouped.reduce((max, g) => Math.max(max, g._count._all), 0);
    } catch {
      likesReceivedMaxOnOneStory = 0;
    }

    // games
    const gamesPlayed = await prisma.gameRecord.count({ where: { userId } }).catch(() => 0);
    let bestScoreLeafFlight = 0;
    try {
      const best = await prisma.gameRecord.findFirst({
        where: { userId, gameType: 'leaf-flight' },
        orderBy: { bestScore: 'desc' },
        select: { bestScore: true },
      });
      bestScoreLeafFlight = best?.bestScore ?? 0;
    } catch {
      bestScoreLeafFlight = 0;
    }
    const hasAnyGameRecord = gamesPlayed > 0;

    // creativity: максимальная длина текста истории/заявки (если поля есть)
    let maxStoryWords = 0;
    try {
      const stories = await prisma.application.findMany({
        where: { userId },
        select: { story: true, summary: true },
      });
      maxStoryWords = stories.reduce((max, s) => {
        const text = `${s.summary ?? ''} ${s.story ?? ''}`.trim();
        const words = text ? text.split(/\s+/).filter(Boolean).length : 0;
        return Math.max(max, words);
      }, 0);
    } catch {
      maxStoryWords = 0;
    }

    // streak / first100
    // Считаем стрик по посещениям: берем визиты за последние 60 дней, считаем подряд идущие дни, включая сегодня
    let loginStreakDays = 0;
    try {
      const since = new Date();
      since.setDate(since.getDate() - 60);
      const visits = await prisma.pageVisit.findMany({
        where: { userId, visitDate: { gte: since } },
        select: { visitDate: true },
        orderBy: { visitDate: 'desc' },
      });
      const days = Array.from(
        new Set(
          visits.map((v) =>
            new Date(v.visitDate).toISOString().slice(0, 10) // YYYY-MM-DD
          )
        )
      ).sort().reverse(); // от новых к старым
      const today = new Date().toISOString().slice(0, 10);
      let streak = 0;
      let cursor = today;
      for (const d of days) {
        if (d === cursor) {
          streak += 1;
          const prev = new Date(cursor);
          prev.setDate(prev.getDate() - 1);
          cursor = prev.toISOString().slice(0, 10);
        } else if (d > cursor) {
          continue; // пропускаем будущие/дубли (не должно быть)
        } else {
          break; // разрыв
        }
      }
      loginStreakDays = streak;
    } catch {
      loginStreakDays = 0;
    }
    let isFirst100 = false;
    try {
      const position = await prisma.user.count({
        where: { createdAt: { lte: user.createdAt } },
      });
      isFirst100 = position <= 100;
    } catch {
      isFirst100 = false;
    }

    return {
      loginStreakDays,
      applicationsCreated,
      applicationsApproved,
      friendsCount,
      likesGiven,
      likesReceivedMaxOnOneStory,
      gamesPlayed,
      bestScoreLeafFlight,
      hasAnyGameRecord,
      maxStoryWords,
      isFirst100,
      _unlockedEligibleCount: 0, // заполнится позже
    };
  }

  // Движок подсчёта прогресса для одной ачивки
  static computeAchievementProgress(
    achievement: Achievement,
    userStats: any,
    isUnlocked: boolean,
    eligibleNormals: Achievement[],
    userAchievement?: UserAchievement
  ): AchievementProgress {
    const slug = (achievement as any).slug?.toLowerCase() || "";
    // META: от количества полученных eligible NORMAL
    if ((achievement.kind ?? 'NORMAL') === 'META') {
      const unlockedEligible = userStats._unlockedEligibleCount || 0;
      const target = Math.max(eligibleNormals.length, 1);
      const progress = isUnlocked ? target : unlockedEligible;
      return {
        achievement,
        progress,
        maxProgress: target,
        isUnlocked: progress >= target,
        unlockedAt: userAchievement?.unlockedAt,
        progressPercentage: target > 0 ? (progress / target) * 100 : 0,
        current: progress,
        target,
      };
    }

    // NORMAL
    const maxProgress = Math.max(achievement.maxCount || 1, 1);
    let metric = 0;

    // slug-специфичные правила
    if (slug === "inspiration_10_likes_on_one_story") {
      metric = userStats.likesReceivedMaxOnOneStory ?? 0;
    } else if (slug === "leaf_flight_100_score" || slug === "leaf_flight_master") {
      metric = userStats.bestScoreLeafFlight ?? 0;
    } else if (slug === "storyteller_100_words" || slug === "word_master_500_words") {
      metric = userStats.maxStoryWords ?? 0;
    } else if (slug === "gratitude" || slug === "approved_application") {
      // помощь/одобрение: считаем только APPROVED
      metric = userStats.applicationsApproved ?? 0;
    } else {
      switch (achievement.type) {
        case 'STREAK':
          metric = userStats.loginStreakDays ?? 0;
          break;
        case 'APPLICATIONS':
          metric = userStats.applicationsCreated ?? 0;
          break;
        case 'SOCIAL':
          metric = userStats.friendsCount ?? 0;
          break;
        case 'COMMUNITY':
          metric = userStats.likesGiven ?? 0;
          break;
        case 'CREATIVITY':
          metric = userStats.maxStoryWords ?? 0;
          break;
        case 'GAMES': {
          const score = userStats.bestScoreLeafFlight ?? 0;
          const plays = userStats.gamesPlayed ?? 0;
          metric = Math.max(score, plays);
          break;
        }
        case 'SPECIAL': {
          if (userStats.isFirst100) {
            metric = 1;
          } else if (userStats.hasAnyGameRecord) {
            metric = 1;
          } else if ((userStats.applicationsApproved ?? 0) > 0) {
            metric = 1;
          } else {
            metric = 0;
          }
          break;
        }
        default:
          metric = 0;
      }
    }

    const progress = Math.min(metric, maxProgress);
    return {
      achievement,
      progress,
      maxProgress,
      isUnlocked: progress >= maxProgress,
      unlockedAt: userAchievement?.unlockedAt,
      progressPercentage: maxProgress > 0 ? (progress / maxProgress) * 100 : 0,
      current: progress,
      target: maxProgress,
    };
  }

  // Получить прогресс достижений пользователя
  static async getUserAchievementProgress(userId: string): Promise<AchievementProgress[]> {
    const achievements = await this.getAllAchievements();
    const userAchievements = await this.getUserAchievements(userId);
    const userAchievementMap = new Map(userAchievements.map((ua) => [ua.achievementId, ua]));

    const eligibleNormals = achievements.filter((a) => {
      const ach: any = a as any;
      return (
        (ach.kind ?? 'NORMAL') === 'NORMAL' &&
        !ach.isExclusive &&
        !ach.isHidden &&
        !ach.isSeasonal
      );
    });

    const userStats = await this.getUserStats(userId);
    if (!userStats) return [];

    // Добавляем вспомогательный счётчик полученных eligible NORMAL для META
    userStats._unlockedEligibleCount = eligibleNormals.filter((a) => userAchievementMap.has(a.id)).length;

    const progressList: AchievementProgress[] = [];

    for (const achievement of achievements) {
      const userAchievement = userAchievementMap.get(achievement.id) as any;
      const isUnlocked = !!userAchievement;

      const p = this.computeAchievementProgress(
        achievement,
        userStats,
        isUnlocked,
        eligibleNormals,
        userAchievement
      );

      progressList.push(p);
    }

    return progressList;
  }

  // Выдать достижение пользователю
  static async grantAchievement(
    userId: string,
    achievementId: string,
    grantedBy?: string,
    grantedByName?: string
  ): Promise<UserAchievement> {
    // Проверяем, не получено ли уже это достижение
    const existing = await prisma.userAchievement.findUnique({
      where: {
        userId_achievementId: {
          userId,
          achievementId,
        },
      },
    });

    if (existing) {
      throw new Error('Достижение уже получено');
    }

    // Проверяем лимит достижения
    const achievement = await prisma.achievement.findUnique({
      where: { id: achievementId },
    });

    if (!achievement) {
      throw new Error('Достижение не найдено');
    }

    if (!achievement.isActive) {
      throw new Error('Достижение неактивно');
    }

    // Проверяем период действия
    const now = new Date();
    if (achievement.validFrom && now < achievement.validFrom) {
      throw new Error('Достижение ещё не активно');
    }
    if (achievement.validTo && now > achievement.validTo) {
      throw new Error('Достижение уже неактивно');
    }

    // Проверяем лимит количества
    const userAchievementCount = await prisma.userAchievement.count({
      where: {
        userId,
        achievementId,
      },
    });

    if (userAchievementCount >= achievement.maxCount) {
      throw new Error('Лимит достижения исчерпан');
    }

    // Выдаём достижение
    return await prisma.userAchievement.create({
      data: {
        userId,
        achievementId,
        grantedBy,
        grantedByName,
      },
      include: {
        achievement: true,
      },
    });
  }

  // Получить статистику достижений пользователя
  static async getUserAchievementStats(userId: string): Promise<AchievementStats> {
    const allAchievements = await this.getAllAchievements();
    const userAchievements = await this.getUserAchievements(userId);

    const achievementsByRarity: Record<AchievementRarity, number> = {
      COMMON: 0,
      RARE: 0,
      EPIC: 0,
      LEGENDARY: 0,
      EXCLUSIVE: 0,
    };

    const achievementsByType: Record<AchievementType, number> = {
      STREAK: 0,
      APPLICATIONS: 0,
      GAMES: 0,
      SOCIAL: 0,
      SPECIAL: 0,
      COMMUNITY: 0,
      CREATIVITY: 0,
    };

    // Подсчитываем полученные достижения
    userAchievements.forEach(ua => {
      if (ua.achievement) {
        achievementsByRarity[ua.achievement.rarity]++;
        achievementsByType[ua.achievement.type]++;
      }
    });

    const totalAchievements = allAchievements.length;
    const unlockedAchievements = userAchievements.length;
    const completionPercentage = totalAchievements > 0 ? (unlockedAchievements / totalAchievements) * 100 : 0;

    return {
      totalAchievements,
      unlockedAchievements,
      completionPercentage,
      achievementsByRarity,
      achievementsByType,
      recentAchievements: userAchievements.slice(0, 5), // Последние 5
    };
  }

  // Проверить и выдать автоматические достижения
  static async checkAndGrantAutomaticAchievements(userId: string): Promise<UserAchievement[]> {
    const grantedAchievements: UserAchievement[] = [];

    const achievements = await this.getAllAchievements();
    const userAchievements = await this.getUserAchievements(userId);
    const userAchievementMap = new Map(userAchievements.map((ua) => [ua.achievementId, ua]));

    const eligibleNormals = achievements.filter((a) => {
      const ach: any = a as any;
      return (
        (ach.kind ?? 'NORMAL') === 'NORMAL' &&
        !ach.isExclusive &&
        !ach.isHidden &&
        !ach.isSeasonal
      );
    });

    const userStats = await this.getUserStats(userId);
    if (!userStats) return grantedAchievements;
    userStats._unlockedEligibleCount = eligibleNormals.filter((a) => userAchievementMap.has(a.id)).length;

    for (const achievement of achievements) {
      const userAchievement = userAchievementMap.get(achievement.id) as any;
      if (userAchievement) continue; // уже есть

      const progress = this.computeAchievementProgress(
        achievement,
        userStats,
        false,
        eligibleNormals,
        undefined
      );

      if (progress.progress >= progress.maxProgress && progress.maxProgress > 0) {
        try {
          const granted = await this.grantAchievement(userId, achievement.id);
          grantedAchievements.push(granted);
          userAchievementMap.set(achievement.id, granted as any);
          const achMeta: any = achievement as any;
          if ((achMeta.kind ?? 'NORMAL') === 'NORMAL') {
            userStats._unlockedEligibleCount += 1;
          }
        } catch (error) {
          console.log(`Не удалось выдать достижение ${achievement.name}:`, error);
        }
      }
    }

    return grantedAchievements;
  }

  // Вспомогательные методы для проверки условий
  private static async checkApplicationAchievements(achievement: Achievement, applications: any[]): Promise<boolean> {
    switch (achievement.name) {
      case 'Первые шаги':
        return applications.length >= 1;
      
      case 'Помощник':
        return applications.length >= 5;
      
      case 'Активный участник':
        return applications.length >= 10;
      
      case 'Одобренная заявка':
        return applications.some(app => app.status === 'APPROVED');
      
      default:
        return false;
    }
  }

  private static async checkGameAchievements(achievement: Achievement, gameRecords: any[]): Promise<boolean> {
    // Логика проверки игровых достижений
    // Например: "Первый рекорд", "100 очков", "10 игр"
    return false; // Заглушка
  }

  private static async checkSocialAchievements(achievement: Achievement, user: any): Promise<boolean> {
    // Логика проверки социальных достижений
    // Например: "Первый друг", "10 друзей", "Активный комментатор"
    return false; // Заглушка
  }

  private static async checkStreakAchievements(achievement: Achievement, user: any): Promise<boolean> {
    // Логика проверки достижений за серии
    // Например: "7 дней подряд", "30 дней активности"
    return false; // Заглушка
  }

  private static async checkCommunityAchievements(achievement: Achievement, user: any): Promise<boolean> {
    // Логика проверки достижений сообщества
    // Например: "Помощь другим", "Лайки историй"
    return false; // Заглушка
  }

  private static async checkCreativityAchievements(achievement: Achievement, user: any): Promise<boolean> {
    // Логика проверки творческих достижений
    // Например: "Красивые истории", "Креативные заявки"
    return false; // Заглушка
  }
}
