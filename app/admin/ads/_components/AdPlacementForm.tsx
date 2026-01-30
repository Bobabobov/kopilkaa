// app/admin/ads/components/AdPlacementForm.tsx
"use client";
import type { Advertisement, AdFormData } from "./types";
import BasicFields from "./placement-form/BasicFields";
import StoryFields from "./placement-form/StoryFields";
import BannerMobileField from "./placement-form/BannerMobileField";
import SidebarMobileFields from "./placement-form/SidebarMobileFields";
import ContentField from "./placement-form/ContentField";
import FormActions from "./placement-form/FormActions";
import {
  useImageUpload,
  useMultipleImageUpload,
  useVideoUpload,
} from "./placement-form/useImageUpload";

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
    uploading: uploadingBannerImage,
    previewFile: bannerImageFile,
    handleFileSelect: handleBannerImageFileSelect,
    clearPreview: clearBannerImage,
  } = useImageUpload();

  const {
    uploading: uploadingBannerMobileImage,
    previewFile: bannerMobileImageFile,
    handleFileSelect: handleBannerMobileImageFileSelect,
    clearPreview: clearBannerMobileImage,
  } = useImageUpload();

  const {
    uploading: uploadingBannerVideo,
    previewFile: bannerVideoFile,
    handleFileSelect: handleBannerVideoFileSelect,
    clearPreview: clearBannerVideo,
  } = useVideoUpload();

  const {
    uploading: uploadingBannerMobileVideo,
    previewFile: bannerMobileVideoFile,
    handleFileSelect: handleBannerMobileVideoFileSelect,
    clearPreview: clearBannerMobileVideo,
  } = useVideoUpload();

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

  const handlePreviewFileSelectWrapper = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
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

  const handleSidebarImageFileSelectWrapper = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
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

  const handleSidebarMobileImageFileSelectWrapper = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
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

  const handleBannerImageFileSelectWrapper = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    handleBannerImageFileSelect(e, (url) => {
      updateField("imageUrl", url);
    });
  };

  const handleBannerImageUrlChange = (url: string) => {
    updateField("imageUrl", url);
    clearBannerImage();
  };

  const handleBannerImageRemove = () => {
    clearBannerImage();
    updateField("imageUrl", "");
  };

  const handleBannerMobileImageFileSelectWrapper = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    handleBannerMobileImageFileSelect(e, (url) => {
      updateField("bannerMobileImageUrl", url);
    });
  };

  const handleBannerMobileImageUrlChange = (url: string) => {
    updateField("bannerMobileImageUrl", url);
    clearBannerMobileImage();
  };

  const handleBannerMobileImageRemove = () => {
    clearBannerMobileImage();
    updateField("bannerMobileImageUrl", "");
  };

  const handleBannerVideoFileSelectWrapper = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    handleBannerVideoFileSelect(e, (url) => {
      updateField("bannerVideoUrl", url);
    });
  };

  const handleBannerVideoUrlChange = (url: string) => {
    updateField("bannerVideoUrl", url);
    clearBannerVideo();
  };

  const handleBannerVideoRemove = () => {
    clearBannerVideo();
    updateField("bannerVideoUrl", "");
  };

  const handleBannerMobileVideoFileSelectWrapper = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    handleBannerMobileVideoFileSelect(e, (url) => {
      updateField("bannerMobileVideoUrl", url);
    });
  };

  const handleBannerMobileVideoUrlChange = (url: string) => {
    updateField("bannerMobileVideoUrl", url);
    clearBannerMobileVideo();
  };

  const handleBannerMobileVideoRemove = () => {
    clearBannerMobileVideo();
    updateField("bannerMobileVideoUrl", "");
  };

  const handleStoryImageFileSelectWrapper = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
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
                : formData.placement === "home_banner"
                  ? bannerImageFile
                  : undefined
          }
          uploadingPreview={
            formData.placement === "stories"
              ? uploadingPreview
              : formData.placement === "home_sidebar"
                ? uploadingSidebarImage
                : formData.placement === "home_banner"
                  ? uploadingBannerImage
                  : undefined
          }
          onFieldChange={updateField}
          onPreviewFileSelect={
            formData.placement === "stories"
              ? handlePreviewFileSelectWrapper
              : formData.placement === "home_sidebar"
                ? handleSidebarImageFileSelectWrapper
                : formData.placement === "home_banner"
                  ? handleBannerImageFileSelectWrapper
                  : undefined
          }
          onPreviewUrlChange={
            formData.placement === "stories"
              ? handlePreviewUrlChange
              : formData.placement === "home_sidebar"
                ? handleSidebarImageUrlChange
                : formData.placement === "home_banner"
                  ? handleBannerImageUrlChange
                  : undefined
          }
          onPreviewRemove={
            formData.placement === "stories"
              ? handlePreviewRemove
              : formData.placement === "home_sidebar"
                ? handleSidebarImageRemove
                : formData.placement === "home_banner"
                  ? handleBannerImageRemove
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
          <BannerMobileField
            formData={formData}
            previewImageFile={bannerMobileImageFile}
            uploadingPreview={uploadingBannerMobileImage}
            onFieldChange={updateField}
            onMobileImageFileSelect={handleBannerMobileImageFileSelectWrapper}
            onMobileImageUrlChange={handleBannerMobileImageUrlChange}
            onMobileImageRemove={handleBannerMobileImageRemove}
            bannerVideoPreviewFile={bannerVideoFile}
            uploadingBannerVideo={uploadingBannerVideo}
            onBannerVideoFileSelect={handleBannerVideoFileSelectWrapper}
            onBannerVideoUrlChange={handleBannerVideoUrlChange}
            onBannerVideoRemove={handleBannerVideoRemove}
            bannerMobileVideoPreviewFile={bannerMobileVideoFile}
            uploadingBannerMobileVideo={uploadingBannerMobileVideo}
            onBannerMobileVideoFileSelect={
              handleBannerMobileVideoFileSelectWrapper
            }
            onBannerMobileVideoUrlChange={handleBannerMobileVideoUrlChange}
            onBannerMobileVideoRemove={handleBannerMobileVideoRemove}
          />
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
          onCancel={onCancel}
        />
      </form>
    </div>
  );
}
