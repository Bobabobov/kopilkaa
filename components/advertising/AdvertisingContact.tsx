"use client";

import { motion } from "framer-motion";
import { AdRequestSuccessScreen } from "./AdRequestSuccessScreen";
import { AdRequestFormHeader } from "./AdRequestFormHeader";
import { AdRequestContactFields } from "./AdRequestContactFields";
import { AdRequestFormatSelect } from "./AdRequestFormatSelect";
import { AdRequestImagesBlock } from "./AdRequestImagesBlock";
import { AdRequestDurationField } from "./AdRequestDurationField";
import { AdRequestMessageField } from "./AdRequestMessageField";
import { AdRequestSubmitButton } from "./AdRequestSubmitButton";
import { useAdRequestForm } from "@/hooks/advertising/useAdRequestForm";

export function AdvertisingContact() {
  const {
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
    isBannerFormat,
  } = useAdRequestForm();

  if (isSubmitted) {
    return <AdRequestSuccessScreen onReset={() => setIsSubmitted(false)} />;
  }

  return (
    <section id="contact" className="py-24 px-4 relative">
      <div className="container mx-auto max-w-3xl">
        <AdRequestFormHeader />

        <motion.form
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          onSubmit={handleSubmit}
          className="relative space-y-10"
          noValidate
        >
          <div className="space-y-10">
            <AdRequestContactFields
              formData={formData}
              errors={errors}
              setErrors={setErrors}
              handleChange={handleChange}
            />

            <AdRequestFormatSelect
              formData={formData}
              errors={errors}
              setErrors={setErrors}
              handleChange={handleChange}
            />

            <AdRequestImagesBlock
              formData={formData}
              setFormData={setFormData}
              images={images}
              setImages={setImages}
              mobileImages={mobileImages}
              setMobileImages={setMobileImages}
              imageUrlInput={imageUrlInput}
              setImageUrlInput={setImageUrlInput}
              mobileUrlInput={mobileUrlInput}
              setMobileUrlInput={setMobileUrlInput}
              imageInputMode={imageInputMode}
              setImageInputMode={setImageInputMode}
              mobileInputMode={mobileInputMode}
              setMobileInputMode={setMobileInputMode}
              isBannerFormat={isBannerFormat}
            />

            <AdRequestDurationField
              formData={formData}
              errors={errors}
              setErrors={setErrors}
              handleChange={handleChange}
            />

            <AdRequestMessageField
              formData={formData}
              errors={errors}
              setErrors={setErrors}
              handleChange={handleChange}
            />

            <AdRequestSubmitButton
              isSubmitting={isSubmitting}
              isUploading={isUploading}
            />
          </div>
        </motion.form>
      </div>
    </section>
  );
}
