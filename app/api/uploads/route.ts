// app/api/uploads/route.ts
import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { extname } from "path";
import { randomUUID } from "crypto";
import { getSession } from "@/lib/auth";
import { getUploadDir, getUploadFilePath } from "@/lib/uploads/paths";

const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ADMIN_MAX_SIZE = 20 * 1024 * 1024; // 20MB для админов

// POST /api/uploads - загрузить файлы
export async function POST(req: NextRequest) {
  const session = await getSession();
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
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "video/mp4",
      "video/webm",
    ];
    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { error: `Неподдерживаемый тип файла: ${file.type}` },
          { status: 400 },
        );
      }
    }

    const UPLOAD_DIR = getUploadDir();
    await mkdir(UPLOAD_DIR, { recursive: true });

    const uploadedFiles = [];

    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const mimeToExt: Record<string, string> = {
        "image/jpeg": ".jpg",
        "image/png": ".png",
        "image/gif": ".gif",
        "image/webp": ".webp",
        "video/mp4": ".mp4",
        "video/webm": ".webm",
      };
      const ext =
        mimeToExt[file.type] ||
        extname(file.name || "").toLowerCase() ||
        ".bin";
      const id = randomUUID().replace(/-/g, "");
      const filename = `${id}${ext}`;
      const filepath = getUploadFilePath(filename);

      await writeFile(filepath, buffer);

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
