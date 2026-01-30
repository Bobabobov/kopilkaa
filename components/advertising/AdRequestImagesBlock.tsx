"use client";

import { AdImageUploadSection } from "./AdImageUploadSection";
import type { AdRequestFormData } from "./adRequestValidation";

const MAX_IMAGES = 5;

interface AdRequestImagesBlockProps {
  formData: AdRequestFormData;
  setFormData: React.Dispatch<React.SetStateAction<AdRequestFormData>>;
  images: { file: File; url: string }[];
  setImages: React.Dispatch<
    React.SetStateAction<{ file: File; url: string }[]>
  >;
  mobileImages: { file: File; url: string }[];
  setMobileImages: React.Dispatch<
    React.SetStateAction<{ file: File; url: string }[]>
  >;
  imageUrlInput: string;
  setImageUrlInput: (v: string) => void;
  mobileUrlInput: string;
  setMobileUrlInput: (v: string) => void;
  imageInputMode: "upload" | "url";
  setImageInputMode: (v: "upload" | "url") => void;
  mobileInputMode: "upload" | "url";
  setMobileInputMode: (v: "upload" | "url") => void;
  isBannerFormat: boolean;
}

export function AdRequestImagesBlock({
  formData,
  setFormData,
  images,
  setImages,
  mobileImages,
  setMobileImages,
  imageUrlInput,
  setImageUrlInput,
  mobileUrlInput,
  setMobileUrlInput,
  imageInputMode,
  setImageInputMode,
  mobileInputMode,
  setMobileInputMode,
  isBannerFormat,
}: AdRequestImagesBlockProps) {
  return (
    <>
      <AdImageUploadSection
        label="Изображения"
        maxImages={MAX_IMAGES}
        images={images}
        imageUrls={formData.imageUrls}
        urlInput={imageUrlInput}
        inputMode={imageInputMode}
        onImagesChange={setImages}
        onImageUrlsChange={(urls) =>
          setFormData((prev) => ({ ...prev, imageUrls: urls }))
        }
        onUrlInputChange={setImageUrlInput}
        onInputModeChange={setImageInputMode}
        onRemoveImage={(index) =>
          setImages((prev) => prev.filter((_, i) => i !== index))
        }
        onRemoveImageUrl={(index) =>
          setFormData((prev) => ({
            ...prev,
            imageUrls: prev.imageUrls.filter((_, i) => i !== index),
          }))
        }
        inputId="image-upload"
      />

      {isBannerFormat && (
        <AdImageUploadSection
          label="URL изображения для мобильного баннера"
          description="Если заполнить, этот баннер будет показан на телефонах. Рекомендуемый размер 800–1080px по ширине, ориентир по высоте 200–300px."
          maxImages={MAX_IMAGES}
          images={mobileImages}
          imageUrls={formData.mobileBannerUrls}
          urlInput={mobileUrlInput}
          inputMode={mobileInputMode}
          onImagesChange={setMobileImages}
          onImageUrlsChange={(urls) =>
            setFormData((prev) => ({ ...prev, mobileBannerUrls: urls }))
          }
          onUrlInputChange={setMobileUrlInput}
          onInputModeChange={setMobileInputMode}
          onRemoveImage={(index) =>
            setMobileImages((prev) => prev.filter((_, i) => i !== index))
          }
          onRemoveImageUrl={(index) =>
            setFormData((prev) => ({
              ...prev,
              mobileBannerUrls: prev.mobileBannerUrls.filter(
                (_, i) => i !== index,
              ),
            }))
          }
          inputId="mobile-image-upload"
        />
      )}
    </>
  );
}
