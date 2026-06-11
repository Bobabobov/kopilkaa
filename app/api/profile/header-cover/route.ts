import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { randomUUID } from "crypto";
import { writeFile, mkdir } from "fs/promises";
import { extname } from "path";
import { getUploadDir, getUploadFilePath } from "@/lib/uploads/paths";
import { logRouteCatchError } from "@/lib/api/parseApiError";
import { ACHIEVEMENT_SLUGS } from "@/lib/achievements/definitions";
import { checkAndUnlockAchievement } from "@/lib/achievements/unlock";

export const runtime = "nodejs";
export const maxDuration = 30;

const MAX_SIZE = 8 * 1024 * 1024;
const ADMIN_MAX_SIZE = 20 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export async function POST(req: NextRequest) {
  const session = await getAuthUser(req);
  if (!session) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  try {
    const form = await req.formData();
    const file = form.get("cover") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Файл не передан" }, { status: 400 });
    }

    const maxSize = session.role === "ADMIN" ? ADMIN_MAX_SIZE : MAX_SIZE;
    if (file.size > maxSize) {
      const maxSizeMB = Math.round(maxSize / (1024 * 1024));
      return NextResponse.json(
        { error: `Файл больше ${maxSizeMB} МБ` },
        { status: 400 },
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Допустимы JPG, PNG или WebP" },
        { status: 400 },
      );
    }

    const uploadDir = getUploadDir();
    await mkdir(uploadDir, { recursive: true });

    const buf = Buffer.from(await file.arrayBuffer());
    const ext = extname(file.name || "").toLowerCase() || ".jpg";
    const id = randomUUID().replace(/-/g, "");
    const filename = `cover_${session.uid}_${id}${ext}`;
    const filepath = getUploadFilePath(filename);

    await writeFile(filepath, buf);

    const coverUrl = `/api/uploads/${filename}`;

    await prisma.user.update({
      where: { id: session.uid },
      data: {
        headerCover: coverUrl,
        headerThemeUpdatedAt: new Date(),
      },
    });

    checkAndUnlockAchievement(
      session.uid,
      ACHIEVEMENT_SLUGS.PROFILE_STYLE,
    ).catch((error) => {
      logRouteCatchError(
        "POST /api/profile/header-cover profile-style achievement:",
        error,
      );
    });

    return NextResponse.json({
      success: true,
      headerCover: coverUrl,
      message: "Обложка загружена",
    });
  } catch (error) {
    logRouteCatchError("POST /api/profile/header-cover:", error);
    return NextResponse.json(
      { error: "Не удалось загрузить обложку" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getAuthUser(req);
  if (!session) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  try {
    await prisma.user.update({
      where: { id: session.uid },
      data: {
        headerCover: null,
        headerThemeUpdatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      headerCover: null,
      message: "Своя обложка удалена",
    });
  } catch (error) {
    logRouteCatchError("DELETE /api/profile/header-cover:", error);
    return NextResponse.json(
      { error: "Не удалось удалить обложку" },
      { status: 500 },
    );
  }
}
