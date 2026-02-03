// app/api/uploads/[filename]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { access, readFile, writeFile } from "node:fs/promises";
import { join, extname } from "node:path";
import sharp from "sharp";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getUploadFilePath(filename: string): string {
  const uploadDir =
    process.env.UPLOAD_DIR ?? join(process.cwd(), "uploads");
  return join(uploadDir, filename);
}

const VARIANT_WIDTHS: Record<string, number> = {
  thumb: 360,
  medium: 960,
  full: 2000,
};

const IMAGE_EXTS = ["jpg", "jpeg", "png", "webp", "avif"];

const pickFormat = (acceptHeader: string | null, fallback: string) => {
  if (acceptHeader?.includes("image/avif")) return "avif";
  if (acceptHeader?.includes("image/webp")) return "webp";
  return fallback;
};

const toContentType = (format: string, fallback: string) => {
  switch (format) {
    case "avif":
      return "image/avif";
    case "webp":
      return "image/webp";
    case "png":
      return "image/png";
    case "jpeg":
    case "jpg":
      return "image/jpeg";
    default:
      return fallback;
  }
};

const buildVariantFilename = (
  filename: string,
  variantKey: string,
  format: string,
) => {
  const base = filename.replace(extname(filename), "");
  return `${base}__${variantKey}.${format}`;
};

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } },
) {
  try {
    const { filename } = params;
    const searchParams = request.nextUrl.searchParams;
    const widthParam = searchParams.get("w");
    const heightParam = searchParams.get("h");
    const variantParam = searchParams.get("v");
    const formatParam = searchParams.get("format");

    // Проверяем безопасность имени файла
    if (
      !filename ||
      filename.includes("..") ||
      filename.includes("/") ||
      filename.includes("\\")
    ) {
      return new NextResponse("Invalid filename", { status: 400 });
    }

    const filePath = getUploadFilePath(filename);

    try {
      const fileBuffer = await readFile(filePath);

      // Определяем MIME тип по расширению
      const ext = filename.toLowerCase().split(".").pop();
      let contentType = "application/octet-stream";

      switch (ext) {
        case "jpg":
        case "jpeg":
          contentType = "image/jpeg";
          break;
        case "png":
          contentType = "image/png";
          break;
        case "gif":
          contentType = "image/gif";
          break;
        case "webp":
          contentType = "image/webp";
          break;
        case "mp4":
          contentType = "video/mp4";
          break;
        case "webm":
          contentType = "video/webm";
          break;
      }

      const widthFromVariant =
        variantParam && VARIANT_WIDTHS[variantParam]
          ? VARIANT_WIDTHS[variantParam]
          : null;
      const width = widthFromVariant ?? (widthParam ? parseInt(widthParam, 10) : null);
      const height = heightParam ? parseInt(heightParam, 10) : null;
      const shouldResize =
        (width && Number.isFinite(width)) ||
        (height && Number.isFinite(height));

      const maxSize = 2400;
      const safeWidth =
        width && Number.isFinite(width) ? Math.min(width, maxSize) : null;
      const safeHeight =
        height && Number.isFinite(height) ? Math.min(height, maxSize) : null;

      const isImage = IMAGE_EXTS.includes(ext || "");
      const isGif = ext === "gif";

      if (isImage && shouldResize && !isGif) {
        const accept = request.headers.get("accept");
        const allowedFormats = new Set(["avif", "webp", "jpeg", "jpg", "png"]);
        const safeFormat = formatParam && allowedFormats.has(formatParam)
          ? formatParam
          : null;
        const targetFormat = safeFormat || pickFormat(accept, ext || "jpeg");
        const normalizedFormat = targetFormat === "jpg" ? "jpeg" : targetFormat;
        const outputType = toContentType(normalizedFormat, contentType);
        const variantKey =
          variantParam ||
          `w${safeWidth ?? "auto"}h${safeHeight ?? "auto"}`;
        const variantFilename = buildVariantFilename(
          filename,
          variantKey,
          normalizedFormat,
        );
        const variantPath = getUploadFilePath(variantFilename);

        try {
          await access(variantPath);
          const cached = await readFile(variantPath);
          return new NextResponse(new Uint8Array(cached), {
            headers: {
              "Content-Type": outputType,
              "Cache-Control": "public, max-age=31536000, immutable",
            },
          });
        } catch {
          // no cached variant
        }

        const transformer = sharp(fileBuffer).rotate().resize({
          width: safeWidth ?? undefined,
          height: safeHeight ?? undefined,
          fit: "inside",
          withoutEnlargement: true,
        });

        let outputBuffer: Buffer;
        switch (normalizedFormat) {
          case "png":
            outputBuffer = await transformer
              .png({ compressionLevel: 8 })
              .toBuffer();
            break;
          case "webp":
            outputBuffer = await transformer.webp({ quality: 80 }).toBuffer();
            break;
          case "avif":
            outputBuffer = await transformer.avif({ quality: 60 }).toBuffer();
            break;
          default:
            outputBuffer = await transformer.jpeg({ quality: 82 }).toBuffer();
            break;
        }

        await writeFile(variantPath, outputBuffer);

        return new NextResponse(new Uint8Array(outputBuffer), {
          headers: {
            "Content-Type": outputType,
            "Cache-Control": "public, max-age=31536000, immutable",
          },
        });
      }

      return new NextResponse(new Uint8Array(fileBuffer), {
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=31536000, immutable", // Кешируем на год
        },
      });
    } catch (error) {
      console.error("File not found:", filePath);
      return new NextResponse("File not found", { status: 404 });
    }
  } catch (error) {
    console.error("Error serving file:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
