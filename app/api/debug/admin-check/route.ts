// app/api/debug/admin-check/route.ts
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    // Проверяем сессию
    const session = await getSession();
    console.log("Session:", session);
    
    // Проверяем пользователей с ролью ADMIN
    const adminUsers = await prisma.user.findMany({
      where: { role: "ADMIN" },
      select: { id: true, email: true, role: true, name: true }
    });
    
    // Проверяем общее количество пользователей
    const totalUsers = await prisma.user.count();
    
    return Response.json({
      session,
      adminUsers,
      totalUsers,
      hasAdmin: adminUsers.length > 0,
      isAdmin: session?.role === "ADMIN"
    });
  } catch (error) {
    console.error("Admin check error:", error);
    return Response.json({ 
      error: "Failed to check admin status", 
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
