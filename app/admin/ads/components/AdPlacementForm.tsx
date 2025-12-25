// app/admin/ads/components/AdPlacementForm.tsx
"use client";
import type { Advertisement, AdFormData } from "./types";
import BasicFields from "./placement-form/BasicFields";
import StoryFields from "./placement-form/StoryFields";
import BannerMobileField from "./placement-form/BannerMobileField";
import SidebarMobileFields from "./placement-form/SidebarMobileFields";
import ContentField from "./placement-form/ContentField";
import FormActions from "./placement-form/FormActions";
import { useImageUpload, useMultipleImageUpload } from "./placement-form/useImageUpload";

interface AdPlacementFormProps {
  formData: AdFormData;
  editingAd: Advertisement | null;
  onFormDataChange: (data: AdFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export default function AdPlacementForm({
  formData,
  editingAd,
  onFormDataChange,
  onSubmit,
  onCancel,
}: AdPlacementFormProps) {
  const {
    uploading: uploadingPreview,
    previewFile: previewImageFile,
    handleFileSelect: handlePreviewFileSelect,
    clearPreview: clearPreviewImage,
  } = useImageUpload();

  const {
    uploading: uploadingSidebarImage,
    previewFile: sidebarImageFile,
    handleFileSelect: handleSidebarImageFileSelect,
    clearPreview: clearSidebarImage,
  } = useImageUpload();

  const {
    uploading: uploadingSidebarMobileImage,
    previewFile: sidebarMobileImageFile,
    handleFileSelect: handleSidebarMobileImageFileSelect,
    clearPreview: clearSidebarMobileImage,
  } = useImageUpload();

  const {
    uploading: uploadingStoryImages,
    previewFiles: storyImageFiles,
    handleFileSelect: handleStoryImageFileSelect,
    clearPreview: clearStoryImagePreview,
  } = useMultipleImageUpload();

  const updateField = (field: keyof AdFormData, value: any) => {
    onFormDataChange({ ...formData, [field]: value });
  };

  const updateStoryImageUrl = (index: number, value: string) => {
    const next = [...formData.storyImageUrls];
    next[index] = value;
    updateField("storyImageUrls", next);
  };

  const addStoryImageUrl = () => {
    if (formData.storyImageUrls.length < 5) {
      updateField("storyImageUrls", [...formData.storyImageUrls, ""]);
    }
  };

  const handlePreviewFileSelectWrapper = (e: React.ChangeEvent<HTMLInputElement>) => {
    handlePreviewFileSelect(e, (url) => {
      updateField("imageUrl", url);
    });
  };

  const handlePreviewUrlChange = (url: string) => {
    updateField("imageUrl", url);
    clearPreviewImage();
  };

  const handlePreviewRemove = () => {
    clearPreviewImage();
    updateField("imageUrl", "");
  };

  const handleSidebarImageFileSelectWrapper = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleSidebarImageFileSelect(e, (url) => {
      updateField("imageUrl", url);
    });
  };

  const handleSidebarImageUrlChange = (url: string) => {
    updateField("imageUrl", url);
    clearSidebarImage();
  };

  const handleSidebarImageRemove = () => {
    clearSidebarImage();
    updateField("imageUrl", "");
  };

  const handleSidebarMobileImageFileSelectWrapper = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleSidebarMobileImageFileSelect(e, (url) => {
      updateField("sidebarMobileImageUrl", url);
    });
  };

  const handleSidebarMobileImageUrlChange = (url: string) => {
    updateField("sidebarMobileImageUrl", url);
    clearSidebarMobileImage();
  };

  const handleSidebarMobileImageRemove = () => {
    clearSidebarMobileImage();
    updateField("sidebarMobileImageUrl", "");
  };

  const handleStoryImageFileSelectWrapper = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    handleStoryImageFileSelect(index, e, (idx, url) => {
      updateStoryImageUrl(idx, url);
    });
  };

  const handleStoryImageUrlChange = (index: number, url: string) => {
    updateStoryImageUrl(index, url);
    clearStoryImagePreview(index);
  };

  const handleStoryImageRemove = (index: number) => {
    clearStoryImagePreview(index);
    updateStoryImageUrl(index, "");
  };

  return (
    <div className="mb-8 p-6 bg-[#001e1d] rounded-xl border border-[#abd1c6]/30">
      <h2 className="text-xl font-bold text-[#fffffe] mb-4">
        {editingAd ? "Редактировать размещение" : "Новое размещение"}
      </h2>

      <form onSubmit={onSubmit} className="space-y-4">
        <BasicFields
          formData={formData}
          previewImageFile={
            formData.placement === "stories"
              ? previewImageFile
              : formData.placement === "home_sidebar"
                ? sidebarImageFile
                : undefined
          }
          uploadingPreview={
            formData.placement === "stories"
              ? uploadingPreview
              : formData.placement === "home_sidebar"
                ? uploadingSidebarImage
                : undefined
          }
          onFieldChange={updateField}
          onPreviewFileSelect={
            formData.placement === "stories"
              ? handlePreviewFileSelectWrapper
              : formData.placement === "home_sidebar"
                ? handleSidebarImageFileSelectWrapper
                : undefined
          }
          onPreviewUrlChange={
            formData.placement === "stories"
              ? handlePreviewUrlChange
              : formData.placement === "home_sidebar"
                ? handleSidebarImageUrlChange
                : undefined
          }
          onPreviewRemove={
            formData.placement === "stories"
              ? handlePreviewRemove
              : formData.placement === "home_sidebar"
                ? handleSidebarImageRemove
                : undefined
          }
        />

        {formData.placement === "stories" && (
          <StoryFields
            formData={formData}
            storyImageFiles={storyImageFiles}
            uploadingStoryImages={uploadingStoryImages}
            onFieldChange={updateField}
            onStoryImageFileSelect={handleStoryImageFileSelectWrapper}
            onStoryImageUrlChange={handleStoryImageUrlChange}
            onStoryImageRemove={handleStoryImageRemove}
            onAddStoryImage={addStoryImageUrl}
          />
        )}

        {formData.placement === "home_banner" && (
          <BannerMobileField formData={formData} onFieldChange={updateField} />
        )}

        {formData.placement === "home_sidebar" && (
          <SidebarMobileFields
            formData={formData}
            previewImageFile={sidebarMobileImageFile}
            uploadingPreview={uploadingSidebarMobileImage}
            onFieldChange={updateField}
            onMobileImageFileSelect={handleSidebarMobileImageFileSelectWrapper}
            onMobileImageUrlChange={handleSidebarMobileImageUrlChange}
            onMobileImageRemove={handleSidebarMobileImageRemove}
          />
        )}

        <ContentField formData={formData} onFieldChange={updateField} />

        <FormActions
          editingAd={editingAd}
          isActive={formData.isActive}
          onActiveChange={(active) => updateField("isActive", active)}
          onSubmit={onSubmit}
          onCancel={onCancel}
        />
      </form>
    </div>
  );
}
