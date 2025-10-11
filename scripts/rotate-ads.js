// Скрипт для автоматической ротации рекламы
// Можно запускать через cron каждые 24 часа
// Пример: 0 0 * * * node scripts/rotate-ads.js

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function rotateAds() {
  try {
    console.log('Начинаем ротацию рекламы...');
    
    // Деактивируем истекшие рекламы
    const expiredAds = await prisma.advertisement.updateMany({
      where: {
        expiresAt: {
          lt: new Date()
        },
        isActive: true
      },
      data: {
        isActive: false
      }
    });

    console.log(`Деактивировано истекших реклам: ${expiredAds.count}`);

    // Получаем количество активных реклам
    const activeAdsCount = await prisma.advertisement.count({
      where: {
        isActive: true,
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } }
        ]
      }
    });

    console.log(`Активных реклам: ${activeAdsCount}`);
    console.log('Ротация завершена успешно');
    
  } catch (error) {
    console.error('Ошибка при ротации рекламы:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Запускаем ротацию
rotateAds();
