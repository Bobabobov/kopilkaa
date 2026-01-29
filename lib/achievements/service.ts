// lib/achievements/service.ts
import { prisma } from "@/lib/db";
import {
  Achievement,
  UserAchievement,
  AchievementProgress,
  AchievementStats,
  AchievementRarity,
  AchievementType,
  AchievementKind,
} from "./types";

export class AchievementService {
  private static getAchievementKey(a: Achievement): string {
    const anyA: any = a as any;
    return String(anyA.slug || a.name || "")
      .trim()
      .toLowerCase();
  }

  private static parseFirstInt(text: string | null | undefined): number | null {
    if (!text) return null;
    const m = String(text).match(/(\d{1,6})/);
    if (!m) return null;
    const n = Number(m[1]);
    return Number.isFinite(n) ? n : null;
  }

  /**
   * target = "сколько нужно сделать", чтобы получить ачивку.
   * Важно: НЕ путать с maxCount в БД (исторически оно использовалось по-разному).
   * Мы вычисляем target из slug/имени/описания, чтобы новые пользователи
   * не получали пачку достижений из‑за target=1 по умолчанию.
   */
  private static getTargetForAchievement(
    achievement: Achievement,
    eligibleNormals: Achievement[],
  ): number {
    const key = this.getAchievementKey(achievement);
    const name = String(achievement.name || "").toLowerCase();
    const desc = String(achievement.description || "").toLowerCase();

    // META (Легенда) — получить все eligible NORMAL
    if (
      (achievement.kind ?? "NORMAL") === "META" ||
      key === "legend" ||
      name.includes("легенда")
    ) {
      return Math.max(eligibleNormals.length, 1);
    }

    // Пытаемся вытащить число из описания (5 заявок, 10 друзей, 30 дней, 100 слов, 50 лайков, 100 очков и т.д.)
    const n = this.parseFirstInt(desc);
    if (n != null && n > 0) return n;

    // Без чисел — обычно “первое действие”
    return 1;
  }

  private static getMetricForAchievement(
    achievement: Achievement,
    userStats: any,
  ): number {
    const key = this.getAchievementKey(achievement);
    const name = String(achievement.name || "").toLowerCase();
    const desc = String(achievement.description || "").toLowerCase();

    // === HEROES / paid placement (Donation.type = SUPPORT) ===
    // Tier achievements use max single payment amount as metric.
    if (key.startsWith("heroes_") && key !== "heroes_custom") {
      return userStats.heroMaxPayment ?? 0;
    }
    // Manual only: custom isn't auto-granted.
    if (key === "heroes_custom") return 0;

    // Profile completion
    if (key === "profile_avatar") return userStats.hasAvatar ? 1 : 0;
    if (key === "profile_socials") return userStats.hasSocialLinks ? 1 : 0;

    // First 100 / первопроходец
    if (key === "first100" || name.includes("первопроход")) {
      return userStats.isFirst100 ? 1 : 0;
    }

    // Легенда обрабатывается отдельно (META)
    if (key === "legend" || name.includes("легенда")) {
      return userStats._unlockedEligibleCount || 0;
    }

    // Одобренная заявка
    if (key === "approved_application" || name.includes("одобрен")) {
      return userStats.applicationsApproved ?? 0;
    }

    // “Вдохновение” — лайки на одной истории (получено 10+ лайков на одну историю)
    if (
      key === "inspiration_10_likes_on_one_story" ||
      (desc.includes("истор") && desc.includes("лайк"))
    ) {
      return userStats.likesReceivedMaxOnOneStory ?? 0;
    }

    // Лайки/оценки, которые пользователь поставил
    if (desc.includes("лайк") || desc.includes("оцен")) {
      return userStats.likesGiven ?? 0;
    }

    // Друзья
    if (desc.includes("друз")) {
      return userStats.friendsCount ?? 0;
    }

    // Заявки
    if (desc.includes("заявк")) {
      return userStats.applicationsCreated ?? 0;
    }

    // Стрик (дни подряд)
    if (desc.includes("дн") && desc.includes("подряд")) {
      return userStats.loginStreakDays ?? 0;
    }

    // Текст/слова
    if (desc.includes("слов")) {
      return userStats.maxStoryWords ?? 0;
    }


    // “Первый рекорд” — факт наличия любой записи игры
    if (key === "first_record" || desc.includes("рекорд")) {
      return userStats.hasAnyGameRecord ? 1 : 0;
    }

    // “Сыграйте X раз” — число сыгранных игр
    if (desc.includes("сыгра") && desc.includes("игр")) {
      return userStats.gamesPlayed ?? 0;
    }

    // “Благодарность” — пока не считаем автоматически (чтобы не раздавать ошибочно)
    if (key === "gratitude" || name.includes("благодар")) {
      return 0;
    }

    // Fallback: безопасно 0, чтобы ничего случайно не “раздать”.
    return 0;
  }
  // Получить все активные достижения
  static async getAllAchievements() {
    return await prisma.achievement.findMany({
      where: {
        isActive: true,
      },
      orderBy: [{ rarity: "desc" }, { createdAt: "desc" }],
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
        unlockedAt: "desc",
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
        avatar: true,
        vkLink: true,
        telegramLink: true,
        youtubeLink: true,
      },
    });
    if (!user) return null;

