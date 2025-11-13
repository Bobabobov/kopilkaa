// app/api/profile/applications/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.uid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');

    let applications = [];
    
    try {
      applications = await prisma.application.findMany({
        where: {
          userId: session.uid,
        },
        select: {
          id: true,
          title: true,
          description: true,
          status: true,
          amount: true,
          createdAt: true,
          images: {
            select: {
              url: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: limit,
      });
    } catch (dbError) {
      console.warn("Database error in applications API, returning empty array:", dbError);
      applications = [];
    }

    const formattedApplications = applications.map(app => ({
      ...app,
      images: app.images ? app.images.map(img => img.url) : [],
    }));

    return NextResponse.json(
      { applications: formattedApplications },
      {
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "Pragma": "no-cache",
          "Expires": "0",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching user applications:", error);
    // Возвращаем пустой массив вместо ошибки
    return NextResponse.json(
      { applications: [] },
      {
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "Pragma": "no-cache",
          "Expires": "0",
        },
      }
    );
  }
}
