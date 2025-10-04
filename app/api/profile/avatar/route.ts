// app/api/profile/avatar/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { randomUUID } from "crypto";
import { writeFile, mkdir } from "fs/promises";
import { join, extname } from "path";

export const runtime = "nodejs";

const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ADMIN_MAX_SIZE = 20 * 1024 * 1024; // 20MB для админов
const UPLOAD_DIR = join(process.cwd(), "uploads");

// POST /api/profile/avatar - загрузить аватарку
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  try {
    const form = await req.formData();
    const file = form.get("avatar") as File;

    if (!file) {
      return NextResponse.json({ error: "Файл не передан" }, { status: 400 });
    }

    // Администратор может загружать файлы большего размера
    const maxSize = session.role === "ADMIN" ? ADMIN_MAX_SIZE : MAX_SIZE;
    if (file.size > maxSize) {
      const maxSizeMB = Math.round(maxSize / (1024 * 1024));
      return NextResponse.json({ error: `Файл больше ${maxSizeMB} МБ` }, { status: 400 });
    }

    // Проверяем тип файла
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Неподдерживаемый тип файла" }, { status: 400 });
    }

    await mkdir(UPLOAD_DIR, { recursive: true });

    const buf = Buffer.from(await file.arrayBuffer());
    const ext = extname(file.name || "").toLowerCase() || ".jpg";
    const id = randomUUID().replace(/-/g, "");
    const filename = `avatar_${session.uid}_${id}${ext}`;
    const filepath = join(UPLOAD_DIR, filename);
    
    await writeFile(filepath, buf);

    const avatarUrl = `/api/uploads/${filename}`;

    // Обновляем аватарку в базе данных
    await prisma.user.update({
      where: { id: session.uid },
      data: { avatar: avatarUrl }
    });

    return NextResponse.json({ 
      ok: true, 
      avatar: avatarUrl,
      message: "Аватарка успешно загружена"
    });

  } catch (error) {
    console.error("Error uploading avatar:", error);
    return NextResponse.json({ 
      error: "Ошибка загрузки аватарки", 
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}

// DELETE /api/profile/avatar - удалить аватарку
export async function DELETE() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  try {
    // Удаляем аватарку из базы данных
    await prisma.user.update({
      where: { id: session.uid },
      data: { avatar: null }
    });

    return NextResponse.json({ 
      ok: true,
      message: "Аватарка удалена"
    });

  } catch (error) {
    console.error("Error deleting avatar:", error);
    return NextResponse.json({ error: "Ошибка удаления аватарки" }, { status: 500 });
  }
}
