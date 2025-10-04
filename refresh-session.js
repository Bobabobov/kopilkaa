const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function refreshSession() {
  try {
    // Находим пользователя
    const user = await prisma.user.findUnique({
      where: { email: 'bobov097@gmail.com' }
    });
    
    if (!user) {
      console.log('❌ Пользователь не найден');
      return;
    }
    
    console.log('👤 Пользователь найден:', {
      email: user.email,
      name: user.name,
      role: user.role
    });
    
    // Обновляем lastSeen чтобы принудительно обновить сессию
    await prisma.user.update({
      where: { email: 'bobov097@gmail.com' },
      data: { lastSeen: new Date() }
    });
    
    console.log('✅ Сессия обновлена');
    console.log('Теперь выйдите и войдите заново в систему');
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

refreshSession();