    // applications
    const [applicationsCreated, applicationsApproved] = await Promise.all([
      prisma.application.count({ where: { userId } }).catch(() => 0),
      prisma.application
        .count({
          where: { userId, status: "APPROVED" as any },
        })
        .catch(() => 0),
    ]);

    // friends accepted (bidirectional)
    const friendsCount = await prisma.friendship
      .count({
        where: {
          status: "ACCEPTED",
          OR: [{ requesterId: userId }, { receiverId: userId }],
        },
      })
      .catch(() => 0);

    // likes given
    const likesGiven = await prisma.storyLike
      .count({ where: { userId } })
      .catch(() => 0);

    // likes received max on one story (если лайки привязаны к application)
    let likesReceivedMaxOnOneStory = 0;
    try {
      const grouped = await prisma.storyLike.groupBy({
        by: ["applicationId"],
        where: { application: { userId } },
        _count: { _all: true },
      });
      likesReceivedMaxOnOneStory = grouped.reduce(
        (max, g) => Math.max(max, g._count._all),
        0,
      );
    } catch {
      likesReceivedMaxOnOneStory = 0;
    }


    // creativity: максимальная длина текста истории/заявки (если поля есть)
    let maxStoryWords = 0;
    try {
      const stories = await prisma.application.findMany({
        where: { userId },
        select: { story: true, summary: true },
      });
      maxStoryWords = stories.reduce((max, s) => {
        const text = `${s.summary ?? ""} ${s.story ?? ""}`.trim();
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
        orderBy: { visitDate: "desc" },
      });
      const days = Array.from(
        new Set(
          visits.map(
            (v) => new Date(v.visitDate).toISOString().slice(0, 10), // YYYY-MM-DD
          ),
        ),
      )
        .sort()
        .reverse(); // от новых к старым
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

    // heroes placement payments (DonationType.SUPPORT == paid digital placement)
    let heroMaxPayment = 0;
    let heroTotalPaid = 0;
    let heroPaymentsCount = 0;
    try {
      const agg = await prisma.donation.aggregate({
        where: { userId, type: "SUPPORT" },
        _max: { amount: true },
        _sum: { amount: true },
        _count: { _all: true },
      });
      heroMaxPayment = agg._max.amount ?? 0;
      heroTotalPaid = agg._sum.amount ?? 0;
      heroPaymentsCount = agg._count._all ?? 0;
    } catch {
      heroMaxPayment = 0;
      heroTotalPaid = 0;
      heroPaymentsCount = 0;
    }

    return {
      loginStreakDays,
      applicationsCreated,
      applicationsApproved,
      friendsCount,
      likesGiven,
      likesReceivedMaxOnOneStory,
      maxStoryWords,
      isFirst100,
      hasAvatar: Boolean(user.avatar),
      hasSocialLinks: Boolean(
        user.vkLink || user.telegramLink || user.youtubeLink,
      ),
      heroMaxPayment,
      heroTotalPaid,
      heroPaymentsCount,
      _unlockedEligibleCount: 0, // заполнится позже
    };
  }

