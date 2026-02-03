const CDN_BASE = process.env.NEXT_PUBLIC_UPLOADS_CDN_URL?.replace(/\/+$/, "");

export const isUploadUrl = (url: string) => url.startsWith("/api/uploads/");
export const isExternalUrl = (url: string) => /^https?:\/\//i.test(url);

type Variant = "thumb" | "medium" | "full";

interface UploadUrlOptions {
  variant?: Variant;
  width?: number;
  height?: number;
  format?: "avif" | "webp" | "jpeg" | "png";
}

export const buildUploadUrl = (url: string, options: UploadUrlOptions = {}) => {
  if (!isUploadUrl(url)) return url;

  const basePath = CDN_BASE ? `${CDN_BASE}${url}` : url;
  const params = new URLSearchParams();

  if (options.variant) params.set("v", options.variant);
  if (options.width) params.set("w", String(options.width));
  if (options.height) params.set("h", String(options.height));
  if (options.format) params.set("format", options.format);

  const query = params.toString();
  if (!query) return basePath;
  const separator = basePath.includes("?") ? "&" : "?";
  return `${basePath}${separator}${query}`;
};
