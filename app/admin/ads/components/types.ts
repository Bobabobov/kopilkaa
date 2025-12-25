// app/admin/ads/components/types.ts
export interface Advertisement {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  linkUrl?: string;
  expiresAt?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  placement?: string;
  config?: {
    storyTitle?: string;
    storyText?: string;
    storyImageUrls?: string[];
    advertiserName?: string;
    advertiserLink?: string;
    bannerMobileImageUrl?: string;
    sidebarMobileImageUrl?: string;
    sidebarMobileTitle?: string;
    sidebarMobileContent?: string;
  } | null;
}

export interface AdFormData {
  title: string;
  content: string;
  imageUrl: string;
  linkUrl: string;
  expiresAt: string;
  isActive: boolean;
  placement: string;
  storyTitle: string;
  storyText: string;
  storyImageUrls: string[];
  advertiserName: string;
  advertiserLink: string;
  bannerMobileImageUrl: string;
  sidebarMobileImageUrl: string;
  sidebarMobileTitle: string;
  sidebarMobileContent: string;
}


