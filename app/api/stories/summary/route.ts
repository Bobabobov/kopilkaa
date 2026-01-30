import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const result = await prisma.application.aggregate({
      where: { status: "APPROVED" },
      _sum: { amount: true },
    });

    return new Response(
      JSON.stringify({ totalPaid: result._sum.amount ?? 0 }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (error) {
    console.error("Error fetching stories summary:", error);
    return new Response(JSON.stringify({ totalPaid: 0 }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
    });
  }
}
