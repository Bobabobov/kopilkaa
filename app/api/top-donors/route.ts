// app/api/top-donors/route.ts
import { NextResponse } from "next/server";
import { getTopDonors } from "@/lib/donations/getTopDonors";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const donors = await getTopDonors(3);

    return NextResponse.json(
      { success: true, donors },
      {
        headers: {
          "Cache-Control":
            "public, max-age=30, s-maxage=30, stale-while-revalidate=60",
        },
      },
    );
  } catch (error) {
    console.error("Error fetching top donors:", error);
    return NextResponse.json({
      success: true,
      donors: [],
    });
  }
}
