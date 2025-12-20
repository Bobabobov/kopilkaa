// app/api/ad-requests/upload/route.ts
// Публичный endpoint для загрузки изображений при создании заявки на рекламу
import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join, extname } from "path";
import { randomUUID } from "crypto";
import { getUploadDir, getUploadFilePath } from "@/lib/uploads/paths";

const MAX_SIZE = 5 * 1024 * 1024; // 5MB для публичных загрузок
const MAX_FILES = 5; // Максимум файлов за раз

// POST /api/ad-requests/upload - загрузить файлы (публичный)
export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const files = form.getAll("files") as File[];

    if (!files.length) {
      return NextResponse.json({ error: "Файлы не переданы" }, { status: 400 });
    }

    if (files.length > MAX_FILES) {
      return NextResponse.json(
        { error: `Можно загрузить до ${MAX_FILES} файлов за раз` },
        { status: 400 }
      );
    }

    // Проверяем размер каждого файла
    for (const file of files) {
      if (file.size > MAX_SIZE) {
        const maxSizeMB = Math.round(MAX_SIZE / (1024 * 1024));
        return NextResponse.json(
          { error: `Файл ${file.name} больше ${maxSizeMB} МБ` },
          { status: 400 }
        );
      }
    }

    // Проверяем типы файлов
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { error: `Неподдерживаемый тип файла: ${file.type}` },
          { status: 400 }
        );
      }
    }

    const UPLOAD_DIR = getUploadDir();
    await mkdir(UPLOAD_DIR, { recursive: true });

    const uploadedFiles = [];

    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const ext = extname(file.name || "").toLowerCase() || ".jpg";
      const id = randomUUID().replace(/-/g, "");
      const filename = `ad_request_${id}${ext}`;
      const filepath = getUploadFilePath(filename);

      await writeFile(filepath, buffer);

      const url = `/api/uploads/${filename}`;
      uploadedFiles.push({ url, filename });
    }

    return NextResponse.json({ files: uploadedFiles });
  } catch (error) {
    console.error("Error uploading ad request files:", error);
    return NextResponse.json(
      { error: "Ошибка загрузки файлов" },
      { status: 500 }
    );
  }
}