  // Движок подсчёта прогресса для одной ачивки
  static computeAchievementProgress(
    achievement: Achievement,
    userStats: any,
    isUnlocked: boolean,
    eligibleNormals: Achievement[],
    userAchievement?: UserAchievement,
  ): AchievementProgress {
    const key = this.getAchievementKey(achievement);

    // META: получить все eligible NORMAL
    if (
      (achievement.kind ?? "NORMAL") === "META" ||
      key === "legend" ||
      String(achievement.name || "")
        .toLowerCase()
        .includes("легенда")
    ) {
      const target = this.getTargetForAchievement(achievement, eligibleNormals);
      const unlockedEligible = userStats._unlockedEligibleCount || 0;
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

    // NORMAL: считаем target и метрику “безопасно”
    const target = this.getTargetForAchievement(achievement, eligibleNormals);
    const metric = this.getMetricForAchievement(achievement, userStats);
    const maxProgress = Math.max(target, 1);
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
  static async getUserAchievementProgress(
    userId: string,
  ): Promise<AchievementProgress[]> {
    const achievements = await this.getAllAchievements();
    const userAchievements = await this.getUserAchievements(userId);
    const userAchievementMap = new Map(
      userAchievements.map((ua) => [ua.achievementId, ua]),
    );

    const eligibleNormals = achievements.filter((a) => {
      const ach: any = a as any;
      return (
        (ach.kind ?? "NORMAL") === "NORMAL" &&
        !ach.isExclusive &&
        !ach.isHidden &&
        !ach.isSeasonal
      );
    });

    const userStats = await this.getUserStats(userId);
    if (!userStats) return [];

    // Добавляем вспомогательный счётчик полученных eligible NORMAL для META
    userStats._unlockedEligibleCount = eligibleNormals.filter((a) =>
      userAchievementMap.has(a.id),
    ).length;

    const progressList: AchievementProgress[] = [];

    for (const achievement of achievements) {
      const userAchievement = userAchievementMap.get(achievement.id) as any;
      const isUnlocked = !!userAchievement;

      const p = this.computeAchievementProgress(
        achievement,
        userStats,
        isUnlocked,
        eligibleNormals,
        userAchievement,
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
    grantedByName?: string,
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
      throw new Error("Достижение уже получено");
    }

    // Проверяем лимит достижения
    const achievement = await prisma.achievement.findUnique({
      where: { id: achievementId },
    });

    if (!achievement) {
      throw new Error("Достижение не найдено");
    }

    if (!achievement.isActive) {
      throw new Error("Достижение неактивно");
    }

    // Проверяем период действия
    const now = new Date();
    if (achievement.validFrom && now < achievement.validFrom) {
      throw new Error("Достижение ещё не активно");
    }
    if (achievement.validTo && now > achievement.validTo) {
      throw new Error("Достижение уже неактивно");
    }

    // Проверяем лимит количества
    const userAchievementCount = await prisma.userAchievement.count({
      where: {
        userId,
        achievementId,
      },
    });

    if (userAchievementCount >= achievement.maxCount) {
      throw new Error("Лимит достижения исчерпан");
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
  static async getUserAchievementStats(
    userId: string,
  ): Promise<AchievementStats> {
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
    userAchievements.forEach((ua) => {
      if (ua.achievement) {
        achievementsByRarity[ua.achievement.rarity]++;
        achievementsByType[ua.achievement.type]++;
      }
    });

    const totalAchievements = allAchievements.length;
    const unlockedAchievements = userAchievements.length;
    const completionPercentage =
      totalAchievements > 0
        ? (unlockedAchievements / totalAchievements) * 100
        : 0;

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
  static async checkAndGrantAutomaticAchievements(
    userId: string,
  ): Promise<UserAchievement[]> {
    const grantedAchievements: UserAchievement[] = [];

    const achievements = await this.getAllAchievements();
    const userAchievements = await this.getUserAchievements(userId);
    const userAchievementMap = new Map(
      userAchievements.map((ua) => [ua.achievementId, ua]),
    );

    const eligibleNormals = achievements.filter((a) => {
      const ach: any = a as any;
      return (
        (ach.kind ?? "NORMAL") === "NORMAL" &&
        !ach.isExclusive &&
        !ach.isHidden &&
        !ach.isSeasonal
      );
    });

    const userStats = await this.getUserStats(userId);
    if (!userStats) return grantedAchievements;
    userStats._unlockedEligibleCount = eligibleNormals.filter((a) =>
      userAchievementMap.has(a.id),
    ).length;

    for (const achievement of achievements) {
      const userAchievement = userAchievementMap.get(achievement.id) as any;
      if (userAchievement) continue; // уже есть

      const progress = this.computeAchievementProgress(
        achievement,
        userStats,
        false,
        eligibleNormals,
        undefined,
      );

      if (
        progress.progress >= progress.maxProgress &&
        progress.maxProgress > 0
      ) {
        try {
          const granted = await this.grantAchievement(userId, achievement.id);
          grantedAchievements.push(granted);
          userAchievementMap.set(achievement.id, granted as any);
          const achMeta: any = achievement as any;
          if ((achMeta.kind ?? "NORMAL") === "NORMAL") {
            userStats._unlockedEligibleCount += 1;
          }
        } catch (error) {
          console.error(
            `Не удалось выдать достижение ${achievement.name}:`,
            error,
          );
        }
      }
    }

    return grantedAchievements;
  }

  // Вспомогательные методы для проверки условий
  private static async checkApplicationAchievements(
    achievement: Achievement,
    applications: any[],
  ): Promise<boolean> {
    switch (achievement.name) {
      case "Первые шаги":
        return applications.length >= 1;

      case "Помощник":
        return applications.length >= 5;

      case "Активный участник":
        return applications.length >= 10;

      case "Одобренная заявка":
        return applications.some((app) => app.status === "APPROVED");

      default:
        return false;
    }
  }

  private static async checkGameAchievements(
    achievement: Achievement,
    gameRecords: any[],
  ): Promise<boolean> {
    // Логика проверки игровых достижений
    // Например: "Первый рекорд", "100 очков", "10 игр"
    return false; // Заглушка
  }

  private static async checkSocialAchievements(
    achievement: Achievement,
    user: any,
  ): Promise<boolean> {
    // Логика проверки социальных достижений
    // Например: "Первый друг", "10 друзей", "Активный комментатор"
    return false; // Заглушка
  }

  private static async checkStreakAchievements(
    achievement: Achievement,
    user: any,
  ): Promise<boolean> {
    // Логика проверки достижений за серии
    // Например: "7 дней подряд", "30 дней активности"
    return false; // Заглушка
  }

  private static async checkCommunityAchievements(
    achievement: Achievement,
    user: any,
  ): Promise<boolean> {
    // Логика проверки достижений сообщества
    // Например: "Помощь другим", "Лайки историй"
    return false; // Заглушка
  }

  private static async checkCreativityAchievements(
    achievement: Achievement,
    user: any,
  ): Promise<boolean> {
    // Логика проверки творческих достижений
    // Например: "Красивые истории", "Креативные заявки"
    return false; // Заглушка
  }
}
