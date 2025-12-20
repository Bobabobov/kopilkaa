// app/admin/achievements/components/utils.ts

// Функция для получения русского названия типа достижения
export const getTypeLabel = (type: string): string => {
  switch (type) {
    case 'STREAK':
      return 'Серии';
    case 'APPLICATIONS':
      return 'Заявки';
    case 'GAMES':
      return 'Игры';
    case 'SOCIAL':
      return 'Социальные';
    case 'SPECIAL':
      return 'Особые';
    case 'COMMUNITY':
      return 'Сообщество';
    case 'CREATIVITY':
      return 'Творчество';
    default:
      return type;
  }
};


