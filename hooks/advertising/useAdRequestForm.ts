"use client";

import { useState, useRef, useEffect } from "react";
import {
  type AdRequestFormData,
  validateAdRequestForm,
  scrollToFirstError,
} from "@/components/advertising/adRequestValidation";

const INITIAL_FORM: AdRequestFormData = {
  name: "",
  contact: "",
  telegram: "",
  website: "",
  format: "",
  duration: "",
  message: "",
  imageUrls: [],
  mobileBannerUrls: [],
};

export function useAdRequestForm() {
  const [formData, setFormData] = useState<AdRequestFormData>(INITIAL_FORM);
  const [images, setImages] = useState<{ file: File; url: string }[]>([]);
  const [mobileImages, setMobileImages] = useState<
    { file: File; url: string }[]
  >([]);
  const [imageInputMode, setImageInputMode] = useState<"upload" | "url">(
    "upload",
  );
  const [mobileInputMode, setMobileInputMode] = useState<"upload" | "url">(
    "upload",
  );
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [mobileUrlInput, setMobileUrlInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const isSubmittingRef = useRef(false);

  useEffect(() => {
    const parseFormatFromHash = () => {
      const hash = window.location.hash;
      if (hash.includes("#contact")) {
        const hashParts = hash.split("?");
        if (hashParts.length > 1) {
          const params = new URLSearchParams(hashParts[1]);
          const format = params.get("format");
          if (
            format &&
            ["banner", "side", "story", "tg", "other"].includes(format)
          ) {
            setFormData((prev) => ({ ...prev, format }));
            setErrors((prev) => ({ ...prev, format: "" }));
          }
        }
      }
    };
    parseFormatFromHash();
    const handleHashChange = () => parseFormatFromHash();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const uploadImages = async (
    files: { file: File; url: string }[],
  ): Promise<string[]> => {
    if (!files.length) return [];
    setIsUploading(true);
    try {
      const fd = new FormData();
      files.forEach((item) => fd.append("files", item.file));
      const response = await fetch("/api/ad-requests/upload", {
        method: "POST",
        body: fd,
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Ошибка загрузки изображений");
      }
      return (data.files as { url: string }[]).map((f) => f.url);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingRef.current || isSubmitting || isUploading) return;

    isSubmittingRef.current = true;
    setIsSubmitting(true);

    try {
      const newErrors = validateAdRequestForm(formData);
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        scrollToFirstError(Object.keys(newErrors));
        isSubmittingRef.current = false;
        setIsSubmitting(false);
        return;
      }
      setErrors({});

      const email = formData.contact.trim();
      let uploadedImageUrls: string[] = [];
      if (images.length > 0) {
        uploadedImageUrls = await uploadImages(images);
      }
      let uploadedMobileUrls: string[] = [];
      if (mobileImages.length > 0 && formData.format === "banner") {
        uploadedMobileUrls = await uploadImages(mobileImages);
      }

      const allImageUrls = [...uploadedImageUrls, ...formData.imageUrls].filter(
        Boolean,
      );
      const allMobileUrls = [
        ...uploadedMobileUrls,
        ...formData.mobileBannerUrls,
      ].filter(Boolean);
      const comment = formData.message.trim();
      const durationNum = parseInt(formData.duration || "0", 10);

      const body = {
        companyName: formData.name.trim(),
        email,
        telegram: formData.telegram.trim() || null,
        website: formData.website.trim() || null,
        format: formData.format.trim(),
        duration: durationNum,
        imageUrls: allImageUrls.length > 0 ? allImageUrls : null,
        mobileBannerUrls: allMobileUrls.length > 0 ? allMobileUrls : null,
        comment,
      };

      const response = await fetch("/api/ad-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await response.json();

      if (!response.ok) {
        alert(
          data?.error ||
            "Не удалось отправить заявку. Попробуйте ещё раз позже.",
        );
        isSubmittingRef.current = false;
        setIsSubmitting(false);
        return;
      }

      isSubmittingRef.current = false;
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData(INITIAL_FORM);
      setImages([]);
      setMobileImages([]);
      setImageUrlInput("");
      setMobileUrlInput("");
    } catch {
      alert("Произошла ошибка при отправке заявки.");
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return {
    formData,
    setFormData,
    images,
    setImages,
    mobileImages,
    setMobileImages,
    imageInputMode,
    setImageInputMode,
    mobileInputMode,
    setMobileInputMode,
    imageUrlInput,
    setImageUrlInput,
    mobileUrlInput,
    setMobileUrlInput,
    isSubmitting,
    isUploading,
    isSubmitted,
    setIsSubmitted,
    errors,
    setErrors,
    handleSubmit,
    handleChange,
    isBannerFormat: formData.format === "banner",
  };
}
