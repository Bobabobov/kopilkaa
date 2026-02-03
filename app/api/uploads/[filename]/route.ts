// app/api/uploads/[filename]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getUploadFilePath(filename: string): string {
  const uploadDir =
    process.env.UPLOAD_DIR ?? join(process.cwd(), "uploads");
  return join(uploadDir, filename);
}

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } },
) {
  try {
    const { filename } = params;

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

      return new NextResponse(new Uint8Array(fileBuffer), {
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=31536000", // Кешируем на год
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
