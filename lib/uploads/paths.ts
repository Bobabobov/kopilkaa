// lib/uploads/paths.ts
import { join } from "path";

/**
 * Получает путь к директории для загрузки файлов
 * Использует переменную окружения UPLOAD_DIR или дефолтный путь
 */
export function getUploadDir(): string {
  // Если указана переменная окружения, используем её
  if (process.env.UPLOAD_DIR) {
    return process.env.UPLOAD_DIR;
  }
  
  // Иначе используем папку uploads в корне проекта
  return join(process.cwd(), "uploads");
}

/**
 * Получает полный путь к файлу по его имени
 */
export function getUploadFilePath(filename: string): string {
  const uploadDir = getUploadDir();
  return join(uploadDir, filename);
}
























