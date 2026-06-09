// app/api/applications/recent/route.ts
import { getRecentApplications } from "@/lib/applications/getRecentApplications";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = Math.min(
      10,
      Math.max(1, Number(searchParams.get("limit") || 3)),
    );

    const applications = await getRecentApplications(limit);

    return Response.json({
      success: true,
      applications,
    });
  } catch (error) {
    console.error("Ошибка при получении последних заявок:", error);
    return Response.json({
      success: true,
      applications: [],
    });
  }
}
