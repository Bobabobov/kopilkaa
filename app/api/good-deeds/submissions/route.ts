import { NextRequest, NextResponse } from "next/server";
import { GoodDeedSubmissionStatus } from "@prisma/client";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getGoodDeedCycleKey, getManagedTaskById } from "@/lib/goodDeedTasksAdmin";
import {
  getWeekInfo,
  inferMediaTypeFromUrl,
  isSafeUploadUrl,
  MAX_GOOD_DEED_STORY_CHARS,
  MIN_GOOD_DEED_STORY_CHARS,
} from "@/lib/goodDeeds";
import { logRouteCatchError } from "@/lib/api/parseApiError";

const MAX_MEDIA = 5;
const MIN_MEDIA = 1;

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const session = await getAuthUser(req);
  if (!session?.uid) {
    return NextResponse.json(
      { error: "Требуется авторизация" },
      { status: 401 },
    );
  }

  try {
    const body = await req.json();
    const taskId = String(body?.taskId || "").trim();
    const storyRaw =
      typeof body?.storyText === "string"
        ? body.storyText
        : typeof body?.story === "string"
          ? body.story
          : "";
    const storyText = storyRaw.trim().slice(0, MAX_GOOD_DEED_STORY_CHARS);

    const mediaUrls = Array.isArray(body?.mediaUrls)
      ? (body.mediaUrls as string[])
      : [];

    if (!taskId) {
      return NextResponse.json(
        { error: "Не указано задание" },
        { status: 400 },
      );
    }

    if (storyText.length < MIN_GOOD_DEED_STORY_CHARS) {
      return NextResponse.json(
        {
          error: `Расскажите о выполнении не короче ${MIN_GOOD_DEED_STORY_CHARS} символов`,
          minChars: MIN_GOOD_DEED_STORY_CHARS,
        },
        { status: 400 },
      );
    }

    if (mediaUrls.length < MIN_MEDIA) {
      return NextResponse.json(
        { error: "Добавьте хотя бы одно фото или видео" },
        { status: 400 },
      );
    }

    if (mediaUrls.length > MAX_MEDIA) {
      return NextResponse.json(
        { error: `Можно прикрепить не более ${MAX_MEDIA} файлов` },
        { status: 400 },
      );
    }

    const week = getWeekInfo(new Date());
    const cycleKey = await getGoodDeedCycleKey(week.key);
    const task = await getManagedTaskById(taskId);
    if (!task) {
      return NextResponse.json(
        { error: "Это задание недоступно на текущей неделе" },
        { status: 400 },
      );
    }
    if (!task.isActive) {
      return NextResponse.json(
        { error: "Это задание сейчас отключено администратором" },
        { status: 409 },
      );
    }

    const sanitizedMedia = mediaUrls
      .map((url) => String(url || "").trim())
      .filter(Boolean);

    for (const url of sanitizedMedia) {
      if (!isSafeUploadUrl(url)) {
        return NextResponse.json(
          { error: "Разрешены только файлы, загруженные через форму" },
          { status: 400 },
        );
      }
    }

    const existing = await prisma.goodDeedSubmission.findUnique({
      where: {
        userId_weekKey_taskKey: {
          userId: session.uid,
          weekKey: cycleKey,
          taskKey: task.id,
        },
      },
      select: { id: true, status: true },
    });

    const approvedSubmissions = await prisma.goodDeedSubmission.findMany({
      where: {
        userId: session.uid,
        status: GoodDeedSubmissionStatus.APPROVED,
      },
      select: { taskKey: true },
    });

    const alreadyApprovedThisTask = approvedSubmissions.some(
      (submission) => submission.taskKey === task.id,
    );
    if (alreadyApprovedThisTask) {
      return NextResponse.json(
        { error: "Это задание уже было одобрено ранее" },
        { status: 409 },
      );
    }

    if (existing?.status === GoodDeedSubmissionStatus.PENDING) {
      return NextResponse.json(
        { error: "Это задание уже отправлено на проверку" },
        { status: 409 },
      );
    }

    if (existing?.status === GoodDeedSubmissionStatus.APPROVED) {
      return NextResponse.json(
        { error: "Это задание уже одобрено" },
        { status: 409 },
      );
    }

    const payloadMedia = sanitizedMedia.map((url, index) => ({
      url,
      type: inferMediaTypeFromUrl(url),
      sort: index,
    }));

    if (existing?.id) {
      await prisma.$transaction(async (tx) => {
        await tx.goodDeedSubmissionMedia.deleteMany({
          where: { submissionId: existing.id },
        });

        await tx.goodDeedSubmission.update({
          where: { id: existing.id },
          data: {
            status: GoodDeedSubmissionStatus.PENDING,
            adminComment: null,
            reviewedAt: null,
            reviewedById: null,
            storyText,
            media: {
              create: payloadMedia,
            },
          },
        });
      });
    } else {
      await prisma.goodDeedSubmission.create({
        data: {
          userId: session.uid,
          taskKey: task.id,
          taskTitle: task.title,
          taskDescription: task.description,
          weekKey: cycleKey,
          reward: task.reward,
          storyText,
          status: GoodDeedSubmissionStatus.PENDING,
          media: {
            create: payloadMedia,
          },
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    logRouteCatchError("POST /api/good-deeds/submissions error:", error);
    return NextResponse.json(
      { error: "Не удалось отправить задание на модерацию" },
      { status: 500 },
    );
  }
}
