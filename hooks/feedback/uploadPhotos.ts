'use client';

import { uploadApplicationPhotos } from '@/hooks/applications/formState/upload';
import type { LocalImage } from '@/hooks/applications/formState/types';

/** Загрузка фото для формы обратной связи (тот же pipeline, что у заявок). */
export async function uploadFeedbackPhotos(
  photos: LocalImage[],
): Promise<string[]> {
  return uploadApplicationPhotos(photos);
}
