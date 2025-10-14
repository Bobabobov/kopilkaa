// lib/achievements/service.ts
import { PrismaClient } from '@prisma/client';
import { Achievement, UserAchievement, AchievementProgress, AchievementStats, AchievementRarity, AchievementType } from './types';

const prisma = new PrismaClient();

export class AchievementService {
  // Получить все активные достижения
  static async getAllAchievements(): Promise<Achievement[]> {
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
  static async getUserAchievements(userId: string): Promise<UserAchievement[]> {
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

  // Получить прогресс достижений пользователя
  static async getUserAchievementProgress(userId: string): Promise<AchievementProgress[]> {
    const achievements = await this.getAllAchievements();
    const userAchievements = await this.getUserAchievements(userId);
    
    const userAchievementMap = new Map(
      userAchievements.map(ua => [ua.achievementId, ua])
    );

    const progressList: AchievementProgress[] = [];

    for (const achievement of achievements) {
      const userAchievement = userAchievementMap.get(achievement.id);
      const isUnlocked = !!userAchievement;
      
      // Здесь можно добавить логику подсчёта прогресса
      // Пока что простое булевое значение
      const progress = isUnlocked ? 1 : 0;
      const maxProgress = 1;

      progressList.push({
        achievement,
        progress,
        maxProgress,
        isUnlocked,
        unlockedAt: userAchievement?.unlockedAt,
        progressPercentage: (progress / maxProgress) * 100,
      });
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

    // Получаем данные пользователя для проверки достижений
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        applications: true,
        gameRecords: true,
        friendshipsSent: true,
        friendshipsReceived: true,
        storyLikes: true,
      },
    });

    if (!user) return grantedAchievements;

    // Получаем все достижения
    const achievements = await this.getAllAchievements();

    for (const achievement of achievements) {
      try {
        let shouldGrant = false;

        // Проверяем условия для разных типов достижений
        switch (achievement.type) {
          case 'APPLICATIONS':
            shouldGrant = await this.checkApplicationAchievements(achievement, user.applications);
            break;
          case 'GAMES':
            shouldGrant = await this.checkGameAchievements(achievement, user.gameRecords);
            break;
          case 'SOCIAL':
            shouldGrant = await this.checkSocialAchievements(achievement, user);
            break;
          case 'STREAK':
            shouldGrant = await this.checkStreakAchievements(achievement, user);
            break;
          case 'COMMUNITY':
            shouldGrant = await this.checkCommunityAchievements(achievement, user);
            break;
          case 'CREATIVITY':
            shouldGrant = await this.checkCreativityAchievements(achievement, user);
            break;
          default:
            // Для SPECIAL и других типов - только ручная выдача
            shouldGrant = false;
        }

        if (shouldGrant) {
          const granted = await this.grantAchievement(userId, achievement.id);
          grantedAchievements.push(granted);
        }
      } catch (error) {
        // Игнорируем ошибки (например, если достижение уже получено)
        console.log(`Не удалось выдать достижение ${achievement.name}:`, error);
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
