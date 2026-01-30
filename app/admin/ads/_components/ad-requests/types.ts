// app/admin/ads/components/ad-requests/types.ts
export interface AdRequest {
  id: string;
  companyName: string;
  email: string;
  website?: string;
  format: string;
  duration: number;
  bannerUrl?: string;
  imageUrls?: string[] | null;
  mobileBannerUrls?: string[] | null;
  comment?: string;
  status: string;
  adminComment?: string;
  processedBy?: string;
  createdAt: string;
}

export interface Stats {
  total: number;
  new: number;
  processing: number;
  approved: number;
  rejected: number;
}
