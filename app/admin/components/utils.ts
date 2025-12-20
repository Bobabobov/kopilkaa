// app/admin/components/utils.ts

// Обрезаем текст истории если слишком длинный (учитывая HTML)
export const truncateHTML = (html: string, maxLength: number): string => {
  // Убираем HTML теги для подсчета длины текста
  const textContent = html.replace(/<[^>]*>/g, '');
  if (textContent.length <= maxLength) return html;
  
  // Упрощенная обрезка: просто обрезаем по длине текста и добавляем многоточие
  // В реальном приложении можно использовать более сложную логику
  let truncated = '';
  let currentLength = 0;
  const regex = /(<[^>]*>)|([^<]+)/g;
  let match;
  
  while ((match = regex.exec(html)) !== null) {
    if (match[1]) {
      // HTML тег - добавляем как есть
      truncated += match[1];
    } else if (match[2]) {
      // Текст
      const text = match[2];
      if (currentLength + text.length > maxLength) {
        const remaining = maxLength - currentLength;
        truncated += text.slice(0, remaining) + '…';
        break;
      }
      truncated += text;
      currentLength += text.length;
    }
  }
  
  return truncated;
};


