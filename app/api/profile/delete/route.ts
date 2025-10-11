import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function DELETE() {
  try {
    const session = await getSession();
    if (!session)
      return Response.json({ error: "Unauthorized" }, { status: 401 });

    const userId = session.uid;

    // Удаляем пользователя (каскадное удаление удалит все связанные данные)
    await prisma.user.delete({
      where: { id: userId },
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error deleting account:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}



