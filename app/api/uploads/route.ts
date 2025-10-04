// app/api/uploads/route.ts
import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join, extname } from "path";
import { randomUUID } from "crypto";
import { getSession } from "@/lib/auth";

const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ADMIN_MAX_SIZE = 20 * 1024 * 1024; // 20MB для админов
const UPLOAD_DIR = join(process.cwd(), "uploads");

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
        return NextResponse.json({ error: `Файл ${file.name} больше ${maxSizeMB} МБ` }, { status: 400 });
      }
    }

    // Проверяем типы файлов
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json({ error: `Неподдерживаемый тип файла: ${file.type}` }, { status: 400 });
      }
    }

    await mkdir(UPLOAD_DIR, { recursive: true });

    const uploadedFiles = [];

    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const ext = extname(file.name || "").toLowerCase() || ".jpg";
      const id = randomUUID().replace(/-/g, "");
      const filename = `${id}${ext}`;
      const filepath = join(UPLOAD_DIR, filename);
      
      await writeFile(filepath, uint8Array);
      
      const url = `/api/uploads/${filename}`;
      uploadedFiles.push({ url, filename });
    }

    return NextResponse.json({ files: uploadedFiles });
  } catch (error) {
    console.error("Error uploading files:", error);
    return NextResponse.json({ error: "Ошибка загрузки файлов" }, { status: 500 });
  }
}