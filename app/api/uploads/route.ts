// app/api/uploads/route.ts
import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { extname } from "path";
import { randomUUID } from "crypto";
import sharp from "sharp";
import { getAuthUser } from "@/lib/auth";
import { getUploadDir, getUploadFilePath } from "@/lib/uploads/paths";

const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ADMIN_MAX_SIZE = 20 * 1024 * 1024; // 20MB для админов

const IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

/** Расширение имени файла → MIME (когда браузер прислал пустой или неверный type). */
function inferMimeFromFilename(filename: string): string | null {
  const lower = filename.toLowerCase();
  const dot = lower.lastIndexOf(".");
  if (dot < 0) return null;
  const ext = lower.slice(dot + 1);
  const map: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
    gif: "image/gif",
    heic: "image/heic",
    heif: "image/heif",
    mp4: "video/mp4",
    webm: "video/webm",
  };
  return map[ext] ?? null;
}

/**
 * Нормализует MIME с учётом мобильных браузеров (пустой type, image/jpg, octet-stream + расширение).
 */
function normalizeUploadMime(rawType: string, filename: string): string | null {
  const t = rawType.trim().toLowerCase();
  if (t === "image/jpg" || t === "image/pjpeg") return "image/jpeg";
  if (
    t &&
    t !== "application/octet-stream" &&
    t !== "application/x-www-form-urlencoded"
  ) {
    return t;
  }
  return inferMimeFromFilename(filename);
}

const VARIANT_SIZES: Record<string, number> = {
  thumb: 360,
  medium: 960,
  full: 2000,
};

const OUTPUT_FORMATS = ["jpeg", "webp", "avif"] as const;

const buildVariantFilename = (base: string, variant: string, format: string) =>
  `${base}__${variant}.${format}`;

// POST /api/uploads - загрузить файлы
export async function POST(req: NextRequest) {
  const session = await getAuthUser(req);
  if (!session) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  try {
    const form = await req.formData();
    const files = form.getAll("files") as File[];

    if (!files.length) {
      return NextResponse.json({ error: "Файлы не переданы" }, { status: 400 });
    }

    // Администратор может загружать файлы большего размера
    const maxSize = session.role === "ADMIN" ? ADMIN_MAX_SIZE : MAX_SIZE;

    // Проверяем размер каждого файла
    for (const file of files) {
      if (file.size > maxSize) {
        const maxSizeMB = Math.round(maxSize / (1024 * 1024));
        return NextResponse.json(
          { error: `Файл ${file.name} больше ${maxSizeMB} МБ` },
          { status: 400 },
        );
      }
    }

    // Проверяем типы файлов (картинки + видео для TopBanner)
    const allowedTypes = new Set([
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/heic",
      "image/heif",
      "video/mp4",
      "video/webm",
    ]);

    const normalizedTypes: string[] = [];
    for (const file of files) {
      const normalized = normalizeUploadMime(file.type || "", file.name || "");
      if (!normalized || !allowedTypes.has(normalized)) {
        const hint =
          file.type || "не указан";
        return NextResponse.json(
          {
            error: `Неподдерживаемый тип файла (${hint}). Загрузите JPEG, PNG, WebP или видео MP4/WebM.`,
          },
          { status: 400 },
        );
      }
      normalizedTypes.push(normalized);
    }

    const UPLOAD_DIR = getUploadDir();
    await mkdir(UPLOAD_DIR, { recursive: true });

    const uploadedFiles = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      let effectiveType = normalizedTypes[i];
      const arrayBuffer = await file.arrayBuffer();
      let buffer = Buffer.from(arrayBuffer);

      // HEIC/HEIF → JPEG: иначе часть браузеров не покажет файл по URL + стабильнее для sharp.
      if (effectiveType === "image/heic" || effectiveType === "image/heif") {
        try {
          const jpegBuf = await sharp(buffer)
            .rotate()
            .jpeg({ quality: 90 })
            .toBuffer();
          buffer = Buffer.from(jpegBuf);
          effectiveType = "image/jpeg";
        } catch (heicErr) {
          console.error("HEIC conversion failed:", heicErr);
          return NextResponse.json(
            {
              error:
                "Не удалось обработать фото HEIC/HEIF. Откройте снимок в галерее, экспортируйте как JPEG и загрузите снова.",
            },
            { status: 400 },
          );
        }
      }

      const mimeToExt: Record<string, string> = {
        "image/jpeg": ".jpg",
        "image/png": ".png",
        "image/gif": ".gif",
        "image/webp": ".webp",
        "video/mp4": ".mp4",
        "video/webm": ".webm",
      };
      const ext =
        mimeToExt[effectiveType] ||
        extname(file.name || "").toLowerCase() ||
        ".bin";
      const id = randomUUID().replace(/-/g, "");
      const filename = `${id}${ext}`;
      const base = filename.replace(ext, "");
      const filepath = getUploadFilePath(filename);

      await writeFile(filepath, buffer);

      // Предгенерация вариантов для изображений (thumb/medium/full + webp/avif)
      if (IMAGE_TYPES.has(effectiveType)) {
        const formats =
          effectiveType === "image/png"
            ? (["png", ...OUTPUT_FORMATS] as const)
            : OUTPUT_FORMATS;

        try {
          for (const [variant, width] of Object.entries(VARIANT_SIZES)) {
            for (const format of formats) {
              const transformer = sharp(buffer).rotate().resize({
                width,
                height: undefined,
                fit: "inside",
                withoutEnlargement: true,
              });

              let out: Buffer;
              if (format === "webp") {
                out = await transformer.webp({ quality: 80 }).toBuffer();
              } else if (format === "avif") {
                out = await transformer.avif({ quality: 60 }).toBuffer();
              } else if (format === "png") {
                out = await transformer.png({ compressionLevel: 8 }).toBuffer();
              } else {
                out = await transformer.jpeg({ quality: 82 }).toBuffer();
              }

              const variantFilename = buildVariantFilename(base, variant, format);
              const variantPath = getUploadFilePath(variantFilename);
              await writeFile(variantPath, out);
            }
          }
        } catch (variantErr) {
          // Оригинал уже сохранён — не роняем загрузку из‑за экзотического JPEG/цветового профиля и т.п.
          console.error(
            "Image variant generation failed (original kept):",
            variantErr,
          );
        }
      }

      const url = `/api/uploads/${filename}`;
      uploadedFiles.push({ url, filename });
    }

    return NextResponse.json({ files: uploadedFiles });
  } catch (error) {
    console.error("Error uploading files:", error);
    return NextResponse.json(
      { error: "Ошибка загрузки файлов" },
      { status: 500 },
    );
  }
}
