// app/api/heroes/route.ts
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    // TODO: Когда система донатов будет реализована, здесь будет запрос к БД
    // Пока возвращаем тестовые данные для демонстрации
    
    const heroes = [
      {
        id: "hero-1",
        name: "Александр Великий",
        avatar: null,
        totalDonated: 15000,
        donationCount: 25,
        rank: 1,
        joinedAt: new Date("2024-01-15"),
        isSubscriber: true
      },
      {
        id: "hero-2", 
        name: "Мария Кюри",
        avatar: null,
        totalDonated: 12500,
        donationCount: 18,
        rank: 2,
        joinedAt: new Date("2024-02-03"),
        isSubscriber: true
      },
      {
        id: "hero-3",
        name: "Илон Маск",
        avatar: null,
        totalDonated: 8900,
        donationCount: 12,
        rank: 3,
        joinedAt: new Date("2024-02-20"),
        isSubscriber: false
      },
      {
        id: "hero-4",
        name: "Анна Ахматова",
        avatar: null,
        totalDonated: 5200,
        donationCount: 8,
        rank: 4,
        joinedAt: new Date("2024-03-05"),
        isSubscriber: true
      },
      {
        id: "hero-5",
        name: "Стив Джобс",
        avatar: null,
        totalDonated: 3700,
        donationCount: 15,
        rank: 5,
        joinedAt: new Date("2024-03-12"),
        isSubscriber: false
      },
      {
        id: "hero-6",
        name: "Фрида Кало",
        avatar: null,
        totalDonated: 2800,
        donationCount: 6,
        rank: 6,
        joinedAt: new Date("2024-04-01"),
        isSubscriber: true
      },
      {
        id: "hero-7",
        name: "Леонардо да Винчи",
        avatar: null,
        totalDonated: 2100,
        donationCount: 9,
        rank: 7,
        joinedAt: new Date("2024-04-15"),
        isSubscriber: false
      },
      {
        id: "hero-8",
        name: "Майя Плисецкая",
        avatar: null,
        totalDonated: 1500,
        donationCount: 4,
        rank: 8,
        joinedAt: new Date("2024-05-02"),
        isSubscriber: false
      },
      {
        id: "hero-9",
        name: "Альберт Эйнштейн",
        avatar: null,
        totalDonated: 1200,
        donationCount: 3,
        rank: 9,
        joinedAt: new Date("2024-05-20"),
        isSubscriber: true
      },
      {
        id: "hero-10",
        name: "Коко Шанель",
        avatar: null,
        totalDonated: 900,
        donationCount: 2,
        rank: 10,
        joinedAt: new Date("2024-06-10"),
        isSubscriber: false
      }
    ];

    return NextResponse.json(
      {
        heroes,
        total: heroes.length,
        message: heroes.length === 0 ? "Пока нет героев проекта. Стань первым!" : null
      },
      {
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "Pragma": "no-cache",
          "Expires": "0",
        },
      }
    );
  } catch (error) {
    console.error("Ошибка при получении героев:", error);
    return NextResponse.json(
      { 
        error: "Ошибка при получении данных о героях",
        heroes: [],
        total: 0
      },
      { 
        status: 500,
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "Pragma": "no-cache",
          "Expires": "0",
        },
      }
    );
  }
}
