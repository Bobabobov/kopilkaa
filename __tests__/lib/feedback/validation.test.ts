import { describe, expect, it } from 'vitest';
import { submitSiteFeedbackSchema } from '@/lib/feedback/validation';

describe('submitSiteFeedbackSchema', () => {
  it('должно принять валидный отзыв без фото', () => {
    const result = submitSiteFeedbackSchema.safeParse({
      message: 'Всё отлично, спасибо!',
      topic: 'general',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.imageUrls).toEqual([]);
    }
  });

  it('должно отклонить внешний URL изображения', () => {
    const result = submitSiteFeedbackSchema.safeParse({
      message: 'Баг на главной странице',
      topic: 'general',
      imageUrls: ['https://evil.example/photo.jpg'],
    });
    expect(result.success).toBe(false);
  });

  it('должно принять безопасные upload URL', () => {
    const result = submitSiteFeedbackSchema.safeParse({
      message: 'Скриншот ошибки во вложении',
      topic: 'applications',
      imageUrls: ['/api/uploads/abc123.jpg'],
    });
    expect(result.success).toBe(true);
  });

  it('должно отклонить больше 5 фото', () => {
    const result = submitSiteFeedbackSchema.safeParse({
      message: 'Слишком много вложений',
      topic: 'general',
      imageUrls: Array.from({ length: 6 }, (_, i) => `/api/uploads/file${i}.jpg`),
    });
    expect(result.success).toBe(false);
  });

  it('должно очистить управляющие символы в сообщении', () => {
    const result = submitSiteFeedbackSchema.safeParse({
      message: 'Текст\u0000с\u0007багом',
      topic: 'general',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.message).toBe('Текстсбагом');
    }
  });

  it('должно отклонить небезопасный pagePath', () => {
    const result = submitSiteFeedbackSchema.safeParse({
      message: 'Проблема на странице',
      topic: 'general',
      pagePath: 'https://evil.example',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.pagePath).toBeNull();
    }
  });
});
