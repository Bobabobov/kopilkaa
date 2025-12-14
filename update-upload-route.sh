#!/bin/bash

# Скрипт для обновления route.ts на сервере

cat > /opt/kopilkaa/app/api/uploads/\[filename\]/route.ts << 'EOF'
// app/api/uploads/[filename]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { readFile, access, stat } from "fs/promises";
import { constants } from "fs";
import { getUploadDir, getUploadFilePath } from "@/lib/uploads/paths";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> },
) {
  try {
    const { filename } = await params;

    // Проверяем безопасность имени файла
    if (
      !filename ||
      filename.includes("..") ||
      filename.includes("/") ||
      filename.includes("\\")
    ) {
      console.error("Invalid filename:", filename);
      return new NextResponse("Invalid filename", { status: 400 });
    }

    const filePath = getUploadFilePath(filename);
    const UPLOAD_DIR = getUploadDir();

    try {
      // Проверяем существование файла
      await access(filePath, constants.F_OK);
      
      // Проверяем, что это файл, а не директория
      const fileStat = await stat(filePath);
      if (!fileStat.isFile()) {
        console.error("Path is not a file:", filePath);
        return new NextResponse("Not a file", { status: 400 });
      }
      
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
      }

      return new NextResponse(new Uint8Array(fileBuffer), {
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=31536000", // Кешируем на год
        },
      });
    } catch (error: any) {
      // Если файл не найден - это нормально (файл мог быть удален)
      // Логируем только если это не ENOENT (файл не найден)
      if (error?.code !== "ENOENT") {
        console.error("Error accessing file:", {
          filename,
          error: error?.message || String(error),
          errorCode: error?.code,
        });
      }
      
      // Просто возвращаем 404 без подробностей
      return new NextResponse("File not found", { status: 404 });
    }
  } catch (error: any) {
    console.error("Error serving file:", {
      error: error?.message || String(error),
      stack: error?.stack,
    });
    return new NextResponse("Internal server error", { status: 500 });
  }
}
EOF

echo "Файл обновлен. Теперь пересоберите приложение:"
echo "cd /opt/kopilkaa && rm -rf .next && npm run build && npm run start"

