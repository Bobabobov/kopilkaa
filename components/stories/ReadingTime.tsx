// components/stories/ReadingTime.tsx
"use client";
import { LucideIcons } from "@/components/ui/LucideIcons";

interface ReadingTimeProps {
  text: string;
}

export function ReadingTime({ text }: ReadingTimeProps) {
  // Средняя скорость чтения: 200-250 слов в минуту, 1000 символов в минуту
  const wordsPerMinute = 200;
  const charsPerMinute = 1000;

  const trimmedText = text.trim();

  // Считаем символы (без пробелов)
  const charCount = trimmedText.replace(/\s/g, "").length;

  // Считаем слова
  const wordCount = trimmedText
    .split(/\s+/)
    .filter((word) => word.length > 0 && word.match(/[а-яёa-z]/i)).length;

  // Время чтения на основе слов (если есть) или символов
  const readingTimeMinutes =
    wordCount > 0
      ? Math.max(1, Math.ceil(wordCount / wordsPerMinute))
      : Math.max(1, Math.ceil(charCount / charsPerMinute));

  const formatTime = (minutes: number) => {
    if (minutes < 1) return "Меньше минуты";
    if (minutes === 1) return "1 минута";
    if (minutes < 5) return `${minutes} минуты`;
    return `${minutes} минут`;
  };

  const formatWordCount = (count: number) => {
    if (count === 0) return "0 слов";
    if (count === 1) return "1 слово";
    if (count < 5) return `${count} слова`;
    return `${count} слов`;
  };

  const formatCharCount = (count: number) => {
    if (count === 0) return "0 символов";
    if (count === 1) return "1 символ";
    if (count < 5) return `${count} символа`;
    return `${count} символов`;
  };

  return (
    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
      <LucideIcons.Clock size="sm" />
      <span>{formatTime(readingTimeMinutes)}</span>
      <span>•</span>
      <span>{formatWordCount(wordCount)}</span>
      <span>•</span>
      <span>{formatCharCount(charCount)}</span>
    </div>
  );
}
